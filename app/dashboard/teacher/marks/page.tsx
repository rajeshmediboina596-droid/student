'use client';

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import { FileText, Save, Search, ChevronDown, BarChart3, CheckCircle2, XCircle } from 'lucide-react';

export default function MarksPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('Mathematics');
    const [searchQuery, setSearchQuery] = useState('');
    const [saving, setSaving] = useState(false);

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

    // Filter students by search
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return students;
        return students.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [students, searchQuery]);

    // Grade distribution stats
    const gradeDistribution = useMemo(() => {
        const graded = students.filter(s => s.marks !== '');
        const pass = graded.filter(s => parseInt(s.marks) >= 35).length;
        const fail = graded.filter(s => parseInt(s.marks) < 35).length;
        const pending = students.filter(s => s.marks === '').length;
        return { pass, fail, pending, total: students.length };
    }, [students]);

    const handleSaveAll = async () => {
        setSaving(true);
        // Mock save - in real app, this would call an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Marks saved successfully!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex">
            <Sidebar role="teacher" userName="Professor" />

            <main className="ml-72 flex-grow p-10">
                <header className="mb-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">Grading System</h2>
                        <h1 className="text-4xl font-black text-slate-800">Marks Entry</h1>
                        <p className="text-slate-500 font-medium mt-1">Update student performance for specific subjects.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="appearance-none bg-white border-2 border-slate-200 text-slate-700 px-5 py-3.5 pr-10 rounded-2xl font-bold text-sm focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                            >
                                <option>Mathematics</option>
                                <option>Computer Science</option>
                                <option>Physics</option>
                                <option>Chemistry</option>
                                <option>English</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <button
                            onClick={handleSaveAll}
                            disabled={saving}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save All'}
                        </button>
                    </div>
                </header>

                {/* Grade Distribution Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                    <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <BarChart3 className="text-indigo-600" size={20} />
                                Grade Distribution
                            </h3>
                            <span className="text-sm font-bold text-slate-400">{subject}</span>
                        </div>
                        <div className="flex items-end gap-4 h-24">
                            <div className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-xl transition-all duration-500"
                                    style={{ height: `${gradeDistribution.total > 0 ? (gradeDistribution.pass / gradeDistribution.total) * 100 : 0}%`, minHeight: gradeDistribution.pass > 0 ? '20px' : '4px' }}
                                />
                                <span className="text-[10px] font-black text-slate-400 mt-2 uppercase">Pass</span>
                                <span className="text-lg font-black text-emerald-600">{gradeDistribution.pass}</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-xl transition-all duration-500"
                                    style={{ height: `${gradeDistribution.total > 0 ? (gradeDistribution.fail / gradeDistribution.total) * 100 : 0}%`, minHeight: gradeDistribution.fail > 0 ? '20px' : '4px' }}
                                />
                                <span className="text-[10px] font-black text-slate-400 mt-2 uppercase">Fail</span>
                                <span className="text-lg font-black text-rose-600">{gradeDistribution.fail}</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-xl transition-all duration-500"
                                    style={{ height: `${gradeDistribution.total > 0 ? (gradeDistribution.pending / gradeDistribution.total) * 100 : 0}%`, minHeight: gradeDistribution.pending > 0 ? '20px' : '4px' }}
                                />
                                <span className="text-[10px] font-black text-slate-400 mt-2 uppercase">Pending</span>
                                <span className="text-lg font-black text-slate-500">{gradeDistribution.pending}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pass Rate</p>
                        <p className="text-4xl font-black text-indigo-600">
                            {gradeDistribution.pass + gradeDistribution.fail > 0
                                ? Math.round((gradeDistribution.pass / (gradeDistribution.pass + gradeDistribution.fail)) * 100)
                                : 0}%
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1">of graded students</p>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                    {/* Search Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-900">Student List</h3>
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 pr-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all w-64"
                            />
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4 w-40 text-center">Marks (100)</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-black text-sm group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{student.name}</p>
                                                <p className="text-[10px] font-medium text-slate-400">#{student.id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-slate-600">{subject}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="--"
                                            className="w-full text-center py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-black text-lg"
                                            value={student.marks}
                                            onChange={(e) => updateMarks(student.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${parseInt(student.marks) >= 35 ? 'bg-green-50 text-green-600 border border-green-100' :
                                            student.marks === '' ? 'bg-slate-50 text-slate-400 border border-slate-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                            }`}>
                                            {parseInt(student.marks) >= 35 ? <><CheckCircle2 size={12} /> PASS</> :
                                                student.marks === '' ? 'PENDING' : <><XCircle size={12} /> FAIL</>}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div className="p-16 text-center text-slate-400 font-bold">
                            {searchQuery ? 'No students match your search.' : 'No students loaded.'}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
