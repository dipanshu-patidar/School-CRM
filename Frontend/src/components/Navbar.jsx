import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, User, Settings, LogOut, Menu } from 'lucide-react';

const Navbar = ({ role, onLogout, collapsed, setCollapsed }) => {
    const location = useLocation();

    const userName = sessionStorage.getItem('userName') || (role === 'admin' ? 'Admin' : 'Staff');
    const userRole = sessionStorage.getItem('userRole') || role;

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard Overview';
        if (path.includes('/students')) return 'Student Management';
        if (path.includes('/workshops')) return 'Workshops & Programs';
        if (path.includes('/attendance')) return 'Attendance Records';
        if (path.includes('/documents')) return 'Document Central';
        if (path.includes('/settings')) return 'System Settings';
        if (path.includes('/profile')) return 'My Profile';
        return 'Overview';
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-all cursor-pointer"
                >
                    <Menu size={22} />
                </button>
                <h2 className="text-xl font-semibold text-text">{getPageTitle()}</h2>
            </div>

            <div className="flex items-center gap-6">
                {/* Search Bar - Commented out temporarily 
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
                    />
                </div>
                */}

                {/* Notifications - Commented out temporarily
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors group">
                    <Bell size={20} className="group-hover:text-primary transition-colors" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                </button>
                */}

                {/* User Profile Dropdown Simulation */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-text">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                    </div>
                    <div className="relative group">
                        <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-primary/40 transition-all">
                            {sessionStorage.getItem('userAvatar') ? (
                                <img
                                    src={sessionStorage.getItem('userAvatar').startsWith('http')
                                        ? sessionStorage.getItem('userAvatar')
                                        : `http://localhost:5000${sessionStorage.getItem('userAvatar')}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={24} />
                            )}
                        </button>

                        {/* Mock Dropdown */}
                        <div className="absolute right-0 top-full pt-2 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                            <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2">
                                <Link to="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Settings size={16} /> Settings
                                </Link>
                                <hr className="my-1 border-gray-100" />
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                    onClick={onLogout}
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
