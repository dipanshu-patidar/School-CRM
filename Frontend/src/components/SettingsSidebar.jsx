import React from 'react';
import { User, Users, Settings, Target, FileType } from 'lucide-react';

const MENU_ITEMS = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'program', label: 'Program Settings', icon: Settings },
    { id: 'rules', label: 'Completion Rules', icon: Target },
    { id: 'documents', label: 'Document Settings', icon: FileType },
    { id: 'staff', label: 'Staff Management', icon: Users },
];

const SettingsSidebar = ({ activeTab, setActiveTab, role }) => {
    const menuItems = role === 'admin' ? MENU_ITEMS : [MENU_ITEMS[0]];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-row overflow-x-auto md:flex-col gap-1 md:w-64 shrink-0">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer
                            ${isActive
                                ? 'bg-primary text-black shadow-md shadow-primary/20'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                            }
                        `}
                    >
                        <Icon size={18} className={isActive ? 'text-black' : 'text-gray-400'} />
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
};

export default SettingsSidebar;
