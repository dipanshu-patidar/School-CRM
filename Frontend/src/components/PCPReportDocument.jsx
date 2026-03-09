import React from 'react';
import { FileText, User, Zap, ClipboardCheck, CheckCircle, MessageSquare } from 'lucide-react';
import PrintHeader from './PrintHeader';
import ReportStatusBadge from './ReportStatusBadge';

const PCPReportDocument = ({ report }) => {
    if (!report) return null;

    return (
        <div className="p-8 space-y-8 bg-white" id="pcp-report-content" style={{ backgroundColor: 'white' }}>
            <PrintHeader forceVisible={true} />

            {/* Summary Info Header (Document Style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
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
                    <span className="text-sm font-bold text-gray-900">{report.createdDate || report.date}</span>
                </div>
            </div>

            {/* P.I.E Format Sections */}
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-indigo-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700 no-print">
                        <Zap size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">P</div>
                            <h4 className="text-xl font-bold text-gray-900 tracking-tight flex-1 border-b border-gray-100 pb-1.5">Purpose of Service</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium bg-primary/5 p-6 rounded-2xl border border-primary/10">
                            {report.purpose || 'No purpose notes provided.'}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-violet-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700 no-print">
                        <ClipboardCheck size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">I</div>
                            <h4 className="text-xl font-bold text-gray-900 tracking-tight flex-1 border-b border-gray-100 pb-1.5">Interventions Delivered</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium bg-primary/5 p-6 rounded-2xl border border-primary/10">
                            {report.intervention || 'No intervention notes provided.'}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-emerald-50/50 -rotate-12 group-hover:rotate-0 transition-all duration-700 no-print">
                        <CheckCircle size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">E</div>
                            <h4 className="text-xl font-bold text-gray-900 tracking-tight flex-1 border-b border-gray-100 pb-1.5">Effectiveness of Interventions</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium bg-primary/5 p-6 rounded-2xl border border-primary/10">
                            {report.effectiveness || 'No effectiveness notes provided.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4 text-gray-400">
                        <MessageSquare size={18} className="no-print" />
                        <h4 className="text-sm font-black uppercase tracking-widest">Staff Notes</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {report.staffNotes || 'No additional staff notes recorded for this session.'}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Digital Signature</p>
                    <div className="px-6 py-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-3xl font-dance text-primary italic font-medium">
                            {report.staffSignature || report.staff}
                        </p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Verified Digitally on {report.createdDate || report.date}</p>
                </div>
            </div>
        </div>
    );
};

export default PCPReportDocument;
