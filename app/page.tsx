'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Users, ShieldCheck, Settings, ArrowRight, Sparkles, Zap, Star } from 'lucide-react';

export default function Home() {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient" />

            {/* Floating decorative elements */}
            <div className="floating-orb w-[500px] h-[500px] bg-blue-400 -top-64 -left-64" style={{ animationDelay: '0s' }} />
            <div className="floating-orb w-[400px] h-[400px] bg-indigo-400 top-1/3 -right-48" style={{ animationDelay: '2s' }} />
            <div className="floating-orb w-[300px] h-[300px] bg-purple-400 bottom-0 left-1/3" style={{ animationDelay: '4s' }} />

            {/* Main content */}
            <div className={`relative z-10 max-w-5xl w-full text-center space-y-8 p-12 transition-all duration-700 ${showMore ? 'mt-32 mb-32' : ''}`}>
                {/* Hero Section */}
                <div className="bg-white/70 backdrop-blur-xl p-16 rounded-[48px] shadow-2xl border border-white/60 animate-slide-up">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-full mb-8 shadow-lg shadow-blue-200 animate-float">
                        <Sparkles size={14} />
                        Student Management System
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black text-slate-800 tracking-tight leading-tight animate-slide-up delay-100">
                        Welcome to <br />
                        <span className="gradient-text">SMS PRO</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mt-6 animate-slide-up delay-200">
                        Manage students, attendance, grades, and materials with our modern, professional management platform.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-5 mt-12 animate-slide-up delay-300">
                        <Link
                            href="/login"
                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-[0.98] shadow-xl shadow-blue-200 hover:shadow-blue-300 flex items-center gap-3 btn-shine overflow-hidden"
                        >
                            Get Started
                            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black text-lg hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-[0.98] shadow-lg shadow-slate-100"
                        >
                            {showMore ? 'Show Less' : 'Learn More'}
                        </button>
                    </div>
                </div>

                {/* Extended Content */}
                {showMore && (
                    <div className="animate-slide-up space-y-16">
                        {/* Feature Cards */}
                        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 scroll-mt-24">
                            {[
                                {
                                    icon: Users,
                                    title: 'Student Hub',
                                    color: 'blue',
                                    gradient: 'from-blue-500 to-cyan-500',
                                    features: [
                                        'Real-time Attendance tracking',
                                        'Instant Result & GPA viewing',
                                        'Download Study Materials',
                                        'Personalized Profile management'
                                    ]
                                },
                                {
                                    icon: ShieldCheck,
                                    title: 'Teacher Suite',
                                    color: 'indigo',
                                    gradient: 'from-indigo-500 to-purple-500',
                                    features: [
                                        'Digital Attendance marking',
                                        'Centralized Marks entry',
                                        'Material upload & sharing',
                                        'Class performance analytics'
                                    ]
                                },
                                {
                                    icon: Settings,
                                    title: 'Admin Control',
                                    color: 'rose',
                                    gradient: 'from-rose-500 to-orange-500',
                                    features: [
                                        'Full User management & search',
                                        'Role-based access control',
                                        'System-wide Reports',
                                        'Global Configuration settings'
                                    ]
                                }
                            ].map((card, index) => (
                                <div
                                    key={index}
                                    className="group bg-white/80 backdrop-blur-sm p-8 rounded-[32px] border border-slate-100 text-left hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Hover gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                    <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <card.icon size={26} />
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-800 mb-4">{card.title}</h3>

                                    <ul className="space-y-3 text-slate-600 font-medium relative z-10">
                                        {card.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 group/item">
                                                <div className={`w-2 h-2 bg-gradient-to-r ${card.gradient} rounded-full group-hover/item:scale-125 transition-transform`} />
                                                <span className="group-hover/item:translate-x-1 transition-transform duration-200">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* How to Get Started Section */}
                        <div className="p-12 bg-slate-900 rounded-[48px] text-left overflow-hidden relative shadow-2xl">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -mr-40 -mt-40 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Zap className="text-white" size={24} />
                                    </div>
                                    <h2 className="text-4xl font-black text-white tracking-tight">How to Get Started</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    {[
                                        { step: '01', title: 'Login', desc: 'Securely sign in using your provided institution credentials.' },
                                        { step: '02', title: 'Navigate', desc: 'Use the sleek sidebar to access features relevant to your role.' },
                                        { step: '03', title: 'Manage', desc: 'Update attendance, grades, or personal records in real-time.' },
                                        { step: '04', title: 'Export', desc: 'Generate reports or download study materials with a single click.' },
                                    ].map((s, index) => (
                                        <div
                                            key={s.step}
                                            className="space-y-4 group"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="text-6xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent opacity-40 group-hover:opacity-70 transition-opacity">
                                                {s.step}
                                            </div>
                                            <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{s.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Testimonial/Quote Section */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-12 rounded-[48px] text-center relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

                            <div className="relative z-10">
                                <div className="flex justify-center gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="text-yellow-300 fill-yellow-300" size={24} />
                                    ))}
                                </div>
                                <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed max-w-3xl mx-auto">
                                    &ldquo;SMS PRO has transformed how we manage our institution. The interface is intuitive, and the features are exactly what we needed.&rdquo;
                                </p>
                                <p className="text-blue-200 font-bold mt-6 text-sm uppercase tracking-widest">
                                    — Dr. Sarah Johnson, Principal
                                </p>
                            </div>
                        </div>

                        <Footer />
                    </div>
                )}
            </div>
        </div>
    );
}

