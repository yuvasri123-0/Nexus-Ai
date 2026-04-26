import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileCode, Download, ArrowLeft, Terminal, Copy, Check } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
            setProject(res.data);
            if (res.data.files && res.data.files.length > 0) {
                setSelectedFile(res.data.files[0]);
            }
        } catch (err) {
            console.error('Failed to fetch project');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const token = localStorage.getItem('token');
        window.open(`http://localhost:5000/api/projects/${id}/download?token=${token}`, '_blank');
    };

    const handleCopy = () => {
        if (!selectedFile) return;
        navigator.clipboard.writeText(selectedFile.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="ml-64 h-screen flex items-center justify-center bg-background">
            <div className="w-8 h-8 border-4 border-primary-end border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    if (!project) return null;

    return (
        <div className="ml-64 flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-card flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{project.title}</h2>
                        <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-primary-end font-semibold uppercase tracking-wider bg-primary-start/10 px-2 py-0.5 rounded-md">
                                {project.techStack?.[0] || 'Web Project'}
                            </span>
                            <span className="text-xs text-gray-500">
                                {project.files.length} files generated
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 btn-primary px-5 py-2.5 rounded-xl font-bold text-sm"
                >
                    <Download size={16} />
                    <span>Download ZIP</span>
                </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* File Explorer */}
                <div className="w-72 border-r border-white/5 bg-[#0D1117] overflow-y-auto flex flex-col">
                    <div className="p-4 border-b border-white/5 flex items-center space-x-2 text-gray-400 bg-card">
                        <Terminal size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Explorer</span>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                        {project.files.map((file, idx) => {
                            const isSelected = selectedFile?.filename === file.filename;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedFile(file)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center space-x-3 mb-1 transition-all duration-200 ${
                                        isSelected 
                                        ? 'bg-primary-start/20 text-primary-end font-medium border border-primary-start/30 shadow-sm' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                                    }`}
                                >
                                    <FileCode size={16} className={isSelected ? "text-primary-end" : "text-gray-500"} />
                                    <span className="truncate">{file.filename}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Code View */}
                <div className="flex-1 bg-[#0A0D14] flex flex-col overflow-hidden relative">
                    <div className="px-4 py-3 border-b border-white/5 bg-[#0D1117] flex justify-between items-center z-10">
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <span className="text-primary-end font-mono text-xs">{selectedFile?.filename.split('.').pop()?.toUpperCase() || 'FILE'}</span>
                            <span>/</span>
                            <span className="font-mono">{selectedFile?.filename}</span>
                        </div>
                        <button 
                            onClick={handleCopy}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white text-xs font-medium"
                        >
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar p-6">
                        <pre className="font-mono text-sm leading-loose text-gray-300">
                            <code>{selectedFile?.content || '// No content generated'}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
