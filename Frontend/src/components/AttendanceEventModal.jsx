import React, { useState, useEffect } from 'react';
import { X, UserCheck, BookOpen, Star, Calendar, Trash2, Pencil } from 'lucide-react';

const STUDENTS = [
    { id: 101, name: 'John Doe' },
    { id: 102, name: 'Sara Smith' },
    { id: 103, name: 'Mike Brown' },
    { id: 104, name: 'Emily White' },
    { id: 105, name: 'David Black' },
];

const WORKSHOPS = [
    'Financial Literacy',
    'Social Wellness',
    'Emotional Support',
    'Career Development',
];

/* ── Mark Attendance Modal ─────────────────── */
export const MarkAttendanceModal = ({ isOpen, selectedDate, onClose, onSave }) => {
    const [form, setForm] = useState({
        studentId: '',
        workshop: '',
        date: selectedDate || '',
    });

    useEffect(() => {
        if (isOpen) {
            setForm({ studentId: '', workshop: '', date: selectedDate || '' });
        }
    }, [isOpen, selectedDate]);

    if (!isOpen) return null;

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.studentId || !form.workshop || !form.date) return;
        const student = STUDENTS.find(s => s.id === parseInt(form.studentId));
        onSave({
            id: Date.now(),
            studentId: parseInt(form.studentId),
            studentName: student?.name || '',
            workshop: form.workshop,
            date: form.date,
            points: 1,
        });
        onClose();
    };

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
                            <p className="text-xs text-gray-500">Record a workshop attendance (+1 point).</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Student */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Select Student <span className="text-red-400">*</span>
                        </label>
                        <select name="studentId" value={form.studentId} onChange={handleChange} required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
                            <option value="">Choose a student...</option>
                            {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    {/* Workshop */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Select Workshop <span className="text-red-400">*</span>
                        </label>
                        <select name="workshop" value={form.workshop} onChange={handleChange} required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
                            <option value="">Choose a workshop...</option>
                            {WORKSHOPS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Date <span className="text-red-400">*</span>
                        </label>
                        <input type="date" name="date" value={form.date} onChange={handleChange} required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    </div>

                    {/* Points info */}
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                        <Star size={16} className="text-primary shrink-0" />
                        <p className="text-xs text-gray-600 font-bold">Points Awarded: <span className="text-primary">+1 Point</span> (auto-assigned)</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-bold hover:bg-gray-50 cursor-pointer transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 flex items-center justify-center gap-2">
                            <UserCheck size={16} /> Save Attendance
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
                        <button onClick={() => { onDelete(record.id); onClose(); }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold cursor-pointer transition-all">
                            <Trash2 size={15} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
