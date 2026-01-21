'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
    Calendar,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Activity,
    Clock
} from 'lucide-react';
import { Attendance } from '@/lib/db';
import Footer from '@/components/Footer';

export default function StudentAttendancePage() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/student/attendance', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                // Sort by date descending for the log
                setAttendance(data.sort((a: Attendance, b: Attendance) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            }
            setUserName("Student");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Analytics calculations
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status.toUpperCase() === 'PRESENT').length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Consistency Graph Data (Last 10 records, sorted by date ascending for graph)
    const graphData = [...attendance]
        .slice(0, 10)
        .reverse();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">
            <Sidebar role="student" userName={userName} />

            <main className="ml-64 flex-grow p-10 overflow-auto">
                <header className="mb-10">
                    <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">My Records</h2>
                    <h1 className="text-4xl font-black text-slate-900">Attendance History</h1>
                    <p className="text-slate-500 font-medium mt-1">Track your daily presence and consistency across all sessions.</p>
                </header>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Attendance %</p>
                            <h3 className="text-2xl font-black text-slate-900">{attendancePercentage}%</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Present Days</p>
                            <h3 className="text-2xl font-black text-slate-900">{presentDays} / {totalDays}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Consistency</p>
                            <h3 className="text-2xl font-black text-slate-900">{attendancePercentage > 85 ? 'High' : 'Improving'}</h3>
                        </div>
                    </div>
                </div>

                {/* Consistency Graph */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Consistency Tracker</h3>
                            <p className="text-slate-500 text-sm font-medium">Visualizing your presence across recent sessions</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                <span className="text-slate-600">Present</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-slate-200 rounded-full"></span>
                                <span className="text-slate-600">Absent</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full flex items-end justify-between gap-4 px-4 border-b border-slate-100 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
                            <div className="border-t border-slate-50 w-full"></div>
                            <div className="border-t border-slate-50 w-full"></div>
                            <div className="border-t border-slate-50 w-full h-[50%] flex items-center">
                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest ml-[-40px]">Target</span>
                            </div>
                        </div>

                        {graphData.map((record, i) => (
                            <div key={record.id} className="flex-1 flex flex-col items-center group relative h-full justify-end pb-2">
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {new Date(record.date).toLocaleDateString()} - {record.status}
                                </div>

                                <div
                                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 origin-bottom hover:scale-x-110 ${record.status === 'PRESENT' ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                    style={{
                                        height: record.status === 'PRESENT' ? '90%' : '20%',
                                        opacity: 0.1 + (i / graphData.length) * 0.9
                                    }}
                                ></div>
                            </div>
                        ))}

                        {graphData.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold italic">
                                Add some attendance records to see your consistency graph.
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between px-4 mt-4">
                        {graphData.map((record, i) => (
                            <div key={record.id} className="flex-1 text-center">
                                <span className="text-[10px] font-black text-slate-400 rotate-45 inline-block">
                                    {new Date(record.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Presence Log */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-xl font-black text-slate-900">Presence Log</h3>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {attendance.map((record) => (
                            <div key={record.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all group-hover:scale-110 ${record.status === 'PRESENT' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                                        }`}>
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-slate-900">{new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        <p className="text-sm font-bold text-slate-400">Regular Session</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm tracking-wider transition-all ${record.status === 'PRESENT' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                    }`}>
                                    {record.status === 'PRESENT' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                    {record.status}
                                </div>
                            </div>
                        ))}
                        {attendance.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center">
                                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-4">
                                    <Clock size={40} />
                                </div>
                                <p className="text-slate-400 font-bold italic text-lg">No attendance records found yet.</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}
