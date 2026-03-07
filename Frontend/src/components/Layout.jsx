import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, role, onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-text">
            {/* Sidebar - fixed on the left */}
            <Sidebar
                role={role}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                onLogout={onLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar role={role} onLogout={onLogout} />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
