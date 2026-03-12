import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    Building2, 
    User, 
    Mail, 
    Phone, 
    Lock, 
    Check, 
    ArrowLeft,
    ShieldCheck,
    Zap,
    Crown
} from 'lucide-react';
import logoImg from '../assets/login/logo.png';
import illustrationGold from '../assets/login/login_illustration_gold.png';

const RegisterAdmin = () => {
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('planId');
    const navigate = useNavigate();
    
    const [plan, setPlan] = useState(null);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        organizationName: '',
        adminName: '',
        adminEmail: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchPlan = async () => {
            if (!planId) {
                setLoadingPlan(false);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:5000/api/plans`);
                const selectedPlan = res.data.data.find(p => p._id === planId);
                setPlan(selectedPlan);
            } catch (error) {
                console.error('Failed to fetch plan:', error);
            } finally {
                setLoadingPlan(false);
            }
        };
        fetchPlan();
    }, [planId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        
        setIsLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register-admin', {
                organizationName: formData.organizationName,
                adminName: formData.adminName,
                adminEmail: formData.adminEmail,
                adminPassword: formData.password,
                phoneNumber: formData.phoneNumber,
                planId: planId
            });
            
            setShowSuccessModal(true);
            setTimeout(() => {
                navigate('/');
            }, 5000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const getPlanIcon = (name) => {
        const n = name?.toLowerCase() || '';
        if (n.includes('enterprise') || n.includes('platinum')) return <Crown className="text-[#D4AF37]" size={40} />;
        if (n.includes('pro') || n.includes('gold')) return <Zap className="text-[#D4AF37]" size={40} />;
        return <ShieldCheck className="text-[#D4AF37]" size={40} />;
    };

    return (
        <div className="min-h-screen w-full flex font-sans overflow-hidden bg-white">
            {/* Left Side - Plan Summary Pane (Swapped to Left) */}
            <div className="hidden md:flex md:w-[45%] bg-[#0c0c0c] p-12 items-center justify-center relative h-screen overflow-hidden border-r border-white/5">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -ml-64 -mt-64"></div>
                
                <div className="relative z-10 w-full max-w-lg">
                    {loadingPlan ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] italic">Syncing Protocol Data...</p>
                        </div>
                    ) : plan ? (
                        <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
                             <div className="flex flex-col gap-8">
                                <div className="p-8 bg-white/[0.02] rounded-[3rem] border border-white/10 backdrop-blur-3xl relative group shadow-2xl">
                                    <div className="absolute -top-6 -right-6 p-6 bg-[#D4AF37] text-black rounded-[2.5rem] shadow-2xl shadow-[#D4AF37]/30 flex flex-col items-center justify-center font-black rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        <span className="text-[10px] uppercase tracking-widest opacity-70">Investment</span>
                                        <span className="text-5xl italic leading-none my-1 tracking-tighter">${plan.price}</span>
                                        <span className="text-[10px] uppercase opacity-70">/{plan.billingPeriod === 'Yearly' ? 'year' : 'month'}</span>
                                    </div>

                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-[1.8rem] border border-[#D4AF37]/20 flex items-center justify-center shadow-inner">
                                            {getPlanIcon(plan.planName)}
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none">{plan.planName}</h2>
                                            <p className="text-[#666] font-black text-[10px] uppercase tracking-[0.4em]">Hardware Specification</p>
                                        </div>
                                    </div>

                                    <div className="space-y-7">
                                        <div className="flex items-center gap-5 text-white">
                                            <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/5">
                                                <Check size={20} className="text-[#D4AF37]" strokeWidth={4} />
                                            </div>
                                            <div>
                                                <p className="font-black uppercase italic tracking-wider text-sm">{plan.maxStudents?.toLocaleString()} Students</p>
                                                <p className="text-[9px] text-[#555] font-black uppercase tracking-[0.2em] mt-0.5">Maximum Capacity</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5 text-white">
                                            <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/5">
                                                <Check size={20} className="text-[#D4AF37]" strokeWidth={4} />
                                            </div>
                                            <div>
                                                <p className="font-black uppercase italic tracking-wider text-sm">{plan.maxStaff} Staff Members</p>
                                                <p className="text-[9px] text-[#555] font-black uppercase tracking-[0.2em] mt-0.5">Administrative Access</p>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5 w-full my-2"></div>

                                        {plan.features?.slice(0, 4).map((feature, i) => (
                                            <div key={i} className="flex items-center gap-5 text-gray-400 group/item">
                                                <div className="w-11 h-11 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover/item:border-[#D4AF37]/30 transition-colors">
                                                    <Check size={16} className="text-gray-600 group-hover/item:text-[#D4AF37] transition-colors" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.15em]">{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center p-8">
                                    <p className="text-gray-500 text-xs font-bold leading-relaxed italic tracking-wide opacity-60">
                                        "Experience the precision of an architecture built for high-performance educational environments."
                                    </p>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-6">
                             <Crown size={80} className="text-white/5 mx-auto" strokeWidth={1} />
                             <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-[10px] italic">Select a Protocol Tier to Continue</p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-12 left-12 opacity-10">
                     <img src={logoImg} alt="Logo" className="w-12 h-12 grayscale invert" />
                </div>
            </div>

            {/* Right Side - Form Pane (Swapped to Right) */}
            <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-24 flex flex-col justify-between relative h-screen overflow-y-auto bg-white">
                
                {/* Brand Logo & Back */}
                <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-2xl shadow-black/10 overflow-hidden ring-1 ring-black/5 group-hover:rotate-12 transition-transform duration-500">
                            <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">School <span className="text-[#D4AF37] not-italic">CRM</span></span>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] mt-1">Control Console</span>
                        </div>
                    </div>
                    <Link to="/" className="text-gray-400 hover:text-gray-900 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-[-4px]">
                        <ArrowLeft size={14} strokeWidth={3} />
                        Abort Registration
                    </Link>
                </div>

                {/* Main Form Area */}
                <div className="w-full max-w-[540px] mx-auto flex flex-col justify-center my-auto">
                    <div className="mb-14 relative">
                        <div className="absolute -left-6 top-1 w-1.5 h-12 bg-[#D4AF37] rounded-full"></div>
                        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic leading-[0.9]">
                            Account <span className="text-[#D4AF37] not-italic">Genesis</span>
                        </h1>
                        <p className="text-gray-400 font-bold tracking-tight text-sm uppercase tracking-[0.1em]">Initialize your professional school management environment.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Organization Name</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-all duration-300" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Building Name / School"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                                        value={formData.organizationName}
                                        onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Principal / Owner Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-all duration-300" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Legal Full Name"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                                        value={formData.adminName}
                                        onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Official Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-all duration-300" size={18} />
                                    <input
                                        required
                                        type="email"
                                        placeholder="admin@protocol.com"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                                        value={formData.adminEmail}
                                        onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Contact Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-all duration-300" size={18} />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+X (XXX) XXX-XXXX"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Set Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-all duration-300" size={18} />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-2">Confirm Account</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-all duration-300" size={18} />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-6 ${isLoading ? 'bg-gray-900/50 cursor-not-allowed' : 'bg-gray-900 hover:bg-black active:scale-[0.98] cursor-pointer'} text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-gray-200 uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 group/btn`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Initialize Organization
                                        <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pt-8">
                            Existing Protocol Access? <Link to="/login" className="text-[#D4AF37] hover:underline decoration-2 underline-offset-4">Sign in here</Link>
                        </p>
                    </form>
                </div>

                <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.6em] mt-16 text-center md:text-left">
                    © Precision Systems 2026 // Authored by Advanced Agentic Coding
                </div>
            </div>

            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl relative overflow-hidden text-center animate-in zoom-in-95 duration-500">
                        {/* Modal Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-[2rem] flex items-center justify-center mb-8 border border-[#D4AF37]/20 shadow-inner">
                                <ShieldCheck size={48} className="text-[#D4AF37]" strokeWidth={2.5} />
                            </div>
                            
                            <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter mb-4 leading-none">
                                Request <span className="text-[#D4AF37] not-italic">Transmitted</span>
                            </h2>
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Onboarding Sequence Initiated</p>
                            
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 mb-8 border-l-4 border-l-[#D4AF37]">
                                <p className="text-gray-600 font-bold text-sm leading-relaxed tracking-tight">
                                    Your organization's genesis request has been securely transmitted. A Super Administrator will review your credentials for approval.
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                                <p className="text-gray-300 font-black uppercase tracking-[0.5em] text-[8px]">
                                    Redirecting to secure terminal...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterAdmin;
