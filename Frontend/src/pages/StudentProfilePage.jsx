import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Upload, X, Save, FileUp, Printer } from 'lucide-react';
import StudentProfileCard from '../components/StudentProfileCard';
import ProgressBar from '../components/ProgressBar';
import StudentTabs from '../components/StudentTabs';
import PrintHeader from '../components/PrintHeader';

const ALL_STUDENTS = [
    {
        id: 101, name: 'John Doe', points: 120, totalPoints: 250, status: 'Active',
        phone: '+1 234 567 890', email: 'john@example.com',
        assignedStaff: 'Sarah Lee', enrolledDate: '01 Jan 2026',
    },
    {
        id: 102, name: 'Sara Smith', points: 250, totalPoints: 250, status: 'Completed',
        phone: '+1 987 654 321', email: 'sara@example.com',
        assignedStaff: 'Tom Harris', enrolledDate: '15 Jan 2026',
    },
    {
        id: 103, name: 'Mike Brown', points: 60, totalPoints: 250, status: 'Active',
        phone: '+1 456 789 012', email: 'mike@example.com',
        assignedStaff: 'Sarah Lee', enrolledDate: '20 Jan 2026',
    },
    {
        id: 104, name: 'Emily White', points: 180, totalPoints: 250, status: 'Active',
        phone: '+1 321 654 987', email: 'emily@example.com',
        assignedStaff: 'Carol Kim', enrolledDate: '05 Feb 2026',
    },
    {
        id: 105, name: 'David Black', points: 300, totalPoints: 300, status: 'Completed',
        phone: '+1 654 321 789', email: 'david@example.com',
        assignedStaff: 'Tom Harris', enrolledDate: '10 Feb 2026',
    },
];

/* ────────────────────────────────
   EDIT STUDENT MODAL
──────────────────────────────── */
const EditStudentModal = ({ student, onClose, onSave }) => {
    const [form, setForm] = useState({ ...student });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Edit Student</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {[
                        { label: 'Full Name', name: 'name', type: 'text' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Phone', name: 'phone', type: 'text' },
                        { label: 'Assigned Staff', name: 'assignedStaff', type: 'text' },
                    ].map(field => (
                        <div key={field.name}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm cursor-pointer"
                        >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        className="flex-1 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ────────────────────────────────
   UPLOAD DOCUMENT MODAL
──────────────────────────────── */
const UploadDocumentModal = ({ onClose }) => {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);

    const handleFile = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${dragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <FileUp size={36} className="mx-auto mb-3 text-primary/50" />
                    {file ? (
                        <div>
                            <p className="font-bold text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Drag & drop or click to upload</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG, PNG — Max 10 MB</p>
                        </div>
                    )}
                    <input id="file-input" type="file" className="hidden" onChange={handleFile} />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        disabled={!file}
                        className="flex-1 py-3 bg-primary hover:bg-primary-hover disabled:bg-gray-200 disabled:text-gray-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <Upload size={16} /> Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ────────────────────────────────
   MAIN PAGE
──────────────────────────────── */
const StudentProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const [studentData, setStudentData] = useState(
        ALL_STUDENTS.find(s => s.id === parseInt(id)) || null
    );

    const handleSaveEdit = (updated) => {
        setStudentData(updated);
        setShowEditModal(false);
    };

    if (!studentData) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-6xl font-black text-gray-200 mb-4">404</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Student Not Found</h3>
                <p className="text-gray-500 mb-6">The student with ID #{id} does not exist.</p>
                <button
                    onClick={() => navigate('/dashboard/students')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-xl font-bold hover:bg-primary-hover transition-all cursor-pointer shadow-lg shadow-primary/20"
                >
                    <ArrowLeft size={18} />
                    Back to Students
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Content Isolation - hidden when modals are open */}
            <div className={`space-y-6 ${(showEditModal || showUploadModal) ? 'no-print' : ''}`}>
                <PrintHeader />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard/students')}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary font-bold mb-3 transition-colors cursor-pointer group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                            Back to Students
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                        <p className="text-gray-500 mt-1">View student progress and program activity.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer no-print focus:ring-2 focus:ring-gray-100"
                        >
                            <Printer size={16} />
                            Print Profile
                        </button>
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer no-print"
                        >
                            <Pencil size={16} />
                            Edit Student
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 no-print"
                        >
                            <Upload size={16} />
                            Upload Document
                        </button>
                    </div>
                </div>

                {/* Profile Summary Card */}
                <StudentProfileCard student={studentData} />

                {/* Progress Bar */}
                <div className="no-print">
                    <ProgressBar current={studentData.points} total={studentData.totalPoints} />
                </div>

                {/* Tabs */}
                <StudentTabs student={studentData} />
            </div>

            {/* Modals */}
            {showEditModal && (
                <EditStudentModal
                    student={studentData}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveEdit}
                />
            )}
            {showUploadModal && (
                <UploadDocumentModal onClose={() => setShowUploadModal(false)} />
            )}
        </div>
    );
};

export default StudentProfilePage;
