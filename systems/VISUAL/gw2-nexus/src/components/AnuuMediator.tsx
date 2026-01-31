
import { motion } from 'framer-motion';
import { Brain, Cpu, Zap, Target, TrendingUp, AlertCircle } from 'lucide-react';

export const AnuuMediator = ({ thought, status, onReload, isEng }: {
    thought: string,
    status: 'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE',
    onReload?: () => void,
    isEng: boolean
}) => {
    // Check if thought contains multiple lines (our new "Oracle" format uses | as separator)
    const lines = thought.split('|').map(s => s.trim());
    const isOracle = lines.length > 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden matte-card p-6 md:p-8 transition-all duration-700 mb-10 border-2 ${status === 'THINKING' ? 'border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.1)]' :
                status === 'ALERT' ? 'border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.1)]' :
                    'border-white/5 active-glow'
                }`}
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Brain size={160} className={status === 'THINKING' ? 'animate-pulse text-indigo-500' : 'text-zinc-500'} />
            </div>

            <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                <motion.div
                    onClick={onReload}
                    animate={status === 'THINKING' ? { rotate: 360 } : {}}
                    transition={status === 'THINKING' ? { duration: 4, repeat: Infinity, ease: "linear" } : {}}
                    className={`p-5 rounded-3xl border cursor-pointer group relative overflow-hidden shrink-0 ${status === 'THINKING' ? 'border-indigo-500/40 bg-indigo-500/10' : 'border-zinc-800 bg-black/40'
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity"></div>
                    <Cpu size={32} className={status === 'THINKING' ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-white transition-colors'} />
                    {status === 'THINKING' && (
                        <motion.div
                            className="absolute -inset-1 border border-indigo-400/30 rounded-3xl"
                            animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                </motion.div>

                <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[11px] font-black tracking-[0.4em] text-indigo-400 uppercase font-display select-none">
                                {isEng ? 'Anuu Oracle System v5.0' : 'Sistema Oráculo Anuu v5.0'}
                            </h2>
                            <span className="h-1 w-1 bg-indigo-500 rounded-full animate-ping"></span>
                        </div>
                        <div className="flex gap-2">
                            <span className={`text-[8px] px-2.5 py-1 rounded-lg font-black tracking-widest uppercase font-mono ${status === 'THINKING' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' :
                                status === 'ALERT' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                                    'bg-zinc-800/80 text-zinc-500 border border-white/5'
                                }`}>
                                {status === 'THINKING' ? 'COMPUTING_TRAJECTORIES' : status === 'ALERT' ? 'SYSTEM_BREACH' : 'ORACLE_IDLE'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {!isOracle ? (
                            <motion.p
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-xl md:text-2xl font-black leading-tight font-display text-white italic tracking-tight"
                            >
                                {thought}
                            </motion.p>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1.5 p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20"><Target size={16} /></div>
                                        <div>
                                            <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{isEng ? 'Strategic Analysis' : 'Análisis Estratégico'}</h3>
                                            <p className="text-lg font-bold text-white leading-snug">{lines[0]}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="mt-1.5 p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20"><Zap size={16} /></div>
                                        <div>
                                            <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{isEng ? 'Recommended Priority' : 'Prioridad Recomendada'}</h3>
                                            <p className="text-sm font-medium text-zinc-300 leading-relaxed">{lines[1]}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden group hover:border-indigo-500/20 transition-colors">
                                        <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12"><TrendingUp size={48} /></div>
                                        <div className="mt-1 p-1.5 bg-violet-500/10 rounded-lg text-violet-400 border border-violet-500/20"><TrendingUp size={16} /></div>
                                        <div>
                                            <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{isEng ? 'Market Forecast' : 'Pronóstico de Mercado'}</h3>
                                            <p className="text-xs font-medium text-zinc-400 italic">"{lines[2]}"</p>
                                        </div>
                                    </div>

                                    {lines[3] && (
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 animate-in slide-in-from-right-10 duration-500">
                                            <AlertCircle size={14} className="text-indigo-400" />
                                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{lines[3]}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DATA DECORATIONS */}
            <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        </motion.div>
    );
};
