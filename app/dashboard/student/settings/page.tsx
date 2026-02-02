'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    User,
    Bell,
    Shield,
    Save,
    ChevronRight,
    Phone,
    MapPin,
    Calendar,
    Check,
    Palette,
    Github,
    Linkedin,
    FileText,
    Sun,
    Moon,
    X,
} from 'lucide-react';

export default function StudentSettingsPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('Student');
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [profileData, setProfileData] = useState({
        phone: '',
        address: '',
        dob: '',
        bio: '',
        github: '',
        linkedin: ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailGrades: true,
        emailAttendance: false,
        emailAnnouncements: true,
        pushNotifications: true
    });

    const [appearanceSettings, setAppearanceSettings] = useState({
        darkMode: false,
        accentColor: 'blue'
    });

    // Apply Dark Mode effect
    useEffect(() => {
        if (appearanceSettings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [appearanceSettings.darkMode]);

    // Save Appearance Settings
    const updateAppearance = async (newSettings: typeof appearanceSettings) => {
        setAppearanceSettings(newSettings);
        try {
            await fetch('/api/student/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appearance: newSettings })
            });
        } catch (error) {
            console.error('Failed to save appearance settings');
        }
    };

    const [securityData, setSecurityData] = useState({
        twoFactorEnabled: false
    });

    // Password Modal State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const accentColors = [
        { id: 'blue', color: 'bg-blue-500', name: 'Blue' },
        { id: 'indigo', color: 'bg-indigo-500', name: 'Indigo' },
        { id: 'purple', color: 'bg-purple-500', name: 'Purple' },
        { id: 'rose', color: 'bg-rose-500', name: 'Rose' },
        { id: 'emerald', color: 'bg-emerald-500', name: 'Emerald' },
        { id: 'amber', color: 'bg-amber-500', name: 'Amber' }
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/student/profile');
            if (res.ok) {
                const data = await res.json();
                setUserName(data.name || 'Student');
                setProfileData({
                    phone: data.profile?.phone || '',
                    address: data.profile?.address || '',
                    dob: data.profile?.dob || '',
                    bio: data.profile?.bio || '',
                    github: data.profile?.github || '',
                    linkedin: data.profile?.linkedin || ''
                });
                setSecurityData({
                    twoFactorEnabled: data.twoFactorEnabled || false
                });
                if (data.appearance) {
                    setAppearanceSettings({
                        darkMode: data.appearance.darkMode || false,
                        accentColor: data.appearance.accentColor || 'blue'
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/student/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        try {
            const res = await fetch('/api/student/security', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'change-password',
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Password updated successfully');
                setIsPasswordModalOpen(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(data.message || 'Failed to update password');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const toggle2FA = async () => {
        try {
            const newState = !securityData.twoFactorEnabled;
            const res = await fetch('/api/student/security', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggle-2fa',
                    twoFactorEnabled: newState
                })
            });

            if (res.ok) {
                setSecurityData(prev => ({ ...prev, twoFactorEnabled: newState }));
                toast.success(`2FA ${newState ? 'Enabled' : 'Disabled'}`);
            }
        } catch (error) {
            toast.error('Failed to update 2FA settings');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmation = prompt('Type "DELETE" to permanently delete your account. This cannot be undone.');
        if (confirmation === 'DELETE') {
            try {
                const res = await fetch('/api/student/security', { method: 'DELETE' });
                if (res.ok) {
                    toast.success('Account deleted successfully');
                    router.push('/login');
                } else {
                    toast.error('Failed to delete account');
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
            <Sidebar role="student" userName={userName} />

            <main className="ml-72 flex-grow p-10 overflow-auto">
                <header className="mb-10">
                    <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Account</h2>
                    <h1 className="text-4xl font-black text-slate-900">Settings</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your profile and preferences.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all mb-2 last:mb-0 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                    <ChevronRight size={16} className="ml-auto opacity-50" />
                                </button>
                            ))}
                        </div>

                        {/* Avatar Preview */}
                        <div className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-black mb-4">
                                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <p className="font-black text-slate-900">{userName}</p>
                            <p className="text-xs text-slate-400 font-medium mt-1">Student</p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                        <User className="text-blue-600" size={24} />
                                        Personal Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                                    placeholder="+1 234 567 890"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Date of Birth
                                            </label>
                                            <div className="relative">
                                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="date"
                                                    value={profileData.dob}
                                                    onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Home Address
                                            </label>
                                            <div className="relative">
                                                <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                                                <textarea
                                                    value={profileData.address}
                                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all min-h-[80px] resize-none"
                                                    placeholder="123 Main Street, City, Country"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Bio / About Me
                                            </label>
                                            <div className="relative">
                                                <FileText size={18} className="absolute left-4 top-4 text-slate-400" />
                                                <textarea
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all min-h-[100px] resize-none"
                                                    placeholder="Tell us about yourself, your interests, and goals..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                        <Linkedin className="text-blue-600" size={24} />
                                        Social Links
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                GitHub Profile
                                            </label>
                                            <div className="relative">
                                                <Github size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="url"
                                                    value={profileData.github}
                                                    onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                                    placeholder="https://github.com/username"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                LinkedIn Profile
                                            </label>
                                            <div className="relative">
                                                <Linkedin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="url"
                                                    value={profileData.linkedin}
                                                    onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                                    >
                                        {saved ? <Check size={18} /> : <Save size={18} />}
                                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Palette className="text-blue-600" size={24} />
                                    Appearance Settings
                                </h3>

                                <div className="space-y-8">
                                    {/* Dark Mode Toggle */}
                                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl transition-colors">
                                        <div className="flex items-center gap-4">
                                            {appearanceSettings.darkMode ? <Moon size={24} className="text-indigo-400" /> : <Sun size={24} className="text-amber-500" />}
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">Dark Mode</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Switch to dark theme for reduced eye strain</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateAppearance({ ...appearanceSettings, darkMode: !appearanceSettings.darkMode })}
                                            className={`w-16 h-9 rounded-full transition-all ${appearanceSettings.darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                        >
                                            <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-transform ${appearanceSettings.darkMode ? 'translate-x-8' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Accent Color Picker */}
                                    <div>
                                        <p className="font-bold text-slate-800 mb-2">Accent Color</p>
                                        <p className="text-sm text-slate-500 mb-4">Choose your preferred accent color for the interface</p>
                                        <div className="flex gap-3">
                                            {accentColors.map((color) => (
                                                <button
                                                    key={color.id}
                                                    onClick={() => updateAppearance({ ...appearanceSettings, accentColor: color.id })}
                                                    className={`w-12 h-12 rounded-2xl ${color.color} transition-all ${appearanceSettings.accentColor === color.id
                                                        ? 'ring-4 ring-offset-2 ring-slate-300 scale-110'
                                                        : 'hover:scale-105'
                                                        }`}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                        <p className="text-sm text-amber-700 font-medium">
                                            <strong>Note:</strong> Theme preferences are currently UI-only previews. Full theming will be available in a future update.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Bell className="text-blue-600" size={24} />
                                    Notification Preferences
                                </h3>

                                <div className="space-y-4">
                                    {[
                                        { key: 'emailGrades', label: 'Grade Updates', description: 'Get notified when new grades are posted' },
                                        { key: 'emailAttendance', label: 'Attendance Alerts', description: 'Receive alerts for attendance issues' },
                                        { key: 'emailAnnouncements', label: 'Announcements', description: 'Stay updated with school announcements' },
                                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Enable browser notifications' }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                            <div>
                                                <p className="font-bold text-slate-800">{item.label}</p>
                                                <p className="text-sm text-slate-500">{item.description}</p>
                                            </div>
                                            <button
                                                onClick={() => setNotificationSettings({
                                                    ...notificationSettings,
                                                    [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                                                })}
                                                className={`w-14 h-8 rounded-full transition-all ${notificationSettings[item.key as keyof typeof notificationSettings]
                                                    ? 'bg-blue-600'
                                                    : 'bg-slate-300'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${notificationSettings[item.key as keyof typeof notificationSettings]
                                                    ? 'translate-x-7'
                                                    : 'translate-x-1'
                                                    }`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Shield className="text-blue-600" size={24} />
                                    Security Settings
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50 rounded-2xl">
                                        <h4 className="font-bold text-slate-800 mb-2">Change Password</h4>
                                        <p className="text-sm text-slate-500 mb-4">Update your password regularly for better security.</p>
                                        <button
                                            onClick={() => setIsPasswordModalOpen(true)}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                                        >
                                            Update Password
                                        </button>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-2xl">
                                        <h4 className="font-bold text-slate-800 mb-2">Two-Factor Authentication</h4>
                                        <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account.</p>
                                        <button
                                            onClick={toggle2FA}
                                            className={`px-6 py-3 rounded-xl font-bold transition-all text-white ${securityData.twoFactorEnabled ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {securityData.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                        </button>
                                    </div>

                                    <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                                        <h4 className="font-bold text-rose-800 mb-2">Danger Zone</h4>
                                        <p className="text-sm text-rose-600 mb-4">Permanently delete your account and all data.</p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Password Modal */}
                        {isPasswordModalOpen && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                                <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="font-black text-slate-800 text-lg">Change Password</h3>
                                        <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="pt-2 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsPasswordModalOpen(false)}
                                                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
