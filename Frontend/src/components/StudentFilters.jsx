import React from 'react';
import { Search, Filter, Users } from 'lucide-react';

const StudentFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, totalStudents }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="flex flex-1 items-center gap-4 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative min-w-[140px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all shadow-sm text-sm font-medium"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Total Students Counter */}
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg text-primary font-bold text-sm whitespace-nowrap">
                <Users size={16} />
                {totalStudents} Students
            </div>
        </div>
    );
};

export default StudentFilters;
