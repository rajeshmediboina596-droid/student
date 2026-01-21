
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await getSession();
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ message: 'Date is required' }, { status: 400 });
    }

    try {
        const attendance = await db.attendance.findMany();

        // Filter in memory for the date
        const dateStr = date;
        const dailyAttendance = attendance.filter((a: any) => a.date?.startsWith(dateStr));

        // We need to map back to User ID.
        // The mock DB `attendance` has `studentId`. `studentId` in mock DB usually refers to `StudentProfile.id`.
        // We need to get all profiles to map profile.id -> profile.userId

        const profiles = await db.studentProfile.findMany();
        const profileToUserMap = profiles.reduce((acc: any, p: any) => {
            acc[p.id] = p.userId;
            return acc;
        }, {});

        const attendanceMap = dailyAttendance.reduce((acc: any, record: any) => {
            const userId = profileToUserMap[record.studentId];
            if (userId) {
                acc[userId] = record.status;
            }
            return acc;
        }, {});

        return NextResponse.json(attendanceMap);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { date, records } = body; // records: { userId: string, status: string }[]

        if (!date || !Array.isArray(records)) {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        // Map User IDs to StudentProfile IDs
        const profiles = await db.studentProfile.findMany();
        const userToProfileMap = profiles.reduce((acc: any, p: any) => {
            acc[p.userId] = p.id;
            return acc;
        }, {});

        // Process each record
        // Since mock DB doesn't have upsert or transactions, we simply push new records.
        // Realistically, we should check if a record exists for that day/student and update it, 
        // OR just delete old ones for that day/student and re-create.
        // Given the simplistic mock DB interface, let's just append for now, or try to be smarter if `db.attendance` exposed update.
        // It only exposes `create` and `findMany`.
        // To avoid duplicates, we'd ideally filter the JSON file content, but `readDb` is internal.
        // LIMITATION: The mock DB 'create' just pushes. We'll duplicate records if we mark again. 
        // FIX: Let's assume for this MVP task that "Submit" is done once or we accept the log nature.
        // BETTER FIX: We can't easily fix the mock DB without modifying `lib/db.ts` to support `attendance.update` or `delete`.

        // Let's modify the loop to just create.

        for (const record of records) {
            const profileId = userToProfileMap[record.userId];
            if (!profileId) continue;

            await db.attendance.upsert({
                where: {
                    studentId: profileId,
                    date: date,
                },
                create: {
                    studentId: profileId,
                    date: date,
                    status: record.status as 'PRESENT' | 'ABSENT'
                },
                update: {
                    status: record.status as 'PRESENT' | 'ABSENT'
                }
            });
        }

        return NextResponse.json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error marking attendance:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
