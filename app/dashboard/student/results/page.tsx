'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
    Award,
    FileText,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Search,
    Download,
    ChevronRight,
    Target,
    BarChart3
} from 'lucide-react';
import { Result } from '@/lib/db';
import Footer from '@/components/Footer';

export default function StudentResultsPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [userName, setUserName] = useState('');
    const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/student/results');
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
            setUserName("Student");
        } catch (err) {
            console.error(err);
        } finally {
            // Data fetch complete
        }
    };

    // Filter results based on selection
    const filteredResults = selectedSemester === 'ALL'
        ? results
        : results.filter(r => r.semester === selectedSemester);

    // Get unique semesters for tabs
    const semesters = Array.from(new Set(results.map(r => r.semester || 1))).sort((a, b) => a - b);

    // Analytics calculations
    const totalSubjects = filteredResults.length;
    const passedSubjects = filteredResults.filter(r => r.resultStatus === 'PASS').length;
    const averagePercentage = totalSubjects > 0
        ? Math.round(filteredResults.reduce((acc, r) => acc + (r.marks / r.maxMarks) * 100, 0) / totalSubjects)
        : 0;

    // CGPA Calculation (Simple mock for demo)
    const cgpa = (averagePercentage / 10).toFixed(1);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">
            <Sidebar role="student" userName={userName} />

            <main className="ml-64 flex-grow p-10 overflow-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3 leading-none">Performance</h2>
                        <h1 className="text-4xl font-black text-slate-900 mb-1">My Grades</h1>
                        <p className="text-slate-500 font-medium">Summary of your exam results and subject performance.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} />
                        EXPORT PDF
                    </button>
                </header>

                {/* Performance Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Current CGPA</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{cgpa}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Avg Score</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{averagePercentage}%</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Passed</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{passedSubjects} / {totalSubjects}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Rank</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">#4 / 120</h3>
                        </div>
                    </div>
                </div>

                {/* Performance Analysis Graph */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm mb-10 overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <BarChart3 className="text-blue-600" size={24} />
                                Performance Analysis
                            </h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">Subject-wise percentage breakdown</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                            <button
                                onClick={() => setSelectedSemester('ALL')}
                                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${selectedSemester === 'ALL' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                ALL TERMS
                            </button>
                            {semesters.map(sem => (
                                <button
                                    key={sem}
                                    onClick={() => setSelectedSemester(sem as number)}
                                    className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${selectedSemester === sem ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    SEMESTER {sem}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-48 w-full flex items-end gap-1.5 group relative">
                        {filteredResults.map((r, i) => {
                            const percent = (r.marks / r.maxMarks) * 100;
                            return (
                                <div key={r.id} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
                                    <div className="absolute bottom-full mb-3 bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10 translate-y-2 group-hover/bar:translate-y-0 shadow-lg">
                                        {r.subject}: {percent}%
                                    </div>
                                    <div
                                        className={`w-full max-w-[40px] rounded-t-2xl transition-all duration-700 origin-bottom ${percent >= 75 ? 'bg-indigo-600' : percent >= 50 ? 'bg-blue-500' : 'bg-rose-500'
                                            } hover:scale-x-110 hover:brightness-110 cursor-pointer`}
                                        style={{
                                            height: `${percent}%`,
                                            opacity: 0.4 + (i / results.length) * 0.6
                                        }}
                                    ></div>
                                </div>
                            );
                        })}
                        {results.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold italic border-2 border-dashed border-slate-100 rounded-3xl">
                                Performance chart will appear when results are released.
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Results Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="text-xl font-black text-slate-900">Grade Details</h3>
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search subject..."
                                className="pl-11 pr-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500 transition-all w-64 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                    <th className="px-10 py-6">Subject Name</th>
                                    <th className="px-10 py-6">Score Details</th>
                                    <th className="px-10 py-6">Performance</th>
                                    <th className="px-10 py-6 text-right">Status Indicator</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredResults.map((r) => {
                                    const percentage = Math.round((r.marks / r.maxMarks) * 100);
                                    return (
                                        <tr key={r.id} className="hover:bg-blue-50/30 transition-all group">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-800 text-base">{r.subject}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semester {r.semester || 1} Exam</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-slate-900 text-lg">{r.marks}</span>
                                                    <span className="text-slate-400 font-bold">/</span>
                                                    <span className="text-slate-400 font-bold">{r.maxMarks}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-base font-black text-blue-600 w-12">{percentage}%</span>
                                                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${percentage >= 75 ? 'bg-indigo-600' : percentage >= 50 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7 text-right">
                                                <div className="flex justify-end">
                                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] tracking-wider transition-all shadow-sm ${r.resultStatus === 'PASS'
                                                        ? 'bg-green-100 text-green-600 border border-green-200 group-hover:bg-green-600 group-hover:text-white'
                                                        : 'bg-rose-100 text-rose-600 border border-rose-200'
                                                        }`}>
                                                        {r.resultStatus === 'PASS' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                        {r.resultStatus}
                                                        <ChevronRight size={12} className="ml-1 opacity-50" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {results.length === 0 && (
                        <div className="p-32 text-center">
                            <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Award size={48} />
                            </div>
                            <h4 className="text-slate-900 font-black text-2xl mb-2">No Results Found</h4>
                            <p className="text-slate-400 font-medium text-lg">Your grades will appear here once the assessment period ends.</p>
                        </div>
                    )}
                </div>
                <Footer />
            </main>
        </div>
    );
}
