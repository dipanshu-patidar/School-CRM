import React from 'react';
import { Eye, Pencil, Trash2, FileText, Calendar, User, Printer } from 'lucide-react';
import ReportStatusBadge from './ReportStatusBadge';

const PCPReportRow = ({ report, onView, onEdit, onDelete, userRole, isMobile = false }) => {
    if (isMobile) {
        return (
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-primary/30 transition-all relative space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                            {report.studentName.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{report.studentName}</h4>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{report.staff}</p>
                        </div>
                    </div>
                    <ReportStatusBadge status={report.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-50">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Service Date</p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                            <Calendar size={12} className="text-primary" />
                            {report.date}
                        </div>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Created</p>
                        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-gray-800">
                            <Calendar size={12} className="text-gray-200" />
                            {report.createdDate}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <button
                        onClick={() => onView(report)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-all active:scale-95"
                    >
                        <Eye size={14} /> View
                    </button>
                    {report.assessmentFile && (
                        <button
                            onClick={() => onView(report, true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-black text-xs font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/10"
                        >
                            <FileText size={14} /> Doc
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(report)}
                        className="p-3 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all active:scale-95"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all active:scale-95 cursor-pointer"
                    >
                        <Printer size={14} />
                    </button>
                    {userRole === 'admin' && (
                        <button
                            onClick={() => onDelete(report)}
                            className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <tr className="hover:bg-primary/5 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 border border-primary/20">
                        {report.studentName.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-900 tracking-tight">{report.studentName}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <FileText size={14} className="text-gray-300" />
                    PCP / IGP Report
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-800 font-bold tracking-tight">
                {report.date}
            </td>
            <td className="px-6 py-4 text-xs text-gray-600 font-black uppercase tracking-widest italic">
                {report.staff}
            </td>
            <td className="px-6 py-4 text-[11px] text-gray-400 font-medium">
                {report.createdDate}
            </td>
            <td className="px-6 py-4">
                <ReportStatusBadge status={report.status} />
            </td>
            <td className="px-6 py-4 no-print text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        title="View Report"
                        onClick={() => onView(report)}
                        className="p-2 rounded-xl text-primary bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer shadow-sm border border-primary/10 active:scale-95"
                    >
                        <Eye size={16} />
                    </button>
                    {report.assessmentFile && (
                        <button
                            title="View Document"
                            onClick={() => onView(report, true)}
                            className="p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all cursor-pointer shadow-sm border border-indigo-100 active:scale-95"
                        >
                            <FileText size={16} />
                        </button>
                    )}
                    <button
                        title="Edit Report"
                        onClick={() => onEdit(report)}
                        className="p-2 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all cursor-pointer shadow-sm border border-amber-100 active:scale-95"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        title="Print Report"
                        onClick={() => window.print()}
                        className="p-2 rounded-xl text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer shadow-sm border border-gray-200 active:scale-95"
                    >
                        <Printer size={16} />
                    </button>
                    {userRole === 'admin' && (
                        <button
                            title="Delete Report"
                            onClick={() => onDelete(report)}
                            className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm border border-red-100 active:scale-95"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default PCPReportRow;
