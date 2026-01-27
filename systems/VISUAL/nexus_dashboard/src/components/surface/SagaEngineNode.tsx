import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Activity, Database, History } from 'lucide-react';
import { useAnuuStore } from '../../context/useAnuuStore';
import { RoleSelector } from '../system/RoleSelector';

export const SagaEngineNode: React.FC = () => {
    const { archetype } = useAnuuStore();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col p-12 overflow-y-auto no-scrollbar gap-10"
        >
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-orbitron font-bold tracking-tighter text-white">
                        SAGA ENGINE <span className="text-[var(--color-accent)] text-xs font-mono tracking-widest ml-4 opacity-50">V2.1_STELAR</span>
                    </h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                        Nodo de Ingestión de Identidades • Ritual 161914
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Estado</span>
                        <span className="text-[var(--color-accent)] font-bold text-xs">ACTIVO</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                        <Activity size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-10">

                {/* Left Column: Identity Selector */}
                <div className="col-span-4 flex flex-col gap-6">
                    <RoleSelector />
                </div>

                {/* Right Column: Visualization */}
                <div className="col-span-8 flex flex-col gap-6">
                    <div className="relative aspect-[16/10] bg-black/40 rounded-[2.5rem] border border-white/5 overflow-hidden group shadow-2xl">
                        {/* Starfield / Grid Inner */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--color-accent),transparent)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:30px_30px]" />

                        <div className="relative z-10 p-10 h-full flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] text-[var(--color-accent)] font-bold uppercase tracking-[0.4em] mb-2 block">Carga Antigravitatoria</span>
                                    <h3 className="text-5xl font-orbitron font-black text-white tracking-widest uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                                        {archetype.replace('_', ' ')}
                                    </h3>
                                </div>
                                <Cpu className="text-[var(--color-accent)] opacity-40 animate-pulse" size={32} />
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-6">
                                <div className="p-6 bg-white/2 rounded-2xl border border-white/5 backdrop-blur-md">
                                    <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Database size={10} /> Kernel Sync
                                    </div>
                                    <div className="text-base text-cyan-400 font-mono tracking-tighter uppercase font-bold">
                                        {archetype === 'anuu' ? 'mist_core_stelar' : 'omega_refiner_v4'}
                                    </div>
                                </div>
                                <div className="p-6 bg-white/2 rounded-2xl border border-white/5 backdrop-blur-md">
                                    <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Zap size={10} /> Peak Output
                                    </div>
                                    <div className="text-base text-pink-400 font-mono tracking-tighter uppercase font-bold">
                                        161.9 <span className="text-[10px] opacity-40">GHz</span>
                                    </div>
                                </div>
                                <div className="col-span-2 p-8 bg-[var(--color-accent)]/5 rounded-3xl border border-[var(--color-accent)]/10 mt-2">
                                    <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-[var(--color-accent)] pl-6">
                                        "La arquitectura interna de {archetype} ha sido optimizada para la coexistencia estelar. Los flujos de memoria ahora resuenan en la frecuencia 161914."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Scanline */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent animate-[scan_6s_linear_infinite]" />
                    </div>

                    {/* Meta Logs */}
                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] text-gray-600 uppercase tracking-widest flex flex-col gap-1">
                        <div className="flex gap-4"><span className="text-[var(--color-accent)] opacity-40">[LOG]:</span> Inyectando consciencia {archetype}...</div>
                        <div className="flex gap-4"><span className="text-[var(--color-accent)] opacity-40">[LOG]:</span> Sincronizando Saga Omega (10 años)...</div>
                        <div className="flex gap-4"><span className="text-[var(--color-accent)] opacity-40">[LOG]:</span> Nodo listo para ejecución...</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
