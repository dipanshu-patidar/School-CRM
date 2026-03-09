import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentProgressChart = ({ data = [] }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Student Progress</h3>
                <p className="text-sm text-gray-500">Student enrollment over the last 6 months.</p>
            </div>
            <div className="flex-1 w-full relative">
                {data.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        No data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFF',
                                    borderRadius: '12px',
                                    border: '1px solid #F3F4F6',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="students"
                                stroke="#D4AF37"
                                strokeWidth={3}
                                dot={{ r: 6, fill: '#D4AF37', strokeWidth: 2, stroke: '#FFF' }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default StudentProgressChart;

