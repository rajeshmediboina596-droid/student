import Sidebar from '@/components/Sidebar';
import { BookOpen, Upload, FileText, ExternalLink, Trash2 } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default async function MaterialsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const materials = await db.material.findMany();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="teacher" userName={session.user.name} />

            <main className="ml-72 flex-grow p-10">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">Resource Management</h2>
                        <h1 className="text-4xl font-black text-slate-800">Learning Materials</h1>
                        <p className="text-slate-500 font-medium mt-1">Upload and manage study resources for your students.</p>
                    </div>
                    <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                        <Upload size={20} />
                        Upload New File
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materials.map((mat: any) => (
                        <div key={mat.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{mat.title}</h3>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-2">{mat.description || 'No description provided.'}</p>
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <span className="text-xs font-black text-slate-300 uppercase">PDF Document</span>
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all">
                                        <ExternalLink size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-rose-600 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {materials.length === 0 && (
                        <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center">
                            <p className="text-slate-400 font-bold italic">No materials uploaded yet.</p>
                            <button className="mt-4 px-6 py-2 bg-slate-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

