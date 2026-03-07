import React from 'react';
import {
    Users,
    GraduationCap,
    Clock,
    TrendingUp,
    Calendar,
    MoreVertical,
    CheckCircle2
} from 'lucide-react';

const Dashboard = ({ role }) => {
    const stats = [
        { label: 'Total Students', value: '1,284', change: '+12.5%', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Active Workshops', value: '42', change: '+3.2%', icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Attendance Rate', value: '94.8%', change: '+1.4%', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Completion Rate', value: '89.2%', change: '+5.7%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Secion */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back, John</h1>
                    <p className="text-gray-500 mt-1">Shining Light CRM — Dashboard Overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                        Generate Report
                    </button>
                </div>
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
                {/* Recent Students Table Simulation */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">Recent Student Submissions</h3>
                        <button className="text-primary text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Users className="text-gray-300" size={32} />
                        </div>
                        <p className="text-gray-900 font-semibold italic text-lg opacity-60">
                            "Dashboard Content Here"
                        </p>
                        <p className="text-gray-400 text-sm mt-2 max-w-xs">
                            This area will dynamically display student data and recent activities based on your role.
                        </p>
                    </div>
                </div>

                {/* Action Items List Simulation */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 text-lg">Action Required</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex gap-4 group cursor-pointer">
                                <div className="mt-1">
                                    <CheckCircle2 className="text-gray-200 group-hover:text-emerald-500 transition-colors" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Verify new workshop attendance</p>
                                    <p className="text-xs text-gray-500 mt-1">Due in 2 hours • High Priority</p>
                                </div>
                            </div>
                        ))}
                        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all">
                            + Add New Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
