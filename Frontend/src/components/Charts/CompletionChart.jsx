import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Completed', value: 30 },
    { name: 'Active', value: 85 },
    { name: 'Inactive', value: 5 },
];

const COLORS = ['#4F46E5', '#A5B4FC', '#D1D5DB'];

const CompletionChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Program Completion</h3>
            </div>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CompletionChart;
