import React, { useState, useEffect } from 'react';
import { X, UserCheck, BookOpen, Star, Calendar, Trash2, Pencil, Loader2, Search } from 'lucide-react';
import { getStudents } from '../api/studentApi';
import { getWorkshops } from '../api/workshopApi';
import { addStudentAttendance } from '../api/attendanceApi';
import toast from 'react-hot-toast';

/* ── Mark Attendance Modal ─────────────────── */
export const MarkAttendanceModal = ({ isOpen, selectedDate, onClose, onSave }) => {
    const [students, setStudents] = useState([]);
    const [workshops, setWorkshops] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [form, setForm] = useState({
        studentMongoId: '',
        workshop: '',
        date: selectedDate || '',
    });

    useEffect(() => {
        if (isOpen) {
            setForm({ studentMongoId: '', workshop: '', date: selectedDate || '' });
            setSearchTerm('');
            setDropdownOpen(false);
            fetchData();
        }
    }, [isOpen, selectedDate]);

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [studentData, workshopData] = await Promise.all([
                getStudents(),
                getWorkshops()
            ]);
            setStudents(studentData);
            setWorkshops(workshopData);
        } catch (err) {
            console.error('Error fetching modal data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.studentMongoId || !form.workshop || !form.date) return;

        setIsLoading(true);

        // Find selected workshop to get its points
        const selectedWorkshop = workshops.find(w => w.name === form.workshop);
        const pointsReward = selectedWorkshop?.pointsReward || 1;

        const addPromise = addStudentAttendance(form.studentMongoId, {
            workshopName: form.workshop,
            pointsEarned: pointsReward,
            date: form.date
        });

        toast.promise(addPromise, {
            loading: 'Saving attendance...',
            success: 'Attendance saved successfully!',
            error: 'Failed to save attendance record.'
        }).then(() => {
            onSave(); // Refresh parent
        }).catch((err) => {
            console.error('Error saving attendance:', err);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const selectedWorkshopObj = workshops.find(w => w.name === form.workshop);
    const currentPoints = selectedWorkshopObj?.pointsReward || 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl"><UserCheck size={20} className="text-primary" /></div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Mark Attendance</h3>
                            <p className="text-xs text-gray-500">Record a workshop attendance ({form.workshop ? `+${currentPoints} ${currentPoints === 1 ? 'point' : 'points'}` : 'earn points'}).</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Student Select with Search */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Select Student <span className="text-red-400">*</span>
                        </label>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={isLoading ? 'Loading students...' : 'Search by name or ID...'}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setDropdownOpen(true);
                                }}
                                onFocus={() => setDropdownOpen(true)}
                                disabled={isLoading}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <Search size={16} />
                            </div>
                        </div>

                        {/* Dropdown Results */}
                        {dropdownOpen && !isLoading && (
                            <>
                                <div className="fixed inset-0 z-[60]" onClick={() => setDropdownOpen(false)} />
                                <div className="absolute z-[70] left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map(s => (
                                            <button
                                                key={s._id}
                                                type="button"
                                                onClick={() => {
                                                    setForm(prev => ({ ...prev, studentMongoId: s._id }));
                                                    setSearchTerm(`${s.name} (${s.id})`);
                                                    setDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-gray-50 last:border-0 flex flex-col gap-0.5 ${form.studentMongoId === s._id ? 'bg-primary/10' : ''}`}
                                            >
                                                <span className="text-sm font-bold text-gray-900">{s.name}</span>
                                                <span className="text-xs text-gray-500">ID: {s.id}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-gray-400">
                                            <p className="text-sm font-medium">No students matched "{searchTerm}"</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <input type="hidden" name="studentMongoId" value={form.studentMongoId} required />
                    </div>

                    {/* Workshop */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Select Workshop <span className="text-red-400">*</span>
                        </label>
                        <select
                            name="workshop"
                            value={form.workshop}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer disabled:opacity-50"
                        >
                            <option value="">{isLoading ? 'Loading workshops...' : 'Choose a workshop...'}</option>
                            {workshops.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Date <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    {/* Points info */}
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                        <Star size={16} className="text-primary shrink-0" />
                        <p className="text-xs text-gray-600 font-bold">Points Awarded: <span className="text-primary">+{currentPoints} {currentPoints === 1 ? 'Point' : 'Points'}</span></p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-bold hover:bg-gray-50 cursor-pointer transition-all">Cancel</button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                            Save Attendance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ── Event Detail Modal ─────────────────────── */
export const AttendanceEventModal = ({ record, onClose, onDelete }) => {
    if (!record) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="h-1.5 bg-primary" />
                <div className="p-7">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900">Attendance Record</h3>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"><X size={18} /></button>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <UserCheck size={16} className="text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">Student</p>
                                <p className="text-sm font-bold text-gray-900">{record.studentName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <BookOpen size={16} className="text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">Workshop</p>
                                <p className="text-sm font-bold text-gray-900">{record.workshop}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Calendar size={16} className="text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400">Date</p>
                                <p className="text-sm font-bold text-gray-900">{new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                            <Star size={16} className="text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-primary/70">Points Earned</p>
                                <p className="text-sm font-black text-primary">+{record.points} Point</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 cursor-pointer transition-all">Close</button>
                        <button onClick={() => { onDelete(record._id); }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold cursor-pointer transition-all">
                            <Trash2 size={15} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
