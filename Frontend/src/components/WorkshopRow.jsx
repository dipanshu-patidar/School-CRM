import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';

const WorkshopRow = ({ workshop, onEdit, onDelete, onView }) => {
    return (
        <>
            {/* Desktop row */}
            <tr className="hidden md:table-row hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            W
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-900">{workshop.name}</span>
                            {workshop.description && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{workshop.description}</p>
                            )}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        +{workshop.pointsReward} {workshop.pointsReward === 1 ? 'Point' : 'Points'}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{workshop.createdDate}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                        <button title="View Workshop" onClick={() => onView(workshop)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
                            <Eye size={16} />
                        </button>
                        <button title="Edit Workshop" onClick={() => onEdit(workshop)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer">
                            <Pencil size={16} />
                        </button>
                        <button title="Delete Workshop" onClick={() => onDelete(workshop)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Mobile card */}
            <div className="md:hidden bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            W
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm">{workshop.name}</h4>
                            <p className="text-xs text-gray-400">{workshop.createdDate}</p>
                            {workshop.description && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{workshop.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">+{workshop.pointsReward}</span>
                        <button onClick={() => onView(workshop)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"><Eye size={15} /></button>
                        <button onClick={() => onEdit(workshop)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"><Pencil size={15} /></button>
                        <button onClick={() => onDelete(workshop)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"><Trash2 size={15} /></button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WorkshopRow;
