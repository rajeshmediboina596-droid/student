'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { FileText, Save, Search, Award } from 'lucide-react';

export default function MarksPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('Mathematics');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setStudents(data.filter((u: any) => u.role === 'student').map((s: any) => ({ ...s, marks: '' })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateMarks = (id: string, val: string) => {
        setStudents(students.map(s => s.id === id ? { ...s, marks: val } : s));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="teacher" userName="Professor" />

            <main className="ml-72 flex-grow p-10">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">Grading System</h2>
                        <h1 className="text-4xl font-black text-slate-800">Marks Entry</h1>
                        <p className="text-slate-500 font-medium mt-1">Update student performance for specific subjects.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Subject</span>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="font-bold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                            >
                                <option>Mathematics</option>
                                <option>Computer Science</option>
                                <option>Physics</option>
                            </select>
                        </div>
                        <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                            <Save size={20} />
                            Save All Marks
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Student</th>
                                <th className="px-8 py-5">Subject</th>
                                <th className="px-8 py-5 w-48 text-center">Marks (out of 100)</th>
                                <th className="px-8 py-5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{student.name}</p>
                                                <p className="text-xs font-medium text-slate-400">Roll: #2024-{student.id.slice(-4)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-slate-600">{subject}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <input
                                            type="number"
                                            max="100"
                                            placeholder="00"
                                            className="w-full text-center py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all font-black text-lg"
                                            value={student.marks}
                                            onChange={(e) => updateMarks(student.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${parseInt(student.marks) >= 35 ? 'bg-green-100 text-green-600' :
                                                student.marks === '' ? 'bg-slate-100 text-slate-400' : 'bg-rose-100 text-rose-600'
                                            }`}>
                                            {parseInt(student.marks) >= 35 ? 'PASS' : student.marks === '' ? 'PENDING' : 'FAIL'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {students.length === 0 && (
                        <div className="p-20 text-center text-slate-400 font-bold italic">No students loaded.</div>
                    )}
                </div>
            </main>
        </div>
    );
}

