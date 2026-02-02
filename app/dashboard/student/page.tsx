'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import {
    Calendar,
    Award,
    Activity,
    ChevronRight,
    X,
    Clock,
    TrendingUp,
    MapPin,
    Phone,
    Mail,
    Users,
    Sparkles
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-center">
                    <p className="text-slate-600 font-bold text-sm">Loading Dashboard</p>
                    <p className="text-slate-400 text-xs mt-1">Please wait...</p>
                </div>
            </div>
        </div>
    );



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800 flex">
            <Sidebar role="student" userName={userName} />

            <main className="ml-72 flex-grow p-10 overflow-auto">
                {/* Header with gradient banner */}
                <header className="mb-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] h-40 -z-10 opacity-5" />

                    <div className="flex justify-between items-end">
                        <div className="animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                                <Sparkles size={12} />
                                Student Portal
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 leading-tight">
                                {(() => {
                                    const hour = new Date().getHours();
                                    if (hour < 12) return `Good Morning, ${userName.split(' ')[0]}! ☀️`;
                                    if (hour < 17) return `Good Afternoon, ${userName.split(' ')[0]}! 🌤️`;
                                    return `Good Evening, ${userName.split(' ')[0]}! 🌙`;
                                })()}
                            </h1>
                            <p className="text-slate-500 font-medium mt-2">Here&apos;s a quick look at your academic progress.</p>
                        </div>
                        <div className="flex gap-3 animate-slide-up delay-100">
                            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                Batch: {profile?.profile?.batch || '2024'}
                            </div>
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 rounded-2xl text-sm font-bold text-white shadow-lg shadow-blue-200">
                                {profile?.profile?.course || 'Computer Science'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Attendance Card */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden animate-slide-up">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Calendar size={20} />
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">+2%</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{stats.attendance}%</span>
                                <span className="text-xs font-bold text-slate-400">Monthly</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>

                    {/* GPA Card */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Award size={20} />
                                </div>
                            </div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current GPA</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{stats.gpa}</span>
                                <span className="text-xs font-bold text-slate-400">Out of 10</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>

                    {/* Subjects Card */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Activity size={20} />
                                </div>
                            </div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Subjects</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{stats.subjects}</span>
                                <span className="text-xs font-bold text-slate-400">Total</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>

                    {/* Rank Card */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden animate-slide-up" style={{ animationDelay: '150ms' }}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Users size={20} />
                                </div>
                            </div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rank</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{stats.rank}</span>
                                <span className="text-xs font-bold text-slate-400">Global</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Results */}
                    <div className="lg:col-span-2 bg-white rounded-[36px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group animate-slide-up delay-200">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <TrendingUp size={18} />
                                </div>
                                Recent Performance
                            </h3>
                            <Link
                                href="/dashboard/student/results"
                                className="text-xs font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all uppercase tracking-widest flex items-center gap-1 group/btn"
                            >
                                View All
                                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {recentResults.map((r: Result, index) => (
                                <div
                                    key={r.id}
                                    className="flex items-center justify-between p-5 rounded-[24px] hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-300 border border-transparent hover:border-slate-100 group/item"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 font-black text-lg group-hover/item:bg-gradient-to-br group-hover/item:from-blue-600 group-hover/item:to-indigo-600 group-hover/item:text-white group-hover/item:border-transparent group-hover/item:shadow-lg group-hover/item:shadow-blue-200 transition-all duration-300">
                                            {r.subject.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-base leading-none">{r.subject}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${r.resultStatus === 'PASS' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-rose-600 bg-rose-50 border border-rose-100'}`}>
                                                    {r.resultStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900 text-lg leading-none">{r.marks} / {r.maxMarks}</p>
                                        <div className="w-32 h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${r.marks / r.maxMarks >= 0.75 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                                                style={{ width: `${(r.marks / r.maxMarks) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentResults.length === 0 && (
                                <div className="text-center py-16 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                                        <Clock size={40} />
                                    </div>
                                    <p className="text-slate-400 font-bold text-lg">No progress data recorded.</p>
                                    <p className="text-slate-300 text-sm mt-1">Upload your results to see analytics.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Quick View */}
                    <div className="bg-white rounded-[36px] p-8 border border-slate-100 shadow-sm relative overflow-hidden animate-slide-up delay-300">
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-[80px] -ml-30 -mb-30 opacity-50" />

                        <h3 className="text-xl font-black text-slate-900 mb-8 relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Users size={18} />
                            </div>
                            Profile Details
                        </h3>

                        <div className="space-y-6 relative z-10">
                            {[
                                { icon: Mail, label: 'Email Address', value: profile?.email },
                                { icon: Phone, label: 'Phone Number', value: profile?.profile?.phone || 'Not provided' },
                                { icon: MapPin, label: 'Address', value: profile?.profile?.address || 'Not provided' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-4 group/item">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-colors">
                                        <item.icon size={18} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                                        <span className="font-bold text-slate-800 text-sm leading-tight truncate">{item.value}</span>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-blue-600 hover:to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.98] btn-shine overflow-hidden"
                            >
                                Edit Profile
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-fade-in">
                        <div className="bg-white w-full max-w-md rounded-[40px] border border-slate-200 shadow-2xl p-10 animate-scale-up">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-slate-900">Edit Profile</h3>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-3 rounded-full transition-all duration-300 hover:rotate-90"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Phone Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Home Address</label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300 min-h-[100px] resize-none"
                                        placeholder="123 Main St, City"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all"
                                        value={formData.dob}
                                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-200 mt-4 active:scale-[0.98] btn-shine overflow-hidden"
                                >
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

