import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    TrendingUp,
    Flame,
    Zap,
    Database,
    Cpu,
    Activity,
    RefreshCcw,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Coins,
    Sun,
    Key,
    Wallet,
    Lock,
    BookOpen,
    X,
    Target
} from 'lucide-react';

// --- MANUAL DATA ---
const MANUAL_CONTENT = {
    finance: [
        {
            title: "1. Liquidez vs. Patrimonio",
            content: "La Regla de Kilonova: Nunca dejes que tu liquidez baje del 20% de tu patrimonio operativo. Si tienes 73g, ese es tu motor. Convertirlo en objetos permanentes mata tu capacidad de aprovechar oportunidades."
        },
        {
            title: "2. Trampa de la Amortización",
            content: "Antes de comprar algo 'útil' (e.g. contratos), calcula el 'Breakeven'. Si necesitas 100,000 usos para amortizarlo, es un LUJO, no una inversión."
        },
        {
            title: "3. Inversión Activa vs. Pasiva",
            content: "Prioriza la Inversión Activa (Forja/Bazar) con ROI 10-20%. Solo pasa a Pasiva (Nodos/Recicladoras) cuando tu tiempo o el mercado saturen la activa."
        },
        {
            title: "4. Coste de Oportunidad",
            content: "Cada oro gastado en comodidad es oro que no está generando beneficios. Ejemplo: Gastar 200g en una recicladora hoy te cuesta ~50g/semana de beneficio potencil perdido."
        },
        {
            title: "5. Magic Find vs. Oro/Hora",
            content: "El MF no afecta a los cofres ni bolsas de botín (80% de tus ingresos). No te obsesiones. Prioriza builds de AoE y rotación de eventos (RIBA/Drizzlewood)."
        },
        {
            title: "6. Escalones de Riqueza",
            content: "1. Promoción T5-T6 (Base). 2. Especulación de Parches (100-500g). 3. Legendarias (1000g+). No saltes pasos."
        }
    ],
    realtime: [
        {
            title: "1. Los Tres Pilares",
            content: "Spread (>20%), Velocidad (Ventas/Hora altas) y Volumen (Muro de Competencia). No mires solo el margen, mira si se vende."
        },
        {
            title: "2. Regla del Cobre (Undercut)",
            content: "Siempre lista a 1 cobre menos. Nunca bajes por platas o destruirás el valor. Retira y relista solo si el precio se mueve significativamente tras 15 min."
        },
        {
            title: "3. Flujo de Decisión (Algoritmo Kilonova)",
            content: "¿Tengo T5? > ¿Polvo estable? > ¿Venta T6 > (Coste T5 + Polvo)/0.85? > SÍ: FORJA. NO: BANCO."
        },
        {
            title: "4. Detección de Anomalías",
            content: "Sangre T6 < 25s: Mercado Saturado (NO VENDER). Sangre T6 > 32s: Escasez (VENDER TODO)."
        },
        {
            title: "5. El Factor API",
            content: "Usa tu inventario como dato. Si tienes 0 oro pero 500 sangres, VENDE YA para recuperar liquidez (Motor)."
        }
    ]
};

// --- DATA CONSTANTS (TRANSLATED) ---
const ITEM_DATA = {
    // T6 Materials (ID: { name, icon, t5Id })
    24295: { name: 'Colmillo Vicioso', t5: 24294, icon: 'E0B9C67E9B95D2999DEC3A7C5E83FBEA6D53F2E6' },
    24357: { name: 'Escama Blindada', t5: 24356, icon: 'C5A274C2DE4E6A30C81FF2F1EE53F10D0A3D85F6' },
    24289: { name: 'Garra Viciosa', t5: 24288, icon: '3B2C3B9B7B1F1B8D0E8C2D5E4B7A1F9C3D2E8B5' },
    24351: { name: 'Hueso Antiguo', t5: 24350, icon: '9E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4B3A29180' },
    24350: { name: 'Hueso Grande', t5: 24349, icon: '1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0' },
    24283: { name: 'Montón de Polvo Cristalino', t5: 24282, icon: 'B8A7C6D5E4F3A2918B7C6D5E4F3A2918B7C6D5E4' },
    24299: { name: 'Tótem Elaborado', t5: 24298, icon: 'F1E2D3C4B5A69788F9E0D1C2B3A4F5E6D7C8B9A0' },
    24341: { name: 'Saco de Veneno Poderoso', t5: 24340, icon: 'A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0' }
};

const ESSENTIALS = {
    ECTO: 19721, // Pegote de Ectoplasma
    MYSTIC_COIN: 19976, // Moneda Mística
    CRYSTALLINE_DUST: 24277, // Polvo Cristalino
    SPIRIT_SHARD: 23 // Wallet ID
};

const ALL_IDS = [
    ...Object.keys(ITEM_DATA),
    ...Object.values(ITEM_DATA).map(i => i.t5),
    ...Object.values(ESSENTIALS).filter(id => id > 100) // Filter out wallet IDs
];

const ManualModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">

            {/* Header */}
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        <BookOpen className="text-blue-600" /> MANUAL DE OPERACIONES 161914
                    </h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Estrategia Financiera & Análisis Tiempo Real</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-red-500">
                    <X size={24} />
                </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-8 space-y-10 custom-scrollbar">

                {/* SECTION 1 */}
                <div>
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Target className="text-emerald-500" /> 1. Arquitectura Financiera
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MANUAL_CONTENT.finance.map((item, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                                <h4 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 2 */}
                <div>
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Zap className="text-amber-500" /> 2. Análisis de Mercado en Tiempo Real
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MANUAL_CONTENT.realtime.map((item, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-amber-200 transition-colors">
                                <h4 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-center">
                    <p className="text-sm font-bold text-blue-800 mb-1">Conclusión</p>
                    <p className="text-xs text-blue-600 italic">"El análisis en tiempo real no es adivinar el futuro, es reaccionar al presente con los datos de tu API y los del Bazar cruzados."</p>
                </div>

            </div>
        </div>
    </div>
);

const App = () => {
    const [prices, setPrices] = useState({});
    const [listings, setListings] = useState({});
    const [gemRate, setGemRate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [apiKey, setApiKey] = useState(localStorage.getItem('ace_api_key') || '');
    const [userData, setUserData] = useState({ wallet: {}, materials: {} });
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [auditLog, setAuditLog] = useState([
        { agent: "ACE_Core", msg: "Sistema iniciado.", type: "info" }
    ]);

    const CACHE_KEY = 'ace_gw2_data_v2';

    const addAudit = useCallback((agent, msg, type = "info") => {
        const time = new Date().toLocaleTimeString('es-ES', { hour12: false });
        setAuditLog(prev => [{ agent, msg, time, type }, ...prev.slice(0, 8)]);
    }, []);

    // --- API LOGIC ---
    const fetchMarketData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [priceRes, gemRes, listingRes] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${ALL_IDS.join(',')}`),
                fetch(`https://api.guildwars2.com/v2/commerce/exchange/gems?quantity=100`),
                fetch(`https://api.guildwars2.com/v2/commerce/listings?ids=${ESSENTIALS.ECTO},${ESSENTIALS.MYSTIC_COIN}`)
            ]);

            const priceData = await priceRes.json();
            const gemData = await gemRes.json();
            const listingData = await listingRes.json();

            const priceMap = {};
            priceData.forEach(p => priceMap[p.id] = p);

            const listingMap = {};
            listingData.forEach(l => listingMap[l.id] = l);

            setPrices(priceMap);
            setListings(listingMap);
            setGemRate(gemData);
            setLastUpdate(new Date());

            localStorage.setItem(CACHE_KEY, JSON.stringify({
                prices: priceMap,
                gemRate: gemData,
                timestamp: new Date().toISOString()
            }));

            addAudit("Mercado", "Datos de precios actualizados", "success");
        } catch (error) {
            console.error(error);
            addAudit("Error Mercado", "Fallo al conectar con API pública", "error");
        } finally {
            if (!silent) setLoading(false);
        }
    }, [addAudit]);

    const fetchUserData = useCallback(async () => {
        if (!apiKey) return;
        try {
            const [walletRes, matsRes] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/account/wallet?access_token=${apiKey}`),
                fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${apiKey}`)
            ]);

            if (!walletRes.ok || !matsRes.ok) throw new Error("API Key inválida o permisos insuficientes");

            const walletData = await walletRes.json();
            const matsData = await matsRes.json();

            const walletMap = {};
            walletData.forEach(c => walletMap[c.id] = c.value);

            const matsMap = {};
            matsData.forEach(m => matsMap[m.id] = m.count);

            setUserData({ wallet: walletMap, materials: matsMap });
            addAudit("Cuenta", "Datos de billetera y materiales sincronizados", "success");
        } catch (error) {
            addAudit("Error Cuenta", error.message, "error");
        }
    }, [apiKey, addAudit]);

    useEffect(() => {
        fetchMarketData();
        if (apiKey) fetchUserData();

        const interval = setInterval(() => {
            fetchMarketData(true);
            if (apiKey) fetchUserData();
        }, 300000); // 5 min

        return () => clearInterval(interval);
    }, [fetchMarketData, fetchUserData, apiKey]);

    const saveKey = (key) => {
        setApiKey(key);
        localStorage.setItem('ace_api_key', key);
        setShowKeyInput(false);
        addAudit("Config", "API Key guardada", "info");
        setTimeout(fetchUserData, 500);
    };

    // --- CALCULATIONS ---
    const formatGold = (copper) => {
        if (!copper && copper !== 0) return "---";
        const absCopper = Math.abs(copper);
        const g = Math.floor(absCopper / 10000);
        const s = Math.floor((absCopper % 10000) / 100);
        const c = Math.floor(absCopper % 100);
        const sign = copper < 0 ? '-' : '';
        return (
            <span className="font-mono whitespace-nowrap">
                {sign}{g}<span className="text-yellow-600 font-bold">g</span>{' '}
                {s}<span className="text-slate-400 font-bold">s</span>{' '}
                {c}<span className="text-orange-600 font-bold">c</span>
            </span>
        );
    };

    const calculatePromotion = (t6Id) => {
        const item = ITEM_DATA[t6Id];
        const t6 = prices[t6Id];
        const t5 = prices[item.t5];
        const dust = prices[ESSENTIALS.CRYSTALLINE_DUST];

        if (!t6 || !t5 || !dust) return null;

        const cost = (50 * t5.buys.unit_price) + (1 * t6.buys.unit_price) + (5 * dust.buys.unit_price);
        const revenue = (6.85 * t6.sells.unit_price) * 0.85;

        return {
            cost,
            revenue,
            profit: revenue - cost,
            roi: ((revenue - cost) / cost) * 100,
            t5Id: item.t5
        };
    };

    const ectoFlip = useMemo(() => {
        const ecto = prices[ESSENTIALS.ECTO];
        if (!ecto) return null;
        return {
            profit: (ecto.sells.unit_price * 0.85) - ecto.buys.unit_price,
            margin: (((ecto.sells.unit_price * 0.85) - ecto.buys.unit_price) / ecto.buys.unit_price) * 100
        };
    }, [prices]);

    const opportunities = useMemo(() => {
        const ops = [];
        Object.keys(ITEM_DATA).forEach(t6Id => {
            const calc = calculatePromotion(t6Id);
            if (calc && calc.roi > 10) {
                ops.push({
                    type: 'promo',
                    item: ITEM_DATA[t6Id],
                    id: t6Id,
                    ...calc
                });
            }
        });
        return ops.sort((a, b) => b.roi - a.roi);
    }, [prices]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans relative">
            {showManual && <ManualModal onClose={() => setShowManual(false)} />}

            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-slate-200 pb-6 bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="bg-blue-600 p-3 rounded-lg shadow-lg shadow-blue-200">
                        <Cpu className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                            MOTOR ACE <span className="text-blue-600">161914</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1.5">
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                                Terminal de Trading GW2
                            </p>
                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${loading ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {loading ? 'CARGANDO' : 'ONLINE'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto items-center">

                    <button
                        onClick={() => setShowManual(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        <BookOpen size={14} />
                        <span className="hidden md:inline">MANUAL 161914</span>
                    </button>

                    {/* API KEY INPUT */}
                    <div className="relative">
                        {showKeyInput ? (
                            <div className="flex gap-2 animate-scan">
                                <input
                                    type="text"
                                    placeholder="Pegar API Key (usada localmente)"
                                    className="bg-slate-100 border border-slate-300 rounded px-2 text-xs w-48 focus:outline-none focus:border-blue-500"
                                    onBlur={(e) => saveKey(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveKey(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowKeyInput(true)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${apiKey ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                            >
                                <Key size={14} />
                                {apiKey ? 'API Conectada' : 'Vincular Cuenta'}
                            </button>
                        )}
                    </div>

                    <div className="bg-slate-100 px-5 py-2.5 rounded-lg border border-slate-200 hidden md:block">
                        <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Gemas/Oro</p>
                        <p className="text-sm font-bold text-slate-800">
                            {gemRate ? formatGold(gemRate.coins_per_gem * 100) : "---"}
                        </p>
                    </div>

                    <button
                        onClick={() => { fetchMarketData(); fetchUserData(); }}
                        disabled={loading}
                        className="bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-300 disabled:cursor-not-allowed transition-all p-3 rounded-lg shadow-sm hover:shadow-md"
                    >
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </header>

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COL - AUDIT & STATUS */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm h-[300px] flex flex-col">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                            <Database size={14} /> Registro del Sistema
                        </h3>
                        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                            {auditLog.map((log, i) => (
                                <div key={i} className="text-xs border-b border-slate-100 pb-2 last:border-0">
                                    <div className="flex justify-between text-slate-400 mb-1 font-mono text-[10px]">
                                        <span className="font-bold text-slate-500">[{log.agent}]</span>
                                        <span>{log.time}</span>
                                    </div>
                                    <p className={`font-medium ${log.type === 'error' ? 'text-red-600' :
                                            log.type === 'success' ? 'text-emerald-600' : 'text-slate-600'
                                        }`}>
                                        {log.msg}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* USER WALLET MINI */}
                    {apiKey && (
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                <Wallet size={14} /> Billetera Líquida
                            </h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-500">Oro</span>
                                <span className="font-bold text-sm">{userData.wallet[1] ? formatGold(userData.wallet[1]) : '0'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Spirit Shards</span>
                                <span className="font-bold text-sm text-purple-600">{userData.wallet[23] || 0}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* CENTER COL - OPPORTUNITIES */}
                <div className="lg:col-span-6 space-y-5">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <Activity className="text-blue-600" size={20} />
                            Oportunidades en Vivo
                        </h2>
                        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                            {opportunities.length} FLIPS ACTIVOS
                        </span>
                    </div>

                    <div className="space-y-3">
                        {opportunities.length === 0 ? (
                            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm opacity-70">
                                <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Esperando datos del mercado...</p>
                            </div>
                        ) : (
                            opportunities.map((opp) => (
                                <div key={opp.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={`https://render.guildwars2.com/file/${opp.item.icon}/64.png`}
                                                    alt={opp.item.name}
                                                    className="w-12 h-12 rounded-lg bg-slate-100 shadow-inner p-1"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                                {/* INVENTORY BADGE */}
                                                {userData.materials[opp.t5Id] > 50 && (
                                                    <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm border border-white">
                                                        Tienes Mats
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-base">{opp.item.name}</h3>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                                    T5: {prices[opp.t5Id]?.buys.unit_price ? formatGold(prices[opp.t5Id].buys.unit_price) : '...'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center gap-1.5 justify-end text-emerald-600 font-black text-lg">
                                                <ArrowUpRight size={20} className="text-emerald-500" />
                                                {opp.roi.toFixed(1)}%
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                Profit: {formatGold(opp.profit)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT COL - TRADING GUIDE */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} className="text-blue-600" /> Protocolo de Trading
                            </h3>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">BAZAR ONLY</span>
                        </div>

                        <div className="p-2">
                            {[
                                {
                                    task: "Promoción T6 (Spirit Shards)",
                                    status: userData.wallet[23] > 0 ? `${userData.wallet[23]} Shards Disp.` : "Sin Shards",
                                    profit: opportunities.length > 0 ? opportunities[0].profit : 0,
                                    active: userData.wallet[23] > 0
                                },
                                {
                                    task: "Flip de Ectoplasmas",
                                    status: `Stock: ${userData.materials[ESSENTIALS.ECTO] || 0}`,
                                    profit: ectoFlip ? ectoFlip.profit : 0,
                                    active: true
                                },
                                {
                                    task: "Arbitraje Mon. Místicas",
                                    status: `Stock: ${userData.materials[ESSENTIALS.MYSTIC_COIN] || 0}`,
                                    profit: prices[ESSENTIALS.MYSTIC_COIN] ? (prices[ESSENTIALS.MYSTIC_COIN].sells.unit_price * 0.85) - prices[ESSENTIALS.MYSTIC_COIN].buys.unit_price : 0,
                                    active: true
                                }
                            ].sort((a, b) => b.profit - a.profit).map((item, idx) => (
                                <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg transition-colors border-b border-slate-50 last:border-0 ${item.active ? 'opacity-100 hover:bg-slate-50 cursor-pointer' : 'opacity-50'}`}>
                                    <div className={`mt-1 w-2 h-2 rounded-full ${item.profit > 1000 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="text-xs font-bold text-slate-700">{item.task}</p>
                                            {item.profit > 0 && (
                                                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1 rounded">
                                                    {formatGold(item.profit)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                            {item.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!apiKey && (
                            <div className="p-4 bg-yellow-50 text-[10px] text-yellow-800 text-center border-t border-yellow-100">
                                <Lock size={12} className="inline mr-1" />
                                Vincula tu API Key arriba para ver tu inventario real.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 p-5 rounded-xl bg-orange-50 border border-orange-100">
                        <h4 className="text-xs font-bold text-orange-600 uppercase mb-2 flex items-center gap-1">
                            Consejo Especulativo
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            Concéntrate en el flipping de alta velocidad de <strong className="text-slate-800">Ectoplasmas</strong> durante el fin de semana.
                        </p>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                <span>ACE_161914 // LOCAL_HOST</span>
                <span>{apiKey ? 'MODO: VINCULADO' : 'MODO: OBSERVADOR'}</span>
            </footer>
        </div>
    );
};

export default App;
