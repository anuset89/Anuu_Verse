
import { useState } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, RefreshCcw, AlertTriangle, ShieldCheck, Cpu, Settings, ArrowLeft, Copy, CheckCircle, Package, FlaskConical, ArrowRight, Layers, Database } from 'lucide-react';

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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
                relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 mb-8
                ${status === 'THINKING' ? 'bg-zinc-900 border-fuchsia-500/50 shadow-lg shadow-fuchsia-900/20' :
          status === 'ALERT' ? 'bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-900/20' :
            status === 'GUIDE' ? 'bg-zinc-900 border-indigo-500/50 shadow-lg shadow-indigo-900/20' :
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
              status === 'GUIDE' ? 'border-indigo-500 bg-indigo-500/10' :
                'border-zinc-700 bg-zinc-800'}
                `}>
          <Cpu size={32} className={status === 'THINKING' ? 'text-fuchsia-400' : status === 'ALERT' ? 'text-emerald-400' : status === 'GUIDE' ? 'text-indigo-400' : 'text-zinc-500'} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Anuu Nexus Core</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${status === 'THINKING' ? 'bg-fuchsia-900 text-fuchsia-300' : 'bg-zinc-800 text-zinc-500'}`}>
              {status === 'THINKING' ? 'PROCESSING' : status === 'GUIDE' ? 'GUIDANCE' : 'ONLINE'}
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

const StrategyCard = ({ strategy, onClick }: { strategy: AnuuStrategy, onClick: () => void }) => {
  const isGood = strategy.verdict.includes("RECOMMENDED") || strategy.verdict.includes("VIABLE");
  const bg = isGood ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/10 border-red-500/20';

  return (
    <motion.div
      layout
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border ${bg} hover:bg-zinc-900/80 transition-all group cursor-pointer relative overflow-hidden`}
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

        <div className="col-span-2 flex justify-between items-center bg-indigo-950/30 px-2 py-1.5 rounded mt-2 border border-indigo-500/20">
          <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-tight">INVIERTE 100g → SACAS:</span>
          <span className="font-mono font-bold text-emerald-300 text-sm">
            +{strategy.roi.toFixed(1)}g
          </span>
        </div>
      </div>

      {/* Hint for interaction */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-white shadow-xl">
          <Layers size={16} className="text-indigo-400" />
          ACTIVAR PROTOCOLO
        </div>
      </div>
    </motion.div>
  );
};

interface OperationProps {
  strategy: AnuuStrategy;
  materials: Record<number, number>;
  wallet: Record<number, number>; // CurrencyID -> Amount
  prices: Record<number, MarketItem>;
  onBack: () => void;
}

const OperationMode = ({ strategy, materials, wallet, prices, onBack }: OperationProps) => {
  const [step, setStep] = useState(1);
  const [batchSize, setBatchSize] = useState(10); // Default 10 crafts

  // Resources Logic
  const ownedT5 = materials[strategy.sourceId] || 0;
  const ownedDust = materials[IDS.DUST] || 0;
  const ownedShards = wallet[23] || 0; // 23 is Spirit Shards currency ID
  const availableGold = wallet[1] || 0; // 1 is Coin

  const neededT5 = 50 * batchSize;
  const neededDust = 5 * batchSize;
  const neededShards = 5 * batchSize;

  // T6 Catalyst (usually needs 1 T6 to start)
  const ownedT6 = materials[strategy.targetId] || 0;
  const neededT6 = 1 * batchSize;

  // Missing amounts
  const missingT5 = Math.max(0, neededT5 - ownedT5);
  const missingDust = Math.max(0, neededDust - ownedDust);
  const missingT6 = Math.max(0, neededT6 - ownedT6);
  const missingShards = Math.max(0, neededShards - ownedShards);

  // Calculate Max Affordable
  const priceT5 = prices[strategy.sourceId]?.buys?.unit_price || 0;
  const priceDust = prices[IDS.DUST]?.buys?.unit_price || 0;
  const priceT6 = prices[strategy.targetId]?.buys?.unit_price || 0;

  // Cost if buying everything from scratch (conservative estimate)
  // 50 T5 + 5 Dust + 1 T6
  const costPerCraft = (50 * priceT5) + (5 * priceDust) + (1 * priceT6);

  // Max attempts by Shards
  const maxByShards = Math.floor(ownedShards / 5);

  // Max attempts by Gold (ignoring materials owned, purely "how many could I buy")
  const maxByGold = costPerCraft > 0 ? Math.floor(availableGold / costPerCraft) : 9999;

  // "Safe Max" (min of both)
  const safeMax = Math.min(maxByShards, maxByGold);

  // Actual Gold Cost for CURRENT batch
  const costToBuyT5 = missingT5 * priceT5;
  const costToBuyDust = missingDust * priceDust;
  const costToBuyT6 = missingT6 * priceT6;
  const totalGoldCost = costToBuyT5 + costToBuyDust + costToBuyT6;

  const canAfford = availableGold >= totalGoldCost;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
          <ArrowLeft size={18} /> Volver al Escáner
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-white">{strategy.name}</h2>
          <p className="text-xs text-emerald-400 font-mono">PROTOCOLO ACTIVO // ROI PREVISTO: {strategy.roi.toFixed(1)}%</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center bg-zinc-900 p-2 rounded-xl border border-zinc-800">
        <button onClick={() => setStep(1)} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${step === 1 ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
          1. ADQUISICIÓN
        </button>
        <div className="w-px h-8 bg-zinc-800 mx-2"></div>
        <button onClick={() => setStep(2)} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${step === 2 ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
          2. TRANSMUTACIÓN
        </button>
        <div className="w-px h-8 bg-zinc-800 mx-2"></div>
        <button onClick={() => setStep(3)} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${step === 3 ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
          3. LIQUIDACIÓN
        </button>
      </div>

      {/* STEP 1: ACQUISITION */}
      {step === 1 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-8">

          {/* CONFIG & SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-1 lg:col-span-2 flex items-center gap-4 bg-zinc-950 p-6 rounded-xl border border-indigo-500/20">
              <Package className="text-indigo-400" size={32} />
              <div>
                <h3 className="text-lg font-bold text-white">Configurar Lote</h3>
                <p className="text-sm text-zinc-400">¿Cuántas transmutaciones vas a realizar?</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 0))}
                  className="bg-black border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono w-24 text-right focus:border-indigo-500 outline-none"
                />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setBatchSize(Math.max(1, safeMax))}
                    className="text-[10px] bg-zinc-800 hover:bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded border border-zinc-700 transition-colors"
                  >
                    MAX ({safeMax})
                  </button>
                </div>
              </div>
            </div>

            {/* FINANCIAL SUMMARY */}
            <div className={`col-span-1 flex flex-col justify-center p-6 rounded-xl border ${canAfford ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-red-950/10 border-red-500/20'}`}>
              <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Coste Compra Faltante</div>
              <div className="flex items-center justify-between">
                <GoldDisplay amount={totalGoldCost} size="lg" />
                {!canAfford && <AlertTriangle className="text-red-500" size={20} />}
              </div>
              <div className="mt-2 text-xs flex justify-between border-t border-white/5 pt-2">
                <span>Tu Liquidez Dispo:</span>
                <GoldDisplay amount={availableGold} size="sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Material */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 relative group">
              <h4 className="text-zinc-500 text-xs font-bold uppercase mb-2">Material Base (T5)</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-white">{strategy.sourceName}</span>
                <div className="text-right">
                  <span className="block text-2xl font-mono text-indigo-400">x{neededT5}</span>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-3 rounded-lg mb-4 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">En Almacén:</span>
                  <span className="text-zinc-300">{ownedT5}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Faltantes:</span>
                  <span className={`font-bold ${missingT5 > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{missingT5}</span>
                </div>
                {missingT5 > 0 && (
                  <div className="flex justify-between text-xs pt-1 border-t border-zinc-800 mt-1">
                    <span className="text-indigo-300 font-bold">Coste:</span>
                    <GoldDisplay amount={costToBuyT5} size="sm" />
                  </div>
                )}
              </div>

              {missingT5 > 0 && (
                <button
                  onClick={() => copyToClipboard(strategy.sourceName)}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 py-3 rounded-lg text-sm font-bold border border-zinc-700 transition-colors"
                >
                  <Copy size={16} /> Copiar Nombre
                </button>
              )}
            </div>

            {/* Dust */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 relative group">
              <h4 className="text-zinc-500 text-xs font-bold uppercase mb-2">Catalizador 1</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-white">Crystalline Dust</span>
                <div className="text-right">
                  <span className="block text-2xl font-mono text-cyan-400">x{neededDust}</span>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-3 rounded-lg mb-4 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">En Almacén:</span>
                  <span className="text-zinc-300">{ownedDust}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Faltantes:</span>
                  <span className={`font-bold ${missingDust > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{missingDust}</span>
                </div>
                {missingDust > 0 && (
                  <div className="flex justify-between text-xs pt-1 border-t border-zinc-800 mt-1">
                    <span className="text-indigo-300 font-bold">Coste:</span>
                    <GoldDisplay amount={costToBuyDust} size="sm" />
                  </div>
                )}
              </div>

              {missingDust > 0 && (
                <button
                  onClick={() => copyToClipboard("Crystalline Dust")}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 py-3 rounded-lg text-sm font-bold border border-zinc-700 transition-colors"
                >
                  <Copy size={16} /> Copiar Nombre
                </button>
              )}
            </div>

            {/* T6 (Catalyst) */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 relative group">
              <h4 className="text-zinc-500 text-xs font-bold uppercase mb-2">Catalizador 2 (T6)</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-white">{strategy.name}</span>
                <div className="text-right">
                  <span className="block text-2xl font-mono text-purple-400">x{neededT6}</span>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-3 rounded-lg mb-4 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">En Almacén:</span>
                  <span className="text-zinc-300">{ownedT6}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Faltantes:</span>
                  <span className={`font-bold ${missingT6 > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{missingT6}</span>
                </div>
                {missingT6 > 0 && (
                  <div className="flex justify-between text-xs pt-1 border-t border-zinc-800 mt-1">
                    <span className="text-indigo-300 font-bold">Coste:</span>
                    <GoldDisplay amount={costToBuyT6} size="sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Spirit Shards */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 relative group">
              <h4 className="text-zinc-500 text-xs font-bold uppercase mb-2">Catalizador Espiritual</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-white">Philosopher's Stone</span>
                <div className="text-right">
                  <span className="block text-2xl font-mono text-pink-400">x{neededShards}</span>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-3 rounded-lg mb-4 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Tus Shards:</span>
                  <span className="text-zinc-300">{ownedShards}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Shards Coste:</span>
                  <span className={`font-bold ${missingShards > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{missingShards}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-zinc-800 mt-1">
                  <span className="text-pink-300 font-bold">Valor/Shard:</span>
                  <span className="text-zinc-300">~60s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: FORGE */}
      {step === 2 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-8 flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-8">Introduce en la Forja Mística</h3>

          <div className="flex gap-4 items-center mb-12">
            {/* Slots */}
            <div className="w-24 h-24 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center p-2 text-center">
              <span className="text-indigo-400 font-bold text-xl">50</span>
              <span className="text-[10px] text-zinc-500 mt-1">{strategy.sourceName}</span>
            </div>
            <div className="text-zinc-600">+</div>
            <div className="w-24 h-24 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center p-2 text-center">
              <span className="text-purple-400 font-bold text-xl">1</span>
              <span className="text-[10px] text-zinc-500 mt-1">{strategy.name}</span>
            </div>
            <div className="text-zinc-600">+</div>
            <div className="w-24 h-24 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center p-2 text-center">
              <span className="text-cyan-400 font-bold text-xl">5</span>
              <span className="text-[10px] text-zinc-500 mt-1">Crystalline Dust</span>
            </div>
            <div className="text-zinc-600">+</div>
            <div className="w-24 h-24 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center p-2 text-center">
              <span className="text-pink-400 font-bold text-xl">5</span>
              <span className="text-[10px] text-zinc-500 mt-1">Philosopher's Stone</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-emerald-400 bg-emerald-950/20 px-6 py-3 rounded-full border border-emerald-500/20 animate-pulse">
            <FlaskConical />
            <span className="font-bold">¡Ejecuta la transmutación {batchSize} veces!</span>
          </div>

          <p className="text-zinc-500 text-sm max-w-md text-center">
            La Forja Mística consumirá los materiales y te devolverá una cantidad variable de <span className="text-white">{strategy.name}</span> (5-12 unidades).
          </p>
        </div>
      )}

      {/* STEP 3: LIQUIDATION */}
      {step === 3 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-8">
          <div className="text-center">
            <CheckCircle size={64} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-2xl font-bold text-white">Misión Cumplida</h3>
            <p className="text-zinc-400">Ahora vende el resultado en el Trading Post.</p>
          </div>

          <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-700 flex flex-col items-center">
            <span className="text-zinc-500 text-xs font-bold uppercase mb-2">Precio de Venta Recomendado</span>
            <div className="text-4xl font-bold text-white mb-2">
              <GoldDisplay amount={strategy.sellPrice} size="xl" />
            </div>
            <p className="text-xs text-zinc-500 mb-4">Vende todo tu stock de {strategy.name}.</p>
            <div className="text-sm font-mono text-emerald-400 border-t border-white/5 pt-2">
              Beneficio Neto Estimado: <span className="font-bold">+{Math.floor((strategy.profitPerCraft * batchSize) / 10000)}g {Math.floor(((strategy.profitPerCraft * batchSize) % 10000) / 100)}s</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={20} />
            FINALIZAR OPERACIÓN Y RE-ESCANEAR
          </button>
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex justify-end pt-4 mt-6 border-t border-zinc-800">
        {step < 3 && (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
          >
            Siguiente Paso <ArrowRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// --- APP ---

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gw2_api_key') || '');
  const [strategies, setStrategies] = useState<AnuuStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<AnuuStrategy | null>(null);
  const [materials, setMaterials] = useState<Record<number, number>>({});
  const [wallet, setWallet] = useState<Record<number, number>>({});
  const [prices, setPrices] = useState<Record<number, MarketItem>>({});
  const [permissions, setPermissions] = useState<string[]>([]);

  // Anuu Logic State
  const [thought, setThought] = useState("Sistema en espera. Inicia conexión.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE'>('IDLE');

  const fetchData = async () => {
    setStatus('THINKING');
    setThought("Sincronizando con la Red de Comercio y Bóveda del León Negro...");
    setActiveStrategy(null);

    try {
      const allIds = Object.values(IDS).filter(x => typeof x === 'number');
      setThought(`Descargando precios y analizando inventario...`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const priceData: any[] = await gw2.getPrices(allIds) as any[];
      const priceMap: Record<number, MarketItem> = {};

      priceData.forEach((p) => {
        priceMap[p.id] = p;
      });
      setPrices(priceMap);

      // Account Data (if API Key)
      if (apiKey) {
        // Check Token Permissions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const info: any = await gw2.getTokenInfo(apiKey);
        if (info && info.permissions) {
          setPermissions(info.permissions);

          if (info.permissions.includes('inventories')) {
            const mats = await gw2.getMaterials(apiKey);
            const matMap: Record<number, number> = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mats.forEach((m: any) => {
              matMap[m.id] = m.count;
            });
            setMaterials(matMap);
          }

          if (info.permissions.includes('wallet')) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const walletData: any[] = await gw2.getWallet(apiKey) as any[];
            const walletMap: Record<number, number> = {};
            walletData.forEach(w => {
              walletMap[w.id] = w.value;
            });
            setWallet(walletMap);
          }
        } else {
          setThought("Error: API Key no válida o expirada.");
          setStatus('ALERT');
        }
      }

      setThought("Calculando rutas optimizadas por recursos...");
      const strats = analyzeMarket(priceMap);
      setStrategies(strats);

      const best = strats[0];
      if (apiKey) {
        // If we reach here, we've successfully processed the API Key permissions and data.
        setThought(`Sincronización completa. Inventario mapeado. Oportunidad óptima: ${best.name} (${best.roi.toFixed(1)}% ROI).`);
      } else {
        setThought(`Análisis completado. Oportunidad óptima detectada: ${best.name}. Conecta API Key para análisis de inventario.`);
      }

      if (best && best.score > 50) setStatus('ALERT');
      else setStatus('IDLE');

    } catch (err) {
      console.error(err);
      setThought("Error crítico en la conexión API. Reintentando...");
      setStatus('ALERT');
    }
  };

  const handleStrategySelect = (strategy: AnuuStrategy) => {
    setActiveStrategy(strategy);
    setStatus('GUIDE');
    setThought(`Protocolo ${strategy.name} iniciado. Verificando fondos y existencias...`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-4 md:p-8 font-sans selection:bg-fuchsia-500/30">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEAD - API Key Input */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* GLOBAL WALLET HEADER */}
          {apiKey && wallet[1] !== undefined ? (
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 px-2">
                <span className="text-xs text-zinc-500 font-bold uppercase">Liquidez:</span>
                <GoldDisplay amount={wallet[1]} size="md" />
              </div>
              <div className="w-px h-6 bg-zinc-800"></div>
              <div className="flex items-center gap-2 px-2">
                <Database size={14} className="text-pink-400" />
                <span className="text-zinc-300 font-mono font-bold">{wallet[23]}</span>
                <span className="text-xs text-zinc-500">Shards</span>
              </div>
            </div>
          ) : apiKey ? (
            <div className="text-xs text-zinc-500 bg-zinc-900/50 p-2 rounded border border-zinc-800">Esperando datos de Billetera...</div>
          ) : <div></div>}

          <div className="flex justify-end gap-2 text-xs ml-auto items-center">
            {!apiKey ? (
              <div className="flex items-center gap-2 bg-red-900/20 text-red-400 px-3 py-1 rounded-full border border-red-900/50">
                <AlertTriangle size={12} />
                <span>API Key no configurada</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-900/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/50 group relative cursor-help">
                <ShieldCheck size={12} />
                <span>Conexión Segura</span>
                {/* Permissions Tooltip */}
                <div className="absolute top-full right-0 mt-2 bg-black border border-zinc-700 p-2 rounded shadow-xl hidden group-hover:block w-48 z-50">
                  <p className="font-bold text-zinc-300 mb-1">Permisos:</p>
                  <div className="flex flex-col gap-1">
                    <span className={permissions.includes('account') ? 'text-emerald-400' : 'text-red-400'}>• Account</span>
                    <span className={permissions.includes('inventories') ? 'text-emerald-400' : 'text-red-400'}>• Inventories</span>
                    <span className={permissions.includes('wallet') ? 'text-emerald-400' : 'text-red-400'}>• Wallet</span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                const k = prompt("Introduce tu GW2 API Key (permissions: wallet, unlock, inventories):", apiKey);
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
        </div>

        {/* ANUU MEDIATOR ZONE */}
        <AnuuMediator thought={thought} status={status} />

        {/* MAIN CONTENT SWAP */}
        <AnimatePresence mode="wait">
          {!activeStrategy ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* ACTION BAR */}
              <div className="flex gap-4 mb-8">
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
                {strategies.map(s => (
                  <StrategyCard
                    key={s.targetId}
                    strategy={s}
                    onClick={() => handleStrategySelect(s)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="operation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <OperationMode
                strategy={activeStrategy}
                materials={materials}
                wallet={wallet}
                prices={prices}
                onBack={() => {
                  setActiveStrategy(null);
                  setStatus('IDLE');
                  setThought("Protocolo suspendido. Esperando instrucciones.");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER - SYSTEM LOG */}
        <div className="border-t border-zinc-800 pt-6 mt-12 text-center text-xs text-zinc-600 font-mono">
          <p>SYSTEM: ANUU_VERSE // MODULE: GW2_NEXUS // V25.11.0</p>
          <p>POWERED BY: THOTH SCHOLAR ENGINE & KALI RISK ASSESSOR & ANUU MEDIATOR</p>
        </div>
      </div>
    </div>
  );
}

export default App;
