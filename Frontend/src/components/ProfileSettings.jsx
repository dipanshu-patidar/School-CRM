import React, { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { updateProfile, getMe } from '../api/userApi';

const ProfileSettings = () => {
    const [user, setUser] = useState({});
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        email: ''
    });

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [avatarPreview, setAvatarPreview] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&h=256&auto=format&fit=crop');
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    const fetchUserData = async () => {
        try {
            const response = await getMe();
            const userData = response.data;
            setUser(userData);
            setPersonalInfo({
                name: userData.name || '',
                email: userData.email || ''
            });
            if (userData.avatar) {
                setAvatarPreview(`http://localhost:5000${userData.avatar}`);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('name', personalInfo.name);
            formData.append('email', personalInfo.email);

            if (passwords.newPassword) {
                formData.append('password', passwords.newPassword);
            }

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const response = await updateProfile(formData);

            // Update session storage
            const updatedUser = response.data;
            const currentSessionUser = JSON.parse(sessionStorage.getItem('user')) || {};
            sessionStorage.setItem('user', JSON.stringify({ ...currentSessionUser, ...updatedUser }));
            sessionStorage.setItem('userName', updatedUser.name);
            if (updatedUser.avatar) {
                sessionStorage.setItem('userAvatar', updatedUser.avatar);
            }
            setUser(updatedUser);

            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setPasswords({ newPassword: '', confirmPassword: '' });
            setAvatarFile(null);

            if (updatedUser.avatar) {
                setAvatarPreview(`http://localhost:5000${updatedUser.avatar}`);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File size should not be more than 2MB.");
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Status Message */}
            {status.message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    <p className="text-sm font-bold">{status.message}</p>
                </div>
            )}

            {/* Personal Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                </div>

                <form onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={personalInfo.name}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={personalInfo.email}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-8 p-5 bg-gray-50 border border-gray-100 rounded-xl">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Profile Photo Upload</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
                                <img
                                    src={avatarPreview}
                                    alt="Avatar Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-lg transition-colors cursor-pointer mb-2 shadow-sm"
                                >
                                    <Upload size={16} className="text-primary" />
                                    Choose New Photo
                                </button>
                                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-6 bg-primary rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:font-normal placeholder:text-gray-400 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:font-normal placeholder:text-gray-400 font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
