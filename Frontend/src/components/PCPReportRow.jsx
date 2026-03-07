import React from 'react';
import { Eye, Pencil, Download, Trash2, FileText, Calendar, User, Printer } from 'lucide-react';
import ReportStatusBadge from './ReportStatusBadge';

const PCPReportRow = ({ report, onView, onEdit, onDownload, onDelete, userRole }) => {
    return (
        <>
            {/* Desktop Row */}
            <tr className="hidden md:table-row print:table-row hover:bg-[#FFF9E6] transition-colors group">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {report.studentName.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{report.studentName}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <FileText size={16} className="text-gray-400" />
                        PCP / IGP Report
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {report.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-semibold italic">
                    {report.staff}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                    {report.createdDate}
                </td>
                <td className="px-6 py-4">
                    <ReportStatusBadge status={report.status} />
                </td>
                <td className="px-6 py-4 no-print">
                    <div className="flex items-center justify-end gap-1">
                        <button
                            title="View Report"
                            onClick={() => onView(report)}
                            className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            title="Edit Report"
                            onClick={() => onEdit(report)}
                            className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            title="Download PDF"
                            onClick={() => onDownload(report)}
                            className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                        >
                            <Download size={16} />
                        </button>
                        <button
                            title="Print Report"
                            onClick={() => window.print()}
                            className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                        >
                            <Printer size={16} />
                        </button>
                        {userRole === 'admin' && (
                            <button
                                title="Delete Report"
                                onClick={() => onDelete(report)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Mobile Card */}
            <div className="md:hidden print:hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 transition-all relative space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {report.studentName.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{report.studentName}</h4>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider italic">{report.staff}</p>
                        </div>
                    </div>
                    <ReportStatusBadge status={report.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-50">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Date</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                            <Calendar size={12} className="text-primary" />
                            {report.date}
                        </div>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created</p>
                        <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-gray-700">
                            <Calendar size={12} className="text-gray-300" />
                            {report.createdDate}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 no-print">
                    <button
                        onClick={() => onView(report)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all"
                    >
                        <Eye size={14} /> View
                    </button>
                    <button
                        onClick={() => onEdit(report)}
                        className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => onDownload(report)}
                        className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
                    >
                        <Download size={14} />
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                        <Printer size={14} />
                    </button>
                    {userRole === 'admin' && (
                        <button
                            onClick={() => onDelete(report)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default PCPReportRow;
