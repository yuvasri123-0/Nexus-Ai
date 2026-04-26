import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-start/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-end/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md glass-card rounded-3xl p-10 space-y-8 relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                        <Sparkles size={28} className="text-white" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
                        <p className="text-gray-400 mt-2 text-sm">Sign in to your Nexus AI workspace</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-300 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full input-field px-4 py-3.5 rounded-xl pl-11 text-sm"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-semibold text-gray-300">Password</label>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full input-field px-4 py-3.5 rounded-xl pl-11 text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary font-bold py-3.5 rounded-xl text-sm mt-4"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-end font-semibold hover:text-white transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
