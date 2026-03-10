import React from 'react';
import { X, FileText, Calendar, User, CheckCircle, Clock, MessageSquare, ClipboardCheck, Zap, Printer } from 'lucide-react';
import ReportStatusBadge from './ReportStatusBadge';
import PrintHeader from './PrintHeader';

const PCPReportViewModal = ({ report, onClose }) => {
    if (!report) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm no-print" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header Strip */}
                <div className="h-2 bg-primary w-full shadow-[0_0_15px_rgba(212,175,55,0.3)] no-print" />

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 no-print">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
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
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all cursor-pointer hover:rotate-90 duration-200 no-print">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    <div className="p-8 space-y-8">
                        <PrintHeader />

                        {/* Summary Info Header (Document Style) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 print:grid print:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:shadow-none print:border print:rounded-none print:p-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Date of Service</span>
                                <span className="text-sm font-bold text-gray-900">{report.date}</span>
                            </div>
                            <div className="flex flex-col border-l border-gray-100 md:pl-6 print:pl-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Staff Member</span>
                                <span className="text-sm font-bold text-gray-900 italic">{report.staff}</span>
                            </div>
                            <div className="flex flex-col border-l border-gray-100 md:pl-6 print:pl-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Documentation Created</span>
                                <span className="text-sm font-bold text-gray-900">{report.createdDate}</span>
                            </div>
                        </div>

                        {/* P.I.E Format Sections */}
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group print:border print:rounded-none print:shadow-none print:p-6">
                                <div className="absolute top-0 right-0 p-8 text-indigo-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700 no-print">
                                    <Zap size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 print:mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20 print:shadow-none print:rounded-none">P</div>
                                        <h4 className="text-xl font-bold text-gray-900 tracking-tight flex-1 border-b border-gray-100 pb-1.5 print:border-none">Purpose of Service</h4>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed font-medium bg-primary/5 p-6 rounded-2xl border border-primary/10 print:p-0 print:border-none print:bg-transparent">
                                        {report.purpose || 'No purpose notes provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group print:border print:rounded-none print:shadow-none print:p-6">
                                <div className="absolute top-0 right-0 p-8 text-violet-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700 no-print">
                                    <ClipboardCheck size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 print:mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20 print:shadow-none print:rounded-none">I</div>
                                        <h4 className="text-xl font-bold text-gray-900 tracking-tight flex-1 border-b border-gray-100 pb-1.5 print:border-none">Interventions Delivered</h4>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed font-medium bg-primary/5 p-6 rounded-2xl border border-primary/10 print:p-0 print:border-none print:bg-transparent">
                                        {report.intervention || 'No intervention notes provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group print:border print:rounded-none print:shadow-none print:p-6">
                                <div className="absolute top-0 right-0 p-8 text-emerald-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700 no-print">
                                    <CheckCircle size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 print:mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20 print:shadow-none print:rounded-none">E</div>
                                        <h4 className="text-xl font-bold text-gray-900 tracking-tight flex-1 border-b border-gray-100 pb-1.5 print:border-none">Effectiveness of Interventions</h4>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed font-medium bg-primary/5 p-6 rounded-2xl border border-primary/10 print:p-0 print:border-none print:bg-transparent">
                                        {report.effectiveness || 'No effectiveness notes provided.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Attachment / Assessment File Section */}
                        {report.assessmentFile && (
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group print:hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/5">
                                        <Zap size={20} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 tracking-tight flex-1 border-b border-gray-100 pb-1.5">Assessment Attachment</h4>
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[400px] relative">
                                    {report.assessmentFile.toLowerCase().endsWith('.pdf') ? (
                                        <iframe
                                            src={`${report.assessmentFile}#toolbar=0`}
                                            className="w-full h-[500px] border-none"
                                            title="Assessment PDF Preview"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-4">
                                            <img
                                                src={report.assessmentFile}
                                                alt="Assessment Attachment"
                                                className="max-w-full max-h-[600px] object-contain shadow-md rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                                        <FileText size={14} className="text-primary" />
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Attachment Preview</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:border print:rounded-none print:shadow-none print:p-4">
                                <div className="flex items-center gap-2.5 mb-4 text-gray-400 print:mb-2 print:text-gray-900">
                                    <MessageSquare size={18} className="no-print" />
                                    <h4 className="text-sm font-black uppercase tracking-widest">Staff Notes</h4>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed print:text-gray-900 font-medium">
                                    {report.staffNotes || 'No additional staff notes recorded for this session.'}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center print:border print:rounded-none print:shadow-none print:p-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 print:mb-2">Digital Signature</p>
                                <div className="px-6 py-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200 print:border-none print:bg-transparent print:p-0">
                                    <p className="text-3xl font-dance text-primary italic font-medium print:text-gray-900 print:text-3xl">
                                        {report.staffSignature || report.staff}
                                    </p>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Verified Digitally on {report.createdDate || report.date}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between print:mt-auto">
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
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer no-print focus:ring-2 focus:ring-gray-100"
                        >
                            <Printer size={18} />
                            Print Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PCPReportViewModal;
