import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import api from '../api/axios';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const AttendanceTable = ({ student, records = [] }) => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(records);
    const [showInput, setShowInput] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ workshopName: '', pointsEarned: 1 });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [attendanceToDelete, setAttendanceToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleAdd = async () => {
        if (!formData.workshopName.trim()) return;
        setIsSaving(true);
        try {
            const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const payload = { ...formData, date: today };
            const res = await api.post(`/api/students/${student._id}/attendance`, payload);
            setAttendance(res.data.data.attendance || []);
            setFormData({ workshopName: '', pointsEarned: 1 });
            setShowInput(false);
            // Ideally we also trigger a parent fetch here if we wanted points globally updated, but for now this works.
        } catch (error) {
            console.error('Failed to add attendance', error);
            alert('Error adding attendance');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (record) => {
        setAttendanceToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!attendanceToDelete) return;
        setIsDeleting(true);
        try {
            const res = await api.delete(`/api/students/${student._id}/attendance/${attendanceToDelete._id}`);
            setAttendance(res.data.data.attendance || []);
            setIsDeleteModalOpen(false);
            setAttendanceToDelete(null);
        } catch (error) {
            console.error('Error deleting attendance', error);
            alert('Failed to delete attendance record.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => navigate('/dashboard/attendance')}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer no-print"
                >
                    <Plus size={16} />
                    Add Attendance
                </button>
            </div>

            {showInput && (
                <div className="bg-primary/5 rounded-xl border border-primary/10 p-4 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Workshop / Event</label>
                            <input
                                type="text"
                                value={formData.workshopName}
                                onChange={(e) => setFormData(prev => ({ ...prev, workshopName: e.target.value }))}
                                placeholder="eg. Financial Literacy"
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                        <div className="w-32">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Points</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.pointsEarned}
                                onChange={(e) => setFormData(prev => ({ ...prev, pointsEarned: Number(e.target.value) }))}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setShowInput(false)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSaving}
                            onClick={handleAdd}
                            className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:bg-gray-200"
                        >
                            {isSaving ? 'Saving...' : 'Save Record'}
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                {attendance.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No attendance records found.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Workshop Name</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Points Earned</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendance.map((record) => (
                                <tr key={record._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.workshopName}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-emerald-600">+{record.pointsEarned}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{record.date}</td>
                                    <td className="px-6 py-4 text-right no-print">
                                        <button
                                            onClick={() => handleDeleteClick(record)}
                                            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer shadow-sm hover:shadow-md bg-white"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setAttendanceToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Attendance Record"
                message={`Are you sure you want to delete the attendance for "${attendanceToDelete?.workshopName}"? ${attendanceToDelete?.pointsEarned} points will be deducted from the student's total.`}
                confirmText="Delete Record"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default AttendanceTable;
