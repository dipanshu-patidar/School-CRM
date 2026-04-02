import React, { useState, useEffect } from 'react';
import { UserPlus, Download, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import StudentFilters from '../components/StudentFilters';
import StudentsTable from '../components/StudentsTable';
import StudentModal from '../components/StudentModal';
import { getAllStudents, createStudent, updateStudent, deleteStudent } from '../api/studentApi';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const StudentsPage = ({ role }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    // Delete modal state
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await getAllStudents();
            setStudents(Array.isArray(data) ? data : (data.data || []));
            setError(null);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Failed to load students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = (students || []).filter(student => {
        const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student._id?.toString().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

        // Date Filter Logic
        let matchesDate = true;
        if (dateFrom || dateTo) {
            const studentDate = student.startDate ? new Date(student.startDate) : (student.createdAt ? new Date(student.createdAt) : null);
            if (!studentDate) {
                matchesDate = false;
            } else {
                const start = dateFrom ? new Date(dateFrom) : null;
                const end = dateTo ? new Date(dateTo) : null;
                
                if (start) {
                    start.setHours(0, 0, 0, 0);
                    if (studentDate < start) matchesDate = false;
                }
                if (end) {
                    end.setHours(23, 59, 59, 999);
                    if (studentDate > end) matchesDate = false;
                }
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const handleAddStudent = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleSaveStudent = async (studentData) => {
        const savePromise = editingStudent
            ? updateStudent(editingStudent._id, studentData)
            : createStudent(studentData);

        toast.promise(savePromise, {
            loading: editingStudent ? 'Updating student...' : 'Adding student...',
            success: editingStudent ? 'Student updated successfully!' : 'Student added successfully!',
            error: (err) => err.response?.data?.message || 'Error saving student'
        }).then(() => {
            fetchStudents();
            setIsModalOpen(false);
            setEditingStudent(null);
        }).catch((err) => console.error('Error saving student:', err));
    };

    const handleDeleteRequest = (student) => setDeleteTarget(student);

    const handleConfirmDelete = async () => {
        const deletePromise = deleteStudent(deleteTarget._id);
        toast.promise(deletePromise, {
            loading: 'Deleting student...',
            success: 'Student deleted successfully!',
            error: 'Error deleting student'
        }).then(() => {
            fetchStudents();
            setDeleteTarget(null);
        }).catch((err) => console.error('Error deleting student:', err));
    };

    const handleExport = () => {
        if (!filteredStudents || filteredStudents.length === 0) {
            toast.error('No students to export');
            return;
        }

        const exportData = filteredStudents.map(student => ({
            'Student ID': student.studentId,
            'Name': student.name,
            'Email': student.email,
            'Phone': student.phone || 'N/A',
            'Status': student.status,
            'Points': `${student.points || 0} / ${student.totalPoints || 250}`,
            'Assigned Staff': student.assignedStaff?.name || 'Unassigned',
            'Enrolled Date': student.startDate 
                ? new Date(student.startDate).toLocaleDateString('en-GB') 
                : (student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-GB') : 'N/A')
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");

        // Generate Excel file and trigger download
        XLSX.writeFile(wb, "Student_List.xlsx");
        toast.success('Students exported successfully!');
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
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
                    >
                        <Download size={18} />
                        Export
                    </button>
                    {role === 'admin' && (
                        <button
                            onClick={handleAddStudent}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
                        >
                            <UserPlus size={18} />
                            Add Student
                        </button>
                    )}
                </div>
            </div>

            {/* Filters & Table */}
            <div className="space-y-4">
                <StudentFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    totalStudents={filteredStudents.length}
                />

                {loading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading students...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm py-20 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Failed to load data</h3>
                        <p className="text-gray-500 max-w-xs mb-6">{error}</p>
                        <button onClick={fetchStudents} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all cursor-pointer">
                            Try Again
                        </button>
                    </div>
                ) : (
                    <StudentsTable
                        students={filteredStudents}
                        onAddStudent={handleAddStudent}
                        onDeleteStudent={handleDeleteRequest}
                        onEditStudent={handleEditStudent}
                        role={role}
                    />
                )}
            </div>

            {/* Add / Edit Student Modal */}
            <StudentModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingStudent(null); }}
                onSave={handleSaveStudent}
                editStudent={editingStudent}
                role={role}
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
