import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, FileUp } from 'lucide-react';
import DocumentsTable from '../components/DocumentsTable';
import UploadDocumentModal from '../components/UploadDocumentModal';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import CompletionRuleCard from '../components/CompletionRuleCard';

const initialDocs = [
    { id: 1, studentName: 'John Doe', docName: 'Lease.pdf', date: '12 Mar 2026', status: 'Completed', size: '2.4 MB' },
    { id: 2, studentName: 'Sara Smith', docName: 'Mortgage_Agreement.pdf', date: '10 Mar 2026', status: 'Secondary Completion', size: '4.1 MB' },
];

const DocumentsPage = () => {
    const [documents, setDocuments] = useState(initialDocs);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);

    // Modal state for view and delete
    const [previewDoc, setPreviewDoc] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleUpload = (newDoc) => {
        if (editingDoc) {
            setDocuments(prev => prev.map(d => d.id === newDoc.id ? newDoc : d));
        } else {
            setDocuments(prev => [newDoc, ...prev]);
        }
        setIsUploadOpen(false);
        setEditingDoc(null);
    };

    const handleEdit = (doc) => {
        setEditingDoc(doc);
        setIsUploadOpen(true);
    };

    const handleDelete = () => {
        setDocuments(prev => prev.filter(d => d.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    const handleDownload = (doc) => {
        // Mock download action
        alert(`Downloading ${doc.docName}...`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Housing Documents</h1>
                    <p className="text-gray-500 mt-1">Upload and manage housing verification documents.</p>
                </div>
                <button
                    onClick={() => { setEditingDoc(null); setIsUploadOpen(true); }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 cursor-pointer active:scale-95 self-start sm:self-auto shrink-0"
                >
                    <Plus size={18} />
                    Upload Document
                </button>
            </div>

            {/* Rules */}
            <CompletionRuleCard />

            {/* Main Table */}
            <DocumentsTable
                documents={documents}
                onView={setPreviewDoc}
                onDownload={handleDownload}
                onDelete={setDeleteTarget}
                onUpload={() => { setEditingDoc(null); setIsUploadOpen(true); }}
                onEdit={handleEdit}
            />

            {/* Modals */}
            <UploadDocumentModal
                isOpen={isUploadOpen}
                onClose={() => { setIsUploadOpen(false); setEditingDoc(null); }}
                onUpload={handleUpload}
                editDoc={editingDoc}
            />

            <DocumentPreviewModal
                doc={previewDoc}
                onClose={() => setPreviewDoc(null)}
            />

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                            <Trash2 size={30} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Document</h3>
                        <p className="text-gray-500 mb-1">Are you sure you want to delete this document from</p>
                        <p className="text-indigo-600 font-bold text-lg mb-6">{deleteTarget.studentName}'s profile?</p>
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8 w-full">
                            <AlertTriangle size={15} className="shrink-0" />
                            This document will be permanently removed.
                        </div>
                        <div className="flex gap-4 w-full">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-100 cursor-pointer active:scale-95">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsPage;
