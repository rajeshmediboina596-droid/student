import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import { ShieldCheck, Download, Filter, FileBarChart } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ReportsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role="admin" userName={session.user.name} />

            <main className="ml-64 flex-grow p-10">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-2">Analytics & Compliance</h2>
                        <h1 className="text-4xl font-black text-slate-800">System Reports</h1>
                        <p className="text-slate-500 font-medium mt-1">Generate and export institutional data reports.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:border-slate-300 transition-all">
                            <Filter size={20} />
                            Filter
                        </button>
                        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg">
                            <Download size={20} />
                            Export CSV
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <Card title="Sync Status" value="100%" icon={ShieldCheck} description="All data synced" />
                    <Card title="Active Reports" value="12" icon={FileBarChart} description="Ready for export" />
                    <Card title="Security Score" value="A+" icon={ShieldCheck} description="System protected" />
                </section>

                <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center">
                    <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <FileBarChart size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-4">No Recent Activity</h3>
                    <p className="text-slate-500 max-w-md mx-auto font-medium">
                        Start by selecting a date range or student batch to generate a fresh academic performance report.
                    </p>
                </div>
            </main>
        </div>
    );
}
