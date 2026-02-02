'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
    ShieldCheck,
    Download,
    Filter,
    FileBarChart,
    Users,
    GraduationCap,
    UserCog,
    TrendingUp,
    Calendar,
    CheckCircle2,
    XCircle,
    UserPlus,
    Award,
    Clock
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface Attendance {
    id: string;
    studentId: string;
    date: string;
    status: string;
}

interface Result {
    id: string;
    studentId: string;
    subject: string;
    marks: number;
    maxMarks: number;
    resultStatus: string;
    createdAt: string;
}

export default function ReportsPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [userName, setUserName] = useState('Admin');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch users
            const usersRes = await fetch('/api/admin/users');
            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data);
            }

            // Fetch attendance (admin endpoint or mock)
            const attRes = await fetch('/api/admin/attendance');
            if (attRes.ok) {
                const data = await attRes.json();
                setAttendance(data);
            }

            // Fetch results
            const resRes = await fetch('/api/admin/results');
            if (resRes.ok) {
                const data = await resRes.json();
                setResults(data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    // Statistics
    const totalUsers = users.length;
    const studentCount = users.filter(u => u.role === 'student').length;
    const teacherCount = users.filter(u => u.role === 'teacher').length;
    const adminCount = users.filter(u => u.role === 'admin').length;

    // Attendance stats
    const totalAttendance = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    // Results stats
    const passCount = results.filter(r => r.resultStatus === 'PASS').length;
    const passRate = results.length > 0 ? Math.round((passCount / results.length) * 100) : 0;

    // Recent activity (mock based on user creation dates)
    const recentActivity = users
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    // Monthly attendance data (simplified)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const mockAttendanceData = [85, 78, 92, 88, 95, attendanceRate];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 flex">
            <Sidebar role="admin" userName={userName} />

            <main className="ml-72 flex-grow p-10">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-2">Analytics & Compliance</h2>
                        <h1 className="text-4xl font-black text-slate-800">System Reports</h1>
                        <p className="text-slate-500 font-medium mt-1">Comprehensive analytics and performance metrics.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:border-slate-300 transition-all">
                            <Filter size={20} />
                            Filter
                        </button>
                        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg">
                            <Download size={20} />
                            Export CSV
                        </button>
                    </div>
                </header>

                {/* User Statistics Cards */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</p>
                                <h3 className="text-3xl font-black text-slate-900">{totalUsers}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students</p>
                                <h3 className="text-3xl font-black text-slate-900">{studentCount}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <UserCog size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teachers</p>
                                <h3 className="text-3xl font-black text-slate-900">{teacherCount}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admins</p>
                                <h3 className="text-3xl font-black text-slate-900">{adminCount}</h3>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Attendance Chart */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Calendar className="text-blue-600" size={24} />
                                    Attendance Trends
                                </h3>
                                <p className="text-slate-500 text-sm font-medium">Monthly attendance rate</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-emerald-600">{attendanceRate}%</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Current Month</p>
                            </div>
                        </div>
                        <div className="h-40 flex items-end gap-3">
                            {mockAttendanceData.map((value, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className={`w-full rounded-t-xl transition-all ${value >= 85 ? 'bg-emerald-500' : value >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ height: `${value}%` }}
                                    />
                                    <span className="text-[10px] font-bold text-slate-400">{months[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Chart */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="text-indigo-600" size={24} />
                                    Performance Overview
                                </h3>
                                <p className="text-slate-500 text-sm font-medium">Pass/fail distribution</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-indigo-600">{passRate}%</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Pass Rate</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span className="text-slate-600 flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-500" /> Passed
                                    </span>
                                    <span className="text-slate-900">{passCount}</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${passRate}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span className="text-slate-600 flex items-center gap-2">
                                        <XCircle size={16} className="text-rose-500" /> Failed
                                    </span>
                                    <span className="text-slate-900">{results.length - passCount}</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${100 - passRate}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Clock className="text-amber-600" size={24} />
                                Recent Activity
                            </h3>
                            <p className="text-slate-500 text-sm font-medium">Latest system events</p>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentActivity.length > 0 ? recentActivity.map((user) => (
                            <div key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.role === 'admin' ? 'bg-rose-50 text-rose-600' :
                                        user.role === 'teacher' ? 'bg-indigo-50 text-indigo-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                        {user.role === 'admin' ? <ShieldCheck size={20} /> :
                                            user.role === 'teacher' ? <UserCog size={20} /> :
                                                <GraduationCap size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{user.name}</p>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.role === 'admin' ? 'bg-rose-100 text-rose-600' :
                                        user.role === 'teacher' ? 'bg-indigo-100 text-indigo-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {user.role}
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserPlus size={32} />
                                </div>
                                <p className="text-slate-400 font-bold">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
