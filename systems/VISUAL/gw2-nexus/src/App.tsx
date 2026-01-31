
import { useState, useEffect, useCallback } from 'react';
import { analyzeMarket, IDS } from './engine/calculator';
import type { AnuuStrategy, MarketItem } from './engine/calculator';
import { gw2 } from './api/gw2';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCcw, Settings, Star, Database } from 'lucide-react';

// Divided Components
import { DiversifiedOperation } from './components/DiversifiedOperation';
import { OperationMode } from './components/OperationMode';
import { AnuuMediator } from './components/AnuuMediator';
import { DiversificationHub } from './components/DiversificationHub';
import { StrategicLab } from './components/StrategicLab';
import { StrategyGrimoire } from './components/StrategyGrimoire';
import { SettingsModal } from './components/SettingsModal';
import { GoldDisplay } from './components/common/GoldDisplay';

// --- APP COMPONENT ---
function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gw2_api_key') || '');
  const [strategies, setStrategies] = useState<AnuuStrategy[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<AnuuStrategy | null>(null);
  const [multiStrategy, setMultiStrategy] = useState<AnuuStrategy[] | null>(null);
  const [materials, setMaterials] = useState<Record<number, { total: number, storage: number, bank: number }>>({});
  const [wallet, setWallet] = useState<Record<number, number>>({});
  const [prices, setPrices] = useState<Record<number, MarketItem>>({});
  const [lang, setLang] = useState<'es' | 'en'>((localStorage.getItem('gw2_lang') as 'es' | 'en') || 'es');
  const isEng = lang === 'en';
  const [thought, setThought] = useState(isEng ? "Projecting trade routes..." : "Proyectando rutas comerciales...");
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'ALERT' | 'GUIDE'>('IDLE');
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = useCallback(async () => {
    setStatus('THINKING');
    setThought(isEng ? 'Connecting to Nexus...' : 'Conectando con Nexus...');

    try {
      // 1. Fetch Market Prices
      const allIds = Object.values(IDS).filter((x): x is number => typeof x === 'number');
      const priceData = await gw2.getPrices(allIds);
      const priceMap: Record<number, MarketItem> = {};
      priceData.forEach((p: MarketItem) => { priceMap[p.id] = p; });
      setPrices(priceMap);

      let matMapLocal: Record<number, { total: number, storage: number, bank: number }> = {};

      // 2. Fetch account data if API Key exists
      if (apiKey && apiKey.length > 10) {
        const tokenInfo = await gw2.getTokenInfo(apiKey);
        const hasWalletPerm = tokenInfo?.permissions?.includes('wallet');
        const hasInventoriesPerm = tokenInfo?.permissions?.includes('inventories');

        if (!hasWalletPerm) {
          setThought(isEng ? 'API Key missing "wallet" permission.' : 'La API Key no tiene permiso "wallet".');
        }

        if (hasInventoriesPerm) {
          try {
            const [mats, bank] = await Promise.all([
              gw2.getMaterials(apiKey),
              gw2.getBank(apiKey)
            ]);

            const matMap: Record<number, { total: number, storage: number, bank: number }> = {};

            if (Array.isArray(mats)) {
              mats.forEach((m: { id: number, count: number }) => {
                if (!matMap[m.id]) matMap[m.id] = { total: 0, storage: 0, bank: 0 };
                matMap[m.id].storage = m.count;
                matMap[m.id].total += m.count;
              });
            }

            if (Array.isArray(bank)) {
              bank.forEach((slot: { id: number, count: number } | null) => {
                if (slot) {
                  if (!matMap[slot.id]) matMap[slot.id] = { total: 0, storage: 0, bank: 0 };
                  matMap[slot.id].bank += slot.count;
                  matMap[slot.id].total += slot.count;
                }
              });
            }
            setMaterials(matMap);
            matMapLocal = matMap;
          } catch (e) {
            console.error('[Nexus] Inventories fetch failed:', e);
          }
        }

        if (hasWalletPerm) {
          try {
            const wData = await gw2.getWallet(apiKey);
            const walletMap: Record<number, number> = {};
            if (Array.isArray(wData)) {
              wData.forEach((w: { id: number, value: number }) => { walletMap[w.id] = w.value; });
              setWallet(walletMap);
            }
          } catch (e) {
            console.error('[Nexus] Wallet fetch failed:', e);
          }
        }
      } else {
        setThought(isEng ? 'No API Key. Add one in Settings for personalized recommendations.' : 'Sin API Key. Añade una en Configuración para recomendaciones personalizadas.');
      }

      // 3. Analyze market strategies
      const strats = analyzeMarket(priceMap);

      // Calculate "Owned" status and "Score" for sorting
      // Logic: ROI + Bonus for having materials (eliminates upfront gold risk)
      // Use currentMaterials which is guaranteed to be initialized
      const prioritizedStrats = [...strats].sort((a, b) => {
        const aHoldings = matMapLocal[a.sourceId]?.total || 0;
        const bHoldings = matMapLocal[b.sourceId]?.total || 0;

        // Catalysts (Wine, Shards)
        const hasWine = matMapLocal[19632]?.total > 0;

        // Boost Score
        // If we have materials, we effectively increase the "score" by 1000 to move it to the top, 
        // while maintaining ROI order among owned items.
        const aScore = a.roi + (aHoldings > 0 ? 1000 : 0) + (a.type === 'LODE' && hasWine ? 100 : 0);
        const bScore = b.roi + (bHoldings > 0 ? 1000 : 0) + (b.type === 'LODE' && hasWine ? 100 : 0);

        return bScore - aScore;
      });

      setStrategies(prioritizedStrats);

      if (apiKey) {
        setThought(strats[0] && strats[0].roi > 0
          ? (isEng ? `Detected ${strats.filter(s => s.roi > 0).length} profitable routes.` : `Se han detectado ${strats.filter(s => s.roi > 0).length} rutas rentables.`)
          : (isEng ? "Stable market, scanning for anomalies." : "Mercado estable, escaneando anomalías."));
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
              <p className="text-[9px] text-indigo-400 font-black tracking-[0.4em] uppercase">{isEng ? 'Operations Intelligence v4.3' : 'Inteligencia de Operaciones v4.3'}</p>
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

        {!multiStrategy && <AnuuMediator thought={thought} status={status} onReload={fetchData} />}

        <AnimatePresence mode="wait">
          {!activeStrategy && !multiStrategy ? (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <DiversificationHub strategies={strategies} onSelect={handleMultiSelect} isEng={isEng} walletGold={wallet[1] || 0} />
              <StrategicLab strategies={strategies} isEng={isEng} onSelect={(s) => setActiveStrategy(s)} />
              <StrategyGrimoire strategies={strategies} onSelectSingle={(strat) => setActiveStrategy(strat)} isEng={isEng} materials={materials} />
            </motion.div>
          ) : multiStrategy ? (
            <DiversifiedOperation
              strategies={multiStrategy}
              wallet={wallet}
              prices={prices}
              materials={materials}
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
    </div >
  );
}

export default App;
