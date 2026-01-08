import Sidebar from '@/components/Sidebar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Award, FileText, CheckCircle, XCircle } from 'lucide-react';

export default async function StudentResultsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const profile = await db.studentProfile.findUnique({ where: { userId: session.user.id } });
    const results = await db.result.findMany({ where: { studentId: profile?.id } });

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="student" userName={session.user.name} />

            <main className="ml-64 flex-grow p-10">
                <header className="mb-12">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Performance</h2>
                    <h1 className="text-4xl font-black text-slate-800">My Grades</h1>
                    <p className="text-slate-500 font-medium mt-1">Summary of your exam results and subject performance.</p>
                </header>

                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Subject</th>
                                <th className="px-8 py-5">Marks</th>
                                <th className="px-8 py-5">Percentage</th>
                                <th className="px-8 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {results.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-800">{r.subject}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-slate-600">{r.marks} / {r.maxMarks}</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-blue-600">
                                        {Math.round((r.marks / r.maxMarks) * 100)}%
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${r.resultStatus === 'PASS' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'
                                            }`}>
                                            {r.resultStatus === 'PASS' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {r.resultStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {results.length === 0 && (
                        <div className="p-20 text-center text-slate-400 font-bold italic">No results released yet.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
