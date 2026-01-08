import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { db } from '@/lib/db';
import {
    Users,
    Calendar,
    Award,
    Activity,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

import { redirect } from 'next/navigation';

export default async function StudentDashboard() {
    const session = await getSession();
    if (!session) redirect('/login');

    const profile = await db.studentProfile.findUnique({ where: { userId: session.user.id } });

    // Mock calculations for stats
    const attendance = await db.attendance.findMany({ where: { studentId: profile?.id } });
    const results = await db.result.findMany({ where: { studentId: profile?.id } });

    const attendancePercent = attendance.length > 0
        ? Math.round((attendance.filter(a => a.status === 'PRESENT').length / attendance.length) * 100)
        : 0;

    const gpa = results.length > 0
        ? (results.reduce((acc, r) => acc + (r.marks / r.maxMarks), 0) / results.length * 10).toFixed(2)
        : "N/A";

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="student" userName={session.user.name} />

            <main className="ml-64 flex-grow p-10">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Student Portal</h2>
                        <h1 className="text-4xl font-black text-slate-800">Hello, {session.user.name.split(' ')[0]}! 👋</h1>
                        <p className="text-slate-500 font-medium mt-1">Here's a quick look at your academic progress.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 shadow-sm">
                            Batch: {profile?.batch}
                        </div>
                        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 shadow-sm">
                            {profile?.course}
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <Card
                        title="Attendance"
                        value={`${attendancePercent}%`}
                        icon={Calendar}
                        description="Overall attendance"
                        trend={{ value: 2, isUp: true }}
                    />
                    <Card
                        title="Current GPA"
                        value={gpa}
                        icon={Award}
                        description="Based on recent tests"
                    />
                    <Card
                        title="Subjects"
                        value={results.length}
                        icon={Activity}
                        description="Active course modules"
                    />
                    <Card
                        title="Rank"
                        value="#08"
                        icon={Users}
                        description="Among 45 students"
                    />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Results */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-800">Recent Exam Performance</h3>
                            <Link href="/dashboard/student/results" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                        </div>

                        <div className="space-y-6">
                            {results.slice(0, 4).map((r: any) => (
                                <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                                            {r.subject.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{r.subject}</p>
                                            <p className="text-xs font-bold text-slate-400 capitalize">{r.resultStatus}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-800">{r.marks} / {r.maxMarks}</p>
                                        <div className="w-32 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(r.marks / r.maxMarks) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {results.length === 0 && (
                                <p className="text-center py-10 text-slate-400 font-medium italic">No results found yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Profile Quick View */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 mb-8">Profile Details</h3>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</span>
                                <span className="font-bold text-slate-800">{session.user.email}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</span>
                                <span className="font-bold text-slate-800">{profile?.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Address</span>
                                <span className="font-bold text-slate-800">{profile?.address || 'Not provided'}</span>
                            </div>

                            <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group">
                                Edit Profile
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
