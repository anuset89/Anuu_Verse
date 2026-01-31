
import { useState, useEffect, useCallback } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { DiversifiedOperation } from './components/DiversifiedOperation';
import { Brain, RefreshCcw, Cpu, Settings, Package, FlaskConical, Database, Zap, Scale, Target, ArrowLeft, ShoppingCart, TrendingUp, Sparkles, MapPin, Gavel, Clock, Star } from 'lucide-react';

// --- HELPER: Gold Formatter ---
const GoldDisplay = ({ amount, size = "md" }: { amount: number, size?: "sm" | "md" | "lg" | "xl" }) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const g = Math.floor(absAmount / 10000);
  const s = Math.floor((absAmount % 10000) / 100);
  const c = Math.floor(absAmount % 100);
  const sizeClasses = { "sm": "text-[10px]", "md": "text-[10px] md:text-sm", "lg": "text-xl", "xl": "text-3xl" };
  return (
    <div className={`font-mono font-bold flex items-baseline gap-1 ${sizeClasses[size]} ${isNegative ? 'text-red-400' : ''}`}>
      {isNegative && <span>-</span>}
      <span className={isNegative ? 'text-red-400' : 'text-amber-400'}>{g}g</span>
      <span className="text-zinc-400">{s}s</span>
      {size !== "xl" && <span className="text-amber-700">{c}c</span>}
    </div>
  );
};

// --- ICON RESOLVER ---
const getItemIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("blood")) return "🩸";
  if (n.includes("bone")) return "☠️";
  if (n.includes("claw")) return "🦅";
  if (n.includes("fang")) return "🦷";
  if (n.includes("scale")) return "🛡️";
  if (n.includes("totem")) return "🗿";
  if (n.includes("venom")) return "🐍";
  if (n.includes("dust") || n.includes("lucent")) return "✨";
  if (n.includes("ore") || n.includes("mithril") || n.includes("orichalcum")) return "⛏️";
  if (n.includes("wood")) return "🪵";
  if (n.includes("leather")) return "🐄";
  if (n.includes("silk") || n.includes("cloth") || n.includes("gossamer")) return "🧵";
  if (n.includes("rune") || n.includes("shard")) return "💠";
  return "📦";
};

// --- COMPONENTS ---

const AnuuMediator = ({ thought, status, onReload }: { thought: string, status: 'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE', onReload?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden matte-card p-6 transition-all duration-500 mb-8 ${status === 'THINKING' ? 'border-indigo-500/40' : status === 'ALERT' ? 'border-red-500/40' : 'border-white/5'}`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-5"><Brain size={120} /></div>
    <div className="flex items-start gap-5 relative z-10">
      <div onClick={onReload} className={`p-4 rounded-2xl border cursor-pointer hover:scale-110 transition-transform ${status === 'THINKING' ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-zinc-800 bg-black/20'}`}>
        <Cpu size={28} className={status === 'THINKING' ? 'text-indigo-400' : 'text-zinc-500'} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase font-display">Anuu Nexus Core</h2>
          <span className={`text-[8px] px-2 py-0.5 rounded-full font-mono ${status === 'THINKING' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800/50 text-zinc-500'}`}>{status === 'THINKING' ? 'PROCESSING' : 'ONLINE'}</span>
        </div>
        <p className={`text-lg md:text-xl font-medium leading-relaxed font-display text-matte-accent`}>{thought}</p>
      </div>
    </div>
  </motion.div>
);

const StrategyCard = ({ strategy, onClick }: { strategy: AnuuStrategy, onClick: () => void }) => {
  const isGood = strategy.roi > 0;
  return (
    <motion.div layout onClick={onClick} className={`p-5 matte-card matte-card-hover group cursor-pointer relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl bg-black/40 text-2xl border border-white/5 group-hover:bg-indigo-500/10 transition-colors`}>
            {getItemIcon(strategy.name)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors uppercase text-[9px] tracking-[0.2em] font-display">{strategy.name}</h3>
              <span className={`text-[7px] px-1.5 py-0.5 rounded font-black tracking-tighter border ${strategy.type === 'RUNE' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-zinc-800 text-zinc-500 border-white/5'}`}>
                {strategy.type}
              </span>
            </div>
            <p className={`text-[8px] font-black tracking-widest uppercase ${isGood ? 'text-indigo-400' : 'text-zinc-600'}`}>{strategy.verdict}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black font-display ${isGood ? 'text-white' : 'text-zinc-500'}`}>{strategy.roi > 0 ? '+' : ''}{strategy.roi.toFixed(1)}%</p>
        </div>
      </div>
      <div className="flex justify-between items-center text-[10px] mt-4 pt-4 border-t border-white/5">
        <span className="font-black text-zinc-600 uppercase text-[8px] tracking-widest font-display">Profit Estimado</span>
        <GoldDisplay amount={strategy.profitPerCraft} size="sm" />
      </div>
    </motion.div>
  );
};

// --- DIVERSIFICATION HUB ---
const DiversificationHub = ({ strategies, onSelect }: { strategies: AnuuStrategy[], onSelect: (strats: AnuuStrategy[], profile: string) => void }) => {
  // Filter for profitable routes only
  const profitable = strategies.filter(s => s.roi > 0);

  // Relámpago: High liquidity + positive ROI
  const hot = [...profitable].sort((a, b) => b.supplyQty - a.supplyQty).slice(0, 6);

  // Equilibrado: Best overall score (ROI + liquidity + stability)
  const balanced = [...profitable].sort((a, b) => b.score - a.score).slice(0, 6);

  // Sniper: Maximum ROI with minimum supply threshold
  const maxProfit = [...profitable].filter(s => s.supplyQty > 1000).sort((a, b) => b.roi - a.roi).slice(0, 6);

  const profiles = [
    { id: 'hot', title: 'Relámpago', icon: <Zap className="text-zinc-100" size={18} />, items: hot, desc: 'Alta liquidez.', color: 'border-indigo-500/20' },
    { id: 'balanced', title: 'Equilibrado', icon: <Scale className="text-zinc-100" size={18} />, items: balanced, desc: 'Óptimo.', color: 'border-zinc-800' },
    { id: 'profit', title: 'Sniper', icon: <Target className="text-zinc-100" size={18} />, items: maxProfit, desc: 'Máximo ROI.', color: 'border-white/5' }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {profiles.map(p => (
        <motion.div key={p.id} whileHover={{ y: -4 }} onClick={() => onSelect(p.items, p.title)} className={`matte-card p-6 cursor-pointer matte-card-hover relative overflow-hidden group border-white/5`}>
          <div className="flex items-center gap-3 mb-4"><div className="p-2.5 bg-black/40 rounded-xl border border-white/5">{p.icon}</div><h3 className="font-black text-white uppercase tracking-[0.2em] text-[10px] font-display">{p.title}</h3></div>
          <p className="text-[9px] font-black text-zinc-600 mb-6 uppercase tracking-widest">{p.desc}</p>
          <div className="space-y-3">{p.items.map(item => (<div key={item.targetId} className="flex justify-between items-center text-[10px]"><span className="text-zinc-400 font-medium truncate w-32 tracking-tight">/ {item.name}</span><span className={item.roi > 0 ? 'text-indigo-400 font-black' : 'text-zinc-600'}>{item.roi.toFixed(1)}%</span></div>))}</div>
        </motion.div>
      ))}
    </div>
  );
};

const OperationMode = ({ strategy, materials, wallet, prices, onBack, isEng }: {
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
  // const totalInstaCost = (buySource * priceInstaSource) + (buyDust * (prices[IDS.DUST]?.sells.unit_price || 0)) + (buyTarget * priceInstaTarget) + (buyWine * 2560);
  // const savings = totalInstaCost - totalGoldCost;

  const neededStones = (isLode ? 0 : (isRune ? 0 : 5)) * batchSize;
  const neededCrystals = isLode ? batchSize : 0;
  const totalShardCost = (neededStones * 0.1) + (neededCrystals * 0.6);
  const neededShards = Math.ceil(totalShardCost);

  const isWeekend = [0, 5, 6].includes(new Date().getDay());
  const multiplier = isWeekend ? (isCommon ? 0.05 : 0.25) : (isCommon ? 0.02 : 0.15);
  const recommendedBatch = Math.floor(strategy.supplyQty * multiplier);

  const costPerCraft = (sourcePerCraft * priceOrderSource) + (neededDust / batchSize * priceOrderDust) + (isLode || isRune ? 0 : priceOrderTarget) + (isLode ? 2560 : 0);
  const maxByShards = totalShardCost > 0 ? Math.floor(ownedShards / (totalShardCost / batchSize)) : 10000;
  const maxByGold = costPerCraft > 0 ? Math.floor(availableGold / costPerCraft) : 0;
  const safeMax = Math.max(0, Math.min(maxByShards, maxByGold));

  const shoppingList = [
    { name: strategy.sourceName, icon: getItemIcon(strategy.sourceName), need: neededSource, have: ownedSource, buy: buySource, priceOrder: priceOrderSource, priceInsta: priceInstaSource, supply: pSource?.sells.quantity || 0 },
    ...(usesDust ? [{ name: "Crystalline Dust", icon: "✨", need: neededDust, have: ownedDust, buy: buyDust, priceOrder: priceOrderDust, priceInsta: prices[IDS.DUST]?.sells.unit_price || 0, supply: pDust?.sells.quantity || 0 }] : []),
    ...(isLode ? [{ name: "Elonian Wine", icon: "🍷", need: batchSize, have: 0, buy: batchSize, priceOrder: 2560, priceInsta: 2560, supply: 999999 }] : []),
    ...(!isLode ? [{ name: strategy.name, icon: getItemIcon(strategy.name), need: neededTarget, have: ownedTarget, buy: buyTarget, priceOrder: priceOrderTarget, priceInsta: priceInstaTarget, supply: pTarget?.sells.quantity || 0 }] : []),
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <button onClick={onBack} className="matte-card px-5 py-3 text-zinc-500 text-[10px] hover:text-white transition-all uppercase tracking-[0.2em] font-black border-white/5 flex items-center gap-2 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {isEng ? 'Back to Nexus' : 'Volver al Nexo'}
        </button>
        <div className="flex flex-col items-start md:items-end">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase font-display tracking-tight">{strategy.name}</h2>
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
                {neededShards > 0 && (
                  <div className={`text-xs font-black flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border ${ownedShards >= neededShards ? 'border-indigo-500/30 text-indigo-400' : 'border-red-500/30 text-red-400'}`}>
                    <Database size={14} /><span>{neededShards} <span className="opacity-40">SHARDS</span></span>
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
                  <div className="text-[10px] font-black text-white font-display uppercase tracking-tight">{sourcePerCraft}x {strategy.sourceName}</div>
                </div>

                {!isRune && !isLode && (
                  <>
                    <div className="text-zinc-800 font-black">+</div>
                    <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">{getItemIcon(strategy.name)}</div>
                      <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Catalyst' : 'Catalizador'}</div>
                      <div className="text-[10px] font-black text-indigo-400 font-display uppercase tracking-tight">1x {strategy.name}</div>
                    </div>
                    <div className="text-zinc-800 font-black">+</div>
                    <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">✨</div>
                      <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Stabilizer' : 'Estabilizador'}</div>
                      <div className="text-[10px] font-black text-white font-display uppercase tracking-tight">5x Dust</div>
                    </div>
                    <div className="text-zinc-800 font-black">+</div>
                    <div className="matte-card p-6 bg-black/40 min-w-[160px] border-indigo-500/20">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">💎</div>
                      <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Exchange' : 'Canje'}</div>
                      <div className="text-[10px] font-black text-indigo-300 font-display uppercase tracking-tight">5x Philo Stones</div>
                    </div>
                  </>
                )}

                {isLode && (
                  <>
                    <div className="text-zinc-800 font-black">+</div>
                    <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">✨</div>
                      <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Essence' : 'Esencia'}</div>
                      <div className="text-[10px] font-black text-white font-display uppercase tracking-tight">1x Dust</div>
                    </div>
                    <div className="text-zinc-800 font-black">+</div>
                    <div className="matte-card p-6 bg-black/40 min-w-[160px] border-white/5">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">🍷</div>
                      <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Blend' : 'Mezcla'}</div>
                      <div className="text-[10px] font-black text-amber-500 font-display uppercase tracking-tight italic">1x Wine</div>
                    </div>
                    <div className="text-zinc-800 font-black">+</div>
                    <div className="matte-card p-6 bg-black/40 min-w-[160px] border-indigo-500/20">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">🧊</div>
                      <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">{isEng ? 'Exchange' : 'Canje'}</div>
                      <div className="text-[10px] font-black text-indigo-300 font-display uppercase tracking-tight">1x Mystic Crystal</div>
                    </div>
                  </>
                )}

                {isRune && (
                  <div className="flex flex-col items-center">
                    <ArrowLeft className="rotate-180 text-indigo-500 my-4" />
                    <div className="matte-card p-6 bg-black/40 min-w-[160px] border-indigo-500/30 shadow-indigo-900/10">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">💠</div>
                      <div className="text-[8px] text-indigo-400 font-black uppercase mb-1">{isEng ? 'Result' : 'Resultado'}</div>
                      <div className="text-[10px] font-black text-white font-display uppercase tracking-tight">1x Lucent Shard</div>
                    </div>
                  </div>
                )}
              </div>

              {neededShards > 0 && (
                <div className="mt-12 p-5 bg-white/2 rounded-2xl border border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-widest inline-flex flex-col items-center gap-2 font-display">
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-indigo-400" />
                    <span>{isEng ? 'Shard Investment' : 'Inversión en Shards'}: <strong className="text-white">{neededShards}</strong></span>
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
                // This will trigger fetchData in the parent component
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

// --- APP ---
function App() {
  const [apiKey] = useState(localStorage.getItem('gw2_api_key') || '');
  const [strategies, setStrategies] = useState<AnuuStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<AnuuStrategy | null>(null);
  const [multiStrategy, setMultiStrategy] = useState<AnuuStrategy[] | null>(null);
  const [materials, setMaterials] = useState<Record<number, number>>({});
  const [wallet, setWallet] = useState<Record<number, number>>({});
  const [prices, setPrices] = useState<Record<number, MarketItem>>({});
  const [thought, setThought] = useState("Proyectando rutas comerciales...");
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE'>('IDLE');
  const [category, setCategory] = useState<'ALL' | 'FINE' | 'COMMON' | 'LODE' | 'RUNE'>('ALL');
  const [lang, setLang] = useState<'es' | 'en'>((localStorage.getItem('gw2_lang') as 'es' | 'en') || 'es');
  const isEng = lang === 'en';

  const fetchData = useCallback(async () => {
    setStatus('THINKING');
    try {
      const allIds = Object.values(IDS).filter((x): x is number => typeof x === 'number');
      const priceData = await gw2.getPrices(allIds);
      const priceMap: Record<number, MarketItem> = {};
      priceData.forEach((p: MarketItem) => { priceMap[p.id] = p; });
      setPrices(priceMap);

      if (apiKey) {
        const matsPromise = gw2.getMaterials(apiKey).then(mats => {
          const matMap: Record<number, number> = {};
          mats.forEach((m: { id: number, count: number }) => { matMap[m.id] = m.count; });
          return matMap;
        });
        const walletPromise = gw2.getWallet(apiKey).then(wData => {
          const walletMap: Record<number, number> = {};
          wData.forEach((w: { id: number, value: number }) => { walletMap[w.id] = w.value; });
          return walletMap;
        });
        const [mResult, wResult] = await Promise.allSettled([matsPromise, walletPromise]);
        if (mResult.status === 'fulfilled') setMaterials(mResult.value);
        if (wResult.status === 'fulfilled') setWallet(wResult.value);
      }
      const strats = analyzeMarket(priceMap);
      setStrategies(strats);
      setThought(strats[0] && strats[0].roi > 0
        ? (isEng ? `Detected ${strats.filter(s => s.roi > 0).length} profitable routes.` : `Se han detectado ${strats.filter(s => s.roi > 0).length} rutas rentables.`)
        : (isEng ? "Stable market, scanning for anomalies." : "Mercado estable, escaneando anomalías."));
      setStatus('IDLE');
    } catch {
      setStatus('ALERT');
      setThought(isEng ? "Nexus Link failure." : "Falla en la Nexus Link.");
    }
  }, [apiKey, isEng]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const filteredStrategies = strategies.filter(s => category === 'ALL' || s.type === category);

  const handleStrategySelect = (strategy: AnuuStrategy) => {
    setActiveStrategy(strategy);
    setStatus('GUIDE');
    setThought(`Guía de operación cargada: ${strategy.name}.`);
  };

  const handleMultiSelect = (strats: AnuuStrategy[], title: string) => {
    setMultiStrategy(strats);
    setStatus('GUIDE');
    setThought(`Perfil estratégico: ${title}.`);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-400 p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      <div className="stars"></div>
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/20"><Star className="text-white" size={24} /></div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase font-display italic text-glow">GW2 NEXUS</h1>
              <p className="text-[9px] text-indigo-400 font-black tracking-[0.4em] uppercase">{isEng ? 'Operations Intelligence v4.3' : 'Inteligencia de Operaciones v4.3'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/5">
            {(['ALL', 'FINE', 'COMMON', 'LODE', 'RUNE'] as const).map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all font-display ${category === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}>
                {cat === 'ALL' ? (isEng ? 'NEXUS' : 'NEXO') : cat === 'FINE' ? (isEng ? 'ESSENCES' : 'ESENCIAS') : cat === 'COMMON' ? (isEng ? 'CORE' : 'GRANDE') : cat === 'LODE' ? (isEng ? 'LODES' : 'LODAS') : (isEng ? 'RUNES' : 'RUNAS')}
              </button>
            ))}
          </div>

          {apiKey && (
            <div className="flex items-center gap-6 matte-card p-3 px-5 cursor-pointer hover:bg-white/2 transition-all border-white/5" onClick={fetchData}>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest font-display">{isEng ? 'Wallet' : 'Billetera'}</span>
                {wallet[1] !== undefined ? <GoldDisplay amount={wallet[1]} size="md" /> : <div className="w-12 h-4 bg-zinc-800 animate-pulse rounded"></div>}
              </div>
              <div className="w-px h-8 bg-white/5"></div>
              <div className="flex items-center gap-3 text-indigo-400 font-black">
                <Database size={18} /><span className="font-mono text-base">{wallet[23] || 0}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => { const next = lang === 'es' ? 'en' : 'es'; setLang(next); localStorage.setItem('gw2_lang', next); }} className="matte-card px-4 py-2 hover:text-white text-zinc-600 transition-all border-white/5 text-[10px] font-black font-display uppercase">
              {lang === 'es' ? 'ESP' : 'ENG'}
            </button>
            <button onClick={fetchData} className="matte-card p-3.5 hover:text-white text-zinc-600 transition-all border-white/5"><RefreshCcw size={20} className={status === 'THINKING' ? 'animate-spin' : ''} /></button>
            <button onClick={() => { const k = prompt(isEng ? "API Key:" : "Clave API:", apiKey); if (k) { localStorage.setItem('gw2_api_key', k.trim()); window.location.reload(); } }} className="matte-card p-3.5 hover:text-white text-zinc-600 transition-all border-white/5"><Settings size={20} /></button>
          </div>
        </div>

        <AnuuMediator thought={thought} status={status} onReload={fetchData} />

        <AnimatePresence mode="wait">
          {!activeStrategy && !multiStrategy ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <DiversificationHub strategies={strategies} onSelect={handleMultiSelect} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStrategies.slice(0, 30).map(s => <StrategyCard key={s.targetId} strategy={s} onClick={() => handleStrategySelect(s)} />)}
              </div>
            </motion.div>
          ) : multiStrategy ? (
            <DiversifiedOperation
              strategies={multiStrategy}
              wallet={wallet}
              prices={prices}
              onBack={() => setMultiStrategy(null)}
              isEng={isEng}
            />
          ) : (
            <motion.div key="op" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <OperationMode strategy={activeStrategy!} materials={materials} wallet={wallet} prices={prices} isEng={isEng} onBack={() => { setActiveStrategy(null); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="fixed bottom-0 left-0 w-full p-4 pointer-events-none opacity-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-[7px] font-black text-zinc-700 uppercase tracking-[0.5em]">
          <span>Anuu_Verse Security Layer</span>
          <span>Crypto-Economic Market Division</span>
        </div>
      </div>
    </div>
  );
}

export default App;
