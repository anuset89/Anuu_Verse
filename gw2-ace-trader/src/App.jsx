import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    TrendingUp, Zap, Database, Cpu, Activity, RefreshCcw, AlertTriangle, ArrowUpRight,
    Clock, Key, Wallet, Lock, BookOpen, X, Target, ChevronDown, ChevronUp, FlaskConical,
    Puzzle, PieChart, TrendingDown, Trash2, Calculator, Globe, ExternalLink
} from 'lucide-react';

// --- i18n ---
const LANG = {
    es: {
        title: 'MOTOR ACE', subtitle: 'Terminal de Trading GW2', manual: 'MANUAL', link: 'Vincular', linked: 'Vinculado',
        wallet: 'Billetera', gold: 'Oro', shards: 'Shards', liquidator: 'Liquidar Activos', liquidatorSub: 'Vende estos items muertos:',
        smartRoute: 'Ruta Smart', diversify: 'DIVERSIFICA', opportunities: 'Oportunidades', flips: 'FLIPS', recipe: 'Receta',
        iterations: 'Iteraciones', limit: 'Límite', totalCost: 'Costo', profit: 'Beneficio', protocol: 'Protocolo', tip: 'Consejo',
        tipText: 'Usa el Liquidator para convertir activos muertos en capital.', log: 'Log', loading: 'CARGA', ok: 'OK',
        finance: 'Arquitectura Financiera', realtime: 'Análisis Tiempo Real', total: 'Total', max: 'max', wikiLink: 'Ver en Wiki',
        aggressive: 'Agresivo', moderate: 'Moderado', conservative: 'Conservador', why: '¿Por qué?',
        whyPromo: 'La promoción T5→T6 tiene ~30% ROI. Usas Spirit Shards (gratis de nivelación) para generar materiales más caros.',
        whyDiversify: 'No pongas todo en un solo item. Si el precio cae, pierdes todo. Divide para minimizar riesgo.',
        sortedBy: 'Ordenado por: Beneficio Total'
    },
    en: {
        title: 'ACE ENGINE', subtitle: 'GW2 Trading Terminal', manual: 'MANUAL', link: 'Link', linked: 'Linked',
        wallet: 'Wallet', gold: 'Gold', shards: 'Shards', liquidator: 'Liquidate Assets', liquidatorSub: 'Sell these dead assets:',
        smartRoute: 'Smart Route', diversify: 'DIVERSIFY', opportunities: 'Opportunities', flips: 'FLIPS', recipe: 'Recipe',
        iterations: 'Iterations', limit: 'Limit', totalCost: 'Cost', profit: 'Profit', protocol: 'Protocol', tip: 'Tip',
        tipText: 'Use the Liquidator to convert dead assets into capital.', log: 'Log', loading: 'LOAD', ok: 'OK',
        finance: 'Financial Architecture', realtime: 'Real-Time Analysis', total: 'Total', max: 'max', wikiLink: 'View on Wiki',
        aggressive: 'Aggressive', moderate: 'Moderate', conservative: 'Conservative', why: 'Why?',
        whyPromo: 'T5→T6 promotion has ~30% ROI. You use Spirit Shards (free from leveling) to create more valuable materials.',
        whyDiversify: 'Don\'t put everything in one item. If the price drops, you lose it all. Diversify to minimize risk.',
        sortedBy: 'Sorted by: Total Profit'
    }
};

const MANUAL_CONTENT = {
    es: {
        finance: [
            { title: "Liquidez 20%", content: "Mantén al menos 20% de tu patrimonio en oro líquido." },
            { title: "Amortización", content: "Calcula el breakeven antes de comprar lujos." },
            { title: "Diversificación", content: "Usa Smart Route para dividir capital entre Top 3." }
        ],
        realtime: [
            { title: "Spread/Velocidad", content: "No solo margen, mira la velocidad de venta." },
            { title: "Undercut 1c", content: "Lista siempre a 1 cobre menos." },
            { title: "Tendencias", content: "Flechas 🔺/🔻 indican dirección del precio." }
        ]
    },
    en: {
        finance: [
            { title: "20% Liquidity", content: "Keep at least 20% of your wealth in liquid gold." },
            { title: "Amortization", content: "Calculate breakeven before buying luxuries." },
            { title: "Diversification", content: "Use Smart Route to split capital across Top 3." }
        ],
        realtime: [
            { title: "Spread/Velocity", content: "Not just margin, check sale velocity." },
            { title: "Undercut 1c", content: "Always list at 1 copper less." },
            { title: "Trends", content: "Arrows 🔺/🔻 indicate price direction." }
        ]
    }
};

// --- ITEM DATA with Wiki slugs ---
const ITEM_DATA = {
    // T6 Materials
    24295: { name: { es: 'Colmillo Vicioso', en: 'Vicious Fang' }, wiki: 'Vicious_Fang', t5: 24294 },
    24357: { name: { es: 'Escama Blindada', en: 'Armored Scale' }, wiki: 'Armored_Scale', t5: 24356 },
    24289: { name: { es: 'Garra Viciosa', en: 'Vicious Claw' }, wiki: 'Vicious_Claw', t5: 24288 },
    24351: { name: { es: 'Hueso Antiguo', en: 'Ancient Bone' }, wiki: 'Ancient_Bone', t5: 24350 },
    24283: { name: { es: 'Polvo Cristalino', en: 'Crystalline Dust' }, wiki: 'Pile_of_Crystalline_Dust', t5: 24282 },
    24299: { name: { es: 'Tótem Elaborado', en: 'Elaborate Totem' }, wiki: 'Elaborate_Totem', t5: 24298 },
    24341: { name: { es: 'Veneno Poderoso', en: 'Powerful Venom Sac' }, wiki: 'Powerful_Venom_Sac', t5: 24340 },
    24358: { name: { es: 'Sangre Poderosa', en: 'Powerful Blood' }, wiki: 'Vial_of_Powerful_Blood', t5: 24357 },
    // T5 & Essentials
    24294: { name: { es: 'Colmillo Grande', en: 'Large Fang' }, wiki: 'Large_Fang' },
    24356: { name: { es: 'Escama Grande', en: 'Large Scale' }, wiki: 'Large_Scale' },
    24288: { name: { es: 'Garra Grande', en: 'Large Claw' }, wiki: 'Large_Claw' },
    24350: { name: { es: 'Hueso Grande', en: 'Large Bone' }, wiki: 'Large_Bone' },
    24282: { name: { es: 'Polvo Luminoso', en: 'Luminous Dust' }, wiki: 'Pile_of_Luminous_Dust' },
    24298: { name: { es: 'Tótem Intrincado', en: 'Intricate Totem' }, wiki: 'Intricate_Totem' },
    24340: { name: { es: 'Veneno Potente', en: 'Potent Venom Sac' }, wiki: 'Potent_Venom_Sac' },
    24277: { name: { es: 'Polvo Cristalino', en: 'Crystalline Dust' }, wiki: 'Pile_of_Crystalline_Dust' },
    19721: { name: { es: 'Ectoplasma', en: 'Glob of Ectoplasm' }, wiki: 'Glob_of_Ectoplasm' },
    19976: { name: { es: 'Moneda Mística', en: 'Mystic Coin' }, wiki: 'Mystic_Coin' }
};

const ESSENTIALS = { ECTO: 19721, MYSTIC_COIN: 19976, CRYSTALLINE_DUST: 24277, SPIRIT_SHARD: 23 };
const T6_IDS = [24295, 24357, 24289, 24351, 24283, 24299, 24341, 24358];
const ALL_IDS = [...Object.keys(ITEM_DATA).map(Number), ...T6_IDS.map(id => ITEM_DATA[id]?.t5).filter(Boolean)];
const ALL_LISTING_IDS = [...T6_IDS, ESSENTIALS.ECTO, ESSENTIALS.MYSTIC_COIN];
const TREND_KEY = 'ace_trend_v1';

const getWikiUrl = (slug) => `https://wiki.guildwars2.com/wiki/${slug}`;
const getItemName = (id, lang) => ITEM_DATA[id]?.name?.[lang] || ITEM_DATA[id]?.name?.en || `Item ${id}`;

// --- MODAL ---
const ManualModal = ({ onClose, lang }) => {
    const t = LANG[lang];
    const content = MANUAL_CONTENT[lang];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-sm">
            <div className="bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-zinc-700">
                <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-700 flex justify-between items-center">
                    <h2 className="text-lg font-black text-zinc-100 flex items-center gap-2"><BookOpen className="text-amber-500" /> MANUAL 161914</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white"><X size={20} /></button>
                </div>
                <div className="overflow-y-auto p-6 space-y-6">
                    <div><h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2"><Target className="text-emerald-400" /> {t.finance}</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{content.finance.map((item, i) => <div key={i} className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-700"><h4 className="font-bold text-zinc-200 text-xs mb-1">{item.title}</h4><p className="text-[11px] text-zinc-400">{item.content}</p></div>)}</div></div>
                    <div><h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2"><Zap className="text-amber-400" /> {t.realtime}</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{content.realtime.map((item, i) => <div key={i} className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-700"><h4 className="font-bold text-zinc-200 text-xs mb-1">{item.title}</h4><p className="text-[11px] text-zinc-400">{item.content}</p></div>)}</div></div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
const App = () => {
    const [lang, setLang] = useState(localStorage.getItem('ace_lang') || 'es');
    const [prices, setPrices] = useState({});
    const [listings, setListings] = useState({});
    const [trends, setTrends] = useState({});
    const [loading, setLoading] = useState(true);
    const [apiKey, setApiKey] = useState(localStorage.getItem('ace_api_key') || '');
    const [userData, setUserData] = useState({ wallet: {}, materials: {} });
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [customIterations, setCustomIterations] = useState({});
    const [aggressiveness, setAggressiveness] = useState(localStorage.getItem('ace_aggro') || 'moderate'); // conservative, moderate, aggressive
    const [auditLog, setAuditLog] = useState([{ agent: "ACE", msg: "v8 Init", type: "info" }]);

    const t = LANG[lang];
    const toggleLang = () => { const newLang = lang === 'es' ? 'en' : 'es'; setLang(newLang); localStorage.setItem('ace_lang', newLang); };
    const cycleAggro = () => { const modes = ['conservative', 'moderate', 'aggressive']; const next = modes[(modes.indexOf(aggressiveness) + 1) % 3]; setAggressiveness(next); localStorage.setItem('ace_aggro', next); };
    const getAggroMultiplier = () => ({ conservative: 0.5, moderate: 1, aggressive: 1.5 }[aggressiveness]);
    const getAggroLabel = () => ({ conservative: t.conservative, moderate: t.moderate, aggressive: t.aggressive }[aggressiveness]);
    const getAggroColor = () => ({ conservative: 'text-blue-400', moderate: 'text-amber-400', aggressive: 'text-red-400' }[aggressiveness]);

    const addAudit = useCallback((agent, msg, type = "info") => {
        setAuditLog(prev => [{ agent, msg, time: new Date().toLocaleTimeString('es-ES', { hour12: false }), type }, ...prev.slice(0, 6)]);
    }, []);

    const updateTrendHistory = useCallback((priceMap) => {
        try {
            const history = JSON.parse(localStorage.getItem(TREND_KEY) || '{}');
            const now = Date.now();
            Object.keys(priceMap).forEach(id => {
                if (!history[id]) history[id] = [];
                history[id].push({ price: priceMap[id].sells?.unit_price || 0, ts: now });
                history[id] = history[id].slice(-10);
            });
            localStorage.setItem(TREND_KEY, JSON.stringify(history));
            const trendMap = {};
            Object.keys(history).forEach(id => {
                const data = history[id];
                if (data.length > 1) {
                    const avg = data.slice(0, -1).reduce((a, c) => a + c.price, 0) / (data.length - 1);
                    trendMap[id] = data[data.length - 1].price > avg ? 'up' : data[data.length - 1].price < avg ? 'down' : 'flat';
                }
            });
            setTrends(trendMap);
        } catch (e) { console.error(e); }
    }, []);

    const fetchMarketData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [priceRes, listingRes] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${ALL_IDS.join(',')}`),
                fetch(`https://api.guildwars2.com/v2/commerce/listings?ids=${ALL_LISTING_IDS.join(',')}`)
            ]);
            const priceData = await priceRes.json();
            const listingData = await listingRes.json();
            const priceMap = {}; priceData.forEach(p => priceMap[p.id] = p);
            const listingMap = {}; listingData.forEach(l => { listingMap[l.id] = { ...l, supply: l.sells?.slice(0, 10).reduce((a, c) => a + c.quantity, 0) || 0 }; });
            setPrices(priceMap); setListings(listingMap); updateTrendHistory(priceMap);
            addAudit("Market", "Synced", "success");
        } catch (e) { addAudit("Error", e.message, "error"); }
        finally { if (!silent) setLoading(false); }
    }, [addAudit, updateTrendHistory]);

    const fetchUserData = useCallback(async () => {
        if (!apiKey) return;
        try {
            const [walletRes, matsRes, bankRes] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/account/wallet?access_token=${apiKey}`),
                fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${apiKey}`),
                fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${apiKey}`)
            ]);
            if (!walletRes.ok) throw new Error("Invalid Key");
            const [wallet, mats, bank] = await Promise.all([walletRes.json(), matsRes.json(), bankRes.json()]);
            const walletMap = {}; wallet.forEach(c => walletMap[c.id] = c.value);
            const matsMap = {}; mats.forEach(m => matsMap[m.id] = (matsMap[m.id] || 0) + m.count);
            bank.forEach(item => { if (item) matsMap[item.id] = (matsMap[item.id] || 0) + item.count; });
            setUserData({ wallet: walletMap, materials: matsMap });
            addAudit("Account", "Synced", "success");
        } catch (e) { addAudit("Error", e.message, "error"); }
    }, [apiKey, addAudit]);

    useEffect(() => { fetchMarketData(); if (apiKey) fetchUserData(); const i = setInterval(() => { fetchMarketData(true); if (apiKey) fetchUserData(); }, 300000); return () => clearInterval(i); }, [fetchMarketData, fetchUserData, apiKey]);

    const saveKey = (key) => { setApiKey(key); localStorage.setItem('ace_api_key', key); setShowKeyInput(false); addAudit("Config", "Key saved"); setTimeout(fetchUserData, 500); };
    const formatGold = (c) => { if (!c && c !== 0) return "---"; const a = Math.abs(c); return <span className="font-mono">{c < 0 ? '-' : ''}{Math.floor(a / 10000)}<span className="text-amber-400">g</span> {Math.floor((a % 10000) / 100)}<span className="text-zinc-500">s</span></span>; };

    const calculatePromotion = (t6Id, overrideIter = null) => {
        const item = ITEM_DATA[t6Id]; if (!item?.t5) return null;
        const t6 = prices[t6Id], t5 = prices[item.t5], dust = prices[ESSENTIALS.CRYSTALLINE_DUST];
        if (!t6 || !t5 || !dust) return null;
        const cost = (50 * t5.buys.unit_price) + (1 * t6.buys.unit_price) + (5 * dust.buys.unit_price);
        const revenue = (6.85 * t6.sells.unit_price) * 0.85;
        const profit = revenue - cost;
        let maxCrafts = 9999, limitReason = "Market";
        if (apiKey) {
            const shardLimit = Math.floor((userData.wallet[23] || 0) * 2);
            const dustLimit = Math.floor((userData.materials[ESSENTIALS.CRYSTALLINE_DUST] || 0) / 5);
            const t5Limit = Math.floor((userData.materials[item.t5] || 0) / 50);
            maxCrafts = Math.min(shardLimit, dustLimit, t5Limit);
            if (maxCrafts === shardLimit) limitReason = "Shards";
            else if (maxCrafts === dustLimit) limitReason = "Dust";
            else if (maxCrafts === t5Limit) limitReason = "T5";
        }
        const chosen = overrideIter !== null ? overrideIter : maxCrafts;
        return { cost, profit, roi: ((revenue - cost) / cost) * 100, t5Id: item.t5, maxCrafts, limitReason, chosen, totalCost: cost * chosen, potentialProfit: profit * chosen };
    };

    const opportunities = useMemo(() => {
        const ops = [];
        T6_IDS.forEach(t6Id => {
            const calc = calculatePromotion(t6Id, customIterations[t6Id]);
            if (calc && calc.roi > 5) ops.push({ id: t6Id, item: ITEM_DATA[t6Id], trend: trends[t6Id], ...calc });
        });
        return ops.sort((a, b) => b.potentialProfit - a.potentialProfit); // Sort by TOTAL PROFIT, not ROI
    }, [prices, userData, customIterations, trends]);

    const liquidatorData = useMemo(() => {
        if (!apiKey) return [];
        const sellables = [];
        Object.keys(userData.materials).forEach(id => {
            const count = userData.materials[id];
            const priceInfo = prices[id];
            if (count > 0 && priceInfo) {
                const value = count * priceInfo.sells.unit_price * 0.85;
                if (value > 10000) sellables.push({ id: Number(id), count, value });
            }
        });
        return sellables.sort((a, b) => b.value - a.value).slice(0, 5);
    }, [userData, prices, apiKey]);

    const smartRoute = useMemo(() => {
        if (opportunities.length < 2) return null;
        const top3 = opportunities.slice(0, 3);
        const totalRoi = top3.reduce((a, c) => a + c.roi, 0);
        return top3.map(op => ({ ...op, allocation: Math.round((op.roi / totalRoi) * 100) }));
    }, [opportunities]);

    const handleIterChange = (id, v) => setCustomIterations(prev => ({ ...prev, [id]: parseInt(v, 10) || 0 }));

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 md:p-6 font-sans">
            {showManual && <ManualModal onClose={() => setShowManual(false)} lang={lang} />}

            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-zinc-800 pb-4 bg-zinc-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-600 p-2.5 rounded-lg"><Cpu className="w-7 h-7 text-zinc-900" /></div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-zinc-100">{t.title} <span className="text-amber-500">161914</span></h1>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{t.subtitle} v8</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <button onClick={toggleLang} className="flex items-center gap-1 px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-[10px] font-bold hover:bg-zinc-600"><Globe size={12} /> {lang.toUpperCase()}</button>
                    <button onClick={cycleAggro} className={`flex items-center gap-1 px-2 py-1 bg-zinc-700 rounded text-[10px] font-bold hover:bg-zinc-600 ${getAggroColor()}`}><Target size={12} /> {getAggroLabel()}</button>
                    <button onClick={() => setShowManual(true)} className="flex items-center gap-1 px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-[10px] font-bold hover:bg-zinc-600"><BookOpen size={12} /> {t.manual}</button>
                    {showKeyInput ? <input type="text" placeholder="API Key" className="bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs w-36 text-zinc-100" onBlur={(e) => saveKey(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveKey(e.target.value)} autoFocus /> : <button onClick={() => setShowKeyInput(true)} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${apiKey ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' : 'bg-zinc-700 text-zinc-400'}`}><Key size={12} /> {apiKey ? t.linked : t.link}</button>}
                    <button onClick={() => { fetchMarketData(); fetchUserData(); }} disabled={loading} className="bg-amber-600 hover:bg-amber-500 text-zinc-900 p-2 rounded disabled:opacity-50"><RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 h-[220px] flex flex-col">
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-1"><Database size={12} /> {t.log}</h3>
                        <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 text-[10px]">
                            {auditLog.map((log, i) => <div key={i} className="border-b border-zinc-700/50 pb-1"><span className="text-zinc-600 font-mono">[{log.agent}]</span> <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-zinc-400'}>{log.msg}</span></div>)}
                        </div>
                    </div>
                    {apiKey && <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700"><h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-1"><Wallet size={12} /> {t.wallet}</h3><div className="flex justify-between text-xs"><span className="text-zinc-500">{t.gold}</span><span className="font-bold">{formatGold(userData.wallet[1])}</span></div><div className="flex justify-between text-xs mt-1"><span className="text-zinc-500">{t.shards}</span><span className="font-bold text-purple-400">{userData.wallet[23] || 0}</span></div></div>}
                    {apiKey && liquidatorData.length > 0 && (
                        <div className="bg-red-950/30 p-4 rounded-xl border border-red-900/50">
                            <h3 className="text-[10px] font-bold text-red-400 uppercase mb-1 flex items-center gap-1"><Trash2 size={12} /> {t.liquidator}</h3>
                            <p className="text-[9px] text-red-300/70 mb-2">{t.liquidatorSub}</p>
                            <div className="space-y-1">{liquidatorData.map((item, i) => <div key={i} className="flex justify-between text-[10px]"><a href={getWikiUrl(ITEM_DATA[item.id]?.wiki)} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-amber-400 truncate flex-1 flex items-center gap-1">{item.count}x {getItemName(item.id, lang)} <ExternalLink size={9} className="text-zinc-600" /></a><span className="font-bold text-emerald-400 ml-2">{formatGold(item.value)}</span></div>)}</div>
                            <div className="mt-2 pt-2 border-t border-red-900/50 text-right"><span className="text-[10px] text-red-300 font-bold">{t.total}: {formatGold(liquidatorData.reduce((a, c) => a + c.value, 0))}</span></div>
                        </div>
                    )}
                </div>

                {/* CENTER */}
                <div className="lg:col-span-6 space-y-4">
                    {smartRoute && (
                        <div className="bg-indigo-950/30 rounded-xl p-4 border border-indigo-900/50">
                            <div className="flex justify-between items-center mb-2"><h3 className="text-xs font-bold text-indigo-300 flex items-center gap-1"><PieChart size={14} /> {t.smartRoute}</h3><span className="text-[9px] bg-indigo-900/50 px-1.5 py-0.5 rounded text-indigo-400 font-bold">{t.diversify}</span></div>
                            <div className="flex h-2 rounded-full overflow-hidden mb-2">{smartRoute.map((item, i) => <div key={i} style={{ width: `${item.allocation}%` }} className={`h-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>)}</div>
                            <div className="grid grid-cols-3 gap-1">{smartRoute.map((item, i) => <div key={i} className="text-center"><p className={`text-[10px] font-bold ${i === 0 ? 'text-blue-400' : i === 1 ? 'text-emerald-400' : 'text-purple-400'}`}>{item.allocation}%</p><a href={getWikiUrl(item.item.wiki)} target="_blank" rel="noopener noreferrer" className="text-[9px] text-zinc-400 hover:text-amber-400 truncate block">{getItemName(item.id, lang)}</a></div>)}</div>
                        </div>
                    )}
                    <div className="flex items-center justify-between"><h2 className="text-base font-bold flex items-center gap-1 text-zinc-200"><Activity className="text-amber-500" size={18} /> {t.opportunities}</h2><span className="text-[10px] font-bold bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-full border border-amber-800/50">{opportunities.length} {t.flips}</span></div>
                    <div className="space-y-2">
                        {opportunities.length === 0 ? <div className="bg-zinc-800 p-10 text-center rounded-xl border border-zinc-700"><AlertTriangle className="w-8 h-8 text-zinc-600 mx-auto mb-2" /><p className="text-zinc-500 text-sm">{loading ? t.loading : 'No data'}</p></div> : opportunities.map((opp) => (
                            <div key={opp.id} className={`bg-zinc-800 rounded-xl border transition-all cursor-pointer ${expandedId === opp.id ? 'border-amber-600 ring-1 ring-amber-900' : 'border-zinc-700 hover:border-zinc-600'}`} onClick={() => setExpandedId(expandedId === opp.id ? null : opp.id)}>
                                <div className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center text-lg font-bold text-amber-500">{getItemName(opp.id, lang).charAt(0)}</div>
                                        <div>
                                            <h3 className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
                                                <a href={getWikiUrl(opp.item.wiki)} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>{getItemName(opp.id, lang)} <ExternalLink size={10} className="text-zinc-600" /></a>
                                                {opp.trend === 'up' && <TrendingUp size={12} className="text-emerald-400" />}
                                                {opp.trend === 'down' && <TrendingDown size={12} className="text-red-400" />}
                                            </h3>
                                            <span className="text-[9px] text-zinc-500 font-mono">T5: {formatGold(prices[opp.t5Id]?.buys?.unit_price)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <div><div className="flex items-center gap-1 justify-end text-emerald-400 font-black text-base"><ArrowUpRight size={16} />{opp.roi.toFixed(1)}%</div><p className="text-[10px] text-zinc-500">{formatGold(opp.profit)} /u</p></div>
                                        {expandedId === opp.id ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
                                    </div>
                                </div>
                                {expandedId === opp.id && (
                                    <div className="px-3 pb-3" onClick={(e) => e.stopPropagation()}>
                                        <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-700 text-xs">
                                            <div className="flex justify-between items-start mb-3">
                                                <div><p className="font-bold text-zinc-400 flex items-center gap-1 mb-1"><FlaskConical size={11} className="text-purple-400" /> {t.recipe}:</p><ul className="pl-3 space-y-0.5 text-zinc-500 font-mono text-[10px]"><li>50x T5</li><li>1x T6</li><li>5x Dust</li><li>5x Stones</li></ul></div>
                                                <div className="text-right"><p className="font-bold text-zinc-400 flex items-center justify-end gap-1 mb-1"><Calculator size={11} className="text-blue-400" /> {t.iterations}:</p><div className="flex items-center gap-1 justify-end"><input type="number" className="w-14 text-center bg-zinc-800 border border-zinc-600 rounded px-1 py-0.5 text-xs font-bold text-zinc-100" value={customIterations[opp.id] !== undefined ? customIterations[opp.id] : opp.maxCrafts} onChange={(e) => handleIterChange(opp.id, e.target.value)} min="0" /><span className="text-[9px] text-zinc-500">/ {opp.maxCrafts} {t.max}</span></div><p className="text-[9px] text-amber-500 font-bold mt-1">{t.limit}: {opp.limitReason}</p></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-700"><div className="text-center bg-zinc-800 p-2 rounded"><p className="text-[9px] text-zinc-500 uppercase font-bold">{t.totalCost}</p><p className="font-mono font-bold text-red-400 text-sm">{formatGold(opp.totalCost)}</p></div><div className="text-center bg-emerald-950/30 p-2 rounded"><p className="text-[9px] text-zinc-500 uppercase font-bold">{t.profit}</p><p className="font-mono font-bold text-emerald-400 text-sm">{formatGold(opp.potentialProfit)}</p></div></div>
                                            <div className="mt-2 pt-2 border-t border-zinc-700/50"><p className="text-[9px] text-indigo-400 italic flex items-center gap-1"><Puzzle size={10} /> {t.why} {t.whyPromo}</p></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
                        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-700"><h3 className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1"><Clock size={12} className="text-amber-500" /> {t.protocol}</h3></div>
                        <div className="p-2">{[{ task: "Promo T6", status: `${userData.wallet[23] || 0} Shards`, profit: opportunities[0]?.profit || 0 }, { task: "Flip Ectos", status: `${userData.materials[ESSENTIALS.ECTO] || 0}x`, profit: prices[ESSENTIALS.ECTO] ? (prices[ESSENTIALS.ECTO].sells.unit_price * 0.85) - prices[ESSENTIALS.ECTO].buys.unit_price : 0 }].sort((a, b) => b.profit - a.profit).map((item, i) => <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-zinc-700/30"><div className={`w-1.5 h-1.5 rounded-full ${item.profit > 1000 ? 'bg-emerald-500' : 'bg-zinc-600'}`}></div><div className="flex-1"><div className="flex justify-between"><span className="text-[10px] font-bold text-zinc-300">{item.task}</span><span className="text-[9px] font-mono text-emerald-400">{formatGold(item.profit)}</span></div><p className="text-[9px] text-zinc-500">{item.status}</p></div></div>)}</div>
                        {!apiKey && <div className="p-3 bg-amber-950/20 text-[9px] text-amber-400/70 text-center border-t border-zinc-700"><Lock size={10} className="inline mr-1" /> {t.link} API</div>}
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700"><h4 className="text-[10px] font-bold text-amber-500 uppercase mb-1">{t.tip}</h4><p className="text-[10px] text-zinc-400">{t.tipText}</p></div>
                </div>
            </div>
            <footer className="mt-10 pt-6 border-t border-zinc-800 flex justify-between items-center text-[9px] text-zinc-600 font-mono uppercase"><span>ACE_161914 // V8.0</span><span>{apiKey ? t.linked.toUpperCase() : 'OBSERVER'}</span></footer>
        </div>
    );
};

export default App;
