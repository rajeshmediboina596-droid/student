'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100 animate-slide-up">
            <div className={`max-w-4xl w-full text-center space-y-8 bg-white/80 p-12 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/50 transition-all duration-700 ${showMore ? 'mt-32 mb-32' : ''}`}>
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-slide-up delay-100">
                    Welcome to SMS
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-200">
                    Manage your students, attendance, grades, and materials with our modern, professional management platform.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                    <Link
                        href="/login"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                        Get Started
                    </Link>
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:border-blue-300 hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
                    >
                        {showMore ? 'Show Less' : 'Learn More'}
                    </button>
                </div>

                {showMore && (
                    <div className="animate-slide-up">
                        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 scroll-mt-24">
                            <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 text-left hover:shadow-xl transition-all">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-blue-800 mb-4">Student Hub</h3>
                                <ul className="space-y-3 text-slate-600 font-medium">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> Real-time Attendance tracking</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> Instant Result & GPA viewing</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> Download Study Materials</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> Personalized Profile management</li>
                                </ul>
                            </div>

                            <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 text-left hover:shadow-xl transition-all">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                                    <ShieldAlert size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-indigo-800 mb-4">Teacher Suite</h3>
                                <ul className="space-y-3 text-slate-600 font-medium">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div> Digital Attendance marking</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div> Centralized Marks entry</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div> Material upload & sharing</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div> Class performance analytics</li>
                                </ul>
                            </div>

                            <div className="p-8 bg-rose-50/50 rounded-3xl border border-rose-100 text-left hover:shadow-xl transition-all">
                                <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-200">
                                    <Settings size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-rose-800 mb-4">Admin Control</h3>
                                <ul className="space-y-3 text-slate-600 font-medium">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> Full User management & search</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> Role-based access control</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> System-wide Reports</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> Global Configuration settings</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-left overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black text-white mb-8 italic tracking-tight">How to Get Started</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    {[
                                        { step: '01', title: 'Login', desc: 'Securely sign in using your provided institution credentials.' },
                                        { step: '02', title: 'Navigate', desc: 'Use the sleek sidebar to access features relevant to your role.' },
                                        { step: '03', title: 'Manage', desc: 'Update attendance, grades, or personal records in real-time.' },
                                        { step: '04', title: 'Export', desc: 'Generate reports or download study materials with a single click.' },
                                    ].map((s) => (
                                        <div key={s.step} className="space-y-4">
                                            <div className="text-5xl font-black text-blue-500/30 font-mono">{s.step}</div>
                                            <h4 className="text-xl font-bold text-white">{s.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <footer className="mt-24 pt-8 border-t border-slate-100 text-slate-400 text-sm font-bold flex justify-between items-center">
                            <p>© 2026 SMS PRO. All rights reserved.</p>
                            <div className="flex gap-8">
                                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                                <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
                            </div>
                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
}

const Users = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const ShieldAlert = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);

const Settings = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
