import React from 'react';
import { Eye, Download, Trash2, FileText, Pencil, Printer } from 'lucide-react';

const DocumentsTable = ({ documents, onView, onDownload, onDelete, onUpload, onEdit }) => {
    if (!documents || documents.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FileText size={36} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No standard documents uploaded yet</h3>
                <p className="text-gray-500 max-w-xs mb-8">Start by adding a student's program documentation or housing verification.</p>
                <button
                    onClick={onUpload}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
                >
                    <FileText size={18} />
                    Upload First Document
                </button>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        if (status === 'Completed') {
            return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">Completed</span>;
        }
        if (status === 'Secondary Completion') {
            return <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">Secondary</span>;
        }
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap">Pending</span>;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="hidden md:block print:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Document Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Upload Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right no-print">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                            {doc.studentName.charAt(0)}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{doc.studentName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-gray-400" />
                                        <span className="truncate max-w-[150px] lg:max-w-[200px]" title={doc.docName}>{doc.docName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{doc.date}</td>
                                <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                                <td className="px-6 py-4 no-print">
                                    <div className="flex items-center justify-end gap-1">
                                        <button title="View Document" onClick={() => onView(doc)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"><Eye size={16} /></button>
                                        <button title="Print Document" onClick={() => window.print()} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"><Printer size={16} /></button>
                                        <button title="Download Document" onClick={() => onDownload(doc)} className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"><Download size={16} /></button>
                                        <button title="Edit Document" onClick={() => onEdit(doc)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"><Pencil size={16} /></button>
                                        <button title="Delete Document" onClick={() => onDelete(doc)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden print:hidden p-4 space-y-4 bg-gray-50/30">
                {documents.map((doc) => (
                    <div key={doc.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-primary/30 transition-all relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                    {doc.studentName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{doc.studentName}</h4>
                                    <p className="text-xs text-gray-500">{doc.date}</p>
                                </div>
                            </div>
                            {getStatusBadge(doc.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                            <FileText size={16} className="text-gray-400 shrink-0" />
                            <span className="truncate">{doc.docName}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 border-t border-gray-50 pt-3 mt-2 no-print">
                            <button onClick={() => onView(doc)} className="flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-lg text-sm font-bold text-black bg-primary hover:bg-primary-hover transition-all cursor-pointer"><Eye size={15} /> View</button>
                            <button onClick={() => window.print()} className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"><Printer size={15} /></button>
                            <button onClick={() => onDownload(doc)} className="flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-lg text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all cursor-pointer"><Download size={15} /> Save</button>
                            <button onClick={() => onEdit(doc)} className="p-2.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-all cursor-pointer"><Pencil size={15} /></button>
                            <button onClick={() => onDelete(doc)} className="p-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all cursor-pointer"><Trash2 size={15} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 text-sm font-medium text-gray-500 no-print">
                {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded.
            </div>
        </div>
    );
};

export default DocumentsTable;
