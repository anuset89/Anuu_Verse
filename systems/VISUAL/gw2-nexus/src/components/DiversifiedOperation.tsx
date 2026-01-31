
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Cpu, ShoppingCart, Hammer, Coins, CheckCircle, Package } from 'lucide-react';
import type { AnuuStrategy, MarketItem } from '../engine/calculator';
import { IDS, getTranslatedName } from '../engine/calculator';


import { getItemIcon } from '../utils/icons';

interface ShoppingListItem {
    strategy: AnuuStrategy;
    allocatedGold: number;
    neededSource: number; buySource: number; ownedSource: number; ownedSourceData: { storage: number, bank: number };
    neededDust: number; buyDust: number; ownedDust: number; ownedDustData: { storage: number, bank: number };
    neededTarget: number; buyTarget: number; ownedTarget: number; ownedTargetData: { storage: number, bank: number };
    buyWine: number;
    buyCrystals: number;
    batchSize: number;
    profit: number;
    priceSource: number;
}

// --- NEXUS TRACKER (TRADING WIZARD) ---
const NexusTracker = ({ list, isEng, onClose, budget, setBudget, wallet, materials }: {
    list: ShoppingListItem[],
    isEng: boolean,
    onClose: () => void,
    budget: number,
    setBudget: (n: number) => void,
    wallet: number,
    materials: Record<number, { total: number, storage: number, bank: number }>
}) => {
    const [currentStep, setCurrentStep] = useState(1);

    // 1. Logistics: Consolidate Shopping List
    const logistics = list.reduce((acc, item) => {
        if (item.buySource > 0) {
            const name = getTranslatedName(item.strategy.sourceId, item.strategy.sourceName, isEng);
            const existing = acc.find((x) => x.id === item.strategy.sourceId);
            if (existing) existing.count += item.buySource;
            else acc.push({ id: item.strategy.sourceId, name, count: item.buySource, type: 'source' });
        }
        if (item.buyDust > 0) {
            const name = getTranslatedName(IDS.DUST, 'Crystalline Dust', isEng);
            const existing = acc.find((x) => x.id === IDS.DUST);
            if (existing) existing.count += item.buyDust;
            else acc.push({ id: IDS.DUST, name, count: item.buyDust, type: 'dust' });
        }
        if (item.buyWine > 0) {
            const name = isEng ? 'Bottle of Elonian Wine' : 'Botella de vino de Elona';
            const existing = acc.find((x) => x.id === 19632);
            if (existing) existing.count += item.buyWine;
            else acc.push({ id: 19632, name, count: item.buyWine, type: 'npc' });
        }
        if (item.buyCrystals > 0) {
            const name = isEng ? 'Mystic Crystal' : 'Cristal místico';
            const existing = acc.find((x) => x.id === 19925);
            if (existing) existing.count += item.buyCrystals;
            else acc.push({ id: 19925, name, count: item.buyCrystals, type: 'shard' });
        }
        if (item.buyTarget > 0 && item.strategy.type !== 'LODE') {
            const name = getTranslatedName(item.strategy.targetId, item.strategy.name, isEng);
            const existing = acc.find((x) => x.id === item.strategy.targetId);
            if (existing) existing.count += item.buyTarget;
            else acc.push({ id: item.strategy.targetId, name, count: item.buyTarget, type: 'target' });
        }
        return acc;
    }, [] as { id: number, name: string, count: number, type: string }[]);

    // 2. Assembly: Forge Recipes
    const assembly = list.filter(item => item.batchSize > 0).map(item => ({
        id: item.strategy.targetId,
        name: getTranslatedName(item.strategy.targetId, item.strategy.name, isEng),
        batches: item.batchSize,
        recipe: item.strategy.recipe || (isEng ? "Standard Conversion" : "Conversión Estándar")
    }));

    const steps = [
        { id: 1, title: isEng ? 'Accumulation' : 'Acumulación', icon: <ShoppingCart size={18} /> },
        { id: 2, title: isEng ? 'Processing' : 'Procesado', icon: <Hammer size={18} /> },
        { id: 3, title: isEng ? 'Liquidation' : 'Liquidación', icon: <Coins size={18} /> }
    ];

    return (
        <div className="relative overflow-hidden matte-card p-6 border-indigo-500/40 mb-8 transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Cpu size={120} /></div>

            {/* WIZARD HEADER & CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
                        {steps[currentStep - 1].icon}
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase font-display">{isEng ? 'Mission Control' : 'Control de Misión'}</h2>
                        <h3 className="text-xl font-black text-white uppercase italic font-display">{steps[currentStep - 1].title}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {currentStep === 1 && (
                        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{isEng ? 'Budget' : 'Presupuesto'}:</span>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="bg-transparent text-lg font-black text-white w-20 border-b border-indigo-500/50 focus:border-indigo-400 focus:outline-none font-display text-right"
                                />
                                <span className="text-[10px] font-black text-amber-500 uppercase">G</span>
                            </div>
                            <div className="hidden md:block h-4 w-px bg-white/10 mx-2"></div>
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[7px] text-zinc-500 uppercase tracking-widest">{isEng ? 'Wallet' : 'Cartera'}</span>
                                <span className="text-[9px] font-bold text-zinc-400">{Math.floor(wallet)}g</span>
                            </div>
                        </div>
                    )}
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                </div>
            </div>

            {/* STEP CONTENT */}
            <div className="min-h-[250px] relative z-10">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 border-l-2 border-emerald-500 pl-3">
                                {isEng ? 'Phase 1: Place Buy Orders to maximize flip margins.' : 'Fase 1: Coloca Órdenes de Compra para maximizar márgenes.'}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {logistics.length === 0 ? (
                                    <div className="p-4 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-center text-xs font-bold uppercase">
                                        {isEng ? 'Inventory Sufficient.' : 'Inventario Suficiente.'}
                                    </div>
                                ) : (
                                    logistics.map((l, i) => (
                                        <div key={i} className={`flex justify-between items-center p-4 rounded-xl bg-white/5 border relative group transition-colors ${l.type === 'npc' || l.type === 'shard' ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-white/5 hover:border-emerald-500/30'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${l.type === 'dust' ? 'bg-indigo-500/20 text-indigo-300' : l.type === 'npc' ? 'bg-amber-500/10 text-amber-500' : 'bg-black/40 text-zinc-300'}`}>
                                                    {l.type === 'npc' ? '🍷' : l.type === 'shard' ? '🧊' : getItemIcon(l.name)}
                                                </div>
                                                <div>
                                                    <span className={`font-bold uppercase tracking-tight text-xs block ${l.type === 'dust' ? 'text-indigo-300' : l.type === 'npc' ? 'text-amber-400' : 'text-zinc-300'}`}>{l.name}</span>
                                                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest leading-tight">
                                                        {l.type === 'npc' ? (isEng ? 'Buy from Miyani (25s 60c)' : 'Miyani (25s 60c)') :
                                                            l.type === 'shard' ? (isEng ? 'Miyani (Spirit Shards)' : 'Miyani (Exc. Shards)') :
                                                                (isEng ? 'Buy Order' : 'Orden de Compra')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-white font-mono font-black text-xl block leading-none">{l.count}</span>
                                                {l.count >= 250 && (
                                                    <span className="text-[9px] text-indigo-400 font-black uppercase tracking-tighter block mb-0.5">
                                                        {Math.floor(l.count / 250)} STACK{Math.floor(l.count / 250) > 1 ? 'S' : ''}
                                                        {l.count % 250 > 0 ? ` + ${l.count % 250}` : ''}
                                                    </span>
                                                )}
                                                {materials[l.id] && materials[l.id].total > 0 && (
                                                    <div className="text-[7px] text-zinc-600 font-black uppercase flex flex-col items-end opacity-60">
                                                        {materials[l.id].storage > 0 && <span>{isEng ? 'Storage' : 'Almacén'}: {materials[l.id].storage}</span>}
                                                        {materials[l.id].bank > 0 && <span className="text-indigo-500">{isEng ? 'Bank' : 'Banco'}: {materials[l.id].bank}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
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
                                            <span className="text-amber-500 font-black">{isEng ? 'RECIPE:' : 'RECETA:'}</span> {task.recipe}
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
                                            <Package className="text-indigo-400" size={16} /> {isEng ? 'Sell' : 'Vender'} {task.name}
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

            {/* PROGRESS BAR & NAVIGATION */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex gap-1">
                    {[1, 2, 3].map(step => (
                        <div key={step} className={`w-8 h-1 rounded-full transition-colors ${currentStep >= step ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
                    ))}
                </div>
                <div className="flex gap-4">
                    <button
                        disabled={currentStep === 1}
                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                        className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentStep === 1 ? 'opacity-30 cursor-default' : 'text-zinc-500 hover:text-white'}`}
                    >
                        {isEng ? 'Back' : 'Atrás'}
                    </button>
                    <button
                        onClick={() => currentStep === 3 ? onClose() : setCurrentStep(prev => Math.min(3, prev + 1))}
                        className="px-6 py-2 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-colors"
                    >
                        {currentStep === 3 ? (isEng ? 'Finish' : 'Terminar') : (isEng ? 'Next' : 'Siguiente')}
                    </button>
                </div>
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
    materials: Record<number, { total: number, storage: number, bank: number }>; // Inventory
    onBack: () => void;
    isEng: boolean;
}) => {
    const availableGold = (wallet[1] || 0) / 10000; // Convert copper to gold
    const [budgetGold, setBudgetGold] = useState(availableGold >= 1 ? Math.floor(availableGold) : 100);

    // Use all provided strategies for maximum diversification
    const activeStrategies = strategies;

    // Distribute budget equally across all active strategies
    const weightPerStrategy = 1 / Math.max(1, activeStrategies.length);

    const shoppingList = activeStrategies.map((s) => {
        const allocatedGold = budgetGold * weightPerStrategy;

        // Prices in gold for calculation
        const pSource = (prices[s.sourceId]?.buys?.unit_price || 0) / 10000;
        const pDust = (prices[IDS.DUST]?.buys?.unit_price || 0) / 10000;
        const pTarget = (prices[s.targetId]?.buys?.unit_price || 0) / 10000;
        const pWine = 0.2560; // 25s 60c

        // Requirements per craft
        const qSource = s.type === 'LODE' ? 2 : (s.type === 'RUNE' ? 10 : (s.type === 'COMMON' ? 250 : 50));
        const qDust = s.type === 'LODE' ? 1 : (s.type === 'RUNE' ? 0 : 5);
        const qWine = s.type === 'LODE' ? 1 : 0;
        // For fine/common we need 1 existing T6 as seed. For 1000 crafts, we still only need 1-5 seeds.
        const qTarget = (s.type === 'LODE' || s.type === 'RUNE') ? 0 : 0.01; // Amortized seed cost

        // TOTAL cost per craft in gold
        const costPerCraft = (qSource * pSource) + (qDust * pDust) + (qWine * pWine) + (qTarget * pTarget);

        // How many crafts fit in budget? 
        // We floor it to stay strictly under allocated budget.
        const batchSize = costPerCraft > 0 ? Math.max(1, Math.floor(allocatedGold / costPerCraft)) : 1;

        // Auto-Tracker: Check inventory
        const ownedSourceData = materials[s.sourceId] || { total: 0, storage: 0, bank: 0 };
        const ownedDustData = materials[IDS.DUST] || { total: 0, storage: 0, bank: 0 };
        const ownedTargetData = materials[s.targetId] || { total: 0, storage: 0, bank: 0 };

        const ownedSource = ownedSourceData.total;
        const ownedDust = ownedDustData.total;
        const ownedTarget = ownedTargetData.total;

        const neededSource = qSource * batchSize;
        const neededDust = qDust * batchSize;
        const neededTarget = (s.type === 'LODE' || s.type === 'RUNE') ? 0 : Math.min(batchSize, 5); // Seed logic

        // Calculate purchase mandates (Buy = Need - Have)
        const buySource = Math.max(0, neededSource - ownedSource);
        const buyDust = Math.max(0, neededDust - ownedDust);
        const buyTarget = Math.max(0, neededTarget - ownedTarget);
        const buyWine = qWine * batchSize;
        const buyCrystals = s.type === 'LODE' ? batchSize : 0;

        return {
            strategy: s,
            batchSize,
            allocatedGold,
            neededSource, buySource, ownedSource, ownedSourceData,
            neededDust, buyDust, ownedDust, ownedDustData,
            neededTarget, buyTarget, ownedTarget, ownedTargetData,
            buyWine, buyCrystals,
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

            {/* WIZARD AS CORE HEADER */}
            <NexusTracker
                list={shoppingList}
                isEng={isEng}
                onClose={onBack}
                budget={budgetGold}
                setBudget={setBudgetGold}
                wallet={availableGold}
                materials={materials}
            />

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
                                        <h3 className="font-bold text-white uppercase text-xs font-display">{getTranslatedName(item.strategy.targetId, item.strategy.name, isEng)}</h3>
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
                                        <span className="text-zinc-500 font-bold uppercase">{isEng ? 'Buy' : 'Comprar'} {getTranslatedName(item.strategy.sourceId, item.strategy.sourceName, isEng)}</span>
                                        <div className="text-right">
                                            <span className={`font-black ${item.buySource < item.neededSource ? 'text-emerald-400' : 'text-white'}`}>{item.buySource} u.</span>
                                            {item.buySource >= 250 && (
                                                <div className="text-[7px] text-indigo-400 font-black uppercase tracking-widest leading-none mt-0.5">
                                                    {Math.floor(item.buySource / 250)} STACK{Math.floor(item.buySource / 250) > 1 ? 'S' : ''}
                                                    {item.buySource % 250 > 0 ? ` + ${item.buySource % 250}` : ''}
                                                </div>
                                            )}
                                            {item.ownedSource > 0 && (
                                                <div className="text-[7px] text-zinc-500 uppercase tracking-tight flex flex-col items-end opacity-60">
                                                    {item.ownedSourceData.storage > 0 && <span>{isEng ? 'Storage' : 'Mat'}: {item.ownedSourceData.storage}</span>}
                                                    {item.ownedSourceData.bank > 0 && <span className="text-indigo-400">{isEng ? 'Bank' : 'Banco'}: {item.ownedSourceData.bank}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {item.neededDust > 0 && (
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-zinc-500 font-bold uppercase">{isEng ? 'Buy Dust' : 'Comprar Polvo'}</span>
                                            <div className="text-right">
                                                <span className={`font-black ${item.buyDust < item.neededDust ? 'text-emerald-400' : 'text-indigo-300'}`}>{item.buyDust} u.</span>
                                                {item.buyDust >= 250 && (
                                                    <div className="text-[7px] text-indigo-400 font-black uppercase tracking-widest leading-none mt-0.5">
                                                        {Math.floor(item.buyDust / 250)} STACK{Math.floor(item.buyDust / 250) > 1 ? 'S' : ''}
                                                        {item.buyDust % 250 > 0 ? ` + ${item.buyDust % 250}` : ''}
                                                    </div>
                                                )}
                                                {item.ownedDust > 0 && (
                                                    <div className="text-[7px] text-zinc-500 uppercase tracking-tight flex flex-col items-end opacity-60">
                                                        {item.ownedDustData.storage > 0 && <span>{isEng ? 'Storage' : 'Mat'}: {item.ownedDustData.storage}</span>}
                                                        {item.ownedDustData.bank > 0 && <span className="text-indigo-400">{isEng ? 'Bank' : 'Banco'}: {item.ownedDustData.bank}</span>}
                                                    </div>
                                                )}
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
