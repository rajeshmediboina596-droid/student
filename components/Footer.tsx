'use client';

import { useState } from 'react';
import { Mail, Shield, FileText, X, MessageSquare, Phone, Globe, Heart } from 'lucide-react';

export default function Footer() {
    const [modalState, setModalState] = useState<'privacy' | 'terms' | 'support' | null>(null);

    const closeModal = () => setModalState(null);

    return (
        <footer className="mt-20 py-12 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-50 rounded-full blur-[100px] opacity-50" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-50" />

            <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-xl font-black tracking-tighter mb-2">
                        SMS <span className="gradient-text">PRO</span>
                    </h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        Made with <Heart size={12} className="text-red-400 animate-pulse" /> © 2026
                    </p>
                </div>

                <div className="flex gap-8">
                    {[
                        { label: 'Privacy Policy', key: 'privacy' as const },
                        { label: 'Terms of Service', key: 'terms' as const },
                        { label: 'Support', key: 'support' as const },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setModalState(item.key)}
                            className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-all duration-300 hover:translate-y-[-2px] relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal Overlay */}
            {modalState && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden relative animate-scale-up">
                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    {modalState === 'privacy' && <Shield size={28} />}
                                    {modalState === 'terms' && <FileText size={28} />}
                                    {modalState === 'support' && <MessageSquare size={28} />}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 capitalize">
                                        {modalState === 'privacy' && 'Privacy Policy'}
                                        {modalState === 'terms' && 'Terms of Service'}
                                        {modalState === 'support' && 'Contact Support'}
                                    </h3>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">SMS PRO Platform</p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-300 p-3 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110 shadow-sm hover:shadow-md"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-12 overflow-y-auto max-h-[60vh] text-slate-600 leading-loose text-base font-medium">
                            {modalState === 'support' ? (
                                <div className="space-y-10">
                                    <p>Need help? Our dedicated support team is available 24/7 to assist you with any technical or academic queries.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Us</p>
                                                <p className="font-black text-slate-800">support@smspro.com</p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                                                <Phone size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Us</p>
                                                <p className="font-black text-slate-800">+1 (888) 123-4567</p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group md:col-span-2">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-xl shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                                                <Globe size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Help Center</p>
                                                <p className="font-black text-slate-800">help.smspro.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : modalState === 'privacy' ? (
                                <div className="space-y-6">
                                    <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs">1</span>
                                        Information Collection
                                    </h4>
                                    <p>We collect essential academic information including Student IDs, full names, and attendance records. This data is used solely for the purpose of academic management and record-keeping within the institution.</p>

                                    <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs">2</span>
                                        Use of Information
                                    </h4>
                                    <p>Your data is utilized to generate academic reports, track attendance progress, and facilitate communication between faculty and students. We do not sell or share your personal data with third-party advertisers.</p>

                                    <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs">3</span>
                                        Data Protection
                                    </h4>
                                    <p>We implement strict security measures to protect your academic records. Access to sensitive data is restricted to authorized faculty and administrative staff only.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs">1</span>
                                        Academic Integrity
                                    </h4>
                                    <p>By using SMS PRO, you agree to maintain academic integrity. Any attempt to manipulate attendance records, grades, or other academic data is strictly prohibited and may result in disciplinary action.</p>

                                    <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs">2</span>
                                        Account Security
                                    </h4>
                                    <p>You are responsible for maintaining the confidentiality of your login credentials. Please notify the administration immediately if you suspect any unauthorized access to your account.</p>

                                    <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs">3</span>
                                        Platform Usage
                                    </h4>
                                    <p>This platform is provided as an educational tool. While we strive for 100% uptime, maintenance and updates may occasionally interrupt service. We are not liable for any disruptions affecting non-critical academic activities.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 bg-gradient-to-t from-slate-50 to-white border-t border-slate-100 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-10 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:from-blue-600 hover:to-indigo-600 hover:shadow-blue-200 transition-all duration-300 active:scale-[0.98] btn-shine overflow-hidden"
                            >
                                GOT IT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
