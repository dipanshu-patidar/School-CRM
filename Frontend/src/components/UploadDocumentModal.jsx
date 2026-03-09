import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileUp, Loader2 } from 'lucide-react';

const UploadDocumentModal = ({ isOpen, onClose, onUpload, editDoc = null, students = [] }) => {
    const isEditing = !!editDoc;
    const [studentId, setStudentId] = useState('');
    const [status, setStatus] = useState('pending');
    const [documentType, setDocumentType] = useState('');
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setStudentId(editDoc.studentMongoId || '');
                setStatus(editDoc.status || 'pending');
                setDocumentType(editDoc.docName || '');
                setFile(null); // When editing, we usually don't show the previous file for re-upload unless requested
            } else {
                setStudentId('');
                setStatus('pending');
                setDocumentType('');
                setFile(null);
            }
        }
    }, [isOpen, editDoc, isEditing]);

    if (!isOpen) return null;

    const handleFile = (f) => {
        if (f) setFile(f);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentId || (!file && !isEditing) || !documentType) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('studentId', studentId);
            formData.append('documentType', documentType);
            formData.append('status', status);
            if (file) {
                formData.append('file', file);
            }

            await onUpload(studentId, formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm no-print" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Upload size={20} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{isEditing ? 'Edit Document' : 'Upload Document'}</h3>
                            <p className="text-xs text-gray-500">{isEditing ? 'Update document details and status.' : 'Upload housing verification or other files.'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Select Student <span className="text-red-400">*</span>
                        </label>
                        <select
                            required
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
                        >
                            <option value="">Choose a student...</option>
                            {students.map(s => (
                                <option key={s._id} value={s._id}>{s.name} ({s.id})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Document Name / Type <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Housing Verification, ID Card..."
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Document Status <span className="text-red-400">*</span>
                        </label>
                        <select
                            required
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
                        >
                            <option value="pending">Pending Approval</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            {isEditing ? 'Replace File (Optional)' : 'Upload File *'}
                        </label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current.click()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
                        >
                            <FileUp size={36} className="mx-auto mb-3 text-primary/50" />
                            {file ? (
                                <div>
                                    <p className="font-bold text-gray-800 break-all">{file.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Drag & drop or click to browse</p>
                                    <p className="text-xs text-gray-400 mt-2">PDF, DOC, DOCX, JPG, PNG — Max 10MB</p>
                                </div>
                            )}
                            <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !studentId || (!file && !isEditing) || !documentType}
                            className="flex-1 py-3 bg-primary disabled:bg-gray-200 disabled:text-gray-400 hover:bg-primary-hover text-black rounded-xl font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                isEditing ? 'Save Changes' : 'Upload Document'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadDocumentModal;
