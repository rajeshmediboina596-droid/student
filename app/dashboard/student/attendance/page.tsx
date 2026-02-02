'use client';

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Activity,
    Clock,
    Download,
    ChevronDown,
    CalendarDays
} from 'lucide-react';
import { Attendance } from '@/lib/db';
import Footer from '@/components/Footer';

export default function StudentAttendancePage() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/student/attendance', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setAttendance(data.sort((a: Attendance, b: Attendance) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            }
            setUserName("Student");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Get available months from attendance data
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        attendance.forEach(a => {
            const date = new Date(a.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months.add(monthKey);
        });
        return Array.from(months).sort().reverse();
    }, [attendance]);

    // Filter attendance by selected month
    const filteredAttendance = useMemo(() => {
        if (selectedMonth === 'all') return attendance;
        return attendance.filter(a => {
            const date = new Date(a.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return monthKey === selectedMonth;
        });
    }, [attendance, selectedMonth]);

    // Analytics calculations
    const totalDays = filteredAttendance.length;
    const presentDays = filteredAttendance.filter(a => a.status.toUpperCase() === 'PRESENT').length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Consistency Graph Data (Last 10 records)
    const graphData = [...filteredAttendance].slice(0, 10).reverse();

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Date', 'Status'];
        const rows = filteredAttendance.map(a => [
            new Date(a.date).toLocaleDateString(),
            a.status
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance_${selectedMonth === 'all' ? 'all' : selectedMonth}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const formatMonthLabel = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">
            <Sidebar role="student" userName={userName} />

            <main className="ml-72 flex-grow p-10 overflow-auto">
                <header className="mb-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">My Records</h2>
                        <h1 className="text-4xl font-black text-slate-900">Attendance History</h1>
                        <p className="text-slate-500 font-medium mt-1">Track your daily presence and consistency across all sessions.</p>
                    </div>
                    <div className="flex gap-3">
                        {/* Month Filter */}
                        <div className="relative">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="appearance-none bg-white border-2 border-slate-200 text-slate-700 px-5 py-3 pr-10 rounded-2xl font-bold text-sm hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                            >
                                <option value="all">All Months</option>
                                {availableMonths.map(month => (
                                    <option key={month} value={month}>{formatMonthLabel(month)}</option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>
                </header>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance %</p>
                            <h3 className="text-2xl font-black text-slate-900">{attendancePercentage}%</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Present</p>
                            <h3 className="text-2xl font-black text-slate-900">{presentDays}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent</p>
                            <h3 className="text-2xl font-black text-slate-900">{totalDays - presentDays}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                            <CalendarDays size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Days</p>
                            <h3 className="text-2xl font-black text-slate-900">{totalDays}</h3>
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

                    <div className="h-48 w-full flex items-end justify-between gap-3 px-4 border-b border-slate-100 relative">
                        {graphData.map((record, i) => (
                            <div key={record.id} className="flex-1 flex flex-col items-center group relative h-full justify-end pb-2">
                                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {new Date(record.date).toLocaleDateString()} - {record.status}
                                </div>
                                <div
                                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 origin-bottom hover:scale-x-110 ${record.status === 'PRESENT' ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-slate-200'}`}
                                    style={{
                                        height: record.status === 'PRESENT' ? '90%' : '20%',
                                        opacity: 0.4 + (i / graphData.length) * 0.6
                                    }}
                                ></div>
                            </div>
                        ))}
                        {graphData.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold italic">
                                No attendance records for this period.
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between px-4 mt-4">
                        {graphData.map((record) => (
                            <div key={record.id} className="flex-1 text-center">
                                <span className="text-[10px] font-black text-slate-400">
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
                        <span className="text-sm font-bold text-slate-400">{filteredAttendance.length} records</span>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {filteredAttendance.map((record) => (
                            <div key={record.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all group-hover:scale-110 ${record.status === 'PRESENT' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-slate-900">{new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        <p className="text-sm font-bold text-slate-400">Regular Session</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm tracking-wider transition-all ${record.status === 'PRESENT' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                    {record.status === 'PRESENT' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                    {record.status}
                                </div>
                            </div>
                        ))}
                        {filteredAttendance.length === 0 && (
                            <div className="p-16 text-center flex flex-col items-center">
                                <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                                    <Clock size={40} />
                                </div>
                                <h4 className="text-xl font-black text-slate-800 mb-2">No Records Found</h4>
                                <p className="text-slate-400 font-medium">No attendance records for the selected period.</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}
