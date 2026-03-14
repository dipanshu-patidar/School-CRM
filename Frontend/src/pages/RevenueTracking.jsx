import React, { useState, useEffect } from 'react';
import { 
    DollarSign, 
    TrendingUp, 
    Calendar, 
    CreditCard,
    FileDown,
    Filter,
    Activity,
    Target,
    RefreshCw,
    Clock,
    Download,
    Eye,
    Trash2,
    X
} from 'lucide-react';
import api from '../api/axios';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const RevenueTracking = () => {
    const [stats, setStats] = useState({
        ytdRevenue: 0,
        mrr: 0,
        yearlyRevenue: 0,
        pendingInvoices: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [yearlyData, setYearlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const fetchRevenueData = async () => {
        try {
            const response = await api.get('/api/superadmin/revenue/stats');
            if (response.data.success) {
                const { stats, monthlyData, yearlyData, transactions } = response.data.data;
                setStats(stats);
                setMonthlyData(monthlyData);
                setYearlyData(yearlyData);
                setTransactions(transactions);
            }
        } catch (error) {
            console.error('Error fetching revenue stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTransaction = async () => {
        if (!selectedTransaction || !selectedTransaction._id) {
            toast.error('Record ID missing. Please refresh the page.');
            return;
        }
        
        try {
            const response = await api.delete(`/api/superadmin/subscriptions/${selectedTransaction._id}`);

            if (response.data.success) {
                toast.success('Transaction purged successfully');
                setDeleteModal(false);
                fetchRevenueData(); // Refresh all stats
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error(error.response?.data?.message || 'Purge failed');
        }
    };

    const handleExportExcel = () => {
        if (!transactions || transactions.length === 0) {
            toast.error('No transaction data to export');
            return;
        }

        const toastId = toast.loading('Exporting to Excel...');
        
        try {
            // Prepare data: Remove internal _id and format for Excel
            const exportData = transactions.map(t => ({
                'Transaction Code': t.id,
                'Business Entity': t.org,
                'Liquid Amount': t.amount,
                'Verification Status': t.status,
                'Timestamp': t.date
            }));

            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(exportData);
            
            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Revenue Ledger');
            
            // Generate filename
            const filename = `Revenue_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            // Save file
            XLSX.writeFile(wb, filename);
            toast.success('Ledger exported successfully', { id: toastId });
        } catch (error) {
            console.error('Excel Export Error:', error);
            toast.error('Failed to export Excel', { id: toastId });
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, []);

const RevenueCard = ({ title, value, badge, icon: Icon, isGold }) => (
        <div className={`bg-white rounded-[2rem] p-8 border ${isGold ? 'border-primary/30 shadow-primary/10' : 'border-gray-100 shadow-xl shadow-gray-100/50'} flex flex-col justify-between hover:scale-[1.05] transition-all duration-500 group relative overflow-hidden animate-in zoom-in-95 duration-700`}>
            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-primary">$</span>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()}</h3>
                </div>
            </div>
            <div className="mt-8 flex items-center justify-between relative z-10">
                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${isGold ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-900 text-white'}`}>
                    {Icon && <Icon size={14} strokeWidth={3} />}
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] italic">{badge}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-2 md:p-6 pb-20">
            {/* Main Header */}
            <div className="flex justify-between items-start">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-primary rounded-full blur-[2px] animate-pulse" />
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase italic scale-y-110 origin-left">
                        Financial <span className="text-primary not-italic text-glow-gold">Overview</span>
                    </h1>
                    <p className="text-gray-400 font-bold tracking-[0.3em] text-[10px] mt-2 ml-1 flex items-center gap-2">
                        <Activity size={12} className="text-primary" />
                        TRACK MONTHLY RECURRING REVENUE & QUANTUM TRANSACTIONS
                    </p>
                </div>
                <button 
                    onClick={() => {
                        setLoading(true);
                        fetchRevenueData();
                    }}
                    className="p-4 bg-white border border-gray-100 rounded-[1.5rem] text-gray-400 hover:text-primary hover:border-primary/30 transition-all shadow-xl shadow-gray-200/50 group active:rotate-180 duration-500"
                >
                    <RefreshCw size={24} className={`${loading ? 'animate-spin' : ''} group-hover:rotate-180 transition-all duration-700`} />
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <RevenueCard 
                    title="Net Revenue (YTD)"
                    value={stats.ytdRevenue}
                    badge={`${stats.growthVelocity} vs last year`}
                    icon={TrendingUp}
                    isGold={true}
                />
                <RevenueCard 
                    title="Monthly Recurring Revenue"
                    value={stats.mrr}
                    badge={stats.mrrBadge}
                    icon={Activity}
                />
                <RevenueCard 
                    title="Yearly Revenue"
                    value={stats.yearlyRevenue}
                    badge="Current Year"
                    icon={Calendar}
                />
                <RevenueCard 
                    title="Pending Invoices"
                    value={stats.pendingInvoices}
                    badge="Automated Retries"
                    icon={Clock}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Monthly Revenue Trend */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-primary/10 transition-all duration-1000" />
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <TrendingUp className="text-primary" size={20} strokeWidth={3} />
                            Monthly Revenue Trend
                        </h3>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">Real-time Feedback</span>
                    </div>
                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} barGap={12}>
                                <CartesianGrid vertical={false} strokeDasharray="0" stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }}
                                    dy={15}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc', opacity: 0.8 }}
                                    contentStyle={{ 
                                        backgroundColor: '#fff',
                                        borderRadius: '20px', 
                                        border: '1px solid #f1f5f9', 
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        fontSize: '10px',
                                        letterSpacing: '0.1em',
                                        padding: '12px 20px'
                                    }}
                                    itemStyle={{ color: '#D4AF37' }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#D4AF37" 
                                    radius={[6, 6, 0, 0]} 
                                    barSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Yearly Performance */}
                <div className="bg-white rounded-[3rem] p-10 border border-warm-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col group relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <Calendar className="text-primary" size={20} strokeWidth={3} />
                            Yearly Performance
                        </h3>
                    </div>
                    <div className="flex-1 h-[350px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={yearlyData}>
                                <XAxis 
                                    dataKey="year" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#1e293b', fontSize: 14, fontWeight: 900, italic: true }}
                                />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[15, 15, 0, 0]} 
                                    barSize={70}
                                >
                                    {yearlyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === yearlyData.length - 1 ? '#D4AF37' : '#f1f5f9'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Velocity</p>
                            <p className="text-xl font-black text-gray-900 italic">{stats.growthVelocity} <span className="text-primary text-xs not-italic">YOY</span></p>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100 italic font-black">
                            {new Date().getMonth() < 3 ? 'Q1' : new Date().getMonth() < 6 ? 'Q2' : new Date().getMonth() < 9 ? 'Q3' : 'Q4'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[3.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50 relative group">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-wider flex items-center gap-3">
                            Transaction <span className="text-primary not-italic">Quantum Log</span>
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-2 italic">Immutable Financial Records</p>
                    </div>
                    <button 
                        onClick={handleExportExcel}
                        className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic flex items-center gap-3 shadow-xl shadow-gray-200"
                    >
                        <Download size={16} strokeWidth={3} />
                        Export Ledger
                    </button>
                </div>

                <div id="transaction-table" className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Code</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Business Entity</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Liquid Amount</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Verification</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Timestamp</th>
                                <th className="px-10 py-6 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((t) => (
                                <tr key={t.id} className="group hover:bg-gray-50 transition-all duration-500">
                                    <td className="px-10 py-8">
                                        <span className="text-gray-900 font-black text-[10px] tracking-widest">{t.id}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-all shadow-[0_0_10px_rgba(212,175,55,0)] group-hover:shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                            <span className="text-gray-900 font-black uppercase italic tracking-widest text-sm">{t.org}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-primary font-black text-lg italic tracking-tight">
                                            ${t.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border italic ${
                                            t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-gray-900 font-black text-[10px] uppercase italic tracking-[0.1em]">{t.date}</td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedTransaction(t);
                                                    setViewModal(true);
                                                }}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-gray-100 border border-gray-100 rounded-2xl transition-all shadow-sm"
                                            >
                                                <Eye size={18} strokeWidth={3} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setSelectedTransaction(t);
                                                    setDeleteModal(true);
                                                }}
                                                className="p-3 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 border border-red-100 rounded-2xl transition-all shadow-sm"
                                            >
                                                <Trash2 size={18} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex justify-center">
                    <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-[0.5em] transition-all italic">
                        Synchronize Full Transaction Ledger
                    </button>
                </div>
            </div>
            {/* View Modal */}
            {viewModal && selectedTransaction && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-wider">
                                    Transaction <span className="text-primary not-italic">Deep Sheet</span>
                                </h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1 shrink-0 italic">{selectedTransaction.id}</p>
                            </div>
                            <button onClick={() => setViewModal(false)} className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Entity</p>
                                    <p className="text-lg font-black text-gray-900 uppercase italic tracking-tight">{selectedTransaction.org}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantum Status</p>
                                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest italic inline-block">
                                        Paid
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Liquid Amount</p>
                                    <p className="text-2xl font-black text-primary italic tracking-tighter">${selectedTransaction.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Timestamp</p>
                                    <p className="text-sm font-black text-gray-900 uppercase italic tracking-widest">{selectedTransaction.date}</p>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-gray-50">
                                <button 
                                    onClick={() => setViewModal(false)}
                                    className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all italic shadow-xl shadow-gray-200"
                                >
                                    Close Modal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && selectedTransaction && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100">
                                <Trash2 size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight mb-4">Purge Record?</h3>
                            <p className="text-sm text-gray-500 font-bold mb-10 px-4 leading-relaxed">
                                You are about to permanently delete record <span className="text-red-500">{selectedTransaction.id}</span>. This action is irreversible.
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setDeleteModal(false)}
                                    className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteTransaction}
                                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic shadow-lg shadow-red-200"
                                >
                                    Confirm Purge
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueTracking;
