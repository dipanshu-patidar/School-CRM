import React, { useState, useEffect } from 'react';
import { 
    DollarSign, 
    TrendingUp, 
    Calendar, 
    CreditCard,
    FileDown,
    Filter,
    Activity,
    Target,
    RefreshCw,
    Clock,
    Download
} from 'lucide-react';
import axios from 'axios';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

const RevenueTracking = () => {
    const [stats, setStats] = useState({
        ytdRevenue: 0,
        mrr: 0,
        yearlyRevenue: 0,
        pendingInvoices: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const monthlyData = [
        { name: 'JAN', value: 400 },
        { name: 'FEB', value: 300 },
        { name: 'MAR', value: 500 },
        { name: 'APR', value: 450 },
        { name: 'MAY', value: 600 },
        { name: 'JUN', value: 550 },
        { name: 'JUL', value: 700 },
        { name: 'AUG', value: 650 },
        { name: 'SEP', value: 800 },
        { name: 'OCT', value: 750 },
        { name: 'NOV', value: 900 },
        { name: 'DEC', value: 850 },
    ];

    const yearlyData = [
        { year: '2024', value: 450 },
        { year: '2025', value: 750 },
        { year: '2026', value: 720 },
    ];

    useEffect(() => {
        // Simulated data for Financial Overview
        setStats({
            ytdRevenue: 125000,
            mrr: 15400,
            yearlyRevenue: 185000,
            pendingInvoices: 1200
        });
        setTransactions([
            { id: 'TXN-9402', org: 'Hill Valley High', plan: 'Enterprise', amount: 1500, date: '2026-03-12', status: 'Paid' },
            { id: 'TXN-9403', org: 'Shermer High School', plan: 'Pro', amount: 499, date: '2026-03-11', status: 'Paid' },
            { id: 'TXN-9404', org: 'West Beverly High', plan: 'Basic', amount: 199, date: '2026-03-10', status: 'Pending' },
            { id: 'TXN-9405', org: 'Bayside High', plan: 'Pro', amount: 499, date: '2026-03-09', status: 'Paid' },
            { id: 'TXN-9406', org: 'North Shore High', plan: 'Enterprise', amount: 1500, date: '2026-03-08', status: 'Paid' },
        ]);
        setLoading(false);
    }, []);

const RevenueCard = ({ title, value, badge, icon: Icon, isGold }) => (
        <div className={`bg-white rounded-[2rem] p-8 border ${isGold ? 'border-primary/30 shadow-primary/10' : 'border-gray-100 shadow-xl shadow-gray-100/50'} flex flex-col justify-between hover:scale-[1.05] transition-all duration-500 group relative overflow-hidden animate-in zoom-in-95 duration-700`}>
            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-primary">$</span>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()}</h3>
                </div>
            </div>
            <div className="mt-8 flex items-center justify-between relative z-10">
                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${isGold ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-900 text-white'}`}>
                    {Icon && <Icon size={14} strokeWidth={3} />}
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] italic">{badge}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-2 md:p-6 pb-20">
            {/* Main Header */}
            <div className="flex justify-between items-start">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary rounded-full blur-[2px] animate-pulse" />
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase italic scale-y-110 origin-left">
                        Financial <span className="text-primary not-italic text-glow-gold">Overview</span>
                    </h1>
                    <p className="text-gray-400 font-bold tracking-[0.3em] text-[10px] mt-2 ml-1 flex items-center gap-2">
                        <Activity size={12} className="text-primary" />
                        TRACK MONTHLY RECURRING REVENUE & QUANTUM TRANSACTIONS
                    </p>
                </div>
                <button className="p-4 bg-white border border-gray-100 rounded-[1.5rem] text-gray-400 hover:text-primary hover:border-primary/30 transition-all shadow-xl shadow-gray-200/50 group active:rotate-180 duration-500">
                    <RefreshCw size={24} className="group-hover:rotate-180 transition-all duration-700" />
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <RevenueCard 
                    title="Net Revenue (YTD)"
                    value={stats.ytdRevenue}
                    badge="+12% vs last year"
                    icon={TrendingUp}
                    isGold={true}
                />
                <RevenueCard 
                    title="Monthly Recurring Revenue"
                    value={stats.mrr}
                    badge="Active Billing"
                    icon={Activity}
                />
                <RevenueCard 
                    title="Yearly Revenue"
                    value={stats.yearlyRevenue}
                    badge="Current Year"
                    icon={Calendar}
                />
                <RevenueCard 
                    title="Pending Invoices"
                    value={stats.pendingInvoices}
                    badge="Automated Retries"
                    icon={Clock}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Monthly Revenue Trend */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-primary/10 transition-all duration-1000" />
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <TrendingUp className="text-primary" size={20} strokeWidth={3} />
                            Monthly Revenue Trend
                        </h3>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">Real-time Feedback</span>
                    </div>
                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} barGap={12}>
                                <CartesianGrid vertical={false} strokeDasharray="0" stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }}
                                    dy={15}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc', opacity: 0.8 }}
                                    contentStyle={{ 
                                        backgroundColor: '#fff',
                                        borderRadius: '20px', 
                                        border: '1px solid #f1f5f9', 
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        fontSize: '10px',
                                        letterSpacing: '0.1em',
                                        padding: '12px 20px'
                                    }}
                                    itemStyle={{ color: '#D4AF37' }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#D4AF37" 
                                    radius={[6, 6, 0, 0]} 
                                    barSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Yearly Performance */}
                <div className="bg-white rounded-[3rem] p-10 border border-warm-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col group relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <Calendar className="text-primary" size={20} strokeWidth={3} />
                            Yearly Performance
                        </h3>
                    </div>
                    <div className="flex-1 h-[350px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={yearlyData}>
                                <XAxis 
                                    dataKey="year" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#1e293b', fontSize: 14, fontWeight: 900, italic: true }}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[15, 15, 0, 0]} 
                                    barSize={70}
                                >
                                    {yearlyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === yearlyData.length - 1 ? '#D4AF37' : '#f1f5f9'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Velocity</p>
                            <p className="text-xl font-black text-gray-900 italic">+28.4% <span className="text-primary text-xs not-italic">YOY</span></p>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100 italic font-black">
                            Q1
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[3.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50 relative group">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-wider flex items-center gap-3">
                            Transaction <span className="text-primary not-italic">Quantum Log</span>
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-2 italic">Immutable Financial Records</p>
                    </div>
                    <button className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic flex items-center gap-3 shadow-xl shadow-gray-200">
                        <Download size={16} strokeWidth={3} />
                        Export Ledger
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Code</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Business Entity</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Liquid Amount</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Verification</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Timestamp</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] text-right">Certificate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((t) => (
                                <tr key={t.id} className="group hover:bg-gray-50 transition-all duration-500">
                                    <td className="px-10 py-8">
                                        <span className="text-gray-900 font-black text-[10px] tracking-widest">{t.id}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-all shadow-[0_0_10px_rgba(212,175,55,0)] group-hover:shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                            <span className="text-gray-900 font-black uppercase italic tracking-widest text-sm">{t.org}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-primary font-black text-lg italic tracking-tight">
                                            ${t.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border italic ${
                                            t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-gray-900 font-black text-[10px] uppercase italic tracking-[0.1em]">{t.date}</td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-gray-100 border border-gray-100 rounded-2xl transition-all shadow-sm">
                                            <FileDown size={18} strokeWidth={3} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex justify-center">
                    <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-[0.5em] transition-all italic">
                        Synchronize Full Transaction Ledger
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RevenueTracking;
