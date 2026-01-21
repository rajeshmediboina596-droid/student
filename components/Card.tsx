import { ReactNode } from 'react';

interface CardProps {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
}

export default function Card({ title, value, icon: Icon, description, trend }: CardProps) {
    return (
        <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden hover-lift card-glow">
            {/* Background decorative gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{title}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                    </div>
                    <div className="relative">
                        {/* Icon glow effect */}
                        <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                        <div className="relative p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                            <Icon size={22} />
                        </div>
                    </div>
                </div>
                {(description || trend) && (
                    <div className="mt-4 flex items-center gap-2">
                        {trend && (
                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1 ${trend.isUp
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-red-50 text-red-500 border border-red-100'
                                }`}>
                                <svg
                                    className={`w-3 h-3 ${!trend.isUp ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                {trend.value}%
                            </span>
                        )}
                        <p className="text-xs font-medium text-slate-400">{description}</p>
                    </div>
                )}
            </div>

            {/* Bottom gradient line on hover */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
    );
}
