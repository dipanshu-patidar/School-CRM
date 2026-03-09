import React, { useState } from 'react';
import SettingsSidebar from '../components/SettingsSidebar';
import ProfileSettings from '../components/ProfileSettings';
import ProgramSettings from '../components/ProgramSettings';
import CompletionRules from '../components/CompletionRules';
import DocumentSettings from '../components/DocumentSettings';
import StaffManagement from '../components/StaffManagement';

const SettingsPage = ({ role }) => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'program':
                return <ProgramSettings />;
            case 'rules':
                return <CompletionRules />;
            case 'documents':
                return <DocumentSettings />;
            case 'staff':
                return <StaffManagement />;
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage system configuration and user settings.</p>
            </div>

            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} />
                <div className="flex-1 w-full min-w-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
