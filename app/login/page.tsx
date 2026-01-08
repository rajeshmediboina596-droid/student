'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
            <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-3xl space-y-8 border border-white/40 glass">
                <div className="text-center animate-slide-up">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
                    <p className="mt-3 text-slate-500 font-medium">Please enter your credentials to log in.</p>
                </div>

                <form className="mt-8 space-y-6 animate-slide-up delay-100" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-bold text-slate-700 ml-1 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                placeholder="admin@school.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-black rounded-2xl transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none"
                        >
                            {loading ? 'Logging in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-2">
                    <Link href="/" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                        ← Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
