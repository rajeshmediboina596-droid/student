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
    MoreVertical
} from 'lucide-react';
import Link from 'next/link';

import { redirect } from 'next/navigation';

export default async function TeacherDashboard() {
    const session = await getSession();
    if (!session) redirect('/login');

    const students = await db.user.findMany({ where: { role: 'student' } });
    const materials = await db.material.findMany();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="teacher" userName={session.user.name} />

            <main className="ml-64 flex-grow p-10">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Faculty Portal</h2>
                        <h1 className="text-4xl font-black text-slate-800">Welcome, Professor {session.user.name.split(' ').pop()}</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your students and academic resources.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard/teacher/materials" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                            <PlusCircle size={20} />
                            Upload Material
                        </Link>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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

                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-800">Your Students</h3>
                            <Link href="/dashboard/teacher/attendance" className="text-sm font-bold text-blue-600 hover:underline">Mark Attendance</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="pb-4 pl-4">Student Name</th>
                                        <th className="pb-4">Email</th>
                                        <th className="pb-4">Course</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4 text-right pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {students.map((student: any) => (
                                        <tr key={student.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-5 pl-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                        {student.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <span className="font-bold text-slate-800">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 text-sm font-medium text-slate-500">{student.email}</td>
                                            <td className="py-5 text-sm font-bold text-slate-700">Computer Science</td>
                                            <td className="py-5">
                                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100">Active</span>
                                            </td>
                                            <td className="py-5 text-right pr-4">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {students.length === 0 && (
                                <p className="text-center py-10 text-slate-400 font-medium italic">No students found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
