import React from 'react';

const activities = [
    { id: 1, name: 'John Doe', workshop: 'Financial Literacy', points: '+1', date: 'Today' },
    { id: 2, name: 'Sara Smith', workshop: 'Emotional Support', points: '+1', date: 'Yesterday' },
    { id: 3, name: 'Mike Johnson', workshop: 'Career Development', points: '+1', date: 'Today' },
    { id: 4, name: 'Emily Brown', workshop: 'Health & Wellness', points: '+1', date: '2 days ago' },
];

const RecentActivityTable = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
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
                        {activities.map((activity) => (
                            <tr key={activity.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                            {activity.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{activity.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{activity.workshop}</td>
                                <td className="px-6 py-4 text-sm font-bold text-emerald-600">{activity.points}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{activity.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivityTable;
