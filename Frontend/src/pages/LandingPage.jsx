import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight,
  ChevronRight,
  Check,
  Star,
  Activity,
  BarChart3,
  LayoutDashboard,
  Rocket,
  Zap,
  Layers,
  Crown,
  Sparkles,
  Trophy,
  TrendingUp,
  Clock,
  UserPlus
} from 'lucide-react';
import logoImg from '../assets/login/logo.png';

const LandingPage = () => {
  const role = sessionStorage.getItem('userRole');
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/api/plans');
        if (res.data.success) {
          setPlans(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary-gold selection:text-black overflow-x-hidden">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/3 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* SVG Flowing Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M-100,500 C200,300 500,700 1100,500" stroke="#D4AF37" strokeWidth="0.5" fill="none" className="animate-gradient-x" />
          <path d="M-100,600 C300,400 600,800 1200,600" stroke="#D4AF37" strokeWidth="0.3" fill="none" className="opacity-50" />
          <path d="M-100,400 C100,200 400,600 900,400" stroke="#D4AF37" strokeWidth="0.2" fill="none" className="opacity-30" />
        </svg>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                <img src={logoImg} alt="Shining Light Logo" className="w-[80%] h-[80%] object-contain" />
              </div>
              <div>
                <span className="block font-black text-xl tracking-tighter text-white leading-none uppercase">SHINING LIGHT</span>
                <span className="text-[8px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase opacity-80">Software Excellence</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-all uppercase">Features</a>
              <a href="#solutions" className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-all uppercase">Solutions</a>
              <a href="#pricing" className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-all uppercase">Pricing</a>
              {role ? (
                <Link to="/dashboard" className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg text-[10px] font-black hover:bg-[#C89B2D] transition-all flex items-center gap-2 shadow-[0_5px_15px_rgba(212,175,55,0.2)]">
                  <LayoutDashboard size={14} /> DASHBOARD
                </Link>
              ) : (
                <div className="flex items-center gap-8">
                  <Link to="/login" className="bg-white text-black px-6 py-2 rounded-lg text-[10px] font-black hover:bg-[#D4AF37] transition-all shadow-lg shadow-white/5 uppercase">LOG IN</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black tracking-[0.4em] uppercase mb-8">
                  <Sparkles size={12} className="animate-pulse" />
                  Premium CRM Infrastructure
                </div>
                
                <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 animate-slide-up">
                  Next-Gen <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D675] to-[#D4AF37] animate-gradient-x" style={{ textShadow: '0 0 30px rgba(212,175,55,0.2)' }}>
                    Program <br className="hidden md:block"/> Management
                  </span>
                </h1>
                
                <p className="text-base md:text-lg text-gray-400 mb-10 leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  A sophisticated, automated workspace designed specifically for Transitional Housing and Youth Development Organizations.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black rounded-xl font-black text-sm hover:bg-[#C89B2D] transition-all shadow-[0_15px_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 group">
                    Start Free Demo
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="#features" className="text-white font-black text-sm tracking-[0.1em] hover:text-[#D4AF37] transition-all flex items-center gap-2 group border-b border-transparent hover:border-[#D4AF37]">
                    Learn How It Works <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Glowing Illustration Mockup */}
              <div className="relative animate-float">
                <div className="absolute -inset-10 bg-[#D4AF37]/5 rounded-full blur-[100px] opacity-50 z-0"></div>
                <div className="relative z-10 glass-card bg-white/5 border border-white/10 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden backdrop-blur-3xl min-h-[500px]">
                  <div className="bg-[#0a0a0a] rounded-[2.3rem] p-6 md:p-8 h-full">
                    {/* Mockup Header */}
                  <div className="p-0 bg-gradient-to-b from-[#1a1a1a] to-[#0F0F0F] relative overflow-hidden group">
                    <img 
                      src="/assets/dashboard-preview.png" 
                      alt="Shining Light Dashboard" 
                      className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 animate-fade-in"
                    />
                    {/* Overlay Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60"></div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audience Section */}
        <section id="solutions" className="py-32 bg-[#070707] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none">Built for the Elite.</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">Standardizing excellence across the non-profit sector with high-compliance monitoring.</p>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Transitional Housing", desc: "Manage beds and compliance with military precision.", icon: <ShieldCheck /> },
              { title: "Youth Development", desc: "Tracking progress milestones through data-driven insights.", icon: <Rocket /> },
              { title: "Case Management", desc: "Automating service reports with professional P.I.E formatting.", icon: <FileText /> },
              { title: "Strategic Admin", desc: "birds-eye view for multi-site program monitoring.", icon: <BarChart3 /> },
            ].map((item, i) => (
              <div key={i} className="group p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-700 hover:bg-[#D4AF37]/5">
                <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-8 text-[#D4AF37] group-hover:scale-110 group-hover:rotate-3 transition-all">
                  {React.cloneElement(item.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section id="features" className="py-32">
           <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-1 py-10">
                <span className="text-[#D4AF37] font-black text-[10px] tracking-[0.5em] uppercase mb-6 block">Architecture</span>
                <h2 className="text-5xl font-black leading-[0.9] mb-10 text-white">The Core <br/> Of Your <br className="hidden lg:block"/> Mission.</h2>
                <div className="h-1 w-16 bg-[#D4AF37] rounded-full"></div>
             </div>
             
             <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { title: "Student Ledger", desc: "Full lifecycle tracking from intake to completion.", label: "Ledger V2" },
                 { title: "Workshop Engine", desc: "Curriculum management with point distribution.", label: "Engine V1" },
                 { title: "Compliance Vault", desc: "Secure documentation and housing verification.", label: "Vault 256" },
                 { title: "Neural Analytics", desc: "Predictive student progress monitoring.", label: "AI Beta" },
               ].map((f, i) => (
                 <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all relative overflow-hidden group">
                   <div className="absolute top-6 right-6 text-[8px] font-black tracking-[.3em] text-[#D4AF37] opacity-60 group-hover:opacity-100 uppercase">{f.label}</div>
                   <h3 className="text-xl font-black mb-3 group-hover:text-[#D4AF37] transition-colors">{f.title}</h3>
                   <p className="text-gray-400 font-medium leading-relaxed text-sm">{f.desc}</p>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 bg-[#070707] border-y border-white/5 relative underline-offset-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-20">
             <h2 className="text-5xl md:text-7xl font-black mb-6 leading-none">Investment.</h2>
             <p className="text-lg text-gray-500 font-medium tracking-tight">Professional infrastructure for high-impact organizations.</p>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 overflow-x-auto overflow-y-visible pb-10 pt-14">
            <div className="inline-flex gap-8 items-stretch min-w-full justify-center px-4 py-4">
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <div key={plan._id} className={`p-10 rounded-[2.5rem] bg-[#0c0c0c] border flex flex-col transition-all duration-500 hover:scale-[1.02] w-full max-w-[380px] min-w-[320px] ${
                    plan.isPopular ? 'border-2 border-[#D4AF37] shadow-[0_20px_40px_rgba(212,175,55,0.1)] relative' : 'border-white/10 hover:border-[#D4AF37]/30'
                  }`}>
                    {plan.isPopular && (
                      <div className="absolute top-0 left-10 transform -translate-y-1/2 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[8px] font-black tracking-[0.3em] uppercase z-10">
                        Popular Choice
                      </div>
                    )}
                    
                    <span className={`text-[9px] font-black tracking-[0.4em] uppercase mb-6 ${plan.isPopular ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                      {plan.billingPeriod} Plan
                    </span>

                    <div className="mb-8 items-start">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2 truncate">{plan.planName}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className={`font-black ${plan.isPopular ? 'text-6xl' : 'text-4xl'}`}>${plan.price}</span>
                        <span className="text-gray-600 font-bold text-xs uppercase tracking-widest">USD/{plan.billingPeriod === 'Yearly' ? 'yr' : 'mo'}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10 flex-grow">
                      <div className="flex gap-3 items-center text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-none border-b border-white/5 pb-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                         Up to {plan.maxStudents?.toLocaleString() || '1000'} Students
                      </div>
                      <div className="flex gap-3 items-center text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-none border-b border-white/5 pb-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                         {plan.maxStaff} Maximum Staff
                      </div>
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="flex gap-3 items-center text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-none group/feat list-none">
                           <Check size={14} className="text-[#D4AF37] group-hover/feat:scale-125 transition-transform" /> 
                           {feature}
                        </li>
                      ))}
                    </div>

                    <Link 
                      to={`/register?planId=${plan._id}`} 
                      className={`w-full py-4 rounded-xl font-black text-xs text-center transition-all ${
                        plan.isPopular 
                        ? 'bg-[#D4AF37] text-black hover:bg-[#C89B2D]' 
                        : 'bg-white text-black hover:bg-[#D4AF37]'
                      }`}
                    >
                      {plan.price === 0 ? 'START FREE' : 'SELECT PLAN'}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-500 font-black uppercase tracking-[0.2em] animate-pulse italic">Synchronizing Global Tiers...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-44 px-6 lg:px-12 text-center">
           <div className="max-w-4xl mx-auto">
             <Trophy size={48} className="text-[#D4AF37] mx-auto mb-10 animate-float" />
             <h2 className="text-5xl md:text-7xl font-black mb-10 leading-none">Redefine <br/> Your Program.</h2>
             <p className="text-lg text-gray-500 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
               The digital standard for professional case management. Experience the difference of a precision-built system.
             </p>
             <Link to="/login" className="inline-block px-12 py-5 bg-white text-black rounded-2xl font-black text-2xl hover:bg-[#D4AF37] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)]">
                Access Portal
             </Link>
           </div>
        </section>
      </main>

      {/* Industrial Footer */}
      <footer className="bg-[#050505] py-24 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
                   <img src={logoImg} alt="Shining Light Logo" className="w-[80%] h-[80%] object-contain" />
                </div>
                <span className="font-black text-3xl tracking-tighter text-white uppercase italic">SHINING LIGHT.</span>
              </div>
              <p className="text-gray-500 max-w-md font-bold leading-relaxed text-xs mb-12">
                PRECISION ENGINEERED CASE MANAGEMENT FOR HIGH-IMPACT TRANSITIONAL HOUSING PROGRAMS.
              </p>
            </div>

            <div>
              <h5 className="text-[8px] font-black tracking-[0.5em] text-white uppercase mb-8">Directory</h5>
               <ul className="space-y-4 text-gray-500 font-black text-[10px] uppercase tracking-widest">
                  <li><a href="#features" className="hover:text-[#D4AF37] transition-colors">Infrastructure</a></li>
                  <li><a href="#solutions" className="hover:text-[#D4AF37] transition-colors">Deployment</a></li>
                  <li><a href="#pricing" className="hover:text-[#D4AF37] transition-colors">Investment</a></li>
                  <li><Link to="/login" className="hover:text-[#D4AF37] transition-colors">Authentication</Link></li>
               </ul>
            </div>

            <div>
              <h5 className="text-[8px] font-black tracking-[0.5em] text-white uppercase mb-8">Legal</h5>
               <ul className="space-y-4 text-gray-500 font-black text-[10px] uppercase tracking-widest">
                  <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Ops</a></li>
                  <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Use</a></li>
                  <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Data Protocol</a></li>
               </ul>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
             <div className="text-[8px] font-black tracking-[0.3em] text-gray-600 uppercase">
               © 2026 SHINING LIGHT CRM / GLOBAL OPERATIONS
             </div>
             <div className="text-[8px] font-black tracking-[0.3em] text-[#D4AF37]/40 uppercase">
               BUILT FOR PURPOSE.
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
