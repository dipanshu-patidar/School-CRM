import React, { useState } from 'react';
import { Plus, Trash2, StickyNote, Printer } from 'lucide-react';
import api from '../api/axios';

const NotesSection = ({ student, initialNotes = [] }) => {
    const [notes, setNotes] = useState(initialNotes);
    const [newNote, setNewNote] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsSaving(true);
        try {
            const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const res = await api.post(`/api/students/${student._id}/notes`, { text: newNote.trim(), date: today });
            setNotes(res.data.data);
            setNewNote('');
            setShowInput(false);
        } catch (error) {
            console.error('Failed to add note', error);
            alert('Error adding note');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/api/students/${student._id}/notes/${id}`);
            setNotes(res.data.data);
        } catch (error) {
            console.error('Error deleting note', error);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer no-print focus:ring-2 focus:ring-gray-100"
                >
                    <Printer size={16} />
                    Print Notes
                </button>
                <button
                    onClick={() => setShowInput(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer no-print"
                >
                    <Plus size={16} />
                    Add Note
                </button>
            </div>

            {showInput && (
                <div className="bg-primary/5 rounded-xl border border-primary/10 p-4 space-y-3">
                    <textarea
                        autoFocus
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Type your note here..."
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setShowInput(false)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSaving}
                            onClick={handleAddNote}
                            className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:bg-gray-200"
                        >
                            {isSaving ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </div>
            )}

            {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <StickyNote size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No notes yet. Add the first note.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <div key={note._id} className="bg-amber-50 border border-amber-100 rounded-xl p-4 group hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-sm text-gray-800 leading-relaxed flex-1">{note.text}</p>
                                <div className="flex items-center gap-2 no-print">
                                    <button
                                        title="Print Note"
                                        onClick={() => window.print()}
                                        className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:shadow-md bg-white"
                                    >
                                        <Printer size={16} />
                                    </button>
                                    <button
                                        title="Delete Note"
                                        onClick={() => handleDelete(note._id)}
                                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer shadow-sm hover:shadow-md bg-white"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{note.date}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotesSection;
