import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Check, Trash2, Edit2, Zap, Shield, Crown, LayoutGrid, List, Grid } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PlanManagement = () => {
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('grid');
    const [featureInput, setFeatureInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [newPlan, setNewPlan] = useState({
        planName: '',
        price: '',
        maxStudents: '1000',
        maxStaff: '10',
        billingPeriod: 'Monthly',
        isPopular: false,
        features: []
    });

    const fetchPlans = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/superadmin/plans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlans(res.data.data);
        } catch (error) {
            toast.error('Failed to sync protocol tiers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/superadmin/plans/${editId}`, newPlan, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Protocol Tier Optimized');
            } else {
                await axios.post('http://localhost:5000/api/superadmin/plans', newPlan, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Protocol Tier Initialized');
            }
            setShowModal(false);
            resetForm();
            fetchPlans();
        } catch (error) {
            toast.error(isEditing ? 'Optimization failed' : 'Initialization failed');
        }
    };

    const handleEdit = (plan) => {
        setIsEditing(true);
        setEditId(plan._id);
        setNewPlan({
            planName: plan.planName,
            price: plan.price,
            maxStudents: plan.maxStudents || '1000',
            maxStaff: plan.maxStaff || '10',
            billingPeriod: plan.billingPeriod || 'Monthly',
            isPopular: plan.isPopular || false,
            features: plan.features || []
        });
        setShowModal(true);
    };

    const handleDeleteClick = (plan) => {
        setSelectedPlan(plan);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/superadmin/plans/${selectedPlan._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Protocol Tier Terminated');
            setShowDeleteModal(false);
            fetchPlans();
        } catch (error) {
            toast.error('Termination failed');
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setNewPlan({ 
            planName: '', 
            price: '', 
            maxStudents: '1000', 
            maxStaff: '10', 
            billingPeriod: 'Monthly', 
            isPopular: false, 
            features: [] 
        });
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setNewPlan({
                ...newPlan,
                features: [...newPlan.features, featureInput.trim()]
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setNewPlan({
            ...newPlan,
            features: newPlan.features.filter((_, i) => i !== index)
        });
    };

    const getTierIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('enterprise') || n.includes('platinum')) return <Crown className="text-primary" size={32} />;
        if (n.includes('pro') || n.includes('gold')) return <Zap className="text-primary" size={32} />;
        return <Shield className="text-primary" size={32} />;
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-full blur-[2px]" />
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-3">
                        Protocol <span className="text-primary not-italic">Tiers</span>
                    </h1>
                    <p className="text-gray-400 font-bold tracking-widest text-xs mt-2 ml-1">SUBSCRIPTION ARCHITECTURE & PRICING</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-1 rounded-2xl flex border border-gray-200 shadow-inner">
                        <button 
                            onClick={() => setViewType('grid')}
                            className={`p-3 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button 
                            onClick={() => setViewType('list')}
                            className={`p-3 rounded-xl transition-all ${viewType === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                    <button 
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-2xl shadow-primary/20 uppercase tracking-widest text-xs"
                    >
                        <Plus size={20} strokeWidth={3} />
                        Architect New Tier
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : viewType === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {plans.map((plan) => (
                        <div key={plan._id} className={`bg-white rounded-[3rem] border p-10 flex flex-col relative overflow-hidden group shadow-xl transition-all hover:scale-[1.02] duration-500 ${plan.isPopular ? 'border-primary ring-1 ring-primary/20' : 'border-gray-100 shadow-gray-100/50'}`}>
                            {plan.isPopular && (
                                <div className="absolute top-8 -right-12 bg-primary text-white px-12 py-1.5 rotate-45 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg z-20">
                                    Popular Choice
                                </div>
                            )}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -ml-16 -mt-16 group-hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100" />
                            
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                    {getTierIcon(plan.planName)}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(plan)}
                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-xl transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(plan)}
                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-1 group-hover:text-primary transition-colors">{plan.planName}</h3>
                                <div className="flex items-baseline gap-2 mb-8 text-gray-900">
                                    <span className="text-5xl font-black text-primary">${plan.price}</span>
                                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">/ {plan.billingPeriod || 'Cycle'}</span>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-3 text-gray-800 font-bold text-sm">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Check size={14} className="text-primary" strokeWidth={3} />
                                        </div>
                                        <span>{plan.maxStudents?.toLocaleString() || '1000'} Maximum Students</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-800 font-bold text-sm">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                                            <Check size={14} className="text-emerald-500" strokeWidth={3} />
                                        </div>
                                        <span>{plan.maxStaff || '10'} Maximum Staff</span>
                                    </div>
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                                            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <Check size={14} className="text-gray-400" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-100/50">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 uppercase italic">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 tracking-widest">Tier Metadata</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 tracking-widest">Pricing</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 tracking-widest">Capacity</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {plans.map((plan) => (
                                <tr key={plan._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-primary">
                                                {getTierIcon(plan.planName)}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 uppercase italic tracking-tight">{plan.planName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">ID: {plan._id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="font-black text-gray-900 tracking-tighter text-xl">${plan.price}</p>
                                            <p className="text-[10px] text-primary font-black uppercase tracking-widest">{plan.billingPeriod || 'Monthly'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-gray-800">{plan.maxStudents?.toLocaleString()} Students</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase">{plan.maxStaff} Staff Limit</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {plan.isPopular ? (
                                            <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">Best Seller</span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-400 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(plan)}
                                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/30 rounded-xl shadow-sm transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(plan)}
                                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-xl shadow-sm transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Redesigned Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl rounded-[3rem] border border-gray-100 p-10 space-y-8 shadow-2xl relative animate-in zoom-in-95 duration-500 my-8">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                            <h2 className="text-2xl font-black text-gray-900">{isEditing ? 'Optimize' : 'Create New'} <span className="text-primary italic">Plan</span></h2>
                            <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Plan Name</label>
                                <input 
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-primary font-bold transition-all placeholder:text-gray-300"
                                    placeholder="e.g., Enterprise"
                                    value={newPlan.planName}
                                    onChange={(e) => setNewPlan({...newPlan, planName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price ($)</label>
                                <input 
                                    required
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-primary font-bold transition-all placeholder:text-gray-300 appearance-none"
                                    placeholder="99"
                                    value={newPlan.price}
                                    onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Billing Period</label>
                                <select 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-primary font-bold cursor-pointer"
                                    value={newPlan.billingPeriod}
                                    onChange={(e) => setNewPlan({...newPlan, billingPeriod: e.target.value})}
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>
                            <div className="flex items-center h-full pt-6">
                                <label className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3 cursor-pointer group hover:bg-white hover:border-primary/30 transition-all">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={newPlan.isPopular}
                                        onChange={(e) => setNewPlan({...newPlan, isPopular: e.target.checked})}
                                    />
                                    <span className="text-sm font-bold text-gray-700">Mark as Popular</span>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Staff</label>
                                <input 
                                    required
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-primary font-bold"
                                    placeholder="10"
                                    value={newPlan.maxStaff}
                                    onChange={(e) => setNewPlan({...newPlan, maxStaff: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Students</label>
                                <input 
                                    required
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-primary font-bold"
                                    placeholder="1000"
                                    value={newPlan.maxStudents}
                                    onChange={(e) => setNewPlan({...newPlan, maxStudents: e.target.value})}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Plan Features</label>
                                <div className="flex gap-3">
                                    <input 
                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-primary font-bold placeholder:text-gray-300"
                                        placeholder="Add a feature..."
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addFeature}
                                        className="bg-primary hover:bg-primary-hover text-white px-8 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                                    >
                                        Add
                                    </button>
                                </div>
                                
                                {newPlan.features.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newPlan.features.map((feature, index) => (
                                            <div key={index} className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-2 group hover:border-red-100 hover:bg-red-50 transition-all">
                                                <span className="text-xs font-bold text-gray-700 group-hover:text-red-600 italic uppercase">{feature}</span>
                                                <button type="button" onClick={() => removeFeature(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <Plus size={14} className="rotate-45" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all active:scale-95">
                            {isEditing ? 'Update Plan' : 'Create Plan'}
                        </button>
                    </form>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-red-50/30">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Terminate Protocol</h3>
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
                                    You are about to permanently delete the <span className="font-bold text-gray-900">{selectedPlan.planName}</span> protocol tier. This action cannot be undone.
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

export default PlanManagement;
