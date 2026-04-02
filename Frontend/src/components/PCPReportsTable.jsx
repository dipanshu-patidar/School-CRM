import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, FileText, Plus } from 'lucide-react';
import PCPReportRow from './PCPReportRow';

const PCPReportsTable = ({ reports, onView, onEdit, onDelete, onCreateNew, userRole, onPrint }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const studentName = report?.studentName || '';
            const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [reports, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (!reports || reports.length === 0) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-16 flex flex-col items-center justify-center text-center px-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <FileText size={36} className="text-primary/40" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Progress / Clinical notes created yet</h3>
                <p className="text-gray-500 max-w-xs mb-8 font-medium">Start by creating your first service documentation report using the P.I.E format.</p>
                <button
                    onClick={onCreateNew}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95"
                >
                    <Plus size={18} />
                    Create First Report
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Progress / Clinical Notes</h2>
                    <p className="text-sm text-gray-500 font-medium">List of all service documentation reports created using the P.I.E format.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 no-print">
                    <div className="relative w-full sm:w-64 group">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by student..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative w-full sm:w-40 group">
                        <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm cursor-pointer appearance-none"
                        >
                            <option value="All">All Reports</option>
                            <option value="Draft">Draft</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col print:border-none print:shadow-none">
                {/* Desktop/Print Table */}
                <div className="hidden md:block print:block overflow-x-auto print:overflow-visible">
                    <table className="w-full text-left print:table">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Student Name</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Document Type</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Date of Service</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Staff</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Created Date</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none no-print text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedReports.map(report => (
                                <PCPReportRow
                                    key={report.id}
                                    report={report}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    userRole={userRole}
                                    onPrint={onPrint}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View - Hidden in Print */}
                <div className="md:hidden print:hidden p-4 space-y-4 bg-gray-50/30">
                    {paginatedReports.map(report => (
                        <PCPReportRow
                            key={`mobile-${report.id}`}
                            report={report}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            userRole={userRole}
                            isMobile={true}
                            onPrint={onPrint}
                        />
                    ))}
                </div>

                {filteredReports.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} className="opacity-20" />
                        </div>
                        <p className="font-bold text-lg text-gray-900">No reports found</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-5 border-t border-gray-50 bg-white flex items-center justify-between no-print">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-primary">{Math.min(filteredReports.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredReports.length, currentPage * itemsPerPage)}</span> of {filteredReports.length} results
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 disabled:opacity-30 disabled:hover:shadow-none cursor-pointer"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1
                                        ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                        : 'text-gray-500 hover:bg-white hover:shadow-sm'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-md transition-all text-gray-400 disabled:opacity-30 disabled:hover:shadow-none cursor-pointer"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PCPReportsTable;
