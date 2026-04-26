import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Download, Eye, Trash2, Rocket, CheckCircle2, LayoutGrid, Clock, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    const handleDownload = (id) => {
        const token = localStorage.getItem('token');
        window.open(`http://localhost:5000/api/projects/${id}/download?token=${token}`, '_blank');
    };

    const runningProjectsCount = projects.filter(p => p.status === 'running').length;
    const completedProjectsCount = projects.filter(p => p.status === 'completed').length;

    return (
        <div className="p-8 ml-64 min-h-screen bg-background text-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Project Overview</h2>
                    <p className="text-gray-400 mt-1">Manage and deploy your AI-generated workspaces</p>
                </div>
                <button
                    onClick={() => navigate('/build')}
                    className="flex items-center space-x-2 btn-primary px-6 py-3 rounded-xl font-semibold shadow-lg"
                >
                    <Plus size={20} />
                    <span>Start Building</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-400 font-medium text-sm">Total Projects</p>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><LayoutGrid size={20} /></div>
                    </div>
                    <h3 className="text-4xl font-bold text-white">{projects.length}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-400 font-medium text-sm">Running</p>
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><PlayCircle size={20} /></div>
                    </div>
                    <h3 className="text-4xl font-bold text-white">{runningProjectsCount}</h3>
                </div>
                <div className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-400 font-medium text-sm">Completed</p>
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><CheckCircle2 size={20} /></div>
                    </div>
                    <h3 className="text-4xl font-bold text-white">{completedProjectsCount}</h3>
                </div>
            </div>

            {/* Project List */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Recent Projects</h3>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-primary-end border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="glass-card rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                            <Rocket size={40} className="text-gray-400" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white">No projects yet</h4>
                            <p className="text-gray-400 mt-2 max-w-sm mx-auto">Start building your first AI application with Nexus. Choose a stack and let the agent do the heavy lifting.</p>
                        </div>
                        <button
                            onClick={() => navigate('/build')}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-xl font-semibold transition-all duration-200 mt-4 shadow-sm"
                        >
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project._id} className="glass-card p-6 rounded-2xl flex flex-col group hover:border-primary-start/50 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-white truncate pr-4">{project.title}</h4>
                                        <div className="flex items-center space-x-2">
                                            {project.status === 'completed' ? (
                                                <span className="inline-flex items-center space-x-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                                                    <CheckCircle2 size={12} />
                                                    <span>Completed</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center space-x-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md">
                                                    <PlayCircle size={12} />
                                                    <span>Running</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs px-2.5 py-1 bg-white/5 text-gray-300 rounded-lg uppercase tracking-wider font-semibold border border-white/10 shrink-0">
                                        {project.techStack?.[0] || 'Web'}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
                                    <Clock size={14} />
                                    <span>{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{project.files?.length || 0} files</span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/projects/${project._id}`)}
                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors flex items-center space-x-1"
                                        >
                                            <Eye size={14} />
                                            <span>View</span>
                                        </button>
                                        <button
                                            onClick={() => handleDownload(project._id)}
                                            className="px-3 py-1.5 bg-primary-start/20 hover:bg-primary-start/30 rounded-lg text-sm font-medium text-primary-end transition-colors flex items-center space-x-1"
                                        >
                                            <Download size={14} />
                                            <span>ZIP</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
