import React, { useRef, useState } from 'react';
import { FileText, Download, Trash2, Upload, X, FileUp, Printer } from 'lucide-react';

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
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Drop Zone */}
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

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
                        Cancel
                    </button>
                    <button
                        disabled={!file}
                        onClick={() => { onUpload(file); onClose(); }}
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
const DocumentsList = () => {
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Lease.pdf', uploadDate: '10 Mar 2026', size: '245 KB' },
        { id: 2, name: 'Mortgage.pdf', uploadDate: '12 Mar 2026', size: '1.2 MB' },
    ]);
    const [showUpload, setShowUpload] = useState(false);

    const handleUpload = (file) => {
        const newDoc = {
            id: Date.now(),
            name: file.name,
            uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            size: file.size < 1024 * 1024
                ? `${(file.size / 1024).toFixed(0)} KB`
                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        };
        setDocuments(prev => [newDoc, ...prev]);
    };

    const handleDelete = (id) => setDocuments(prev => prev.filter(d => d.id !== id));

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
                        <div key={doc.id} className="flex items-center justify-between py-4 group hover:bg-gray-50 rounded-lg px-3 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                                    <p className="text-xs text-gray-400">{doc.size} · {doc.uploadDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                                <button
                                    title="Print Document"
                                    onClick={() => window.print()}
                                    className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                                >
                                    <Printer size={16} />
                                </button>
                                <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
                                    <Download size={16} />
                                </button>
                                <button onClick={() => handleDelete(doc.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onUpload={handleUpload}
                />
            )}
        </div>
    );
};

export default DocumentsList;
