import React, { useState } from 'react';
import AttendanceTable from './AttendanceTable';
import DocumentsList from './DocumentsList';
import NotesSection from './NotesSection';

const TABS = ['Attendance', 'Documents', 'Notes'];

const StudentTabs = ({ student }) => {
    const [activeTab, setActiveTab] = useState('Attendance');

    const attendanceRecords = student?.attendance || [];
    const notes = student?.notes || [];
    const documents = student?.documents || [];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tab Bar */}
            <div className="flex border-b border-gray-100 px-6 no-print">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-4 text-sm font-bold transition-all cursor-pointer border-b-2 -mb-[1px] ${activeTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="transition-all">
                {activeTab === 'Attendance' && <AttendanceTable student={student} records={attendanceRecords} />}
                {activeTab === 'Documents' && <DocumentsList student={student} initialDocuments={documents} />}
                {activeTab === 'Notes' && <NotesSection student={student} initialNotes={notes} />}
            </div>
        </div>
    );
};

export default StudentTabs;
