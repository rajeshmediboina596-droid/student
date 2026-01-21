'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { ClipboardList, CheckCircle2, XCircle, Search, User, Save, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function AttendancePage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchStudentsAndAttendance();
    }, [date]);

    const fetchStudentsAndAttendance = async () => {
        setLoading(true);
        try {
            // 1. Fetch Students
            const resStudents = await fetch('/api/admin/users');
            const studentsData = await resStudents.json();

            let studentList: any[] = [];
            if (Array.isArray(studentsData)) {
                studentList = studentsData.filter((u: any) => u.role === 'student');
            } else {
                console.error("Expected array but got:", studentsData);
            }

            // 2. Fetch Attendance for the selected date
            const resAttendance = await fetch(`/api/attendance?date=${date}`);
            if (resAttendance.ok) {
                const attendanceMap = await resAttendance.json();
                // Merge attendance status into student list
                studentList = studentList.map(s => ({
                    ...s,
                    attendance: attendanceMap[s.id] || null // null means not marked yet
                }));
            }

            setStudents(studentList);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = (studentId: string, status: 'PRESENT' | 'ABSENT') => {
        setStudents(students.map(s => s.id === studentId ? { ...s, attendance: status } : s));
    };

    const submitAttendance = async () => {
        setSubmitting(true);
        try {
            // Prepare payload: only send students who have a status marked
            const records = students
                .filter(s => s.attendance)
                .map(s => ({
                    userId: s.id,
                    status: s.attendance
                }));

            if (records.length === 0) {
                toast.warning("No attendance marked to submit.");
                return;
            }

            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, records })
            });

            if (res.ok) {
                toast.success("Attendance successfully submitted!");
            } else {
                throw new Error("Failed to submit");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to save attendance.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="teacher" userName="Professor" />
            <Toaster position="top-right" />

            <main className="ml-64 flex-grow p-10">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Academic Records</h2>
                        <h1 className="text-4xl font-black text-slate-800">Attendance Marking</h1>
                        <p className="text-slate-500 font-medium mt-1">Record student presence for the current session.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Date</span>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="font-bold text-slate-800 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={submitAttendance}
                            disabled={submitting || loading}
                            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 flex items-center gap-3 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            {submitting ? 'SAVING...' : 'SUBMIT ATTENDANCE'}
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-800">Enrolled Students</h3>
                        <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-600 font-bold text-sm">
                            {students.length} Students Total
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            <div className="p-20 text-center flex justify-center">
                                <Loader2 size={40} className="text-blue-600 animate-spin" />
                            </div>
                        ) : (
                            students.map((student) => (
                                <div key={student.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-colors duration-300 ${student.attendance === 'PRESENT' ? 'bg-green-100 text-green-600' :
                                            student.attendance === 'ABSENT' ? 'bg-rose-100 text-rose-600' :
                                                'bg-slate-100 text-slate-400'
                                            }`}>
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-800">{student.name}</p>
                                            <p className="text-sm font-bold text-slate-400">{student.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => markAttendance(student.id, 'PRESENT')}
                                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${student.attendance === 'PRESENT'
                                                ? 'bg-green-600 text-white shadow-lg shadow-green-100 scale-105'
                                                : 'bg-slate-100 text-slate-400 hover:bg-green-50 hover:text-green-600'
                                                }`}
                                        >
                                            <CheckCircle2 size={18} />
                                            Present
                                        </button>
                                        <button
                                            onClick={() => markAttendance(student.id, 'ABSENT')}
                                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${student.attendance === 'ABSENT'
                                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-100 scale-105'
                                                : 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                                                }`}
                                        >
                                            <XCircle size={18} />
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        {!loading && students.length === 0 && (
                            <div className="p-20 text-center text-slate-400 font-bold italic">No students loaded.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
