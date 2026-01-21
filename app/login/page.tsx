'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                const role = data.user.role;
                router.push(`/dashboard/${role}`);
            } else {
                const errData = await res.json();
                setError(errData.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 animate-gradient" />

            {/* Floating decorative orbs */}
            <div className="floating-orb w-96 h-96 bg-blue-400 -top-48 -left-48 animate-float" style={{ animationDelay: '0s' }} />
            <div className="floating-orb w-64 h-64 bg-indigo-400 top-1/4 -right-32 animate-float" style={{ animationDelay: '2s' }} />
            <div className="floating-orb w-48 h-48 bg-purple-400 bottom-20 left-1/4 animate-float" style={{ animationDelay: '4s' }} />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md p-10 bg-white/80 backdrop-blur-xl shadow-2xl rounded-[40px] space-y-8 border border-white/60 animate-scale-up">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-lg shadow-blue-200 animate-float">
                        <Sparkles className="text-white" size={28} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
                    <p className="mt-3 text-slate-500 font-medium">Sign in to continue to your dashboard</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label htmlFor="email-address" className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-medium"
                                placeholder="admin@school.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Focus gradient line */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-focus-within:w-full transition-all duration-300 rounded-full" />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="block w-full px-6 py-4 pr-14 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {/* Focus gradient line */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-focus-within:w-full transition-all duration-300 rounded-full" />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-100 text-red-600 px-5 py-4 rounded-2xl text-sm font-bold animate-shake flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-black rounded-2xl transition-all duration-300 shadow-xl shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:transform-none disabled:hover:shadow-blue-200 overflow-hidden btn-shine"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign in</span>
                        )}
                    </button>
                </form>

                {/* Back Link */}
                <div className="text-center pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all duration-300 group"
                    >
                        <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

