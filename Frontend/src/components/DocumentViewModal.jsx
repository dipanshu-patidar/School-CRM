import React from 'react';
import { X, FileText, User, Download, ShieldCheck } from 'lucide-react';
import PrintHeader from './PrintHeader';

const DocumentViewModal = ({ doc, onClose }) => {
    if (!doc) return null;

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
                            <h3 className="text-xl font-bold text-gray-900">Standard Document Details</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                                    <User size={14} className="text-gray-400" />
                                    For: {doc.studentName}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all cursor-pointer hover:rotate-90 duration-200 no-print">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    <div className="p-8 space-y-8">
                        <PrintHeader />

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:shadow-none print:border print:rounded-none">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Document Type</span>
                                <span className="text-sm font-bold text-gray-900">{doc.docName}</span>
                            </div>
                            <div className="flex flex-col border-l border-gray-100 md:pl-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Upload Date</span>
                                <span className="text-sm font-bold text-gray-900">{doc.date}</span>
                            </div>
                            <div className="flex flex-col border-l border-gray-100 md:pl-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Status</span>
                                <div className="mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                        doc.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                        doc.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                                        'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {doc.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col border-l border-gray-100 md:pl-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">File Size</span>
                                <span className="text-sm font-bold text-gray-900">{doc.size || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group print:hidden">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/5">
                                    <ShieldCheck size={20} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 tracking-tight flex-1 border-b border-gray-100 pb-1.5">Document Preview</h4>
                            </div>
                            
                            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[400px] relative">
                                {(() => {
                                    const urlLower = (doc.url || '').toLowerCase();
                                    const docNameLower = (doc.docName || '').toLowerCase();
                                    const isPdf = urlLower.split('?')[0].endsWith('.pdf') || 
                                                  docNameLower.split('?')[0].endsWith('.pdf') ||
                                                  (urlLower.includes('/documents/') && !urlLower.match(/\.(jpg|jpeg|png|gif|webp)/));

                                    if (isPdf) {
                                        const baseUrl = doc.url.split('?')[0];
                                        const params = doc.url.includes('?') ? doc.url.split('?')[1] : '';
                                        const finalUrl = `${baseUrl}?${params}${params ? '&' : ''}toolbar=0&navpanes=0&scrollbar=1`;

                                        return (
                                            <iframe
                                                src={finalUrl}
                                                className="w-full h-[500px] border-none"
                                                title="Document PDF Preview"
                                            />
                                        );
                                    } else {
                                        return (
                                            <div className="w-full h-full flex items-center justify-center p-4">
                                                <img
                                                    src={doc.url}
                                                    alt={doc.docName}
                                                    className="max-w-full max-h-[600px] object-contain shadow-md rounded-lg"
                                                />
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between no-print">
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium italic">
                        <ShieldCheck size={16} />
                        Verified Institutional Record
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-500 font-bold hover:text-gray-900 transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                if (window.onDownloadDocument) {
                                    window.onDownloadDocument(doc);
                                } else {
                                    window.open(doc.url + (doc.url.includes('?') ? '&' : '?') + 'ik-attachment=true', '_blank');
                                }
                            }}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 no-print"
                        >
                            <Download size={18} />
                            Download Original
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewModal;
