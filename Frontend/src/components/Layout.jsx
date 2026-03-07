import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import PrintHeader from './PrintHeader';

const Layout = ({ children, role, onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-text">
            {/* Sidebar - fixed on the left */}
            <div id="sidebar" className="no-print contents">
                <Sidebar
                    role={role}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    onLogout={onLogout}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div id="navbar" className="no-print contents">
                    <Navbar role={role} onLogout={onLogout} collapsed={collapsed} setCollapsed={setCollapsed} />
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8" id="main-content">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
