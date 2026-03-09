import React, { useState, useEffect } from 'react';
import { UserPlus, Download, Trash2, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import StudentFilters from '../components/StudentFilters';
import StudentsTable from '../components/StudentsTable';
import StudentModal from '../components/StudentModal';

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/api/students');
            // Adding a totalPoints property here for components that need it
            const formatted = res.data.map(s => ({ ...s, totalPoints: 250, enrolledDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }));
            setStudents(formatted);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

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

    const handleSaveStudent = async (savedStudent) => {
        try {
            if (editingStudent) {
                // Determine Staff ID (if not changed, it might still have the name or old value, so proper handling is needed. Assuming it passes correct ID)
                await api.put(`/api/students/${editingStudent._id}`, savedStudent);
            } else {
                await api.post('/api/students', savedStudent);
            }
            fetchStudents(); // Refresh data
            setIsModalOpen(false);
            setEditingStudent(null);
        } catch (error) {
            console.error("Error saving student:", error);
            alert("Error saving student. Please ensure all values including Staff are selected.");
        }
    };

    const handleDeleteRequest = (student) => setDeleteTarget(student);

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/api/students/${deleteTarget._id}`);
            fetchStudents();
            setDeleteTarget(null);
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student.");
        }
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
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
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
                        <p className="text-primary font-bold text-lg mb-6">"{deleteTarget.name}"?</p>
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
