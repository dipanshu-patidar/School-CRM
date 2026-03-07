import React, { useState } from 'react';
import { Plus, Trash2, StickyNote } from 'lucide-react';

const NotesSection = () => {
    const [notes, setNotes] = useState([
        { id: 1, text: 'Student needs housing support.', date: '10 Mar 2026' },
        { id: 2, text: 'Good progress in workshops this week.', date: '12 Mar 2026' },
    ]);
    const [newNote, setNewNote] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        setNotes(prev => [
            { id: Date.now(), text: newNote.trim(), date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
            ...prev,
        ]);
        setNewNote('');
        setShowInput(false);
    };

    const handleDelete = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowInput(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer"
                >
                    <Plus size={16} />
                    Add Note
                </button>
            </div>

            {showInput && (
                <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 space-y-3">
                    <textarea
                        autoFocus
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Type your note here..."
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setShowInput(false)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddNote}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all cursor-pointer"
                        >
                            Save Note
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
                        <div key={note.id} className="bg-amber-50 border border-amber-100 rounded-xl p-4 group hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-sm text-gray-800 leading-relaxed flex-1">{note.text}</p>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                                >
                                    <Trash2 size={14} />
                                </button>
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
