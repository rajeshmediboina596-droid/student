import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const attendance = await db.attendance.findMany();
        return NextResponse.json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
