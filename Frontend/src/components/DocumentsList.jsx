import React, { useRef, useState, useEffect } from 'react';
import { FileText, Download, Trash2, Upload, X, FileUp, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

/* ── Inline Upload Modal ──────────────────────── */
const UploadModal = ({ onClose, onUpload }) => {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const inputRef = useRef();

    const handleFile = (f) => { if (f) setFile(f); };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                    onClick={() => inputRef.current.click()}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${dragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
                >
                    <FileUp size={36} className="mx-auto mb-3 text-primary/50" />
                    {file ? (
                        <div>
                            <p className="font-bold text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Drag & drop or click to select</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG, PNG — Max 10 MB</p>
                        </div>
                    )}
                    <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
                        Cancel
                    </button>
                    <button
                        disabled={!file}
                        onClick={() => { onUpload(file); }}
                        className="flex-1 py-3 bg-primary hover:bg-primary-hover disabled:bg-gray-200 disabled:text-gray-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <Upload size={16} /> Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Documents List ───────────────────────────── */
const DocumentsList = ({ student, initialDocuments = [], triggerUpload, onUploadTriggered }) => {
    const [documents, setDocuments] = useState(initialDocuments);
    const [showUpload, setShowUpload] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        if (triggerUpload) {
            setShowUpload(true);
            if (onUploadTriggered) onUploadTriggered();
        }
    }, [triggerUpload, onUploadTriggered]);

    const handleUpload = async (file) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('document', file);

        try {
            const res = await api.post(`/api/students/${student._id}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDocuments(res.data.data);
            setShowUpload(false);
        } catch (error) {
            console.error('Error uploading document', error);
            alert('Upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteRequest = (doc) => setDeleteTarget(doc);

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await api.delete(`/api/students/${student._id}/documents/${deleteTarget._id}`);
            setDocuments(res.data.data);
            setDeleteTarget(null);
        } catch (error) {
            console.error('Error deleting document', error);
        }
    };

    const handleDownload = async (docId, name) => {
        try {
            const doc = documents.find(d => d._id === docId);
            if (!doc || !doc.url) return alert('Document URL not found.');

            let fileName = name || doc.name || 'document';
            if (!fileName.toLowerCase().endsWith('.pdf')) fileName = `${fileName}.pdf`;

            let blob = null;
            try {
                const response = await api.get(`/api/students/${student._id}/documents/${docId}/download`, {
                    responseType: 'blob'
                });
                blob = response.data;
            } catch (apiErr) {
                console.log('API download failed, trying direct Cloudinary URL:', apiErr.message);
            }

            if (!blob) {
                let downloadUrl = doc.url;
                if (downloadUrl.includes('res.cloudinary.com')) {
                    const uploadIndex = downloadUrl.indexOf('/upload/');
                    if (uploadIndex !== -1) {
                        const before = downloadUrl.slice(0, uploadIndex + 8);
                        const after = downloadUrl.slice(uploadIndex + 8);
                        const cleanName = fileName.replace(/\.pdf$/i, '');
                        const safeName = encodeURIComponent(cleanName.replace(/\s+/g, '_'));
                        downloadUrl = `${before}fl_attachment:${safeName}/${after}`;
                    }
                }
                const blobResponse = await fetch(downloadUrl);
                if (!blobResponse.ok) throw new Error('Fetch failed');
                blob = await blobResponse.blob();
            }

            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Download failed:', err);
            alert('Download failed. Please try again.');
        }
    };

    const getThumbnailUrl = (doc) => {
        if (!doc.url || !doc.url.includes('res.cloudinary.com')) return null;
        const url = doc.url;
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) return null;

        const parts = url.split('.');
        const extension = parts.pop().toLowerCase();
        let transformation = 'w_100,h_100,c_fill,f_auto,q_auto';
        if (extension === 'pdf') transformation = 'w_100,h_130,c_fill,pg_1,f_jpg';

        return url.slice(0, uploadIndex + 8) + transformation + url.slice(uploadIndex + 7);
    };

    const isPreviewable = (docUrl) => {
        if (!docUrl) return false;
        const ext = docUrl.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(ext);
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase();
        if (s === 'approved') {
            return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">Approved</span>;
        }
        if (s === 'rejected') {
            return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 whitespace-nowrap">Rejected</span>;
        }
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap uppercase">Pending</span>;
    };

    return (
        <div className="space-y-4 p-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                    <Upload size={16} />
                    Upload Document
                </button>
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <FileText size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No documents uploaded yet.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {documents.map((doc) => (
                        <div key={doc._id} className="flex items-center justify-between py-4 group hover:bg-gray-50 rounded-lg px-3 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    {isPreviewable(doc.url) ? (
                                        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                            <img
                                                src={getThumbnailUrl(doc) || doc.url}
                                                alt={doc.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="hidden w-full h-full items-center justify-center p-2.5 bg-primary/10 rounded-lg text-primary">
                                                <FileText size={20} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-2.5 bg-primary/10 rounded-lg text-primary">
                                            <FileText size={20} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px] md:max-w-md">{doc.name}</p>
                                        {getStatusBadge(doc.status)}
                                    </div>
                                    <p className="text-xs text-gray-400">{doc.size} · {doc.uploadDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 no-print">
                                <button
                                    title="Download"
                                    onClick={() => handleDownload(doc._id, doc.name)}
                                    className="p-2.5 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all cursor-pointer shadow-sm active:scale-95"
                                >
                                    <Download size={16} />
                                </button>
                                <button
                                    title="Delete"
                                    onClick={() => handleDeleteRequest(doc)}
                                    className="p-2.5 rounded-xl text-red-500 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 transition-all cursor-pointer shadow-sm active:scale-95"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isUploading && setShowUpload(false)} />
                    <div className="relative z-10">
                        {isUploading ? (
                            <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-in zoom-in-95">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="font-bold text-gray-700">Uploading to Cloudinary...</p>
                            </div>
                        ) : (
                            <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5"><Trash2 size={32} className="text-red-500" /></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Document</h3>
                        <p className="text-gray-500 mb-2">Are you sure you want to delete</p>
                        <p className="text-primary font-bold text-lg mb-6 max-w-full truncate px-4">"{deleteTarget.name}"?</p>
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8 w-full text-left">
                            <AlertTriangle size={16} className="shrink-0" />
                            This action cannot be undone. The file will be permanently removed.
                        </div>
                        <div className="flex items-center gap-4 w-full">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer">Cancel</button>
                            <button onClick={handleConfirmDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-100 cursor-pointer active:scale-95">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsList;
