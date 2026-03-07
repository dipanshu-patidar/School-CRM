import React from 'react';

const AttendanceTable = ({ records }) => {
    return (
        <div className="overflow-x-auto">
            {records.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="font-medium">No attendance records found.</p>
                </div>
            ) : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Workshop Name</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Points Earned</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {records.map((record, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.workshop}</td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-emerald-600">{record.points}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{record.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AttendanceTable;
