
import { useState, useEffect } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, RefreshCcw, ShieldCheck, Cpu, Settings, Package, FlaskConical, Database } from 'lucide-react';

// --- HELPER: Gold Formatter ---
const GoldDisplay = ({ amount, size = "md" }: { amount: number, size?: "sm" | "md" | "lg" | "xl" }) => {
  const g = Math.floor(amount / 10000);
  const s = Math.floor((amount % 10000) / 100);
  const c = Math.floor(amount % 100);

  const sizeClasses = {
    "sm": "text-xs",
    "md": "text-sm",
    "lg": "text-xl",
    "xl": "text-3xl"
  };

  return (
    <div className={`font-mono font-bold flex items-baseline gap-1 ${sizeClasses[size]}`}>
      <span className="text-amber-400">{g}g</span>
      <span className="text-zinc-400">{s}s</span>
      {size !== "xl" && <span className="text-amber-700">{c}c</span>}
    </div>
  );
};

// --- COMPONENTS ---

const AnuuMediator = ({ thought, status }: { thought: string, status: 'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE' }) => {
  return (
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
};

const StrategyCard = ({ strategy, onClick }: { strategy: AnuuStrategy, onClick: () => void }) => {
  const isGood = strategy.verdict.includes("RECOMMENDED") || strategy.verdict.includes("VIABLE");
  const bg = isGood ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/10 border-red-500/20';

  return (
    <motion.div layout onClick={onClick} whileHover={{ scale: 1.02 }} className={`p-4 rounded-xl border ${bg} hover:bg-zinc-900/80 transition-all group cursor-pointer relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isGood ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}>
            {strategy.name.includes("Blood") ? "🩸" : strategy.name.includes("Bone") ? "☠️" : strategy.name.includes("Claw") ? "🦅" : strategy.name.includes("Fang") ? "🦷" : strategy.name.includes("Scale") ? "🛡️" : strategy.name.includes("Totem") ? "🗿" : strategy.name.includes("Venom") ? "🐍" : "📦"}
          </div>
          <div>
            <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{strategy.name}</h3>
            <p className={`text-xs font-bold ${isGood ? 'text-emerald-400' : 'text-zinc-500'}`}>{strategy.verdict}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${isGood ? 'text-emerald-400' : 'text-zinc-400'}`}>{strategy.roi.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 mt-2 pt-3 border-t border-white/5">
        <div className="col-span-2 flex justify-between bg-zinc-950/50 p-1.5 rounded">
          <span className="font-bold text-zinc-400 uppercase">Beneficio Neto</span>
          <span className={`font-mono font-bold ${strategy.profitPerCraft > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {Math.floor(strategy.profitPerCraft / 100)}s {Math.floor(strategy.profitPerCraft % 100)}c
          </span>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-full text-sm font-bold text-white shadow-xl">INICIAR OPERACIÓN</div>
      </div>
    </motion.div>
  );
};

interface OperationProps {
  strategy: AnuuStrategy;
  materials: Record<number, number>;
  wallet: Record<number, number>;
  prices: Record<number, MarketItem>;
  onBack: () => void;
}

const OperationMode = ({ strategy, materials, wallet, prices, onBack }: OperationProps) => {
  const [step, setStep] = useState(1);
  const [batchSize, setBatchSize] = useState(10);

  const ownedT5 = materials[strategy.sourceId] || 0;
  const ownedDust = materials[IDS.DUST] || 0;
  const ownedShards = wallet[23] || 0;
  const availableGold = wallet[1] || 0;

  const neededT5 = 50 * batchSize;
  const neededDust = 5 * batchSize;
  const neededShards = 5 * batchSize;
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
  const safeMax = Math.max(0, Math.min(maxByShards || 9999, maxByGold || 9999));

  const totalGoldCost = (missingT5 * priceT5) + (missingDust * priceDust) + (missingT6 * priceT6);
  const canAfford = availableGold >= totalGoldCost;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400">← Volver</button>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-white">{strategy.name}</h2>
          <p className="text-xs text-emerald-400 font-mono">PROTOCOLO ACTIVO</p>
        </div>
      </div>

      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        {[1, 2, 3].map(i => <button key={i} onClick={() => setStep(i)} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${step === i ? 'bg-indigo-600 text-white' : 'text-zinc-500'}`}>{i}. {i === 1 ? 'ADQUISICIÓN' : i === 2 ? 'FORJA' : 'VENTA'}</button>)}
      </div>

      {step === 1 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 flex items-center gap-4 bg-zinc-950 p-6 rounded-xl border border-indigo-500/20">
              <Package className="text-indigo-400" size={32} />
              <div className="flex-1">
                <h3 className="font-bold text-white">Configurar Lote</h3>
                <div className="flex gap-2 items-center mt-2">
                  <input type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 0))} className="bg-black border border-zinc-700 rounded-lg px-3 py-1.5 text-white font-mono w-24" />
                  <button onClick={() => setBatchSize(safeMax || 1)} className="text-[10px] bg-indigo-900 text-indigo-100 px-2 py-1.5 rounded">MAX ({safeMax})</button>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-xl border ${canAfford ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-red-950/10 border-red-500/20'}`}>
              <div className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-tighter">Coste Faltante</div>
              <GoldDisplay amount={totalGoldCost} size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Material T5", name: strategy.sourceName, count: neededT5, owned: ownedT5, cost: missingT5 * priceT5, color: "text-indigo-400" },
              { title: "Dust", name: "Crystalline Dust", count: neededDust, owned: ownedDust, cost: missingDust * priceDust, color: "text-cyan-400" },
              { title: "Catalizador T6", name: strategy.name, count: neededT6, owned: ownedT6, cost: missingT6 * priceT6, color: "text-purple-400" },
              { title: "Spirit Shards", name: "Shards", count: neededShards, owned: ownedShards, cost: 0, color: "text-pink-400" }
            ].map((m, i) => (
              <div key={i} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="flex justify-between text-xs text-zinc-500 font-bold mb-2"><span>{m.title}</span> <span className={m.color}>x{m.count}</span></div>
                <div className="text-white font-bold mb-3">{m.name}</div>
                <div className="flex justify-between text-xs border-t border-zinc-900 pt-2">
                  <span className="text-zinc-600">En Inventario: {m.owned}</span>
                  {m.cost > 0 && <GoldDisplay amount={m.cost} size="sm" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 min-h-[300px] flex flex-col justify-center items-center">
          <FlaskConical size={64} className="mb-4 text-indigo-500 animate-pulse" />
          <h3 className="text-white font-bold text-xl mb-2">Forja Mística</h3>
          <p>Usa la receta de promoción T5 {"->"} T6 para transmutar tus materiales {batchSize} veces.</p>
        </div>
      )}
      {step === 3 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center min-h-[300px] flex flex-col justify-center items-center">
          <p className="text-zinc-500 mb-4 uppercase font-bold text-xs uppercase tracking-widest">Valor de Venta Estimado</p>
          <GoldDisplay amount={strategy.sellPrice * batchSize} size="xl" />
          <p className="text-zinc-500 mt-6">Cobra tus beneficios en el Trading Post.</p>
        </div>
      )}
    </motion.div>
  );
};

// --- MAIN APP ---

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gw2_api_key') || '');
  const [strategies, setStrategies] = useState<AnuuStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<AnuuStrategy | null>(null);
  const [materials, setMaterials] = useState<Record<number, number>>({});
  const [wallet, setWallet] = useState<Record<number, number>>({});
  const [prices, setPrices] = useState<Record<number, MarketItem>>({});
  const [permissions, setPermissions] = useState<string[]>([]);
  const [thought, setThought] = useState("Sistema de monitoreo Anuu Nexus.");
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE'>('IDLE');

  const fetchData = async () => {
    setStatus('THINKING');
    setThought("Sincronizando con los mercados de Tyria...");
    try {
      const allIds = Object.values(IDS).filter(x => typeof x === 'number');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const priceData: any[] = await gw2.getPrices(allIds) as any[];
      const priceMap: Record<number, MarketItem> = {};
      priceData.forEach((p) => { priceMap[p.id] = p; });
      setPrices(priceMap);

      if (apiKey) {
        // Fetch permissions (non-blocking)
        gw2.getTokenInfo(apiKey).then(info => {
          if (info) setPermissions(info.permissions || []);
        });

        // Brute-force parallel fetch
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
      setThought(strats[0] ? `Oportunidad óptima: ${strats[0].name}.` : "Mercado estable.");
      setStatus(strats[0]?.score > 50 ? 'ALERT' : 'IDLE');
    } catch (err) {
      console.error(err);
      setStatus('ALERT');
      setThought("Error de conexión con la red GW2.");
    }
  };

  // Correctly call fetchData on mount
  useEffect(() => {
    if (apiKey) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStrategySelect = (strategy: AnuuStrategy) => {
    setActiveStrategy(strategy);
    setStatus('GUIDE');
    setThought(`Protocolo ${strategy.name} iniciado. Siguiendo flujo de recursos...`);
  };

  const updateApiKey = () => {
    const k = prompt("Introduce tu GW2 API Key:", apiKey);
    if (k !== null) {
      setApiKey(k.trim());
      localStorage.setItem('gw2_api_key', k.trim());
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header API & Wallet */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {apiKey && (
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2 rounded-xl border-indigo-500/20">
              <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Liquidez:</span>
                {wallet[1] !== undefined ? <GoldDisplay amount={wallet[1]} size="md" /> : <span className="text-[10px] text-zinc-600 animate-pulse">CARGANDO...</span>}
              </div>
              <div className="w-px h-6 bg-zinc-800"></div>
              <div className="flex items-center gap-2 px-2">
                <Database size={14} className="text-pink-400" />
                <span className="text-zinc-300 font-mono font-bold">{wallet[23] || 0}</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 ml-auto items-center">
            {apiKey && (
              <div className="flex items-center gap-2 bg-emerald-900/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/30 group relative cursor-help">
                <ShieldCheck size={12} />
                <span className="text-[10px] font-bold">API CONECTADA</span>
                <div className="absolute top-full right-0 mt-2 bg-black border border-zinc-700 p-3 rounded-lg hidden group-hover:block z-50 text-[10px] shadow-2xl min-w-[120px]">
                  <p className="mb-2 border-b border-zinc-800 pb-1 font-bold uppercase">Permisos:</p>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Cuenta:</span> <span>{permissions.includes('account') ? '✓' : '✗'}</span></div>
                    <div className="flex justify-between"><span>Wallet:</span> <span>{permissions.includes('wallet') ? '✓' : '✗'}</span></div>
                    <div className="flex justify-between"><span>Inventario:</span> <span>{permissions.includes('inventories') ? '✓' : '✗'}</span></div>
                  </div>
                </div>
              </div>
            )}
            <button onClick={updateApiKey} className="bg-zinc-800 p-2 rounded-lg border border-zinc-700 hover:text-white transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <AnuuMediator thought={thought} status={status} />

        <AnimatePresence mode="wait">
          {!activeStrategy ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={fetchData} className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-4 rounded-xl mb-8 flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all">
                <RefreshCcw size={20} className={status === 'THINKING' ? 'animate-spin' : ''} />
                {strategies.length > 0 ? "RE-ESCANEAR MERCADO" : "INICIAR ESCANEO"}
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategies.map(s => <StrategyCard key={s.targetId} strategy={s} onClick={() => handleStrategySelect(s)} />)}
              </div>
            </motion.div>
          ) : (
            <motion.div key="op" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <OperationMode strategy={activeStrategy} materials={materials} wallet={wallet} prices={prices} onBack={() => { setActiveStrategy(null); setStatus('IDLE'); }} />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center py-12 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
          Anuu Nexus Protocol // Intelligence Terminal // Tyrian Market Division
        </footer>
      </div>
    </div>
  );
}

export default App;
