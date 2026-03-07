import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import StudentForm from './StudentForm';

const EMPTY_FORM = {
    name: '',
    phone: '',
    email: '',
    assignedStaff: '',
    status: 'Active',
    points: '',
};

const StudentModal = ({ isOpen, onClose, onSave, editStudent = null }) => {
    const isEditing = !!editStudent;
    const [form, setForm] = useState({ ...EMPTY_FORM });

    // Sync form whenever modal opens or editStudent changes
    useEffect(() => {
        if (isOpen) {
            setForm(editStudent ? { ...editStudent } : { ...EMPTY_FORM });
        }
    }, [isOpen, editStudent]);

    if (!isOpen) return null;


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email) return;
        onSave({
            ...form,
            points: parseInt(form.points) || 0,
            totalPoints: 250,
            id: isEditing ? editStudent.id : Date.now(),
            enrolledDate: isEditing ? editStudent.enrolledDate : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            {isEditing ? <Save size={20} className="text-indigo-600" /> : <UserPlus size={20} className="text-indigo-600" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {isEditing ? 'Edit Student' : 'Add Student'}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {isEditing ? 'Update student information.' : 'Fill in the details to enroll a new student.'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit}>
                    <div className="px-8 py-6">
                        <StudentForm form={form} onChange={handleChange} />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-200 bg-white rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-100 cursor-pointer active:scale-95"
                        >
                            {isEditing ? <Save size={16} /> : <UserPlus size={16} />}
                            {isEditing ? 'Save Changes' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentModal;
