import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Award, BarChart, Loader2, Activity, Zap } from 'lucide-react';
import StatCard from '../components/StatCard';
import StudentProgressChart from '../components/Charts/StudentProgressChart';
import CompletionChart from '../components/Charts/CompletionChart';
import RecentActivityTable from '../components/RecentActivityTable';
import { getDashboardStats } from '../api/dashboardApi';

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getDashboardStats();
                setStatsData(response.data);
            } catch (error) {
                console.error('Error fetching admin dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-full blur-[2px]" />
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-3">
                        Program <span className="text-primary not-italic">Quantum</span>
                    </h1>
                    <p className="text-gray-400 font-bold tracking-widest text-xs mt-2 ml-1">REAL-TIME OPERATIONAL METRICS</p>
                </div>
                <div className="hidden md:flex items-center gap-4 bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm">
                    <Activity className="text-primary animate-pulse" size={18} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">System Status: <span className="text-primary">Optimized</span></span>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    icon={Users}
                    label="Total Registered Nodes"
                    value={statsData?.totalStudents || '0'}
                    trend="+12%"
                    trendType="up"
                    variant="white"
                />
                <StatCard
                    icon={UserCheck}
                    label="Active Sub-Nodes"
                    value={statsData?.activeStudents || '0'}
                    trend="+5%"
                    trendType="up"
                    variant="white"
                />
                <StatCard
                    icon={Award}
                    label="Protocol Completions"
                    value={statsData?.completedStudents || '0'}
                    trend="-2%"
                    trendType="down"
                    variant="white"
                />
                <StatCard
                    icon={BarChart}
                    label="Active Workshops"
                    value={statsData?.totalWorkshops || '0'}
                    trend="+18%"
                    trendType="up"
                    variant="white"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="relative z-10">
                        <StudentProgressChart data={statsData?.progressData || []} />
                    </div>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <CompletionChart data={statsData?.completionData || []} />
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-xl shadow-gray-100/50 relative overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -ml-16 -mt-16" />
                <h2 className="text-xl font-black text-gray-900 uppercase italic mb-8 flex items-center gap-3 relative z-10">
                    <Zap className="text-primary" size={20} />
                    Operational <span className="text-primary not-italic text-sm font-bold tracking-widest ml-1">LOGS</span>
                </h2>
                <div className="relative z-10">
                    <RecentActivityTable activities={statsData?.recentActivities} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
