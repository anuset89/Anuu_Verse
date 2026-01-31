
import { useState, useEffect } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
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
    className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 mb-8 ${status === 'THINKING' ? 'bg-zinc-900 border-fuchsia-500/50 shadow-lg shadow-fuchsia-900/20' : status === 'ALERT' ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-900/20' : status === 'GUIDE' ? 'bg-zinc-900 border-indigo-500/50 shadow-lg shadow-indigo-900/20' : 'bg-zinc-950 border-zinc-800'}`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={120} /></div>
    <div className="flex items-start gap-5 relative z-10">
      <div onClick={onReload} className={`p-3 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform ${status === 'THINKING' ? 'border-fuchsia-500 bg-fuchsia-500/10 animate-pulse' : status === 'ALERT' ? 'border-emerald-500 bg-emerald-500/10' : status === 'GUIDE' ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 bg-zinc-800'}`}>
        <Cpu size={32} className={status === 'THINKING' ? 'text-fuchsia-400' : status === 'ALERT' ? 'text-emerald-400' : status === 'GUIDE' ? 'text-indigo-400' : 'text-zinc-500'} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Anuu Nexus Core</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${status === 'THINKING' ? 'bg-fuchsia-900 text-fuchsia-300' : 'bg-zinc-800 text-zinc-500'}`}>{status === 'THINKING' ? 'PROCESSING' : status === 'GUIDE' ? 'GUIDANCE' : 'ONLINE'}</span>
        </div>
        <p className={`text-sm md:text-lg font-medium leading-relaxed ${status === 'THINKING' ? 'text-fuchsia-200' : 'text-zinc-300'}`}>"{thought}"</p>
      </div>
    </div>
  </motion.div>
);

const StrategyCard = ({ strategy, onClick }: { strategy: AnuuStrategy, onClick: () => void }) => {
  const isGood = strategy.roi > 0;
  return (
    <motion.div layout onClick={onClick} whileHover={{ scale: 1.02 }} className={`p-4 rounded-xl border ${isGood ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/10 border-red-500/20'} hover:bg-zinc-900/80 transition-all group cursor-pointer relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isGood ? 'bg-emerald-500/20 text-xl' : 'bg-zinc-800 text-xl'}`}>
            {getItemIcon(strategy.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors uppercase text-[10px] tracking-widest">{strategy.name}</h3>
              <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-black tracking-tighter ${strategy.type === 'RUNE' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : strategy.type === 'COMMON' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                {strategy.type}
              </span>
            </div>
            <p className={`text-[8px] font-bold ${isGood ? 'text-emerald-400' : 'text-zinc-500'}`}>{strategy.verdict}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-lg font-black ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>{strategy.roi > 0 ? '+' : ''}{strategy.roi.toFixed(1)}%</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 text-xs text-zinc-500 mt-2 pt-3 border-t border-white/5">
        <div className="flex justify-between bg-zinc-950/50 p-1.5 rounded">
          <span className="font-bold text-zinc-400 uppercase text-[8px] tracking-[0.2em] self-center">Profit Estimado</span>
          <GoldDisplay amount={strategy.profitPerCraft} size="sm" />
        </div>
      </div>
    </motion.div>
  );
};

// --- DIVERSIFICATION HUB ---
const DiversificationHub = ({ strategies, onSelect }: { strategies: AnuuStrategy[], onSelect: (strats: AnuuStrategy[], profile: string) => void }) => {
  const hot = [...strategies].sort((a, b) => b.supplyQty - a.supplyQty).slice(0, 3);
  const balanced = [...strategies].sort((a, b) => b.score - a.score).slice(0, 3);
  const maxProfit = [...strategies].sort((a, b) => b.roi - a.roi).slice(0, 3);
  const profiles = [
    { id: 'hot', title: 'Relámpago', icon: <Zap className="text-yellow-400" />, items: hot, desc: 'Prioriza volumen. Rotación < 2h.', color: 'border-yellow-500/30' },
    { id: 'balanced', title: 'Equilibrado', icon: <Scale className="text-indigo-400" />, items: balanced, desc: 'Riesgo/Beneficio óptimo. 4-8h.', color: 'border-indigo-500/30' },
    { id: 'profit', title: 'Francotirador', icon: <Target className="text-red-400" />, items: maxProfit, desc: 'Máximo ROI. Venta en 12-24h.', color: 'border-red-500/30' }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {profiles.map(p => (
        <motion.div key={p.id} whileHover={{ y: -5 }} onClick={() => onSelect(p.items, p.title)} className={`bg-zinc-900 border ${p.color} p-5 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-all relative overflow-hidden group shadow-2xl shadow-black/40`}>
          <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-black/40 rounded-lg">{p.icon}</div><h3 className="font-bold text-zinc-100 uppercase tracking-widest text-xs">{p.title}</h3></div>
          <p className="text-[10px] text-zinc-500 mb-4">{p.desc}</p>
          <div className="space-y-2">{p.items.map(item => (<div key={item.targetId} className="flex justify-between items-center text-[10px]"><span className="text-zinc-400 truncate w-24">/ {item.name}</span><span className={item.roi > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{item.roi > 0 ? '+' : ''}{item.roi.toFixed(1)}%</span></div>))}</div>
        </motion.div>
      ))}
    </div>
  );
};

// --- OPERATION MODE ---
const OperationMode = ({ strategy, materials, wallet, prices, onBack }: { strategy: AnuuStrategy, materials: Record<number, number>, wallet: Record<number, number>, prices: Record<number, MarketItem>, onBack: () => void }) => {
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

  const sourcePerCraft = isRune ? 10 : (isCommon ? 250 : 50);
  const yieldPerCraft = isRune ? 1 : (isCommon ? 22 : 7);
  const usesDust = strategy.type !== 'RUNE';

  const neededSource = sourcePerCraft * batchSize;
  const neededDust = (usesDust ? 5 : 0) * batchSize;
  const neededTarget = 1 * batchSize;

  const buySource = Math.max(0, neededSource - ownedSource);
  const buyDust = Math.max(0, neededDust - ownedDust);
  const buyTarget = Math.max(0, neededTarget - ownedTarget);

  const totalGoldCost = (buySource * priceOrderSource) + (buyDust * priceOrderDust) + (buyTarget * priceOrderTarget);
  const totalInstaCost = (buySource * priceInstaSource) + (buyDust * (prices[IDS.DUST]?.sells.unit_price || 0)) + (buyTarget * priceInstaTarget);
  const savings = totalInstaCost - totalGoldCost;

  const neededStones = (usesDust ? 5 : 0) * batchSize;
  const neededShards = Math.ceil(neededStones / 10);

  const isWeekend = [0, 5, 6].includes(new Date().getDay());
  const multiplier = isWeekend ? (isCommon ? 0.05 : 0.25) : (isCommon ? 0.02 : 0.15);
  const recommendedBatch = Math.floor(strategy.supplyQty * multiplier);

  const costPerCraft = (sourcePerCraft * priceOrderSource) + (neededDust / batchSize * priceOrderDust) + (1 * priceOrderTarget);
  const maxByShards = neededStones > 0 ? Math.floor(ownedShards / 0.5) : 10000;
  const maxByGold = costPerCraft > 0 ? Math.floor(availableGold / costPerCraft) : 0;
  const safeMax = Math.max(0, Math.min(maxByShards, maxByGold));

  const shoppingList = [
    { name: strategy.sourceName, icon: getItemIcon(strategy.sourceName), need: neededSource, have: ownedSource, buy: buySource, priceOrder: priceOrderSource, priceInsta: priceInstaSource, supply: pSource?.sells.quantity || 0 },
    ...(usesDust ? [{ name: "Crystalline Dust", icon: "✨", need: neededDust, have: ownedDust, buy: buyDust, priceOrder: priceOrderDust, priceInsta: prices[IDS.DUST]?.sells.unit_price || 0, supply: pDust?.sells.quantity || 0 }] : []),
    { name: strategy.name, icon: getItemIcon(strategy.name), need: neededTarget, have: ownedTarget, buy: buyTarget, priceOrder: priceOrderTarget, priceInsta: priceInstaTarget, supply: pTarget?.sells.quantity || 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-500 text-[10px] hover:text-white transition-colors uppercase tracking-[0.2em] font-black">← Volver al Nexo</button>
        <div className="flex flex-col items-end">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase">{strategy.name}</h2>
          <span className={`text-[8px] font-black px-2 py-0.5 rounded bg-zinc-800 border ${strategy.type === 'RUNE' ? 'text-fuchsia-400 border-fuchsia-500/20' : 'text-emerald-400 border-emerald-500/20'}`}>{strategy.type} BATCH ANALYSIS</span>
        </div>
      </div>

      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-fuchsia-500/5 pointer-events-none"></div>
        {[1, 2, 3].map(i => <button key={i} onClick={() => setStep(i)} className={`flex-1 py-3 rounded-lg text-[10px] font-black tracking-widest transition-all relative z-10 ${step === i ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-300 uppercase'}`}>{i}. {i === 1 ? 'ADQUISICIÓN' : i === 2 ? (strategy.type === 'RUNE' ? 'TALLER' : 'FORJA') : i === 3 ? 'VENTA' : ''}</button>)}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><Package className="text-indigo-400" size={32} /></div>
                <div className="flex-1">
                  <h3 className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Escalar Operación</h3>
                  <div className="flex gap-2 items-center">
                    <input type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 0))} className="bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-mono w-full text-sm focus:border-indigo-500 outline-none transition-all shadow-inner" />
                    <button onClick={() => setBatchSize(safeMax)} className="text-[10px] bg-zinc-800 text-zinc-200 px-4 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors font-black uppercase">MAX</button>
                    <button onClick={() => setBatchSize(recommendedBatch)} className="text-[10px] bg-emerald-950/40 text-emerald-400 px-4 py-2.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-900/50 transition-colors font-black uppercase tracking-tighter italic">REC</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={60} className="text-emerald-500" /></div>
              <div className="text-[9px] text-zinc-600 font-black mb-1 uppercase tracking-widest text-center md:text-left">Presupuesto Necesario</div>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <GoldDisplay amount={totalGoldCost} size="lg" />
                {neededShards > 0 && (
                  <div className={`text-sm font-black flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border ${ownedShards >= neededShards ? 'border-indigo-500/30 text-indigo-400' : 'border-red-500/30 text-red-400'}`}>
                    <span className="text-[10px] opacity-60">&</span>
                    <Database size={14} />
                    <span>{neededShards} <span className="text-[10px] opacity-60">SHARDS</span></span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-[9px] text-zinc-500 font-bold uppercase">Rentabilidad x Puja</span>
                <span className="text-emerald-400 font-mono text-xs">+{Math.floor(savings / 10000)}g ahorrados</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-zinc-950 p-5 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-indigo-500" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Materiales para Adquisición</h3>
              </div>
            </div>
            <div className="divide-y divide-zinc-800">
              {shoppingList.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:bg-zinc-800/10 transition-colors relative group">
                  <div className="flex items-center gap-5 flex-1 w-full">
                    <div className="text-3xl bg-black/40 p-3 rounded-2xl border border-white/5 shadow-inner">{item.icon}</div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight mb-1">{item.name}</div>
                      <div className="flex gap-4">
                        <div className="text-[9px] text-zinc-600 font-black uppercase flex items-center gap-1"><Database size={10} /> Inventario: {item.have}</div>
                        <div className="text-[9px] text-zinc-600 font-black uppercase flex items-center gap-1"><Clock size={10} /> Movimiento: {item.supply > 50000 ? 'Masivo' : item.supply > 20000 ? 'Ágil' : 'Paciente'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 w-full lg:w-auto text-right">
                    <div>
                      <div className="text-[8px] text-zinc-600 font-black uppercase mb-1 tracking-widest opacity-60">Insta-Buy</div>
                      <GoldDisplay amount={item.priceInsta} size="sm" />
                    </div>
                    <div>
                      <div className="text-[8px] text-indigo-400 font-black uppercase mb-1 tracking-widest">Buy Order</div>
                      <GoldDisplay amount={item.priceOrder} size="sm" />
                    </div>
                    <div className="bg-black/60 px-5 py-3 rounded-2xl border border-indigo-500/20 shadow-inner min-w-[120px] col-span-2 lg:col-span-1">
                      <div className="text-[8px] text-indigo-400 font-black uppercase mb-1 flex items-center gap-1 justify-end">Cantidad a Pedir <TrendingUp size={8} /></div>
                      <div className="text-xl font-black text-white">{item.buy.toLocaleString()} <span className="text-[10px] text-zinc-700 font-mono">u.</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 bg-zinc-950/50 border-t border-zinc-800 text-[10px] text-zinc-500 font-medium text-center">
              Poner órdenes <strong>1 cobre por encima</strong> de la puja actual. No vendas libertad por pereza.
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className={`border rounded-2xl p-4 flex items-center gap-3 ${strategy.type === 'RUNE' ? 'bg-fuchsia-950/20 border-fuchsia-500/20' : 'bg-fuchsia-950/20 border-fuchsia-500/20'}`}>
            <MapPin size={18} className={strategy.type === 'RUNE' ? 'text-fuchsia-400' : 'text-fuchsia-400'} />
            <div className={`text-[10px] font-bold uppercase tracking-widest ${strategy.type === 'RUNE' ? 'text-fuchsia-300' : 'text-fuchsia-300'}`}>
              UBICACIÓN: {strategy.type === 'RUNE' ? 'TALLER DE ARTESANÍA (ARTIFICIERO 400)' : 'FORJA MÍSTICA'}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl">
                <FlaskConical size={32} className="text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-2">{strategy.type === 'RUNE' ? 'PROCESO DE RECONSTRUCCIÓN' : 'PROTOCOLO DE FORJA'}</h3>
              <p className="text-zinc-500 font-mono text-[10px] max-w-md mx-auto mb-10 border-t border-zinc-800 pt-6 uppercase tracking-widest">Repetir ciclo <strong className="text-indigo-400 text-lg mx-1">{batchSize}</strong> veces.</p>

              <div className="grid grid-cols-1 md:flex md:justify-center md:items-center gap-4 max-w-4xl mx-auto">
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-5 rounded-2xl border border-zinc-700 shadow-xl group transition-all hover:scale-105 min-w-[140px]">
                  <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">{getItemIcon(strategy.sourceName)}</div>
                  <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">Entrada</div>
                  <div className="text-xs font-black text-white">{sourcePerCraft}x {strategy.sourceName}</div>
                </div>

                {!isRune && (
                  <>
                    <div className="text-zinc-700 font-black">+</div>
                    <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-5 rounded-2xl border border-zinc-700 shadow-xl transition-all hover:scale-105 min-w-[140px]">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">{getItemIcon(strategy.name)}</div>
                      <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">Catalizador</div>
                      <div className="text-xs font-black text-indigo-400">1x {strategy.name}</div>
                    </div>
                    <div className="text-zinc-700 font-black">+</div>
                    <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-5 rounded-2xl border border-zinc-700 shadow-xl transition-all hover:scale-105 min-w-[140px]">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">✨</div>
                      <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">Estabilizador</div>
                      <div className="text-xs font-black text-white">5x Dust</div>
                    </div>
                    <div className="text-zinc-700 font-black">+</div>
                    <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-5 rounded-2xl border border-zinc-700 shadow-xl transition-all hover:scale-105 border-indigo-500/30 shadow-indigo-900/20 min-w-[140px]">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">💎</div>
                      <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">Canje</div>
                      <div className="text-xs font-black text-indigo-300 uppercase">5x Piedra Filosofal</div>
                    </div>
                  </>
                )}

                {isRune && (
                  <div className="flex flex-col items-center">
                    <ArrowLeft className="rotate-180 text-fuchsia-500 my-4" />
                    <div className="bg-gradient-to-b from-fuchsia-900/40 to-black p-5 rounded-2xl border border-fuchsia-500/30 shadow-fuchsia-900/20 shadow-xl min-w-[160px]">
                      <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">💠</div>
                      <div className="text-[8px] text-fuchsia-400 font-black uppercase mb-1">Resultado</div>
                      <div className="text-xs font-black text-white">1x Lucent Shard</div>
                    </div>
                  </div>
                )}
              </div>

              {neededShards > 0 && (
                <div className="mt-12 p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-[10px] text-zinc-400 font-medium inline-flex flex-col items-center gap-2 shadow-inner">
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} className="text-indigo-400" />
                    <span>Inversión en Shards: <strong>{neededShards} chapas</strong>.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
            <MapPin size={18} className="text-emerald-400" />
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">RECUPERACIÓN: BAZAR</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-zinc-500 mb-8 text-[11px] font-black uppercase tracking-[0.5em]">Liquidación estimada</p>
              <GoldDisplay amount={strategy.sellPrice * batchSize * yieldPerCraft} size="xl" />
              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="bg-emerald-500/10 text-emerald-400 px-8 py-4 rounded-2xl border border-emerald-500/20 text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                  Rendimiento x{yieldPerCraft.toFixed(1)} Aplicado
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 max-w-sm">
                  <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><Gavel size={12} /> Sell Listing</h4>
                  <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">No vendas a ciegas. Publica un listado de venta y espera la respuesta del mercado. La paciencia se paga en oro.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- APP ---
function App() {
  const [apiKey] = useState(localStorage.getItem('gw2_api_key') || '');
  const [strategies, setStrategies] = useState<AnuuStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<AnuuStrategy | null>(null);
  const [multiStrategy, setMultiStrategy] = useState<AnuuStrategy[] | null>(null);
  const [multiTitle, setMultiTitle] = useState("");
  const [materials, setMaterials] = useState<Record<number, number>>({});
  const [wallet, setWallet] = useState<Record<number, number>>({});
  const [prices, setPrices] = useState<Record<number, MarketItem>>({});
  const [thought, setThought] = useState("Proyectando rutas comerciales...");
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE'>('IDLE');
  const [category, setCategory] = useState<'ALL' | 'FINE' | 'COMMON' | 'RUNE'>('ALL');

  const fetchData = async () => {
    setStatus('THINKING');
    try {
      const allIds = Object.values(IDS).filter(x => typeof x === 'number');
      const priceData: any[] = await gw2.getPrices(allIds) as any[];
      const priceMap: Record<number, MarketItem> = {};
      priceData.forEach((p) => { priceMap[p.id] = p; });
      setPrices(priceMap);

      if (apiKey) {
        const matsPromise = gw2.getMaterials(apiKey).then(mats => {
          const matMap: Record<number, number> = {};
          mats.forEach((m: any) => { matMap[m.id] = m.count; });
          return matMap;
        });
        const walletPromise = gw2.getWallet(apiKey).then(wData => {
          const walletMap: Record<number, number> = {};
          wData.forEach((w: any) => { walletMap[w.id] = w.value; });
          return walletMap;
        });
        const [mResult, wResult] = await Promise.allSettled([matsPromise, walletPromise]);
        if (mResult.status === 'fulfilled') setMaterials(mResult.value);
        if (wResult.status === 'fulfilled') setWallet(wResult.value);
      }
      const strats = analyzeMarket(priceMap);
      setStrategies(strats);
      setThought(strats[0] && strats[0].roi > 0 ? `Se han detectado ${strats.filter(s => s.roi > 0).length} rutas rentables.` : "Mercado estable, escaneando anomalías.");
      setStatus('IDLE');
    } catch { setStatus('ALERT'); setThought("Falla en la Nexus Link."); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredStrategies = strategies.filter(s => category === 'ALL' || s.type === category);

  const handleStrategySelect = (strategy: AnuuStrategy) => {
    setActiveStrategy(strategy);
    setStatus('GUIDE');
    setThought(`Guía de operación cargada: ${strategy.name}.`);
  };

  const handleMultiSelect = (strats: AnuuStrategy[], title: string) => {
    setMultiStrategy(strats);
    setMultiTitle(title);
    setStatus('GUIDE');
    setThought(`Perfil estratégico: ${title}.`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-10 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20"><Star className="text-white" size={20} /></div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter italic uppercase">GW2 NEXUS</h1>
              <p className="text-[8px] text-zinc-500 font-black tracking-widest uppercase opacity-60">Operaciones de Mercado v3.0</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
            {['ALL', 'FINE', 'COMMON', 'RUNE'].map(cat => (
              <button key={cat} onClick={() => setCategory(cat as any)} className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-[0.2em] transition-all ${category === cat ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-600 hover:text-white'}`}>
                {cat === 'ALL' ? 'NEXO' : cat === 'FINE' ? 'ESENCIAS' : cat === 'COMMON' ? 'GRANDE' : 'RUNAS'}
              </button>
            ))}
          </div>

          {apiKey && (
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-all border-b-4 border-b-indigo-500/20" onClick={fetchData}>
              <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">WALLET:</span>
                {wallet[1] !== undefined ? <GoldDisplay amount={wallet[1]} size="md" /> : <span className="text-zinc-600 animate-pulse text-xs">...</span>}
              </div>
              <div className="w-px h-6 bg-zinc-800"></div>
              <div className="flex items-center gap-2 px-2 text-indigo-400 font-black">
                <Database size={16} /><span className="font-mono text-sm">{wallet[23] || 0}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={fetchData} className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><RefreshCcw size={18} className={status === 'THINKING' ? 'animate-spin' : ''} /></button>
            <button onClick={() => { const k = prompt("API Key:", apiKey); if (k) { localStorage.setItem('gw2_api_key', k.trim()); window.location.reload(); } }} className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><Settings size={18} /></button>
          </div>
        </div>

        <AnuuMediator thought={thought} status={status} onReload={fetchData} />

        <AnimatePresence mode="wait">
          {!activeStrategy && !multiStrategy ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <DiversificationHub strategies={strategies} onSelect={handleMultiSelect} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStrategies.map(s => <StrategyCard key={s.targetId} strategy={s} onClick={() => handleStrategySelect(s)} />)}
              </div>
            </motion.div>
          ) : multiStrategy ? (
            <motion.div key="multi" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8">
              <div className="flex justify-between items-center"><button onClick={() => setMultiStrategy(null)} className="flex items-center gap-3 text-zinc-600 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all group"><ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Tablero</button><h2 className="text-3xl font-black italic">{multiTitle}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {multiStrategy.map(s => (
                  <motion.div whileHover={{ y: -8, scale: 1.02 }} key={s.targetId} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-2xl relative" onClick={() => handleStrategySelect(s)}>
                    <div className="text-4xl mb-6 bg-black/40 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                      {getItemIcon(s.name)}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-black text-white uppercase tracking-tight text-sm">{s.name}</h3>
                      <span className="text-[7px] px-1 bg-white/5 rounded text-zinc-500 font-black">{s.type}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-4"><span className="text-[9px] text-zinc-600 font-black uppercase">ROI:</span><span className={s.roi > 0 ? 'text-emerald-400 font-black text-lg' : 'text-red-400 font-black text-lg'}>{s.roi > 0 ? '+' : ''}{s.roi.toFixed(1)}%</span></div>
                    <div className="mt-8"><button className="w-full bg-indigo-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 active:scale-95 transition-all">Iniciar Análisis</button></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="op" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <OperationMode strategy={activeStrategy!} materials={materials} wallet={wallet} prices={prices} onBack={() => { setActiveStrategy(null); }} />
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
