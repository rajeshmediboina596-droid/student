import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { db } from '@/lib/db';
import {
    ShieldAlert,
    Settings,
    UserPlus,
    Database,
    Users,
    Sparkles,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import UserRegistry from '@/components/UserRegistry';
import Footer from '@/components/Footer';

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session) redirect('/login');

    const allUsers = await db.user.findMany();
    const teachers = allUsers.filter((u: any) => u.role === 'teacher').length;
    const students = allUsers.filter((u: any) => u.role === 'student').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 flex">
            <Sidebar role="admin" userName={session.user.name} />

            <main className="ml-72 flex-grow p-10 animate-slide-up">
                {/* Header */}
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            <Shield size={12} />
                            Internal Administration
                        </div>
                        <h1 className="text-4xl font-black text-slate-800">System Overview</h1>
                        <p className="text-slate-500 font-medium mt-2">Manage global users, security and system integrity.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/admin/settings"
                            className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <Settings size={18} />
                            System Settings
                        </Link>
                        <Link
                            href="/dashboard/admin/users"
                            className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-rose-600 hover:to-orange-600 text-white px-5 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 transition-all duration-300 shadow-lg hover:shadow-rose-200 hover:-translate-y-0.5 active:scale-[0.98] btn-shine overflow-hidden"
                        >
                            <UserPlus size={18} />
                            Add New User
                        </Link>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-slide-up delay-100">
                    <Card
                        title="Total Users"
                        value={allUsers.length}
                        icon={Users}
                        description="Active accounts in system"
                    />
                    <Card
                        title="Faculty"
                        value={teachers}
                        icon={ShieldAlert}
                        description="Academic staff members"
                    />
                    <Card
                        title="Students"
                        value={students}
                        icon={Database}
                        description="Enrolled learners"
                    />
                    <Card
                        title="DB Status"
                        value="Active"
                        icon={Database}
                        description="System performance: Optimal"
                    />
                </section>

                {/* User Registry */}
                <div className="animate-slide-up delay-200">
                    <UserRegistry initialUsers={allUsers} />
                </div>

                <Footer />
            </main>
        </div>
    );
}

