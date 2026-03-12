import React from 'react';
import ProfileSettings from '../components/ProfileSettings';

const SuperAdminSettings = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-[1000ms] ease-out">
            {/* Header section similar to Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-full blur-[2px]" />
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-3">
                        Settings <span className="text-primary not-italic">Profile</span>
                    </h1>
                    <p className="text-gray-400 font-bold tracking-widest text-xs mt-2 ml-1 uppercase">Manage your Administrative Profile</p>
                </div>
            </div>

            {/* Main Content Area - Just the Profile Settings component */}
            <div className="max-w-4xl">
                <ProfileSettings />
            </div>
        </div>
    );
};

export default SuperAdminSettings;
