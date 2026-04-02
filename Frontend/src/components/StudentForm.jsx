import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { getSettings } from '../api/settingApi';

const StudentForm = ({ form, onChange, role }) => {
    const [staffOptions, setStaffOptions] = useState([]);
    const [threshold, setThreshold] = useState(250);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffRes, settingsRes] = await Promise.all([
                    api.get('/api/users/staff'),
                    getSettings()
                ]);
                setStaffOptions(staffRes.data.data);
                if (settingsRes.success) {
                    setThreshold(settingsRes.data.completionPointsThreshold);
                }
            } catch (err) {
                console.error('Failed to fetch initial data', err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-5">
            {/* Row 0: Student ID */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Student ID
                    </label>
                    <input
                        type="text"
                        name="studentId"
                        value={form.studentId || ''}
                        onChange={onChange}
                        placeholder="Auto-generated (e.g. STU-001)"
                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm placeholder-gray-400 focus:outline-none cursor-not-allowed"
                        disabled
                    />
                </div>
            </div>

            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Student Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="e.g. +1 234 567 890"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                    />
                </div>
            </div>

            {/* Row 2: Email + Assigned Staff */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="e.g. john@example.com"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Assigned Staff <span className="text-red-400">*</span>
                    </label>
                    <select
                        name="assignedStaff"
                        value={form.assignedStaff?.id || form.assignedStaff?._id || form.assignedStaff || ''}
                        onChange={onChange}
                        className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none ${role !== 'admin' ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                        required
                        disabled={role !== 'admin'}
                    >
                        <option value="">Select staff member...</option>
                        {staffOptions.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                    </select>
                </div>
            </div>

            {/* Row 3: Start Date + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Start Date <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate ? form.startDate.split('T')[0] : ''}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Status
                    </label>
                    <select
                        name="status"
                        value={form.status || 'Active'}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none"
                    >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Secondary Completion">Secondary Completion</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </div>
            </div>

            {/* Row 4: Current Points Info (Points input is commented out) */}
            <div className="grid grid-cols-1 gap-4">
                <div>
                    {/* Manual point entry is disabled by company policy */}
                    {/* <input type="number" ... /> */}
                    <p className="text-xs text-end text-gray-400">
                        Status auto-sets to <span className="font-bold text-primary">Completed</span> when points ≥ {threshold}.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentForm;
