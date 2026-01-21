import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();
    if (!session || session.user.role !== 'student') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const profile = await db.studentProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!profile) {
            return NextResponse.json([], { status: 200 });
        }

        const attendance = await db.attendance.findMany({
            where: { studentId: profile.id }
        });

        return NextResponse.json(attendance);
    } catch (_error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
