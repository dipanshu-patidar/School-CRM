import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
const StatCard = ({ icon: Icon, label, value, trend, trendType, variant = 'white' }) => {
    const isDark = variant === 'dark';

    return (
        <div className={`p-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${
            isDark 
                ? 'bg-sidebar border-[#1F1F1F] hover:border-primary/50 shadow-2xl shadow-black/20' 
                : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50'
        }`}>
            {/* Background Glow for Dark Variant */}
            {isDark && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />
            )}

            <div className="flex items-center justify-between mb-5 relative z-10">
                <div className={`p-3.5 rounded-2xl transition-all duration-500 ${
                    isDark 
                        ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black scale-110 group-hover:scale-125' 
                        : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white'
                }`}>
                    <Icon size={22} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                        trendType === 'up' 
                            ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') 
                            : (isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
                    }`}>
                        {trendType === 'up' ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
                        {trend}
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {label}
                </p>
                <h3 className={`text-3xl font-black mt-1.5 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {value}
                </h3>
            </div>
        </div>
    );
};

export default StatCard;
