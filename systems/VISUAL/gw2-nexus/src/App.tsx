
import { useState, useEffect } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, RefreshCcw, Cpu, Settings, Package, FlaskConical, Database, Zap, Scale, Target, ArrowLeft, ShoppingCart, TrendingUp } from 'lucide-react';

// --- HELPER: Gold Formatter ---
const GoldDisplay = ({ amount, size = "md" }: { amount: number, size?: "sm" | "md" | "lg" | "xl" }) => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const g = Math.floor(absAmount / 10000);
  const s = Math.floor((absAmount % 10000) / 100);
  const c = Math.floor(absAmount % 100);
  const sizeClasses = { "sm": "text-xs", "md": "text-[10px] md:text-sm", "lg": "text-xl", "xl": "text-3xl" };
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
            <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{strategy.name}</h3>
            <p className={`text-[10px] font-bold ${isGood ? 'text-emerald-400' : 'text-zinc-500'}`}>{strategy.verdict}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>{strategy.roi > 0 ? '+' : ''}{strategy.roi.toFixed(1)}%</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 mt-2 pt-3 border-t border-white/5">
        <div className="col-span-2 flex justify-between bg-zinc-950/50 p-1.5 rounded">
          <span className="font-bold text-zinc-400 uppercase text-[9px] tracking-widest">Profit x Forja</span>
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
        <motion.div key={p.id} whileHover={{ y: -5 }} onClick={() => onSelect(p.items, p.title)} className={`bg-zinc-900 border ${p.color} p-5 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-all relative overflow-hidden group`}>
          <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-black/40 rounded-lg">{p.icon}</div><h3 className="font-bold text-zinc-100">{p.title}</h3></div>
          <p className="text-xs text-zinc-500 mb-4">{p.desc}</p>
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

  // MATERIAL REQUIREMENTS
  const costT5 = prices[strategy.sourceId]?.buys?.unit_price || 0;
  const costDust = prices[IDS.DUST]?.buys?.unit_price || 0;
  const costT6 = prices[strategy.targetId]?.buys?.unit_price || 0;

  const ownedT5 = materials[strategy.sourceId] || 0;
  const ownedDust = materials[IDS.DUST] || 0;
  const ownedT6 = materials[strategy.targetId] || 0;
  const ownedShards = wallet[23] || 0;
  const availableGold = wallet[1] || 0;

  const neededT5 = 50 * batchSize;
  const neededDust = 5 * batchSize;
  const neededT6 = 1 * batchSize; // 1 unit as catalyst

  const buyT5 = Math.max(0, neededT5 - ownedT5);
  const buyDust = Math.max(0, neededDust - ownedDust);
  const buyT6 = Math.max(0, neededT6 - ownedT6);

  const totalGoldCost = (buyT5 * costT5) + (buyDust * costDust) + (buyT6 * costT6);
  const canAfford = availableGold >= totalGoldCost;

  const isWeekend = [0, 5, 6].includes(new Date().getDay());
  const multiplier = isWeekend ? 0.25 : 0.15;
  const recommendedBatch = Math.floor(strategy.supplyQty * multiplier);

  const costPerCraft = (50 * costT5) + (5 * costDust) + (1 * costT6);
  const maxByShards = Math.floor(ownedShards / 5);
  const maxByGold = costPerCraft > 0 ? Math.floor(availableGold / costPerCraft) : 0;
  const safeMax = Math.max(0, Math.min(maxByShards, maxByGold));

  const shoppingList = [
    { name: strategy.sourceName, icon: "📦", need: neededT5, have: ownedT5, buy: buyT5, price: costT5 },
    { name: "Crystalline Dust", icon: "✨", need: neededDust, have: ownedDust, buy: buyDust, price: costDust },
    { name: strategy.name, icon: "🛡️", need: neededT6, have: ownedT6, buy: buyT6, price: costT6 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs hover:text-white transition-colors uppercase tracking-widest font-bold">← Nexo</button>
        <div className="text-right">
          <h2 className="text-2xl font-black text-white">{strategy.name}</h2>
          <p className="text-[10px] text-zinc-500 font-mono">STK: {strategy.supplyQty.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 shadow-xl">
        {[1, 2, 3].map(i => <button key={i} onClick={() => setStep(i)} className={`flex-1 py-3 rounded-lg text-xs font-black transition-all ${step === i ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>{i}. {i === 1 ? 'ADQUISICIÓN' : i === 2 ? 'FORJA' : 'VENTA'}</button>)}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><Package className="text-indigo-400" size={32} /></div>
              <div>
                <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Volumen de Operación</h3>
                <div className="flex gap-2 items-center">
                  <input type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 0))} className="bg-black border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono w-28 text-sm focus:border-indigo-500 outline-none transition-all" />
                  <button onClick={() => setBatchSize(safeMax)} className="text-[10px] bg-zinc-800 text-indigo-100 px-3 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors font-bold uppercase">MAX ({safeMax})</button>
                  <button onClick={() => setBatchSize(recommendedBatch)} className="text-[10px] bg-emerald-900/30 text-emerald-300 px-3 py-2 rounded-lg border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors font-bold uppercase italic">REC ({recommendedBatch})</button>
                </div>
              </div>
            </div>
            <div className={`p-6 px-10 rounded-2xl border shadow-2xl transition-all ${canAfford ? 'bg-emerald-950/10 border-emerald-500/30' : 'bg-red-950/20 border-red-500/40'}`}>
              <div className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-widest">Inversión Necesaria</div>
              <GoldDisplay amount={totalGoldCost} size="lg" />
              <div className="mt-2 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${canAfford ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className={`text-[10px] font-bold ${canAfford ? 'text-emerald-500' : 'text-red-500'}`}>{canAfford ? 'LIQUIDEZ CONFIRMADA' : 'FONDOS INSUFICIENTES'}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex items-center gap-2">
              <ShoppingCart size={16} className="text-indigo-400" />
              <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest">Lista de la Compra (Órdenes de Compra)</h3>
            </div>
            <div className="divide-y divide-zinc-800">
              {shoppingList.map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-zinc-500">Stock: {item.have} unidades</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Precio Unit. (Buy)</div>
                      <GoldDisplay amount={item.price} size="sm" />
                    </div>
                    <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 min-w-[120px]">
                      <div className="text-[9px] text-indigo-400 font-bold uppercase mb-1">A Comprar</div>
                      <div className="text-lg font-black text-white">{item.buy.toLocaleString()} <span className="text-[9px] text-zinc-600">u</span></div>
                    </div>
                    <div className="min-w-[100px]">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Subtotal</div>
                      <GoldDisplay amount={item.buy * item.price} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-zinc-950/50 p-4 text-[10px] text-zinc-500 italic flex items-start gap-2">
              <TrendingUp size={14} className="text-emerald-500 shrink-0" />
              <span>Pon órdenes de compra (`Buy Orders`) exactas a estos precios para maximizar el ROI. El sistema ya ha restado lo que tienes en el banco.</span>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-16 text-center shadow-2xl">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <FlaskConical size={80} className="text-indigo-500 absolute inset-0 animate-pulse" />
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-ping"></div>
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Protocolo de Forja</h3>
          <p className="text-zinc-500 font-mono text-sm max-w-sm mx-auto mb-10">Ejecuta la receta <strong>{batchSize} veces</strong> en la Forja Mística:</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <div className="text-[9px] text-zinc-600 font-bold uppercase mb-1">Material 1</div>
              <div className="text-sm font-bold text-zinc-200">50x {strategy.sourceName}</div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <div className="text-[9px] text-zinc-600 font-bold uppercase mb-1">Catalizador</div>
              <div className="text-sm font-bold text-zinc-200">1x {strategy.name}</div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <div className="text-[9px] text-zinc-600 font-bold uppercase mb-1">Agente</div>
              <div className="text-sm font-bold text-zinc-200">5x Dust</div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <div className="text-[9px] text-zinc-600 font-bold uppercase mb-1">Energía</div>
              <div className="text-sm font-bold text-zinc-200">5x Spirit Shards</div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500"><TrendingUp size={200} /></div>
          <p className="text-zinc-500 mb-6 text-xs font-black uppercase tracking-[0.4em]">Proyección Final de Tesorería</p>
          <GoldDisplay amount={strategy.sellPrice * batchSize * 7} size="xl" />
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-2xl border border-emerald-500/20 text-sm font-black uppercase tracking-widest">
              Rendimiento Esperado: ~7x T6 por tirada
            </div>
            <p className="text-zinc-500 text-[10px] max-w-xs italic font-medium mt-4">Calculado considerando impuestos del Bazar (15%) y precios de venta actuales.</p>
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
      if (isWeekend) setThought("Fin de semana detectado: Volumen de Tyria al máximo. Boost de lotes activos.");
      else setThought(strats[0] && strats[0].roi > 0 ? `Análisis completado. Oportunidad: ${strats[0].name}.` : "Mercado escaneado.");
      setStatus('IDLE');
    } catch { setStatus('ALERT'); setThought("Fallo en conexión."); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStrategySelect = (strategy: AnuuStrategy) => {
    setActiveStrategy(strategy);
    setStatus('GUIDE');
    setThought(`Guía paso a paso para ${strategy.name} activa.`);
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {apiKey && (
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl shadow-inner cursor-pointer hover:bg-zinc-800 transition-colors" onClick={fetchData}>
              <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ORO:</span>
                {wallet[1] !== undefined ? <GoldDisplay amount={wallet[1]} size="md" /> : <span className="text-zinc-600 animate-pulse text-xs">...</span>}
              </div>
              <div className="w-px h-6 bg-zinc-800"></div>
              <div className="flex items-center gap-2 px-2">
                <Database size={14} className="text-pink-500" /><span className="text-zinc-200 font-mono font-bold">{wallet[23] || 0}</span>
              </div>
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <button onClick={fetchData} className="bg-zinc-900 border border-zinc-700 p-2.5 rounded-xl hover:text-white transition-colors" title="Actualizar"><RefreshCcw size={16} className={status === 'THINKING' ? 'animate-spin' : ''} /></button>
            <button onClick={() => { const k = prompt("API Key:", apiKey); if (k) { localStorage.setItem('gw2_api_key', k.trim()); window.location.reload(); } }} className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-700 hover:text-white transition-colors"><Settings size={16} /></button>
          </div>
        </div>

        <AnuuMediator thought={thought} status={status} onReload={fetchData} />

        <AnimatePresence mode="wait">
          {!activeStrategy && !multiStrategy ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 ml-1"><Zap size={14} className="text-indigo-400" /> División Táctica</div>
              <DiversificationHub strategies={strategies} onSelect={handleMultiSelect} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategies.map(s => <StrategyCard key={s.targetId} strategy={s} onClick={() => handleStrategySelect(s)} />)}
              </div>
            </motion.div>
          ) : multiStrategy ? (
            <motion.div key="multi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex justify-between items-center"><button onClick={() => setMultiStrategy(null)} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors"><ArrowLeft size={16} /> Volver</button><h2 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">{multiTitle}</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
                {multiStrategy.map(s => (
                  <motion.div whileHover={{ y: -5 }} key={s.targetId} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer group" onClick={() => handleStrategySelect(s)}>
                    <h3 className="font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-widest text-xs">{s.name}</h3>
                    <div className="flex justify-between items-center"><span className="text-[10px] text-zinc-500 uppercase font-mono">ROI PROYECTADO:</span><span className={s.roi > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{s.roi > 0 ? '+' : ''}{s.roi.toFixed(1)}%</span></div>
                    <div className="mt-6"><button className="w-full bg-indigo-600/10 text-indigo-400 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Ver Hoja de Ruta</button></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="op" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <OperationMode strategy={activeStrategy!} materials={materials} wallet={wallet} prices={prices} onBack={() => { setActiveStrategy(null); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
