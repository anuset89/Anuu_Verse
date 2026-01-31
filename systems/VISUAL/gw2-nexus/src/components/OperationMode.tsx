
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, TrendingUp, ShoppingCart, Database, Clock, Sparkles, MapPin, FlaskConical, Gavel, RefreshCcw } from 'lucide-react';
import type { AnuuStrategy, MarketItem } from '../engine/calculator';
import { IDS, getTranslatedName } from '../engine/calculator';
import { GoldDisplay } from './common/GoldDisplay';
import { getItemIcon } from '../utils/icons';

export const OperationMode = ({ strategy, materials, wallet, prices, onBack, isEng }: {
    strategy: AnuuStrategy;
    materials: Record<number, number>;
    wallet: Record<number, number>;
    prices: Record<number, MarketItem>;
    onBack: () => void;
    isEng: boolean;
}) => {
    const [step, setStep] = useState(1);
    const [batchSize, setBatchSize] = useState(10);

    // PRICES
    const pSource = prices[strategy.sourceId];
    const pDust = prices[IDS.DUST];
    const pTarget = prices[strategy.targetId];

    const priceOrderSource = pSource?.buys?.unit_price || 0;
    const priceInstaSource = pSource?.sells?.unit_price || 0;
    const priceOrderDust = pDust?.buys?.unit_price || 0;
    const priceOrderTarget = pTarget?.buys?.unit_price || 0;
    const priceInstaTarget = pTarget?.sells?.unit_price || 0;

    const ownedSource = materials[strategy.sourceId] || 0;
    const ownedDust = materials[IDS.DUST] || 0;
    const ownedTarget = materials[strategy.targetId] || 0;
    const ownedShards = wallet[23] || 0;
    const availableGold = wallet[1] || 0;

    const isCommon = strategy.type === 'COMMON';
    const isRune = strategy.type === 'RUNE';
    const isLode = strategy.type === 'LODE';

    const sourcePerCraft = isLode ? 2 : (isRune ? 10 : (isCommon ? 250 : 50));
    const yieldPerCraft = isLode ? 1 : (isRune ? 1 : (isCommon ? 22 : 7));
    const usesDust = strategy.type !== 'RUNE';
    const dustPerCraft = isLode ? 1 : 5;

    const neededSource = sourcePerCraft * batchSize;
    const neededDust = (usesDust ? dustPerCraft : 0) * batchSize;

    // Seed logic: For material promotion (Fine/Common), we strictly need only a small fixed seed (e.g. 5 units)
    // to start the Mystic Forge cycle, regardless of how many thousands of conversions we plan to do.
    // Exception: If batchSize < 5, we only need batchSize.
    const neededTarget = (isLode || isRune) ? 0 : Math.min(batchSize, 5);

    const buySource = Math.max(0, neededSource - ownedSource);
    const buyDust = Math.max(0, neededDust - ownedDust);
    const buyTarget = (isLode || isRune) ? 0 : Math.max(0, neededTarget - ownedTarget);

    const buyWine = isLode ? batchSize : 0;

    const totalGoldCost = (buySource * priceOrderSource) + (buyDust * priceOrderDust) + (buyTarget * priceOrderTarget) + (buyWine * 2560);

    const neededStones = (isLode ? 0 : (isRune ? 0 : 5)) * batchSize;
    const neededCrystals = isLode ? batchSize : 0;
    const totalShardCost = (neededStones * 0.1) + (neededCrystals * 0.6);
    const neededShardsRequirement = Math.ceil(totalShardCost);

    const isWeekend = [0, 5, 6].includes(new Date().getDay());
    const multiplier = isWeekend ? (isCommon ? 0.05 : 0.25) : (isCommon ? 0.02 : 0.15);
    const recommendedBatch = Math.floor(strategy.supplyQty * multiplier);

    const costPerCraft = (sourcePerCraft * priceOrderSource) + (neededDust / batchSize * priceOrderDust) + (isLode || isRune ? 0 : priceOrderTarget) + (isLode ? 2560 : 0);
    const maxByShards = totalShardCost > 0 ? Math.floor(ownedShards / (totalShardCost / batchSize)) : 10000;
    const maxByGold = costPerCraft > 0 ? Math.floor(availableGold / costPerCraft) : 0;
    const safeMax = Math.max(0, Math.min(maxByShards, maxByGold));

    const shoppingList = [
        { name: getTranslatedName(strategy.sourceId, strategy.sourceName, isEng), icon: getItemIcon(strategy.sourceName), need: neededSource, have: ownedSource, buy: buySource, priceOrder: priceOrderSource, priceInsta: priceInstaSource, supply: pSource?.sells.quantity || 0 },
        ...(usesDust ? [{ name: getTranslatedName(IDS.DUST, "Crystalline Dust", isEng), icon: "✨", need: neededDust, have: ownedDust, buy: buyDust, priceOrder: priceOrderDust, priceInsta: prices[IDS.DUST]?.sells.unit_price || 0, supply: pDust?.sells.quantity || 0 }] : []),
        ...(isLode ? [{ name: getTranslatedName(IDS.WINE, "Elonian Wine", isEng), icon: "🍷", need: batchSize, have: 0, buy: batchSize, priceOrder: 2560, priceInsta: 2560, supply: 999999 }] : []),
        ...(!isLode ? [{ name: getTranslatedName(strategy.targetId, strategy.name, isEng), icon: getItemIcon(strategy.name), need: neededTarget, have: ownedTarget, buy: buyTarget, priceOrder: priceOrderTarget, priceInsta: priceInstaTarget, supply: pTarget?.sells.quantity || 0 }] : []),
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <button onClick={onBack} className="matte-card px-5 py-3 text-zinc-500 text-[10px] hover:text-white transition-all uppercase tracking-[0.2em] font-black border-white/5 flex items-center gap-2 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {isEng ? 'Back to Nexus' : 'Volver al Nexo'}
                </button>
                <div className="flex flex-col items-start md:items-end">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase font-display tracking-tight">
                        {getTranslatedName(strategy.targetId, strategy.name, isEng)}
                    </h2>
                    <span className={`text-[9px] font-black px-3 py-1 rounded bg-black/40 border border-white/5 uppercase tracking-widest ${strategy.type === 'RUNE' ? 'text-indigo-400' : 'text-zinc-500'}`}>{strategy.type} {isEng ? 'Analysis' : 'Análisis'}</span>
                </div>
            </div>

            <div className="flex bg-black/40 p-1.5 rounded-[20px] border border-white/5 shadow-inner relative">
                {[1, 2, 3].map(i => (
                    <button key={i} onClick={() => setStep(i)} className={`flex-1 py-4 rounded-[14px] text-[10px] font-black tracking-widest transition-all font-display ${step === i ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-zinc-600 hover:text-zinc-300 uppercase'}`}>
                        {i}. {i === 1 ? (isEng ? 'ACQUISITION' : 'ADQUISICIÓN') : i === 2 ? (strategy.type === 'RUNE' ? (isEng ? 'PROCESS' : 'PROCESO') : (isEng ? 'FORGE' : 'FORJA')) : i === 3 ? (isEng ? 'SELL' : 'VENTA') : ''}
                    </button>
                ))}
            </div>

            {step === 1 && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 matte-card p-8 flex flex-col gap-8">
                            <div className="flex items-center gap-8">
                                <div className="p-6 bg-black/40 rounded-3xl border border-white/5"><Package className="text-indigo-500" size={32} /></div>
                                <div className="flex-1">
                                    <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3 font-display">{isEng ? 'Scale Operation' : 'Escalar Operación'}</h3>
                                    <div className="flex gap-3 items-center">
                                        <input type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 0))} className="matte-input px-5 py-3.5 text-white font-mono w-full text-base focus:outline-none" />
                                        <button onClick={() => setBatchSize(safeMax)} className="text-[10px] bg-black/40 text-zinc-300 px-5 py-3.5 rounded-xl border border-white/5 hover:bg-zinc-800 transition-colors font-black font-display uppercase">MAX</button>
                                        <button onClick={() => setBatchSize(recommendedBatch)} className="text-[10px] bg-indigo-600/10 text-indigo-400 px-5 py-3.5 rounded-xl border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors font-black font-display uppercase italic tracking-tighter">REC</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="matte-card p-8 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={64} className="text-indigo-500" /></div>
                            <div className="text-[10px] text-zinc-500 font-black mb-2 uppercase tracking-[0.2em] font-display">{isEng ? 'Budget' : 'Presupuesto'}</div>
                            <div className="flex flex-wrap items-center gap-4">
                                <GoldDisplay amount={totalGoldCost} size="lg" />
                                {neededShardsRequirement > 0 && (
                                    <div className={`text-xs font-black flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border ${ownedShards >= neededShardsRequirement ? 'border-indigo-500/30 text-indigo-400' : 'border-red-500/30 text-red-400'}`}>
                                        <Database size={14} /><span>{neededShardsRequirement} <span className="opacity-40">SHARDS</span></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="matte-card overflow-hidden">
                        <div className="bg-white/2 p-6 border-b border-white/5 flex items-center gap-4">
                            <ShoppingCart size={20} className="text-indigo-500" />
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] font-display">{isEng ? 'Procurement Materials' : 'Materiales de Adquisición'}</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {shoppingList.map((item, idx) => (
                                <div key={idx} className="p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 hover:bg-white/2 transition-colors">
                                    <div className="flex items-center gap-6 flex-1 w-full">
                                        <div className="text-4xl bg-black/40 p-4 rounded-3xl border border-white/5 shadow-inner">{item.icon}</div>
                                        <div>
                                            <div className="text-base font-bold text-white uppercase font-display tracking-tight mb-1">{item.name}</div>
                                            <div className="flex gap-6">
                                                <div className="text-[10px] text-zinc-600 font-black uppercase flex items-center gap-2 font-display"><Database size={12} /> {item.have}</div>
                                                <div className="text-[10px] text-zinc-600 font-black uppercase flex items-center gap-2 font-display"><Clock size={12} /> {item.supply > 50000 ? (isEng ? 'HIGH' : 'ALTO') : (isEng ? 'STABLE' : 'ESTABLE')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 w-full lg:w-auto text-right">
                                        <div><div className="text-[9px] text-zinc-600 font-black uppercase mb-1 tracking-widest font-display opacity-60">Insta-Buy</div><GoldDisplay amount={item.priceInsta} size="sm" /></div>
                                        <div><div className="text-[9px] text-indigo-400 font-black uppercase mb-1 tracking-widest font-display">Buy Order</div><GoldDisplay amount={item.priceOrder} size="sm" /></div>
                                        <div className="bg-black/40 px-6 py-4 rounded-2xl border border-indigo-500/20 shadow-inner min-w-[140px] col-span-2 lg:col-span-1">
                                            <div className="text-[9px] text-indigo-400 font-black uppercase mb-1 flex items-center gap-2 justify-end font-display">{isEng ? 'Quantity' : 'Cantidad'} <TrendingUp size={10} /></div>
                                            <div className="text-2xl font-black text-white font-display leading-none mb-1">{item.buy.toLocaleString()} <span className="text-[12px] text-zinc-600 font-mono">u.</span></div>
                                            {item.supply > 50000 && (
                                                <div className="text-[7px] text-emerald-400 font-black uppercase tracking-[0.2em] animate-pulse">
                                                    {isEng ? '✦ SMART START: 1-10 units suggested (Auto-renewable)' : '✦ INICIO INTELIGENTE: 1-10 unidades sugeridas (Auto-generable)'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8">
                    <div className={`matte-card p-4 flex items-center gap-3 bg-black/20 border-white/5`}>
                        <MapPin size={18} className="text-indigo-400" />
                        <div className={`text-[10px] font-bold uppercase tracking-widest text-zinc-500`}>
                            {isEng ? 'LOCATION' : 'UBICACIÓN'}: {strategy.type === 'RUNE' ? (isEng ? 'CRAFTING STATION (ARTIFICER 400)' : 'TALLER DE ARTESANÍA (ARTIFICIERO 400)') : (isEng ? 'MYSTIC FORGE' : 'FORJA MÍSTICA')}
                        </div>
                    </div>

                    <div className="matte-card p-12 text-center relative overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-xl">
                                <FlaskConical size={32} className="text-indigo-400 animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-2 font-display">{strategy.type === 'RUNE' ? (isEng ? 'RECONSTRUCTION PROCESS' : 'PROCESO DE RECONSTRUCCIÓN') : (isEng ? 'FORGE PROTOCOL' : 'PROTOCOLO DE FORJA')}</h3>
                            <p className="text-zinc-600 font-mono text-[10px] max-w-md mx-auto mb-10 border-t border-white/5 pt-6 uppercase tracking-widest">
                                {isEng ? 'Repeat cycle' : 'Repetir ciclo'} <strong className="text-indigo-400 text-lg mx-1">{batchSize}</strong> {isEng ? 'times' : 'veces'}.
                            </p>

                            <div className="grid grid-cols-1 md:flex md:justify-center md:items-center gap-4 max-w-4xl mx-auto">
                                <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                                    <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">{getItemIcon(strategy.sourceName)}</div>
                                    <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Input' : 'Entrada'}</div>
                                    <div className="text-[10px] font-black text-white font-display uppercase tracking-tight">{sourcePerCraft}x {getTranslatedName(strategy.sourceId, strategy.sourceName, isEng)}</div>
                                </div>

                                {!isRune && !isLode && (
                                    <>
                                        <div className="text-zinc-800 font-black">+</div>
                                        <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                                            <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">{getItemIcon(strategy.name)}</div>
                                            <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Catalyst' : 'Catalizador'}</div>
                                            <div className="text-[10px] font-black text-indigo-400 font-display uppercase tracking-tight">1x {getTranslatedName(strategy.targetId, strategy.name, isEng)}</div>
                                        </div>
                                        <div className="text-zinc-800 font-black">+</div>
                                        <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                                            <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">✨</div>
                                            <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Stabilizer' : 'Estabilizador'}</div>
                                            <div className="text-[10px] font-black text-white font-display uppercase tracking-tight">{isEng ? '5x Dust' : '5x Polvo'}</div>
                                        </div>
                                        <div className="text-zinc-800 font-black">+</div>
                                        <div className="matte-card p-6 bg-black/40 min-w-[160px] border-indigo-500/20">
                                            <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">💎</div>
                                            <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Exchange' : 'Canje'}</div>
                                            <div className="text-[10px] font-black text-indigo-300 font-display uppercase tracking-tight">{isEng ? '5x Philo Stones' : '5x Piedras Filosofales'}</div>
                                        </div>
                                    </>
                                )}

                                {isLode && (
                                    <>
                                        <div className="text-zinc-800 font-black">+</div>
                                        <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                                            <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">✨</div>
                                            <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Essence' : 'Esencia'}</div>
                                            <div className="text-[10px] font-black text-white font-display uppercase tracking-tight">{isEng ? '1x Dust' : '1x Polvo'}</div>
                                        </div>
                                        <div className="text-zinc-800 font-black">+</div>
                                        <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                                            <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">🍷</div>
                                            <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Blend' : 'Mezcla'}</div>
                                            <div className="text-[10px] font-black text-amber-500 font-display uppercase tracking-tight italic">{isEng ? '1x Wine' : '1x Vino'}</div>
                                        </div>
                                        <div className="text-zinc-800 font-black">+</div>
                                        <div className="matte-card p-6 bg-black/40 min-w-[160px] border-indigo-500/20">
                                            <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">🧊</div>
                                            <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Exchange' : 'Canje'}</div>
                                            <div className="text-[10px] font-black text-indigo-300 font-display uppercase tracking-tight">{isEng ? '1x Mystic Crystal' : '1x Cristal Místico'}</div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {neededShardsRequirement > 0 && (
                                <div className="mt-12 p-5 bg-white/2 rounded-2xl border border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-widest inline-flex flex-col items-center gap-2 font-display">
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={16} className="text-indigo-400" />
                                        <span>{isEng ? 'Shard Investment' : 'Inversión en Shards'}: <strong className="text-white">{neededShardsRequirement}</strong></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <div className="matte-card p-4 flex items-center gap-3 bg-black/20 border-white/5">
                        <MapPin size={18} className="text-emerald-400" />
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-display">{isEng ? 'RECOVERY: TRADING POST' : 'RECUPERACIÓN: BAZAR'}</div>
                    </div>

                    <div className="matte-card p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <p className="text-zinc-600 mb-8 text-[11px] font-black uppercase tracking-[0.5em] font-display">{isEng ? 'Estimated Liquidation' : 'Liquidación estimada'}</p>
                            <GoldDisplay amount={strategy.sellPrice * batchSize * yieldPerCraft} size="xl" />
                            <div className="mt-12 flex flex-col items-center gap-6">
                                <div className="bg-emerald-500/10 text-emerald-400 px-8 py-4 rounded-2xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg font-display">
                                    {isEng ? 'Yield' : 'Rendimiento'} x{yieldPerCraft.toFixed(1)} {isEng ? 'Applied' : 'Aplicado'}
                                </div>
                                <div className="bg-black/40 p-6 rounded-3xl border border-white/5 max-w-sm">
                                    <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2 font-display"><Gavel size={12} /> Sell Listing</h4>
                                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed font-display">
                                        {isEng ? 'Do not sell blindly. List your items and wait for the market. Patience is rewarded in gold.' : 'No vendas a ciegas. Publica un listado de venta y espera la respuesta del mercado. La paciencia se paga en oro.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refresh Market Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => {
                                onBack(); // Calls the onBack prop from the parent
                            }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/30 active:scale-95 transition-all font-display flex items-center justify-center gap-3"
                        >
                            <RefreshCcw size={16} className="animate-spin-slow" />
                            {isEng ? 'Refresh Market & Find New Routes' : 'Releer Mercado y Buscar Nuevas Rutas'}
                        </button>
                    </div>
                </div>
            )}

            <div className="p-6 bg-black/20 border-t border-white/5 text-[9px] text-zinc-600 font-black uppercase text-center tracking-widest font-display">
                {isEng ? 'Place orders' : 'Poner órdenes'} <strong className="text-zinc-400">1 {isEng ? 'copper above' : 'cobre por encima'}</strong> {isEng ? 'of current bid. Don\'t sell freedom for laziness.' : 'de la puja actual. No vendas libertad por pereza.'}
            </div>
        </motion.div>
    );
};
