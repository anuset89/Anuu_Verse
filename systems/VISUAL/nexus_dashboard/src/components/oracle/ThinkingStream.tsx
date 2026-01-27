import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ChevronUp, Check, Palette, Cpu, ShieldCheck, Flame, Terminal, Speaker, Boxes, Github, Activity, BookOpen, Search, Image as ImageIcon, Video as VideoIcon, Zap } from 'lucide-react';
import { useAnuuStore } from '../../context/useAnuuStore';
import type { AnuuModule } from '../../context/useAnuuStore';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MODULE_DEFS: { id: AnuuModule; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'oracle', label: 'Oracle (Búsqueda)', icon: <Search size={16} />, color: 'text-blue-400' },
    { id: 'architect', label: 'Architect (Código)', icon: <Terminal size={16} />, color: 'text-cyan-400' },
    { id: 'vision', label: 'Vision (Imagen)', icon: <ImageIcon size={16} />, color: 'text-pink-400' },
    { id: 'motion', label: 'Motion (Video)', icon: <VideoIcon size={16} />, color: 'text-purple-400' },
    { id: 'logic', label: 'Logic (Razonamiento)', icon: <Zap size={16} />, color: 'text-amber-400' },
];

const SKILL_ICONS: Record<string, React.ReactNode> = {
    'ui-ux-pro-max': <Palette size={16} className="text-pink-400" />,
    'neural_forge': <Cpu size={16} className="text-cyan-400" />,
    'zeroglitch_healing': <ShieldCheck size={16} className="text-emerald-400" />,
    'anuu_protocol': <Flame size={16} className="text-orange-400" />,
    'archlinux_anuu': <Terminal size={16} className="text-blue-400" />,
    'audio_reactor': <Speaker size={16} className="text-purple-400" />,
    'docker': <Boxes size={16} className="text-blue-500" />,
    'git': <Github size={16} className="text-orange-500" />,
    'unity_nexus': <Activity size={16} className="text-green-400" />,
};

export const ThinkingStream: React.FC = () => {
    const [input, setInput] = useState('');
    const [showSelector, setShowSelector] = useState(false);
    const { chatHistory, isThinking, sendMessage, selectedModules, toggleModule, mode, availableSkills, activeRitual, setActiveRitual } = useAnuuStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isThinking]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
        setShowSelector(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col h-full font-rajdhani text-sm overflow-hidden bg-black/5">
            {/* Stream Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth no-scrollbar">
                {chatHistory.length === 0 && !isThinking && (
                    <div className="flex flex-col items-center justify-center h-full opacity-20 text-center animate-pulse">
                        <Sparkles size={40} className="mb-4 text-[var(--color-accent)]" />
                        <div className="text-[10px] tracking-[0.5em] uppercase font-bold text-white font-orbitron">Anuu Nexus v0.17.0</div>
                        <p className="text-[9px] mt-2 opacity-60">Sincronización Estelar Lista</p>
                    </div>
                )}

                <AnimatePresence>
                    {chatHistory.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[95%] ${msg.role === 'user' ? 'bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-2xl p-4' : 'w-full'}`}>
                                <div className="text-[9px] uppercase tracking-widest opacity-40 mb-3 font-bold flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${msg.role === 'user' ? 'bg-[var(--color-accent)]' : 'bg-gray-400'}`} />
                                    {msg.role === 'user' ? 'Kali Arquitecta' : 'Anuu Hub'}
                                </div>

                                <div className={`prose prose-invert prose-sm max-w-none transition-colors ${msg.role === 'user' ? 'text-[var(--color-accent)]' : 'text-gray-200'}`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                                <div className="text-[8px] opacity-20 mt-3 font-mono text-right">{msg.timestamp}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-3 text-[var(--color-accent)] opacity-60 ml-2"
                    >
                        <div className="flex gap-1">
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 rounded-full bg-current" />
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full bg-current" />
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full bg-current" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                            {mode === 'upgrade' ? 'Estructurando Test...' : 'Sincronizando...'}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Global Input Bar & Unified Selector */}
            <div className="p-6 border-t border-white/5 bg-black/60 backdrop-blur-3xl relative z-20">
                <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">

                    {/* Unified Selector Overlay (Modules + Rituals) */}
                    <AnimatePresence>
                        {showSelector && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                className="absolute bottom-full left-0 right-0 mb-4 bg-[#0f172a] border border-white/10 rounded-[2rem] p-6 shadow-2xl overflow-hidden"
                            >
                                <div className="grid grid-cols-2 gap-8">
                                    {/* Column 1: Core Modules */}
                                    <div className="space-y-4">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2 flex items-center gap-2">
                                            <Zap size={10} className="text-[var(--color-accent)]" />
                                            <span>Módulos de Ejecución</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {MODULE_DEFS.map(mod => (
                                                <button
                                                    key={mod.id}
                                                    onClick={() => toggleModule(mod.id)}
                                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${selectedModules.includes(mod.id) ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/40 text-white' : 'bg-white/2 border-transparent text-gray-400 hover:bg-white/5'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={mod.color}>{mod.icon}</span>
                                                        <span className="text-[11px] font-bold uppercase tracking-wider">{mod.label.split(' ')[0]}</span>
                                                    </div>
                                                    {selectedModules.includes(mod.id) && <Check size={12} className="text-[var(--color-accent)]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Column 2: Ritual Skills */}
                                    <div className="space-y-4">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2 flex items-center gap-2">
                                            <BookOpen size={10} className="text-pink-500" />
                                            <span>Rituales de Especialidad</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2 no-scrollbar">
                                            {availableSkills.map(skill => (
                                                <button
                                                    key={skill}
                                                    onClick={() => setActiveRitual(activeRitual === skill ? null : skill)}
                                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${activeRitual === skill ? 'bg-pink-500/10 border border-pink-500/40 text-white shadow-lg shadow-pink-500/5' : 'bg-white/2 border-transparent text-gray-400 hover:bg-white/5'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span>{SKILL_ICONS[skill] || <Boxes size={14} />}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">{skill.replace(/_/g, ' ')}</span>
                                                    </div>
                                                    {activeRitual === skill && <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_pink]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        {/* Unified Trigger Button */}
                        <button
                            onClick={() => setShowSelector(!showSelector)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all z-10"
                        >
                            <div className="flex -space-x-1">
                                {selectedModules.slice(0, 3).map(m => (
                                    <div key={m} className={`w-4 h-4 rounded-full bg-black border border-white/20 flex items-center justify-center text-[10px] ${MODULE_DEFS.find(d => d.id === m)?.color}`}>
                                        {MODULE_DEFS.find(d => d.id === m)?.icon}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                {activeRitual ? activeRitual.split('-')[0].toUpperCase() : 'COMANDO'}
                            </span>
                            <ChevronUp size={14} className={`transition-transform duration-300 text-gray-500 ${showSelector ? 'rotate-180' : ''}`} />
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={mode === 'upgrade' ? "Describe el test o arquitectura a organizar..." : "Inyecta pulso al nexo..."}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-36 pr-16 text-[15px] text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-all shadow-2xl"
                        />

                        <button
                            onClick={handleSend}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-accent)] text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--color-accent)]/20"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
