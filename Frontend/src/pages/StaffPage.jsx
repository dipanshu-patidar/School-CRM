import React from 'react';
import StaffManagement from '../components/StaffManagement';

const StaffPage = () => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                <p className="text-gray-500 mt-1">Manage staff members and their access roles.</p>
            </div>

            {/* Main Content */}
            <StaffManagement />
        </div>
    );
};

export default StaffPage;
