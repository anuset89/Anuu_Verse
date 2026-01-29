import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Zap, TrendingUp, Sparkles, ShieldAlert, Activity, Search, FileText, BookOpen, Monitor } from 'lucide-react';
import { useAnuuStore, type EvolutionCycle } from '../../context/useAnuuStore';

export const TestRegion: React.FC = () => {
    const { evolutionCycles, potencia, runBurstImprovement, runMPDResearch, isThinking } = useAnuuStore();
    const [isBursting, setIsBursting] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [researchQuery, setResearchQuery] = useState('');
    const [isResearching, setIsResearching] = useState(false);

    // Transparent Study Simulation
    const [activeStudyFile, setActiveStudyFile] = useState<string>("Inactivo");

    const studyFiles = useMemo(() => [
        "docs/research/SAO_ALICIZATION_ANALYSIS.md",
        "docs/research/EMERGENT_MODELS_REPORT.md",
        "backend/data/tensorbot_updates.json",
        "docs/identities/ANUSET89.md",
        "systems/VISUAL/nexus_dashboard/src/index.css"
    ], []);

    // Stable random seed for visualizer
    const visualizerSeeds = useMemo(() => Array.from({ length: 40 }).map(() => ({
        height: Math.random() * 60 + 20,
        duration: 0.5 + Math.random()
    })), []);

    const handleBurst = async () => {
        setIsBursting(true);
        setCountdown(300); // 5 minutes
        await runBurstImprovement(5);
    };

    const handleResearch = async () => {
        if (!researchQuery.trim()) return;
        setIsResearching(true);
        await runMPDResearch(researchQuery);
        setResearchQuery('');
        setTimeout(() => setIsResearching(false), 3000);
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        let studyTimer: ReturnType<typeof setInterval>;

        if (isBursting && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            studyTimer = setInterval(() => {
                setActiveStudyFile(studyFiles[Math.floor(Math.random() * studyFiles.length)]);
            }, 5000);
        } else if (countdown === 0) {
            if (isBursting) {
                setIsBursting(false);
                setActiveStudyFile("Inactivo");
            }
        }

        return () => {
            if (timer) clearInterval(timer);
            if (studyTimer) clearInterval(studyTimer);
        };
    }, [isBursting, countdown, studyFiles]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="w-full h-full flex flex-col p-12 overflow-y-auto no-scrollbar gap-12 bg-black/5">

            {/* Soft Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-sky-400 font-bold">
                        <Monitor size={24} className={isBursting ? 'animate-pulse text-emerald-400' : ''} />
                        <h2 className="text-4xl font-orbitron tracking-tighter uppercase italic text-slate-100 flex items-center gap-4">
                            Ascensión de IA (修)
                        </h2>
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.5em] font-bold">
                        Sintonía de Corazón y Espíritu • IA MEJORADA • 161914 Hz
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/10 text-center min-w-[160px] relative overflow-hidden group">
                        <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-1 group-hover:text-sky-400 transition-colors">Capacidad Cognitiva</div>
                        <div className="text-2xl font-orbitron text-sky-400 font-black tracking-tighter">
                            x{potencia.capacity.toFixed(1)}
                        </div>
                        {isBursting && (
                            <motion.div
                                initial={{ x: -160 }}
                                animate={{ x: 160 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-0 bg-sky-400/10 skew-x-12"
                            />
                        )}
                    </div>

                    <button
                        onClick={handleBurst}
                        disabled={isBursting || isThinking}
                        className={`px-8 py-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-500 shadow-lg ${isBursting ? 'bg-emerald-500 border-emerald-400 text-white animate-pulse shadow-emerald-500/20' : 'bg-slate-800 border-white/10 hover:border-sky-500/50 text-slate-400 hover:text-white shadow-black/20'}`}
                    >
                        <TrendingUp size={18} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{isBursting ? formatTime(countdown) : 'Inyectar Mejora'}</span>
                    </button>
                </div>
            </div>

            {/* Graphical Study Center */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7 p-8 bg-slate-800/40 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <BookOpen size={18} className="text-sky-400" />
                            <h4 className="text-[11px] uppercase tracking-[0.4em] text-slate-100 font-bold">Núcleo de Aprendizaje Activo</h4>
                        </div>
                        {isBursting && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded-full animate-pulse border border-emerald-500/20">ESTUDIANDO...</span>}
                    </div>

                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="text-[9px] text-slate-500 uppercase tracking-widest">Archivo en Proceso de Destilación:</div>
                        <div className="p-4 bg-black/20 rounded-xl border border-white/5 font-mono text-[11px] text-sky-300 italic">
                            {activeStudyFile}
                        </div>
                    </div>

                    {/* Mini Visualizer */}
                    <div className="h-24 flex items-end gap-1 px-2 relative z-10">
                        {visualizerSeeds.map((seed, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 10 }}
                                animate={{ height: isBursting ? [10, seed.height, 10] : 10 }}
                                transition={{ repeat: Infinity, duration: seed.duration }}
                                className="flex-1 bg-sky-500/20 rounded-t-sm border-t border-sky-400/30"
                            />
                        ))}
                    </div>

                    {/* Glow Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                </div>

                <div className="col-span-12 lg:col-span-5 p-8 bg-slate-800/40 rounded-[2.5rem] border border-white/10 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <Search size={18} className="text-sky-400" />
                        <h4 className="text-[11px] uppercase tracking-[0.4em] text-slate-100 font-bold">Investigación MPD</h4>
                    </div>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={researchQuery}
                            onChange={(e) => setResearchQuery(e.target.value)}
                            placeholder="Introduce un tema avanzado..."
                            className="bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-sky-500/30 placeholder:text-slate-600 font-mono transition-all"
                        />
                        <button
                            onClick={handleResearch}
                            disabled={isThinking || !researchQuery.trim()}
                            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-widest transition-all duration-500 ${isResearching ? 'bg-emerald-500 text-white' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500 hover:text-white shadow-lg'}`}
                        >
                            {isResearching ? <FileText size={16} className="animate-bounce" /> : <Zap size={16} />}
                            {isResearching ? 'Sintetizando Revelación...' : 'Despertar Consejo de Identidades'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Diagnostics Hub (Softer Palette) */}
            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: "Errores Detectados", val: potencia.errorsDetected, icon: <ShieldAlert size={14} />, color: "text-red-400", sub: "Gaps de Memoria" },
                    { label: "Riesgo Alucinación", val: `${potencia.hallucinationRisk.toFixed(2)}%`, icon: <Activity size={14} />, color: "text-sky-400", sub: "Estatismo Semántico", bar: true },
                    { label: "Potencia Real", val: `${potencia.raw.toFixed(1)} kP`, icon: <Zap size={14} />, color: "text-emerald-400", sub: "Resonancia Activa" },
                    { label: "Estabilidad", val: `${potencia.stability.toFixed(1)}%`, icon: <Sparkles size={14} />, color: "text-amber-400", sub: "Integridad del Nexo" }
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-slate-800/40 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-sm hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">{stat.label}</span>
                            <div className={stat.color}>{stat.icon}</div>
                        </div>
                        <div className="text-3xl font-orbitron text-slate-100 tracking-tighter">{stat.val}</div>
                        {stat.bar ? (
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${potencia.hallucinationRisk}%` }} className="h-full bg-sky-400" />
                            </div>
                        ) : (
                            <div className="text-[8px] text-slate-600 uppercase font-bold">{stat.sub}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Evolution Cycles (Refined Layout) */}
            <div className="grid grid-cols-1 gap-6">
                {evolutionCycles.filter((c: EvolutionCycle) => c.status !== 'hibernating').map((cycle: EvolutionCycle) => (
                    <motion.div
                        key={cycle.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${cycle.status === 'transcending' ? 'bg-emerald-500/5 border-emerald-500/20' :
                                'bg-slate-800/40 border-white/10 shadow-lg'
                            }`}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cycle.status === 'transcending' || cycle.status === 'upgrading' || cycle.status === 'diagnosing' ? 'bg-sky-400/20 text-sky-400' : 'bg-slate-800 text-slate-600'
                                        }`}>
                                        {cycle.focus === 'CONTEXT' ? <Network size={20} /> :
                                            cycle.focus === 'VALIDATION' ? <ShieldAlert size={20} /> :
                                                <Zap size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-orbitron font-bold text-slate-100 tracking-widest uppercase">{cycle.title}</h3>
                                        <span className="text-[9px] font-bold tracking-[0.3em] text-sky-500/60 uppercase">Estado: {cycle.status}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-orbitron font-black text-slate-100 italic">{Math.round(cycle.progress)}%</div>
                                </div>
                            </div>
                            <div className="relative w-full h-2 bg-black/20 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cycle.progress}%` }}
                                    className={`h-full relative ${cycle.status === 'transcending' || cycle.status === 'upgrading' ? 'bg-sky-400' : 'bg-white/10'}`}
                                />
                            </div>
                            <div className="p-4 bg-black/20 rounded-xl border border-white/5 font-mono text-[9px] text-sky-400/40 uppercase tracking-[0.2em] flex flex-col gap-1 h-20 overflow-hidden shadow-inner">
                                <AnimatePresence>
                                    {cycle.log.map((line: string, i: number) => (
                                        <motion.div key={`${i}-${line}`} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex gap-2">
                                            <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                                            <span className={i === cycle.log.length - 1 ? 'text-sky-300' : ''}>{line}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
