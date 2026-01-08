'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import {
    ShieldAlert,
    Settings,
    UserPlus,
    Database,
    Search,
    Users
} from 'lucide-react';
import Link from 'next/link';

interface UserRegistryProps {
    initialUsers: any[];
}

export default function UserRegistry({ initialUsers }: UserRegistryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(initialUsers);

    useEffect(() => {
        const filtered = initialUsers.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, initialUsers]);

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-slide-up delay-300">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-800">Global User Registry</h3>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-12 pr-6 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl w-80 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredUsers.slice(0, 6).map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 rounded-3xl border-2 border-transparent hover:border-slate-100 transition-all">
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${u.role === 'admin' ? 'bg-rose-100 text-rose-600' :
                                u.role === 'teacher' ? 'bg-indigo-100 text-indigo-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                {u.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-black text-slate-800 text-lg">{u.name}</p>
                                <p className="text-sm font-bold text-slate-400">{u.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-rose-600 text-white' :
                                    u.role === 'teacher' ? 'bg-indigo-600 text-white' :
                                        'bg-blue-600 text-white'
                                    }`}>
                                    {u.role}
                                </span>
                                <p className="text-[10px] font-black text-slate-300 mt-2 uppercase">Role</p>
                            </div>
                            <Link href="/dashboard/admin/settings" className="p-3 bg-white text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                                <Settings size={20} />
                            </Link>
                        </div>
                    </div>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-bold italic">No matching users found.</div>
                )}
            </div>
        </div>
    );
}
