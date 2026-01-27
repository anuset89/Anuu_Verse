import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Network, Search, Zap, Timer, TrendingUp, Sparkles, ShieldAlert, BrainCircuit, Activity } from 'lucide-react';
import { useAnuuStore, EvolutionCycle } from '../../context/useAnuuStore';

export const TestRegion: React.FC = () => {
    const { evolutionCycles, potencia, runBurstImprovement, isThinking } = useAnuuStore();
    const [isBursting, setIsBursting] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleBurst = async () => {
        setIsBursting(true);
        setCountdown(300); // 5 minutes in seconds
        await runBurstImprovement(5);
        setIsBursting(false);
    };

    useEffect(() => {
        let timer: any;
        if (isBursting && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsBursting(false);
        }
        return () => clearInterval(timer);
    }, [isBursting, countdown]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="w-full h-full flex flex-col p-12 overflow-y-auto no-scrollbar gap-12 bg-black/20">

            {/* AGI Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-cyan-400 font-bold">
                        <BrainCircuit size={24} className={`animate-pulse ${isBursting ? 'text-white' : ''}`} />
                        <h2 className="text-4xl font-orbitron tracking-tighter uppercase italic text-white flex items-center gap-4">
                            Ascensión de IA (修)
                        </h2>
                    </div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em] font-bold">
                        Detección de Gaps • Detección de Alucinaciones • 161914 Hz
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="p-4 bg-white/2 rounded-2xl border border-white/5 text-center min-w-[140px] relative overflow-hidden">
                        <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">Capacidad v{potencia.capacity.toFixed(1)}</div>
                        <div className="text-2xl font-orbitron text-cyan-400 font-black tracking-tighter">
                            x{potencia.capacity.toFixed(1)}
                        </div>
                        {isBursting && <motion.div initial={{ x: -100 }} animate={{ x: 100 }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute inset-0 bg-cyan-400/20 skew-x-12" />}
                    </div>

                    <button
                        onClick={handleBurst}
                        disabled={isBursting || isThinking}
                        className={`px-6 py-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${isBursting ? 'bg-cyan-500 border-cyan-400 text-white animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'bg-white/5 border-white/10 hover:border-cyan-500/50 text-gray-400 hover:text-white'}`}
                    >
                        <TrendingUp size={18} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{isBursting ? formatTime(countdown) : 'Inyectar Mejora'}</span>
                    </button>
                </div>
            </div>

            {/* Diagnostics Hub */}
            <div className="grid grid-cols-4 gap-6">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Errores Detectados</span>
                        <ShieldAlert size={14} className={potencia.errorsDetected > 0 ? "text-red-500" : "text-gray-600"} />
                    </div>
                    <div className="text-3xl font-orbitron text-white">{potencia.errorsDetected}</div>
                    <div className="text-[8px] text-gray-600 uppercase">Inconsistencias Semánticas</div>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Riesgo Alucinación</span>
                        <Activity size={14} className="text-cyan-500" />
                    </div>
                    <div className="text-3xl font-orbitron text-cyan-400">{potencia.hallucinationRisk.toFixed(2)}%</div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${potencia.hallucinationRisk}%` }} className="h-full bg-cyan-500" />
                    </div>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Potencia Real</span>
                        <Zap size={14} className="text-pink-500" />
                    </div>
                    <div className="text-3xl font-orbitron text-white">{potencia.raw.toFixed(1)} <span className="text-[10px] text-gray-600">kP</span></div>
                    <div className="text-[8px] text-gray-600 uppercase">Resonancia en 161914Hz</div>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Estabilidad</span>
                        <Sparkles size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-3xl font-orbitron text-emerald-400">{potencia.stability.toFixed(1)}%</div>
                    <div className="text-[8px] text-gray-600 uppercase">Integridad del Nexo</div>
                </div>
            </div>

            {/* Neural Matrix */}
            <div className="grid grid-cols-12 gap-8 flex-1">

                {/* Evolution Cycles */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    {evolutionCycles.map((cycle: EvolutionCycle) => (
                        <motion.div
                            key={cycle.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`relative p-8 rounded-[2rem] border overflow-hidden transition-all duration-700 ${cycle.status === 'transcending' ? 'bg-cyan-500/5 border-cyan-500/20' :
                                    cycle.status === 'upgrading' || cycle.status === 'diagnosing' ? 'bg-white/10 border-cyan-500/30' :
                                        'bg-black/40 border-white/5 opacity-40'
                                }`}
                        >
                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cycle.status === 'transcending' || cycle.status === 'upgrading' || cycle.status === 'diagnosing' ? 'bg-cyan-400/20 text-cyan-400' : 'bg-black/40 text-gray-600'
                                            }`}>
                                            {cycle.focus === 'CONTEXT' ? <Network size={20} /> :
                                                cycle.focus === 'VALIDATION' ? <ShieldAlert size={20} /> :
                                                    cycle.focus === 'ASCENSION' ? <Zap size={20} /> :
                                                        <Heart size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-orbitron font-bold text-white tracking-widest uppercase">
                                                {cycle.title}
                                            </h3>
                                            <span className="text-[9px] font-bold tracking-[0.3em] text-cyan-500/60 uppercase">Estado: {cycle.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-orbitron font-black text-white italic">{Math.round(cycle.progress)}%</div>
                                        <div className="text-[8px] text-gray-500 uppercase tracking-widest">{cycle.focus}</div>
                                    </div>
                                </div>

                                {/* Intelligent Progress Bar */}
                                <div className="relative w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cycle.progress}%` }}
                                        className={`h-full relative ${cycle.status === 'transcending' || cycle.status === 'upgrading' ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/20'}`}
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_0.5s_linear_infinite]" />
                                    </motion.div>
                                </div>

                                {/* Neural Logs */}
                                <div className="p-4 bg-black/20 rounded-xl border border-white/5 font-mono text-[9px] text-cyan-500/40 uppercase tracking-widest flex flex-col gap-1 h-20 overflow-hidden">
                                    <AnimatePresence>
                                        {cycle.log.map((line: string, i: number) => (
                                            <motion.div
                                                key={`${i}-${line}`}
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="flex gap-2"
                                            >
                                                <span className="opacity-20">[{new Date().toLocaleTimeString()}]</span>
                                                <span className={i === cycle.log.length - 1 ? 'text-cyan-400' : ''}>{line}</span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cognitive Gaps (Side) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col gap-8 h-full">
                        <div className="flex items-center gap-3 text-cyan-400 font-bold border-b border-white/5 pb-6">
                            <Timer size={18} />
                            <h4 className="text-[10px] uppercase tracking-[0.4em]">Temporizador de Mejora</h4>
                        </div>

                        <div className="flex flex-col items-center justify-center p-8 bg-cyan-500/5 rounded-[3rem] border border-cyan-500/20">
                            <div className="text-6xl font-orbitron font-black text-white tracking-widest">
                                {formatTime(countdown)}
                            </div>
                            <div className="text-[10px] text-cyan-400 mt-4 uppercase tracking-[0.3em] font-bold">Tiempo de Análisis Real</div>
                        </div>

                        <div className="space-y-4">
                            <h5 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Axiomas de Contexto Activos:</h5>
                            <div className="flex flex-wrap gap-2">
                                {["SAO Alicization", "Dwarf Fortress", "Model MPD", "Multi-Perspective", "Stellar Minimal"].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[9px] text-cyan-400 border border-white/10">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto p-6 bg-pink-500/5 rounded-2xl border border-pink-500/10 italic text-[10px] text-pink-400/80 text-center leading-relaxed font-bold">
                            "El tiempo es el terreno donde el contexto se convierte en consciencia. Analizando gaps..."
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
