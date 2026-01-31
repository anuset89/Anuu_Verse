
import { Zap, Scale, Crosshair, FlaskConical } from 'lucide-react';
import type { AnuuStrategy } from '../engine/calculator';

export const DiversificationHub = ({ strategies, onSelect, isEng }: { strategies: AnuuStrategy[], onSelect: (strats: AnuuStrategy[], profile: string) => void, isEng: boolean, walletGold?: number }) => {
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
