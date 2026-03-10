import React, { useState, useEffect } from 'react';
import { X, FileText, Save, User, Calendar, Info, Activity, Target, Zap, FileUp, Loader2, Search } from 'lucide-react';
import DocumentUploadField from './DocumentUploadField';
import { getStudents } from '../api/studentApi';

const PCPReportForm = ({ isOpen, onClose, onSave, editData = null }) => {
    const [students, setStudents] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        studentMongoId: '',
        dateOfService: new Date().toISOString().split('T')[0],
        serviceDescription: '',
        faceToFace: 'Face-to-Face',
        purpose: '',
        intervention: '',
        effectiveness: '',
        staffNotes: '',
        staffSignature: '',
        assessmentFile: null,
        status: 'Completed'
    });

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
            if (editData) {
                const s = editData.studentId; // This might be populated or just ID
                setSearchTerm(editData.studentName ? `${editData.studentName} (${editData.studentId || ''})` : '');
                // Only take the fields that the form actually manages
                setFormData({
                    studentMongoId: editData.studentMongoId || '',
                    dateOfService: editData.dateOfService ? new Date(editData.dateOfService).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    serviceDescription: editData.serviceDescription || '',
                    faceToFace: editData.faceToFace || editData.faceToFaceIndicator || 'Face-to-Face',
                    purpose: editData.purpose || '',
                    intervention: editData.intervention || '',
                    effectiveness: editData.effectiveness || '',
                    staffNotes: editData.staffNotes || '',
                    staffSignature: editData.staffSignature || '',
                    assessmentFile: editData.assessmentFile || null,
                    status: editData.status || 'Completed'
                });
            } else {
                setFormData({
                    studentMongoId: '',
                    dateOfService: new Date().toISOString().split('T')[0],
                    serviceDescription: '',
                    faceToFace: 'Face-to-Face',
                    purpose: '',
                    intervention: '',
                    effectiveness: '',
                    staffNotes: '',
                    staffSignature: '',
                    assessmentFile: null,
                    status: 'Completed'
                });
            }
        }
    }, [isOpen, editData]);

    const fetchStudents = async () => {
        try {
            setIsLoadingStudents(true);
            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            console.error('Error fetching students:', err);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    if (!isOpen) return null;

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (file) => {
        setFormData(prev => ({ ...prev, assessmentFile: file }));
    };

    const handleSubmit = (e, status = 'Completed') => {
        e.preventDefault();
        onSave({
            ...formData,
            status: status
        }, formData.studentMongoId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <FileText size={24} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{editData ? 'Edit Report' : 'New PCP / IGP Report'}</h3>
                            <p className="text-sm text-gray-500 font-medium">Create a structured service documentation using P.I.E format.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form id="pcpForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
                    {/* SECTION 1 — BASIC INFORMATION */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Info size={18} className="text-primary" />
                            <h4 className="font-bold text-gray-900">Section 1: Basic Information</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Student Full Name <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-3 text-gray-400 z-10" />
                                    <input
                                        type="text"
                                        placeholder={isLoadingStudents ? 'Loading students...' : 'Search by name or ID...'}
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setDropdownOpen(true);
                                            if (!e.target.value) {
                                                setFormData(prev => ({ ...prev, studentMongoId: '' }));
                                            }
                                        }}
                                        onFocus={() => {
                                            if (!editData) setDropdownOpen(true);
                                        }}
                                        disabled={!!editData || isLoadingStudents}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10 disabled:opacity-50"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <Search size={16} />
                                    </div>

                                    {/* Dropdown Results */}
                                    {dropdownOpen && !isLoadingStudents && !editData && (
                                        <>
                                            <div className="fixed inset-0 z-[60]" onClick={() => setDropdownOpen(false)} />
                                            <div className="absolute z-[70] left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                                                {filteredStudents.length > 0 ? (
                                                    filteredStudents.map(s => (
                                                        <button
                                                            key={s._id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, studentMongoId: s._id }));
                                                                setSearchTerm(`${s.name} (${s.id})`);
                                                                setDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-gray-50 last:border-0 flex flex-col gap-0.5 ${formData.studentMongoId === s._id ? 'bg-primary/10' : ''}`}
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
                                    <input type="hidden" name="studentMongoId" value={formData.studentMongoId} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Date of Service <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        required
                                        type="date"
                                        name="dateOfService"
                                        value={formData.dateOfService}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Service Description
                                </label>
                                <textarea
                                    name="serviceDescription"
                                    value={formData.serviceDescription}
                                    onChange={handleChange}
                                    placeholder="Enter service details..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[80px] resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Face-to-Face Indicator
                                </label>
                                <select
                                    name="faceToFace"
                                    value={formData.faceToFace}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                                >
                                    <option value="Face-to-Face">Face-to-Face</option>
                                    <option value="Virtual">Virtual</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2 — P.I.E SERVICE NOTES */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity size={18} className="text-primary" />
                            <h4 className="font-bold text-gray-900">Section 2: P.I.E Service Notes</h4>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Target size={14} className="text-emerald-500" />
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Purpose
                                    </label>
                                </div>
                                <textarea
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    placeholder="Explain why the service was provided..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none shadow-inner"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" />
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Intervention
                                    </label>
                                </div>
                                <textarea
                                    name="intervention"
                                    value={formData.intervention}
                                    onChange={handleChange}
                                    placeholder="Explain what actions the staff performed..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none shadow-inner"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-primary" />
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Effectiveness
                                    </label>
                                </div>
                                <textarea
                                    name="effectiveness"
                                    value={formData.effectiveness}
                                    onChange={handleChange}
                                    placeholder="Explain the outcome or impact of the service..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* SECTION 3 — STAFF NOTES / SIGNATURE */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Info size={18} className="text-primary" />
                                <h4 className="font-bold text-gray-900">Section 3: Staff Notes</h4>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Staff Notes
                                    </label>
                                    <textarea
                                        name="staffNotes"
                                        value={formData.staffNotes}
                                        onChange={handleChange}
                                        placeholder="Internal notes..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Staff Signature <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="staffSignature"
                                        value={formData.staffSignature}
                                        onChange={handleChange}
                                        placeholder="Type full name for signature"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4 — ASSESSMENT UPLOAD */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <FileUp size={18} className="text-primary" />
                                <h4 className="font-bold text-gray-900">Section 4: Uploads</h4>
                            </div>
                            <DocumentUploadField
                                onFileSelect={handleFileSelect}
                                selectedFile={formData.assessmentFile}
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, 'Draft')}
                        type="button"
                        className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold hover:bg-primary/20 transition-all cursor-pointer active:scale-95"
                    >
                        Save as Draft
                    </button>
                    <button
                        form="pcpForm"
                        type="submit"
                        className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
                    >
                        <Save size={18} />
                        Save Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PCPReportForm;
