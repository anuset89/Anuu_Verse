
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, FlaskConical, Star, Scale, Zap } from 'lucide-react';
import type { AnuuStrategy } from '../engine/calculator';
import { getTranslatedName } from '../engine/calculator';
import { GoldDisplay } from './common/GoldDisplay';

export const StrategyGrimoire = ({ strategies, onSelectSingle, isEng, materials }: {
    strategies: AnuuStrategy[],
    onSelectSingle: (strat: AnuuStrategy) => void,
    isEng: boolean,
    materials: Record<number, { total: number }>
}) => {
    const [filter, setFilter] = useState<'all' | 'profitable' | 'lodestone' | 't6'>('profitable');

    const getIcon = (name: string) => {
        if (name.toLowerCase().includes('lodestone')) return '💎';
        if (name.toLowerCase().includes('blood') || name.toLowerCase().includes('claw') || name.toLowerCase().includes('fang') || name.toLowerCase().includes('scale') || name.toLowerCase().includes('venom') || name.toLowerCase().includes('totem') || name.toLowerCase().includes('bone')) return '🧪';
        return '✨';
    };

    const filteredStrategies = strategies.filter(s => {
        if (filter === 'all') return true;
        if (filter === 'profitable') return s.roi > 0;
        if (filter === 'lodestone') return s.type === 'LODE';
        if (filter === 't6') return s.type === 'FINE' || s.type === 'COMMON';
        return true;
    });

    return (
        <div className="matte-card p-8 md:p-12 border-white/5 bg-black/20 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Brain className="text-indigo-500" size={24} />
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] font-display">{isEng ? 'Strategy Grimoire' : 'Grimorio de Rutas'}</h3>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{isEng ? 'Click any route for Single Focus Mode' : 'Pulsa cualquier ruta para Modo Enfocado'}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {(['profitable', 'all', 't6', 'lodestone'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-black/40 text-zinc-500 hover:text-white'}`}
                        >
                            {f === 'profitable' ? (isEng ? 'Profitable' : 'Rentables') :
                                f === 'all' ? (isEng ? 'All' : 'Todas') :
                                    f === 't6' ? 'T6' :
                                        'Lodestones'}
                        </button>
                    ))}
                </div>
            </div>

            {filteredStrategies.length === 0 ? (
                <div className="text-center py-12 text-zinc-600 text-sm">
                    {isEng ? 'No routes match current filter' : 'No hay rutas con este filtro'}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredStrategies.map((strat, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => onSelectSingle(strat)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`text-left p-4 rounded-xl border transition-all group relative overflow-hidden ${materials[strat.sourceId]?.total > 0 ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] bg-indigo-500/5' :
                                    strat.roi > 20 ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400' :
                                        strat.roi > 0 ? 'bg-black/40 border-white/10 hover:border-indigo-500' :
                                            'bg-black/20 border-red-500/20 hover:border-red-400'
                                }`}
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-30 text-2xl">{getIcon(strat.name)}</div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-xs font-black text-white uppercase tracking-wide pr-8">
                                        {getTranslatedName(strat.targetId, strat.name, isEng)}
                                    </h4>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${strat.type === 'LODE' ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/20 text-violet-400'
                                        }`}>{strat.type === 'LODE' ? 'Lodestone' : 'T6 Mat'}</span>
                                    {materials[strat.sourceId]?.total > 0 && (
                                        <span className="text-[8px] px-2 py-0.5 rounded font-black uppercase bg-indigo-500 text-white animate-pulse">
                                            {isEng ? 'OWNED' : 'EN POSESIÓN'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-[8px] text-zinc-600 uppercase tracking-wider mb-1">{isEng ? 'Profit/Op' : 'Beneficio/Op'}</div>
                                        <GoldDisplay amount={strat.profitPerCraft} size="sm" />
                                    </div>
                                    <div className={`text-lg font-black ${strat.roi > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {strat.roi > 0 ? '+' : ''}{strat.roi.toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors pointer-events-none"></div>
                        </motion.button>
                    ))}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-[9px]">
                <div>
                    <h4 className="font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FlaskConical size={12} className="text-violet-400" /> T5 → T6
                    </h4>
                    <p className="text-zinc-500 leading-relaxed">
                        {isEng ? '50 T5 + 1 T6 + 5 Dust + 5 Stones → ~7 T6' : '50 T5 + 1 T6 + 5 Polvo + 5 Piedras → ~7 T6'}
                    </p>
                </div>
                <div>
                    <h4 className="font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Star size={12} className="text-amber-400" /> Lodestones
                    </h4>
                    <p className="text-zinc-500 leading-relaxed">
                        {isEng ? '2 Cores + 1 Dust + 1 Wine + 1 Crystal' : '2 Núcleos + 1 Polvo + 1 Vino + 1 Cristal'}
                    </p>
                </div>
                <div>
                    <h4 className="font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Scale size={12} className="text-emerald-400" /> Fees
                    </h4>
                    <p className="text-zinc-500 leading-relaxed">
                        {isEng ? '15% TP tax included in all calculations' : '15% de tasas ya incluidas en cálculos'}
                    </p>
                </div>
                <div>
                    <h4 className="font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Zap size={12} className="text-cyan-400" /> Shards
                    </h4>
                    <p className="text-zinc-500 leading-relaxed">
                        {isEng ? 'Buy Stones & Crystals from Miyani' : 'Compra Piedras y Cristales a Miyani'}
                    </p>
                </div>
            </div>
        </div>
    );
};
