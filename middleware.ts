import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth';

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const { pathname } = request.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check role-based access
        const role = session.user.role;
        if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
        }
        if (pathname.startsWith('/dashboard/teacher') && role !== 'teacher' && role !== 'admin') {
            return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
        }
    }

    // Redirect from login if already logged in
    if (pathname === '/login' && session) {
        return NextResponse.redirect(new URL(`/dashboard/${session.user.role}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
