import React from 'react';
import { X, FileText, Calendar, User, CheckCircle, Clock, Download, FileDown, MessageSquare, ClipboardCheck, Zap, Printer } from 'lucide-react';
import ReportStatusBadge from './ReportStatusBadge';
import PrintHeader from './PrintHeader';
import PCPReportDocument from './PCPReportDocument';

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
                <div id="pcp-report-content" className="flex-1 overflow-y-auto bg-gray-50/30">
                    <PCPReportDocument report={report} />
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between print:mt-auto no-print">
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium italic">
                        <FileText size={16} />
                        Service Documentation Report - {report.id || 'Draft'}
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
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 no-print"
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
