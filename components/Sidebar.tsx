'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart3,
    Users,
    BookOpen,
    LogOut,
    ClipboardList,
    FileText,
    ShieldCheck,
    Sparkles,
    Settings
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
            { name: 'Settings', href: '/dashboard/student/settings', icon: Settings },
        ],
    };

    const items = navItems[role];

    const roleColors = {
        admin: { gradient: 'from-rose-500 to-orange-500', accent: 'rose', bg: 'rose-50' },
        teacher: { gradient: 'from-indigo-500 to-purple-500', accent: 'indigo', bg: 'indigo-50' },
        student: { gradient: 'from-blue-500 to-cyan-500', accent: 'blue', bg: 'blue-50' },
    };

    const colors = roleColors[role];

    return (
        <aside className="w-72 h-screen fixed left-0 top-0 bg-gradient-to-b from-white via-white to-slate-50 border-r border-slate-100 flex flex-col z-50 animate-slide-up">
            {/* Decorative top gradient bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient}`} />

            {/* Logo Section */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">
                            SMS <span className="gradient-text">PRO</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {role} portal
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-4 space-y-1.5">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden ${isActive
                                ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Hover shine effect */}
                            {!isActive && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                </div>
                            )}

                            <div className={`relative z-10 transition-transform duration-300 ${!isActive ? 'group-hover:scale-110 group-hover:rotate-3' : ''}`}>
                                <Icon size={20} />
                            </div>
                            <span className="relative z-10">{item.name}</span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-5 mx-4 mb-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    {/* Avatar with gradient ring */}
                    <div className={`relative`}>
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-full animate-spin-slow opacity-50`} style={{ padding: '2px' }} />
                        <div className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">{userName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest capitalize">{role}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 font-bold hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-100"
                >
                    <LogOut size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
