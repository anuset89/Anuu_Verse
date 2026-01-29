import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from '../components/oracle/ChatInterface';

// Icons (using Lucide React or similar if available, otherwise Unicode placeholders)
const Icons = {
    Terminal: () => <span className="text-xl">💻</span>,
    Brain: () => <span className="text-xl">🧠</span>,
    Eye: () => <span className="text-xl">👁️</span>,
    Lock: () => <span className="text-xl">🛡️</span>,
    Pulse: () => <span className="text-xl">💓</span>,
};



export const AnuuDashboardV2 = () => {
    const [activeTab, setActiveTab] = useState('nexus');
    const [generationMode, setGenerationMode] = useState<'chat' | 'image' | 'video'>('chat');
    const [pulse, setPulse] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [systemStats, setSystemStats] = useState({ vram: 0, context: 0, status: 'offline' });

    // Handle Tab Selection Sync
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        if (tabId === 'vision') setGenerationMode('image');
        else if (tabId === 'nexus') setGenerationMode('chat');
        // Terminal stays on chat for now, maybe with a future 'execute' mode
        else if (tabId === 'terminal') setGenerationMode('chat');
    };

    // Callback when ChatInterface changes mode (e.g. from + menu)
    const handleModeChange = (mode: 'chat' | 'image' | 'video') => {
        setGenerationMode(mode);
        if (mode === 'image' || mode === 'video') setActiveTab('vision');
        else setActiveTab('nexus');
    };

    // Fake pulse effect & Real Status Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(p => p + 1);

            // Poll System Status
            fetch('http://localhost:8000/')
                .then(res => res.json())
                .then(data => {
                    // Mock calculation for the demo if backend doesn't provide numbers yet
                    // If backend provides raw data, use it. Here we simulate variation.
                    setSystemStats({
                        vram: data.vram_lock ? 80 : 32, // Jump if locked
                        context: 4,
                        status: data.status
                    });
                })
                .catch(() => setSystemStats(prev => ({ ...prev, status: 'offline' })));
        }, 2000);

        // Fetch History Once
        fetch('http://localhost:8000/mind/history')
            .then(res => res.json())
            .then(data => {
                if (data.history) setHistory(data.history);
            })
            .catch(err => console.error("Failed to load history:", err));

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-gray-800 selection:text-white overflow-hidden relative">

            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
                <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] transition-colors duration-1000 ${generationMode === 'image' ? 'bg-pink-900/10' : generationMode === 'video' ? 'bg-orange-900/10' : 'bg-blue-900/10'}`} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-800/10 rounded-full blur-[150px]" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 flex h-screen">

                {/* Sidebar */}
                <aside className="w-20 lg:w-64 border-r border-white/10 bg-black/40 backdrop-blur-md flex flex-col justify-between p-4 z-30">
                    <div className="space-y-6">
                        {/* Logo & New Chat */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <div className={`w-8 h-8 rounded-lg text-black flex items-center justify-center font-bold text-lg transition-colors ${generationMode === 'image' ? 'bg-pink-500' : generationMode === 'video' ? 'bg-orange-500' : 'bg-white'}`}>
                                    A
                                </div>
                                <span className="hidden lg:block font-sans font-medium text-lg tracking-tight text-white">Anuu Verse</span>
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                            >
                                <span className="text-xl">+</span>
                                <span className="hidden lg:block text-sm font-medium text-gray-200">New Chat</span>
                            </button>
                        </div>

                        {/* Recent History */}
                        <div className="hidden lg:block space-y-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Research History</h3>
                            <div className="space-y-1">
                                {history.length === 0 ? (
                                    <div className="px-2 text-xs text-gray-600 italic">No recent memories.</div>
                                ) : (
                                    history.map((item, i) => (
                                        <button key={i} className="w-full text-left p-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors truncate group relative">
                                            <span className="truncate block pr-4">
                                                {typeof item.user === 'string' ? item.user.substring(0, 30) : "Interaction"}...
                                            </span>
                                            <span className="hidden group-hover:block absolute right-2 top-2 text-[8px] text-gray-600">
                                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Tools / Modules */}
                        <div className="space-y-2">
                            <h3 className="hidden lg:block text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Active Modules</h3>
                            <nav className="space-y-1">
                                {[
                                    { id: 'nexus', label: 'Nexus Core', icon: Icons.Brain },
                                    { id: 'terminal', label: 'Terminal', icon: Icons.Terminal },
                                    { id: 'vision', label: 'Vision (Flux)', icon: Icons.Eye },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id)}
                                        className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-300 ${activeTab === item.id
                                            ? 'bg-blue-500/10 text-cyan-400 border border-blue-500/20'
                                            : 'hover:bg-white/5 text-gray-500 hover:text-gray-200'
                                            }`}
                                    >
                                        {item.icon()}
                                        <span className="hidden lg:block text-sm">{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className={`p-3 bg-white/5 rounded-xl border border-white/5 space-y-2 transition-colors ${systemStats.status === 'offline' ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">System Status</span>
                            <span className={`${systemStats.status === 'online' ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${systemStats.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                {systemStats.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>VRAM (24GB)</span>
                                <span>{systemStats.vram}%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyan-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${systemStats.vram}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>Context (128k)</span>
                                <span>{systemStats.context}%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[4%]"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
                    {/* Header (Minimal) */}
                    <header className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-center bg-gradient-to-b from-[#050505] to-transparent pointer-events-none">
                        <div className="pointer-events-auto pl-4">
                            <h1 className="text-xl font-bold tracking-tight text-white/50">{activeTab.toUpperCase()}</h1>
                        </div>
                        <div className="flex gap-4 pointer-events-auto pr-4">
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                <span className={`w-1.5 h-1.5 rounded-full ${pulse % 2 === 0 ? 'bg-green-500' : 'bg-green-900'} transition-colors duration-500`}></span>
                                On Air
                            </div>
                        </div>
                    </header>

                    {/* Chat Container - Full Height */}
                    <div className="flex-1 w-full h-full relative z-10">
                        <ChatInterface activeMode={generationMode} onModeChange={handleModeChange} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AnuuDashboardV2;
