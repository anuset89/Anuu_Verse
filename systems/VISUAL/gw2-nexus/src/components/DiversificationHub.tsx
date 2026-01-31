
import { Zap, Scale, Crosshair, FlaskConical, Sparkles, ArrowRight } from 'lucide-react';
import type { AnuuStrategy } from '../engine/calculator';
import { getTranslatedName } from '../engine/calculator';

export const DiversificationHub = ({ strategies, onSelect, isEng, walletGold }: { strategies: AnuuStrategy[], onSelect: (strats: AnuuStrategy[], profile: string) => void, isEng: boolean, walletGold: number }) => {
    // Estimate cost per 10 batches (approximate minimal viable run)
    const getEstCost = (s: AnuuStrategy) => (s.profitPerCraft * 10) / (Math.max(s.roi, 1) / 100);

    const affordable = strategies.filter(s => getEstCost(s) <= (walletGold || 9999999));
    const candidatePool = affordable.length > 0 ? affordable : strategies;

    const bestStrategy = candidatePool.length > 0
        ? candidatePool.reduce((prev, current) => (current.roi > prev.roi ? current : prev), candidatePool[0])
        : strategies[0];

    const profiles = [
        {
            id: 'hot',
            title: isEng ? 'Lightning Proc' : 'Velocidad',
            icon: <Zap className="text-cyan-400" size={24} />,
            items: strategies.filter(s => s.type === 'COMMON' && s.roi > 15).slice(0, 3),
            desc: isEng ? 'High velocity trading. Prioritizes turnover.' : 'Alta velocidad. Prioriza rotación rápida.',
            stats: { roi: 'HIGH', risk: 'LOW', speed: 'FAST' },
            color: 'border-cyan-500/20 hover:border-cyan-500/40'
        },
        {
            id: 'balanced',
            title: isEng ? 'Balanced Flow' : 'Equilibrado',
            icon: <Scale className="text-emerald-400" size={24} />,
            items: strategies.filter(s => s.roi > 20 && s.roi < 40).slice(0, 3),
            desc: isEng ? 'Stable growth with minimized risk.' : 'Crecimiento estable con riesgo minimizado.',
            stats: { roi: 'MED', risk: 'MIN', speed: 'MED' },
            color: 'border-emerald-500/20 hover:border-emerald-500/40'
        },
        {
            id: 'sniper',
            title: isEng ? 'Sniper Elite' : 'Francotirador',
            icon: <Crosshair className="text-rose-400" size={24} />,
            items: strategies.filter(s => s.roi > 40).slice(0, 3),
            desc: isEng ? 'Maximum profit for high-value targets.' : 'Máximo beneficio para objetivos de alto valor.',
            stats: { roi: 'MAX', risk: 'MED', speed: 'SLOW' },
            color: 'border-rose-500/20 hover:border-rose-500/40'
        },
        {
            id: 'industrial',
            title: isEng ? 'Industrial Lab' : 'Lab Industrial',
            icon: <FlaskConical className="text-amber-400" size={24} />,
            items: strategies.filter(s => s.verdict?.includes('RESEARCH') || s.verdict?.includes('WEEKLY')).slice(0, 3),
            desc: isEng ? 'Research and systematic item upgrades.' : 'Investigación y mejoras sistemáticas de ítems.',
            stats: { roi: 'STABLE', risk: 'ZERO', speed: 'SYSTEM' },
            color: 'border-amber-500/20 hover:border-amber-500/40'
        }
    ];

    return (
        <div className="space-y-8 mb-12">
            {/* ORACLE RECOMMENDATION (BEST FLIP) */}
            {bestStrategy && (
                <div className="matte-card p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                    <div className="bg-black/90 p-8 rounded-[14px] flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400 animate-pulse">
                                <Sparkles size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase font-display tracking-tight mb-1">
                                    {isEng ? 'Oracle Recommendation' : 'Recomendación del Oráculo'}
                                </h3>
                                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">
                                    {isEng ? 'Optimized for your current wallet' : 'Optimizado para tu cartera actual'}
                                </p>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 w-fit">
                                    <span>{getTranslatedName(bestStrategy.targetId, bestStrategy.name, isEng)}</span>
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                                    <span className="text-emerald-400">ROI: +{bestStrategy.roi.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onSelect([bestStrategy], `Oracle: ${bestStrategy.name}`)}
                            className="w-full md:w-auto px-8 py-4 bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-transform rounded-xl shadow-xl shadow-white/10 flex items-center justify-center gap-3 group"
                        >
                            {isEng ? 'Execute Operation' : 'Ejecutar Operación'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                </div>
            )}

            {/* STANDARD PROFILES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {profiles.map(p => (
                    <button
                        key={p.id}
                        onClick={() => onSelect(p.items.length > 0 ? p.items : strategies.slice(0, 3), p.title)}
                        className={`matte-card p-6 text-left group transition-all duration-300 hover:-translate-y-1 border ${p.color} relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 blur-sm group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">{p.icon}</div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5 group-hover:border-white/20 transition-colors">{p.icon}</div>
                            {p.items[0]?.verdict && <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{p.items[0].verdict}</span>}
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                                {p.stats.risk === 'LOW' ? (isEng ? 'Low Risk' : 'Riesgo Bajo') : p.stats.risk === 'MED' ? (isEng ? 'Med Risk' : 'Riesgo Medio') : (isEng ? 'High Yield' : 'Alto Rendimiento')}
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-white uppercase italic font-display mb-2 group-hover:text-indigo-400 transition-colors">{p.title}</h3>
                        <p className="text-[11px] text-zinc-500 font-bold mb-6 leading-relaxed h-12">{p.desc}</p>

                        <div className="space-y-2 border-t border-white/5 pt-4">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                <span className="text-zinc-600">Avg. ROI</span>
                                <span className="text-emerald-400">~{p.items.length > 0 ? (p.items.reduce((a, b) => a + b.roi, 0) / p.items.length).toFixed(1) : '0'}%</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                <span className="text-zinc-600">{isEng ? 'Speed' : 'Velocidad'}</span>
                                <span className="text-indigo-400">{p.stats.speed}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
