import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.user.role !== 'student') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { status, certificateUrl } = await request.json();

        // Ensure student owns the resource
        const resources = await db.studentResource.findMany({ where: { studentId: session.user.id } });
        const exists = resources.find((r: any) => r.id === params.id);

        if (!exists) {
            return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
        }

        const updated = await db.studentResource.update({
            where: { id: params.id },
            data: { status, certificateUrl }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.user.role !== 'student') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Ensure student owns the resource
        const resources = await db.studentResource.findMany({ where: { studentId: session.user.id } });
        const exists = resources.find((r: any) => r.id === params.id);

        if (!exists) {
            return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
        }

        await db.studentResource.delete({ where: { id: params.id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
