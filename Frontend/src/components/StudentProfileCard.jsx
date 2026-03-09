import React from 'react';
import { User, Phone, Mail, UserCog } from 'lucide-react';

const StudentProfileCard = ({ student }) => {
    const getStatusStyles = (status) => {
        return status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : 'bg-primary/10 text-primary border-primary/20';
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold shrink-0">
                    {student.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(student.status)}`}>
                            {student.status}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">Student ID: #{student.id}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="p-1.5 rounded-lg bg-gray-50">
                                <Phone size={14} className="text-gray-400" />
                            </div>
                            <span>{student.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="p-1.5 rounded-lg bg-gray-50">
                                <Mail size={14} className="text-gray-400" />
                            </div>
                            <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="p-1.5 rounded-lg bg-gray-50">
                                <UserCog size={14} className="text-gray-400" />
                            </div>
                            <span>{student.assignedStaff?.name || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="p-1.5 rounded-lg bg-gray-50">
                                <User size={14} className="text-gray-400" />
                            </div>
                            <span>Enrolled: {student.enrolledDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileCard;
