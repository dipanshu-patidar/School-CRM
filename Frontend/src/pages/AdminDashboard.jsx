import React from 'react';
import { Users, UserCheck, Award, BarChart } from 'lucide-react';
import StatCard from '../components/StatCard';
import StudentProgressChart from '../components/Charts/StudentProgressChart';
import CompletionChart from '../components/Charts/CompletionChart';
import RecentActivityTable from '../components/RecentActivityTable';

const AdminDashboard = () => {
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
                    value="120"
                    trend="12%"
                    trendType="up"
                />
                <StatCard
                    icon={UserCheck}
                    label="Active Students"
                    value="85"
                    trend="5%"
                    trendType="up"
                />
                <StatCard
                    icon={Award}
                    label="Completed Students"
                    value="30"
                    trend="2%"
                    trendType="down"
                />
                <StatCard
                    icon={BarChart}
                    label="Average Points"
                    value="145"
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
                <RecentActivityTable />
            </div>
        </div>
    );
};

export default AdminDashboard;
