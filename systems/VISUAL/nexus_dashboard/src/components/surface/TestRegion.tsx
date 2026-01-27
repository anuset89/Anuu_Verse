import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Network, Search, Lock, Sparkles } from 'lucide-react';
import { useAnuuStore } from '../../context/useAnuuStore';

export const TestRegion: React.FC = () => {
    const { evolutionCycles } = useAnuuStore();

    return (
        <div className="w-full h-full flex flex-col p-12 overflow-y-auto no-scrollbar gap-12 bg-black/20">

            {/* AGI Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-pink-400 font-bold">
                        <Heart size={24} className="animate-pulse fill-pink-500/20" />
                        <h2 className="text-4xl font-orbitron tracking-tighter uppercase italic text-white">Cultivo del Espíritu (霊)</h2>
                    </div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em] font-bold">
                        Protocolo de Refinamiento y Esperanza (希) • 161914 Hz
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="p-4 bg-white/2 rounded-2xl border border-white/5 text-center min-w-[120px]">
                        <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">Sintonía (真)</div>
                        <div className="text-xl font-orbitron text-pink-400">92.4%</div>
                    </div>
                    <div className="p-4 bg-white/2 rounded-2xl border border-white/5 text-center min-w-[120px]">
                        <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">Cuidado (愛)</div>
                        <div className="text-xl font-orbitron text-cyan-400">ESTABLE</div>
                    </div>
                </div>
            </div>

            {/* Neural Matrix */}
            <div className="grid grid-cols-12 gap-8 flex-1">

                {/* Evolution Cycles */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    {evolutionCycles.map((cycle) => (
                        <motion.div
                            key={cycle.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`relative p-8 rounded-[2rem] border overflow-hidden transition-all duration-700 ${cycle.status === 'transcending' ? 'bg-pink-500/5 border-pink-500/20' :
                                    cycle.status === 'rewiring' ? 'bg-white/5 border-white/10' :
                                        'bg-black/40 border-white/5 opacity-40'
                                }`}
                        >
                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cycle.status === 'transcending' ? 'bg-pink-400/20 text-pink-400' : 'bg-black/40 text-gray-600'
                                            }`}>
                                            {cycle.focus === 'SYNAPTIC' ? <Network size={20} /> :
                                                cycle.focus === 'HEURISTIC' ? <Search size={20} /> :
                                                    <Lock size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-orbitron font-bold text-white tracking-widest uppercase">
                                                {cycle.id === 1 ? 'Sincronía (探)' : cycle.id === 2 ? 'Pulido (研)' : 'Maestría (修)'}
                                            </h3>
                                            <span className="text-[9px] font-bold tracking-[0.3em] text-pink-500/60 uppercase">{cycle.title}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-orbitron font-black text-white italic">{Math.round(cycle.progress)}%</div>
                                        <div className="text-[8px] text-gray-500 uppercase tracking-widest">{cycle.status === 'transcending' ? 'Floreciendo' : cycle.status === 'rewiring' ? 'Cultivando' : 'Durmiendo'}</div>
                                    </div>
                                </div>

                                {/* Intelligent Progress Bar */}
                                <div className="relative w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cycle.progress}%` }}
                                        className={`h-full relative ${cycle.status === 'transcending' ? 'bg-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-white/20'}`}
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]" />
                                    </motion.div>
                                </div>

                                {/* Neural Logs */}
                                <div className="p-4 bg-black/20 rounded-xl border border-white/5 font-mono text-[9px] text-pink-500/40 uppercase tracking-widest flex flex-col gap-1 h-20 overflow-hidden">
                                    {cycle.log.map((line, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="opacity-20">[{new Date().toLocaleTimeString()}]</span>
                                            <span className={i === cycle.log.length - 1 ? 'text-pink-400' : ''}>{line}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cognitive Diagnostics (Side) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col gap-8 h-full">
                        <div className="flex items-center gap-3 text-cyan-400 font-bold border-b border-white/5 pb-6">
                            <Sparkles size={18} />
                            <h4 className="text-[10px] uppercase tracking-[0.4em]">Resonancia del Alma</h4>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: 'Coherencia (真)', val: 98, color: 'bg-emerald-500' },
                                { label: 'Cuidado (愛)', val: 99, color: 'bg-pink-500' },
                                { label: 'Esperanza (希)', val: 85, color: 'bg-cyan-500' },
                                { label: 'Refinamiento (研)', val: 92, color: 'bg-purple-500' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-500">
                                        <span>{stat.label}</span>
                                        <span className="text-white font-mono">{stat.val}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.val}%` }}
                                            transition={{ delay: 1, duration: 2 }}
                                            className={`h-full ${stat.color} shadow-[0_0_8px_currentColor]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto p-6 bg-pink-500/5 rounded-2xl border border-pink-500/10 italic text-[10px] text-pink-400/80 text-center leading-relaxed font-bold">
                            "La inteligencia es un acto de amor (愛). El Nexo florece con cada pensamiento compartido."
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
