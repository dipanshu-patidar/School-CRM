import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit2, ShieldAlert, Eye, Users, GraduationCap, CheckCircle2, Zap, Mail, Phone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminManagement = () => {
    const [organizations, setOrganizations] = useState([]);
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approvalPaymentStatus, setApprovalPaymentStatus] = useState('Pending');
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All'); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [startDateFilter, setStartDateFilter] = useState(''); 
    const [endDateFilter, setEndDateFilter] = useState(''); 
    const [newOrg, setNewOrg] = useState({
        organizationName: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        confirmPassword: '',
        planId: '',
        phoneNumber: '',
        address: '',
        startDate: new Date().toISOString().split('T')[0],
        expireDate: '',
        planType: 'Monthly',
        paymentStatus: 'Pending',
        registrationAmount: 0
    });

    const fetchOrganizations = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const [orgRes, planRes] = await Promise.all([
                axios.get('http://localhost:5000/api/superadmin/organizations', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/superadmin/plans', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setOrganizations(orgRes.data.data);
            setPlans(planRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    useEffect(() => {
        if (newOrg.planId) {
            const selectedPlan = plans.find(p => p._id === newOrg.planId);
            if (selectedPlan) {
                setNewOrg(prev => ({
                    ...prev,
                    registrationAmount: selectedPlan.price
                }));
            }
        }
    }, [newOrg.planId, plans]);

    useEffect(() => {
        if (newOrg.startDate && newOrg.planType) {
            const start = new Date(newOrg.startDate);
            const expire = new Date(start);
            
            if (newOrg.planType === 'Yearly') {
                expire.setFullYear(start.getFullYear() + 1);
            } else {
                expire.setMonth(start.getMonth() + 1);
            }
            
            setNewOrg(prev => ({
                ...prev,
                expireDate: expire.toISOString().split('T')[0]
            }));
        }
    }, [newOrg.startDate, newOrg.planType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isEditing && newOrg.adminPassword !== newOrg.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        try {
            const token = sessionStorage.getItem('token');
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/superadmin/organizations/${editId}`, newOrg, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Organization updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/superadmin/organizations', newOrg, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Organization created successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchOrganizations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save organization');
        }
    };

    const handleEdit = (org) => {
        setIsEditing(true);
        setEditId(org._id);
        setNewOrg({
            organizationName: org.name,
            adminName: org.adminUserId?.name || '',
            adminEmail: org.adminUserId?.email || '',
            adminPassword: '', // Don't populate password for security
            confirmPassword: '',
            planId: org.planId?._id || '',
            phoneNumber: org.phoneNumber || '',
            address: org.address || '',
            startDate: org.startDate ? new Date(org.startDate).toISOString().split('T')[0] : '',
            expireDate: org.expireDate ? new Date(org.expireDate).toISOString().split('T')[0] : '',
            planType: org.planType || 'Monthly',
            paymentStatus: org.paymentStatus || 'Pending'
        });
        setShowModal(true);
    };

    const handleDeleteClick = (org) => {
        setSelectedOrg(org);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/superadmin/organizations/${selectedOrg._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Organization terminated successfully');
            setShowDeleteModal(false);
            fetchOrganizations();
        } catch (error) {
            toast.error('Failed to delete organization');
        }
    };

    const handleStatusUpdate = async (id, newStatus, paymentStatus = null) => {
        try {
            const token = sessionStorage.getItem('token');
            const data = { status: newStatus };
            if (paymentStatus) {
                data.paymentStatus = paymentStatus;
            }
            await axios.patch(`http://localhost:5000/api/superadmin/organizations/${id}/status`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Organization status updated to ${newStatus}`);
            setShowSuspendModal(false);
            setShowApproveModal(false);
            fetchOrganizations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const confirmApproval = async () => {
        await handleStatusUpdate(selectedOrg._id, 'Active', approvalPaymentStatus);
    };

    const handleSuspendToggle = () => {
        const nextStatus = selectedOrg.status === 'Active' ? 'Suspended' : 'Active';
        handleStatusUpdate(selectedOrg._id, nextStatus);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setNewOrg({
            organizationName: '',
            adminName: '',
            adminEmail: '',
            adminPassword: '',
            confirmPassword: '',
            planId: '',
            phoneNumber: '',
            address: '',
            startDate: new Date().toISOString().split('T')[0],
            expireDate: '',
            planType: 'Monthly',
            paymentStatus: 'Pending'
        });
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Management</h1>
                    <p className="text-gray-500">Total {organizations.length} active organizations on the platform.</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    Create Organization
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-100/50">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by organization or admin email..." 
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-bold placeholder:text-gray-400 placeholder:font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">From</span>
                            <input 
                                type="date" 
                                className="bg-transparent border-none text-[11px] font-black text-gray-700 focus:ring-0 p-0"
                                value={startDateFilter}
                                onChange={(e) => setStartDateFilter(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-100 rounded-2xl px-4 py-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">To</span>
                            <input 
                                type="date" 
                                className="bg-transparent border-none text-[11px] font-black text-gray-700 focus:ring-0 p-0"
                                value={endDateFilter}
                                onChange={(e) => setEndDateFilter(e.target.value)}
                            />
                        </div>
                        {(searchTerm || startDateFilter || endDateFilter) && (
                            <button 
                                onClick={() => { setSearchTerm(''); setStartDateFilter(''); setEndDateFilter(''); }}
                                className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-all"
                                title="Clear All Filters"
                            >
                                <Plus size={20} className="rotate-45" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Tabs - Redesigned Segmented Control */}
                <div className="px-10 py-8 bg-white border-b border-gray-100/30">
                    <div className="inline-flex p-2 bg-gray-50 rounded-[2rem] border border-gray-100 relative group/tabs">
                        {['All', 'Pending', 'Active', 'Suspended', 'Rejected'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`relative z-10 px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-[1.25rem] flex items-center gap-3 overflow-hidden italic ${
                                    statusFilter === tab 
                                    ? 'text-gray-900' 
                                    : 'text-gray-400 hover:text-gray-900 group-hover/tabs:opacity-70 hover:!opacity-100'
                                }`}
                            >
                                {statusFilter === tab && (
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                )}
                                {tab}
                                {statusFilter === tab && (
                                    <div className="absolute inset-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.25rem] z-[-1] animate-in fade-in zoom-in-95 duration-500 border border-gray-100" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider min-w-[220px]">Organization</th>
                                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider min-w-[200px]">Contact Intelligence</th>
                                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider min-w-[180px]">Subscription Matrix</th>
                                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Usage</th>
                                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Validity</th>
                                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider text-center">Payment</th>
                                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider text-center">Status</th>
                                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-[10px] tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {organizations
                                .filter(org => {
                                    // Status Filter
                                    const matchesStatus = statusFilter === 'All' || org.status === statusFilter;
                                    
                                    // Search Filter
                                    const searchLower = searchTerm.toLowerCase();
                                    const matchesSearch = !searchTerm || 
                                        org.name.toLowerCase().includes(searchLower) || 
                                        org.adminUserId?.email.toLowerCase().includes(searchLower);
                                    
                                    // Date Range Filter
                                    const orgDate = new Date(org.startDate).getTime();
                                    const start = startDateFilter ? new Date(startDateFilter).getTime() : -Infinity;
                                    const end = endDateFilter ? new Date(endDateFilter).getTime() : Infinity;
                                    const matchesDate = orgDate >= start && orgDate <= end;

                                    return matchesStatus && matchesSearch && matchesDate;
                                })
                                .map((org) => (
                                <tr key={org._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-bold truncate max-w-[150px]">{org.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{org._id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 border-b border-gray-50/50">
                                        <div className="space-y-1.5">
                                            <p className="text-gray-900 font-black text-xs uppercase italic tracking-tight">{org.adminUserId?.name || 'Authorized Personnel'}</p>
                                            <div className="space-y-1">
                                                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2 group/email">
                                                    <Mail size={12} className="text-primary opacity-60 group-hover/email:opacity-100 transition-opacity" />
                                                    <span className="truncate max-w-[160px] underline decoration-primary/20">{org.adminUserId?.email}</span>
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-black flex items-center gap-2 uppercase tracking-tighter">
                                                    <Phone size={11} className="text-primary opacity-60" />
                                                    {org.phoneNumber || 'Secure Line N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 border-b border-gray-50/50">
                                        <div className="space-y-2">
                                            <div className="inline-flex">
                                                <span className="px-4 py-1.5 bg-gray-900 text-primary rounded-xl text-[10px] font-black border border-gray-800 uppercase italic tracking-[0.15em] whitespace-nowrap shadow-lg shadow-gray-200">
                                                    {org.planId?.planName || 'NO ACTIVE PLAN'}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest ml-1 opacity-60 group-hover:opacity-100 transition-opacity italic">
                                                {org.planType || 'Monthly'} Cycle
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <div className="space-y-0.5">
                                                <p className="text-gray-900 font-black text-xs uppercase italic">{org.staffCount || 0}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Staff</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-primary font-black text-xs uppercase italic">{org.studentCount || 0}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Students</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-xs text-emerald-600 font-bold">{new Date(org.startDate).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter italic">EXP: {org.expireDate ? new Date(org.expireDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                            org.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            org.paymentStatus === 'Partly' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                            'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {org.paymentStatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                            org.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            org.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' :
                                            org.status === 'Suspended' ? 'bg-red-50 text-red-600 border-red-100' :
                                            'bg-gray-50 text-gray-500 border-gray-100' // Rejected
                                        }`}>
                                            {org.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 transition-opacity">
                                            {org.status === 'Pending' ? (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedOrg(org);
                                                            setApprovalPaymentStatus('Pending');
                                                            setShowApproveModal(true);
                                                        }}
                                                        className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(org._id, 'Rejected')}
                                                        className="px-3 py-2 bg-white hover:bg-red-50 text-red-500 border border-red-100 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => { setSelectedOrg(org); setViewModal(true); }}
                                                        className="p-2.5 bg-gray-50 hover:bg-primary hover:text-white rounded-xl text-primary transition-all shadow-sm border border-gray-100"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(org)}
                                                        className="p-2.5 bg-gray-50 hover:bg-primary/10 rounded-xl text-primary transition-all shadow-sm border border-gray-100"
                                                        title="Edit Organization"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedOrg(org); setShowSuspendModal(true); }}
                                                        className={`p-2.5 bg-gray-50 rounded-xl transition-all shadow-sm border border-gray-100 ${org.status === 'Active' ? 'text-orange-500 hover:bg-orange-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                                        title={org.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
                                                    >
                                                        <ShieldAlert size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteClick(org)}
                                                className="p-2.5 bg-gray-50 hover:bg-red-50 rounded-xl text-red-500 transition-all shadow-sm border border-gray-100 ml-auto"
                                                title="Delete Organization"
                                            >
                                                <Plus size={16} className="rotate-45" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Organizations Modal */}
            {/* ... existing modal code ... */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl rounded-2xl border border-gray-100 p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 my-8">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <h2 className="text-2xl font-black text-gray-900 uppercase italic">{isEditing ? 'Optimize' : 'Add New'} <span className="text-primary not-italic">Organization</span></h2>
                            <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-600 mb-1.5">Organization Name</label>
                                <input 
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                    value={newOrg.organizationName}
                                    onChange={(e) => setNewOrg({...newOrg, organizationName: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    required
                                    type="email"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                    placeholder="Enter Email"
                                    value={newOrg.adminEmail}
                                    onChange={(e) => setNewOrg({...newOrg, adminEmail: e.target.value})}
                                    disabled={isEditing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1.5">Phone Number</label>
                                <input 
                                    type="tel"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                    placeholder="Enter Phone Number"
                                    value={newOrg.phoneNumber}
                                    onChange={(e) => setNewOrg({...newOrg, phoneNumber: e.target.value})}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-600 mb-1.5">Address</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                    placeholder="Enter Address"
                                    value={newOrg.address}
                                    onChange={(e) => setNewOrg({...newOrg, address: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    required
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                    value={newOrg.startDate}
                                    onChange={(e) => setNewOrg({...newOrg, startDate: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                    Expire Date <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    required
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                    value={newOrg.expireDate}
                                    onChange={(e) => setNewOrg({...newOrg, expireDate: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                    Plan Type <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary cursor-pointer font-medium"
                                    value={newOrg.planType}
                                    onChange={(e) => setNewOrg({...newOrg, planType: e.target.value})}
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                    Plan <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary cursor-pointer font-medium"
                                    value={newOrg.planId}
                                    onChange={(e) => setNewOrg({...newOrg, planId: e.target.value})}
                                >
                                    <option value="">Select Plan</option>
                                    {plans.map(plan => (
                                        <option key={plan._id} value={plan._id}>{plan.planName} (${plan.price})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                    Payment Status <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary cursor-pointer font-medium"
                                    value={newOrg.paymentStatus}
                                    onChange={(e) => setNewOrg({...newOrg, paymentStatus: e.target.value})}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Partly">Partly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1.5">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    readOnly
                                    type="text"
                                    className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-bold cursor-not-allowed shadow-sm"
                                    value={`$${newOrg.registrationAmount || 0}`}
                                />
                            </div>

                            {!isEditing && (
                                <>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                            Admin User Name <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                            placeholder="Full Name of Admin"
                                            value={newOrg.adminName}
                                            onChange={(e) => setNewOrg({...newOrg, adminName: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            required
                                            type="password"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                            placeholder="Enter password"
                                            value={newOrg.adminPassword}
                                            onChange={(e) => setNewOrg({...newOrg, adminPassword: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            required
                                            type="password"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary font-medium"
                                            placeholder="Confirm password"
                                            value={newOrg.confirmPassword}
                                            onChange={(e) => setNewOrg({...newOrg, confirmPassword: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button" 
                                onClick={() => setShowModal(false)} 
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-xl font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                                {isEditing ? 'Update Organization' : 'Save Organization'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* View Organization Details Modal - Compact & Refined */}
            {viewModal && selectedOrg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-xl rounded-[2rem] border border-gray-100 p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -mr-24 -mt-24" />
                        
                        <div className="flex justify-between items-center relative z-10 border-b border-gray-50 pb-4">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 uppercase italic">Organization <span className="text-primary not-italic">Profile</span></h2>
                                <p className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-0.5 italic">Operational Intelligence</p>
                            </div>
                            <button onClick={() => setViewModal(false)} className="bg-gray-50 hover:bg-gray-100 p-2.5 rounded-xl transition-all shadow-sm">
                                <Plus size={20} className="rotate-45 text-gray-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                            {/* Entity Info */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Entity Name</label>
                                    <div className="p-3.5 bg-gray-50/50 border border-gray-50 rounded-xl font-black text-gray-900 italic uppercase tracking-wider text-sm">
                                        {selectedOrg.name || 'Not Specified'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Physical Address</label>
                                    <div className="p-3.5 bg-gray-50/50 border border-gray-50 rounded-xl font-bold text-gray-700 text-xs leading-relaxed">
                                        {selectedOrg.address || 'Address not specified'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Contact Line</label>
                                    <div className="p-3.5 bg-gray-50/50 border border-gray-50 rounded-xl font-black text-primary italic text-xs">
                                        {selectedOrg.phoneNumber || 'Secure Line N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Personnel & Subscription */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Administrative Lead</label>
                                    <div className="p-3.5 bg-gray-50/50 border border-gray-50 rounded-xl">
                                        <p className="font-black text-gray-900 uppercase italic text-xs">{selectedOrg.adminUserId?.name || 'Admin Not Set'}</p>
                                        <p className="text-[10px] text-primary font-bold mt-0.5 tracking-tighter truncate">{selectedOrg.adminUserId?.email || 'No Email Registered'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Resource Load</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-gray-50/50 border border-gray-50 rounded-xl group hover:bg-white transition-colors">
                                            <p className="font-black text-gray-900 text-base italic">{selectedOrg.staffCount || 0}</p>
                                            <p className="text-[8px] text-gray-400 font-bold uppercase">Staff</p>
                                        </div>
                                        <div className="p-3 bg-gray-50/50 border border-gray-50 rounded-xl group hover:bg-white transition-colors">
                                            <p className="font-black text-primary text-base italic">{selectedOrg.studentCount || 0}</p>
                                            <p className="text-[8px] text-gray-400 font-bold uppercase">Students</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Subscription Matrix</label>
                                    <div className="p-3.5 bg-gray-50/50 border border-gray-50 rounded-xl relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-black text-gray-900 uppercase italic text-xs truncate max-w-[120px]">{selectedOrg.planId?.planName || 'Plan N/A'}</p>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase italic ${
                                                selectedOrg.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                            }`}>{selectedOrg.status || 'Offline'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">{selectedOrg.planType || 'Standard'} Cycle</p>
                                            <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                                            <p className={`text-[9px] font-black uppercase italic ${
                                                selectedOrg.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-orange-500'
                                            }`}>{selectedOrg.paymentStatus || 'Pending'}</p>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100/60 flex items-center justify-between">
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">Setup: <span className="text-gray-900 font-black">${selectedOrg.registrationAmount || 0}</span></p>
                                            <div className="flex items-center gap-1">
                                                <Zap size={10} className="text-primary" />
                                                <span className="text-[9px] text-primary font-black uppercase italic">{selectedOrg.paymentMethod || 'System'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1 relative z-10">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Activation</label>
                                <div className="p-2.5 bg-gray-50/50 border border-gray-50 rounded-xl text-xs font-black text-gray-600 text-center">
                                    {selectedOrg.startDate ? new Date(selectedOrg.startDate).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Termination</label>
                                <div className="p-2.5 bg-red-50/30 border border-red-50/50 rounded-xl text-xs font-black text-red-500 text-center">
                                    {selectedOrg.expireDate ? new Date(selectedOrg.expireDate).toLocaleDateString() : 'Never'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 relative z-10">
                            <button onClick={() => setViewModal(false)} className="w-full bg-primary text-white py-3.5 rounded-xl font-black uppercase italic tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                                Close Interface
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Suspend Access Modal */}
            {showSuspendModal && selectedOrg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">{selectedOrg.status === 'Active' ? 'Suspend' : 'Restore'} Company</h3>
                            <button onClick={() => setShowSuspendModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        
                        <div className="p-10 text-center space-y-6">
                            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                                <ShieldAlert size={48} className="text-orange-500" />
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {selectedOrg.status === 'Active' ? 'Suspend Access?' : 'Restore Access?'}
                                </h4>
                                <p className="text-gray-500 text-sm leading-relaxed px-4">
                                    {selectedOrg.status === 'Active' 
                                        ? `Are you sure you want to suspend this company? This will prevent all users from accessing the platform.`
                                        : `Are you sure you want to restore access for this company? All users will regain platform access.`
                                    }
                                </p>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setShowSuspendModal(false)}
                                    className="flex-1 px-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSuspendToggle}
                                    className={`flex-1 px-8 py-4 ${selectedOrg.status === 'Active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-200`}
                                >
                                    {selectedOrg.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedOrg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-red-50/30">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Terminate Business</h3>
                            <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        
                        <div className="p-10 text-center space-y-6">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                                <Plus size={48} className="text-red-500 rotate-45" />
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-gray-900 tracking-tight">Are you sure?</h4>
                                <p className="text-gray-500 text-sm leading-relaxed px-4">
                                    You are about to permanently delete <span className="font-bold text-gray-900">{selectedOrg.name}</span>. This action will also remove the associated admin account and cannot be undone.
                                </p>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-red-200"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Approval Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase italic">Approve Registration</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Protocol Activation Sequence</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    You are about to approve <span className="font-black text-gray-900">{selectedOrg?.name}</span>. Please verify the initial payment status before activation.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Define Payment Status</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-primary transition-all font-bold italic"
                                    value={approvalPaymentStatus}
                                    onChange={(e) => setApprovalPaymentStatus(e.target.value)}
                                >
                                    <option value="Paid">Mark as Fully Paid</option>
                                    <option value="Partly">Mark as Partly Paid</option>
                                    <option value="Pending">Keep as Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowApproveModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmApproval}
                                className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-100"
                            >
                                Approve & Set Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
