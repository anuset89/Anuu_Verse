
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { AnuuStrategy } from '../engine/calculator';
import { getTranslatedName } from '../engine/calculator';

export const OracleCommandZone = ({ strategy, onExecute, isEng, materials }: {
    strategy: AnuuStrategy | null,
    onExecute: (s: AnuuStrategy) => void,
    isEng: boolean,
    materials: Record<number, { total: number }>
}) => {
    if (!strategy) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-10"
        >
            <div className="relative group p-px rounded-[20px] overflow-hidden bg-white/5 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                {/* Background effect */}
                <div className="absolute inset-0 bg-[#0A0A0E]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-8 h-full">
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        {/* Icon Box */}
                        <div className="shrink-0 w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-shadow">
                            <Sparkles size={32} />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase font-display leading-none">
                                    {isEng ? 'ORACLE RECOMMENDATION' : 'RECOMENDACIÓN DEL ORÁCULO'}
                                </h2>
                            </div>
                            <p className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] font-display">
                                {isEng ? 'OPTIMIZED FOR YOUR CURRENT WALLET' : 'OPTIMIZADO PARA TU CARTERA ACTUAL'}
                            </p>

                            <div className="flex items-center gap-3 mt-4">
                                <div className="flex items-center gap-3 bg-indigo-500/5 border border-indigo-500/10 rounded-full pl-3 pr-4 py-1.5 transition-all group-hover:border-indigo-500/30">
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                                        {getTranslatedName(strategy.targetId, strategy.name, isEng)}
                                    </span>
                                    <span className="w-1 h-1 bg-indigo-500/40 rounded-full"></span>
                                    <span className="text-[10px] font-black text-emerald-400 tracking-tighter uppercase whitespace-nowrap">
                                        ROI: +{strategy.roi.toFixed(1)}%
                                    </span>
                                </div>
                                {(materials[strategy.sourceId]?.total || 0) > 0 && (
                                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                                            {isEng ? 'Owned Material' : 'En Inventario'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onExecute(strategy)}
                        className="w-full lg:w-auto px-10 py-5 bg-white text-black rounded-[18px] flex items-center justify-center gap-4 group/btn shadow-[0_20px_40px_rgba(255,255,255,0.05)] transition-all"
                    >
                        <span className="text-[13px] font-black uppercase tracking-[0.2em] font-display">
                            {isEng ? 'EXECUTE OPERATION' : 'EJECUTAR OPERACIÓN'}
                        </span>
                        <ArrowRight size={20} className="group-hover/btn:translate-x-1.5 transition-transform" />
                    </motion.button>
                </div>
            </div>

            {/* Subtle light bar at bottom */}
            <div className="h-0.5 mx-auto w-[60%] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        </motion.div>
    );
};
