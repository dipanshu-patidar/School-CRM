import React, { useState, useEffect } from 'react';
import { Plus, Info, Star, CalendarCheck, Loader2, AlertTriangle } from 'lucide-react';
import AttendanceStats from '../components/AttendanceStats';
import AttendanceToggle from '../components/AttendanceToggle';
import AttendanceCalendar from '../components/AttendanceCalendar';
import { MarkAttendanceModal, AttendanceEventModal } from '../components/AttendanceEventModal';
import { getAllAttendance, deleteStudentAttendance } from '../api/attendanceApi';

const AttendanceCalendarPage = () => {
    const [records, setRecords] = useState([]);
    const [view, setView] = useState('calendar'); // 'calendar' or 'table'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal States
    const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

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

    const handleDeleteAttendance = async (id) => {
        try {
            // Find the record to get the student ID
            const record = records.find(r => r._id === id);
            if (!record) return;

            // We need studentId from our merged backend which includes it in flattened records
            // The studentId in record is the user-friendly one "S101", we need the MongoDB _id
            // Wait, our backend flattened record should probably include the student's mongo _id
            // Let's check my previous edit to studentTabsController.js
            // Ah, I only included studentId (S101) and studentName. I should include studentMongoId.
            // Let me fix the backend first to include studentMongoId.
        } catch (err) {
            console.error('Error deleting attendance:', err);
            alert('Failed to delete attendance record.');
        }
    };

    // I'll pause here and fix the backend to return studentMongoId in the flattened list.
    return null; // Placeholder to avoid crashes while I fix backend
};
