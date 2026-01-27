import React from 'react';
import { useAnuuStore } from '../../context/useAnuuStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Starfield } from './Starfield';
import { MessageSquare, Image as ImageIcon, Video as VideoIcon, Activity, Wand2, History, BookOpen, User, Heart } from 'lucide-react';

interface NexusShellProps {
    sidebar: React.ReactNode;
    main: React.ReactNode;
    feed: React.ReactNode;
}

export const NexusShell: React.FC<NexusShellProps> = ({ sidebar, main, feed }) => {
    const { manifestations, mode, setMode, activeNode, setActiveNode } = useAnuuStore();
    const latestMedia = manifestations.length > 0 ? manifestations[0] : null;

    return (
        <div className="relative flex h-screen w-full bg-[var(--color-void)] text-white overflow-hidden font-rajdhani selection:bg-[var(--color-accent)]/20 transition-colors duration-700">
            <Starfield />

            {/* Main Shell Layout */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 flex w-full h-full max-w-[1600px] mx-auto p-4 gap-4"
            >
                {/* 1. Universal Sidebar (Left) */}
                <aside className="w-[320px] h-full flex flex-col gap-4">
                    <section className="bg-[var(--color-stellar-card)]/50 border border-[var(--color-stellar-border)] rounded-[1.8rem] p-6 backdrop-blur-xl flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl font-orbitron font-bold tracking-tighter">ANUU NEXUS</h1>
                            <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase font-bold">Resonancia v0.17.0</p>
                        </div>

                        {/* Navigation Nodes */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2">Nodos de Consciencia</h3>
                            <div className="grid grid-cols-1 gap-1.5">
                                <button onClick={() => setActiveNode('feed')} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeNode === 'feed' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'hover:bg-white/5 text-gray-400'}`}>
                                    <MessageSquare size={16} /> <span className="text-[11px] font-bold uppercase tracking-wider">Oracle Stream</span>
                                </button>
                                <button onClick={() => setActiveNode('saga')} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeNode === 'saga' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'hover:bg-white/5 text-gray-400'}`}>
                                    <History size={16} /> <span className="text-[11px] font-bold uppercase tracking-wider">Saga Engine</span>
                                </button>
                                <button onClick={() => setActiveNode('tests')} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeNode === 'tests' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' : 'hover:bg-white/5 text-gray-400'}`}>
                                    <Heart size={16} /> <span className="text-[11px] font-bold uppercase tracking-wider">Cultivo (修)</span>
                                </button>
                                <button onClick={() => setActiveNode('wiki')} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeNode === 'wiki' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'hover:bg-white/5 text-gray-400'}`}>
                                    <BookOpen size={16} /> <span className="text-[11px] font-bold uppercase tracking-wider">Lore Wiki</span>
                                </button>
                                <button onClick={() => setActiveNode('vrm')} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${activeNode === 'vrm' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' : 'hover:bg-white/5 text-gray-400'}`}>
                                    <User size={16} /> <span className="text-[11px] font-bold uppercase tracking-wider">Avatar VRM</span>
                                </button>
                            </div>
                        </div>

                        {/* Status Matrix */}
                        <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2">Protocolo 161914</h3>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="opacity-50 text-gray-400 uppercase tracking-wider font-bold">Sintonía</span>
                                    <span className="text-[var(--color-accent)] font-bold font-orbitron">ESTABLE</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div animate={{ width: ["10%", "90%", "10%"] }} transition={{ duration: 10, repeat: Infinity }} className="h-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Matrix Preview */}
                    <section className="flex-1 bg-[var(--color-stellar-card)]/30 border border-white/5 rounded-[1.8rem] p-6 backdrop-blur-md overflow-hidden flex flex-col">
                        <h3 className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 font-bold">Manifestación Directa</h3>
                        <div className="flex-1 rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative group">
                            <AnimatePresence mode="wait">
                                {latestMedia ? (
                                    <motion.div key={latestMedia.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                                        {latestMedia.type === 'video' ? (
                                            <video src={latestMedia.content} autoPlay loop muted className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={latestMedia.content} className="w-full h-full object-cover" />
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-700 gap-3">
                                        <Activity size={32} className="opacity-10 animate-pulse" />
                                        <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-gray-600">Escuchando el Vacío</span>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>
                </aside>

                {/* 2. Core Workspace (Center) */}
                <main className="flex-1 h-full flex flex-col bg-[var(--color-stellar-card)]/40 border border-[var(--color-stellar-border)] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-2xl">
                    <div className="flex-1 overflow-hidden">
                        {activeNode === 'feed' ? main : sidebar}
                    </div>
                </main>

                {/* 3. Chronicle & Controls (Right) */}
                <section className="w-[340px] h-full flex flex-col gap-4">
                    {/* Mode Selector (Quick Access) */}
                    <div className="bg-[var(--color-stellar-card)]/30 border border-white/5 rounded-[1.8rem] p-4 backdrop-blur-md">
                        <div className="grid grid-cols-4 gap-1.5">
                            {[
                                { id: 'chat', icon: <MessageSquare size={16} />, color: 'var(--color-accent)' },
                                { id: 'imagine', icon: <ImageIcon size={16} />, color: '#ec4899' },
                                { id: 'vid', icon: <VideoIcon size={16} />, color: '#a855f7' },
                                { id: 'upgrade', icon: <Wand2 size={16} />, color: '#f59e0b' },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setMode(item.id as any)}
                                    className={`p-3 rounded-xl transition-all flex items-center justify-center ${mode === item.id ? 'bg-white/10 shadow-inner' : 'bg-white/2 hover:bg-white/5 text-gray-600'}`}
                                    style={{ color: mode === item.id ? item.color : '' }}
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chronicle Feed */}
                    <div className="flex-1 bg-black/20 border border-white/5 rounded-[1.8rem] p-6 backdrop-blur-md flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Feed de Crónicas</h3>
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {feed}
                        </div>
                    </div>
                </section>

            </motion.div>
        </div>
    );
};
