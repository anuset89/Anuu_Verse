
import { useState, useEffect, useCallback } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCcw, Settings, Star, Database } from 'lucide-react';

// Divided Components
import { DiversifiedOperation } from './components/DiversifiedOperation';
import { OperationMode } from './components/OperationMode';
import { SettingsModal } from './components/SettingsModal';
import { AnuuMediator } from './components/AnuuMediator';
import { OracleCommandZone } from './components/OracleCommandZone';
import { DiversificationHub } from './components/DiversificationHub';
import { StrategicLab } from './components/StrategicLab';
import { StrategyGrimoire } from './components/StrategyGrimoire';
import { GoldDisplay } from './components/common/GoldDisplay';

// --- APP COMPONENT ---
function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gw2_api_key') || '');
  const [strategies, setStrategies] = useState<AnuuStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<AnuuStrategy | null>(null);
  const [multiStrategy, setMultiStrategy] = useState<AnuuStrategy[] | null>(null);
  const [materials, setMaterials] = useState<Record<number, { total: number, storage: number, bank: number, character: number }>>({});
  const [wallet, setWallet] = useState<Record<number, number>>({});
  const [prices, setPrices] = useState<Record<number, MarketItem>>({});
  const [lang, setLang] = useState<'es' | 'en'>((localStorage.getItem('gw2_lang') as 'es' | 'en') || 'es');
  const [icons, setIcons] = useState<Record<number, string>>({});
  const isEng = lang === 'en';
  const [thought, setThought] = useState(isEng ? "Projecting trade routes..." : "Proyectando rutas comerciales...");
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE'>('IDLE');
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = useCallback(async () => {
    setStatus('THINKING');
    setThought(isEng ? 'Connecting to Nexus...' : 'Conectando con Nexus...');

    try {
      // MAJOR OPTIMIZATION: Parallelize ALL fetches
      // 1. Market Data (Prices + Item Details) can run alongside Account Data
      const allIds = Object.values(IDS).filter((x): x is number => typeof x === 'number');

      // Prepare promises
      const pricesPromise = gw2.getPrices(allIds);
      const itemsPromise = gw2.getItems(allIds);

      // Account Logic
      // Default empty if no API key
      let accountPromise: Promise<any> = Promise.resolve([[], [], [], []]); // [mats, bank, chars, shared]
      let walletPromise: Promise<any> = Promise.resolve([]);

      let hasWalletPerm = false;
      let hasInventoriesPerm = false;

      if (apiKey && apiKey.length > 10) {
        // Token Info first (Fast/Cached)
        const tokenInfo = await gw2.getTokenInfo(apiKey);
        hasWalletPerm = tokenInfo?.permissions?.includes('wallet');
        hasInventoriesPerm = tokenInfo?.permissions?.includes('inventories');

        if (!hasWalletPerm) {
          setThought(isEng ? 'API Key missing "wallet" permission.' : 'La API Key no tiene permiso "wallet".');
        } else {
          walletPromise = gw2.getWallet(apiKey);
        }

        if (hasInventoriesPerm) {
          accountPromise = Promise.all([
            gw2.getMaterials(apiKey),
            gw2.getBank(apiKey),
            gw2.getCharacters(apiKey),
            gw2.getSharedInventory(apiKey)
          ]);
        }
      } else {
        setThought(isEng ? 'No API Key. Add one in Settings for personalized recommendations.' : 'Sin API Key. Añade una en Configuración para recomendaciones personalizadas.');
      }

      // EXECUTE PARALLEL WAITING
      const [priceData, itemDetails, accountData, walletData] = await Promise.all([
        pricesPromise,
        itemsPromise,
        accountPromise,
        walletPromise
      ]);

      // --- PROCESS DATA ---

      // 1. Prices
      const priceMap: Record<number, MarketItem> = {};
      if (Array.isArray(priceData)) {
        priceData.forEach((p: MarketItem) => { priceMap[p.id] = p; });
        setPrices(priceMap);
      }

      // 2. Icons
      const iconMap: Record<number, string> = {};
      if (Array.isArray(itemDetails)) {
        itemDetails.forEach((item: { id: number, icon: string }) => {
          iconMap[item.id] = item.icon;
        });
        setIcons(iconMap);
      }

      // 3. Wallet
      if (Array.isArray(walletData)) {
        const wMap: Record<number, number> = {};
        walletData.forEach((c: { id: number, value: number }) => { wMap[c.id] = c.value; });
        setWallet(wMap);
      }

      // 4. Materials (The Big One)
      const [mats, bank, chars, shared] = accountData;
      const matMap: Record<number, { total: number, storage: number, bank: number, character: number }> = {};

      // Helper to init
      const initMat = (id: number) => {
        if (!matMap[id]) matMap[id] = { total: 0, storage: 0, bank: 0, character: 0 };
      };

      if (Array.isArray(mats)) {
        mats.forEach((m: { id: number, count: number }) => {
          initMat(m.id);
          matMap[m.id].storage = m.count;
          matMap[m.id].total += m.count;
        });
      }
      if (Array.isArray(bank)) {
        bank.forEach((slot: { id: number, count: number } | null) => {
          if (slot) {
            initMat(slot.id);
            matMap[slot.id].bank += slot.count;
            matMap[slot.id].total += slot.count;
          }
        });
      }
      if (Array.isArray(chars)) {
        chars.forEach((c: { bags?: { inventory: ({ id: number, count: number } | null)[] }[] }) => {
          if (c.bags) {
            c.bags.forEach((bag) => {
              if (bag && bag.inventory) {
                bag.inventory.forEach((slot) => {
                  if (slot) {
                    initMat(slot.id);
                    matMap[slot.id].character += slot.count;
                    matMap[slot.id].total += slot.count;
                  }
                });
              }
            });
          }
        });
      }
      if (Array.isArray(shared)) {
        shared.forEach((slot: { id: number, count: number } | null) => {
          if (slot) {
            initMat(slot.id);
            matMap[slot.id].character += slot.count; // Shared slots count as "Bag/Character" for simplicity
            matMap[slot.id].total += slot.count;
          }
        });
      }

      setMaterials(matMap);
      const matMapLocal = matMap; // Vital for downstream logic!

      // --- LOGIC ENGINE ---

      // 5. Analyze market strategies
      const strats = analyzeMarket(priceMap);

      // 6. Prioritize based on owned materials + ROI
      const prioritizedStrats = [...strats].sort((a, b) => {
        const aHoldings = matMapLocal[a.sourceId]?.total || 0;
        const bHoldings = matMapLocal[b.sourceId]?.total || 0;
        const hasWine = matMapLocal[19632]?.total > 0;

        const aScore = a.roi + (aHoldings > 0 ? 1000 : 0) + (a.type === 'LODE' && hasWine ? 100 : 0);
        const bScore = b.roi + (bHoldings > 0 ? 1000 : 0) + (b.type === 'LODE' && hasWine ? 100 : 0);

        return bScore - aScore;
      });

      setStrategies(prioritizedStrats);

      // 7. Oracle Intelligence
      if (apiKey) {
        const topProfitable = prioritizedStrats.filter(s => s.roi > 0);
        const ownedItems = prioritizedStrats.filter(s => matMapLocal[s.sourceId]?.total > 0 && s.roi > 0);

        // Line 1: Strategic Analysis
        const analysis = isEng
          ? `Nexus detected ${topProfitable.length} high-yield trajectories. Total market ROI averaging ${(topProfitable.reduce((acc, s) => acc + s.roi, 0) / Math.max(1, topProfitable.length)).toFixed(1)}%.`
          : `Nexus ha detectado ${topProfitable.length} trayectorias de alto rendimiento. ROI promedio del mercado: ${(topProfitable.reduce((acc, s) => acc + s.roi, 0) / Math.max(1, topProfitable.length)).toFixed(1)}%.`;

        // Line 2: Priority (Inventory-Aware)
        let priority = "";
        if (ownedItems.length > 0) {
          const best = ownedItems[0];
          const qty = matMapLocal[best.sourceId].total;
          priority = isEng
            ? `CRITICAL: You have ${qty} units of ${best.sourceName}. Process these into ${best.name} immediately for zero-cost entry.`
            : `CRÍTICO: Tienes ${qty} unidades de ${best.sourceName}. Procésalas en ${best.name} de inmediato para una entrada sin coste.`;
        } else {
          priority = isEng
            ? "RESOURCE DEFICIT: Restock required. Focus on T5 Fine promotion for high volume stability."
            : "DÉFICIT DE RECURSOS: Reabastecimiento necesario. Enfócate en promoción T6 para estabilidad de volumen.";
        }

        // Line 3: Market Forecast
        const forecast = isEng
          ? "Market volatility is stable. Recommend high-volume liquidation within the next 4h cycle."
          : "La volatilidad del mercado es estable. Recomiendo liquidación de alto volumen en las próximas 4h.";

        // Line 4: Alert / Tip
        const hasWine = matMapLocal[19632]?.total > 0;
        const tip = !hasWine && prioritizedStrats.some(s => s.type === 'LODE')
          ? (isEng ? "SYSTEM ALERT: Elonian Wine stock depleted. Visit Miyani." : "ALERTA: Stock de Vino de Elona agotado. Visita a Miyani.")
          : (isEng ? "Nexus Link synchronized with Bank and Materials." : "Nexus Link sincronizado con Banco y Almacén.");

        setThought(`${analysis} | ${priority} | ${forecast} | ${tip}`);
      }
      setStatus('IDLE');
    } catch (err) {
      console.error('[Nexus] Critical fetch error:', err);
      setStatus('ALERT');
      setThought(isEng ? "Nexus Link failure. Check console for details." : "Falla en la Nexus Link. Revisa la consola.");
    }
  }, [apiKey, isEng]);

  useEffect(() => {
    fetchData().catch(e => console.error(e));
  }, [fetchData]);

  const handleMultiSelect = (strats: AnuuStrategy[], title: string) => {
    setMultiStrategy(strats);
    setStatus('GUIDE');
    setThought(isEng ? `Strategic Profile: ${title}.` : `Perfil estratégico: ${title}.`);
  };

  const saveApiKey = (key: string) => {
    const cleaned = key.trim();
    localStorage.setItem('gw2_api_key', cleaned);
    setApiKey(cleaned);
    setShowSettings(false);
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen bg-[#050508] text-zinc-400 p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative"
      style={{
        background: `radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                     radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                     linear-gradient(to bottom, #09090b, #020617)`,
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/20"><Star className="text-white" size={24} /></div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase font-display italic text-glow">GW2 NEXUS</h1>
              <p className="text-[9px] text-indigo-400 font-black tracking-[0.4em] uppercase">{isEng ? 'Operations Intelligence v4.3.1' : 'Inteligencia de Operaciones v4.3.1'}</p>
            </div>
          </div>

          {apiKey && (
            <div className="flex items-center gap-6 matte-card p-3 px-5 cursor-pointer hover:bg-white/5 transition-all border-white/5" onClick={fetchData}>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest font-display">{isEng ? 'Wallet' : 'Billetera'}</span>
                <GoldDisplay amount={wallet[1] || 0} size="md" />
              </div>
              <div className="w-px h-8 bg-white/5"></div>
              <div className="flex items-center gap-3 text-indigo-400 font-black" title="Spirit Shards">
                <Database size={18} /><span className="font-mono text-base">{wallet[23] || 0}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex gap-1 matte-card p-1 border-white/5">
              <button
                onClick={() => { setLang('es'); localStorage.setItem('gw2_lang', 'es'); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-display uppercase transition-all ${lang === 'es' ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:text-white'}`}
              >
                ESP
              </button>
              <button
                onClick={() => { setLang('en'); localStorage.setItem('gw2_lang', 'en'); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-display uppercase transition-all ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:text-white'}`}
              >
                ENG
              </button>
            </div>
            <button onClick={fetchData} className="matte-card p-3.5 hover:text-white text-zinc-600 transition-all border-white/5"><RefreshCcw size={20} className={status === 'THINKING' ? 'animate-spin' : ''} /></button>
            <button onClick={() => setShowSettings(true)} className={`matte-card p-3.5 hover:text-white transition-all border-white/5 relative flex items-center gap-2 ${!apiKey ? 'text-amber-400 border-amber-500/30' : 'text-zinc-600'}`}>
              {!apiKey && <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">{isEng ? 'Add API Key' : 'Añade tu API'}</span>}
              <Settings size={20} />
              {!apiKey && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse border-2 border-black"></span>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showSettings && <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} currentKey={apiKey} onSave={saveApiKey} isEng={isEng} />}
        </AnimatePresence>

        {!multiStrategy && <AnuuMediator thought={thought} status={status} onReload={fetchData} isEng={isEng} />}

        <AnimatePresence mode="wait">
          {!activeStrategy && !multiStrategy ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <OracleCommandZone strategy={strategies[0]} onExecute={() => setMultiStrategy(strategies.filter(s => s.roi > 0).slice(0, 6))} isEng={isEng} materials={materials} />
              <DiversificationHub strategies={strategies} onSelect={handleMultiSelect} isEng={isEng} />
              <StrategicLab strategies={strategies} isEng={isEng} onSelect={(s) => setActiveStrategy(s)} icons={icons} />
              <StrategyGrimoire strategies={strategies} onSelectSingle={(strat) => setActiveStrategy(strat)} isEng={isEng} materials={materials} icons={icons} />
            </motion.div>
          ) : multiStrategy ? (
            <DiversifiedOperation
              strategies={multiStrategy}
              materials={materials}
              prices={prices}
              wallet={wallet}
              icons={icons}
              isEng={isEng}
              onClose={() => { setMultiStrategy(null); setStatus('GUIDE'); }}
              onRefresh={fetchData}
            />
          ) : (
            <motion.div key="op" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <OperationMode strategy={activeStrategy!} materials={materials} wallet={wallet} prices={prices} isEng={isEng} icons={icons} onBack={() => { setActiveStrategy(null); }} />
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
    </div >
  );
}

export default App;
