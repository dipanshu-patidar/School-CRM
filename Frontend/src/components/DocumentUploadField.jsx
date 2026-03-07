import React, { useRef, useState } from 'react';
import { FileUp, X, FileText, Image as ImageIcon, File } from 'lucide-react';

const DocumentUploadField = ({ onFileSelect, selectedFile, label = "Assessment Upload" }) => {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef();

    const handleFile = (f) => {
        if (f) onFileSelect(f);
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

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <ImageIcon size={24} className="text-blue-500" />;
        if (ext === 'pdf') return <FileText size={24} className="text-red-500" />;
        if (['doc', 'docx'].includes(ext)) return <File size={24} className="text-primary" />;
        return <File size={24} className="text-gray-500" />;
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                {label}
            </label>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative group ${dragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />

                {selectedFile ? (
                    <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            {getFileIcon(selectedFile.name)}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileSelect(null);
                            }}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="py-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <FileUp size={24} className="text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOC, Images (Max 10MB)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentUploadField;
