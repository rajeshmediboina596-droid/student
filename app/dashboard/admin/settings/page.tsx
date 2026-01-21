'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
    Settings,
    Save,
    Database,
    ShieldCheck,
    Bell,
    Globe,
    CheckCircle2,
    Loader2
} from 'lucide-react';

export default function SettingsPage() {
    const [session, setSession] = useState<any>(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [notifications, setNotifications] = useState({
        emailAlerts: false,
        systemUpdates: false,
        newEnrollments: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                const data = await res.json();
                if (data.twoFactorEnabled !== undefined) {
                    setTwoFactorEnabled(data.twoFactorEnabled);
                }
                if (data.notificationPreferences) {
                    setNotifications(data.notificationPreferences);
                }
                setSession({ user: { name: 'Admin' } });
            } catch (error) {
                console.error('Failed to fetch settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    twoFactorEnabled,
                    notificationPreferences: notifications
                })
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="admin" userName={session?.user?.name || 'Admin'} />

            <main className="ml-64 flex-grow p-10 animate-slide-up">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-2">Configuration</h2>
                        <h1 className="text-4xl font-black text-slate-800">System Settings</h1>
                        <p className="text-slate-500 font-medium mt-1">Configure global application behavior and security.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : (saved ? <CheckCircle2 size={20} /> : <Save size={20} />)}
                        {saved ? 'Settings Saved' : 'Save Changes'}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                <Globe size={24} className="text-blue-500" />
                                General Configuration
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Institution Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Global Academy of Excellence"
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Academic Year</label>
                                        <input
                                            type="text"
                                            defaultValue="2025-2026"
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">System Language</label>
                                    <select className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-700 appearance-none">
                                        <option>English (United States)</option>
                                        <option>Spanish (ES)</option>
                                        <option>French (FR)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                <ShieldCheck size={24} className="text-green-500" />
                                Security & Access
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Two-Factor Authentication</p>
                                        <p className="text-xs font-medium text-slate-400">Add an extra layer of security to admin accounts.</p>
                                    </div>
                                    <div
                                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${twoFactorEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${twoFactorEnabled ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Public Registration</p>
                                        <p className="text-xs font-medium text-slate-400">Allow students to create accounts without admin approval.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                <Database size={24} className="text-rose-500" />
                                Storage Status
                            </h3>
                            <div className="space-y-4">
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-2/3"></div>
                                </div>
                                <div className="flex justify-between text-xs font-black text-slate-400 uppercase">
                                    <span>1.2 GB Used</span>
                                    <span>2 GB Total</span>
                                </div>
                                <button className="w-full mt-4 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-sm border-2 border-slate-100">
                                    Cleanup Database
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                <Bell size={24} className="text-amber-500" />
                                Notifications
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleNotification('emailAlerts')}>
                                    <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${notifications.emailAlerts ? 'bg-blue-500 border-blue-500' : 'border-slate-200 group-hover:border-blue-300'}`}>
                                        <div className={`w-2 h-2 bg-white rounded-sm ${notifications.emailAlerts ? 'opacity-100' : 'opacity-0'}`}></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">Email Alerts</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleNotification('systemUpdates')}>
                                    <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${notifications.systemUpdates ? 'bg-blue-500 border-blue-500' : 'border-slate-200 group-hover:border-blue-300'}`}>
                                        <div className={`w-2 h-2 bg-white rounded-sm ${notifications.systemUpdates ? 'opacity-100' : 'opacity-0'}`}></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">System Updates</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleNotification('newEnrollments')}>
                                    <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${notifications.newEnrollments ? 'bg-blue-500 border-blue-500' : 'border-slate-200 group-hover:border-blue-300'}`}>
                                        <div className={`w-2 h-2 bg-white rounded-sm ${notifications.newEnrollments ? 'opacity-100' : 'opacity-0'}`}></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">New Enrollments</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
