
import { useState, useEffect } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, RefreshCcw, Cpu, Settings, Package, FlaskConical, Database, Zap, Scale, Target, ArrowLeft, ShoppingCart, TrendingUp, Sparkles, MapPin, Gavel, BarChart3, Clock } from 'lucide-react';

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
        <p className={`text-lg font-medium leading-relaxed ${status === 'THINKING' ? 'text-fuchsia-200' : 'text-zinc-300'}`}>"{thought}"</p>
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
            {strategy.name.includes("Blood") ? "🩸" : strategy.name.includes("Bone") ? "☠️" : strategy.name.includes("Claw") ? "🦅" : strategy.name.includes("Fang") ? "🦷" : strategy.name.includes("Scale") ? "🛡️" : strategy.name.includes("Totem") ? "🗿" : strategy.name.includes("Venom") ? "🐍" : "📦"}
          </div>
          <div>
            <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors uppercase text-xs tracking-widest">{strategy.name}</h3>
            <p className={`text-[9px] font-bold ${isGood ? 'text-emerald-400' : 'text-zinc-500'}`}>{strategy.verdict}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>{strategy.roi > 0 ? '+' : ''}{strategy.roi.toFixed(1)}%</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 mt-2 pt-3 border-t border-white/5">
        <div className="col-span-2 flex justify-between bg-zinc-950/50 p-1.5 rounded">
          <span className="font-bold text-zinc-400 uppercase text-[8px] tracking-[0.2em] self-center">Profit x Forja</span>
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
  const pT5 = prices[strategy.sourceId];
  const pDust = prices[IDS.DUST];
  const pT6 = prices[strategy.targetId];

  const priceOrderT5 = pT5?.buys?.unit_price || 0;
  const priceInstaT5 = pT5?.sells?.unit_price || 0;
  const priceOrderDust = pDust?.buys?.unit_price || 0;
  const priceInstaDust = pDust?.sells?.unit_price || 0;
  const priceOrderT6 = pT6?.buys?.unit_price || 0;
  const priceInstaT6 = pT6?.sells?.unit_price || 0;

  const ownedT5 = materials[strategy.sourceId] || 0;
  const ownedDust = materials[IDS.DUST] || 0;
  const ownedT6 = materials[strategy.targetId] || 0;
  const ownedShards = wallet[23] || 0;
  const availableGold = wallet[1] || 0;

  const neededT5 = 50 * batchSize;
  const neededDust = 5 * batchSize;
  const neededT6 = 1 * batchSize;

  const neededStones = 5 * batchSize;
  const neededShards = Math.ceil(neededStones / 10);

  const buyT5 = Math.max(0, neededT5 - ownedT5);
  const buyDust = Math.max(0, neededDust - ownedDust);
  const buyT6 = Math.max(0, neededT6 - ownedT6);

  const totalGoldCost = (buyT5 * priceOrderT5) + (buyDust * priceOrderDust) + (buyT6 * priceOrderT6);
  const totalInstaCost = (buyT5 * priceInstaT5) + (buyDust * priceInstaDust) + (buyT6 * priceInstaT6);
  const savings = totalInstaCost - totalGoldCost;

  const isWeekend = [0, 5, 6].includes(new Date().getDay());
  const multiplier = isWeekend ? 0.25 : 0.15;
  const recommendedBatch = Math.floor(strategy.supplyQty * multiplier);

  const costPerCraft = (50 * priceOrderT5) + (5 * priceOrderDust) + (1 * priceOrderT6);
  const maxByShards = Math.floor(ownedShards / 0.5);
  const maxByGold = costPerCraft > 0 ? Math.floor(availableGold / costPerCraft) : 0;
  const safeMax = Math.max(0, Math.min(maxByShards, maxByGold));

  const shoppingList = [
    { name: strategy.sourceName, icon: "📦", need: neededT5, have: ownedT5, buy: buyT5, priceOrder: priceOrderT5, priceInsta: priceInstaT5, supply: pT5?.sells.quantity || 0 },
    { name: "Crystalline Dust", icon: "✨", need: neededDust, have: ownedDust, buy: buyDust, priceOrder: priceOrderDust, priceInsta: priceInstaDust, supply: pDust?.sells.quantity || 0 },
    { name: strategy.name, icon: "🛡️", need: neededT6, have: ownedT6, buy: buyT6, priceOrder: priceOrderT6, priceInsta: priceInstaT6, supply: pT6?.sells.quantity || 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-500 text-[10px] hover:text-white transition-colors uppercase tracking-[0.2em] font-black">← Volver al Nexo</button>
        <div className="text-right">
          <h2 className="text-2xl font-black text-white">{strategy.name}</h2>
          <p className="text-[10px] text-zinc-500 font-mono italic">VOLUMEN MERCADO: {strategy.supplyQty.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-fuchsia-500/5 pointer-events-none"></div>
        {[1, 2, 3].map(i => <button key={i} onClick={() => setStep(i)} className={`flex-1 py-3 rounded-lg text-[10px] font-black tracking-widest transition-all relative z-10 ${step === i ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-300 uppercase'}`}>{i}. {i === 1 ? 'ADQUISICIÓN' : i === 2 ? 'FORJA' : i === 3 ? 'VENTA' : ''}</button>)}
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
              <div className="text-[9px] text-zinc-600 font-black mb-1 uppercase tracking-widest text-center md:text-left">Inversión Necesaria</div>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <GoldDisplay amount={totalGoldCost} size="lg" />
                <div className={`text-sm font-black flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border ${ownedShards >= neededShards ? 'border-indigo-500/30 text-indigo-400' : 'border-red-500/30 text-red-400'}`}>
                  <span className="text-[10px] opacity-60">&</span>
                  <Database size={14} />
                  <span>{neededShards} <span className="text-[10px] opacity-60">SHARDS</span></span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-[9px] text-zinc-500 font-bold uppercase">Ahorro x Orden</span>
                <span className="text-emerald-400 font-mono text-xs">+{Math.floor(savings / 10000)}g...</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-zinc-950 p-5 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-indigo-500" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Hoja de Adquisición Táctica</h3>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-black text-zinc-600 uppercase">
                <div className="flex items-center gap-1"><MapPin size={12} /> Bazaar</div>
                <div className="flex items-center gap-1"><Gavel size={12} /> Buy Orders</div>
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
                        <div className="text-[9px] text-zinc-600 font-black uppercase flex items-center gap-1"><Database size={10} /> Stock: {item.have}</div>
                        <div className="text-[9px] text-zinc-600 font-black uppercase flex items-center gap-1"><Clock size={10} /> Velocidad: {item.supply > 50000 ? 'Relámpago' : item.supply > 20000 ? 'Rápida' : 'Moderada'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full lg:w-auto text-right">
                    <div className="hidden md:block">
                      <div className="text-[8px] text-zinc-600 font-black uppercase mb-1 tracking-widest opacity-60">Insta-Compra</div>
                      <GoldDisplay amount={item.priceInsta} size="sm" />
                    </div>
                    <div>
                      <div className="text-[8px] text-indigo-400 font-black uppercase mb-1 tracking-widest">Tu Puja (Order)</div>
                      <GoldDisplay amount={item.priceOrder} size="sm" />
                    </div>
                    <div className="bg-black/60 px-5 py-3 rounded-2xl border border-indigo-500/20 shadow-inner min-w-[120px]">
                      <div className="text-[8px] text-indigo-400 font-black uppercase mb-1 flex items-center gap-1 justify-end">Pedir <TrendingUp size={8} /></div>
                      <div className="text-xl font-black text-white">{item.buy.toLocaleString()} <span className="text-[10px] text-zinc-700 font-mono">u.</span></div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[8px] text-emerald-500 font-black uppercase mb-1 tracking-widest opacity-80">Ahorro</div>
                      <GoldDisplay amount={(item.priceInsta - item.priceOrder) * item.buy} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 bg-zinc-950/50 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-zinc-800">
              <div className="flex gap-3 items-start">
                <Gavel size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed max-w-xl">
                  <strong>PROTOCOLO DE AHORRO:</strong> Pon tus órdenes a <strong>+1 cobre</strong> por encima de la oferta actual. Usar "Buy Orders" nos asegura el profit; comprar al instante ("Insta-Buy") recortaría tus beneficios en un <strong>{Math.floor((savings / totalGoldCost) * 100)}%</strong>.
                </p>
              </div>
              <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-3">
                <BarChart3 size={16} className="text-emerald-400" />
                <div className="text-right">
                  <div className="text-[8px] text-emerald-400 font-black uppercase">Plus por Paciencia</div>
                  <GoldDisplay amount={savings} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 rounded-2xl p-4 flex items-center gap-3">
            <MapPin size={18} className="text-fuchsia-400" />
            <div className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-widest">LOCALIZACIÓN: FORJA MÍSTICA (ARCO DEL LEÓN O HUBS)</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl">
                <FlaskConical size={32} className="text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-2">Protocolo de Forja</h3>
              <p className="text-zinc-500 font-mono text-xs max-w-md mx-auto mb-10 border-t border-zinc-800 pt-6">Repite este proceso <strong className="text-indigo-400 text-lg mx-1">{batchSize}</strong> veces en la Forja Mística.</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto items-center">
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-5 rounded-2xl border border-zinc-700 shadow-xl group transition-all hover:scale-105">
                  <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">📦</div>
                  <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">Hueco 1</div>
                  <div className="text-sm font-black text-white">50x {strategy.sourceName}</div>
                </div>
                <div className="text-zinc-700 font-black">+</div>
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-5 rounded-2xl border border-zinc-700 shadow-xl transition-all hover:scale-105">
                  <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">🛡️</div>
                  <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">Hueco 2</div>
                  <div className="text-sm font-black text-indigo-400">1x {strategy.name}</div>
                </div>
                <div className="text-zinc-700 font-black">+</div>
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-5 rounded-2xl border border-zinc-700 shadow-xl transition-all hover:scale-105">
                  <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">✨</div>
                  <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">Hueco 3</div>
                  <div className="text-sm font-black text-white">5x Dust</div>
                </div>
                <div className="text-zinc-700 font-black">+</div>
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-5 rounded-2xl border border-zinc-700 shadow-xl transition-all hover:scale-105 border-indigo-500/30 shadow-indigo-900/20">
                  <div className="w-12 h-12 bg-black/40 rounded-xl mb-3 mx-auto flex items-center justify-center text-2xl border border-white/5">💎</div>
                  <div className="text-[8px] text-zinc-500 font-black uppercase mb-1">Hueco 4</div>
                  <div className="text-sm font-black text-indigo-300 uppercase">5x Piedra Filosofal</div>
                </div>
              </div>

              <div className="mt-12 p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-[10px] text-zinc-400 font-medium inline-flex flex-col items-center gap-2 shadow-inner">
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-indigo-400" />
                  <span>Para este lote necesitas: <strong>{neededStones} Piedras Filosofales</strong>.</span>
                </div>
                <div className="text-[9px] text-zinc-500 italic opacity-80 pt-1 border-t border-white/5">
                  Coste: <strong>{neededShards} Espíritu(s)</strong> (Compra 10 piedras por 1 espíritu a Miyani).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
            <MapPin size={18} className="text-emerald-400" />
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">LOCALIZACIÓN: BAZAR (TRADING POST)</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-zinc-500 mb-8 text-[11px] font-black uppercase tracking-[0.5em]">Liquidación en el Bazaar</p>
              <GoldDisplay amount={strategy.sellPrice * batchSize * 7} size="xl" />
              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="bg-emerald-500/10 text-emerald-400 px-8 py-4 rounded-2xl border border-emerald-500/20 text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                  Estimación de Retorno (7.0x Yield)
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 max-w-sm">
                  <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><Gavel size={12} /> Instrucciones de Venta</h4>
                  <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Publica tus materiales resultantes como <strong>"Vender" (Sell Listing)</strong> respetando el precio de mercado actual. No uses la venta instantánea.</p>
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
  const [thought, setThought] = useState("Tyrian Market Division.");
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE'>('IDLE');

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
      const isWeekend = [0, 5, 6].includes(new Date().getDay());
      if (isWeekend) setThought("Fin de semana detectado: El Bazaar registra actividad máxima en Tyria. Lotes recomendados aumentados.");
      else setThought(strats[0] && strats[0].roi > 0 ? `Análisis completado. Oportunidad: ${strats[0].name}.` : "Mercado escaneado.");
      setStatus('IDLE');
    } catch { setStatus('ALERT'); setThought("Fallo en conexión."); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStrategySelect = (strategy: AnuuStrategy) => {
    setActiveStrategy(strategy);
    setStatus('GUIDE');
    setThought(`Hoja de ruta táctica proyectada para ${strategy.name}.`);
  };

  const handleMultiSelect = (strats: AnuuStrategy[], title: string) => {
    setMultiStrategy(strats);
    setMultiTitle(title);
    setStatus('GUIDE');
    setThought(`Diversificación "${title}" cargada.`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-row justify-between items-center gap-4">
          {apiKey && (
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-all border-b-4 border-b-indigo-500/20" onClick={fetchData}>
              <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">ORO ACTUAL:</span>
                {wallet[1] !== undefined ? <GoldDisplay amount={wallet[1]} size="md" /> : <span className="text-zinc-600 animate-pulse text-xs">...</span>}
              </div>
              <div className="w-px h-6 bg-zinc-800"></div>
              <div className="flex items-center gap-2 px-2">
                <Database size={16} className="text-indigo-400" /><span className="text-zinc-200 font-mono font-black text-sm">{wallet[23] || 0}</span>
              </div>
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <button onClick={fetchData} className="bg-zinc-900 border border-zinc-700 p-3 rounded-2xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><RefreshCcw size={18} className={status === 'THINKING' ? 'animate-spin' : ''} /></button>
            <button onClick={() => { const k = prompt("API Key:", apiKey); if (k) { localStorage.setItem('gw2_api_key', k.trim()); window.location.reload(); } }} className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"><Settings size={18} /></button>
          </div>
        </div>

        <AnuuMediator thought={thought} status={status} onReload={fetchData} />

        <AnimatePresence mode="wait">
          {!activeStrategy && !multiStrategy ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="mb-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] flex items-center gap-2 ml-1">División Táctica del Nexo</div>
              <DiversificationHub strategies={strategies} onSelect={handleMultiSelect} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategies.map(s => <StrategyCard key={s.targetId} strategy={s} onClick={() => handleStrategySelect(s)} />)}
              </div>
            </motion.div>
          ) : multiStrategy ? (
            <motion.div key="multi" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-8">
              <div className="flex justify-between items-center"><button onClick={() => setMultiStrategy(null)} className="flex items-center gap-3 text-zinc-600 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all group"><ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver</button><h2 className="text-3xl font-black bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent italic">{multiTitle}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {multiStrategy.map(s => (
                  <motion.div whileHover={{ y: -8, scale: 1.02 }} key={s.targetId} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-2xl" onClick={() => handleStrategySelect(s)}>
                    <div className="text-4xl mb-6 bg-black/40 w-16 h-16 flex items-center justify-center rounded-2xl border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                      {s.name.includes("Blood") ? "🩸" : s.name.includes("Bone") ? "☠️" : s.name.includes("Claw") ? "🦅" : s.name.includes("Fang") ? "🦷" : s.name.includes("Scale") ? "🛡️" : s.name.includes("Totem") ? "🗿" : s.name.includes("Venom") ? "🐍" : "📦"}
                    </div>
                    <h3 className="font-black text-white mb-2 uppercase tracking-tight text-sm">{s.name}</h3>
                    <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-4"><span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">ROI:</span><span className={s.roi > 0 ? 'text-emerald-400 font-black text-lg' : 'text-red-400 font-black text-lg'}>{s.roi > 0 ? '+' : ''}{s.roi.toFixed(1)}%</span></div>
                    <div className="mt-8"><button className="w-full bg-indigo-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 active:scale-95 transition-all">Iniciar Forja</button></div>
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
        <div className="max-w-4xl mx-auto flex justify-between items-center text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em]">
          <span>Anuu_Verse Nexus v2.8</span>
          <span>Forja Mística: Protocolo de Transmutación</span>
        </div>
      </div>
    </div>
  );
}

export default App;
