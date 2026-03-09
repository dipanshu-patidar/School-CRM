import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import logoImg from '../assets/login/logo.png';
import illustrationGold from '../assets/login/login_illustration_gold.png';
import illustrationStudent from '../assets/login/login_illustration_student.png';
import illustrationAttendance from '../assets/login/login_illustration_attendance.png';

const slides = [
    {
        image: illustrationGold,
        title: 'SHINING LIGHT',
        subtitle: 'Transitional Homes for Young Adults'
    },
    {
        image: illustrationStudent,
        title: 'STUDENT TRACKING',
        subtitle: 'Manage Progress & Development'
    },
    {
        image: illustrationAttendance,
        title: 'SMART ANALYTICS',
        subtitle: 'Real-time Performance Insights'
    }
];

const LoginPage = ({ onLogin }) => {
    const [role, setRole] = useState('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isBlinking, setIsBlinking] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsBlinking(true);

            // Wait for half of the blink duration to swap images
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 400);

            // Turn off blinking after full animation
            setTimeout(() => {
                setIsBlinking(false);
            }, 800);
        }, 4000); // 4 second interval
        return () => clearInterval(timer);
    }, []);

    const handleRoleChange = (newRole) => {
        setRole(newRole);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { token, user } = response.data;

            // Save token and user info to sessionStorage
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userEmail', user.email);
            sessionStorage.setItem('userName', user.name);
            sessionStorage.setItem('userRole', user.role);
            sessionStorage.setItem('userAvatar', user.avatar || '');
            sessionStorage.setItem('user', JSON.stringify(user));

            // Pass the verified role to handleLogin in App.jsx
            onLogin(user.role);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex font-sans overflow-hidden bg-background">
            <style>{`
                @keyframes cinematic-blink {
                    0% { opacity: 1; filter: brightness(1) blur(0px); transform: scale(1); }
                    40% { opacity: 0; filter: brightness(1.5) blur(4px); transform: scale(0.98); }
                    60% { opacity: 0; filter: brightness(1.5) blur(4px); transform: scale(0.98); }
                    100% { opacity: 1; filter: brightness(1) blur(0px); transform: scale(1); }
                }
                .blink-active {
                    animation: cinematic-blink 0.8s ease-in-out forwards;
                }
            `}</style>
            <div className="w-full flex flex-col md:flex-row relative h-screen">

                {/* Left Side - Form Pane */}
                <div className="md:w-1/2 p-8 md:p-12 lg:p-24 flex flex-col justify-between relative bg-white h-full overflow-y-auto">

                    {/* Brand Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-xl shadow-black/5 overflow-hidden">
                            <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-widest uppercase">Shining Light</span>
                    </div>

                    {/* Main Form Area */}
                    <div className="w-full max-w-[440px] mx-auto flex flex-col justify-center my-auto py-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Log in</h1>
                        <p className="text-gray-500 font-medium mb-8">Welcome back! Please enter your details.</p>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

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
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
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
                                    className="w-full px-4 py-3 bg-white border border-2 border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Forgot Password & Remember Me */}
                            <div className="flex justify-between items-center py-2">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Remember for 30 days</span>
                                </label>
                                <button type="button" className="text-sm font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer">
                                    Forgot password
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3.5 mt-2 ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover active:scale-[0.98] cursor-pointer'} text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2`}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>

                            {/* Signup Link */}
                            <p className="text-center text-sm font-medium text-gray-500 pt-4">
                                Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline">Sign up</span>
                            </p>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="text-xs font-semibold text-gray-400">
                        © Shining Light 2026
                    </div>
                </div>

                {/* Right Side - Illustration Pane */}
                <div className="hidden md:flex md:w-1/2 bg-sidebar p-8 md:p-12 items-center justify-center relative h-full">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                    {/* Generated Illustration Image */}
                    <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center py-10 ${isBlinking ? 'blink-active' : ''}`}>
                        <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px]">
                            {slides.map((slide, index) => (
                                <img
                                    key={index}
                                    src={slide.image}
                                    alt={slide.title}
                                    className={`absolute w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(212,175,55,0.2)] transition-opacity duration-300 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                                    style={{ mixBlendMode: 'normal' }}
                                />
                            ))}
                        </div>
                        <div className="mt-12 text-center text-white/90 max-w-md h-24">
                            <h2 className="text-3xl font-black mb-3 tracking-tight text-primary">
                                {slides[currentSlide].title}
                            </h2>
                            <p className="text-gray-400 font-medium tracking-wide">
                                {slides[currentSlide].subtitle}
                            </p>
                        </div>

                        {/* Dots */}
                        <div className="flex gap-2.5 mt-10">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setIsBlinking(true);
                                        setTimeout(() => setCurrentSlide(index), 400);
                                        setTimeout(() => setIsBlinking(false), 800);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === index ? 'w-8 bg-primary' : 'bg-white opacity-40 hover:opacity-100'
                                        }`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
