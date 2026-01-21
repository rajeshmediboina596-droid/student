import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    if (!session || session.user.role !== 'student') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const resources = await db.studentResource.findMany({
        where: { studentId: session.user.id }
    });

    return NextResponse.json(resources);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.user.role !== 'student') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, url, status, category, icon, projects } = await request.json();
        if (!name) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const newResource = await db.studentResource.create({
            data: {
                studentId: session.user.id,
                name,
                url,
                status: status || 'WANT_TO_LEARN',
                category: category || 'Language',
                icon: icon || 'Code',
                projects: projects || []
            }
        });

        return NextResponse.json(newResource, { status: 201 });
    } catch (_error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
