import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentActivityTable = ({ activities = [] }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                {activities.length > 0 && (
                    <button 
                        onClick={() => navigate('/dashboard/attendance')}
                        className="text-primary text-sm font-bold hover:underline cursor-pointer"
                    >
                        View All
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Workshop</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Points Earned</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activities.length > 0 ? (
                            activities.map((activity, idx) => (
                                <tr key={activity.id || idx} className="hover:bg-[#FFF9E6] transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                {activity.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{activity.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{activity.workshop}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{activity.points}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{activity.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">
                                    No recent activities found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivityTable;
