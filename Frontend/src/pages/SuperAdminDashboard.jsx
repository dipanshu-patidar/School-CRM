import React, { useState, useEffect } from 'react';
import { 
    Building2, 
    Users, 
    CreditCard, 
    DollarSign,
    TrendingUp,
    History,
    Activity,
    ShieldCheck
} from 'lucide-react';
import api from '../api/axios';
import StatCard from '../components/StatCard';

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrganizations: 0,
        totalAdminUsers: 0,
        activeSubscriptions: 0,
        monthlyRevenue: 0,
        latestOrganizations: [],
        revenueHistory: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/superadmin/dashboard/stats');
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching super admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Organizations', value: stats.totalOrganizations, icon: Building2, trend: '12%', trendType: 'up' },
        { label: 'Admin Users', value: stats.totalAdminUsers, icon: Users, trend: '5%', trendType: 'up' },
        { label: 'Active Subscriptions', value: stats.activeSubscriptions, icon: CreditCard, trend: '8%', trendType: 'up' },
        { label: 'Monthly Revenue', value: `$${stats.monthlyRevenue}`, icon: DollarSign, trend: '15%', trendType: 'up' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-[1500ms] ease-out">
            {/* Premium Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-full blur-[2px]" />
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-3">
                        System <span className="text-primary not-italic">Intelligence</span>
                    </h1>
                    <p className="text-gray-400 font-bold tracking-widest text-xs mt-2 ml-1">PLATFORM PERFORMANCE MONITORING</p>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((card, idx) => (
                    <StatCard
                        key={idx}
                        icon={card.icon}
                        label={card.label}
                        value={card.value}
                        trend={card.trend}
                        trendType={card.trendType}
                        variant="white"
                    />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Financial Trajectory Chart Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 relative overflow-hidden group shadow-2xl shadow-gray-100/40">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                        
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                    Financial <span className="text-primary italic">Trajectory</span>
                                </h2>
                                <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em] italic">12-Month Performance Review</p>
                            </div>
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                                <TrendingUp size={12} strokeWidth={3} />
                                +12% Shift
                            </div>
                        </div>
                        
                        <div className="h-80 flex items-end justify-between gap-4 px-2 relative z-10">
                            {stats.revenueHistory?.length > 0 ? (
                                stats.revenueHistory.map((item, i) => {
                                    const maxRevenue = Math.max(...stats.revenueHistory.map(r => r.revenue), 1);
                                    const height = (item.revenue / maxRevenue) * 100;
                                    return (
                                        <div key={i} className="flex-1 space-y-4 group/bar cursor-pointer h-full flex flex-col justify-end">
                                            <div className="relative w-full bg-gray-50/50 rounded-t-2xl overflow-hidden" style={{ height: '85%' }}>
                                                <div 
                                                    className="absolute bottom-0 left-0 w-full bg-primary/10 group-hover/bar:bg-primary transition-all duration-700 rounded-t-2xl"
                                                    style={{ height: `${height}%` }}
                                                >
                                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                                </div>
                                            </div>
                                            <div className="text-[9px] text-gray-400 group-hover/bar:text-primary transition-colors text-center font-black uppercase tracking-[0.1em]">
                                                {item.month}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">Analyzing Revenue Vectors...</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Horizontal guide lines */}
                        <div className="absolute inset-x-10 top-32 bottom-24 flex flex-col justify-between pointer-events-none opacity-20">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full h-px border-t border-dashed border-gray-400 flex justify-start items-center">
                                    <span className="text-[8px] font-black text-gray-400 -ml-8">{4-i}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 h-full shadow-2xl shadow-gray-100/40 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -ml-16 -mt-16" />
                        
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                    Recent <span className="text-primary italic">Onboarding</span>
                                </h2>
                                <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em] italic">Latest Platform Tenants</p>
                            </div>
                            <button className="p-3 bg-gray-50 hover:bg-white border border-gray-100 rounded-2xl text-gray-300 hover:text-primary transition-all shadow-sm">
                                <TrendingUp size={20} />
                            </button>
                        </div>

                        <div className="space-y-8 relative z-10">
                            {stats.latestOrganizations.length > 0 ? (
                                stats.latestOrganizations.map((org, i) => (
                                    <div key={org._id} className="flex items-center gap-5 group cursor-pointer">
                                        <div className="w-14 h-14 rounded-[1.2rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-xl font-black text-gray-900 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-sm">
                                            {org.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <p className="text-base font-black text-gray-900 uppercase italic tracking-tight group-hover:text-primary transition-colors">
                                                    {org.name.toLowerCase()}
                                                </p>
                                                <div className="px-2 py-1 bg-gray-100 rounded-md text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                                    {new Date(org.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {org.planId?.planName || 'TRIAL'} SUBSCRIPTION
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-sm font-bold text-gray-400 uppercase italic tracking-widest">Initializing Tenant Data...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
