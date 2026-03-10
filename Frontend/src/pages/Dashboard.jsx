import React, { useState, useEffect } from 'react';
import {
    Users,
    GraduationCap,
    Clock,
    TrendingUp,
    Calendar,
    MoreVertical,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { getDashboardStats } from '../api/dashboardApi';

const Dashboard = ({ role }) => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState(sessionStorage.getItem('userName') || 'User');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getDashboardStats();
                setStatsData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        {
            label: 'Total Students',
            value: statsData?.totalStudents || '0',
            change: '+0%',
            icon: Users,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Active Workshops',
            value: statsData?.totalWorkshops || '0',
            change: '+0%',
            icon: GraduationCap,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Attendance Rate',
            value: `${statsData?.attendanceRate || 0}%`,
            change: '+0%',
            icon: Clock,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Completion Rate',
            value: `${statsData?.completionRate || 0}%`,
            change: '+0%',
            icon: TrendingUp,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Secion */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {userName}</h1>
                    <p className="text-gray-500 mt-1">Shining Light CRM — Dashboard Overview</p>
                </div>
                {/* <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                        Generate Report
                    </button>
                </div> */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <span className="text-xs font-semibold text-emerald-600">{stat.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Students Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">Recent Student Submissions</h3>
                        {/* <button className="text-primary text-sm font-bold hover:underline cursor-pointer">View All</button> */}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {statsData?.recentStudents?.length > 0 ? (
                                    statsData.recentStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${student.status === 'Completed'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-primary/20 text-black'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                                {student.points}/{student.totalPoints}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">
                                            No recent student data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activities Area */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 text-lg">Recent Activities</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {statsData?.recentActivities?.length > 0 ? (
                            statsData.recentActivities.map((activity) => (
                                <div key={activity.id} className="flex gap-4 group">
                                    <div className="mt-1">
                                        <CheckCircle2 className="text-emerald-500 transition-colors" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {activity.name} attended {activity.workshop}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                {activity.points} pts
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {activity.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 italic py-8">
                                No recent activities found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
