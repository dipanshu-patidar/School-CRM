import React from 'react';
import { X, FileText, Calendar, User, CheckCircle, Clock, Download, FileDown, MessageSquare, ClipboardCheck, Zap } from 'lucide-react';
import ReportStatusBadge from './ReportStatusBadge';

const PCPReportViewModal = ({ report, onClose, onDownload }) => {
    if (!report) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header Strip */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500 w-full" />

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">PCP / IGP Service Documentation</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                                    <User size={14} className="text-gray-400" />
                                    For: {report.studentName}
                                </span>
                                <span className="text-gray-300">|</span>
                                <ReportStatusBadge status={report.status} />
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all cursor-pointer hover:rotate-90 duration-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    <div className="p-8 space-y-8">

                        {/* Summary Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Date of Service</p>
                                    <p className="text-sm font-bold text-gray-900">{report.date}</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Staff Member</p>
                                    <p className="text-sm font-bold text-gray-900 italic">{report.staff}</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Created Date</p>
                                    <p className="text-sm font-bold text-gray-900">{report.createdDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* P.I.E Format Sections */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 text-indigo-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700">
                                    <Zap size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-100">P</div>
                                        <h4 className="text-lg font-bold text-gray-900 tracking-tight">Purpose of Service</h4>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed font-medium bg-indigo-50/30 p-4 rounded-2xl border border-indigo-50/50">
                                        {report.purpose || 'No purpose notes provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 text-violet-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700">
                                    <ClipboardCheck size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold shadow-md shadow-violet-100">I</div>
                                        <h4 className="text-lg font-bold text-gray-900 tracking-tight">Interventions Delivered</h4>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed font-medium bg-violet-50/30 p-4 rounded-2xl border border-violet-50/50">
                                        {report.intervention || 'No intervention notes provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 text-emerald-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700">
                                    <CheckCircle size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-100">E</div>
                                        <h4 className="text-lg font-bold text-gray-900 tracking-tight">Effectiveness of Interventions</h4>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed font-medium bg-emerald-50/30 p-4 rounded-2xl border border-emerald-50/50">
                                        {report.effectiveness || 'No effectiveness notes provided.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2.5 mb-4 text-gray-400">
                                    <MessageSquare size={18} />
                                    <h4 className="text-sm font-bold uppercase tracking-wider">Staff Notes</h4>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {report.staffNotes || 'No additional staff notes.'}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Digital Signature</p>
                                <div className="px-6 py-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-2xl font-dance text-indigo-600/80 italic font-medium">
                                        {report.staffSignature || report.staff}
                                    </p>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Verified Digitally on {report.createdDate || report.date}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium italic">
                        <FileText size={16} />
                        Service Documentation Report - {report.id}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-500 font-bold hover:text-gray-900 transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => onDownload(report)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 cursor-pointer active:scale-95"
                        >
                            <FileDown size={18} />
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PCPReportViewModal;
