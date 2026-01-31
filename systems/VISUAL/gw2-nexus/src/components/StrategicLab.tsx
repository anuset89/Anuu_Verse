
import { FlaskConical, TrendingUp } from 'lucide-react';
import type { AnuuStrategy } from '../engine/calculator';
import { getTranslatedName } from '../engine/calculator';
import { getItemIcon } from '../utils/icons';

export const StrategicLab = ({ strategies, onSelect, isEng }: { strategies: AnuuStrategy[], onSelect: (s: AnuuStrategy) => void, isEng: boolean }) => {
    const labItems = strategies.filter(s => s.verdict.includes('RESEARCH') || s.verdict.includes('WEEKLY') || s.verdict.includes('UPGRADE') || s.name.includes('Ecto'));

    return (
        <div className="matte-card p-8 border-amber-500/30 bg-black/40 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><FlaskConical size={180} /></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
                    <FlaskConical size={28} />
                </div>
                <div>
                    <h2 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase font-display">{isEng ? 'Anuu Strategic Laboratory' : 'Laboratorio Estratégico de Anuu'}</h2>
                    <h3 className="text-2xl font-black text-white uppercase italic font-display">{isEng ? 'Industrial Upgrades' : 'Mejoras Industriales'}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {labItems.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group cursor-pointer" onClick={() => onSelect(item)}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-2xl bg-black/40 p-2 rounded-lg border border-white/5">{getItemIcon(item.name)}</div>
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{item.verdict}</span>
                        </div>
                        <h4 className="font-bold text-white uppercase text-xs mb-1 group-hover:text-amber-400 transition-colors">
                            {getTranslatedName(item.targetId, item.name, isEng)}
                        </h4>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">
                            {isEng ? 'Method:' : 'Método:'} {getTranslatedName(item.sourceId, item.sourceName, isEng)}
                        </p>
                        <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/5">
                            <span className="text-[9px] font-black text-emerald-400">ROI: +{item.roi.toFixed(1)}%</span>
                            <TrendingUp size={12} className="text-emerald-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
