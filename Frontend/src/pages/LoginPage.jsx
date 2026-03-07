import React, { useState } from 'react';
import { Target } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
    const [role, setRole] = useState('admin');
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('123');

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        if (newRole === 'admin') {
            setEmail('admin@gmail.com');
            setPassword('123');
        } else {
            setEmail('staff@gmail.com');
            setPassword('123');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(role);
    };

    return (
        <div className="min-h-screen w-full flex font-sans overflow-hidden bg-white">
            <div className="w-full flex flex-col md:flex-row relative h-screen">

                {/* Left Side - Form Pane */}
                <div className="md:w-1/2 p-8 md:p-12 lg:p-24 flex flex-col justify-between relative bg-white h-full overflow-y-auto">

                    {/* Brand Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center shadow-sm border border-indigo-200/50">
                            <Target className="text-[#4F46E5] fill-[#4F46E5]/20" size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">RIDSS CRM</span>
                    </div>

                    {/* Main Form Area */}
                    <div className="w-full max-w-[440px] mx-auto flex flex-col justify-center my-auto py-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Log in</h1>
                        <p className="text-gray-500 font-medium mb-8">Welcome back! Please enter your details.</p>

                        <form onSubmit={handleSubmit} className="w-full space-y-5">

                            {/* Role Toggle */}
                            <div className="flex bg-gray-50 p-1 rounded-xl mb-4 border border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange('admin')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange('staff')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'staff' ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Staff
                                </button>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Forgot Password & Remember Me */}
                            <div className="flex justify-between items-center py-2">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer" />
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Remember for 30 days</span>
                                </label>
                                <button type="button" className="text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer">
                                    Forgot password
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full py-3.5 mt-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                            >
                                Sign in
                            </button>

                            {/* Google Sign In */}
                            {/* Google Sign In removed by user request */}

                            {/* Signup Link */}
                            <p className="text-center text-sm font-medium text-gray-500 pt-4">
                                Don't have an account? <span className="text-[#4F46E5] font-bold cursor-pointer hover:underline">Sign up</span>
                            </p>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="text-xs font-semibold text-gray-400">
                        © RIDSS CRM 2026
                    </div>
                </div>

                {/* Right Side - Illustration Pane */}
                <div className="hidden md:flex md:w-1/2 bg-[#4F46E5] p-8 md:p-12 items-center justify-center relative h-full">
                    {/* Generated Illustration Image */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                        <img
                            src="/login_illustration_2.png"
                            alt="Dashboard Illustration"
                            className="max-w-[100%] max-h-[60%] object-contain"
                            style={{ mixBlendMode: 'normal' }}
                        />
                        <div className="mt-12 text-center text-white/90 max-w-md">
                            <h2 className="text-2xl font-bold mb-3 tracking-tight">Welcome to your new dashboard</h2>
                            <p className="text-[#A5B4FC] font-medium">Sign in to explore changes we've made.</p>
                        </div>

                        {/* Dots */}
                        <div className="flex gap-2.5 mt-10">
                            <button className="w-2 h-2 rounded-full bg-white opacity-40 hover:opacity-100 transition-opacity cursor-pointer"></button>
                            <button className="w-2 h-2 rounded-full bg-white opacity-100 cursor-pointer"></button>
                            <button className="w-2 h-2 rounded-full bg-white opacity-40 hover:opacity-100 transition-opacity cursor-pointer"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
