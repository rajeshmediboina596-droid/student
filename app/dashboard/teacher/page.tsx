import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { db } from '@/lib/db';
import {
    Users,
    FileText,
    BookOpen,
    PlusCircle,
    TrendingUp,
    MoreVertical,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { redirect } from 'next/navigation';

export default async function TeacherDashboard() {
    const session = await getSession();
    if (!session) redirect('/login');

    const students = await db.user.findMany({ where: { role: 'student' } });
    const materials = await db.material.findMany();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex">
            <Sidebar role="teacher" userName={session.user.name} />

            <main className="ml-72 flex-grow p-10">
                {/* Header */}
                <header className="mb-10 flex justify-between items-end animate-slide-up">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                            <Sparkles size={12} />
                            Faculty Portal
                        </div>
                        <h1 className="text-4xl font-black text-slate-800">
                            {(() => {
                                const hour = new Date().getHours();
                                const name = session.user.name.split(' ').pop();
                                if (hour < 12) return `Good Morning, Professor ${name}! ☀️`;
                                if (hour < 17) return `Good Afternoon, Professor ${name}! 🌤️`;
                                return `Good Evening, Professor ${name}! 🌙`;
                            })()}
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">Manage your students and academic resources.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/teacher/materials"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:scale-[0.98] btn-shine overflow-hidden"
                        >
                            <PlusCircle size={20} />
                            Upload Material
                        </Link>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-slide-up delay-100">
                    <Card
                        title="Total Students"
                        value={students.length}
                        icon={Users}
                        description="Enrolled in your batches"
                        trend={{ value: 5, isUp: true }}
                    />
                    <Card
                        title="Materials"
                        value={materials.length}
                        icon={BookOpen}
                        description="Shared resources"
                    />
                    <Card
                        title="Pending Marks"
                        value="12"
                        icon={FileText}
                        description="From last week's quiz"
                    />
                    <Card
                        title="Avg. Class Performance"
                        value="78%"
                        icon={TrendingUp}
                        description="Up from last term"
                        trend={{ value: 3.5, isUp: true }}
                    />
                </section>

                {/* Students Table */}
                <div className="bg-white rounded-[36px] p-8 border border-slate-100 shadow-sm animate-slide-up delay-200 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-50" />

                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Users size={18} />
                            </div>
                            Your Students
                        </h3>
                        <Link
                            href="/dashboard/teacher/attendance"
                            className="text-xs font-black text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 transition-all uppercase tracking-widest"
                        >
                            Mark Attendance
                        </Link>
                    </div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="pb-4 pl-4">Student Name</th>
                                    <th className="pb-4">Email</th>
                                    <th className="pb-4">Course</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.map((student: any, index: number) => (
                                    <tr
                                        key={student.id}
                                        className="group hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-300"
                                    >
                                        <td className="py-5 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-black text-xs group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                                    {student.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <span className="font-bold text-slate-800">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 text-sm font-medium text-slate-500">{student.email}</td>
                                        <td className="py-5 text-sm font-bold text-slate-700">Computer Science</td>
                                        <td className="py-5">
                                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100">
                                                Active
                                            </span>
                                        </td>
                                        <td className="py-5 text-right pr-4">
                                            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users size={32} />
                                </div>
                                <p className="text-slate-400 font-bold">No students found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}

