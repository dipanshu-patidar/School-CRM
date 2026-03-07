import React from 'react';
import WorkshopRow from './WorkshopRow';
import { BookOpen } from 'lucide-react';

const WorkshopTable = ({ workshops, onEdit, onDelete, onAdd, onView }) => {
    if (!workshops || workshops.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <BookOpen size={36} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No workshops created yet</h3>
                <p className="text-gray-500 max-w-xs mb-8">Start by adding your first workshop to the program.</p>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-100 cursor-pointer active:scale-95"
                >
                    <BookOpen size={18} />
                    Create First Workshop
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Workshop Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Points Reward</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {workshops.map((w) => (
                            <WorkshopRow key={w.id} workshop={w} onEdit={onEdit} onDelete={onDelete} onView={onView} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden p-4 bg-gray-50/30">
                {workshops.map((w) => (
                    <WorkshopRow key={w.id} workshop={w} onEdit={onEdit} onDelete={onDelete} onView={onView} />
                ))}
            </div>

            {/* Table Footer */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{workshops.length}</span> workshop{workshops.length !== 1 ? 's' : ''} in program
                </p>
            </div>
        </div>
    );
};

export default WorkshopTable;
