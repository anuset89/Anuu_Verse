
import { useState, useEffect } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, RefreshCcw, Cpu, Settings, Package, FlaskConical, Database, Info, Zap, Scale, Target, ArrowRight, ArrowLeft } from 'lucide-react';

// --- HELPER: Gold Formatter ---
const GoldDisplay = ({ amount, size = "md" }: { amount: number, size?: "sm" | "md" | "lg" | "xl" }) => {
  const g = Math.floor(amount / 10000);
  const s = Math.floor((amount % 10000) / 100);
  const c = Math.floor(amount % 100);
  const sizeClasses = { "sm": "text-xs", "md": "text-[10px] md:text-sm", "lg": "text-xl", "xl": "text-3xl" };
  return (
    <div className={`font-mono font-bold flex items-baseline gap-1 ${sizeClasses[size]}`}>
      <span className="text-amber-400">{g}g</span>
      <span className="text-zinc-400">{s}s</span>
      {size !== "xl" && <span className="text-amber-700">{c}c</span>}
    </div>
  );
};

// --- COMPONENTS ---

const AnuuMediator = ({ thought, status }: { thought: string, status: 'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE' }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 mb-8 ${status === 'THINKING' ? 'bg-zinc-900 border-fuchsia-500/50 shadow-lg shadow-fuchsia-900/20' : status === 'ALERT' ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-900/20' : status === 'GUIDE' ? 'bg-zinc-900 border-indigo-500/50 shadow-lg shadow-indigo-900/20' : 'bg-zinc-950 border-zinc-800'}`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={120} /></div>
    <div className="flex items-start gap-5 relative z-10">
      <div className={`p-3 rounded-full border-2 ${status === 'THINKING' ? 'border-fuchsia-500 bg-fuchsia-500/10 animate-pulse' : status === 'ALERT' ? 'border-emerald-500 bg-emerald-500/10' : status === 'GUIDE' ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 bg-zinc-800'}`}>
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
  const isGood = strategy.verdict.includes("RECOMMENDED") || strategy.verdict.includes("VIABLE");
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
          <p className={`text-xl font-black ${isGood ? 'text-emerald-400' : 'text-zinc-400'}`}>{strategy.roi.toFixed(1)}%</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 mt-2 pt-3 border-t border-white/5">
        <div className="col-span-2 flex justify-between bg-zinc-950/50 p-1.5 rounded">
          <span className="font-bold text-zinc-400 uppercase">Beneficio</span>
          <GoldDisplay amount={strategy.profitPerCraft} size="sm" />
        </div>
      </div>
    </motion.div>
  );
};

// --- DIVERSIFICATION HUB ---
const DiversificationHub = ({ strategies, onSelect }: { strategies: AnuuStrategy[], onSelect: (strats: AnuuStrategy[], profile: string) => void }) => {
  // 1. High Turnover (Supply Qty)
  const hot = [...strategies].sort((a, b) => b.supplyQty - a.supplyQty).slice(0, 3);
  // 2. Balanced (Score)
  const balanced = [...strategies].sort((a, b) => b.score - a.score).slice(0, 3);
  // 3. Max Profit (ROI)
  const maxProfit = [...strategies].sort((a, b) => b.roi - a.roi).slice(0, 3);

  const profiles = [
    { id: 'hot', title: 'Relámpago', icon: <Zap className="text-yellow-400" />, items: hot, desc: 'Prioriza volumen. Rotación < 2h.', color: 'border-yellow-500/30' },
    { id: 'balanced', title: 'Equilibrado', icon: <Scale className="text-indigo-400" />, items: balanced, desc: 'Riesgo/Beneficio óptimo. 4-8h.', color: 'border-indigo-500/30' },
    { id: 'profit', title: 'Francotirador', icon: <Target className="text-red-400" />, items: maxProfit, desc: 'Máximo ROI. Venta en 12-24h.', color: 'border-red-500/30' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {profiles.map(p => (
        <motion.div
          key={p.id} whileHover={{ y: -5 }}
          onClick={() => onSelect(p.items, p.title)}
          className={`bg-zinc-900 border ${p.color} p-5 rounded-2xl cursor-pointer hover:bg-zinc-800 transition-all relative overflow-hidden group`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-black/40 rounded-lg">{p.icon}</div>
            <h3 className="font-bold text-zinc-100">{p.title}</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4">{p.desc}</p>
          <div className="space-y-2">
            {p.items.map(item => (
              <div key={item.targetId} className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-400 truncate w-24">/ {item.name}</span>
                <span className="text-emerald-400 font-bold">+{item.roi.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
            <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- OPERATION MODE ---
const OperationMode = ({ strategy, materials, wallet, prices, onBack }: { strategy: AnuuStrategy, materials: Record<number, number>, wallet: Record<number, number>, prices: Record<number, MarketItem>, onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [batchSize, setBatchSize] = useState(10);
  const ownedT5 = materials[strategy.sourceId] || 0;
  const ownedDust = materials[IDS.DUST] || 0;
  const ownedShards = wallet[23] || 0;
  const availableGold = wallet[1] || 0;
  const neededT5 = 50 * batchSize;
  const neededDust = 5 * batchSize;
  const ownedT6 = materials[strategy.targetId] || 0;
  const neededT6 = 1 * batchSize;
  const missingT5 = Math.max(0, neededT5 - ownedT5);
  const missingDust = Math.max(0, neededDust - ownedDust);
  const missingT6 = Math.max(0, neededT6 - ownedT6);
  const priceT5 = prices[strategy.sourceId]?.buys?.unit_price || 0;
  const priceDust = prices[IDS.DUST]?.buys?.unit_price || 0;
  const priceT6 = prices[strategy.targetId]?.buys?.unit_price || 0;
  const costPerCraft = (50 * priceT5) + (5 * priceDust) + (1 * priceT6);
  const maxByShards = Math.floor(ownedShards / 5);
  const maxByGold = costPerCraft > 0 ? Math.floor(availableGold / costPerCraft) : 0;
  const safeMax = Math.max(0, Math.min(maxByShards, maxByGold));
  const totalGoldCost = (missingT5 * priceT5) + (missingDust * priceDust) + (missingT6 * priceT6);
  const canAfford = availableGold >= totalGoldCost;

  // WEEKEND LOGIC
  const isWeekend = [0, 5, 6].includes(new Date().getDay());
  const multiplier = isWeekend ? 0.25 : 0.15; // +10% batch size during high turnover days
  const recommendedBatch = Math.floor(strategy.supplyQty * multiplier);
  const saturation = (batchSize / strategy.supplyQty) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-xs">← Volver</button>
        <div className="text-right">
          <h2 className="text-xl font-bold text-white">{strategy.name}</h2>
          <p className="text-[10px] text-emerald-400 font-mono">STOCK: {strategy.supplyQty}</p>
        </div>
      </div>
      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        {[1, 2, 3].map(i => <button key={i} onClick={() => setStep(i)} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${step === i ? 'bg-indigo-600 text-white' : 'text-zinc-500'}`}>{i}. {i === 1 ? 'ADQUISICIÓN' : i === 2 ? 'FORJA' : 'VENTA'}</button>)}
      </div>
      {step === 1 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col gap-4 bg-zinc-950 p-6 rounded-xl border border-indigo-500/20">
              <div className="flex items-center gap-4">
                <Package className="text-indigo-400" size={32} />
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">Configurar Lote {isWeekend && <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1 rounded ml-2">BOOST FINDE</span>}</h3>
                  <div className="flex gap-2 items-center mt-2">
                    <input type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 0))} className="bg-black border border-zinc-700 rounded-lg px-3 py-1.5 text-white font-mono w-20 text-xs" />
                    <button onClick={() => setBatchSize(safeMax)} className="text-[10px] bg-zinc-800 text-indigo-100 px-2 py-1.5 rounded border border-zinc-700">MAX ({safeMax})</button>
                    <button onClick={() => setBatchSize(recommendedBatch)} className="text-[10px] bg-emerald-900/30 text-emerald-300 px-2 py-1.5 rounded border border-emerald-500/30">REC ({recommendedBatch})</button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-indigo-900/10 rounded-lg border border-indigo-500/20 text-[10px]">
                <Info size={14} className="text-indigo-400" />
                <span className="text-zinc-400">Impacto en Mercado:</span>
                <span className={`font-bold ${saturation > 30 ? 'text-red-400' : saturation > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {saturation.toFixed(1)}% {saturation > 30 ? '(ALTO)' : saturation > 15 ? '(MODERADO)' : '(BAJO)'}
                </span>
              </div>
            </div>
            <div className={`p-6 rounded-xl border ${canAfford ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-red-950/10 border-red-500/20'} flex flex-col justify-center`}>
              <div className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-tighter">Coste Faltante</div>
              <GoldDisplay amount={totalGoldCost} size="lg" />
            </div>
          </div>
        </div>
      )}
      {step === 2 && <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500"><FlaskConical size={64} className="mb-4 text-indigo-500 mx-auto animate-pulse" /><p>Opera {batchSize} veces.</p></div>}
      {step === 3 && <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center"><p className="text-zinc-500 mb-4 text-xs font-bold">VALOR ESTIMADO</p><GoldDisplay amount={strategy.sellPrice * batchSize * 2} size="xl" /></div>}
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
      console.log("DEBUG: Iniciando Scan...");
      const allIds = Object.values(IDS).filter(x => typeof x === 'number');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const priceData: any[] = await gw2.getPrices(allIds) as any[];
      console.log("DEBUG: Precios recibidos:", priceData.length);

      const priceMap: Record<number, MarketItem> = {};
      priceData.forEach((p) => { priceMap[p.id] = p; });
      setPrices(priceMap);

      if (apiKey) {
        console.log("DEBUG: Fetching Account Data...");
        gw2.getMaterials(apiKey).then(mats => {
          const matMap: Record<number, number> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mats.forEach((m: any) => { matMap[m.id] = m.count; });
          setMaterials(matMap);
        }).catch(e => console.error("Mats failed", e));

        gw2.getWallet(apiKey).then(wData => {
          const walletMap: Record<number, number> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          wData.forEach((w: any) => { walletMap[w.id] = w.value; });
          setWallet(walletMap);
        }).catch(e => console.error("Wallet failed", e));
      }

      const strats = analyzeMarket(priceMap);
      setStrategies(strats);

      const isWeekend = [0, 5, 6].includes(new Date().getDay());
      if (isWeekend) {
        setThought("Fin de semana detectado: El nexo registra alta rotación en Tyria. He aumentado los lotes recomendados (+60%).");
      } else {
        setThought(strats[0] ? `Análisis completado. Oportunidad: ${strats[0].name}.` : "Mercado escaneado. Selecciona una operación.");
      }
      setStatus('IDLE');
    } catch (err) {
      console.error("DEBUG: Scan Error:", err);
      setStatus('ALERT');
      setThought("Fallo en la conexión con la red GW2. Reintenta.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStrategySelect = (strategy: AnuuStrategy) => {
    setActiveStrategy(strategy);
    setStatus('GUIDE');
    setThought(`Protocolo unitario activo.`);
  };

  const handleMultiSelect = (strats: AnuuStrategy[], title: string) => {
    setMultiStrategy(strats);
    setMultiTitle(title);
    setStatus('GUIDE');
    setThought(`Protocolo de Diversificación "${title}" activo. Divide tu presupuesto entre estos 3 activos.`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {apiKey && (
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2 rounded-xl">
              <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">ORO:</span>
                {wallet[1] !== undefined ? <GoldDisplay amount={wallet[1]} size="md" /> : "..."}
              </div>
              <div className="w-px h-6 bg-zinc-800"></div>
              <div className="flex items-center gap-2 px-2">
                <Database size={14} className="text-pink-400" /><span className="text-zinc-300 font-mono font-bold">{wallet[23] || 0}</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 ml-auto items-center">
            <button
              onClick={() => { const k = prompt("API Key:", apiKey); if (k) { localStorage.setItem('gw2_api_key', k.trim()); window.location.reload(); } }}
              className="bg-zinc-800 p-2 rounded-lg border border-zinc-700 hover:text-white"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        <AnuuMediator thought={thought} status={status} />

        <AnimatePresence mode="wait">
          {!activeStrategy && !multiStrategy ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-4 text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} /> Selecciona Estrategia por Tiempo de Venta
              </div>
              <DiversificationHub strategies={strategies} onSelect={handleMultiSelect} />

              <button onClick={fetchData} className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-4 rounded-xl mb-12 flex items-center justify-center gap-2 transition-all">
                <RefreshCcw size={20} className={status === 'THINKING' ? 'animate-spin' : ''} /> RE-ESCANEAR
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategies.map(s => <StrategyCard key={s.targetId} strategy={s} onClick={() => handleStrategySelect(s)} />)}
              </div>
            </motion.div>
          ) : multiStrategy ? (
            <motion.div key="multi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <button onClick={() => setMultiStrategy(null)} className="flex items-center gap-2 text-zinc-500"><ArrowLeft size={16} /> Volver</button>
                <h2 className="text-2xl font-bold">Operación: {multiTitle}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
                {multiStrategy.map(s => (
                  <div key={s.targetId} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <h3 className="font-bold text-zinc-200 mb-2">{s.name}</h3>
                    <div className="text-[10px] text-zinc-500 mb-4 uppercase">Stock: {s.supplyQty}</div>
                    <button onClick={() => handleStrategySelect(s)} className="w-full bg-indigo-600 py-2 rounded-lg text-xs font-bold">OPERAR ESTE</button>
                  </div>
                ))}
              </div>
              <div className="bg-black/40 border border-zinc-800 p-6 rounded-2xl text-center">
                <p className="text-sm text-zinc-500 italic">"Divide tu presupuesto equitativamente para mitigar riesgos de competencia."</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="op" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <OperationMode strategy={activeStrategy!} materials={materials} wallet={wallet} prices={prices} onBack={() => { setActiveStrategy(null); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
