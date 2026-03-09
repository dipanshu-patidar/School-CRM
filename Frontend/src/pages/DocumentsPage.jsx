import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle, FileUp, FileText, FolderOpen, Printer, Loader2, Trash2 } from 'lucide-react';
import DocumentsTable from '../components/DocumentsTable';
import UploadDocumentModal from '../components/UploadDocumentModal';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import CompletionRuleCard from '../components/CompletionRuleCard';
import PCPReportForm from '../components/PCPReportForm';
import PCPReportsTable from '../components/PCPReportsTable';
import PCPReportViewModal from '../components/PCPReportViewModal';
import PrintHeader from '../components/PrintHeader';
import { getAllDocuments, getAllPcpReports, deleteDocument, deletePcpReport, addPcpReport } from '../api/documentApi';

const DocumentsPage = ({ role }) => {
    const userRole = role;

    const [documents, setDocuments] = useState([]);
    const [pcpReports, setPcpReports] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isPCPModalOpen, setIsPCPModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [editingPCP, setEditingPCP] = useState(null);
    const [activeTab, setActiveTab] = useState('pcp');
    const [isLoading, setIsLoading] = useState(true);

    const [previewDoc, setPreviewDoc] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [docsData, pcpData] = await Promise.all([
                getAllDocuments(),
                getAllPcpReports()
            ]);

            // Format data for standard table
            const formattedDocs = docsData.map(d => ({
                id: d._id,
                studentMongoId: d.studentMongoId,
                studentName: d.studentName,
                docName: d.name,
                url: d.url,
                date: d.uploadDate,
                status: 'Completed', // Standard status
                size: d.size || 'N/A'
            }));

            // Format data for PCP table
            const formattedPCP = pcpData.map(r => ({
                ...r,
                id: r._id,
                studentName: r.studentName,
                type: 'PCP / IGP Report',
                date: new Date(r.dateOfService).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: r.status,
                staff: r.staffSignature
            }));

            setDocuments(formattedDocs);
            setPcpReports(formattedPCP);
        } catch (err) {
            console.error('Error fetching document data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpload = () => {
        fetchData();
        setIsUploadOpen(false);
        setEditingDoc(null);
    };

    const handleSavePCP = async (reportData, studentMongoId) => {
        try {
            await addPcpReport(studentMongoId, reportData);
            fetchData();
            setIsPCPModalOpen(false);
            setEditingPCP(null);
        } catch (err) {
            console.error('Error saving PCP report:', err);
            alert('Failed to save report.');
        }
    };

    const handleDelete = async () => {
        try {
            if (deleteTarget.type === 'PCP / IGP Report') {
                await deletePcpReport(deleteTarget.studentMongoId, deleteTarget.id);
            } else {
                await deleteDocument(deleteTarget.studentMongoId, deleteTarget.id);
            }
            fetchData();
            setDeleteTarget(null);
        } catch (err) {
            console.error('Error deleting:', err);
            alert('Failed to delete item.');
        }
    };

    const handlePrintAll = () => {
        window.print();
    };

    const handleDownload = (doc) => {
        if (doc.url) {
            window.open(doc.url, '_blank');
        } else {
            alert('No URL available for this document.');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`space-y-6 ${(previewDoc || isPCPModalOpen || isUploadOpen) ? 'no-print' : ''}`}>
                <PrintHeader />
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-6 no-print">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Module Documents</h1>
                        <p className="text-gray-500 mt-1">Manage service reports and program documentation.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrintAll}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer no-print"
                        >
                            <Printer size={20} />
                            Print All
                        </button>
                        {activeTab === 'pcp' ? (
                            <button
                                onClick={() => setIsPCPModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95 cursor-pointer"
                            >
                                <Plus size={20} />
                                New PCP / IGP Report
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsUploadOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95 cursor-pointer"
                            >
                                <Plus size={20} />
                                Upload Document
                            </button>
                        )}
                    </div>
                </div>

                {/* Rules */}
                <div className="no-print">
                    <CompletionRuleCard />
                </div>

                {/* Tab Switcher */}
                {userRole === 'admin' && (
                    <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit no-print">
                        <button
                            onClick={() => setActiveTab('pcp')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all shadow-md active:scale-95 cursor-pointer ${activeTab === 'pcp'
                                ? 'bg-primary text-black shadow-primary/20'
                                : 'bg-white text-gray-600 hover:text-primary hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            PCP / IGP Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('standard')}
                            className={`px-6 py-3 text-sm font-bold transition-all relative ${activeTab === 'standard'
                                ? 'text-primary'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Standard Documents
                        </button>
                    </div>
                )}

                {/* Main Content */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {isLoading ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Loading documents...</p>
                        </div>
                    ) : (
                        activeTab === 'pcp' || userRole === 'staff' ? (
                            <PCPReportsTable
                                reports={pcpReports}
                                onView={setPreviewDoc}
                                onEdit={(r) => { setEditingPCP(r); setIsPCPModalOpen(true); }}
                                onDownload={handleDownload}
                                onDelete={setDeleteTarget}
                                onCreateNew={() => { setEditingPCP(null); setIsPCPModalOpen(true); }}
                                userRole={userRole}
                            />
                        ) : (
                            <div className="space-y-6">
                                <div className="mb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Standard Documents</h2>
                                    <p className="text-sm text-gray-500 font-medium">Manage program documentation and student IDs.</p>
                                </div>
                                <DocumentsTable
                                    documents={documents}
                                    onView={setPreviewDoc}
                                    onDownload={handleDownload}
                                    onDelete={setDeleteTarget}
                                    onUpload={() => { setEditingDoc(null); setIsUploadOpen(true); }}
                                    onEdit={(d) => { setEditingDoc(d); setIsUploadOpen(true); }}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Modals */}
            <UploadDocumentModal
                isOpen={isUploadOpen}
                onClose={() => { setIsUploadOpen(false); setEditingDoc(null); }}
                onUpload={handleUpload}
                editDoc={editingDoc}
            />

            <PCPReportForm
                isOpen={isPCPModalOpen}
                onClose={() => { setIsPCPModalOpen(false); setEditingPCP(null); }}
                onSave={handleSavePCP}
                editData={editingPCP}
            />

            {previewDoc && (
                previewDoc.type === 'PCP / IGP Report' ? (
                    <PCPReportViewModal
                        report={previewDoc}
                        onClose={() => setPreviewDoc(null)}
                        onDownload={handleDownload}
                    />
                ) : (
                    <DocumentPreviewModal
                        doc={previewDoc}
                        onClose={() => setPreviewDoc(null)}
                    />
                )
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm no-print" onClick={() => setDeleteTarget(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                            <Trash2 size={30} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Document</h3>
                        <p className="text-gray-500 mb-1">Are you sure you want to delete this document from</p>
                        <p className="text-primary font-bold text-lg mb-6">{deleteTarget.studentName}'s profile?</p>
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
