import React from 'react';
import { X, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';
import PrintHeader from './PrintHeader';

const DocumentPreviewModal = ({ doc, onClose }) => {
    if (!doc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm no-print" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header Strip */}
                <div className="h-2 bg-primary w-full" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{doc.docName}</h3>
                            <p className="text-sm text-gray-500">{doc.studentName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer no-print">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto print:overflow-visible">
                    <div className="p-6 pb-0">
                        <PrintHeader />
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row bg-gray-50/50 print:block">

                        {/* Main Preview */}
                        <div className="flex-1 p-0 flex flex-col items-center justify-center bg-gray-100 border-b md:border-b-0 md:border-r border-gray-200 overflow-hidden relative min-h-[400px]">
                            {doc.url ? (
                                doc.url.toLowerCase().endsWith('.pdf') ? (
                                    <iframe
                                        src={`${doc.url}#toolbar=0`}
                                        className="w-full h-full border-none"
                                        title="PDF Preview"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                        <img
                                            src={doc.url}
                                            alt={doc.docName}
                                            className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                                        />
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <FileText size={64} className="mb-4" />
                                    <p className="font-medium">No preview available</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Info */}
                        <div className="w-full md:w-80 bg-white p-6 flex flex-col gap-6">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                                {doc.status === 'Completed' ? (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100">
                                        <CheckCircle size={14} /> Completed
                                    </div>
                                ) : doc.status === 'Secondary Completion' ? (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                                        <CheckCircle size={14} /> Secondary
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-bold text-sm border border-gray-200">
                                        <Clock size={14} /> Pending
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Upload Info</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-gray-900 font-medium">{doc.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <FileText size={16} className="text-gray-400" />
                                        <span className="text-gray-900 font-medium">{doc.size || '3.2 MB'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <button className="w-full py-2.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg transition-colors cursor-pointer mb-2 no-print">
                                    Download File
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentPreviewModal;
