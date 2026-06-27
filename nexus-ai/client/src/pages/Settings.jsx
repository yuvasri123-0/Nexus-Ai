import React, { useState } from 'react';
import axios from 'axios';
import { User, Shield, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/profile`, { name, password });
            setUser(res.data.user);
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setPassword('');
        } catch (err) {
            setMessage({ text: 'Update failed: ' + (err.response?.data?.error || err.message), type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 ml-64 min-h-screen bg-background text-gray-200 flex justify-center">
            <div className="w-full max-w-4xl space-y-8">
                
                {/* Header */}
                <div className="pb-6 border-b border-white/5">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Account Settings</h2>
                    <p className="text-gray-400 mt-2">Manage your profile information and security preferences</p>
                </div>

                {/* Profile Form */}
                <div className="glass-card p-10 rounded-3xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-start/10 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="flex items-center space-x-5 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center border border-white/10 shadow-lg">
                            <User className="text-gray-300" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Profile Information</h3>
                            <p className="text-sm text-gray-400">Update your account name and email</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full input-field px-5 py-4 rounded-xl text-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-500 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-black/20 border border-white/5 px-5 py-4 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                    value={user?.email || ''}
                                    disabled
                                    title="Email cannot be changed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-white/5 pt-6">
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                                <Lock size={16} className="text-primary-end" />
                                <span>Change Password</span>
                            </h4>
                            <input
                                type="password"
                                className="w-full md:w-1/2 input-field px-5 py-4 rounded-xl text-sm"
                                placeholder="Enter new password (leave blank to keep current)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl flex items-center space-x-3 text-sm font-medium ${
                                message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                                <CheckCircle2 size={18} />
                                <span>{message.text}</span>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Settings Placeholder */}
                <div className="glass-card p-10 rounded-3xl opacity-50 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Shield className="text-gray-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Security Settings</h3>
                                <p className="text-sm text-gray-400">Two-factor authentication & session control</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10">Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
