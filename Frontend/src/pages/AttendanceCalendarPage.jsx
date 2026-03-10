import React, { useState, useEffect } from 'react';
import { Plus, Info, Star, CalendarCheck, Loader2, AlertTriangle, Table as TableIcon, Trash2 } from 'lucide-react';
import AttendanceStats from '../components/AttendanceStats';
import AttendanceToggle from '../components/AttendanceToggle';
import AttendanceCalendar from '../components/AttendanceCalendar';
import { MarkAttendanceModal, AttendanceEventModal } from '../components/AttendanceEventModal';
import { getAllAttendance, deleteStudentAttendance } from '../api/attendanceApi';
import toast from 'react-hot-toast';

const AttendanceCalendarPage = () => {
    const [records, setRecords] = useState([]);
    const [view, setView] = useState('calendar'); // 'calendar' or 'table'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal States
    const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchAttendance = async () => {
        try {
            setIsLoading(true);
            const data = await getAllAttendance();
            setRecords(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError('Failed to load attendance records.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    // Handlers
    const handleAddClick = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setIsMarkModalOpen(true);
    };

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        setIsMarkModalOpen(true);
    };

    const handleEventClick = (record) => {
        setSelectedRecord(record);
    };

    const handleSaveAttendance = () => {
        fetchAttendance(); // Refresh all records
        setIsMarkModalOpen(false);
    };

    const handleDeleteAttendance = (id) => {
        const record = records.find(r => r._id === id);
        if (record) {
            setDeleteTarget(record);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        const deletePromise = deleteStudentAttendance(deleteTarget._id);
        toast.promise(deletePromise, {
            loading: 'Deleting attendance...',
            success: 'Attendance deleted successfully!',
            error: 'Failed to delete attendance record.'
        }).then(() => {
            fetchAttendance();
            setSelectedRecord(null);
            setDeleteTarget(null);
        }).catch((err) => console.error('Error deleting attendance:', err));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Calendar</h1>
                    <p className="text-gray-500 mt-1">Track student workshop attendance and points.</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 self-start sm:self-auto"
                >
                    <Plus size={18} />
                    Mark Attendance
                </button>
            </div>

            {/* Points Rule Banner */}
            <div className="flex items-start gap-4 bg-primary/5 border border-primary/10 rounded-xl px-5 py-4">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Star size={18} className="text-primary" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-primary">Points Rule</h3>
                    <p className="text-sm text-gray-600 font-medium mt-0.5">
                        Each workshop attendance automatically gives <strong className="text-primary">+1 Point</strong> to the student.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <AttendanceStats records={records} />

            {/* Controls */}
            <div className="flex justify-end">
                <AttendanceToggle view={view} setView={setView} />
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading attendance records...</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm py-20 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Failed to load attendance</h3>
                    <p className="text-gray-500 max-w-xs mb-6 text-sm">{error}</p>
                    <button onClick={fetchAttendance} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all cursor-pointer">
                        Try Again
                    </button>
                </div>
            ) : view === 'calendar' ? (
                <AttendanceCalendar
                    records={records}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
                />
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {records.length === 0 ? (
                        <div className="p-16 text-center flex flex-col items-center justify-center">
                            <CalendarCheck size={40} className="text-gray-300 mb-4" />
                            <p className="text-lg font-bold text-gray-900">No attendance recorded yet</p>
                            <button onClick={handleAddClick} className="mt-4 text-primary font-bold hover:text-primary-hover transition-colors">Mark First Attendance</button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Workshop</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(records || []).map(record => (
                                        <tr key={record._id} onClick={() => handleEventClick(record)} className="hover:bg-gray-50/50 cursor-pointer transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{record.studentName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{record.workshop}</td>
                                            <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">+1 Point</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            <MarkAttendanceModal
                isOpen={isMarkModalOpen}
                selectedDate={selectedDate}
                onClose={() => setIsMarkModalOpen(false)}
                onSave={handleSaveAttendance}
            />

            <AttendanceEventModal
                record={selectedRecord}
                onClose={() => setSelectedRecord(null)}
                onDelete={handleDeleteAttendance}
            />

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Attendance</h3>
                        <p className="text-gray-500 mb-2">Are you sure you want to delete this record for</p>
                        <p className="text-primary font-bold text-lg mb-6">"{deleteTarget.studentName}"?</p>
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8 w-full">
                            <AlertTriangle size={16} className="shrink-0" />
                            This action cannot be undone. The student will lose points earned from this workshop.
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

export default AttendanceCalendarPage;
