import React from 'react';
import { useAnuuStore } from '../../context/useAnuuStore';
import { SagaEngineNode } from './SagaEngineNode';
import { BookOpen, Sparkles, Layers } from 'lucide-react';

export const NodeRegion: React.FC = () => {
    const { activeNode, setActiveNode } = useAnuuStore();

    if (activeNode === 'saga') return <SagaEngineNode />;

    if (activeNode === 'wiki') return (
        <div className="w-full h-full flex flex-col items-center justify-center p-20 text-center">
            <BookOpen size={64} className="mb-8 text-amber-500 opacity-50 animate-pulse" />
            <h2 className="text-3xl font-orbitron tracking-[0.5em] uppercase mb-6 text-white">Lore Library</h2>
            <div className="max-w-md space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-widest">
                    Iniciando protocolo de indexación de sagas...
                </p>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-1/3 animate-shimmer" />
                </div>
            </div>
            <button
                onClick={() => setActiveNode('feed')}
                className="mt-12 px-8 py-3 bg-[var(--color-stellar-card)] border border-amber-500/20 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500 hover:bg-amber-500/10 transition-all"
            >
                Volver al Oracle
            </button>
        </div>
    );

    if (activeNode === 'vrm') return (
        <div className="w-full h-full flex flex-col items-center justify-center p-20 text-center">
            <div className="relative mb-12">
                <div className="w-48 h-48 rounded-full border-2 border-pink-500/20 flex items-center justify-center animate-spin-slow">
                    <div className="w-32 h-32 rounded-full border border-pink-500/40 flex items-center justify-center animate-spin-reverse">
                        <Layers size={32} className="text-pink-500" />
                    </div>
                </div>
                <div className="absolute inset-0 bg-pink-500/5 blur-3xl rounded-full" />
            </div>
            <h2 className="text-3xl font-orbitron tracking-[0.5em] uppercase mb-4 text-white">VRM Master Link</h2>
            <p className="text-[10px] text-pink-400 uppercase tracking-widest animate-pulse">Sincronización de Avatar pendiente...</p>

            <button
                onClick={() => setActiveNode('feed')}
                className="mt-12 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 hover:text-white transition-all"
            >
                Retorno al Oracle
            </button>
        </div>
    );

    return null;
};
