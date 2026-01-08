import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
    const session = await getSession();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'teacher')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const users = await db.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, email, password, role } = await request.json();

        // Check if user exists
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
                twoFactorEnabled: false
            }
        });

        // If student, create profile
        if (role === 'student') {
            await db.studentProfile.create({
                data: {
                    userId: newUser.id,
                    course: 'General',
                    batch: '2025'
                }
            });
        }

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
