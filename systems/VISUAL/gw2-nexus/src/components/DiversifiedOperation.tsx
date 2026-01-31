
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu } from 'lucide-react';
import type { AnuuStrategy, MarketItem } from '../engine/calculator';
import { IDS } from '../engine/calculator';


const getItemIcon = (name: string) => {
    if (name.includes('Blood')) return "🩸";
    if (name.includes('Bone')) return "🦴";
    if (name.includes('Claw')) return "🦅";
    if (name.includes('Fang')) return "🦷";
    if (name.includes('Scale')) return "🛡️";
    if (name.includes('Totem')) return "🗿";
    if (name.includes('Venom')) return "🐍";
    if (name.includes('Dust')) return "✨";
    if (name.includes('Lodestone') || name.includes('Core')) return "💎";
    if (name.includes('Rune')) return "🔮";
    if (name.includes('Sigil')) return "⚔️";
    if (name.includes('Wood')) return "🌲";
    if (name.includes('Ore') || name.includes('Ingot')) return "⛏️";
    if (name.includes('Leather')) return "🧵";
    if (name.includes('Cloth') || name.includes('Scrap')) return "🧶";
    if (name.includes('Ecto')) return "👻";
    if (name.includes('Coin')) return "🪙";
    return "📦";
};

const GoldDisplay = ({ amount, size = "md" }: { amount: number, size?: "sm" | "md" | "lg" | "xl" }) => {
    const gold = Math.floor(amount / 10000);
    const silver = Math.floor((amount % 10000) / 100);
    const copper = Math.round(amount % 100);

    const sizeClasses = {
        sm: "text-xs",
        md: "text-base",
        lg: "text-xl",
        xl: "text-3xl md:text-5xl"
    };

    return (
        <div className={`font-mono font-bold flex items-baseline gap-1 ${sizeClasses[size]}`}>
            <span className="text-amber-400">{gold}<span className="text-[0.6em] ml-0.5 text-amber-600 opacity-60">g</span></span>
            <span className="text-zinc-400">{silver}<span className="text-[0.6em] ml-0.5 text-zinc-600 opacity-60">s</span></span>
            <span className="text-orange-700/60">{copper}<span className="text-[0.6em] ml-0.5 text-orange-800/40 opacity-60">c</span></span>
        </div>
    );
};

export const DiversifiedOperation = ({ strategies, wallet, prices, onBack, isEng }: {
    strategies: AnuuStrategy[];
    wallet: Record<number, number>;
    prices: Record<number, MarketItem>;
    onBack: () => void;
    isEng: boolean;
}) => {
    const [budgetGold, setBudgetGold] = useState(100); // 100g total budget
    const availableGold = (wallet[1] || 0) / 10000; // Convert copper to gold

    // Limit to top 3 strategies to avoid saturation
    const activeStrategies = strategies.slice(0, 3);

    // Distribution weights: 40% / 30% / 30%
    const weights = [0.4, 0.3, 0.3];

    const shoppingList = activeStrategies.map((s, idx) => {
        const allocatedGold = budgetGold * weights[idx];
        const sourcePriceGold = (prices[s.sourceId]?.buys?.unit_price || 0) / 10000;

        // Cost per craft (approx)
        const costPerCraft = (s.type === 'LODE' ? 2 : (s.type === 'RUNE' ? 10 : (s.type === 'COMMON' ? 250 : 50))) * sourcePriceGold;

        // How many crafts fit in budget?
        const possibleCrafts = costPerCraft > 0 ? Math.floor(allocatedGold / costPerCraft) : 0;
        const batchSize = Math.max(1, possibleCrafts);

        // Calculate needs
        const sourcePerCraft = s.type === 'LODE' ? 2 : (s.type === 'RUNE' ? 10 : (s.type === 'COMMON' ? 250 : 50));
        const dustPerCraft = s.type === 'LODE' ? 1 : 5;
        const usesDust = s.type !== 'RUNE';

        // Seed logic for promotions
        const neededTarget = (s.type === 'LODE' || s.type === 'RUNE') ? 0 : 5;

        return {
            strategy: s,
            batchSize,
            allocatedGold,
            neededSource: sourcePerCraft * batchSize,
            neededDust: (usesDust ? dustPerCraft : 0) * batchSize,
            neededTarget,
            profit: s.profitPerCraft * batchSize,
            priceSource: prices[s.sourceId]?.buys?.unit_price || 0,
        };
    });

    const totalInvested = shoppingList.reduce((acc, item) => acc + (item.neededSource * (prices[item.strategy.sourceId]?.buys?.unit_price || 0)) + (item.neededDust * (prices[IDS.DUST]?.buys?.unit_price || 0)) + (item.neededTarget * (prices[item.strategy.targetId]?.buys?.unit_price || 0)), 0);
    const totalGrossSales = shoppingList.reduce((acc, item) => acc + (item.batchSize * (prices[item.strategy.targetId]?.sells?.unit_price || 0) * (item.strategy.type === 'COMMON' ? (item.strategy.name.includes('Ecto') ? 0.9 : 22) : (item.strategy.type === 'FINE' ? 7 : 1))), 0);
    const tpFees = totalGrossSales * 0.15;
    const netProfit = totalGrossSales - tpFees - totalInvested;
    const roiPercentage = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <button onClick={onBack} className="matte-card px-5 py-3 text-zinc-500 text-[10px] hover:text-white transition-all uppercase tracking-[0.2em] font-black border-white/5 flex items-center gap-2 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {isEng ? 'Back to Dashboard' : 'Volver al Tablero'}
                </button>
                <div className="flex flex-col items-start md:items-end">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase font-display tracking-tight flex items-center gap-3">
                        <Cpu className="text-indigo-500" /> {isEng ? 'Diversified Protocol' : 'Protocolo Diversificado'}
                    </h2>
                    <span className="text-[9px] font-black px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                        {isEng ? 'Multi-Market Analysis' : 'Análisis Multi-Mercado'}
                    </span>
                </div>
            </div>

            {/* Budget & Financial Breakdown */}
            <div className="matte-card p-8 flex flex-col md:flex-row gap-8 items-start justify-between bg-gradient-to-r from-indigo-900/10 to-purple-900/10 border-indigo-500/20">

                {/* Left: Input */}
                <div>
                    <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{isEng ? 'Investment Budget' : 'Presupuesto de Inversión'}</h3>
                    <div className="flex items-end gap-2">
                        <input
                            type="number"
                            value={budgetGold}
                            onChange={(e) => setBudgetGold(Math.max(1, parseInt(e.target.value) || 0))}
                            className="bg-transparent text-4xl font-black text-white w-32 border-b border-indigo-500/50 focus:border-indigo-400 focus:outline-none font-display text-right"
                        />
                        <span className="text-xl font-black text-amber-500 mb-1">GOLD</span>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-2 uppercase tracking-wide">
                        {isEng ? 'Wallet Available:' : 'Disponible en Cartera:'} <span className="text-zinc-400 font-bold">{Math.floor(availableGold)}g</span>
                    </p>
                </div>

                {/* Right: Detailed Breakdown */}
                <div className="text-right space-y-1">
                    <h3 className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.3em] mb-3 border-b border-white/5 pb-1">{isEng ? 'Financial Projection' : 'Proyección Financiera'}</h3>

                    <div className="flex justify-end gap-4 text-[10px] items-center">
                        <span className="text-zinc-500 uppercase tracking-wide">{isEng ? 'Est. Total Investment' : 'Inversión Total Est.'}</span>
                        <GoldDisplay amount={totalInvested} size="sm" />
                    </div>

                    <div className="flex justify-end gap-4 text-[10px] items-center">
                        <span className="text-zinc-500 uppercase tracking-wide">{isEng ? 'Est. Gross Sales' : 'Ventas Brutas Est.'}</span>
                        <span className="font-mono font-bold text-zinc-300">
                            {Math.floor(totalGrossSales / 10000)}g <span className="text-[9px] text-zinc-600">BRUTO</span>
                        </span>
                    </div>

                    <div className="flex justify-end gap-4 text-[10px] items-center">
                        <span className="text-red-400/60 uppercase tracking-wide">{isEng ? 'Trading Post Fees (15%)' : 'Tasas Trading Post (15%)'}</span>
                        <span className="font-mono font-bold text-red-400/80">-{Math.floor(tpFees / 10000)}g</span>
                    </div>

                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-end gap-4 items-center">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] text-emerald-500/80 uppercase tracking-widest">{isEng ? 'Net Profit' : 'Beneficio Neto'}</span>
                            <GoldDisplay amount={netProfit} size="lg" />
                        </div>
                    </div>

                    <div className="text-[12px] text-emerald-400 font-black uppercase tracking-widest pt-1 font-display text-glow">
                        +{roiPercentage.toFixed(1)}% ROI
                    </div>
                </div>
            </div>

            {/* Strategy Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {shoppingList.map((item, idx) => (
                    <div key={idx} className="matte-card p-6 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 text-6xl font-black text-zinc-700">{idx + 1}</div>
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{isEng ? 'Allocation' : 'Asignación'}: {Math.round(weights[idx] * 100)}%</h4>
                            <div className="h-1 w-full bg-zinc-800 rounded-full mb-6 overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${weights[idx] * 100}%` }}></div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-3xl bg-black/40 p-3 rounded-2xl border border-white/5">{getItemIcon(item.strategy.name)}</div>
                                <div>
                                    <h3 className="font-bold text-white uppercase text-xs font-display">{item.strategy.name}</h3>
                                    <div className="text-[9px] text-zinc-500 uppercase tracking-wide">{isEng ? 'Route' : 'Ruta'}: {item.strategy.type}</div>
                                    {item.strategy.recipe && (
                                        <div className="mt-2 text-[7px] text-zinc-600 leading-tight border-t border-white/5 pt-1">
                                            {item.strategy.recipe}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-white/5">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-zinc-500 font-bold uppercase">{isEng ? 'Buy Source' : 'Comprar Fuente'}</span>
                                    <span className="text-white font-black">{item.neededSource} u.</span>
                                </div>
                                {item.neededDust > 0 && (
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-zinc-500 font-bold uppercase">{isEng ? 'Buy Dust' : 'Comprar Polvo'}</span>
                                        <span className="text-indigo-300 font-black">{item.neededDust} u.</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-2 mt-2">
                                    <span className="text-zinc-500 font-bold uppercase">{isEng ? 'Operations' : 'Operaciones'}</span>
                                    <span className="text-white font-black">{item.batchSize} x</span>
                                </div>
                                {item.neededTarget > 0 && (
                                    <div className="text-[7px] text-emerald-400 font-black uppercase tracking-[0.2em] text-center pt-2">
                                        ✦ SEED: {item.neededTarget} u.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-black/20 border-t border-white/5 text-[9px] text-zinc-600 font-black uppercase text-center tracking-widest font-display">
                {isEng ? 'Diversification reduces risk. Execute all 3 orders simultaneously.' : 'La diversificación reduce el riesgo. Ejecuta las 3 órdenes simultáneamente.'}
            </div>
        </motion.div>
    );
};
