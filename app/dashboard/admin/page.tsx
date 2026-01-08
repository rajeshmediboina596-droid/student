import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { db } from '@/lib/db';
import {
    ShieldAlert,
    Settings,
    UserPlus,
    Database,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import UserRegistry from '@/components/UserRegistry';

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session) redirect('/login');

    const allUsers = await db.user.findMany();
    const teachers = allUsers.filter((u: any) => u.role === 'teacher').length;
    const students = allUsers.filter((u: any) => u.role === 'student').length;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="admin" userName={session.user.name} />

            <main className="ml-64 flex-grow p-10 animate-slide-up">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-2">Internal Administration</h2>
                        <h1 className="text-4xl font-black text-slate-800">System Overview</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage global users, security and system integrity.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard/admin/settings" className="bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:border-slate-300 transition-all">
                            <Settings size={20} />
                            System Settings
                        </Link>
                        <Link href="/dashboard/admin/users" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg">
                            <UserPlus size={20} />
                            Add New User
                        </Link>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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

                <UserRegistry initialUsers={allUsers} />
            </main>
        </div>
    );
}
