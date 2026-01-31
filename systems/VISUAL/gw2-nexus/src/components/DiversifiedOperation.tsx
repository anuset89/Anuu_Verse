
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Cpu, ShoppingCart, Hammer, Coins, CheckCircle, Package } from 'lucide-react';
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

interface ShoppingListItem {
    strategy: AnuuStrategy;
    buySource: number;
    buyDust: number;
    buyTarget: number;
    batchSize: number;
    // ... add other properties if needed
}

// --- NEXUS TRACKER (TRADING WIZARD) ---
const NexusTracker = ({ list, isEng }: { list: ShoppingListItem[], isEng: boolean }) => {
    const [currentStep, setCurrentStep] = useState(1);

    // 1. Logistics: Consolidate Shopping List
    const logistics = list.reduce((acc, item) => {
        // Source
        if (item.buySource > 0) {
            const existing = acc.find((x) => x.name === item.strategy.sourceName);
            if (existing) existing.count += item.buySource;
            else acc.push({ name: item.strategy.sourceName, count: item.buySource, type: 'source' });
        }
        // Dust (Shared)
        if (item.buyDust > 0) {
            const existing = acc.find((x) => x.name === 'Crystalline Dust');
            if (existing) existing.count += item.buyDust;
            else acc.push({ name: 'Crystalline Dust', count: item.buyDust, type: 'dust' });
        }
        // Seed Target
        if (item.buyTarget > 0) {
            const existing = acc.find((x) => x.name === item.strategy.name); // Using strategy name as target name usually aligns
            if (existing) existing.count += item.buyTarget;
            else acc.push({ name: item.strategy.name, count: item.buyTarget, type: 'target' });
        }
        return acc;
    }, [] as { name: string, count: number, type: string }[]);

    // 2. Assembly: Forge Recipes
    const assembly = list.filter(item => item.batchSize > 0).map(item => ({
        name: item.strategy.name,
        batches: item.batchSize,
        recipe: item.strategy.recipe || "Standard Conversion"
    }));

    const steps = [
        { id: 1, title: isEng ? 'Accumulation' : 'Acumulación', icon: <ShoppingCart size={18} /> },
        { id: 2, title: isEng ? 'Processing' : 'Procesado', icon: <Hammer size={18} /> },
        { id: 3, title: isEng ? 'Liquidation' : 'Liquidación', icon: <Coins size={18} /> }
    ];

    return (
        <div className="mt-8 border border-white/10 rounded-2xl bg-black/40 overflow-hidden shadow-2xl shadow-black/50">
            {/* WIZARD HEADER */}
            <div className="flex bg-black/40 border-b border-white/5">
                {steps.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentStep(s.id)}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === s.id ? 'bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500 scale-105' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                        {s.icon} <span className="hidden md:inline">{s.title}</span>
                    </button>
                ))}
            </div>

            {/* STEP CONTENT */}
            <div className="p-8 min-h-[300px] relative">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <h4 className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-lg mb-2">
                                <ShoppingCart /> {isEng ? 'Phase 1: Accumulation' : 'Fase 1: Acumulación'}
                            </h4>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 border-l-2 border-emerald-500 pl-3">
                                {isEng ? 'Place Buy Orders to maximize flip margins. Do not instant buy.' : 'Coloca Órdenes de Compra para maximizar márgenes. No compres instantáneo.'}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {logistics.length === 0 ? (
                                    <div className="p-4 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-center text-xs font-bold uppercase">
                                        {isEng ? 'Inventory Sufficient.' : 'Inventario Suficiente.'}
                                    </div>
                                ) : logistics.map((l, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 relative group hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${l.type === 'dust' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-black/40 text-zinc-300'}`}>
                                                {getItemIcon(l.name)}
                                            </div>
                                            <div>
                                                <span className={`font-bold uppercase tracking-tight text-xs block ${l.type === 'dust' ? 'text-indigo-300' : 'text-zinc-300'}`}>{l.name}</span>
                                                <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Buy Order</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-white font-mono font-black text-xl block">{l.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <h4 className="flex items-center gap-3 text-amber-400 font-black uppercase tracking-widest text-lg mb-6">
                                <Hammer /> {isEng ? 'Phase 2: Processing' : 'Fase 2: Procesado'}
                            </h4>
                            <div className="space-y-4">
                                {assembly.map((task, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-black uppercase tracking-tight text-lg">{task.name}</span>
                                            <span className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 text-xs">{task.batches} {isEng ? 'BATCHES' : 'LOTES'}</span>
                                        </div>
                                        <div className="text-[10px] text-zinc-400 font-mono bg-black/40 p-3 rounded border border-white/5 flex gap-2 items-center">
                                            <span className="text-amber-500 font-black">RECIPE:</span> {task.recipe}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <h4 className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-widest text-lg mb-6">
                                <Coins /> {isEng ? 'Phase 3: Liquidation' : 'Fase 3: Liquidación'}
                            </h4>
                            <div className="space-y-3">
                                {assembly.map((task, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors">
                                        <span className="text-zinc-300 uppercase tracking-tight flex items-center gap-3 text-xs font-bold">
                                            <Package className="text-indigo-400" size={16} /> Sell {task.name}
                                        </span>
                                        <span className="text-emerald-400 font-mono font-black flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs">
                                            <CheckCircle size={12} /> {isEng ? 'LIST ON TP' : 'LISTAR EN BAZAR'}
                                        </span>
                                    </div>
                                ))}
                                <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
                                    <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">
                                        {isEng ? 'Patience yields profit. Never instasell.' : 'La paciencia da beneficios. Nunca vendas instantáneo.'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* NAVIGATION FOOTER */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between">
                <button
                    disabled={currentStep === 1}
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 1 ? 'opacity-0 cursor-default' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
                >
                    {isEng ? 'Previous Step' : 'Paso Anterior'}
                </button>
                <div className="flex gap-1 justify-center items-center">
                    {[1, 2, 3].map(step => (
                        <div key={step} className={`w-1.5 h-1.5 rounded-full transition-colors ${currentStep === step ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
                    ))}
                </div>
                <button
                    disabled={currentStep === 3}
                    onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${currentStep === 3 ? 'opacity-0 cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40'}`}
                >
                    {isEng ? 'Next Step' : 'Siguiente Paso'} <ArrowLeft className="rotate-180" size={14} />
                </button>
            </div>
        </div>
    );
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

export const DiversifiedOperation = ({ strategies, wallet, prices, materials, onBack, isEng }: {
    strategies: AnuuStrategy[];
    wallet: Record<number, number>;
    prices: Record<number, MarketItem>;
    materials: Record<number, number>; // Inventory
    onBack: () => void;
    isEng: boolean;
}) => {
    const [budgetGold, setBudgetGold] = useState(100); // 100g total budget
    const availableGold = (wallet[1] || 0) / 10000; // Convert copper to gold

    // Use all provided strategies for maximum diversification
    const activeStrategies = strategies;

    // Distribute budget equally across all active strategies
    const weightPerStrategy = 1 / Math.max(1, activeStrategies.length);

    const shoppingList = activeStrategies.map((s) => {
        const allocatedGold = budgetGold * weightPerStrategy;
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

        // Auto-Tracker: Check inventory
        const ownedSource = materials[s.sourceId] || 0;
        const ownedDust = materials[IDS.DUST] || 0;
        const ownedTarget = materials[s.targetId] || 0;

        const neededSource = sourcePerCraft * batchSize;
        const neededDust = (usesDust ? dustPerCraft : 0) * batchSize;
        // Seed logic for promotions: Strictly 1 unit is enough to start the chain (output becomes input for next)
        const neededTarget = (s.type === 'LODE' || s.type === 'RUNE') ? 0 : (batchSize > 0 ? 1 : 0);

        // Calculate purchase mandates (Buy = Need - Have)
        const buySource = Math.max(0, neededSource - ownedSource);
        const buyDust = Math.max(0, neededDust - ownedDust);
        const buyTarget = Math.max(0, neededTarget - ownedTarget);

        return {
            strategy: s,
            batchSize,
            allocatedGold,
            neededSource, buySource, ownedSource,
            neededDust, buyDust, ownedDust,
            neededTarget, buyTarget, ownedTarget,
            profit: s.profitPerCraft * batchSize,
            priceSource: prices[s.sourceId]?.buys?.unit_price || 0,
        };
    });

    // Financial calculations using Actual Buy Amounts (Auto-Tracker applied)
    const totalInvested = shoppingList.reduce((acc, item) => acc + (item.buySource * (prices[item.strategy.sourceId]?.buys?.unit_price || 0)) + (item.buyDust * (prices[IDS.DUST]?.buys?.unit_price || 0)) + (item.buyTarget * (prices[item.strategy.targetId]?.buys?.unit_price || 0)), 0);
    const totalGrossSales = shoppingList.reduce((acc, item) => acc + (item.batchSize * (prices[item.strategy.targetId]?.sells?.unit_price || 0) * (item.strategy.type === 'COMMON' ? (item.strategy.name.includes('Ecto') ? 0.9 : 22) : (item.strategy.type === 'FINE' ? 7 : 1))), 0);
    const tpFees = totalGrossSales * 0.15;
    const netProfit = totalGrossSales - tpFees - totalInvested;
    const roiPercentage = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8 pb-12">
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-2">
                <button onClick={onBack} className="p-3 rounded-full hover:bg-white/10 transition-colors group">
                    <ArrowLeft className="text-zinc-400 group-hover:text-white transition-colors" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-display italic">
                        {isEng ? 'Diversified Operations' : 'Operaciones Diversificadas'}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase flex items-center gap-2">
                        {isEng ? 'Protocol v6.1: Active' : 'Protocolo v6.1: Activo'}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </p>
                </div>
            </div>

            {/* BUDGET CONTROL */}
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5 mx-1">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{isEng ? 'Set Investment Budget' : 'Presupuesto de Inversión'}:</span>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={budgetGold}
                        onChange={(e) => setBudgetGold(Math.max(1, parseInt(e.target.value) || 0))}
                        className="bg-transparent text-xl font-black text-white w-24 border-b border-indigo-500/50 focus:border-indigo-400 focus:outline-none font-display text-right"
                    />
                    <span className="text-[10px] font-black text-amber-500 uppercase">GOLD</span>
                </div>
                <div className="text-[9px] text-zinc-600 ml-auto uppercase tracking-wide border-l border-white/10 pl-4">
                    {isEng ? 'Wallet Available:' : 'Cartera Disponible:'} <span className="text-zinc-400 font-bold">{Math.floor(availableGold)}g</span>
                </div>
            </div>

            {/* MISSION CONTROL (CENTRALIZED TRACKER) */}
            <NexusTracker list={shoppingList} isEng={isEng} />

            {/* FINANCIAL PROJECTION PANEL */}
            <div className="mt-8">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4 pl-1">{isEng ? 'Financial Telemetry' : 'Telemetría Financiera'}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="matte-card p-4 border-l-2 border-indigo-500 bg-black/40">
                        <div className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">{isEng ? 'Total Investment' : 'Inversión Total'}</div>
                        <GoldDisplay amount={totalInvested} size="lg" />
                    </div>
                    <div className="matte-card p-4 border-l-2 border-emerald-500 bg-black/40">
                        <div className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">{isEng ? 'Gross Sales' : 'Ventas Brutas'}</div>
                        <GoldDisplay amount={totalGrossSales} size="lg" />
                    </div>
                    <div className="matte-card p-4 border-l-2 border-red-500/50 bg-black/40">
                        <div className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">{isEng ? 'Trading Post Fees (15%)' : 'Tasas Bazar (15%)'}</div>
                        <div className="text-red-400 font-mono font-bold">-<GoldDisplay amount={tpFees} size="lg" /></div>
                    </div>
                    <div className="matte-card p-4 border-l-2 border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-[8px] text-emerald-400 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Cpu size={12} className="animate-pulse" /> {isEng ? 'Net Profit' : 'Beneficio Neto'}
                            </div>
                            <GoldDisplay amount={netProfit} size="xl" />
                            <div className="text-[10px] text-emerald-300 font-black tracking-widest mt-1">ROI: +{roiPercentage.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STRATEGY BREAKDOWN */}
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6 text-center">{isEng ? 'Detailed Strategy Breakdown' : 'Desglose Detallado de Estrategia'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {shoppingList.map((item, idx) => (
                        <div key={idx} className="matte-card p-6 border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 text-6xl font-black text-zinc-700">{idx + 1}</div>
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{isEng ? 'Allocation' : 'Asignación'}: {Math.round(weightPerStrategy * 100)}% ({Math.floor(item.allocatedGold)}g)</h4>
                                <div className="h-1 w-full bg-zinc-800 rounded-full mb-6 overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${weightPerStrategy * 100}%` }}></div>
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
                                        <div className="text-right">
                                            <span className={`font-black ${item.buySource < item.neededSource ? 'text-emerald-400' : 'text-white'}`}>{item.buySource} u.</span>
                                            {item.ownedSource > 0 && <div className="text-[7px] text-zinc-500 uppercase tracking-tight">{isEng ? 'Have' : 'Tienes'}: {item.ownedSource}</div>}
                                        </div>
                                    </div>
                                    {item.neededDust > 0 && (
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-zinc-500 font-bold uppercase">{isEng ? 'Buy Dust' : 'Comprar Polvo'}</span>
                                            <div className="text-right">
                                                <span className={`font-black ${item.buyDust < item.neededDust ? 'text-emerald-400' : 'text-indigo-300'}`}>{item.buyDust} u.</span>
                                                {item.ownedDust > 0 && <div className="text-[7px] text-zinc-500 uppercase tracking-tight">{isEng ? 'Have' : 'Tienes'}: {item.ownedDust}</div>}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-2 mt-2">
                                        <span className="text-zinc-500 font-bold uppercase">{isEng ? 'Operations' : 'Operaciones'}</span>
                                        <span className="text-white font-black">{item.batchSize} x</span>
                                    </div>
                                    {item.neededTarget > 0 && (
                                        <div className="pt-2 text-center">
                                            <div className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1">SEED TARGET</div>
                                            <div className="flex justify-between items-center text-[9px]">
                                                <span className="text-zinc-500">Buy: <span className={item.buyTarget < item.neededTarget ? 'text-emerald-400' : 'text-white'}>{item.buyTarget}</span></span>
                                                {item.ownedTarget > 0 && <span className="text-zinc-600">Have: {item.ownedTarget}</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-black/20 border-t border-white/5 text-[9px] text-zinc-600 font-black uppercase text-center tracking-widest font-display mt-8">
                {isEng ? 'Diversification reduces risk. Execute all 3 orders simultaneously.' : 'La diversificación reduce el riesgo. Ejecuta las 3 órdenes simultáneamente.'}
            </div>
        </motion.div>
    );
};
