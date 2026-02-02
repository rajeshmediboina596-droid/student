import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const results = await db.result.findMany();
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
