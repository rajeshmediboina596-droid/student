'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Footer from '@/components/Footer';
import {
    Users,
    Calendar,
    Award,
    Activity,
    ChevronRight,
    X,
    Clock,
    TrendingUp,
    MapPin,
    Phone,
    Mail
} from 'lucide-react';
import Link from 'next/link';
import { Result } from '@/lib/db';

export default function StudentDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        attendance: 0,
        gpa: 'N/A',
        subjects: 0,
        rank: '#08'
    });
    const [recentResults, setRecentResults] = useState<Result[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({ phone: '', address: '', dob: '' });
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch profile
            const profileRes = await fetch('/api/student/profile');
            const profileData = await profileRes.json();
            setProfile(profileData);
            setUserName(profileData.name || 'Student');
            setFormData({
                phone: profileData.profile?.phone || '',
                address: profileData.profile?.address || '',
                dob: profileData.profile?.dob || ''
            });

            // Fetch attendance for stats
            const attRes = await fetch('/api/student/attendance', { cache: 'no-store' });
            const attData = await attRes.json();
            const attendancePercent = attData.length > 0
                ? Math.round((attData.filter((a: any) => a.status === 'PRESENT').length / attData.length) * 100)
                : 0;

            // Fetch results for stats
            const resRes = await fetch('/api/student/results');
            const resData = await resRes.json();

            // Safe handling: ensure resData is an array
            const resultsList = Array.isArray(resData) ? resData : [];

            const gpa = resultsList.length > 0
                ? (resultsList.reduce((acc: number, r: any) => acc + (r.marks / r.maxMarks), 0) / resultsList.length * 10).toFixed(2)
                : "N/A";

            setStats({
                attendance: attendancePercent,
                gpa,
                subjects: resultsList.length,
                rank: '#08'
            });
            setRecentResults(resultsList.slice(0, 4));

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/student/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsEditModalOpen(false);
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold animate-pulse tracking-widest uppercase text-[10px]">Loading Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">
            <Sidebar role="student" userName={userName} />

            <main className="ml-64 flex-grow p-10 overflow-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3 leading-none tracking-widest">Student Portal</h2>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">Hello, {userName.split(' ')[0]}! 👋</h1>
                        <p className="text-slate-500 font-medium mt-1">Here&apos;s a quick look at your academic progress.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 text-sm font-black text-slate-600 shadow-sm flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Batch: {profile?.profile?.batch || '2024'}
                        </div>
                        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 text-sm font-black text-slate-600 shadow-sm">
                            {profile?.profile?.course || 'Computer Science'}
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                                <Calendar size={20} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+2%</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">{stats.attendance}%</span>
                            <span className="text-xs font-bold text-slate-400">Monthly</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                                <Award size={20} />
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Current GPA</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">{stats.gpa}</span>
                            <span className="text-xs font-bold text-slate-400">Out of 10</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                                <Activity size={20} />
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Subjects</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">{stats.subjects}</span>
                            <span className="text-xs font-bold text-slate-400">Total</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
                                <Users size={20} />
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Rank</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">{stats.rank}</span>
                            <span className="text-xs font-bold text-slate-400">Global</span>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Recent Results */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <TrendingUp className="text-blue-600" size={24} />
                                Recent Performance
                            </h3>
                            <Link href="/dashboard/student/results" className="text-xs font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all uppercase tracking-widest">View All</Link>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {recentResults.map((r: Result) => (
                                <div key={r.id} className="flex items-center justify-between p-6 rounded-[28px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group/item">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 font-black text-xl group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300">
                                            {r.subject.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-lg leading-none">{r.subject}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${r.resultStatus === 'PASS' ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
                                                    {r.resultStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900 text-xl leading-none">{r.marks} / {r.maxMarks}</p>
                                        <div className="w-36 h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${r.marks / r.maxMarks >= 0.75 ? 'bg-blue-600' : 'bg-amber-500'}`}
                                                style={{ width: `${(r.marks / r.maxMarks) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentResults.length === 0 && (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-4">
                                        <Clock size={40} />
                                    </div>
                                    <p className="text-slate-400 font-bold italic text-lg leading-relaxed">No progress data recorded.<br /><span className="text-sm not-italic opacity-50">Upload your results to see analytics.</span></p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Quick View */}
                    <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-[60px] -ml-24 -mb-24"></div>

                        <h3 className="text-2xl font-black text-slate-900 mb-10 relative z-10 flex items-center gap-3">
                            Profile Details
                        </h3>
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</span>
                                    <span className="font-black text-slate-800 text-sm leading-tight break-all">{profile?.email}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <Phone size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</span>
                                    <span className="font-black text-slate-800 text-sm leading-tight">{profile?.profile?.phone || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</span>
                                    <span className="font-black text-slate-800 text-sm leading-tight">{profile?.profile?.address || 'Not provided'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full mt-4 py-5 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-[24px] shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                            >
                                Edit Profile
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-[40px] border border-slate-200 shadow-2xl p-12 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-3xl font-black text-slate-900">Edit Profile</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="bg-slate-100 text-slate-400 hover:text-slate-600 p-3 rounded-full transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Phone Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-7 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Home Address</label>
                                    <textarea
                                        className="w-full px-7 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300 min-h-[100px]"
                                        placeholder="123 Main St, City"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full px-7 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all"
                                        value={formData.dob}
                                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl transition-all shadow-xl shadow-blue-500/20 mt-6 active:scale-[0.98]">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                <Footer />
            </main>
        </div>
    );
}
