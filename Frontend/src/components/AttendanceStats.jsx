import React from 'react';
import { CalendarCheck, Users, Star, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={20} className="text-white" />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{value}</p>
        </div>
    </div>
);

const AttendanceStats = ({ records }) => {
    const today = new Date().toDateString();
    const todayRecords = records.filter(r => new Date(r.date).toDateString() === today);
    const uniqueStudentsToday = new Set(todayRecords.map(r => r.studentId)).size;
    const totalPoints = records.length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={CalendarCheck} label="Attendance Today" value={todayRecords.length} color="bg-indigo-500" />
            <StatCard icon={Users} label="Students Attended" value={uniqueStudentsToday} color="bg-emerald-500" />
            <StatCard icon={Star} label="Points Awarded Total" value={totalPoints} color="bg-violet-500" />
        </div>
    );
};

export default AttendanceStats;
