'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
    Sparkles,
    BookOpen,
    Target,
    Plus,
    X,
    Trophy,
    Trash2,
    ExternalLink,
    MoreVertical,
    CheckCircle2,
    PlayCircle
} from 'lucide-react';
import { StudentResource } from '@/lib/db';
import Footer from '@/components/Footer';

export default function StudentMaterialsPage() {
    const [personalResources, setPersonalResources] = useState<StudentResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
    const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
    const [userName, setUserName] = useState('');

    const [newResource, setNewResource] = useState({ name: '', url: '', status: 'WANT_TO_LEARN' });
    const [masteryData, setMasteryData] = useState({ certificateUrl: '', projectUrl: '', notes: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/student/resources');
            if (res.ok) {
                const data = await res.json();
                setPersonalResources(data);
            }
            setUserName("Student");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/student/resources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newResource)
        });
        if (res.ok) {
            setIsAddModalOpen(false);
            setNewResource({ name: '', url: '', status: 'WANT_TO_LEARN' });
            fetchData();
        }
    };

    const updateStatus = async (id: string, status: string, masterInfo?: Partial<StudentResource>) => {
        if (status === 'MASTER' && !masterInfo) {
            setActiveResourceId(id);
            setIsMasterModalOpen(true);
            return;
        }

        const res = await fetch(`/api/student/resources/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, ...masterInfo })
        });
        if (res.ok) {
            setIsMasterModalOpen(false);
            setMasteryData({ certificateUrl: '', projectUrl: '', notes: '' });
            fetchData();
        }
    };

    const deleteResource = async (id: string) => {
        if (!confirm('Are you sure you want to remove this skill?')) return;
        await fetch(`/api/student/resources/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const columns = [
        {
            id: 'WANT_TO_LEARN',
            label: 'Want to Learn',
            icon: Sparkles,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
            emptyText: 'Skills you want to learn in the future'
        },
        {
            id: 'LEARNING',
            label: 'Learning',
            icon: BookOpen,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-100',
            emptyText: 'Skills you are currently learning'
        },
        {
            id: 'MASTER',
            label: 'Mastered',
            icon: Target,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
            emptyText: 'Skills you have mastered with project evidence'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">
            <Sidebar role="student" userName={userName} />

            <main className="ml-64 flex-grow p-10 overflow-auto">
                <header className="mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Stack Tracker</h1>
                        <p className="text-slate-500 font-medium">Track your technology journey from interest to mastery</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Plus size={18} />
                            Add Skill
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-220px)]">
                    {columns.map(col => (
                        <div key={col.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3 font-bold">
                                    <div className={`${col.bgColor} ${col.color} p-2 rounded-xl border ${col.borderColor}`}>
                                        <col.icon size={20} />
                                    </div>
                                    <span className="text-lg text-slate-900">{col.label}</span>
                                </div>
                                <span className="text-sm bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full font-bold">
                                    {personalResources.filter(r => r.status === col.id).length}
                                </span>
                            </div>

                            <div className="flex-grow overflow-y-auto p-5 space-y-5">
                                {personalResources.filter(r => r.status === col.id).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
                                        <div className="mb-4 text-slate-300">
                                            <col.icon size={56} />
                                        </div>
                                        <h4 className="text-slate-900 font-bold mb-2 text-lg">No {col.label.toLowerCase()} yet</h4>
                                        <p className="text-slate-500 text-sm mb-6 max-w-[220px] leading-relaxed font-medium">{col.emptyText}</p>
                                        <button
                                            onClick={() => setIsAddModalOpen(true)}
                                            className="bg-white hover:bg-slate-50 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all border-2 border-blue-100 shadow-sm shadow-blue-500/5 active:scale-95"
                                        >
                                            <Plus size={18} />
                                            Add Your First
                                        </button>
                                    </div>
                                ) : (
                                    personalResources.filter(r => r.status === col.id).map(res => (
                                        <SkillCard
                                            key={res.id}
                                            res={res}
                                            onDelete={deleteResource}
                                            onUpdate={updateStatus}
                                            mastered={col.id === 'MASTER'}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-[32px] border border-slate-200 shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-3xl font-black text-slate-900">Add New Skill</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="bg-slate-100 text-slate-400 hover:text-slate-600 p-2 rounded-full transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleAddResource} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Skill Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                                        placeholder="e.g. Python, React, AWS"
                                        value={newResource.name}
                                        onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Initial Status</label>
                                    <div className="flex bg-slate-100 p-1.5 rounded-[18px] gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setNewResource({ ...newResource, status: 'WANT_TO_LEARN' })}
                                            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${newResource.status === 'WANT_TO_LEARN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Want to Learn
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewResource({ ...newResource, status: 'LEARNING' })}
                                            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${newResource.status === 'LEARNING' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Learning
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Reference URL (Optional)</label>
                                    <input
                                        type="url"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                                        placeholder="https://docs.python.org"
                                        value={newResource.url}
                                        onChange={e => setNewResource({ ...newResource, url: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 mt-4 active:scale-[0.98]">
                                    Save Skill
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Master Modal */}
                {isMasterModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-[32px] border border-slate-200 shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                                    <Target /> Claim Mastery
                                </h3>
                                <button onClick={() => setIsMasterModalOpen(false)} className="bg-slate-100 text-slate-400 hover:text-slate-600 p-2 rounded-full"><X size={18} /></button>
                            </div>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">Great job! To verify your mastery, please provide details of your learning evidence.</p>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Certificate URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-6 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none font-bold text-slate-800 text-sm transition-all"
                                        placeholder="https://certificate.io/..."
                                        value={masteryData.certificateUrl}
                                        onChange={e => setMasteryData({ ...masteryData, certificateUrl: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Project URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-6 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none font-bold text-slate-800 text-sm transition-all"
                                        placeholder="https://github.com/your-repo"
                                        value={masteryData.projectUrl}
                                        onChange={e => setMasteryData({ ...masteryData, projectUrl: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Notes</label>
                                    <textarea
                                        className="w-full px-6 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none font-bold text-slate-800 text-sm min-h-[90px] transition-all"
                                        placeholder="Specific topics or milestones..."
                                        value={masteryData.notes}
                                        onChange={e => setMasteryData({ ...masteryData, notes: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => updateStatus(activeResourceId!, 'MASTER', masteryData)}
                                    className="w-full py-4.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-200"
                                >
                                    Verify Mastery
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <Footer />
            </main>
        </div>
    );
}

function SkillCard({
    res,
    onDelete,
    onUpdate,
    mastered = false
}: {
    res: StudentResource;
    onDelete: (id: string) => void;
    onUpdate: (id: string, status: string, masterInfo?: Partial<StudentResource>) => void;
    mastered?: boolean;
}) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 group relative transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
            <button
                onClick={() => onDelete(res.id)}
                className="absolute top-5 right-5 text-slate-200 hover:text-rose-500 transition-colors"
            >
                <Trash2 size={18} />
            </button>

            <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${res.status === 'WANT_TO_LEARN' ? 'bg-blue-50 border-blue-100 text-blue-500' :
                    res.status === 'LEARNING' ? 'bg-indigo-50 border-indigo-100 text-indigo-500' :
                        'bg-emerald-50 border-emerald-100 text-emerald-500'
                    }`}>
                    {res.status === 'WANT_TO_LEARN' && <Sparkles size={28} />}
                    {res.status === 'LEARNING' && <PlayCircle size={28} />}
                    {res.status === 'MASTER' && <CheckCircle2 size={28} />}
                </div>
                <div>
                    <h5 className="font-bold text-slate-900 text-xl leading-tight">{res.name}</h5>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${res.status === 'WANT_TO_LEARN' ? 'text-blue-400' :
                        res.status === 'LEARNING' ? 'text-indigo-400' :
                            'text-emerald-500'
                        }`}>
                        {res.status === 'WANT_TO_LEARN' ? 'Interest' : res.status === 'LEARNING' ? 'In Progress' : 'Mastered'}
                    </p>
                </div>
            </div>

            {res.url && (
                <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[11px] text-blue-600 hover:text-blue-700 font-black mb-6 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                >
                    <ExternalLink size={14} />
                    REFERENCE LINK
                </a>
            )}

            {mastered && (res.certificateUrl || res.projectUrl) && (
                <div className="mb-6 flex gap-3">
                    {res.certificateUrl && (
                        <a
                            href={res.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all text-center"
                        >
                            Certificate
                        </a>
                    )}
                    {res.projectUrl && (
                        <a
                            href={res.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-center"
                        >
                            View Project
                        </a>
                    )}
                </div>
            )}

            <div className="bg-slate-100 p-1.5 rounded-[20px] flex gap-1.5">
                <button
                    onClick={() => onUpdate(res.id, 'WANT_TO_LEARN')}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${res.status === 'WANT_TO_LEARN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Want
                </button>
                <button
                    onClick={() => {
                        onUpdate(res.id, 'LEARNING');
                        if (res.status === 'WANT_TO_LEARN' && res.url) {
                            window.open(res.url, '_blank');
                        }
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${res.status === 'LEARNING' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Learn
                </button>
                <button
                    onClick={() => onUpdate(res.id, 'MASTER')}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${res.status === 'MASTER' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Done
                </button>
            </div>
        </div>
    );
}
