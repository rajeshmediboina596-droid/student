import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const profile = await db.studentProfile.findUnique({ where: { userId: session.user.id } });
    const user = await db.user.findFirst({ where: { id: session.user.id } });

    return NextResponse.json({
        ...session.user,
        profile,
        twoFactorEnabled: user?.twoFactorEnabled || false
    });
}

export async function PATCH(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { phone, address, dob } = body;

        let profile = await db.studentProfile.findUnique({ where: { userId: session.user.id } });

        if (profile) {
            profile = await db.studentProfile.update({
                where: { userId: session.user.id },
                data: { phone, address, dob }
            });
        } else {
            profile = await db.studentProfile.create({
                data: { userId: session.user.id, phone, address, dob, course: 'Computer Science', batch: '2024' }
            });
        }

        return NextResponse.json(profile);
    } catch (_error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
