
import { useState } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, RefreshCcw, AlertTriangle, ShieldCheck, Cpu, Settings } from 'lucide-react';

// --- COMPONENTS ---

const AnuuMediator = ({ thought, status }: { thought: string, status: 'IDLE' | 'THINKING' | 'ALERT' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
                relative overflow-hidden rounded-2xl p-6 border transition-all duration-500
                ${status === 'THINKING' ? 'bg-zinc-900 border-fuchsia-500/50 shadow-lg shadow-fuchsia-900/20' :
          status === 'ALERT' ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-900/20' :
            'bg-zinc-950 border-zinc-800'}
            `}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Brain size={120} />
      </div>

      <div className="flex items-start gap-5 relative z-10">
        <div className={`
                    p-3 rounded-full border-2 
                    ${status === 'THINKING' ? 'border-fuchsia-500 bg-fuchsia-500/10 animate-pulse' :
            status === 'ALERT' ? 'border-emerald-500 bg-emerald-500/10' :
              'border-zinc-700 bg-zinc-800'}
                `}>
          <Cpu size={32} className={status === 'THINKING' ? 'text-fuchsia-400' : status === 'ALERT' ? 'text-emerald-400' : 'text-zinc-500'} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Anuu Nexus Core</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${status === 'THINKING' ? 'bg-fuchsia-900 text-fuchsia-300' : 'bg-zinc-800 text-zinc-500'}`}>
              {status === 'THINKING' ? 'PROCESSING' : 'ONLINE'}
            </span>
          </div>
          <p className={`text-lg font-medium leading-relaxed ${status === 'THINKING' ? 'text-fuchsia-200' : 'text-zinc-300'}`}>
            "{thought}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const StrategyCard = ({ strategy }: { strategy: AnuuStrategy }) => {
  const isGood = strategy.verdict.includes("RECOMMENDED") || strategy.verdict.includes("VIABLE");
  const bg = isGood ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/10 border-red-500/20';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border ${bg} hover:bg-zinc-900/80 transition-all group`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isGood ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}>
            {strategy.name.includes("Blood") ? <div className="text-red-400">🩸</div> :
              strategy.name.includes("Bone") ? <div className="text-zinc-200">☠️</div> :
                strategy.name.includes("Claw") ? <div className="text-yellow-200">🦅</div> :
                  strategy.name.includes("Fang") ? <div className="text-orange-200">🦷</div> :
                    strategy.name.includes("Scale") ? <div className="text-blue-200">🛡️</div> :
                      strategy.name.includes("Totem") ? <div className="text-purple-200">🗿</div> :
                        strategy.name.includes("Venom") ? <div className="text-green-200">🐍</div> : <div className="text-zinc-400">📦</div>
            }
          </div>
          <div>
            <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{strategy.name}</h3>
            <p className={`text-xs font-bold ${isGood ? 'text-emerald-400' : 'text-zinc-500'}`}>{strategy.verdict}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${isGood ? 'text-emerald-400' : 'text-zinc-400'}`}>{strategy.roi.toFixed(1)}% ROI</p>
          <p className="text-xs text-zinc-500">Volatilidad: {strategy.volatility.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 mt-2 pt-3 border-t border-white/5">
        <div className="flex justify-between">
          <span>Coste:</span>
          <span className="text-zinc-300">{Math.floor(strategy.costPerUnit / 10000)}g {Math.floor((strategy.costPerUnit % 10000) / 100)}s</span>
        </div>
        <div className="flex justify-between">
          <span>Venta:</span>
          <span className="text-zinc-300">{Math.floor(strategy.sellPrice / 10000)}g {Math.floor((strategy.sellPrice % 10000) / 100)}s</span>
        </div>
        <div className="col-span-2 flex justify-between bg-zinc-950/50 p-1.5 rounded mt-1">
          <span className="font-bold text-zinc-400 uppercase">Ganancia Neta</span>
          <span className={`font-mono font-bold ${strategy.profitPerCraft > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {strategy.profitPerCraft > 0 ? '+' : ''}{Math.floor(strategy.profitPerCraft / 100)}s {Math.floor(strategy.profitPerCraft % 100)}c
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- APP ---

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gw2_api_key') || '');
  const [strategies, setStrategies] = useState<AnuuStrategy[]>([]);

  // Anuu Logic State
  const [thought, setThought] = useState("Sistema en espera. Inicia conexión.");
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'ALERT'>('IDLE');

  const fetchData = async () => {
    setStatus('THINKING');
    setThought("Conectando a la Red de Comercio del León Negro...");

    try {
      const allIds = Object.values(IDS).filter(x => typeof x === 'number');
      setThought(`Descargando precios para ${allIds.length} items esenciales...`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const priceData: any[] = await gw2.getPrices(allIds) as any[];
      const priceMap: Record<number, MarketItem> = {};

      priceData.forEach((p) => {
        priceMap[p.id] = p;
      });

      // ANALISIS
      setThought("Procesando vectores de beneficio...");

      const strats = analyzeMarket(priceMap);
      setStrategies(strats);

      const best = strats[0];
      if (best && best.score > 50) {
        setThought(`Análisis completado. Oportunidad óptima detectada: ${best.name} (${best.roi.toFixed(1)}% ROI). Recomiendo ejecución inmediata.`);
        setStatus('ALERT');
      } else if (best) {
        setThought(`Mercado estable pero poco rentable. Mejor opción: ${best.name}. Proceder con cautela.`);
        setStatus('IDLE');
      } else {
        setThought("Datos insuficientes para formular estrategia.");
        setStatus('IDLE');
      }

      if (apiKey) {
        await gw2.getWallet(apiKey);
      }

    } catch (err) {
      console.error(err);
      setThought("Error crítico en la conexión API. Reintentando...");
      setStatus('ALERT');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-4 md:p-8 font-sans selection:bg-fuchsia-500/30">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEAD - API Key Input */}
        <div className="flex justify-end gap-2 text-xs">
          {!apiKey ? (
            <div className="flex items-center gap-2 bg-red-900/20 text-red-400 px-3 py-1 rounded-full border border-red-900/50">
              <AlertTriangle size={12} />
              <span>API Key no configurada (Modo Solo Lectura)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-900/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/50">
              <ShieldCheck size={12} />
              <span>Conexión Segura Establecida</span>
            </div>
          )}
          <button
            onClick={() => {
              const k = prompt("Introduce tu GW2 API Key (permissions: wallet, unlock):", apiKey);
              if (k !== null) {
                setApiKey(k);
                localStorage.setItem('gw2_api_key', k);
              }
            }}
            className="text-zinc-500 hover:text-zinc-300"
          >
            <Settings size={14} />
          </button>
        </div>

        {/* ANUU MEDIATOR ZONE */}
        <AnuuMediator thought={thought} status={status} />

        {/* ACTION BAR */}
        <div className="flex gap-4">
          <button
            onClick={fetchData}
            className="flex-1 bg-zinc-100 hover:bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <RefreshCcw size={20} className={status === 'THINKING' ? 'animate-spin' : ''} />
            {strategies.length > 0 ? "RE-ESCANEAR MERCADO" : "INICIAR ESCANEO"}
          </button>
        </div>

        {/* STRATEGIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {strategies.map(s => (
              <StrategyCard key={s.targetId} strategy={s} />
            ))}
          </AnimatePresence>
        </div>

        {/* FOOTER - SYSTEM LOG */}
        <div className="border-t border-zinc-800 pt-6 mt-12 text-center text-xs text-zinc-600 font-mono">
          <p>SYSTEM: ANUU_VERSE // MODULE: GW2_NEXUS // V25.10</p>
          <p>POWERED BY: THOTH SCHOLAR ENGINE & KALI RISK ASSESSOR</p>
        </div>
      </div>
    </div>
  );
}

export default App;
