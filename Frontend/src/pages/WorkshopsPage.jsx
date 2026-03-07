import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, X, BookOpen, Pencil, Eye, Calendar, Star } from 'lucide-react';
import WorkshopTable from '../components/WorkshopTable';
import WorkshopRuleCard from '../components/WorkshopRuleCard';

const initialWorkshops = [
    { id: 1, name: 'Financial Literacy', points: 1, createdDate: '12 Jan 2026' },
    { id: 2, name: 'Social Wellness', points: 1, createdDate: '15 Jan 2026' },
    { id: 3, name: 'Emotional Support', points: 1, createdDate: '18 Jan 2026' },
    { id: 4, name: 'Career Development', points: 1, createdDate: '22 Jan 2026' },
];

/* ── Workshop Modal ──────────────────────────── */
const WorkshopModal = ({ isOpen, onClose, onSave, editWorkshop = null }) => {
    const isEditing = !!editWorkshop;
    const [name, setName] = useState(editWorkshop?.name || '');
    const [description, setDescription] = useState(editWorkshop?.description || '');

    React.useEffect(() => {
        if (isOpen) {
            setName(editWorkshop?.name || '');
            setDescription(editWorkshop?.description || '');
        }
    }, [isOpen, editWorkshop]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({
            id: isEditing ? editWorkshop.id : Date.now(),
            name: name.trim(),
            description: description.trim(),
            points: 1,
            createdDate: isEditing
                ? editWorkshop.createdDate
                : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
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
                        <div className="p-2 bg-primary/10 rounded-xl">
                            {isEditing ? <Pencil size={18} className="text-primary" /> : <BookOpen size={18} className="text-primary" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{isEditing ? 'Edit Workshop' : 'Add Workshop'}</h3>
                            <p className="text-xs text-gray-500">{isEditing ? 'Update workshop name.' : 'Create a new learning session.'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Workshop Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Financial Literacy"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the workshop objectives and topics covered..."
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        />
                    </div>

                    {/* Points Info */}
                    <div className="flex items-center gap-4 p-4 bg-[#FDFCF6] border border-primary/20 rounded-xl shadow-sm">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 shrink-0">
                            <span className="text-sm font-black text-black leading-none">+1</span>
                            <span className="text-[10px] font-black text-black/60 uppercase tracking-tighter leading-none mt-0.5">Point</span>
                        </div>
                        <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                            Each attendance at this workshop grants <strong className="text-gray-900">+1 point</strong> toward student completion.
                        </p>
                    </div>

                    {/* Footer actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 flex items-center justify-center gap-2">
                            {isEditing ? <><Pencil size={15} /> Save Changes</> : <><Plus size={15} /> Add Workshop</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ── Workshop View Modal ─────────────────────── */
const WorkshopViewModal = ({ workshop, onClose }) => {
    if (!workshop) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                {/* Coloured top strip */}
                <div className="h-2 bg-primary w-full shadow-[0_0_15px_rgba(212,175,55,0.3)]" />

                {/* Header */}
                <div className="flex items-start justify-between px-8 pt-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            W
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{workshop.name}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                                <Calendar size={12} />
                                <span>Created {workshop.createdDate}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-8 pb-8 space-y-5">
                    {/* Points Badge */}
                    <div className="flex items-center gap-4 p-4 bg-[#FDFCF6] border border-primary/20 rounded-2xl shadow-sm">
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 shrink-0">
                            <span className="text-sm font-black text-black leading-none">+1</span>
                            <span className="text-[10px] font-black text-black/60 uppercase tracking-tighter leading-none mt-0.5">Point</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Points Reward</p>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                Each attendance grants <strong className="text-primary font-bold">+1 point</strong> toward program completion.
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                        {workshop.description ? (
                            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                                {workshop.description}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 italic bg-gray-50 rounded-xl p-4 border border-gray-100">
                                No description provided for this workshop.
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Main Page ───────────────────────────────── */
const WorkshopsPage = () => {
    const [workshops, setWorkshops] = useState(initialWorkshops);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);

    const handleAdd = () => {
        setEditingWorkshop(null);
        setIsModalOpen(true);
    };

    const handleEdit = (workshop) => {
        setEditingWorkshop(workshop);
        setIsModalOpen(true);
    };

    const handleSave = (saved) => {
        if (editingWorkshop) {
            setWorkshops(prev => prev.map(w => w.id === saved.id ? saved : w));
        } else {
            setWorkshops(prev => [...prev, saved]);
        }
        setIsModalOpen(false);
        setEditingWorkshop(null);
    };

    const handleConfirmDelete = () => {
        setWorkshops(prev => prev.filter(w => w.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Workshops</h1>
                    <p className="text-gray-500 mt-1">Manage program workshops and track learning sessions.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 self-start sm:self-auto"
                >
                    <Plus size={18} />
                    Add Workshop
                </button>
            </div>

            {/* Rule Info Card */}
            <WorkshopRuleCard />

            {/* Table */}
            <WorkshopTable
                workshops={workshops}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onAdd={handleAdd}
                onView={setViewTarget}
            />

            {/* Workshop View Modal */}
            <WorkshopViewModal workshop={viewTarget} onClose={() => setViewTarget(null)} />

            {/* Add / Edit Modal */}
            <WorkshopModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingWorkshop(null); }}
                onSave={handleSave}
                editWorkshop={editingWorkshop}
            />

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                            <Trash2 size={30} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Workshop</h3>
                        <p className="text-gray-500 mb-1">Are you sure you want to delete</p>
                        <p className="text-primary font-bold text-lg mb-6">"{deleteTarget.name}"?</p>
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8 w-full">
                            <AlertTriangle size={15} className="shrink-0" />
                            Student attendance records linked to this workshop will remain unaffected.
                        </div>
                        <div className="flex gap-4 w-full">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer">Cancel</button>
                            <button onClick={handleConfirmDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-100 cursor-pointer active:scale-95">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkshopsPage;
