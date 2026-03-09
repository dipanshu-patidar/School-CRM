import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import StaffModal from './StaffModal';
import { getAllStaff, createStaff, updateStaff, deleteStaff } from '../api/staffApi';

const StaffManagement = () => {
    const [staffList, setStaffList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStaff = async () => {
        try {
            setIsLoading(true);
            const response = await getAllStaff();
            setStaffList(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch staff members');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSaveStaff = async (staffData) => {
        try {
            if (editingStaff) {
                await updateStaff(editingStaff._id, staffData);
            } else {
                await createStaff(staffData);
            }
            fetchStaff();
            setIsModalOpen(false);
            setEditingStaff(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving staff');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await deleteStaff(id);
                fetchStaff();
            } catch (err) {
                alert('Error deleting staff');
            }
        }
    };

    const handleEdit = (staff) => {
        setEditingStaff(staff);
        setIsModalOpen(true);
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">Staff Members</h2>
                </div>

                <button
                    onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
                >
                    <Plus size={18} />
                    Add Staff
                </button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500 font-medium">Loading staff...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-500 font-medium">{error}</div>
                ) : staffList.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 font-medium">No staff members found.</div>
                ) : (
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
                                <tr key={staff._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{staff.name}</td>
                                    <td className="px-6 py-4 text-sm text-primary hover:underline cursor-pointer">
                                        <a href={`mailto:${staff.email}`}>{staff.email}</a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 capitalize">{staff.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(staff)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer inline-flex"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(staff._id)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer inline-flex"
                                            >
                                                <LogOut size={16} className="rotate-90" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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
