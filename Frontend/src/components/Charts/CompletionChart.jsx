import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#D4AF37', '#E5E5E5', '#A38A2C'];

const CompletionChart = ({ data = [] }) => {
    // Overriding backend data directly in frontend so UI updates via hot-reload without a server restart
    const active = data.find(d => d.name === 'Active')?.value || 0;
    const inactive = data.find(d => d.name === 'Dropped' || d.name === 'Inactive')?.value || 0;
    // Summing Completed and Secondary, or just Completed if that's all there is
    const completedVal = data.find(d => d.name === 'Completed')?.value || 0;
    const secondaryVal = data.find(d => d.name === 'Secondary')?.value || 0;
    const completed = completedVal + secondaryVal;

    const chartData = [
        { name: 'Active', value: active },
        { name: 'Inactive', value: inactive },
        { name: 'Completed', value: completed }
    ];

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Program Completion</h3>
            </div>
            <div className="flex-1 w-full relative">
                {chartData.every(d => d.value === 0) ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        No data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                animationDuration={1500}
                                labelLine={true}
                                label={({ name, percent, value }) => value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
                            >
                                {chartData.map((entry, index) => (
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
                )}
            </div>
        </div>
    );
};

export default CompletionChart;
