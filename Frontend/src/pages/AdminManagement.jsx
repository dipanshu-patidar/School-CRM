import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit2, ShieldAlert, Eye, Users, GraduationCap } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminManagement = () => {
    const [organizations, setOrganizations] = useState([]);
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All'); // New: Status Filter State
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
        planType: 'Monthly'
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

    // New: Automate Expire Date calculation
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
            planType: org.planType || 'Monthly'
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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/superadmin/organizations/${id}/status`, { 
                status: newStatus 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Organization status updated to ${newStatus}`);
            setShowSuspendModal(false);
            fetchOrganizations();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
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
            planType: 'Monthly'
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
                <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Filter by organization name or admin email..." 
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-gray-800 focus:outline-none focus:border-primary transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex border-b border-gray-50 px-6 bg-gray-50/30">
                    {['All', 'Pending', 'Active', 'Suspended', 'Rejected'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                                statusFilter === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab}
                            {statusFilter === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Organization</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Contact Details</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Subscription</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Usage</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Validity</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Status</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase text-[10px] tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {organizations
                                .filter(org => {
                                    if (statusFilter === 'All') return true;
                                    return org.status === statusFilter;
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
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-gray-800 font-bold text-sm italic">{org.adminUserId?.name}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                {org.adminUserId?.email}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-medium">{org.phoneNumber || 'No Phone'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-black border border-primary/10 uppercase italic tracking-widest">
                                                {org.planId?.planName}
                                            </span>
                                            <p className="text-gray-400 text-[10px] font-bold uppercase ml-1 opacity-70">
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
                                                        onClick={() => handleStatusUpdate(org._id, 'Active')}
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

            {/* View Organization Details Modal */}
            {viewModal && selectedOrg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] border border-gray-100 p-8 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                        
                        <div className="flex justify-between items-center relative z-10 border-b border-gray-50 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase italic">Company <span className="text-primary not-italic">Profile</span></h2>
                                <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-1 italic">Data Integrity & Verification</p>
                            </div>
                            <button onClick={() => setViewModal(false)} className="bg-gray-50 hover:bg-gray-100 p-3 rounded-2xl transition-all shadow-sm">
                                <Plus size={24} className="rotate-45 text-gray-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            {/* Company Info */}
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Company Name</label>
                                    <div className="p-4 bg-gray-50/50 border border-gray-50 rounded-2xl font-black text-gray-900 italic uppercase tracking-wider">
                                        {selectedOrg.name || 'Not Specified'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Physical Address</label>
                                    <div className="p-4 bg-gray-50/50 border border-gray-50 rounded-2xl font-bold text-gray-700 text-sm">
                                        {selectedOrg.address || 'Address not specified'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Phone Number</label>
                                    <div className="p-4 bg-gray-50/50 border border-gray-50 rounded-2xl font-black text-primary italic text-sm">
                                        {selectedOrg.phoneNumber || 'Not Provided'}
                                    </div>
                                </div>
                            </div>

                            {/* Admin & Subscription */}
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Administrative Lead</label>
                                    <div className="p-4 bg-gray-50/50 border border-gray-50 rounded-2xl">
                                        <p className="font-black text-gray-900 uppercase italic">{selectedOrg.adminUserId?.name || 'Admin Not Set'}</p>
                                        <p className="text-xs text-primary font-bold mt-1 tracking-tighter">{selectedOrg.adminUserId?.email || 'No Email Available'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Resource Utilization</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gray-50/50 border border-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white transition-colors">
                                            <div>
                                                <p className="font-black text-gray-900 text-lg italic">{selectedOrg.staffCount || 0}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Staff Members</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <Users size={20} />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50/50 border border-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white transition-colors">
                                            <div>
                                                <p className="font-black text-primary text-lg italic">{selectedOrg.studentCount || 0}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Enrolled Students</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <GraduationCap size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Subscription Status</label>
                                    <div className="p-4 bg-gray-50/50 border border-gray-50 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <p className="font-black text-gray-900 uppercase italic">{selectedOrg.planId?.planName || 'Plan N/A'}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{selectedOrg.planType || 'Monthly'} Billing</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase italic ${
                                            selectedOrg.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>{selectedOrg.status || 'Unknown'}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Genesis</label>
                                        <div className="p-3 bg-gray-50/50 border border-gray-50 rounded-xl text-xs font-black text-gray-600">
                                            {selectedOrg.startDate ? new Date(selectedOrg.startDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">Expiration</label>
                                        <div className="p-3 bg-red-50/30 border border-red-50/50 rounded-xl text-xs font-black text-red-500">
                                            {selectedOrg.expireDate ? new Date(selectedOrg.expireDate).toLocaleDateString() : 'Infinite'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 relative z-10 flex gap-4">
                            <button onClick={() => setViewModal(false)} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase italic tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                                Close Terminal
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
        </div>
    );
};

export default AdminManagement;
