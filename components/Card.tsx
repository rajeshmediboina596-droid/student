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
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-black text-slate-900">{value}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon size={24} />
                </div>
            </div>
            {(description || trend) && (
                <div className="mt-4 flex items-center gap-2">
                    {trend && (
                        <span className={`text-xs font-black px-2 py-1 rounded-lg ${trend.isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {trend.isUp ? '+' : '-'}{trend.value}%
                        </span>
                    )}
                    <p className="text-xs font-bold text-slate-400">{description}</p>
                </div>
            )}
        </div>
    );
}
