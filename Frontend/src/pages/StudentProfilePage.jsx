import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Upload, X, Save, FileUp, Printer } from 'lucide-react';
import api from '../api/axios';
import StudentProfileCard from '../components/StudentProfileCard';
import ProgressBar from '../components/ProgressBar';
import StudentTabs from '../components/StudentTabs';
import PrintHeader from '../components/PrintHeader';

/* ────────────────────────────────
   EDIT STUDENT MODAL
──────────────────────────────── */
const EditStudentModal = ({ student, onClose, onSave }) => {
    const [form, setForm] = useState({
        ...student,
        assignedStaff: student.assignedStaff?._id || student.assignedStaff || ''
    });
    const [staffOptions, setStaffOptions] = useState([]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await api.get('/api/users/staff');
                setStaffOptions(res.data.data);
            } catch (err) {
                console.error('Failed to fetch staff', err);
            }
        };
        fetchStaff();
    }, []);

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
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assigned Staff</label>
                        <select
                            name="assignedStaff"
                            value={form.assignedStaff}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm cursor-pointer"
                        >
                            <option value="">Select staff member...</option>
                            {staffOptions.map(staff => (
                                <option key={staff._id} value={staff._id}>{staff.name} ({staff.email})</option>
                            ))}
                        </select>
                    </div>
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
                            <option value="Dropped">Dropped</option>
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
   MAIN PAGE
──────────────────────────────── */
const StudentProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState('Attendance');
    const [triggerDocumentUpload, setTriggerDocumentUpload] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStudent = async () => {
        try {
            // Find by DB _id OR internal studentId ? We'll assume the param is the internal `id` OR MongoDB `_id`. 
            // In standard flows, id param is usually _id. Since students list maps _id, we should adjust.
            // But let's fetch all students and find the one matching the string ID if param `id` is the studentId.
            // Wait, the easiest way is the GET api/students/:id endpoint which expects the MongoDB _id.
            const res = await api.get(`/api/students/${id}`);
            setStudentData({
                ...res.data,
                totalPoints: 250,
                enrolledDate: new Date().toLocaleDateString('en-GB')
            });
        } catch (error) {
            console.error('Error fetching student', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const handleSaveEdit = async (updated) => {
        try {
            await api.put(`/api/students/${updated._id}`, updated);
            fetchStudent();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating student', error);
            alert('Failed to update student profile.');
        }
    };

    if (isLoading) return <div className="p-8 text-center font-medium">Loading Student Profile...</div>;

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
            <div className={`space-y-6 ${showEditModal ? 'no-print' : ''}`}>
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
                            onClick={() => {
                                setActiveTab('Documents');
                                setTriggerDocumentUpload(true);
                            }}
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
                <StudentTabs
                    student={studentData}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    triggerDocumentUpload={triggerDocumentUpload}
                    setTriggerDocumentUpload={setTriggerDocumentUpload}
                />
            </div>

            {/* Modals */}
            {showEditModal && (
                <EditStudentModal
                    student={studentData}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default StudentProfilePage;
