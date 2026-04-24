import { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, Database, Code, Rocket, 
  Settings, Layout, Search, Layers, Server,
  ChevronRight, Terminal, Cpu, Download, 
  User, LogOut, Plus, Folder, Cloud, Lock, Mail,
  CheckCircle, ArrowRight
} from 'lucide-react';
import './App.css';

export default function App() {
  const [view, setView] = useState('auth'); // 'auth', 'dashboard', 'builder', 'settings'
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Builder State
  const [domain, setDomain] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [idea, setIdea] = useState(null);
  const [buildStep, setBuildStep] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState('');

  const domains = [
    { id: 'mern', name: 'MERN Stack', icon: <Layers className="w-5 h-5" /> },
    { id: 'fullstack', name: 'Full Stack (Next.js)', icon: <Layout className="w-5 h-5" /> },
    { id: 'pern', name: 'PERN Stack', icon: <Database className="w-5 h-5" /> },
    { id: 'python', name: 'Python/Django', icon: <Server className="w-5 h-5" /> },
    { id: 'saas', name: 'SaaS Platform', icon: <Cloud className="w-5 h-5" /> },
    { id: 'ai', name: 'AI & ML', icon: <Bot className="w-5 h-5" /> },
    { id: 'mobile', name: 'Mobile App Backend', icon: <Terminal className="w-5 h-5" /> },
    { id: 'api', name: 'REST/GraphQL API', icon: <Code className="w-5 h-5" /> }
  ];

  const buildSteps = [
    { step: 1, title: 'Scaffolding Codebase', icon: <Code className="w-4 h-4" /> },
    { step: 2, title: 'Configuring Database Schemas', icon: <Database className="w-4 h-4" /> },
    { step: 3, title: 'Setting up Server & APIs', icon: <Server className="w-4 h-4" /> },
    { step: 4, title: 'Preparing Deployment Assets', icon: <Rocket className="w-4 h-4" /> }
  ];

  const handleAuth = (e) => {
    e.preventDefault();
    setUser({ name: 'Alex Developer', email: 'alex@projectforge.ai' });
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('auth');
    setProjects([]);
  };

  const startNewWorkspace = () => {
    setDomain('');
    setRequirements('');
    setIdea(null);
    setBuildStep(0);
    setDeployedUrl('');
    setView('builder');
  };

  const handleGenerate = async () => {
    if (!domain || !requirements.trim()) return;
    setIsGenerating(true);
    setIdea(null);
    setBuildStep(0);
    setDeployedUrl('');
    
    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, requirements })
      });
      const data = await response.json();
      
      setIdea({
        projectId: data.projectId,
        title: `Custom ${domains.find(d => d.id === domain)?.name}`,
        description: `An autonomous solution architected for your needs. Includes high performance APIs and scalable infrastructure.`,
        features: ['AI-optimized code', 'Secure Authentication', 'Scalable Microservices', 'Containerized Deployment'],
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker']
      });
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the AI Agent Server (Make sure backend is running on port 5000)');
    }
    setIsGenerating(false);
  };

  const handleBuild = () => {
    setBuildStep(1);
    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step > 4) {
        clearInterval(interval);
        setProjects(prev => [{
          id: Date.now(),
          title: idea.title,
          domain: domains.find(d => d.id === domain)?.name,
          date: new Date().toLocaleDateString(),
          status: 'Built'
        }, ...prev]);
      } else {
        setBuildStep(step);
      }
    }, 1500);
  };

  const handleDownload = () => {
    if (!idea?.projectId) return;
    window.location.href = `http://localhost:5000/api/download/${idea.projectId}`;
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      const url = `https://${idea.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(Math.random()*1000)}.forge.app`;
      setDeployedUrl(url);
      
      // Update project status to deployed
      setProjects(prev => prev.map((p, i) => i === 0 ? { ...p, status: 'Deployed', url } : p));
    }, 3000);
  };

  if (view === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-gray-200 font-sans p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8b5cf6]/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-md w-full bg-[#1e212b]/80 backdrop-blur-xl border border-[#2d313f] rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-2">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="text-center text-gray-400 mb-8">Sign in to ProjectForge AI Agent</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input required type="text" placeholder="John Doe" className="w-full bg-[#0f1117] border border-[#2d313f] rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#8b5cf6] transition-colors" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="email" placeholder="you@example.com" className="w-full bg-[#0f1117] border border-[#2d313f] rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#8b5cf6] transition-colors" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input required type="password" placeholder="••••••••" className="w-full bg-[#0f1117] border border-[#2d313f] rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#8b5cf6] transition-colors" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] hover:from-[#7c3aed] hover:to-[#0284c7] text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20">
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-gray-400 hover:text-white transition-colors">
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0f1117] text-gray-200 selection:bg-purple-500/30 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#2d313f] bg-[#1e212b]/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">ProjectForge<span className="text-[#8b5cf6]">.ai</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'dashboard' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
          >
            <Layout className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={startNewWorkspace}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'builder' ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] font-medium border border-[#8b5cf6]/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
          >
            <Plus className="w-5 h-5" />
            New Workspace
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'settings' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="p-4 m-4 border-t border-[#2d313f]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#2d313f] flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-[#2d313f] flex items-center justify-between px-6 bg-[#0f1117]/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm text-gray-400 capitalize">
            <span>Workspace</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-200 font-medium">{view}</span>
          </div>
          {view === 'dashboard' && (
            <button onClick={startNewWorkspace} className="flex items-center gap-2 text-sm font-medium text-white bg-[#8b5cf6] hover:bg-[#7c3aed] px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Start Building
            </button>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-24">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* --- DASHBOARD VIEW --- */}
            {view === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]}</h2>
                  <p className="text-gray-400">Here's an overview of your agentic workspaces and deployments.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#1e212b] p-6 rounded-2xl border border-[#2d313f]">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                      <Folder className="w-6 h-6" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{projects.length}</p>
                    <p className="text-sm text-gray-400">Total Projects Built</p>
                  </div>
                  <div className="bg-[#1e212b] p-6 rounded-2xl border border-[#2d313f]">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{projects.filter(p => p.status === 'Deployed').length}</p>
                    <p className="text-sm text-gray-400">Active Deployments</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#0ea5e9]/20 p-6 rounded-2xl border border-[#8b5cf6]/30 flex flex-col justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Ready to build?</h3>
                      <p className="text-sm text-gray-300">Let the AI agent scaffold your next big idea instantly.</p>
                    </div>
                    <button onClick={startNewWorkspace} className="mt-4 flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                      Start Building <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#1e212b] rounded-2xl border border-[#2d313f] overflow-hidden">
                  <div className="p-6 border-b border-[#2d313f] flex justify-between items-center">
                    <h3 className="font-semibold text-white">Recent Workspaces</h3>
                  </div>
                  {projects.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                      <Folder className="w-12 h-12 mb-4 opacity-50" />
                      <p>No projects built yet. Start your first workspace!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#2d313f]">
                      {projects.map(proj => (
                        <div key={proj.id} className="p-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#2d313f] flex items-center justify-center text-gray-400">
                              <Code className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white group-hover:text-[#8b5cf6] transition-colors">{proj.title}</h4>
                              <p className="text-xs text-gray-400">{proj.domain} • Built on {proj.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${proj.status === 'Deployed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {proj.status}
                            </span>
                            {proj.url && (
                              <a href={proj.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                                <Cloud className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- SETTINGS VIEW --- */}
            {view === 'settings' && (
              <div className="max-w-2xl animate-fade-in space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
                  <p className="text-gray-400">Manage your profile and agent preferences.</p>
                </div>
                
                <div className="bg-[#1e212b] rounded-2xl border border-[#2d313f] p-8 space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-[#2d313f]">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#0ea5e9] flex items-center justify-center text-3xl text-white font-bold shadow-lg shadow-purple-500/20">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                      <p className="text-gray-400">{user?.email}</p>
                      <button className="mt-2 text-sm text-[#8b5cf6] font-medium hover:text-[#7c3aed]">Change Avatar</button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Full Name</label>
                      <input type="text" defaultValue={user?.name} className="w-full bg-[#0f1117] border border-[#2d313f] rounded-lg py-2.5 px-4 focus:outline-none focus:border-[#8b5cf6] transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Email Address</label>
                      <input type="email" defaultValue={user?.email} className="w-full bg-[#0f1117] border border-[#2d313f] rounded-lg py-2.5 px-4 focus:outline-none focus:border-[#8b5cf6] transition-colors" />
                    </div>
                    <button className="w-full py-2.5 mt-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1">Danger Zone</h3>
                    <p className="text-sm text-red-400/70">Permanently delete your account and all built projects.</p>
                  </div>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* --- BUILDER VIEW --- */}
            {view === 'builder' && (
              <>
                {/* Hero Section */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#8b5cf6] text-sm font-medium mb-4 animate-fade-in">
                    <Sparkles className="w-4 h-4" />
                    Autonomous Project Builder
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    What are we building <br className="hidden md:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#c084fc] to-[#0ea5e9]">today?</span>
                  </h2>
                </div>

                {/* Domain Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">1. Select Domain</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {domains.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setDomain(d.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                          domain === d.id 
                            ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] transform scale-[1.02]' 
                            : 'border-[#2d313f] bg-[#1e212b] hover:border-gray-600 hover:bg-[#1e212b]/80'
                        }`}
                      >
                        <div className={`p-2.5 rounded-lg mb-2 ${domain === d.id ? 'bg-[#8b5cf6] text-white' : 'bg-[#0f1117] text-gray-400'}`}>
                          {d.icon}
                        </div>
                        <span className={`text-sm font-medium ${domain === d.id ? 'text-white' : 'text-gray-300'}`}>{d.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Requirements Gathering */}
                <div className="space-y-4 animate-fade-in-up delay-100">
                  <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">2. Detailed Requirements</label>
                  <textarea 
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe specific features, database needs, or business logic. Our AI agent will architect the optimal solution..."
                    className="w-full h-32 bg-[#1e212b] border border-[#2d313f] rounded-xl p-4 text-gray-200 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/50 resize-none transition-all placeholder:text-gray-600"
                  />
                </div>

                {/* Action */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!domain || !requirements.trim() || isGenerating}
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-white/10 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-r from-[#8b5cf6] via-[#c084fc] to-[#0ea5e9] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] opacity-80"></div>
                    {isGenerating ? (
                      <><Search className="w-5 h-5 animate-spin" /> Analyzing & Architecting...</>
                    ) : (
                      <><Bot className="w-5 h-5" /> Architect Project</>
                    )}
                  </button>
                </div>

                {/* Generated Idea & Build Workflow */}
                {idea && (
                  <div className="mt-12 animate-fade-in-up space-y-6">
                    <div className="p-1 rounded-2xl bg-gradient-to-b from-[#2d313f] to-transparent">
                      <div className="bg-[#1e212b] rounded-xl p-8 border border-[#2d313f]/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-[#8b5cf6]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="text-[#8b5cf6] w-6 h-6" />
                            <h3 className="text-2xl font-bold text-white">{idea.title}</h3>
                          </div>
                          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            {idea.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Proposed Architecture
                              </h4>
                              <ul className="space-y-3">
                                {idea.features.map((f, i) => (
                                  <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></div>
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Recommended Stack
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {idea.techStack.map((t, i) => (
                                  <span key={i} className="px-3 py-1.5 rounded-md bg-[#0f1117] border border-[#2d313f] text-xs font-medium text-gray-300">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {buildStep === 0 ? (
                            <div className="pt-6 border-t border-[#2d313f] flex justify-end">
                              <button 
                                onClick={handleBuild}
                                className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
                              >
                                <Terminal className="w-5 h-5" /> Start Building
                              </button>
                            </div>
                          ) : (
                            <div className="pt-6 border-t border-[#2d313f]">
                              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Agent Build Progress</h4>
                              <div className="space-y-4">
                                {buildSteps.map(step => {
                                  const isActive = buildStep === step.step;
                                  const isCompleted = buildStep > step.step;
                                  return (
                                    <div key={step.step} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                      isActive ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : 
                                      isCompleted ? 'border-emerald-500/20 bg-emerald-500/5' : 
                                      'border-[#2d313f] bg-[#0f1117]/50 opacity-50'
                                    }`}>
                                      <div className={`p-2 rounded-lg ${
                                        isActive ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] animate-pulse' :
                                        isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                                        'bg-[#2d313f] text-gray-500'
                                      }`}>
                                        {isActive ? <Search className="w-5 h-5 animate-spin" /> : (isCompleted ? <CheckCircle className="w-5 h-5" /> : step.icon)}
                                      </div>
                                      <div className="flex-1">
                                        <h5 className={`font-medium ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`}>{step.title}</h5>
                                        {isActive && <div className="h-1 w-full bg-[#2d313f] rounded-full mt-2 overflow-hidden">
                                          <div className="h-full bg-[#8b5cf6] animate-[shimmer_1.5s_infinite] w-1/2 rounded-full"></div>
                                        </div>}
                                      </div>
                                      {isCompleted && <Sparkles className="w-5 h-5 text-emerald-400 hidden sm:block" />}
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Post-Build Actions */}
                              {buildStep > 4 && (
                                <div className="mt-8 space-y-4 animate-fade-in-up">
                                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-emerald-400">
                                      <CheckCircle className="w-6 h-6" />
                                      <div>
                                        <h5 className="font-semibold text-white">Project Successfully Built!</h5>
                                        <p className="text-sm">Source code is fully generated and ready.</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button 
                                      onClick={handleDownload}
                                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1e212b] hover:bg-[#2d313f] border border-[#2d313f] text-white font-medium rounded-xl transition-colors"
                                    >
                                      <Download className="w-5 h-5" /> Download Source (ZIP)
                                    </button>
                                    <button 
                                      onClick={handleDeploy}
                                      disabled={isDeploying || deployedUrl}
                                      className={`flex items-center justify-center gap-2 px-6 py-3.5 font-medium rounded-xl transition-all ${
                                        deployedUrl ? 'bg-[#2d313f] text-emerald-400 cursor-default' :
                                        'bg-gradient-to-r from-[#8b5cf6] to-[#0ea5e9] hover:from-[#7c3aed] hover:to-[#0284c7] text-white shadow-lg shadow-purple-500/20'
                                      }`}
                                    >
                                      {isDeploying ? <><Search className="w-5 h-5 animate-spin" /> Deploying to Cloud...</> : 
                                       deployedUrl ? <><Cloud className="w-5 h-5" /> Deployed Successfully</> :
                                       <><Cloud className="w-5 h-5" /> One-Click Deploy</>}
                                    </button>
                                  </div>

                                  {deployedUrl && (
                                    <div className="p-4 rounded-xl border border-[#2d313f] bg-[#0f1117] flex items-center justify-between mt-4">
                                      <div className="flex items-center gap-3 text-gray-300">
                                        <Cloud className="w-5 h-5 text-[#0ea5e9]" />
                                        <span className="text-sm">Live URL:</span>
                                        <a href={deployedUrl} target="_blank" rel="noreferrer" className="text-[#0ea5e9] hover:underline font-medium">
                                          {deployedUrl}
                                        </a>
                                      </div>
                                      <button onClick={() => setView('dashboard')} className="text-sm bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-white">
                                        Go to Dashboard
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
