import React, { useState } from 'react';
import { UserPlus, Download, Trash2, AlertTriangle } from 'lucide-react';
import StudentFilters from '../components/StudentFilters';
import StudentsTable from '../components/StudentsTable';
import StudentModal from '../components/StudentModal';

const initialStudents = [
    { id: 101, name: 'John Doe', points: 120, totalPoints: 250, status: 'Active', phone: '+1 234 567 890', email: 'john@example.com', assignedStaff: 'Sarah Lee', enrolledDate: '01 Jan 2026' },
    { id: 102, name: 'Sara Smith', points: 250, totalPoints: 250, status: 'Completed', phone: '+1 987 654 321', email: 'sara@example.com', assignedStaff: 'Tom Harris', enrolledDate: '15 Jan 2026' },
    { id: 103, name: 'Mike Brown', points: 60, totalPoints: 250, status: 'Active', phone: '+1 456 789 012', email: 'mike@example.com', assignedStaff: 'Sarah Lee', enrolledDate: '20 Jan 2026' },
    { id: 104, name: 'Emily White', points: 180, totalPoints: 250, status: 'Active', phone: '+1 321 654 987', email: 'emily@example.com', assignedStaff: 'Carol Kim', enrolledDate: '05 Feb 2026' },
    { id: 105, name: 'David Black', points: 300, totalPoints: 300, status: 'Completed', phone: '+1 654 321 789', email: 'david@example.com', assignedStaff: 'Tom Harris', enrolledDate: '10 Feb 2026' },
];

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [students, setStudents] = useState(initialStudents);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    // Delete modal state
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAddStudent = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleSaveStudent = (savedStudent) => {
        if (editingStudent) {
            setStudents(prev => prev.map(s => s.id === savedStudent.id ? savedStudent : s));
        } else {
            setStudents(prev => [...prev, savedStudent]);
        }
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const handleDeleteRequest = (student) => setDeleteTarget(student);

    const handleConfirmDelete = () => {
        setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                    <p className="text-gray-500 mt-1">Manage and track all students enrolled in the program.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
                        <Download size={18} />
                        Export
                    </button>
                    <button
                        onClick={handleAddStudent}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 cursor-pointer active:scale-95"
                    >
                        <UserPlus size={18} />
                        Add Student
                    </button>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="space-y-4">
                <StudentFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    totalStudents={students.length}
                />
                <StudentsTable
                    students={filteredStudents}
                    onAddStudent={handleAddStudent}
                    onDeleteStudent={handleDeleteRequest}
                    onEditStudent={handleEditStudent}
                />
            </div>

            {/* Add / Edit Student Modal */}
            <StudentModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingStudent(null); }}
                onSave={handleSaveStudent}
                editStudent={editingStudent}
            />

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Student</h3>
                        <p className="text-gray-500 mb-2">Are you sure you want to delete</p>
                        <p className="text-indigo-600 font-bold text-lg mb-6">"{deleteTarget.name}"?</p>
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8 w-full">
                            <AlertTriangle size={16} className="shrink-0" />
                            This action cannot be undone. All data will be permanently removed.
                        </div>
                        <div className="flex items-center gap-4 w-full">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer">Cancel</button>
                            <button onClick={handleConfirmDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-100 cursor-pointer active:scale-95">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
