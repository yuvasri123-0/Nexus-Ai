import React, { useState } from 'react';
import axios from 'axios';
import { Rocket, Database, Globe, Smartphone, ArrowRight, CheckCircle2, Loader2, Sparkles, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectBuilder = () => {
    const [step, setStep] = useState(1);
    const [domain, setDomain] = useState('');
    const [title, setTitle] = useState('');
    const [requirements, setRequirements] = useState('');
    const [loading, setLoading] = useState(false);
    const [buildStatus, setBuildStatus] = useState('');
    const navigate = useNavigate();

    const domains = [
        { id: 'MERN', name: 'MERN Stack', icon: <Database size={24} />, desc: 'MongoDB, Express, React, Node' },
        { id: 'Full Stack', name: 'Full Stack', icon: <Globe size={24} />, desc: 'Modern web application' },
        { id: 'AI/ML', name: 'AI/ML', icon: <Sparkles size={24} />, desc: 'Intelligent automation' },
        { id: 'SaaS', name: 'SaaS Platform', icon: <Layers size={24} />, desc: 'Multi-tenant solution' },
        { id: 'Mobile Backend', name: 'Mobile Backend', icon: <Smartphone size={24} />, desc: 'REST/GraphQL API' },
    ];

    const handleStartBuild = async () => {
        setLoading(true);
        setStep(3);
        
        try {
            setBuildStatus('Initializing build engine...');
            setTimeout(() => setBuildStatus('Analyzing requirements...'), 2000);
            setTimeout(() => setBuildStatus('Generating architecture...'), 4000);
            setTimeout(() => setBuildStatus('Building frontend...'), 6000);
            setTimeout(() => setBuildStatus('Building backend...'), 8000);
            setTimeout(() => setBuildStatus('Finalizing project...'), 10000);

            const res = await axios.post('http://localhost:5000/api/ai/build', {
                domain,
                title,
                requirements
            });

            setTimeout(() => {
                navigate(`/projects/${res.data._id}`);
            }, 12000);
        } catch (err) {
            alert('Build failed: ' + (err.response?.data?.error || err.message));
            setLoading(false);
            setStep(2);
        }
    };

    return (
        <div className="p-8 ml-64 min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-start/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="w-full max-w-5xl relative z-10">
                {step === 1 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-start to-primary-end rounded-2xl flex items-center justify-center shadow-lg mb-6">
                                <Rocket size={32} className="text-white" />
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight text-white">Select Domain</h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Choose the foundational architecture for your next big idea. Our AI will scaffold the entire codebase based on best practices.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {domains.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => { setDomain(d.id); setStep(2); }}
                                    className="glass-card p-6 rounded-2xl text-left hover:-translate-y-1 hover:border-primary-start/50 transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary-start/20 group-hover:text-primary-end text-gray-300 transition-all duration-300">
                                        {d.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{d.name}</h3>
                                    <p className="text-sm text-gray-400">{d.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
                        <div className="text-center space-y-3">
                            <h2 className="text-4xl font-bold tracking-tight text-white">Project Details</h2>
                            <p className="text-gray-400 text-lg">Define the specifications for your {domain} project</p>
                        </div>
                        <div className="glass-card p-10 rounded-3xl space-y-8">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 ml-1">Project Title</label>
                                <input
                                    type="text"
                                    className="w-full input-field px-6 py-4 rounded-xl text-sm"
                                    placeholder="e.g. Nexus E-commerce Platform"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 ml-1">Requirements & Features</label>
                                <textarea
                                    className="w-full input-field px-6 py-4 rounded-xl text-sm min-h-[200px] resize-none"
                                    placeholder="Describe your project in detail. What features does it need? What is the core functionality?"
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-4 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-semibold transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleStartBuild}
                                    disabled={!title || !requirements}
                                    className="flex-[2] btn-primary px-6 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    <span>Initiate Build</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-10 animate-in zoom-in duration-500 max-w-xl mx-auto">
                        <div className="relative w-40 h-40 mx-auto">
                            <div className="absolute inset-0 bg-primary-start/20 rounded-full animate-ping"></div>
                            <div className="absolute inset-4 bg-primary-end/30 rounded-full animate-pulse"></div>
                            <div className="relative w-full h-full glass-card rounded-full flex items-center justify-center border-primary-start/30">
                                <Loader2 size={48} className="animate-spin text-primary-end" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white tracking-tight">Building System...</h2>
                            <p className="text-xl text-primary-end font-medium">{buildStatus}</p>
                        </div>
                        <div className="space-y-3 bg-card p-6 rounded-2xl border border-white/5">
                            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary-start to-primary-end w-full animate-pulse"></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-gray-500">Engine Status</span>
                                <span className="text-primary-end">Active</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectBuilder;
