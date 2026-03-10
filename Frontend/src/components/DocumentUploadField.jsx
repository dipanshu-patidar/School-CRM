import React, { useRef, useState, useEffect } from 'react';
import { FileUp, X, FileText, Image as ImageIcon, File as FileIcon } from 'lucide-react';

const DocumentUploadField = ({ onFileSelect, selectedFile, label = "Assessment Upload" }) => {
    const [dragging, setDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const inputRef = useRef();

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }

        if (selectedFile instanceof File) {
            if (selectedFile.type.startsWith('image/')) {
                const url = URL.createObjectURL(selectedFile);
                setPreviewUrl(url);
                return () => URL.revokeObjectURL(url);
            } else {
                setPreviewUrl(null); // No preview for non-image local files
            }
            return;
        }

        if (typeof selectedFile === 'string') {
            let url = selectedFile;
            // Support both Cloudinary and ImageKit transformations for preview
            if (url.includes('res.cloudinary.com')) {
                const uploadIndex = url.indexOf('/upload/');
                if (uploadIndex !== -1) {
                    const parts = url.split('.');
                    const extension = parts.pop().toLowerCase();
                    const transformation = extension === 'pdf'
                        ? 'w_400,h_500,c_fill,pg_1,f_jpg'
                        : 'w_400,h_400,c_fill,f_auto,q_auto';
                    url = url.slice(0, uploadIndex + 8) + transformation + url.slice(uploadIndex + 7);
                }
            } else if (url.includes('ik.imagekit.io')) {
                // ImageKit transformation
                url = `${url}?tr=w-400,h-400,cm-pad_resize,bg-F3F4F6`;
            }
            setPreviewUrl(url);
        }
    }, [selectedFile]);

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
        if (!fileName || typeof fileName !== 'string') return <FileIcon size={24} className="text-gray-500" />;
        const ext = fileName.split('.').pop().split('?')[0].toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <ImageIcon size={24} className="text-blue-500" />;
        if (ext === 'pdf') return <FileText size={24} className="text-red-500" />;
        if (['doc', 'docx'].includes(ext)) return <FileIcon size={24} className="text-primary" />;
        return <FileIcon size={24} className="text-gray-500" />;
    };

    const getFileName = (file) => {
        if (!file) return '';
        if (typeof file === 'string') {
            return file.split('/').pop().split('?')[0];
        }
        return file.name;
    };

    const getFileSize = (file) => {
        if (typeof file === 'string') return 'Cloud Storage';
        return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    };

    const isPreviewable = (fName) => {
        if (!fName) return false;
        const ext = fName.split('.').pop().split('?')[0].toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(ext);
    };

    const fileName = getFileName(selectedFile);

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
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        {isPreviewable(fileName) && (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                                {fileName.toLowerCase().endsWith('.pdf') ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50/30">
                                        <FileText size={48} className="text-red-400 mb-2" />
                                        <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">PDF Document</div>
                                    </div>
                                ) : previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50/30">
                                        <ImageIcon size={48} className="text-blue-400 mb-2" />
                                        <div className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Image</div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-primary/20 shadow-sm relative">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                {getFileIcon(fileName)}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{fileName}</p>
                                <p className="text-xs text-gray-500">{getFileSize(selectedFile)}</p>
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
