import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentRow = ({ student, onDelete, onEdit }) => {
    const navigate = useNavigate();

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Completed': return 'bg-primary/10 text-primary border-primary/20';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <>
            {/* Desktop */}
            <tr className="hidden md:table-row hover:bg-gray-50/50 transition-colors group cursor-pointer">
                <td className="px-6 py-4 text-sm font-medium text-gray-500">{student.studentId || student.id}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110">
                            {student.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900 px-2 py-1 bg-gray-100 rounded-md">{student.points}</span>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyles(student.status)}`}>
                        {student.status}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                        <button title="View Profile" onClick={() => navigate(`/dashboard/students/${student._id}`)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
                            <Eye size={17} />
                        </button>
                        <button title="Edit Student" onClick={() => onEdit(student)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer">
                            <Pencil size={17} />
                        </button>
                        <button title="Delete Student" onClick={() => onDelete(student)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer">
                            <Trash2 size={17} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Mobile Card */}
            <div className="md:hidden bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3 hover:border-primary/30 transition-all active:scale-[0.98]">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{student.name}</h4>
                            <p className="text-xs text-gray-500">ID: {student.studentId || student.id}</p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyles(student.status)}`}>
                        {student.status}
                    </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Points</span>
                        <span className="text-sm font-bold text-gray-900">{student.points}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/dashboard/students/${student._id}`)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"><Eye size={17} /></button>
                        <button onClick={() => onEdit(student)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"><Pencil size={17} /></button>
                        <button onClick={() => onDelete(student)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"><Trash2 size={17} /></button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentRow;
