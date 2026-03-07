import React, { useEffect, useState } from 'react';

const ProgressBar = ({ current, total }) => {
    const [width, setWidth] = useState(0);
    const percentage = Math.round((current / total) * 100);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(percentage), 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-bold text-gray-900">Program Progress</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{current} / {total} Points Earned</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-indigo-600">{percentage}%</span>
                    <p className="text-xs text-gray-400 mt-0.5">Complete</p>
                </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${width}%` }}
                />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>0 pts</span>
                <span>{total} pts</span>
            </div>
        </div>
    );
};

export default ProgressBar;
