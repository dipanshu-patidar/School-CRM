import React from 'react';
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Briefcase,
    FileText,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Settings
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ role, collapsed, setCollapsed, onLogout }) => {
    const adminMenu = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
        { id: 'workshops', label: 'Workshops', icon: Briefcase },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'staff', label: 'Staff Member', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const staffMenu = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const menuItems = role === 'admin' ? adminMenu : staffMenu;

    return (
        <aside
            className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col sticky top-0 ${collapsed ? 'w-20' : 'w-[260px]'
                }`}
        >
            {/* Logo Section */}
            <div className={`h-16 flex items-center border-b border-gray-100 transition-all ${collapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
                <span className={`text-xl font-bold text-[#4F46E5] tracking-tight transition-all duration-300 ${collapsed ? 'block' : ''}`}>
                    {collapsed ? 'RC' : 'RIDSS CRM'}
                </span>
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {/* Show toggle button below logo in collapsed mode if needed, or just keep it simple */}
            {collapsed && (
                <div className="flex justify-center p-3 border-b border-gray-50">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.id}
                            to={item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`}
                            end={item.id === 'dashboard'}
                            className={({ isActive }) =>
                                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group cursor-pointer ${isActive
                                    ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-100'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <Icon size={20} className="text-inherit opacity-70 group-[.active]:opacity-100 group-hover:opacity-100" />
                            {!collapsed && (
                                <span className="font-medium text-[15px] whitespace-nowrap">{item.label}</span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-100">
                <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all font-medium cursor-pointer"
                    onClick={onLogout}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
