import React, { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import StaffModal from './StaffModal';

const initialStaff = [
    { id: 1, name: 'Sarah Lee', email: 'sarah@email.com', role: 'Staff', status: 'Active' },
    { id: 2, name: 'Admin', email: 'admin@email.com', role: 'Admin', status: 'Active' },
];

const StaffManagement = () => {
    const [staffList, setStaffList] = useState(initialStaff);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const handleSaveStaff = (staffData) => {
        if (editingStaff) {
            setStaffList(prev => prev.map(s => s.id === staffData.id ? staffData : s));
        } else {
            setStaffList(prev => [staffData, ...prev]);
        }
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    const handleEdit = (staff) => {
        setEditingStaff(staff);
        setIsModalOpen(true);
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">Staff Members</h2>
                </div>

                <button
                    onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 cursor-pointer active:scale-95"
                >
                    <Plus size={18} />
                    Add Staff
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {staffList.map((staff) => (
                            <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{staff.name}</td>
                                <td className="px-6 py-4 text-sm text-indigo-600 hover:underline cursor-pointer">
                                    <a href={`mailto:${staff.email}`}>{staff.email}</a>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{staff.role}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{staff.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEdit(staff)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer inline-flex"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 text-sm font-medium text-gray-500">
                {staffList.length} staff members total.
            </div>

            <StaffModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingStaff(null); }}
                onSave={handleSaveStaff}
                editStaff={editingStaff}
            />
        </div>
    );
};

export default StaffManagement;
