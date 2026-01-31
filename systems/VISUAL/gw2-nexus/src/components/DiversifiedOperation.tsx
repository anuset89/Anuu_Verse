
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Cpu, ShoppingCart, Hammer, Coins, CheckCircle, Package, Sparkles } from 'lucide-react';
import type { AnuuStrategy, MarketItem } from '../engine/calculator';
import { IDS, getTranslatedName } from '../engine/calculator';


import { getItemIcon } from '../utils/icons';

interface ShoppingListItem {
    strategy: AnuuStrategy;
    allocatedGold: number;
    neededSource: number; buySource: number; ownedSource: number; ownedSourceData: { storage: number, bank: number, character: number };
    neededDust: number; buyDust: number; ownedDust: number; ownedDustData: { storage: number, bank: number, character: number };
    neededTarget: number; buyTarget: number; ownedTarget: number; ownedTargetData: { storage: number, bank: number, character: number };
    buyWine: number;
    buyCrystals: number;
    batchSize: number;
    profit: number;
    priceSource: number;
}

// --- NEXUS TRACKER (TRADING WIZARD) ---
const NexusTracker = ({ list, isEng, onClose, budget, setBudget, wallet, materials, totalGrossSales, icons, prices }: {
    list: ShoppingListItem[],
    isEng: boolean,
    onClose: () => void,
    budget: number,
    setBudget: (n: number) => void,
    wallet: number,
    materials: Record<number, { total: number, storage: number, bank: number, character: number }>,
    totalGrossSales: number,
    icons: Record<number, string>,
    prices: Record<number, MarketItem>
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [manualCompleted, setManualCompleted] = useState<Set<string>>(new Set());

    const toggleTask = (taskId: string) => {
        const next = new Set(manualCompleted);
        if (next.has(taskId)) next.delete(taskId);
        else next.add(taskId);
        setManualCompleted(next);
    };

    // 1. Logistics: Consolidate Shopping List
    const logistics = list.reduce((acc, item) => {
        if (item.buySource > 0) {
            const name = getTranslatedName(item.strategy.sourceId, item.strategy.sourceName, isEng);
            const price = prices[item.strategy.sourceId]?.buys?.unit_price || 0;
            const existing = acc.find((x) => x.id === item.strategy.sourceId);
            if (existing) existing.count += item.buySource;
            else acc.push({ id: item.strategy.sourceId, name, count: item.buySource, type: 'source', price });
        }
        if (item.buyDust > 0) {
            const name = getTranslatedName(IDS.DUST, 'Crystalline Dust', isEng);
            const price = prices[IDS.DUST]?.buys?.unit_price || 0;
            const existing = acc.find((x) => x.id === IDS.DUST);
            if (existing) existing.count += item.buyDust;
            else acc.push({ id: IDS.DUST, name, count: item.buyDust, type: 'dust', price });
        }
        if (item.buyWine > 0) {
            const name = isEng ? 'Bottle of Elonian Wine' : 'Botella de vino de Elona';
            const price = 2560;
            const existing = acc.find((x) => x.id === 19632);
            if (existing) existing.count += item.buyWine;
            else acc.push({ id: 19632, name, count: item.buyWine, type: 'npc', price });
        }
        if (item.buyCrystals > 0) {
            const name = isEng ? 'Mystic Crystal' : 'Cristal místico';
            const existing = acc.find((x) => x.id === 19925);
            if (existing) existing.count += item.buyCrystals;
            else acc.push({ id: 19925, name, count: item.buyCrystals, type: 'shard', price: 0 });
        }
        if (item.buyTarget > 0 && item.strategy.type !== 'LODE') {
            const name = getTranslatedName(item.strategy.targetId, item.strategy.name, isEng);
            const price = prices[item.strategy.targetId]?.buys?.unit_price || 0;
            const existing = acc.find((x) => x.id === item.strategy.targetId);
            if (existing) existing.count += item.buyTarget;
            else acc.push({ id: item.strategy.targetId, name, count: item.buyTarget, type: 'target', price });
        }
        return acc;
    }, [] as { id: number, name: string, count: number, type: string, price: number }[]);

    // Logic to check if a task is "Auto-Completed" by inventory
    const isTaskDone = (taskId: string, itemId?: number, reqCount?: number) => {
        if (manualCompleted.has(taskId)) return true;

        // Auto-check for Inventory tasks (withdraw or buy)
        if (itemId !== undefined && reqCount !== undefined) {
            const ownedInBag = materials[itemId]?.character || 0;
            // For withdrawal, if it's already in bag, it's done. 
            // For buy, same thing.
            return ownedInBag >= reqCount;
        }
        return false;
    };

    const totalOrderGold = logistics.reduce((sum, l) => sum + (l.price * l.count), 0);

    // 2. Assembly: Forge Recipes
    const assembly = list.filter(item => item.batchSize > 0).map(item => ({
        id: item.strategy.targetId,
        name: getTranslatedName(item.strategy.targetId, item.strategy.name, isEng),
        batches: item.batchSize,
        recipe: item.strategy.recipe || (isEng ? "Standard Conversion" : "Conversión Estándar")
    }));

    const steps = [
        { id: 1, title: isEng ? 'Logistics' : 'Logística', icon: <ShoppingCart size={18} /> },
        { id: 2, title: isEng ? 'Synthesis' : 'Síntesis', icon: <Hammer size={18} /> },
        { id: 3, title: isEng ? 'Liquidation' : 'Liquidación', icon: <Coins size={18} /> }
    ];

    // Check progress of current step for auto-guidance
    const step1Done = logistics.every(l => isTaskDone(`buy-${l.id}`, l.id, l.count)) &&
        list.every(i => !i.ownedSource || isTaskDone(`withdraw-${i.strategy.id}`, i.strategy.sourceId, i.neededSource));

    // For step 2, we check if we have the RESULT items in inventory
    const step2Done = assembly.every(a => isTaskDone(`craft-${a.id}`, a.id, a.batches)); // Simplified check: have we made the batches?
    // Note: Checking precise yield (batches * 22 for common) might be tricky if user consumes them or has existing, 
    // but checking if we have MORE than before or "Enough" is a good proxy. 
    // For simplicity, let's assume if we have the *equivalent yield* in inventory, it's done.

    const canAdvance = (currentStep === 1 && step1Done) || (currentStep === 2 && step2Done);

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
                    <div className="hidden lg:flex flex-col items-end min-w-[120px]">
                        <div className="flex justify-between w-full mb-1">
                            <span className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">{isEng ? 'Mission Progress' : 'Progreso de Misión'}</span>
                            <span className="text-[7px] text-indigo-400 font-black">SYNC</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `100%` }}
                            />
                        </div>
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                </div>
            </div>

            {/* STEP CONTENT */}
            <div className="min-h-[250px] relative z-10">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-8">

                            {/* STRATEGIC BRIEFING & OUTCOME */}
                            <div className="matte-card bg-indigo-500/5 border-indigo-500/30 p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><CheckCircle size={120} /></div>
                                <div className="relative z-10">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                        <Sparkles size={14} className="animate-pulse" /> {isEng ? 'Mission Briefing: Expected Outcome' : 'Briefing de Misión: Resultado Esperado'}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {list.map((item, idx) => {
                                            const yieldAmount = item.strategy.type === 'FINE' ? item.batchSize * 7 : item.strategy.type === 'COMMON' ? item.batchSize * 22 : item.batchSize;
                                            return (
                                                <div key={idx} className="flex flex-col gap-2 p-5 bg-black/60 rounded-3xl border border-white/5 shadow-2xl group hover:border-indigo-500/30 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 flex-shrink-0 bg-black/40 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            {icons[item.strategy.targetId] ? (
                                                                <img src={icons[item.strategy.targetId]} alt="" className="w-8 h-8 object-contain" />
                                                            ) : (
                                                                <span className="text-2xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                                                    {getItemIcon(item.strategy.name)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black text-white uppercase tracking-tight truncate leading-tight">
                                                                {getTranslatedName(item.strategy.targetId, item.strategy.name, isEng)}
                                                            </span>
                                                            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{item.strategy.type} OPS</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-baseline gap-1.5 mt-2">
                                                        <span className="text-3xl font-black text-indigo-400">+{yieldAmount}</span>
                                                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">u.</span>
                                                    </div>
                                                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-2 border-t border-white/5 pt-3 italic opacity-80">
                                                        {item.strategy.recipe}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* TACTICAL EXECUTION SEQUENCE */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black font-display">0</div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{isEng ? 'Protocol Zero: Inventory Clearance' : 'Protocolo Cero: Limpieza de Inventario'}</h4>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                                            {isEng ? 'Extract materials already detected in your storage to minimize capital risk.' : 'Extrae materiales ya detectados en tus almacenes para minimizar el riesgo de capital.'}
                                        </p>
                                    </div>
                                </div>

                                {list.some(item => item.ownedSource > 0 || item.ownedDust > 0) ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {list.map((item, idx) => (
                                            (item.ownedSource > 0 || item.ownedDust > 0) && (
                                                <div
                                                    key={idx}
                                                    onClick={() => toggleTask(`withdraw-${item.strategy.id}`)}
                                                    className={`matte-card p-5 cursor-pointer transition-all flex flex-col gap-4 border-2 ${isTaskDone(`withdraw-${item.strategy.id}`, item.strategy.sourceId, item.neededSource) ? 'bg-emerald-500/10 border-emerald-500/40 opacity-50' : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'}`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${isTaskDone(`withdraw-${item.strategy.id}`, item.strategy.sourceId, item.neededSource) ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                            {isTaskDone(`withdraw-${item.strategy.id}`, item.strategy.sourceId, item.neededSource) ? (isEng ? 'COMPLETED' : 'COMPLETADO') : (isEng ? 'BANK WITHDRAWAL' : 'RETIRAR DEL BANCO')}
                                                        </div>
                                                        {isTaskDone(`withdraw-${item.strategy.id}`, item.strategy.sourceId, item.neededSource) ? <CheckCircle size={14} className="text-emerald-500" /> : <Package size={14} className="text-amber-500/40" />}
                                                    </div>
                                                    <div className="space-y-3">
                                                        {item.ownedSource > 0 && (
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 flex-shrink-0 bg-black/40 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center">
                                                                        {icons[item.strategy.sourceId] ? (
                                                                            <img src={icons[item.strategy.sourceId]} alt="" className="w-8 h-8 object-contain" />
                                                                        ) : (
                                                                            <span className="text-2xl">{getItemIcon(item.strategy.sourceName)}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-black text-white uppercase truncate max-w-[140px] leading-tight">{getTranslatedName(item.strategy.sourceId, item.strategy.sourceName, isEng)}</span>
                                                                        <div className="flex gap-1.5 opacity-60">
                                                                            {item.ownedSourceData.bank > 0 && <span className="text-[7px] text-indigo-400 font-bold uppercase">{isEng ? 'Bank' : 'Banco'}: {item.ownedSourceData.bank}</span>}
                                                                            {item.ownedSourceData.character > 0 && <span className="text-[7px] text-amber-400 font-bold uppercase">{isEng ? 'Bag' : 'Bolsa'}: {item.ownedSourceData.character}</span>}
                                                                            {item.ownedSourceData.storage > 0 && <span className="text-[7px] text-zinc-500 font-bold uppercase">{isEng ? 'Storage' : 'Almacén'}: {item.ownedSourceData.storage}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xl font-black text-amber-400">x{Math.min(item.ownedSource, item.neededSource)}</div>
                                                            </div>
                                                        )}
                                                        {item.ownedDust > 0 && (
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-2xl">✨</span>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-black text-white uppercase">{isEng ? 'Crystalline Dust' : 'Polvo Cristalino'}</span>
                                                                        <div className="flex gap-1.5 opacity-60">
                                                                            {item.ownedDustData.bank > 0 && <span className="text-[7px] text-indigo-400 font-bold uppercase">{isEng ? 'Bank' : 'Banco'}: {item.ownedDustData.bank}</span>}
                                                                            {item.ownedDustData.character > 0 && <span className="text-[7px] text-amber-400 font-bold uppercase">{isEng ? 'Bag' : 'Bolsa'}: {item.ownedDustData.character}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xl font-black text-amber-400">x{Math.min(item.ownedDust, item.neededDust)}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-2xl border border-white/5 bg-white/5 text-center flex flex-col items-center gap-2 opacity-60">
                                        <Package size={24} className="text-zinc-600" />
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{isEng ? 'NO OWNED MATERIALS DETECTED' : 'NO SE DETECTARON MATERIALES EN PROPIEDAD'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black font-display">1</div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{isEng ? 'Protocol One: Bazar & Procurement' : 'Protocolo Uno: Bazar y Adquisición'}</h4>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed max-w-xl">
                                                {isEng ? 'THIS IS YOUR SHOPPING LIST. Place BUY ORDERS in the Trading Post for maximum profit. NPC items (Wine) require direct gold.' : 'ESTA ES TU LISTA DE LA COMPRA. Pon ÓRDENES DE COMPRA en el Bazar para maximizar margen. Los ítems de NPC (Vino) requieren oro directo.'}
                                            </p>
                                        </div>
                                    </div>

                                    {totalOrderGold > 0 && (
                                        <div className="bg-black/40 px-5 py-3 rounded-2xl border border-emerald-500/30 text-right">
                                            <div className="text-[8px] text-emerald-500 font-black uppercase tracking-widest mb-1">{isEng ? 'TOTAL PROCUREMENT INVESTMENT' : 'INVERSIÓN TOTAL EN BAZAR'}</div>
                                            <GoldDisplay amount={totalOrderGold} size="lg" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {logistics.length === 0 ? (
                                        <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-center flex flex-col items-center gap-4">
                                            <div className="p-4 bg-emerald-500/10 rounded-full"><Package size={32} /></div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase mb-1">{isEng ? 'Inventory Optimized' : 'Inventario Optimizado'}</h4>
                                                <p className="text-[10px] opacity-70 uppercase tracking-widest">{isEng ? 'All required materials detected in storage.' : 'Todos los materiales detectados en almacén.'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        logistics.map((l, i) => (
                                            <div
                                                key={i}
                                                onClick={() => toggleTask(`buy-${l.id}`)}
                                                className={`flex justify-between items-center p-5 rounded-2xl border relative cursor-pointer transition-all shadow-xl ${isTaskDone(`buy-${l.id}`, l.id, l.count) ? 'bg-emerald-500/10 border-emerald-500/40 opacity-50' : (l.type === 'npc' || l.type === 'shard' ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40' : 'bg-white/5 border-white/5 hover:border-emerald-500/30')}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5 ${isTaskDone(`buy-${l.id}`, l.id, l.count) ? 'bg-emerald-500/20 text-emerald-400' : (l.type === 'dust' ? 'bg-indigo-500/20 text-indigo-300' : l.type === 'npc' || l.type === 'shard' ? 'bg-amber-500/10 text-amber-500' : 'bg-black/40 text-zinc-300')}`}>
                                                        {isTaskDone(`buy-${l.id}`, l.id, l.count) ? <CheckCircle size={24} /> : (icons[l.id] ? (
                                                            <img src={icons[l.id]} alt="" className="w-10 h-10 object-contain" />
                                                        ) : (
                                                            <span className="text-xl">{l.type === 'npc' ? '🍷' : l.type === 'shard' ? '🧊' : getItemIcon(l.name)}</span>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <span className={`font-black uppercase tracking-tight text-xs block mb-0.5 ${l.type === 'dust' ? 'text-indigo-300' : l.type === 'npc' || l.type === 'shard' ? 'text-amber-400' : 'text-zinc-200'}`}>{l.name}</span>
                                                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest leading-tight flex items-center gap-2">
                                                            {l.type === 'npc' ? (isEng ? 'NPX Vendor (25s 60c)' : 'Vendedor NPC (25s 60c)') :
                                                                l.type === 'shard' ? (isEng ? 'Miyani (Spirit Shards)' : 'Miyani (Exc. Shards)') :
                                                                    (isEng ? 'Market Acquire (Buy Order)' : 'Adquirir en Mercado (Orden Compra)')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2">
                                                    {l.price > 0 && (
                                                        <div className="flex flex-col items-end">
                                                            <div className="text-[7px] text-zinc-600 font-black uppercase tracking-tighter mb-0.5">{isEng ? 'UNIT BUY ORDER' : 'ORDEN COMPRA U.'}</div>
                                                            <GoldDisplay amount={l.price} size="sm" />
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col items-end bg-black/40 p-2 rounded-xl border border-white/5 min-w-[100px]">
                                                        <div className="text-[7px] text-zinc-500 font-black uppercase tracking-widest mb-1">
                                                            {isEng ? 'PENDING' : 'PENDIENTE'} <span className="text-white ml-2 text-base font-mono">x{l.count}</span>
                                                        </div>
                                                        {l.price > 0 ? (
                                                            <GoldDisplay amount={l.price * l.count} size="md" />
                                                        ) : (
                                                            l.type === 'shard' && (
                                                                <div className="flex items-center gap-1.5 text-indigo-400 font-mono font-bold text-sm">
                                                                    <Sparkles size={12} />
                                                                    <span>{Math.ceil(l.count * 0.6)} <span className="text-[10px] opacity-60">SHARDS</span></span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                {l.count >= 250 && (
                                                    <span className="text-[9px] text-indigo-300 font-black uppercase tracking-tighter block mt-1">
                                                        {Math.floor(l.count / 250)} STACK{Math.floor(l.count / 250) > 1 ? 'S' : ''}
                                                        {l.count % 250 > 0 ? ` + ${l.count % 250}` : ''}
                                                    </span>
                                                )}
                                                {materials[l.id] && materials[l.id].total > 0 && (
                                                    <div className="text-[7px] text-zinc-600 font-black uppercase flex flex-col items-end opacity-60 mt-1">
                                                        {materials[l.id].storage > 0 && <span>{isEng ? 'In Storage' : 'En Almacén'}: {materials[l.id].storage}</span>}
                                                        {materials[l.id].bank > 0 && <span className="text-indigo-400">{isEng ? 'In Bank' : 'En Banco'}: {materials[l.id].bank}</span>}
                                                        {materials[l.id].character > 0 && <span className="text-amber-500">{isEng ? 'In Bag' : 'En Bolsa'}: {materials[l.id].character}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <h4 className="flex items-center gap-3 text-amber-400 font-black uppercase tracking-widest text-lg mb-6">
                                <Hammer /> {isEng ? 'Phase 2: Processing' : 'Fase 2: Procesado'}
                            </h4>
                            <div className="border-l-2 border-indigo-500 pl-4 mb-8">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{isEng ? 'Phase 2: Mystic Assembly' : 'Fase 2: Ensamblaje Místico'}</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                                    {isEng ? 'Execute forge translations following the exact recipes provided. Do not deviate from these ratios for optimal yield.' : 'Ejecuta las traducciones en la forja siguiendo las recetas exactas proporcionadas. No te desvíes de estos ratios para asegurar el rendimiento óptimo.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {assembly.map((a, i) => {
                                    // Calculate expected yield for auto-check
                                    // We need to know the Strategy Type to know yield. 
                                    // Since 'assembly' is mapped from 'list', let's find the original strategy type.
                                    // A simplified lookup or passing it in 'assembly' map is better.
                                    // For now, let's use a rough heuristic or just manual toggle if precise count is hard.
                                    // Actually, let's IMPROVE assembly map above (in a separate edit if needed, but here we can try to find it)
                                    const sourceItem = list.find(l => l.strategy.targetId === a.id);
                                    const strategyType = sourceItem?.strategy.type || 'COMMON';
                                    const yieldPerBatch = strategyType === 'FINE' ? 7 : (strategyType === 'COMMON' ? (sourceItem?.strategy.name.includes('Ecto') ? 0.9 : 22) : 1);
                                    const expectedCount = Math.floor(a.batches * yieldPerBatch);

                                    const isDone = isTaskDone(`craft-${a.id}`, a.id, expectedCount);

                                    return (
                                        <div
                                            key={i}
                                            onClick={() => toggleTask(`craft-${a.id}`)}
                                            className={`flex justify-between items-center p-6 rounded-2xl border transition-all relative group cursor-pointer ${isDone ? 'bg-emerald-500/10 border-emerald-500/40 opacity-50' : 'bg-white/5 border-white/5 hover:border-indigo-500/40'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`text-3xl p-3 rounded-xl border flex items-center justify-center transition-transform ${isDone ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400' : 'bg-black/40 border-white/5 group-hover:scale-110'}`}>
                                                    {isDone ? <CheckCircle size={32} /> : getItemIcon(a.name)}
                                                </div>
                                                <div>
                                                    <span className={`font-black uppercase text-xs block mb-1 ${isDone ? 'text-emerald-400 decoration-emerald-500/50' : 'text-white'}`}>{a.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${isDone ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-black/40 border-white/5 text-zinc-500'}`}>{a.batches} {isEng ? 'BATCHES' : 'OPS'}</span>
                                                        <span className="text-[9px] text-indigo-400 font-bold italic">{a.recipe}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`p-2 transition-colors ${isDone ? 'text-emerald-500' : 'text-indigo-500/20 group-hover:text-indigo-500/40'}`}>
                                                {isDone ? <CheckCircle size={32} /> : <Hammer size={32} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 border-l-2 border-red-500 pl-3">
                                {isEng ? 'Phase 3: Market Liquidation. List items at Sell Price.' : 'Fase 3: Liquidación de Mercado. Publica los ítems a Precio de Venta.'}
                            </p>

                            <div className="matte-card p-16 text-center relative overflow-hidden h-[300px] flex flex-col items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>
                                <div className="relative z-10">
                                    <p className="text-zinc-600 mb-6 text-[11px] font-black uppercase tracking-[0.5em] font-display">{isEng ? 'TOTAL PROJECTED RETURN' : 'RETORNO TOTAL PROYECTADO'}</p>
                                    <GoldDisplay amount={totalGrossSales} size="xl" />
                                    <div className="mt-8 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg font-black uppercase tracking-widest">
                                        {isEng ? 'Wait for Sell listings to complete' : 'Espera a que los listados de venta se completen'}
                                    </div>
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
                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 3
                                ? 'bg-white text-black hover:bg-emerald-500 hover:text-white'
                                : canAdvance
                                    ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-pulse hover:bg-indigo-400 scale-105'
                                    : 'bg-white/10 text-zinc-500 hover:bg-white hover:text-black'
                            }`}
                    >
                        {currentStep === 3 ? (isEng ? 'Finish' : 'Terminar') : (isEng ? 'Next' : 'Siguiente')}
                    </button>
                </div>
            </div>
        </div >
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

export const DiversifiedOperation = ({ strategies, wallet, prices, materials, onBack, isEng, icons }: {
    strategies: AnuuStrategy[];
    wallet: Record<number, number>;
    prices: Record<number, MarketItem>;
    materials: Record<number, { total: number, storage: number, bank: number, character: number }>; // Inventory
    onBack: () => void;
    isEng: boolean;
    icons: Record<number, string>;
}) => {
    const availableGold = (wallet[1] || 0) / 10000; // Convert copper to gold
    const [budgetGold, setBudgetGold] = useState(availableGold > 0 ? Math.floor(availableGold) : 10);
    const [hasInitialBudget, setHasInitialBudget] = useState(false);

    // Sync budget with wallet on first load when data arrives
    useEffect(() => {
        if (!hasInitialBudget && availableGold > 0) {
            setBudgetGold(Math.floor(availableGold));
            setHasInitialBudget(true);
        }
    }, [availableGold, hasInitialBudget]);

    // 1. Pre-calculate inventory scores to determine priority
    const prioritizedStrategies = [...strategies].map(s => {
        const qSource = s.type === 'LODE' ? 2 : (s.type === 'RUNE' ? 10 : (s.type === 'COMMON' ? 250 : 50));
        const qDust = s.type === 'LODE' ? 1 : (s.type === 'RUNE' ? 0 : 5);

        const ownedS = materials[s.sourceId]?.total || 0;
        const ownedD = materials[IDS.DUST]?.total || 0;

        // Executability Score: potential batches we can do with current stock
        const score = Math.min(ownedS / qSource, qDust > 0 ? ownedD / qDust : Infinity);
        return { strategy: s, score };
    }).sort((a, b) => b.score - a.score);

    // --- NEW ADAPTIVE BUDGETER: Inventory Completion First ---

    // 1. Calculate the 'Maintenance Cost' (Wine/Crystals) to process everything currently in inventory
    const inventoryNeeds = prioritizedStrategies.map(p => {
        const s = p.strategy;
        const qSource = s.type === 'LODE' ? 2 : (s.type === 'RUNE' ? 10 : (s.type === 'COMMON' ? 250 : 50));
        const qDust = s.type === 'LODE' ? 1 : (s.type === 'RUNE' ? 0 : 5);
        const qWine = s.type === 'LODE' ? 1 : 0;

        const pWine = 0.2560;

        const ownedS = materials[s.sourceId]?.total || 0;
        const ownedD = materials[IDS.DUST]?.total || 0;

        // How many batches can we support with CURRENT inventory?
        const freeBatches = Math.floor(Math.min(ownedS / qSource, qDust > 0 ? ownedD / qDust : Infinity));

        // Cost to finish these batches (buying missing wine)
        const costToFinish = freeBatches * (qWine * pWine);

        return { strategy: s, freeBatches, costToFinish, score: p.score };
    }).sort((a, b) => (b.freeBatches * b.strategy.profitPerCraft) - (a.freeBatches * a.strategy.profitPerCraft));

    // --- NEW ADAPTIVE BUDGETER: Sequential Capital Allocation ---
    const calculateShoppingList = () => {
        // Reserve 10% of budget for listing fees (upfront cash requirement)
        const operationalReserve = budgetGold * 0.10;
        let flexibleBudget = budgetGold - operationalReserve;
        const totalStrats = prioritizedStrategies.length;
        const defaultWeight = 1 / Math.max(1, totalStrats);

        // Mutable results array to track batch sizes across passes
        const results = inventoryNeeds.map(need => ({
            ...need,
            batchSize: 0
        }));

        // PASS 1: Inventory Maintenance (Process what we HAVE first)
        // We iterate through all strategies and fund the processing of existing stock
        results.forEach(res => {
            const qWine = res.strategy.type === 'LODE' ? 1 : 0;
            const pWine = 0.2560; // Wine cost in gold
            const maintenanceCostPerBatch = qWine * pWine;

            // freeBatches is pre-calculated based on inventory limits
            if (flexibleBudget > 0 && res.freeBatches > 0) {
                // Determine how many of the "free" batches we can actually afford the FEES for
                const canAfford = maintenanceCostPerBatch > 0
                    ? Math.floor(flexibleBudget / maintenanceCostPerBatch)
                    : res.freeBatches;

                const executed = Math.min(res.freeBatches, canAfford);
                res.batchSize += executed;

                // Deduct only the maintenance cost (wine), as mats are owned
                flexibleBudget -= (executed * maintenanceCostPerBatch);
            }
        });

        // PASS 2: Expansion (Buy NEW materials with remaining budget)
        results.forEach(res => {
            const s = res.strategy;

            // Get prices (in Gold)
            const pSource = (prices[s.sourceId]?.buys?.unit_price || prices[s.sourceId]?.sells?.unit_price || 0) / 10000;
            const pDust = (prices[IDS.DUST]?.buys?.unit_price || prices[IDS.DUST]?.sells?.unit_price || 0) / 10000;
            const pTarget = (prices[s.targetId]?.buys?.unit_price || prices[s.targetId]?.sells?.unit_price || 0) / 10000;
            const pWine = 0.2560;

            // Quantities
            const qSource = s.type === 'LODE' ? 2 : (s.type === 'RUNE' ? 10 : (s.type === 'COMMON' ? 250 : 50));
            const qDust = s.type === 'LODE' ? 1 : (s.type === 'RUNE' ? 0 : 5);
            const qWine = s.type === 'LODE' ? 1 : 0;
            const qTarget = (s.type === 'LODE' || s.type === 'RUNE') ? 0 : 0.01;

            // Full Cost to buy Everything for 1 batch
            const costPerCraft = (qSource * pSource) + (qDust * pDust) + (qWine * pWine) + (qTarget * pTarget);

            if (flexibleBudget > 0 && costPerCraft > 0) {
                const extra = Math.floor(flexibleBudget / costPerCraft);
                res.batchSize += extra;
                flexibleBudget -= (extra * costPerCraft);
            }
        });

        // Final Mapping to ShoppingListItem format
        return results.map(res => {
            const s = res.strategy;
            const batchSize = res.batchSize;

            // Re-fetch prices for final object construction
            const pSource = (prices[s.sourceId]?.buys?.unit_price || prices[s.sourceId]?.sells?.unit_price || 0) / 10000;
            const qSource = s.type === 'LODE' ? 2 : (s.type === 'RUNE' ? 10 : (s.type === 'COMMON' ? 250 : 50));
            const qDust = s.type === 'LODE' ? 1 : (s.type === 'RUNE' ? 0 : 5);
            const qWine = s.type === 'LODE' ? 1 : 0;

            const ownedSourceData = materials[s.sourceId] || { total: 0, storage: 0, bank: 0, character: 0 };
            const ownedDustData = materials[IDS.DUST] || { total: 0, storage: 0, bank: 0, character: 0 };
            const ownedTargetData = materials[s.targetId] || { total: 0, storage: 0, bank: 0, character: 0 };

            // We calculate 'allocatedGold' as an approximation of value deployed, though flexibleBudget tracked the specific cash flow
            // For the UI, we want to show the cost of what we are buying/processing
            // Actually, let's just use the full market value of the batch for "allocatedGold" as it represents the investment size
            // OR even better, just what we are Spending from wallet? The User asked for budget respect.
            // Let's stick to full cost for "Allocation" bars, but actual spending is limited by the algo above.

            // Recalculating strict buying needs based on final batchSize
            const neededSource = qSource * batchSize;
            const neededDust = qDust * batchSize;
            const neededTarget = (s.type === 'LODE' || s.type === 'RUNE') ? 0 : Math.min(batchSize, 5);

            return {
                strategy: s,
                batchSize,
                allocatedGold: (batchSize * ((qSource * pSource) + (qDust * 0) + (qWine * 0.2560))), // Approx
                neededSource,
                buySource: Math.max(0, neededSource - ownedSourceData.total),
                ownedSource: ownedSourceData.total, ownedSourceData,
                neededDust,
                buyDust: Math.max(0, neededDust - ownedDustData.total),
                ownedDust: ownedDustData.total, ownedDustData,
                neededTarget,
                buyTarget: Math.max(0, neededTarget - ownedTargetData.total),
                ownedTarget: ownedTargetData.total, ownedTargetData,
                buyWine: qWine * batchSize,
                buyCrystals: (s.type === 'LODE') ? batchSize : 0,
                profit: s.profitPerCraft * batchSize,
                priceSource: pSource * 10000,
                inventoryScore: res.score,
                weight: defaultWeight
            };
        }).filter(item => item.batchSize > 0);
    };

    const shoppingList = calculateShoppingList();
    const weightPerStrategy = 1 / Math.max(1, shoppingList.length);

    // Financial calculations using Actual Buy Amounts (Auto-Tracker applied)
    const totalGrossSales = shoppingList.reduce((acc, item) => acc + (item.batchSize * (prices[item.strategy.targetId]?.sells?.unit_price || 0) * (item.strategy.type === 'COMMON' ? (item.strategy.name.includes('Ecto') ? 0.9 : 22) : (item.strategy.type === 'FINE' ? 7 : 1))), 0);
    const totalNpcFees = shoppingList.reduce((acc, item) => acc + (item.buyWine * 2560), 0);
    const totalMarketBuy = shoppingList.reduce((acc, item) => {
        const itemP = (prices[item.strategy.sourceId]?.buys?.unit_price || prices[item.strategy.sourceId]?.sells?.unit_price || 0);
        const dustP = (prices[IDS.DUST]?.buys?.unit_price || prices[IDS.DUST]?.sells?.unit_price || 0);
        const targetP = (prices[item.strategy.targetId]?.buys?.unit_price || prices[item.strategy.targetId]?.sells?.unit_price || 0);
        return acc + (item.buySource * itemP) + (item.buyDust * dustP) + (item.buyTarget * targetP);
    }, 0);

    const totalInvested = totalMarketBuy + totalNpcFees;
    const listingFees = totalGrossSales * 0.05; // 5% Upfront cash required to list
    const tpFees = totalGrossSales * 0.15; // Total 15% (including the 5% listing)
    const netProfit = totalGrossSales - tpFees - totalInvested;
    const roiPercentage = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;

    // Check if the user has enough gold for the listing fees apart from logic
    const totalCashRequired = totalInvested + listingFees;
    const isBudgetExceeded = (totalCashRequired / 10000) > availableGold;

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
                totalGrossSales={totalGrossSales}
                icons={icons}
                prices={prices}
            />

            {/* FINANCIAL PROJECTION PANEL */}
            <div className="mt-8">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4 pl-1">{isEng ? 'Financial Telemetry' : 'Telemetría Financiera'}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="matte-card p-4 border-l-2 border-indigo-500 bg-black/40">
                        <div className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">{isEng ? 'Market Investment' : 'Inversión Mercado'}</div>
                        <GoldDisplay amount={totalMarketBuy} size="lg" />
                    </div>
                    <div className="matte-card p-4 border-l-2 border-amber-500/50 bg-black/40">
                        <div className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">{isEng ? 'NPC Fees (Wine)' : 'Tasas NPC (Vino)'}</div>
                        <GoldDisplay amount={totalNpcFees} size="lg" />
                    </div>
                    <div className="matte-card p-4 border-l-2 border-emerald-500 bg-black/40">
                        <div className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">{isEng ? 'Gross Projected Sales' : 'Ventas Brutas Proyectadas'}</div>
                        <GoldDisplay amount={totalGrossSales} size="lg" />
                    </div>
                    <div className="matte-card p-4 border-l-2 border-red-500/50 bg-black/40">
                        <div className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">{isEng ? 'Listing Fee (5% Upfront)' : 'Tasa Listado (5% Adelanto)'}</div>
                        <div className="text-red-400 font-mono font-bold">-<GoldDisplay amount={listingFees} size="lg" /></div>
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

                {isBudgetExceeded && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 animate-bounce">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-500"><Coins size={20} /></div>
                        <div>
                            <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">{isEng ? 'Liquidity Alert' : 'Alerta de Liquidez'}</h4>
                            <p className="text-[9px] text-red-500/80 uppercase font-bold">{isEng ? 'You need more gold in wallet to pay the listing fees!' : '¡Necesitas más oro en la cartera para pagar las tasas de listado!'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* STRATEGY BREAKDOWN */}
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6 text-center">{isEng ? 'Detailed Strategy Breakdown' : 'Desglose Detallado de Estrategia'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {shoppingList.map((item, idx) => (
                        <div key={idx} className="matte-card p-6 border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 text-6xl font-black text-zinc-700">{idx + 1}</div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{isEng ? 'Allocation' : 'Asignación'}: {Math.round(weightPerStrategy * 100)}% ({Math.floor(item.allocatedGold)}g)</h4>
                                    {item.inventoryScore > 0 && (
                                        <span className="text-[7px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-black uppercase tracking-tighter animate-pulse">
                                            {isEng ? 'PRIORITY: STOCK AVAILABLE' : 'PRIORIDAD: STOCK DISPONIBLE'}
                                        </span>
                                    )}
                                </div>
                                <div className="h-1 w-full bg-zinc-800 rounded-full mb-6 overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${weightPerStrategy * 100}%` }}></div>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 flex-shrink-0 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
                                        {icons[item.strategy.targetId] ? (
                                            <img src={icons[item.strategy.targetId]} alt="" className="w-10 h-10 object-contain" />
                                        ) : (
                                            <span className="text-3xl">{getItemIcon(item.strategy.name)}</span>
                                        )}
                                    </div>
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
