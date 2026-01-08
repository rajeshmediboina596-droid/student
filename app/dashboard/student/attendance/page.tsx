import Sidebar from '@/components/Sidebar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

export default async function StudentAttendancePage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const profile = await db.studentProfile.findUnique({ where: { userId: session.user.id } });
    const attendance = await db.attendance.findMany({ where: { studentId: profile?.id } });

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="student" userName={session.user.name} />

            <main className="ml-64 flex-grow p-10">
                <header className="mb-12">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">My Records</h2>
                    <h1 className="text-4xl font-black text-slate-800">Attendance History</h1>
                    <p className="text-slate-500 font-medium mt-1">Track your daily presence across all sessions.</p>
                </header>

                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-800">Presence Log</h3>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {attendance.map((record) => (
                            <div key={record.id} className="p-8 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${record.status === 'PRESENT' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'
                                        }`}>
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-slate-800">{new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        <p className="text-sm font-bold text-slate-400">Regular Session</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm ${record.status === 'PRESENT' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                    {record.status === 'PRESENT' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                    {record.status}
                                </div>
                            </div>
                        ))}
                        {attendance.length === 0 && (
                            <div className="p-20 text-center text-slate-400 font-bold italic">No attendance records found yet.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
