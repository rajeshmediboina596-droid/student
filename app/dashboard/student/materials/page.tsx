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
    PlayCircle,
    Code,
    Terminal,
    Database,
    Globe,
    Cpu,
    Cloud,
    Layout,
    Smartphone,
    GitBranch,
    Box,
    Layers,
    Command,
    Hash,
    Search,
    Shield,
    Zap,
    FolderPlus,
    Link as LinkIcon
} from 'lucide-react';
import { StudentResource } from '@/lib/db';
import Footer from '@/components/Footer';

const ICONS = {
    Code, Terminal, Database, Globe, Cpu, Cloud, Layout, Smartphone,
    GitBranch, Box, Layers, Command, Hash, Search, Shield, Zap
};

const CATEGORIES = [
    'Language', 'Framework', 'Database', 'Cloud', 'Tool', 'Concept', 'Other'
];

export default function StudentMaterialsPage() {
    const [personalResources, setPersonalResources] = useState<StudentResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [userName, setUserName] = useState('');

    // Form State
    const [formData, setFormData] = useState<{
        name: string;
        category: string;
        status: string;
        icon: string;
        projects: { name: string; url: string }[];
        certificateUrl: string;
        notes: string;
    }>({
        name: '',
        category: 'Language',
        status: 'WANT_TO_LEARN',
        icon: 'Code',
        projects: [],
        certificateUrl: '',
        notes: ''
    });

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

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Language',
            status: 'WANT_TO_LEARN',
            icon: 'Code',
            projects: [],
            certificateUrl: '',
            notes: ''
        });
        setEditingId(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (res: StudentResource) => {
        setFormData({
            name: res.name,
            category: res.category || 'Language',
            status: res.status,
            icon: res.icon || 'Code',
            projects: res.projects || [],
            certificateUrl: res.certificateUrl || '',
            notes: res.notes || ''
        });
        setEditingId(res.id);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingId ? `/api/student/resources/${editingId}` : '/api/student/resources';
        const method = editingId ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } else {
            const errorData = await res.json().catch(() => ({}));
            alert(`Failed to save: ${res.status} ${res.statusText} - ${errorData.message || 'Unknown error'}`);
        }
    };

    const deleteResource = async (id: string) => {
        if (!confirm('Are you sure you want to remove this skill?')) return;
        await fetch(`/api/student/resources/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const addProjectField = () => {
        setFormData({ ...formData, projects: [...formData.projects, { name: '', url: '' }] });
    };

    const updateProjectField = (index: number, field: 'name' | 'url', value: string) => {
        const newProjects = [...formData.projects];
        newProjects[index][field] = value;
        setFormData({ ...formData, projects: newProjects });
    };

    const removeProjectField = (index: number) => {
        const newProjects = [...formData.projects];
        newProjects.splice(index, 1);
        setFormData({ ...formData, projects: newProjects });
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

            <main className="ml-72 flex-grow p-10 overflow-auto">
                <header className="mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Stack Tracker</h1>
                        <p className="text-slate-500 font-medium">Track your technology journey from interest to mastery</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={openAddModal}
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
                                            onClick={openAddModal}
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
                                            onEdit={() => openEditModal(res)}
                                            IconComponent={ICONS[res.icon as keyof typeof ICONS] || Code}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-lg rounded-[24px] border border-slate-200 shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-black text-slate-900">{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="bg-white border border-slate-200 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"><X size={18} /></button>
                            </div>

                            <div className="overflow-y-auto p-6 space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                                        placeholder="e.g. React, Docker"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Category</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-700 text-sm appearance-none"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Status</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-bold text-slate-700 text-sm appearance-none"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="WANT_TO_LEARN">Want to Learn</option>
                                            <option value="LEARNING">Learning</option>
                                            <option value="MASTER">Mastered</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest flex justify-between">
                                        Link to Projects
                                        <button type="button" onClick={addProjectField} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[10px]">
                                            <Plus size={12} /> Add
                                        </button>
                                    </label>
                                    {formData.projects.length === 0 && (
                                        <div onClick={addProjectField} className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all text-slate-400 text-sm font-medium">
                                            Select projects...
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        {formData.projects.map((proj, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Project Name"
                                                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:border-blue-500 outline-none"
                                                    value={proj.name}
                                                    onChange={e => updateProjectField(idx, 'name', e.target.value)}
                                                />
                                                <input
                                                    type="url"
                                                    placeholder="URL"
                                                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:border-blue-500 outline-none"
                                                    value={proj.url}
                                                    onChange={e => updateProjectField(idx, 'url', e.target.value)}
                                                />
                                                <button type="button" onClick={() => removeProjectField(idx)} className="text-slate-400 hover:text-rose-500 p-2"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Icon</label>
                                    <div className="grid grid-cols-8 gap-2">
                                        {Object.keys(ICONS).map(iconKey => {
                                            const Icon = ICONS[iconKey as keyof typeof ICONS];
                                            return (
                                                <button
                                                    key={iconKey}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon: iconKey })}
                                                    className={`aspect-square flex items-center justify-center rounded-lg border transition-all ${formData.icon === iconKey ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-blue-300'}`}
                                                >
                                                    <Icon size={20} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {formData.status === 'MASTER' && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Certificate URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-slate-800 text-sm transition-all"
                                            placeholder="https://certificate.io/..."
                                            value={formData.certificateUrl}
                                            onChange={e => setFormData({ ...formData, certificateUrl: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                <button
                                    onClick={handleSave}
                                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                                >
                                    Save Skill
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
    onEdit,
    IconComponent
}: {
    res: StudentResource;
    onDelete: (id: string) => void;
    onEdit: () => void;
    IconComponent: any;
}) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 group relative transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onEdit}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                    <MoreVertical size={16} />
                </button>
                <button
                    onClick={() => onDelete(res.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${res.status === 'WANT_TO_LEARN' ? 'bg-blue-50 border-blue-100 text-blue-500' :
                        res.status === 'LEARNING' ? 'bg-indigo-50 border-indigo-100 text-indigo-500' :
                            'bg-emerald-50 border-emerald-100 text-emerald-500'
                    }`}>
                    <IconComponent size={24} />
                </div>
                <div>
                    <h5 className="font-bold text-slate-900 text-lg leading-tight mb-1">{res.name}</h5>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                        {res.category || 'Other'}
                    </span>
                </div>
            </div>

            {res.projects && res.projects.length > 0 && (
                <div className="mb-4 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Projects</p>
                    {res.projects.map((proj, i) => (
                        <a
                            key={i}
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100"
                        >
                            <LinkIcon size={12} className="text-slate-400" />
                            {proj.name}
                        </a>
                    ))}
                </div>
            )}

            {res.certificateUrl && (
                <a
                    href={res.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all"
                >
                    <Trophy size={14} /> View Certificate
                </a>
            )}
        </div>
    );
}

