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
    Settings,
    Building2,
    CreditCard,
    DollarSign,
    ShieldCheck
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import logoImg from '../assets/login/logo.png';

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

    const superAdminMenu = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'admin', label: 'Admin Management', icon: Building2 },
        { id: 'plans', label: 'Plan & Pricing', icon: CreditCard },
        { id: 'revenue', label: 'Revenue', icon: DollarSign },
        { id: 'settings', label: 'Settings', icon: ShieldCheck },
    ];

    const menuItems = role === 'super_admin' ? superAdminMenu : (role === 'admin' ? adminMenu : staffMenu);

    return (
        <aside
            className={`bg-sidebar border-r border-[#1F1F1F] h-screen flex flex-col sticky top-0 transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? 'w-20' : 'w-[300px]'
                }`}
        >
            {/* Logo Section */}
            <div className={`relative flex flex-col items-center justify-center border-b border-[#1F1F1F] transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? 'h-24 px-2' : 'h-64 px-6'}`}>
                {/* Maximized Logo Container */}
                <div className={`rounded-3xl p-2 shadow-black/50 overflow-hidden flex items-center justify-center transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? 'w-16 h-16' : 'w-56 h-56'}`}>
                    <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.id}
                            to={item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`}
                            end={item.id === 'dashboard'}
                            className={({ isActive }) =>
                                `w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] group cursor-pointer ${isActive
                                    ? 'bg-primary text-black shadow-xl shadow-primary/20'
                                    : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'
                                }`
                            }
                        >
                            <div className="flex items-center gap-4 w-full">
                                <Icon size={22} className="shrink-0 text-inherit opacity-70 group-[.active]:opacity-100 group-hover:opacity-100 transition-all duration-[1000ms]" />
                                <div className={`overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? 'max-w-0 opacity-0 -translate-x-4' : 'max-w-xs opacity-100 translate-x-0'}`}>
                                    <span className="font-bold text-[16px] whitespace-nowrap block">{item.label}</span>
                                </div>
                            </div>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-[#1F1F1F]">
                <button
                    className="w-full flex items-center px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50/10 transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] font-bold cursor-pointer overflow-hidden group"
                    onClick={onLogout}
                >
                    <div className="flex items-center gap-4 w-full">
                        <LogOut size={22} className="shrink-0 transition-transform group-hover:scale-110" />
                        <div className={`overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${collapsed ? 'max-w-0 opacity-0 -translate-x-4' : 'max-w-xs opacity-100 translate-x-0'}`}>
                            <span className="whitespace-nowrap">Logout</span>
                        </div>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
