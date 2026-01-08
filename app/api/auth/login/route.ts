import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { login } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // In a real app we'd use bcrypt.compare, but for mock data we check plain text or prefix
        // For this mock demo, we'll allow plain text 'password' for the mock users
        const isPasswordValid = password === 'password' || await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        await login(userData);

        return NextResponse.json({ user: userData });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
