import React, { useState } from 'react';
import { Plus, Info, Star, CalendarCheck, Table as TableIcon } from 'lucide-react';
import AttendanceStats from '../components/AttendanceStats';
import AttendanceToggle from '../components/AttendanceToggle';
import AttendanceCalendar from '../components/AttendanceCalendar';
import { MarkAttendanceModal, AttendanceEventModal } from '../components/AttendanceEventModal';

// Mock Initial Data
const initialRecords = [
    { id: 1, studentId: 101, studentName: 'John Doe', workshop: 'Financial Literacy', date: new Date().toISOString().split('T')[0], points: 1 },
    { id: 2, studentId: 102, studentName: 'Sara Smith', workshop: 'Social Wellness', date: new Date().toISOString().split('T')[0], points: 1 },
];

const AttendanceCalendarPage = () => {
    const [records, setRecords] = useState(initialRecords);
    const [view, setView] = useState('calendar'); // 'calendar' or 'table'

    // Modal States
    const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const [selectedRecord, setSelectedRecord] = useState(null);

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

    const handleSaveAttendance = (newRecord) => {
        setRecords(prev => [...prev, newRecord]);
    };

    const handleDeleteAttendance = (id) => {
        setRecords(prev => prev.filter(r => r.id !== id));
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
            {view === 'calendar' ? (
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
                                    {records.sort((a, b) => new Date(b.date) - new Date(a.date)).map(record => (
                                        <tr key={record.id} onClick={() => handleEventClick(record)} className="hover:bg-gray-50/50 cursor-pointer transition-colors">
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
        </div>
    );
};

export default AttendanceCalendarPage;
