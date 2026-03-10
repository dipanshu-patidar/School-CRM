import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileUp, Loader2, Search, User } from 'lucide-react';

const UploadDocumentModal = ({ isOpen, onClose, onUpload, editDoc = null, students = [] }) => {
    const isEditing = !!editDoc;
    const [studentId, setStudentId] = useState('');
    const [status, setStatus] = useState('pending');
    const [documentType, setDocumentType] = useState('');
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setStudentId(editDoc.studentMongoId || '');
                setStatus(editDoc.status || 'pending');
                setDocumentType(editDoc.docName || '');
                setFile(null); // When editing, we usually don't show the previous file for re-upload unless requested

                // Set initial search term for editing
                const student = students.find(s => s._id === editDoc.studentMongoId);
                if (student) {
                    setSearchTerm(`${student.name} (${student.id})`);
                }
            } else {
                setStudentId('');
                setSearchTerm('');
                setDropdownOpen(false);
                setStatus('pending');
                setDocumentType('');
                setFile(null);
            }
        }
    }, [isOpen, editDoc, isEditing]);

    if (!isOpen) return null;

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Select Student <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-3 text-gray-400 z-10" />
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setDropdownOpen(true);
                                    if (!e.target.value) {
                                        setStudentId('');
                                    }
                                }}
                                onFocus={() => {
                                    if (!isEditing) setDropdownOpen(true);
                                }}
                                disabled={isEditing || isSubmitting}
                                required
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <Search size={16} />
                            </div>

                            {/* Dropdown Results */}
                            {dropdownOpen && !isEditing && (
                                <>
                                    <div className="fixed inset-0 z-[60]" onClick={() => setDropdownOpen(false)} />
                                    <div className="absolute z-[70] left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map(s => (
                                                <button
                                                    key={s._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setStudentId(s._id);
                                                        setSearchTerm(`${s.name} (${s.id})`);
                                                        setDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-gray-50 last:border-0 flex flex-col gap-0.5 ${studentId === s._id ? 'bg-primary/10' : ''}`}
                                                >
                                                    <span className="text-sm font-bold text-gray-900">{s.name}</span>
                                                    <span className="text-xs text-gray-500">ID: {s.id}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-gray-400">
                                                <Search size={24} className="mx-auto mb-2 opacity-20" />
                                                <p className="text-sm font-medium">No students matched "{searchTerm}"</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <input type="hidden" name="studentId" value={studentId} required />
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
