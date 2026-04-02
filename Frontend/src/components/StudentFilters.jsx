import React from 'react';
import { Search, Filter, Users, X, RotateCcw } from 'lucide-react';

const StudentFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, dateFrom, setDateFrom, dateTo, setDateTo, totalStudents }) => {
    const hasFilters = searchTerm || statusFilter !== 'All' || dateFrom || dateTo;

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setDateFrom('');
        setDateTo('');
    };

    return (
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row flex-1 items-center gap-3 w-full">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                    <input
                        type="text"
                        placeholder="Search name, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-sm"
                    />
                </div>

                {/* Date Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">From</span>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">To</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="relative min-w-[140px] w-full md:w-auto">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all shadow-sm text-xs font-bold"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Secondary Completion">Secondary Completion</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </div>

                {/* Clear Icon Button */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        title="Clear all filters"
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-all cursor-pointer group flex items-center gap-1.5 px-3"
                    >
                        <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                        <span className="text-xs font-bold">Reset</span>
                    </button>
                )}
            </div>

            {/* Total Students Counter */}
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg text-primary font-bold text-sm whitespace-nowrap">
                <Users size={16} />
                {totalStudents} Found
            </div>
        </div>
    );
};

export default StudentFilters;
