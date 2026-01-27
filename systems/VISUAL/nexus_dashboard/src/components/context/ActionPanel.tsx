import React from 'react';
import { Layers, Palette, History, LayoutGrid, BookOpen, User, Zap } from 'lucide-react';
import { useAnuuStore } from '../../context/useAnuuStore';

export const ActionPanel: React.FC = () => {
    const {
        theme, setTheme,
        mode, setMode,
        activeNode, setActiveNode
    } = useAnuuStore();

    return (
        <div className="h-full flex flex-col gap-8 font-rajdhani overflow-y-auto pr-1 no-scrollbar pt-2">

            {/* Manifestation Mode Selector */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[10px] text-pink-500 uppercase tracking-[0.2em] font-bold">
                    <Zap size={10} />
                    <span>Lógica de Nexo</span>
                </div>
                <div className="space-y-2">
                    {[
                        { id: 'chat', label: 'Scribe (Chat)', desc: 'Conversación fluida' },
                        { id: 'imagine', label: 'Vision (Imagen)', desc: 'Generación visual' },
                        { id: 'vid', label: 'Motion (Video)', desc: 'Animación dinámica' },
                        { id: 'upgrade', label: 'Refiner (Test)', desc: 'Organización & Tests' },
                    ].map(btn => (
                        <button
                            key={btn.id}
                            onClick={() => setMode(btn.id as any)}
                            className={`w-full flex flex-col items-start p-3 rounded-xl transition-all border ${mode === btn.id ? 'bg-pink-500/10 border-pink-500/30 text-white' : 'bg-white/2 border-transparent text-gray-500 hover:bg-white/5'}`}
                        >
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${mode === btn.id ? 'text-pink-400' : ''}`}>{btn.label}</span>
                            <span className="text-[9px] opacity-40 lowercase mt-0.5">{btn.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Node Navigator */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                    <Layers size={10} />
                    <span>Navegación de Nodos</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setActiveNode('feed')}
                        className={`flex items-center gap-2 p-3 rounded-xl text-[10px] transition-all border ${activeNode === 'feed' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/2 border-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <LayoutGrid size={12} />
                        Feed
                    </button>
                    <button
                        onClick={() => setActiveNode('saga')}
                        className={`flex items-center gap-2 p-3 rounded-xl text-[10px] transition-all border ${activeNode === 'saga' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-white/2 border-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <History size={12} />
                        Saga
                    </button>
                    <button
                        onClick={() => setActiveNode('wiki')}
                        className={`flex items-center gap-2 p-3 rounded-xl text-[10px] transition-all border ${activeNode === 'wiki' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-white/2 border-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <BookOpen size={12} />
                        Wiki
                    </button>
                    <button
                        onClick={() => setActiveNode('vrm')}
                        className={`flex items-center gap-2 p-3 rounded-xl text-[10px] transition-all border ${activeNode === 'vrm' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-white/2 border-transparent text-gray-400 hover:bg-white/5'}`}
                    >
                        <User size={12} />
                        VRM
                    </button>
                </div>
            </div>

            {/* Visual Frequency (Themes) */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[10px] text-cyan-500 uppercase tracking-[0.2em] font-bold">
                    <Palette size={10} />
                    <span>Sintonía Visual</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="bg-white/2 border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer hover:bg-white/5"
                    >
                        <option value="default">Original Anuu</option>
                        <option value="imperial">Imperial Gold</option>
                        <option value="cyberpunk">Cyberpunk Neon</option>
                        <option value="ethereal">Ethereal Static</option>
                        <option value="glitch">Glitch Protocol</option>
                    </select>
                </div>
            </div>

            {/* System Hardware Stats */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center group hover:border-[var(--color-accent)]/30 transition-all">
                        <div className="text-[8px] text-gray-600 uppercase tracking-widest font-bold">VRAM</div>
                        <div className="text-sm text-[var(--color-accent)] font-orbitron">12.4G</div>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-center group hover:border-pink-500/30 transition-all">
                        <div className="text-[8px] text-gray-600 uppercase tracking-widest font-bold">GPU</div>
                        <div className="text-sm text-pink-400 font-orbitron">98%</div>
                    </div>
                </div>
            </div>

        </div>
    );
};
