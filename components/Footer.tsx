'use client';

import { useState } from 'react';
import { Mail, Shield, FileText, X, MessageSquare, Phone, Globe } from 'lucide-react';

export default function Footer() {
    const [modalState, setModalState] = useState<'privacy' | 'terms' | 'support' | null>(null);

    const closeModal = () => setModalState(null);

    return (
        <footer className="mt-20 py-10 border-t border-slate-100 bg-white/30">
            <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-xl font-black text-blue-600 italic tracking-tighter mb-2">SMS PRO</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2026 SMS PRO. All rights reserved.</p>
                </div>

                <div className="flex gap-10">
                    <button
                        onClick={() => setModalState('privacy')}
                        className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-all hover:translate-y-[-1px]"
                    >
                        Privacy Policy
                    </button>
                    <button
                        onClick={() => setModalState('terms')}
                        className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-all hover:translate-y-[-1px]"
                    >
                        Terms of Service
                    </button>
                    <button
                        onClick={() => setModalState('support')}
                        className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-all hover:translate-y-[-1px]"
                    >
                        Support
                    </button>
                </div>
            </div>

            {/* Modal Overlay */}
            {modalState && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
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
                            <button onClick={closeModal} className="bg-white border border-slate-200 text-slate-400 hover:text-slate-800 p-3 rounded-full transition-all hover:rotate-90">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-12 overflow-y-auto max-h-[60vh] text-slate-600 leading-loose text-base font-medium">
                            {modalState === 'support' ? (
                                <div className="space-y-10">
                                    <p>Need help? Our dedicated support team is available 24/7 to assist you with any technical or academic queries.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                                                <Mail size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Us</p>
                                                <p className="font-black text-slate-800">support@smspro.com</p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call Us</p>
                                                <p className="font-black text-slate-800">+1 (888) 123-4567</p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                                                <Globe size={18} />
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
                                    <h4 className="font-black text-slate-900 text-lg">1. Information Collection</h4>
                                    <p>We collect essential academic information including Student IDs, full names, and attendance records. This data is used solely for the purpose of academic management and record-keeping within the institution.</p>

                                    <h4 className="font-black text-slate-900 text-lg">2. Use of Information</h4>
                                    <p>Your data is utilized to generate academic reports, track attendance progress, and facilitate communication between faculty and students. We do not sell or share your personal data with third-party advertisers.</p>

                                    <h4 className="font-black text-slate-900 text-lg">3. Data Protection</h4>
                                    <p>We implement strict security measures to protect your academic records. Access to sensitive data is restricted to authorized faculty and administrative staff only.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h4 className="font-black text-slate-900 text-lg">1. Academic Integrity</h4>
                                    <p>By using SMS PRO, you agree to maintain academic integrity. Any attempt to manipulate attendance records, grades, or other academic data is strictly prohibited and may result in disciplinary action.</p>

                                    <h4 className="font-black text-slate-900 text-lg">2. Account Security</h4>
                                    <p>You are responsible for maintaining the confidentiality of your login credentials. Please notify the administration immediately if you suspect any unauthorized access to your account.</p>

                                    <h4 className="font-black text-slate-900 text-lg">3. Platform Usage</h4>
                                    <p>This platform is provided as an educational tool. While we strive for 100% uptime, maintenance and updates may occasionally interrupt service. We are not liable for any disruptions affecting non-critical academic activities.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98]"
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
