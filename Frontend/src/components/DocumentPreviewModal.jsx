import React from 'react';
import { X, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';
import PrintHeader from './PrintHeader';

const DocumentPreviewModal = ({ doc, onClose }) => {
    if (!doc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm no-print" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

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
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                    {/* Main Preview */}
                    <div className="flex-1 p-0 flex flex-col items-center justify-center bg-gray-100/30 overflow-hidden relative">
                        {doc.url ? (
                            (() => {
                                const urlLower = doc.url.toLowerCase();
                                const docNameLower = (doc.docName || '').toLowerCase();
                                const isPdf = urlLower.split('?')[0].endsWith('.pdf') ||
                                    docNameLower.split('?')[0].endsWith('.pdf') ||
                                    urlLower.includes('/assessments/') ||
                                    (urlLower.includes('/documents/') && !urlLower.match(/\.(jpg|jpeg|png|gif|webp)/));

                                if (isPdf) {
                                    // Robust URL handling for standard PDFs in iframes
                                    const baseUrl = doc.url.split('?')[0];
                                    const params = doc.url.includes('?') ? doc.url.split('?')[1] : '';
                                    const finalUrl = `${baseUrl}?${params}${params ? '&' : ''}toolbar=0&navpanes=0&scrollbar=1`;

                                    return (
                                        <iframe
                                            src={finalUrl}
                                            className="w-full h-full border-none"
                                            title="Document Preview"
                                        />
                                    );
                                } else {
                                    return (
                                        <div className="w-full h-full flex items-center justify-center p-4">
                                            <img
                                                src={doc.url}
                                                alt={doc.docName}
                                                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                                            />
                                        </div>
                                    );
                                }
                            })()
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <FileText size={64} className="mb-4" />
                                <p className="font-medium">No preview available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer with Download */}
                <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between no-print">
                    <div className="text-sm text-gray-500 font-medium">
                        {doc.date} {doc.size && `• ${doc.size}`}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all cursor-pointer"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                // Trigger download logic
                                if (window.onDownloadDocument) {
                                    window.onDownloadDocument(doc);
                                } else {
                                    window.open(doc.url + (doc.url.includes('?') ? '&' : '?') + 'ik-attachment=true', '_blank');
                                }
                            }}
                            className="px-6 py-2 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
                        >
                            Download Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentPreviewModal;
