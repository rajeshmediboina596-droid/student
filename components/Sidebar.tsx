'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart3,
    Users,
    BookOpen,
    LogOut,
    UserCircle,
    ClipboardList,
    FileText,
    ShieldCheck
} from 'lucide-react';

interface SidebarProps {
    role: 'admin' | 'teacher' | 'student';
    userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const navItems = {
        admin: [
            { name: 'Overview', href: '/dashboard/admin', icon: BarChart3 },
            { name: 'Users', href: '/dashboard/admin/users', icon: Users },
            { name: 'Reports', href: '/dashboard/admin/reports', icon: ShieldCheck },
        ],
        teacher: [
            { name: 'Dashboard', href: '/dashboard/teacher', icon: BarChart3 },
            { name: 'Attendance', href: '/dashboard/teacher/attendance', icon: ClipboardList },
            { name: 'Marks', href: '/dashboard/teacher/marks', icon: FileText },
            { name: 'Materials', href: '/dashboard/teacher/materials', icon: BookOpen },
        ],
        student: [
            { name: 'My Dashboard', href: '/dashboard/student', icon: BarChart3 },
            { name: 'Attendance', href: '/dashboard/student/attendance', icon: ClipboardList },
            { name: 'My Grades', href: '/dashboard/student/results', icon: FileText },
            { name: 'Skills', href: '/dashboard/student/materials', icon: BookOpen },
        ],
    };

    const items = navItems[role];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col z-50 animate-slide-up">
            <div className="p-8">
                <h1 className="text-2xl font-black text-blue-600 tracking-tighter italic">SMS PRO</h1>
            </div>

            <nav className="flex-grow px-4 space-y-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                                }`}
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-3 px-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {userName.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 truncate w-32">{userName}</p>
                        <p className="text-xs font-medium text-slate-400 capitalize">{role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
