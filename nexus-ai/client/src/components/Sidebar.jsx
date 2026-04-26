import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Settings, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Agent Chat', path: '/agent', icon: <MessageSquare size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="w-64 h-screen bg-card border-r border-white/5 flex flex-col fixed left-0 top-0 shadow-xl z-50">
            {/* Logo Area */}
            <div className="p-6 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center shadow-lg">
                    <Sparkles size={22} className="text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">NEXUS AI</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive 
                                ? 'bg-primary-start/10 text-primary-end font-semibold shadow-sm' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <div className={`${({ isActive }) => isActive ? 'text-primary-end' : 'text-gray-400'}`}>
                            {item.icon}
                        </div>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-white/5">
                <div className="bg-black/20 rounded-2xl p-4 flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center border border-white/10 shrink-0">
                            <UserIcon size={18} className="text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={16} />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
