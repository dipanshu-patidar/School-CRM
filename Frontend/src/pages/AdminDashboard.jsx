import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Award, BarChart, Loader2 } from 'lucide-react';
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
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Program Overview</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Students"
                    value={statsData?.totalStudents || '0'}
                    trend="12%"
                    trendType="up"
                />
                <StatCard
                    icon={UserCheck}
                    label="Active Students"
                    value={statsData?.activeStudents || '0'}
                    trend="5%"
                    trendType="up"
                />
                <StatCard
                    icon={Award}
                    label="Completed Students"
                    value={statsData?.completedStudents || '0'}
                    trend="2%"
                    trendType="down"
                />
                <StatCard
                    icon={BarChart}
                    label="Active Workshops"
                    value={statsData?.totalWorkshops || '0'}
                    trend="18%"
                    trendType="up"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <StudentProgressChart />
                </div>
                <div>
                    <CompletionChart />
                </div>
            </div>

            {/* Recent Activity Section */}
            <div>
                <RecentActivityTable activities={statsData?.recentActivities} />
            </div>
        </div>
    );
};

export default AdminDashboard;
