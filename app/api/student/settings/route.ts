import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { appearance, notificationPreferences } = body;

        const updateData: any = {};
        if (appearance) updateData.appearance = appearance;
        if (notificationPreferences) updateData.notificationPreferences = notificationPreferences;

        const updatedUser = await db.user.update({
            where: { id: session.user.id },
            data: updateData
        });

        // Update session user data in a real app, but for now we rely on client fetching

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
    }
}
