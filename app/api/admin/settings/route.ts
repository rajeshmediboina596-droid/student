import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { twoFactorEnabled, notificationPreferences } = body;

        const updatedUser = await db.user.updateSettings(session.user.id, {
            twoFactorEnabled,
            notificationPreferences
        });

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findFirst({ where: { id: session.user.id } });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        twoFactorEnabled: user.twoFactorEnabled || false,
        notificationPreferences: user.notificationPreferences || {
            emailAlerts: false,
            systemUpdates: false,
            newEnrollments: false
        }
    });
}
