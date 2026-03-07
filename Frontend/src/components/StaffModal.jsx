import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const StaffModal = ({ isOpen, onClose, onSave, editStaff = null }) => {
    const isEditing = !!editStaff;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Staff',
        status: 'Active',
        password: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setFormData({
                    name: editStaff.name || '',
                    email: editStaff.email || '',
                    role: editStaff.role || 'Staff',
                    status: editStaff.status || 'Active',
                    password: ''
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    role: 'Staff',
                    status: 'Active',
                    password: ''
                });
            }
        }
    }, [isOpen, editStaff, isEditing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: isEditing ? editStaff.id : Date.now(),
            ...formData
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[600px] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                        {isEditing ? 'Edit Staff' : 'Add Staff'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">
                                Staff Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                placeholder="e.g. Sarah Lee"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                placeholder="name@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-pointer focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-pointer focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <div className="pt-1">
                                {formData.status === 'Active' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-800">
                                        Inactive
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">
                            Password {isEditing ? '' : <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="password"
                            required={!isEditing}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:font-normal placeholder:text-gray-400 font-medium"
                            placeholder="Enter password"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {isEditing ? 'Leave blank to keep current password.' : 'Password is required when creating a new staff account.'}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-4 pt-6 border-t border-gray-100 mt-6 md:mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
                        >
                            Save Staff
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffModal;
