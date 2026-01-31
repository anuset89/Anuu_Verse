import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    TrendingUp, Zap, Database, Cpu, Activity, RefreshCcw, AlertTriangle, ArrowUpRight,
    Clock, Key, Wallet, BookOpen, X, Target, ChevronDown, ChevronUp, FlaskConical,
    Puzzle, PieChart, TrendingDown, Trash2, Calculator, Globe, ExternalLink, ShieldCheck, Flame, Scale,
    Recycle, Gem, Coins, Map, Eye, Github, FileCode, Info, HelpCircle, BarChart3, Hourglass, Sword, ChevronsDown, ShoppingCart, Train, Lock, Sparkles
} from 'lucide-react';

// --- i18n ---
const LANG = {
    es: {
        title: 'MOTOR ACE', subtitle: 'Terminal de Trading GW2', manual: 'MANUAL', link: 'Vincular API', linked: 'API Conectada',
        wallet: 'Billetera', gold: 'Oro', shards: 'Spirit Shards', liquidator: 'Liquidar Activos', liquidatorSub: 'Vende estos items para recuperar oro:',
        routes: 'Guías Estratégicas', routeSafe: 'Ruta Segura', routeBalanced: 'Ruta Balanceada', routeAggro: 'Ruta Kilonova',
        opportunities: 'Terminal de Inteligencia Flip', flips: 'INTERCAMBIO', recipe: 'Receta de Mercado',
        iterations: '¿Cuántas veces?', limit: 'Límite', totalCost: 'Inversión Total', profit: 'Beneficio Neto', protocol: 'Protocolo Diario', tip: 'Consejo Pro',
        tipText: 'Usa el Liquidator para convertir materiales muertos en capital fresco.', log: 'Registro del Sistema', loading: 'CARGANDO DATOS...', ok: 'SISTEMA OK',
        finance: 'Arquitectura Financiera', realtime: 'Análisis Tiempo Real', total: 'Valor Total', max: 'máx', wikiLink: 'Wiki',
        why: 'Análisis de Mercado:', reason: 'Razón del Ranking:',
        volatility: 'Volatilidad:', supply: 'Oferta:', demand: 'Demanda:',
        high: 'ALTA', medium: 'MEDIA', low: 'BAJA',
        sortedBy: 'Ranking por Beneficio Total',
        lab: 'Laboratorio de Reciclaje', synergy: 'Sinergia Detectada',
        salvageEcto: 'Reciclar Ectos', buyDust: 'Comprar Polvo', cheaper: '¡MÁS BARATO!',
        gemExchange: 'Cambio de Gemas', funding: 'Fuentes de Oro',
        farmFractal: 'Fractales Diarios', farmDrizzle: 'Drizzlewood Coast', farmBauble: 'Alt Parking',
        synergyTip: '¡Reciclar Ectos es más barato que comprar Polvo directamente! Ahorras un',
        gemsBuy: 'Comprar 400', gemsSell: 'Vender 400',
        securityTitle: 'Seguridad y Privacidad', securityText: 'Tu API Key se guarda ÚNICAMENTE en tu navegador (LocalStorage).',
        securityServer: 'Sin Servidor', securityServerDesc: 'No tenemos base de datos. La conexión es directa con GW2.',
        securityScope: 'Permisos Seguros', securityScopeDesc: 'Solo necesitamos lectura: Account, Wallet, Inventories.',
        securityOpen: 'Código Abierto', securityOpenDesc: 'Puedes auditar el código fuente en GitHub.',
        openRepo: 'Ver Código', saveKey: 'Guardar Llave Segura',
        dossier: 'Dossier Estratégico', risk: 'Riesgo', horizon: 'Horizonte', yield: 'Retorno Estimado',
        descSafe: 'Ideal para capital bajo/medio. Materiales que se venden al instante. No te harás rico rápido, pero no perderás oro.',
        descBalanced: 'La opción recomendada. Mezcla volumen y beneficio. Diversifica tu riesgo.',
        descAggro: 'Solo para veteranos. Apuesta todo al caballo ganador. Si el mercado se satura, te quedas atrapado, pero si sale bien ganas mucho.',
        subSafe: 'Estabilidad y Rotación Rápida', subBalanced: 'Crecimiento Sostenido', subAggro: 'Alto Riesgo, Alto Retorno',
        infoLab: 'Calculadora de Arbitraje: Compara el coste de comprar Polvo Cristalino directamente vs comprar Ectos, Reciclarlos (con Kit Místico) y obtener el polvo. A menudo, reciclar es más barato.',
        infoLiquidator: 'Escáner de Inventario: Busca en tu "Billetera de Materiales" items T5/T6 que tienes acumulados pero no usas. Te sugiere venderlos para tener oro líquido e invertir.',
        infoRanking: 'Ranking Inteligente: Ordena las oportunidades no solo por ROI %, sino por BENEFICIO TOTAL (Oro Neto). Considera tus Spirit Shards y Materiales disponibles.',
        infoGems: 'Índice de Divisa: Muestra el precio actual de 400 Gemas en Oro. Úsalo para saber si el oro está perdiendo valor (inflación) y conviene comprar gemas.',
        riskLow: 'BAJO', riskMed: 'MEDIO', riskHigh: 'ALTO',
        timeShort: 'Horas', timeMed: 'Días', timeLong: 'Semanas',
        clickExpand: 'Ver Detalles',
        // New v15 Content
        profitTrain: 'Tren de Beneficios', trainDesc: 'Craftea múltiples items en serie para maximizar el retorno.',
        shoppingList: 'Lista de Compra Global', trainSummary: 'Resumen del Lote',
        craftTop: 'Craftear Top', craftAll: 'Craftear Todo',
        // New v16 Content
        kilonovaTitle: 'KILONOVA FLIP SCANNER', kilonovaSub: 'Sincronización Pura vía API GW2',
        scanNow: 'Escanear Ahora', scanLoading: 'Escaneando Cuenta...',
        arbitrage: 'Arbitraje de Mercado', flipProfit: 'Beneficio Neto',
        buyPrice: 'Compra', sellTaxed: 'Venta (-15%)',
        stockStatus: 'Estado de Cuenta', myStock: 'Stock Global (Bolsas/Banco)',
        chars: 'Personajes', pureApi: 'Fórmula: (Venta * 0.85) - Compra',
        // New v17 Content
        oracleTitle: 'ORÁCULO ACE', oracleSub: 'Inteligencia Predictiva',
        bestPath: 'Mejor Camino Ahora', bestRoute: 'Ruta Óptima',
        recomCraft: 'Oportunidad de Crafteo', recomFlip: 'Oportunidad de Flip',
        recomSalvage: 'Arbitraje de Reciclaje',
        volatilitySafe: 'Mercado Volátil: Se recomienda Seguridad.',
        volatilityAggro: 'Mercado Estable: Se recomienda Kilonova.',
        volatilityMed: 'Tendencia Normal: Ruta Balanceada.',
        // New v19 Content
        phandrelTitle: 'MÉTODO PHANDREL', phandrelSub: 'Oro Líquido (Verdes UnID)',
        identifying: 'Identificación Crítica', salvaging: 'Reciclaje Selectivo',
        lucentMotes: 'Mat. Lúcidos', stackProfit: 'Beneficio por 250',
        phandrelTip: 'Nunca recicles el equipo verde sin identificarlo primero.',
        // v21 Daily Action Panel
        dailyAction: '🎯 ACCIÓN DEL DÍA', todayIs: 'Hoy es',
        buyNow: '1. COMPRAR', craftNow: '2. CRAFTEAR', sellNow: '3. VENDER',
        fridayTip: '🔥 VIERNES: Más jugadores online = más demanda. Sube precios de venta.',
        saturdayTip: '📈 SÁBADO: Pico de actividad. Craftea y vende rápido.',
        sundayTip: '⚠️ DOMINGO: Prepárate para reset semanal. Compra materiales baratos.',
        weekdayTip: '💼 DÍA LABORAL: Menos competencia. Buenos precios de compra.',
        shardsAvailable: 'Shards Disponibles', craftsWithShards: 'Crafteos Posibles',
        watchlist: '⭐ WATCHLIST', addToWatch: 'Añadir a Favoritos',
        // v22 AutoTracker
        autoTracker: '🎯 AUTOTRACKER', step: 'PASO', of: 'de',
        stepBuy: 'COMPRAR', stepCraft: 'CRAFTEAR', stepSell: 'VENDER',
        todayEarnings: 'Ganancia Hoy', sessionStart: 'Inicio Sesión',
        nextStep: 'Siguiente Paso', markDone: 'Marcar Hecho ✓',
        dailyGoal: 'Meta Diaria', progress: 'Progreso',
        quickRoutes: 'Rutas Rápidas', startRoute: 'Iniciar'
    },
    en: {
        title: 'ACE ENGINE', subtitle: 'GW2 Trading Terminal', manual: 'MANUAL', link: 'Link API', linked: 'API Connected',
        wallet: 'Wallet', gold: 'Gold', shards: 'Spirit Shards', liquidator: 'Liquidate Assets', liquidatorSub: 'Sell these dead items for gold:',
        routes: 'Strategic Guides', routeSafe: 'Safe Route', routeBalanced: 'Balanced Route', routeAggro: 'Kilonova Route',
        opportunities: 'Flip Intelligence Terminal', flips: 'EXCHANGE', recipe: 'Market Recipe',
        iterations: 'How many times?', limit: 'Limit', totalCost: 'Total Investment', profit: 'Net Profit', protocol: 'Daily Protocol', tip: 'Pro Tip',
        tipText: 'Use the Liquidator to turn dead materials into fresh capital.', log: 'System Log', loading: 'LOADING DATA...', ok: 'SYSTEM OK',
        finance: 'Financial Architecture', realtime: 'Real-Time Analysis', total: 'Total Value', max: 'max', wikiLink: 'Wiki',
        why: 'Market Analysis:', reason: 'Ranking Reason:',
        volatility: 'Volatility:', supply: 'Supply:', demand: 'Demand:',
        high: 'HIGH', medium: 'MEDIUM', low: 'LOW',
        sortedBy: 'Ranked by Total Profit',
        lab: 'Recycling Lab', synergy: 'Synergy Detected',
        salvageEcto: 'Salvage Ectos', buyDust: 'Buy Dust', cheaper: 'CHEAPER!',
        gemExchange: 'Gem Exchange', funding: 'Gold Sources',
        farmFractal: 'Daily Fractals', farmDrizzle: 'Drizzlewood Coast', farmBauble: 'Alt Parking',
        synergyTip: 'Salvaging Ectos is cheaper than buying Dust directly! You save',
        gemsBuy: 'Buy 400', gemsSell: 'Sell 400',
        securityTitle: 'Security & Privacy', securityText: 'Your API Key is stored ONLY in your browser (LocalStorage).',
        securityServer: 'Serverless', securityServerDesc: 'No database. Direct connection to GW2 API.',
        securityScope: 'Safe Scopes', securityScopeDesc: 'We only need read-only: Account, Wallet, Inventories.',
        securityOpen: 'Open Source', securityOpenDesc: 'You can audit the source code on GitHub.',
        openRepo: 'View Code', saveKey: 'Save Key Securely',
        dossier: 'Strategic Dossier', risk: 'Risk', horizon: 'Horizon', yield: 'Est. Yield',
        descSafe: 'Ideal for low/mid capital. Items sell instantly. You wont get rich quick, but you wont lose gold.',
        descBalanced: 'Recommended. Mixes volume and profit. Diversifies risk.',
        descAggro: 'Veterans only. Bets everything on the winner. High saturation risk.',
        subSafe: 'Stability & Fast Rotation', subBalanced: 'Sustained Growth', subAggro: 'High Risk, High Reward',
        infoLab: 'Arbitrage Calculator: Compares the cost of buying Crystalline Dust directly vs buying Ectos, Salvaging them (w/ Mystic Kit) to get dust. Often, salvaging is cheaper.',
        infoLiquidator: 'Inventory Scanner: Scans your "Material Storage" for piled up T5/T6 items you are not using. Suggests selling them to unlock liquid gold for investment.',
        infoRanking: 'Smart Ranking: Orders opportunities not just by ROI %, but by TOTAL PROFIT (Net Gold). Considers your available Spirit Shards and Materials.',
        infoGems: 'Currency Index: Shows the current price of 400 Gems in Gold. Use this to track if gold is losing value (inflation) and if you should buy gems.',
        riskLow: 'LOW', riskMed: 'MEDIUM', riskHigh: 'HIGH',
        timeShort: 'Hours', timeMed: 'Days', timeLong: 'Weeks',
        clickExpand: 'View Details',
        // New v15 Content
        profitTrain: 'Profit Train', trainDesc: 'Batch craft multiple items to maximize return.',
        shoppingList: 'Global Shopping List', trainSummary: 'Batch Summary',
        craftTop: 'Craft Top', craftAll: 'Craft All',
        // New v16 Content
        kilonovaTitle: 'KILONOVA FLIP SCANNER', kilonovaSub: 'Pure API Sync (GW2 V2)',
        scanNow: 'Scan Now', scanLoading: 'Scanning Account...',
        arbitrage: 'Market Arbitrage', flipProfit: 'Net Profit',
        buyPrice: 'Buy', sellTaxed: 'Sell (-15%)',
        stockStatus: 'Account Status', myStock: 'Global Stock (Bags/Bank)',
        chars: 'Characters', pureApi: 'Formula: (Sell * 0.85) - Buy',
        // New v17 Content
        oracleTitle: 'ACE ORACLE', oracleSub: 'Predictive Intelligence',
        bestPath: 'Best Path Now', bestRoute: 'Optimal Route',
        recomCraft: 'Crafting Opportunity', recomFlip: 'Flipping Opportunity',
        recomSalvage: 'Salvage Arbitrage',
        volatilitySafe: 'Volatile Market: Safety Recommended.',
        volatilityAggro: 'Stable Market: Kilonova Recommended.',
        volatilityMed: 'Normal Trend: Balanced Route.',
        // New v19 Content
        phandrelTitle: 'PHANDREL METHOD', phandrelSub: 'Liquid Gold (UnID Masterwork)',
        identifying: 'Critical Identification', salvaging: 'Selective Salvage',
        lucentMotes: 'Lucent Mats', stackProfit: 'Profit per 250',
        phandrelTip: 'Never salvage masterwork gear without identifying it first.',
        // v21 Daily Action Panel
        dailyAction: '🎯 DAILY ACTION', todayIs: 'Today is',
        buyNow: '1. BUY', craftNow: '2. CRAFT', sellNow: '3. SELL',
        fridayTip: '🔥 FRIDAY: More players online = more demand. Increase sell prices.',
        saturdayTip: '📈 SATURDAY: Peak activity. Craft and sell fast.',
        sundayTip: '⚠️ SUNDAY: Prepare for weekly reset. Buy cheap materials.',
        weekdayTip: '💼 WEEKDAY: Less competition. Good buy prices.',
        shardsAvailable: 'Shards Available', craftsWithShards: 'Possible Crafts',
        watchlist: '⭐ WATCHLIST', addToWatch: 'Add to Favorites',
        // v22 AutoTracker
        autoTracker: '🎯 AUTOTRACKER', step: 'STEP', of: 'of',
        stepBuy: 'BUY', stepCraft: 'CRAFT', stepSell: 'SELL',
        todayEarnings: 'Today\'s Earnings', sessionStart: 'Session Start',
        nextStep: 'Next Step', markDone: 'Mark Done ✓',
        dailyGoal: 'Daily Goal', progress: 'Progress',
        quickRoutes: 'Quick Routes', startRoute: 'Start'
    }
};

const MANUAL_CONTENT = {
    // ... (Same as before)
    es: {
        finance: [
            { title: "Liquidez 20%", content: "Mantén al menos 20% de tu patrimonio en oro líquido." },
            { title: "Amortización", content: "Calcula el breakeven antes de comprar lujos." },
            { title: "Sinergia de Reciclaje", content: "A veces es más barato destruir Ectos para obtener Polvo que comprar Polvo." }
        ],
        realtime: [
            { title: "Spread y Velocidad", content: "No solo mires el margen, mira qué tan rápido se vende." },
            { title: "Gemas", content: "Usa las gemas como reserva de valor a largo plazo." },
            { title: "Privacidad", content: "Tu llave API nunca sale de tu navegador. Auditoría abierta." }
        ],
        phandrel: [
            { title: "Adquisición Volumen", content: "Pedidos de compra masivos de noche (horario volumen). El valor recuperado es superior al coste." },
            { title: "Identificación Crítica", content: "NUNCA recicles verdes directo. Tienes un 4% de upgrade a Raro/Exótico (Ectos)." },
            { title: "Reciclaje Selectivo", content: "Autorrecicladora de Runas en Verdes (Materiales Lúcidos). Místico/Plata en Amarillos." },
            { title: "Gestión de Suerte", content: "Refina suerte a Exótico. Cámbiala por Sacos Rojos en Año Nuevo Lunar." }
        ],
        flipMastery: [
            { title: "Velocidad de Mercado", content: "Items con mucho margen (como T6) son arriesgados si la rotación es baja." },
            { title: "Estrategia de Puja", content: "Solo sobrepuja por 1 moneda de cobre. Reventar el precio destruye el margen de todos." },
            { title: "Cálculo de Comisiones", content: "El TP cobra un 15% total. El margen debe ser superior al 15% para dar beneficios." }
        ]
    },
    en: {
        finance: [
            { title: "20% Liquidity", content: "Keep at least 20% of your wealth in liquid gold." },
            { title: "Amortization", content: "Calculate breakeven before buying luxuries." },
            { title: "Salvage Synergy", content: "Sometimes it's cheaper to destroy Ectos for Dust than to buy Dust." }
        ],
        realtime: [
            { title: "Spread & Velocity", content: "Don't just look at margin, check sale velocity." },
            { title: "Gems", content: "Use gems as a long-term store of value." },
            { title: "Privacy", content: "Your API key never leaves your browser. Open audit." }
        ],
        phandrel: [
            { title: "Volume Acquisition", content: "Place bulk buy orders at night. Value recovered exceeds purchase + salvage cost." },
            { title: "Identification", content: "Never salvage greens directly. Identification has a 4% chance of upgrading to Rare/Exotic (Ectoplasms)." },
            { title: "Salvage Choice", content: "Use Runecrafter's for Greens (Lucent Motes). Use Mystic/Silver-Fed for Yellows." },
            { title: "Luck Management", content: "Refine luck to Exotic. Exchange for Red Envelopes during Lunar New Year." }
        ],
        flipMastery: [
            { title: "Market Velocity", content: "High spread items (like T6) are risky if velocity is low. Check daily volumes." },
            { title: "Order Undercutting", content: "Only undercut by 1 copper. Crushing the price hurts everyone's profit." },
            { title: "Tax Calculation", content: "The TP takes 15% (10% on sale, 5% on listing). Margins must be > 15% to break even." }
        ]
    }
};

// --- ITEM DATA --- (Same as before)
const ITEM_DATA = {
    // T6 Materials
    24295: { name: { es: 'Colmillo Vicioso', en: 'Vicious Fang' }, wiki: 'Vicious_Fang', t5: 24294, desc: { es: 'Alta demanda en legendarias.', en: 'High demand for legendaries.' } },
    24357: { name: { es: 'Escama Blindada', en: 'Armored Scale' }, wiki: 'Armored_Scale', t5: 24356, desc: { es: 'Mercado estable, volumen medio.', en: 'Stable market, medium volume.' } },
    24289: { name: { es: 'Garra Viciosa', en: 'Vicious Claw' }, wiki: 'Vicious_Claw', t5: 24288, desc: { es: 'Rápida rotación en TP.', en: 'Fast rotation on TP.' } },
    24351: { name: { es: 'Hueso Antiguo', en: 'Ancient Bone' }, wiki: 'Ancient_Bone', t5: 24350, desc: { es: 'Oferta abundante, margen seguro.', en: 'Abundant supply, safe margin.' } },
    24283: { name: { es: 'Polvo Cristalino', en: 'Crystalline Dust' }, wiki: 'Pile_of_Crystalline_Dust', t5: 24282, desc: { es: 'Esencial para Mystic Clover.', en: 'Essential for Mystic Clovers.' } },
    24299: { name: { es: 'Tótem Elaborado', en: 'Elaborate Totem' }, wiki: 'Elaborate_Totem', t5: 24298, desc: { es: 'Suele tener el precio unitario más alto.', en: 'Usually highest unit price.' } },
    24341: { name: { es: 'Veneno Poderoso', en: 'Powerful Venom Sac' }, wiki: 'Powerful_Venom_Sac', t5: 24340, desc: { es: 'Mercado de nicho, cuidado.', en: 'Niche market, careful.' } },
    24358: { name: { es: 'Sangre Poderosa', en: 'Powerful Blood' }, wiki: 'Vial_of_Powerful_Blood', t5: 24357, desc: { es: 'Líder en volumen de trading.', en: 'Leader in trading volume.' } },
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
    19976: { name: { es: 'Moneda Mística', en: 'Mystic Coin' }, wiki: 'Mystic_Coin' },
    // v19 Phandrel Items
    89204: { name: { es: 'Equipo Excepcional (Verde)', en: 'Unid. Masterwork Gear' }, wiki: 'Piece_of_Masterwork_Unidentified_Gear' },
    86408: { name: { es: 'Amuleto de Habilidad', en: 'Charm of Skill' }, wiki: 'Charm_of_Skill' },
    86435: { name: { es: 'Símbolo de Control', en: 'Symbol of Control' }, wiki: 'Symbol_of_Control' },
    86423: { name: { es: 'Mota Lúcida', en: 'Lucent Mote' }, wiki: 'Lucent_Mote' }
};
const ESSENTIALS = { ECTO: 19721, MYSTIC_COIN: 19976, CRYSTALLINE_DUST: 24277, SPIRIT_SHARD: 23, UNID_GREEN: 89204 };
const T6_IDS = [24295, 24357, 24289, 24351, 24283, 24299, 24341, 24358];
const ALL_IDS = [...Object.keys(ITEM_DATA).map(Number), ...T6_IDS.map(id => ITEM_DATA[id]?.t5).filter(Boolean)];
const ALL_LISTING_IDS = [...T6_IDS, ESSENTIALS.ECTO, ESSENTIALS.MYSTIC_COIN, ESSENTIALS.UNID_GREEN, 86423, 86435, 86408];
const TREND_KEY = 'ace_trend_v1';

// --- KILONOVA SCANNER DATA ---
const KILONOVA_IDS = [24295, 24358, 24289, 24277, 19721, 19976, 44941];
const KILONOVA_NAMES = {
    24295: "Colmillo Vicioso (T6)",
    24358: "Sangre Poderosa (T6)",
    24289: "Escama Blindada (T6)",
    24277: "Polvo Cristalino (T6)",
    19721: "Ectoplasma",
    19976: "Moneda Mística",
    44941: "Engranaje de Mecanismo"
};

const getWikiUrl = (slug) => `https://wiki.guildwars2.com/wiki/${slug}`;
const getItemName = (id, lang) => ITEM_DATA[id]?.name?.[lang] || ITEM_DATA[id]?.name?.en || `Item ${id}`;
const getItemDesc = (id, lang) => ITEM_DATA[id]?.desc?.[lang] || ITEM_DATA[id]?.desc?.en || '';
const formatGold = (c) => { if (!c && c !== 0) return "---"; const a = Math.abs(c); return <span className="font-mono tracking-tight">{Math.floor(a / 10000)}<span className="text-amber-400 text-lg mx-0.5">g</span>{Math.floor((a % 10000) / 100)}<span className="text-zinc-500 text-lg mx-0.5">s</span></span>; };

const ManualModal = ({ onClose, lang }) => {
    const t = LANG[lang]; const content = MANUAL_CONTENT[lang];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/95 backdrop-blur-md">
            <div className="bg-zinc-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-600">
                <div className="bg-zinc-900 px-8 py-6 border-b border-zinc-700 flex justify-between items-center"><h2 className="text-3xl font-black text-zinc-100 flex items-center gap-3"><BookOpen className="text-amber-500 w-8 h-8" /> {t.manual}</h2><button onClick={onClose} className="p-3 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors bg-zinc-800 border border-zinc-600"><X size={28} /></button></div>
                <div className="overflow-y-auto p-8 space-y-10">
                    <div><h3 className="text-2xl font-bold text-zinc-200 mb-6 flex items-center gap-3 border-b border-zinc-700 pb-2"><Target className="text-emerald-400 w-6 h-6" /> {t.finance}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{content.finance.map((item, i) => <div key={i} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-700"><h4 className="font-bold text-zinc-100 text-lg mb-2">{item.title}</h4><p className="text-base text-zinc-400">{item.content}</p></div>)}</div></div>
                    <div><h3 className="text-2xl font-bold text-zinc-200 mb-6 flex items-center gap-3 border-b border-zinc-700 pb-2"><Database className="text-emerald-400 w-6 h-6" /> {t.securityTitle}</h3><p className="text-zinc-400 text-lg mb-4">{t.securityText}</p><div className="flex gap-4"><div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-xl border border-zinc-700"><Lock size={20} className="text-emerald-400" /><span>{t.securityServer}</span></div><div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-xl border border-zinc-700"><Eye size={20} className="text-indigo-400" /><span>{t.securityScope}</span></div><div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-xl border border-zinc-700"><FileCode size={20} className="text-amber-400" /><span>{t.securityOpen}</span></div></div></div>
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-200 mb-6 flex items-center gap-3 border-b border-zinc-700 pb-2"><TrendingUp className="text-emerald-500 w-6 h-6" /> {lang === 'es' ? 'Maestría Flip' : 'Flip Mastery'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.flipMastery.map((item, i) => (
                                <div key={i} className="bg-zinc-950/40 p-6 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                                    <h4 className="font-bold text-emerald-500 text-lg mb-2">{item.title}</h4>
                                    <p className="text-base text-zinc-400">{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-zinc-200 mb-6 flex items-center gap-3 border-b border-zinc-700 pb-2"><Zap className="text-amber-500 w-6 h-6" /> {t.phandrelTitle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.phandrel.map((item, i) => (
                                <div key={i} className="bg-zinc-950/40 p-6 rounded-2xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                                    <h4 className="font-bold text-amber-500 text-lg mb-2">{item.title}</h4>
                                    <p className="text-base text-zinc-400">{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SecurityModal = ({ onClose, onSave, lang }) => {
    const t = LANG[lang];
    const [key, setKey] = useState('');
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/98 backdrop-blur-xl">
            <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-700 relative">
                <div className="p-8">
                    <div className="flex justify-center mb-6"><div className="bg-emerald-500/10 p-4 rounded-full"><ShieldCheck size={48} className="text-emerald-400" /></div></div>
                    <h2 className="text-2xl font-black text-center text-white mb-2">{t.securityTitle}</h2>
                    <p className="text-center text-zinc-400 mb-8">{t.securityText}</p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800"><Cpu size={24} className="text-zinc-500" /><div className="flex-1"><h4 className="font-bold text-zinc-200">{t.securityServer}</h4><p className="text-xs text-zinc-500">{t.securityServerDesc}</p></div></div>
                        <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800"><Eye size={24} className="text-indigo-500" /><div className="flex-1"><h4 className="font-bold text-zinc-200">{t.securityScope}</h4><p className="text-xs text-zinc-500">{t.securityScopeDesc}</p></div></div>
                        <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800"><Github size={24} className="text-white" /><div className="flex-1"><h4 className="font-bold text-zinc-200">{t.securityOpen}</h4><p className="text-xs text-zinc-500">{t.securityOpenDesc}</p></div></div>
                    </div>

                    <input type="text" placeholder="Paste your API Key here (account, wallet, inventories)" className="w-full bg-zinc-950 border-2 border-zinc-700 rounded-xl px-4 py-4 text-center text-white font-mono focus:border-emerald-500 focus:outline-none mb-6" value={key} onChange={(e) => setKey(e.target.value)} autoFocus />

                    <button onClick={() => onSave(key)} disabled={key.length < 10} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold p-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20">{t.saveKey}</button>
                    <button onClick={onClose} className="w-full mt-4 text-zinc-500 hover:text-zinc-300 text-sm font-bold">Cancel / Use Demo Mode</button>
                </div>
            </div>
        </div>
    );
};

const InfoToolTip = ({ content }) => {
    return (
        <div className="group relative inline-block ml-2 align-middle">
            <HelpCircle size={14} className="text-zinc-600 hover:text-amber-500 cursor-help transition-colors" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 text-zinc-300 text-xs rounded-xl border border-zinc-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900"></div>
            </div>
        </div>
    );
};

const KilonovaScanner = ({ data, loading, onScan, lang }) => {
    const t = LANG[lang];
    if (!data && !loading) return (
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl text-center border-2 border-violet-500/20 shadow-2xl">
            <h2 className="text-2xl font-black italic text-violet-400 mb-4 tracking-tighter uppercase">{t.kilonovaTitle}</h2>
            <button onClick={onScan} className="bg-violet-600 hover:bg-violet-500 text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-lg shadow-violet-900/40">{t.scanNow}</button>
        </div>
    );

    return (
        <div className="bg-slate-950/80 backdrop-blur-2xl p-8 rounded-3xl border-2 border-violet-500/20 relative overflow-hidden shadow-2xl">
            {loading && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-fuchsia-400 font-black text-xs uppercase tracking-[0.3em] font-mono">{t.scanLoading}</span>
            </div>}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-black italic text-violet-400 tracking-tighter uppercase">{t.kilonovaTitle}</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">{t.kilonovaSub}</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 shadow-inner">
                        <span className="text-[10px] text-zinc-500 font-black uppercase block mb-1 tracking-widest">{t.gold}</span>
                        <div className="font-mono text-sm text-white font-bold">{data?.gold || '---'}</div>
                    </div>
                    <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 text-center shadow-inner">
                        <span className="text-[10px] text-zinc-500 font-black uppercase block mb-1 tracking-widest">{t.chars}</span>
                        <div className="text-sm text-zinc-300 font-bold">{data?.charCount || 0}</div>
                    </div>
                    <button onClick={onScan} className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl transition-all border border-zinc-700 text-violet-400 shadow-lg"><RefreshCcw size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 bg-violet-500/5 p-6 rounded-2xl border border-violet-500/10 shadow-inner">
                    <h3 className="text-[10px] font-black uppercase text-violet-400 mb-6 tracking-[0.2em] flex items-center gap-2"><Database size={14} /> {t.myStock}</h3>
                    <div className="space-y-3">
                        {data?.stock?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-xs p-3 bg-zinc-950/40 rounded-xl border border-zinc-800 hover:border-violet-500/30 transition-colors">
                                <span className="text-zinc-400 font-medium">{item.name}</span>
                                <span className="font-bold text-white font-mono">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black uppercase tracking-tight text-white">{t.arbitrage}</h3>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t.pureApi}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">
                                    <th className="pb-4">{t.recipe}</th>
                                    <th className="pb-4">{t.buyPrice}</th>
                                    <th className="pb-4">{t.sellTaxed}</th>
                                    <th className="pb-4 text-right">{t.flipProfit}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/30">
                                {data?.flips?.map((f, i) => (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 font-bold text-xs text-zinc-300 group-hover:text-amber-400">{f.name}</td>
                                        <td className="py-4 font-mono text-[10px] text-zinc-400">{f.buy}</td>
                                        <td className="py-4 font-mono text-[10px] text-zinc-400">{f.afterTax}</td>
                                        <td className={`py-4 text-right font-mono text-xs font-bold ${f.profitVal > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{f.profit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OracleBar = ({ alpha, route, lang }) => {
    const t = LANG[lang];
    if (!alpha) return null;

    const Icon = alpha.type === 'craft' ? Activity : alpha.type === 'flip' ? TrendingUp : Recycle;

    return (
        <div className="mb-10 animate-in slide-in-from-top-4 duration-700">
            <div className="bg-gradient-to-r from-amber-600/20 via-zinc-900 to-indigo-900/20 border-2 border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-900/10 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-6 z-10">
                    <div className="bg-amber-500 p-4 rounded-2xl shadow-lg shadow-amber-950/50">
                        <Sparkles className="text-black w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tighter uppercase leading-none mb-1">
                            {t.oracleTitle} <span className="text-amber-500 font-normal opacity-50">// 161914</span>
                        </h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">{t.oracleSub}</p>
                    </div>
                </div>

                <div className="h-12 w-px bg-zinc-800 hidden lg:block"></div>

                <div className="flex-1 flex flex-col md:flex-row items-center gap-8 z-10 w-full lg:w-auto">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-2">{t.bestPath}</span>
                        <div className="flex items-center gap-3 bg-zinc-950/50 px-4 py-2 rounded-xl border border-zinc-800">
                            <Icon size={18} className="text-amber-400" />
                            <span className="text-sm font-bold text-white uppercase">{alpha.label}</span>
                            <span className="text-emerald-400 font-mono font-black">{alpha.profit}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">{t.bestRoute}</span>
                        <div className="flex items-center gap-3 bg-zinc-950/50 px-4 py-2 rounded-xl border border-indigo-900/30">
                            <Target size={18} className="text-indigo-400" />
                            <span className="text-sm font-bold text-indigo-300 uppercase">{route.label}</span>
                            <span className="text-[10px] text-zinc-500 font-medium italic hidden sm:inline-block">{route.reason}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EliteList = ({ opportunities, flips, recycle, lang }) => {
    const t = LANG[lang];

    const alphaItems = useMemo(() => {
        const items = [];
        opportunities.forEach(o => items.push({ type: 'CRAFT', name: getItemName(o.id, lang), profit: o.potentialProfit, profitFormatted: formatGold(o.potentialProfit), roi: o.roi }));
        flips?.forEach(f => items.push({ type: 'FLIP', name: f.name, profit: f.profitVal, profitFormatted: f.profit, roi: 0 }));
        if (recycle?.isCheaper) items.push({ type: 'SALVAGE', name: t.recomSalvage, profit: 1000, profitFormatted: `${recycle.savingPct.toFixed(1)}%`, roi: recycle.savingPct });

        return items.sort((a, b) => b.profit - a.profit).slice(0, 10);
    }, [opportunities, flips, recycle, lang, t]);

    return (
        <div className="bg-zinc-950/80 border-2 border-amber-500/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl mb-12">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
                <h2 className="text-2xl font-black text-amber-500 italic tracking-tighter uppercase flex items-center gap-3"><Flame className="text-amber-500 animate-pulse" /> THE ELITE LIST</h2>
                <span className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">Top 10 Actions Global</span>
            </div>
            <div className="space-y-4">
                {alphaItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 hover:border-amber-500/40 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-zinc-600 font-mono w-4">{i + 1}</span>
                            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 group-hover:border-amber-500/20 text-[10px] font-black tracking-widest text-amber-500/70">{item.type}</div>
                            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{item.name}</span>
                        </div>
                        <div className="text-right">
                            <div className="font-mono text-sm font-black text-emerald-400">{item.profitFormatted}</div>
                            {item.roi > 0 && <span className="text-[10px] text-zinc-500 font-bold">ROI: {item.roi.toFixed(1)}%</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PhandrelProtocol = ({ prices, lang }) => {
    const t = LANG[lang];

    const stats = useMemo(() => {
        const green = prices[ESSENTIALS.UNID_GREEN];
        const mote = prices[86423];
        const ecto = prices[ESSENTIALS.ECTO];

        // If data is missing, use defaults or don't render profit
        if (!green) return null;

        const greenBuy = green.buys.unit_price;
        const moteSell = mote?.sells?.unit_price || 65;
        const ectoSell = ecto?.sells?.unit_price || 2000;

        const salvageCost = 30;
        // ~2 Motes (85% tax) + ~0.04 Ecto (85% tax)
        const yieldValue = (2 * moteSell * 0.85) + (0.04 * ectoSell * 0.85);
        const netProfit = yieldValue - (greenBuy + salvageCost);
        const roi = (netProfit / (greenBuy + salvageCost)) * 100;

        return { netProfit, roi, buyPrice: greenBuy, yieldValue };
    }, [prices]);

    if (!stats) return null;

    return (
        <div className="bg-zinc-950/80 border border-amber-500/20 rounded-3xl p-6 shadow-2xl backdrop-blur-xl mb-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Zap size={80} className="text-amber-500 rotate-12" />
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-500 p-3 rounded-xl shadow-lg shadow-amber-950/50">
                        <Coins className="text-black w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-tight">{t.phandrelTitle}</h2>
                        <p className="text-xs text-amber-500 font-bold opacity-80">{t.phandrelSub}</p>
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="text-center">
                        <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">{t.profit}</p>
                        <p className={`text-lg font-mono font-black ${stats.netProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stats.netProfit > 0 ? '+' : ''}{formatGold(stats.netProfit)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">ROI %</p>
                        <p className={`text-lg font-mono font-black ${stats.roi > 8 ? 'text-amber-400' : 'text-zinc-300'}`}>
                            {stats.roi.toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-center bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
                        <p className="text-[10px] text-amber-500/70 uppercase font-black mb-1">{t.stackProfit}</p>
                        <div className="text-lg text-white font-mono font-black">{formatGold(stats.netProfit * 250)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// v21 CORE - Next Action (SIMPLE + FOCUSED)
const NextAction = ({ opportunities, gold, lang, onRefresh, loading }) => {
    const top = opportunities[0];

    // Loading or no data state
    if (loading || !top || !top.id) {
        return (
            <div className="bg-gradient-to-r from-violet-950/80 to-fuchsia-950/60 border border-fuchsia-500/40 rounded-2xl p-5 mb-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-fuchsia-600 p-2.5 rounded-xl animate-pulse"><Target size={20} className="text-white" /></div>
                        <div>
                            <p className="text-[10px] text-fuchsia-400 font-black uppercase">{lang === 'es' ? 'CARGANDO...' : 'LOADING...'}</p>
                            <p className="text-sm text-zinc-500">{lang === 'es' ? 'Analizando mercado...' : 'Analyzing market...'}</p>
                        </div>
                    </div>
                    <button onClick={onRefresh} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-violet-400">
                        <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>
        );
    }

    const affordable = opportunities.filter(o => gold >= o.totalCost);
    const best = affordable[0] || top;
    const canAfford = gold >= best.totalCost;
    const t5Name = getItemName(best.t5Id, lang) || 'T5 Mat';
    const t6Name = getItemName(best.id, lang) || 'T6 Mat';
    const qty = best.chosen || 1;
    const profit = best.potentialProfit || 0;

    // Strategy type
    const strategy = best.synergy ? (lang === 'es' ? '♻️ RECICLAJE' : '♻️ RECYCLE')
        : profit > 50000 ? (lang === 'es' ? '🔥 ALTA GANANCIA' : '🔥 HIGH PROFIT')
            : (lang === 'es' ? '📈 CRAFTEO T5→T6' : '📈 CRAFT T5→T6');

    return (
        <div className="bg-gradient-to-r from-violet-950/80 to-fuchsia-950/60 border border-fuchsia-500/40 rounded-2xl p-5 mb-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-fuchsia-600 p-2.5 rounded-xl"><Target size={20} className="text-white" /></div>
                    <div>
                        <p className="text-[10px] text-fuchsia-400 font-black uppercase">{strategy}</p>
                        <h2 className="text-xl font-black text-white">{t6Name}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm bg-zinc-950/40 px-4 py-2 rounded-xl">
                    <span className="text-blue-400 font-medium">{lang === 'es' ? 'Compra' : 'Buy'} {t5Name}</span>
                    <span className="text-fuchsia-500 font-black">→</span>
                    <span className="text-violet-400 font-bold">{lang === 'es' ? 'Craftea' : 'Craft'} x{qty}</span>
                    <span className="text-fuchsia-500 font-black">→</span>
                    <span className="text-emerald-400 font-black text-lg">{formatGold(profit)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${canAfford ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {canAfford ? (lang === 'es' ? '✓ LISTO' : '✓ READY') : (lang === 'es' ? '✗ FALTA ORO' : '✗ NEED GOLD')}
                    </span>
                    <button onClick={onRefresh} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-violet-400">
                        <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// v23 AUTOTRACKER - Complete Gold Guide with Investment Modes
const AutoTracker = ({ opportunities, gold, lang, onRefresh, loading }) => {
    const t = LANG[lang];
    const [currentStep, setCurrentStep] = useState(1);
    const [mode, setMode] = useState(() => localStorage.getItem('ace_mode') || 'balanced'); // safe, balanced, aggro
    const [sessionEarnings, setSessionEarnings] = useState(() => parseInt(localStorage.getItem('ace_session_earnings') || '0'));

    const top = opportunities[0];
    if (!top || !top.id) {
        return (
            <div className="bg-gradient-to-br from-violet-950 to-zinc-900 border-2 border-fuchsia-500/30 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-fuchsia-400 font-bold">{lang === 'es' ? 'Analizando mercado...' : 'Analyzing market...'}</p>
                </div>
            </div>
        );
    }

    // Investment calculation based on mode
    const investmentRatios = { safe: 0.1, balanced: 0.25, aggro: 0.5 }; // 10%, 25%, 50% of gold
    const investmentAmount = Math.floor(gold * investmentRatios[mode]);

    // Calculate how many crafts we can do with this investment
    const unitCost = (top.totalCost || 1) / (top.chosen || 1); // Cost per single craft
    const craftableUnits = unitCost > 0 ? Math.max(1, Math.floor(investmentAmount / unitCost) || 1) : 1;
    const actualCost = Math.floor(craftableUnits * unitCost) || 0;
    const expectedProfit = Math.floor(((top.potentialProfit || 0) / (top.chosen || 1)) * craftableUnits) || 0;

    const t5Name = getItemName(top.t5Id, lang);
    const t6Name = getItemName(top.id, lang);

    const modeConfig = {
        safe: { label: lang === 'es' ? '🛡️ SEGURO' : '🛡️ SAFE', color: 'emerald', desc: lang === 'es' ? '10% de tu oro' : '10% of your gold' },
        balanced: { label: lang === 'es' ? '⚖️ BALANCEADO' : '⚖️ BALANCED', color: 'violet', desc: lang === 'es' ? '25% de tu oro' : '25% of your gold' },
        aggro: { label: lang === 'es' ? '🔥 AGRESIVO' : '🔥 AGGRESSIVE', color: 'red', desc: lang === 'es' ? '50% de tu oro' : '50% of your gold' }
    };

    const steps = [
        { id: 1, label: t.stepBuy, action: `${t5Name}`, qty: `x${craftableUnits * 50}`, color: 'blue' },
        { id: 2, label: t.stepCraft, action: `${t6Name}`, qty: `x${craftableUnits}`, color: 'violet' },
        { id: 3, label: t.stepSell, action: formatGold(expectedProfit), qty: lang === 'es' ? 'GANANCIA' : 'PROFIT', color: 'emerald' }
    ];

    const changeMode = (newMode) => {
        setMode(newMode);
        localStorage.setItem('ace_mode', newMode);
    };

    const markStepDone = () => {
        if (currentStep === 3) {
            const newEarnings = sessionEarnings + expectedProfit;
            setSessionEarnings(newEarnings);
            localStorage.setItem('ace_session_earnings', newEarnings.toString());
            setCurrentStep(1);
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const resetSession = () => {
        setSessionEarnings(0);
        localStorage.setItem('ace_session_earnings', '0');
    };

    return (
        <div className="bg-gradient-to-br from-violet-950 to-zinc-900 border-2 border-fuchsia-500/30 rounded-3xl p-6 shadow-2xl">
            {/* Header with Gold */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-fuchsia-600 p-3 rounded-xl"><Target size={28} className="text-white" /></div>
                    <div>
                        <h2 className="text-2xl font-black text-white">{t.autoTracker}</h2>
                        <p className="text-xs text-zinc-500">{t.step} {currentStep} {t.of} 3 • {modeConfig[mode].label}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl">
                        <p className="text-[10px] text-amber-400 uppercase font-bold">{lang === 'es' ? 'TU ORO' : 'YOUR GOLD'}</p>
                        <p className="text-xl font-mono font-black text-amber-400">{formatGold(gold)}</p>
                    </div>
                    <button onClick={onRefresh} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-fuchsia-400">
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 mb-6">
                {Object.entries(modeConfig).map(([key, cfg]) => (
                    <button key={key} onClick={() => changeMode(key)} className={`flex-1 p-3 rounded-xl border-2 transition-all ${mode === key ? `bg-${cfg.color}-500/20 border-${cfg.color}-500 text-${cfg.color}-400` : 'bg-zinc-950/40 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                        <p className="font-black text-sm">{cfg.label}</p>
                        <p className="text-[10px] opacity-70">{cfg.desc}</p>
                    </button>
                ))}
            </div>

            {/* Investment Summary */}
            <div className="bg-zinc-950/60 rounded-2xl p-4 mb-6 border border-zinc-800">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">{lang === 'es' ? 'INVERSIÓN' : 'INVESTMENT'}</p>
                        <p className="text-2xl font-black text-white">{formatGold(actualCost)}</p>
                    </div>
                    <div className="text-fuchsia-500 text-3xl">→</div>
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">{lang === 'es' ? 'CRAFTEOS' : 'CRAFTS'}</p>
                        <p className="text-2xl font-black text-violet-400">x{craftableUnits}</p>
                    </div>
                    <div className="text-fuchsia-500 text-3xl">→</div>
                    <div>
                        <p className="text-[10px] text-emerald-400 uppercase font-bold">{lang === 'es' ? 'GANANCIA' : 'PROFIT'}</p>
                        <p className="text-2xl font-black text-emerald-400">{formatGold(expectedProfit)}</p>
                    </div>
                </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {steps.map(step => (
                    <div key={step.id} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${currentStep === step.id ? 'bg-fuchsia-500/20 border-fuchsia-500' : currentStep > step.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-zinc-950/40 border-zinc-800 opacity-50'}`} onClick={() => setCurrentStep(step.id)}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black ${currentStep > step.id ? 'bg-emerald-500 text-white' : currentStep === step.id ? 'bg-fuchsia-500 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
                                {currentStep > step.id ? '✓' : step.id}
                            </span>
                            <span className={`text-xs font-black uppercase ${currentStep === step.id ? 'text-fuchsia-400' : currentStep > step.id ? 'text-emerald-400' : 'text-zinc-500'}`}>{step.label}</span>
                        </div>
                        <p className="text-white font-bold">{step.action}</p>
                        <p className="text-xs text-zinc-500">{step.qty}</p>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <button onClick={markStepDone} className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-black py-4 rounded-2xl text-lg transition-all shadow-lg shadow-fuchsia-900/50 mb-4">
                {currentStep === 3 ? (lang === 'es' ? '✓ COMPLETAR Y SIGUIENTE' : '✓ COMPLETE & NEXT') : t.markDone}
            </button>

            {/* Session Stats */}
            <div className="flex justify-between items-center bg-zinc-950/40 rounded-xl p-3 border border-zinc-800">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase">{t.todayEarnings}</p>
                    <p className="text-lg font-mono font-black text-emerald-400">{formatGold(sessionEarnings)}</p>
                </div>
                <button onClick={resetSession} className="text-xs text-zinc-600 hover:text-red-400 transition-colors">{lang === 'es' ? 'Reiniciar' : 'Reset'}</button>
            </div>
        </div>
    );
};

// --- APP ---
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
    const [expandedRoute, setExpandedRoute] = useState(null); // 'safe', 'balanced', 'aggro'
    const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem('ace_watchlist') || '[]'));
    const toggleWatch = (id) => {
        const newList = watchlist.includes(id) ? watchlist.filter(x => x !== id) : [...watchlist, id];
        setWatchlist(newList);
        localStorage.setItem('ace_watchlist', JSON.stringify(newList));
    };
    const [expandedId, setExpandedId] = useState(null);
    const [customIterations, setCustomIterations] = useState({});
    const [auditLog, setAuditLog] = useState([{ agent: "ACE", msg: "v15 Train Init", type: "info" }]);
    const [gems, setGems] = useState({ coins_per_gem: 0 });
    const [trainCount, setTrainCount] = useState(0); // 0 = disabled, 3, 5, 8
    const [kilonovaData, setKilonovaData] = useState(null);
    const [kiloLoading, setKiloLoading] = useState(false);

    const t = LANG[lang];
    const toggleLang = () => { const newLang = lang === 'es' ? 'en' : 'es'; setLang(newLang); localStorage.setItem('ace_lang', newLang); };

    const addAudit = useCallback((agent, msg, type = "info") => { setAuditLog(prev => [{ agent, msg, time: new Date().toLocaleTimeString('es-ES', { hour12: false }), type }, ...prev.slice(0, 6)]); }, []);

    const fetchMarketData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [priceRes, listingRes, gemRes] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${ALL_IDS.join(',')}`),
                fetch(`https://api.guildwars2.com/v2/commerce/listings?ids=${ALL_LISTING_IDS.join(',')}`),
                fetch(`https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=1000000`)
            ]);
            const priceData = await priceRes.json();
            const listingData = await listingRes.json();
            const gemData = await gemRes.json();

            const priceMap = {}; priceData.forEach(p => priceMap[p.id] = p);
            const listingMap = {}; listingData.forEach(l => { listingMap[l.id] = { ...l, supply: l.sells?.slice(0, 10).reduce((a, c) => a + c.quantity, 0) || 0 }; });

            setPrices(priceMap);
            setListings(listingMap);
            setGems(gemData);

            addAudit("Market", "Data Sync + Gems", "success");
        } catch (e) { console.error(e); } finally { if (!silent) setLoading(false); }
    }, [addAudit]);

    const fetchUserData = useCallback(async () => {
        if (!apiKey) return;
        try {
            const [walletRes, matsRes, bankRes] = await Promise.all([fetch(`https://api.guildwars2.com/v2/account/wallet?access_token=${apiKey}`), fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${apiKey}`), fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${apiKey}`)]);
            const [wallet, mats, bank] = await Promise.all([walletRes.json(), matsRes.json(), bankRes.json()]);
            const walletMap = {}; wallet.forEach(c => walletMap[c.id] = c.value);
            const matsMap = {}; mats.forEach(m => matsMap[m.id] = (matsMap[m.id] || 0) + m.count);
            bank.forEach(item => { if (item) matsMap[item.id] = (matsMap[item.id] || 0) + item.count; });
            setUserData({ wallet: walletMap, materials: matsMap });
            addAudit("Account", "Sync OK", "success");
        } catch (e) { }
    }, [apiKey, addAudit]);

    const runKilonovaScan = async () => {
        if (!apiKey) { setShowKeyInput(true); return; }
        setKiloLoading(true);
        addAudit("Kilonova", "Deep Scan Started", "info");
        try {
            // 1. Gold from Wallet
            const walletRes = await fetch(`https://api.guildwars2.com/v2/account/wallet?access_token=${apiKey}`);
            const wallet = await walletRes.json();
            const goldVal = wallet.find(c => c.id === 1)?.value || 0;
            const goldText = <span>{Math.floor(goldVal / 10000)}<span className="text-amber-500 mx-0.5">g</span>{Math.floor((goldVal % 10000) / 100)}<span className="text-zinc-500 mx-0.5">s</span></span>;

            // 2. Deep Inventory (Chars + Bank)
            const [charIdsRes, bankRes] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/characters?access_token=${apiKey}`),
                fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${apiKey}`)
            ]);
            const charIds = await charIdsRes.json();
            const bank = await bankRes.json();

            const charsRes = await fetch(`https://api.guildwars2.com/v2/characters?access_token=${apiKey}&ids=${charIds.join(',')}`);
            const chars = await charsRes.json();

            const inventoryCounts = {};
            KILONOVA_IDS.forEach(id => inventoryCounts[id] = 0);

            bank.forEach(item => { if (item && inventoryCounts[item.id] !== undefined) inventoryCounts[item.id] += item.count; });
            chars.forEach(char => {
                char.bags.forEach(bag => {
                    if (bag) bag.inventory.forEach(item => {
                        if (item && inventoryCounts[item.id] !== undefined) inventoryCounts[item.id] += item.count;
                    });
                });
            });

            // 3. Pricing
            const priceRes = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${KILONOVA_IDS.join(',')}`);
            const priceData = await priceRes.json();

            const flips = priceData.map(p => {
                const buy = p.buys.unit_price;
                const sell = p.sells.unit_price;
                const afterTax = Math.floor(sell * 0.85);
                const netProfit = afterTax - buy;
                return {
                    name: KILONOVA_NAMES[p.id],
                    buy: <span>{Math.floor(buy / 10000)}g {Math.floor((buy % 10000) / 100)}s</span>,
                    afterTax: <span>{Math.floor(afterTax / 10000)}g {Math.floor((afterTax % 10000) / 100)}s</span>,
                    profit: <span>{netProfit > 0 ? '+' : ''}{Math.floor(netProfit / 10000)}g {Math.floor((Math.abs(netProfit) % 10000) / 100)}s</span>,
                    profitVal: netProfit
                };
            });

            setKilonovaData({
                gold: goldText,
                charCount: charIds.length,
                stock: KILONOVA_IDS.map(id => ({ name: KILONOVA_NAMES[id], count: inventoryCounts[id] })).filter(x => x.count > 0),
                flips
            });
            addAudit("Kilonova", "Deep Scan Complete", "success");
        } catch (e) {
            console.error(e);
            addAudit("Kilonova", "Scan Error", "error");
        } finally {
            setKiloLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
        if (apiKey) {
            fetchUserData();
            runKilonovaScan();
        }
    }, [fetchMarketData, fetchUserData, apiKey]);

    // --- RECYCLING CALCULATOR ---
    const recycleStats = useMemo(() => {
        if (!prices[ESSENTIALS.ECTO] || !prices[ESSENTIALS.CRYSTALLINE_DUST]) return null;
        const ectoBuy = prices[ESSENTIALS.ECTO].buys.unit_price;
        const dustBuy = prices[ESSENTIALS.CRYSTALLINE_DUST].buys.unit_price;
        const avgDustPerEcto = 1.85;
        const costPerDustExEcto = ectoBuy / avgDustPerEcto;
        const savingPct = ((dustBuy - costPerDustExEcto) / dustBuy) * 100;
        return { dustBuy, costPerDustExEcto, savingPct, isCheaper: savingPct > 5 };
    }, [prices]);

    const opportunities = useMemo(() => {
        const ops = [];
        T6_IDS.forEach(t6Id => {
            const item = ITEM_DATA[t6Id]; const t6 = prices[t6Id]; const t5 = prices[item.t5];
            const dustPrice = recycleStats?.isCheaper ? recycleStats.costPerDustExEcto : prices[ESSENTIALS.CRYSTALLINE_DUST]?.buys?.unit_price;
            if (!t6 || !t5 || !dustPrice) return;

            const cost = (50 * t5.buys.unit_price) + (1 * t6.buys.unit_price) + (5 * dustPrice);
            const revenue = (6.85 * t6.sells.unit_price) * 0.85;
            const profit = revenue - cost;

            let maxCrafts = 9999, limitReason = "Market";
            if (apiKey) {
                const shardLimit = Math.floor((userData.wallet[23] || 0) * 2);
                const dustLimit = Math.floor((userData.materials[ESSENTIALS.CRYSTALLINE_DUST] || 0) / 5);
                const t5Limit = Math.floor((userData.materials[item.t5] || 0) / 50);
                maxCrafts = Math.min(shardLimit, dustLimit, t5Limit);
                if (maxCrafts === shardLimit) limitReason = "Shards"; else if (maxCrafts === dustLimit) limitReason = "Dust"; else if (maxCrafts === t5Limit) limitReason = "T5";
            }

            const chosen = customIterations[t6Id] !== undefined ? customIterations[t6Id] : maxCrafts;
            if (((revenue - cost) / cost) * 100 > 5) {
                ops.push({
                    id: t6Id, item, t5Id: item.t5, maxCrafts, limitReason, chosen,
                    totalCost: cost * chosen, potentialProfit: profit * chosen,
                    unitProfit: profit, roi: ((revenue - cost) / cost) * 100,
                    synergy: recycleStats?.isCheaper
                });
            }
        });
        return ops.sort((a, b) => b.potentialProfit - a.potentialProfit);
    }, [prices, userData, customIterations, recycleStats]);

    // --- GLOBAL ALPHA LOGIC ---
    const globalAlpha = useMemo(() => {
        const topCraft = opportunities[0];
        const topFlip = kilonovaData?.flips?.[0];

        const choices = [];
        // Flip-First priority: if a flip has > 5% margin, it can take the spot
        if (topFlip && topFlip.profitVal > 0) {
            choices.push({ type: 'flip', profitVal: topFlip.profitVal * 5, label: topFlip.name, profit: topFlip.profit }); // Boost weight for flips
        }
        if (topCraft) choices.push({ type: 'craft', profitVal: topCraft.potentialProfit, label: getItemName(topCraft.id, lang), profit: formatGold(topCraft.potentialProfit) });
        if (recycleStats?.isCheaper) choices.push({ type: 'salvage', profitVal: 1000, label: t.recomSalvage, profit: `${recycleStats.savingPct.toFixed(1)}%` });

        return choices.sort((a, b) => b.profitVal - a.profitVal)[0];
    }, [opportunities, kilonovaData, recycleStats, lang, t]);

    const bestRoute = useMemo(() => {
        // Mock volatility check based on T6 average spread? 
        // For now, let's use a rotation or based on top profit.
        if (!opportunities.length) return { label: '---', reason: 'Waiting for data...' };

        const topRoi = opportunities[0].roi;
        if (topRoi > 40) return { label: t.routeAggro, reason: t.volatilityAggro };
        if (topRoi < 15) return { label: t.routeSafe, reason: t.volatilitySafe };
        return { label: t.routeBalanced, reason: t.volatilityMed };
    }, [opportunities, t]);

    const saveKey = (key) => { setApiKey(key); localStorage.setItem('ace_api_key', key); setShowKeyInput(false); setTimeout(fetchUserData, 500); };


    const liquidatorData = useMemo(() => { if (!apiKey) return []; return Object.keys(userData.materials).map(id => { const count = userData.materials[id]; const p = prices[id]; if (count > 0 && p) return { id: Number(id), count, value: count * p.sells.unit_price * 0.85 }; return null; }).filter(x => x && x.value > 10000).sort((a, b) => b.value - a.value).slice(0, 5); }, [userData, prices, apiKey]);

    // Strategy logic...
    const strategyAvailable = opportunities.length >= 3;
    const safeGuide = useMemo(() => { if (!strategyAvailable) return null; const top3 = opportunities.slice(0, 3); return top3.map(o => ({ ...o, pct: 33 })); }, [opportunities, strategyAvailable]);
    const balancedGuide = useMemo(() => { if (!strategyAvailable) return null; const top3 = opportunities.slice(0, 3); const totalRoi = top3.reduce((a, c) => a + c.roi, 0); return top3.map(o => ({ ...o, pct: Math.round((o.roi / totalRoi) * 100) })); }, [opportunities, strategyAvailable]);
    const aggroGuide = useMemo(() => { if (!strategyAvailable) return null; const top3 = opportunities.slice(0, 3); return top3.map((o, i) => ({ ...o, pct: i === 0 ? 70 : i === 1 ? 20 : 10 })); }, [opportunities, strategyAvailable]);

    // Train Logic
    const trainData = useMemo(() => {
        if (!trainCount || opportunities.length === 0) return null;
        const batch = opportunities.slice(0, trainCount);
        const totalInvestment = batch.reduce((a, c) => a + c.totalCost, 0);
        const totalProfit = batch.reduce((a, c) => a + c.potentialProfit, 0);
        const totalShards = batch.reduce((a, c) => a + (c.chosen * 0.5), 0); // Approx 0.5 shard per T6 craft
        const totalEctos = batch.reduce((a, c) => a + (c.chosen * 0), 0); // Ectos used for Dust if salvaging... complex calculation ignored for simplicity, assuming user has dust or ecto.
        // Shopping List
        const shopping = {};
        batch.forEach(opp => {
            // 50 T5 + 1 T6 + 5 Dust
            const t5Name = ITEM_DATA[opp.t5Id].name[lang];
            const t6Name = ITEM_DATA[opp.id].name[lang];
            shopping[t5Name] = (shopping[t5Name] || 0) + (opp.chosen * 50);
            shopping[t6Name] = (shopping[t6Name] || 0) + (opp.chosen * 1);
            shopping['Crystalline Dust'] = (shopping['Crystalline Dust'] || 0) + (opp.chosen * 5);
        });
        return { totalInvestment, totalProfit, totalShards, shopping };
    }, [trainCount, opportunities, lang]);

    // Expanded Accordion Logic
    const getRouteData = (type) => ({
        safe: { title: t.routeSafe, subtitle: t.subSafe, icon: ShieldCheck, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", desc: t.descSafe, risk: t.riskLow, time: t.timeMed },
        balanced: { title: t.routeBalanced, subtitle: t.subBalanced, icon: Scale, color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", desc: t.descBalanced, risk: t.riskMed, time: t.timeLong },
        aggro: { title: t.routeAggro, subtitle: t.subAggro, icon: Sword, color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10", desc: t.descAggro, risk: t.riskHigh, time: t.timeShort }
    }[type]);

    const StrategyCard = ({ type, guide }) => {
        const data = getRouteData(type);
        const isExpanded = expandedRoute === type;
        const Icon = data.icon;
        return (
            <div onClick={() => setExpandedRoute(isExpanded ? null : type)} className={`bg-zinc-900 rounded-3xl border border-zinc-800 relative overflow-hidden group cursor-pointer transition-all duration-300 ${isExpanded ? 'border-zinc-700 bg-zinc-800' : 'hover:bg-zinc-800/60 hover:border-zinc-700'}`}>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold ${data.color} flex items-center gap-2 text-lg`}><Icon size={20} /> {data.title}</h4>
                        <span className="text-[10px] font-bold uppercase bg-zinc-950 px-2 py-1 rounded text-zinc-500 tracking-wider border border-zinc-800">{isExpanded ? 'MINIMIZE' : t.clickExpand}</span>
                    </div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide mb-4">{data.subtitle}</p>

                    <div className="flex h-3 rounded-full overflow-hidden mb-4 bg-zinc-950 border border-zinc-800">{guide.slice(0, 3).map((it, i) => <div key={i} style={{ width: `${it.pct}%` }} className={`${data.color.replace('text', 'bg').replace('400', '500')}/80 border-r border-zinc-900 last:border-0`}></div>)}</div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pt-2 border-t border-zinc-700/50 mt-2 space-y-4">
                            <p className="text-zinc-300 text-sm leading-relaxed">{data.desc}</p>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800"><span className="text-zinc-500 uppercase font-bold block mb-1">{t.risk}</span><span className={`font-bold ${data.color}`}>{data.risk}</span></div>
                                <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800"><span className="text-zinc-500 uppercase font-bold block mb-1">{t.horizon}</span><span className="text-zinc-300 font-medium">{data.time}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans selection:bg-amber-500/30">
            {showManual && <ManualModal onClose={() => setShowManual(false)} lang={lang} />}
            {showKeyInput && <SecurityModal onClose={() => setShowKeyInput(false)} onSave={saveKey} lang={lang} />}

            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 border-b border-zinc-800 pb-8 bg-zinc-900/40 p-8 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 p-4 rounded-2xl shadow-lg shadow-violet-950/50"><Cpu className="w-10 h-10 text-white" /></div>
                    <div><h1 className="text-4xl font-black tracking-tighter text-white mb-2">{t.title} <span className="text-fuchsia-400">161914</span></h1><p className="text-sm uppercase tracking-widest text-zinc-400 font-bold bg-zinc-800/50 inline-block px-3 py-1 rounded hidden md:inline-block">{t.subtitle} <span className="text-violet-400">v21 FLUX</span></p></div>
                </div>
                <div className="flex flex-wrap gap-4 items-center w-full xl:w-auto">
                    <button onClick={toggleLang} className="flex items-center gap-2 px-5 py-3 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-700 border border-zinc-700"><Globe size={18} /> {lang.toUpperCase()}</button>
                    <button onClick={() => setShowManual(true)} className="flex items-center gap-2 px-5 py-3 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-700 border border-zinc-700"><BookOpen size={18} /> {t.manual}</button>
                    <div className="flex-1 xl:flex-none">
                        <button onClick={() => setShowKeyInput(true)} className={`w-full xl:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border transition-all ${apiKey ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800 hover:bg-emerald-900/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}><Key size={18} /> {apiKey ? t.linked : t.link}</button>
                    </div>
                    <button onClick={() => { fetchMarketData(); fetchUserData(); }} disabled={loading} className="bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-xl shadow-lg transition-all hover:scale-105"><RefreshCcw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} /></button>
                </div>
            </header>

            {/* AUTOTRACKER - MAIN FOCUS */}
            <AutoTracker opportunities={opportunities} gold={userData.wallet?.[1] || 0} lang={lang} onRefresh={() => { fetchMarketData(); fetchUserData(); }} loading={loading} />

            {/* Secondary data below - collapsed by default */}
            <details className="mb-8 group">
                <summary className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                    <span className="text-sm text-zinc-400 font-bold uppercase">{lang === 'es' ? '📊 Ver Datos Avanzados' : '📊 View Advanced Data'}</span>
                    <ChevronDown size={20} className="text-zinc-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 space-y-6">
                    <OracleBar alpha={globalAlpha} route={bestRoute} lang={lang} />
                    <KilonovaScanner data={kilonovaData} loading={kiloLoading} onScan={runKilonovaScan} lang={lang} />
                    <EliteList opportunities={opportunities} flips={kilonovaData?.flips} recycle={recycleStats} lang={lang} />
                </div>
            </details>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-3 space-y-8">
                    {recycleStats && (
                        <div className={`p-6 rounded-3xl border shadow-xl ${recycleStats.isCheaper ? 'bg-indigo-900/20 border-indigo-500/40' : 'bg-zinc-900 border-zinc-800'}`}>
                            <h3 className="text-sm font-black text-indigo-300 uppercase mb-4 flex items-center gap-2 tracking-wider"><Recycle size={18} className={recycleStats.isCheaper ? "animate-spin-slow text-indigo-400" : "text-zinc-600"} /> {t.lab} <InfoToolTip content={t.infoLab} /></h3>
                            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 mb-4">
                                <div className="flex justify-between items-center mb-2"><span className="text-zinc-400 text-xs font-bold">{t.buyDust}</span><span className="font-mono text-red-400 font-bold">{formatGold(recycleStats.dustBuy)}</span></div>
                                <div className="flex justify-between items-center"><span className="text-indigo-300 text-xs font-bold">{t.salvageEcto}</span><span className="font-mono text-emerald-400 font-bold">{formatGold(recycleStats.costPerDustExEcto)}</span></div>
                            </div>
                        </div>
                    )}
                    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden">
                        <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800"><h3 className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2 tracking-wider"><Coins size={14} /> {t.funding}</h3></div>
                        <div className="p-4 space-y-2">
                            <a href="https://wiki.guildwars2.com/wiki/Fractals_of_the_Mists" target="_blank" className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer group"><Map size={16} className="text-zinc-500 group-hover:text-amber-400" /><span className="text-sm font-medium text-zinc-300 group-hover:text-white">{t.farmFractal}</span><ExternalLink size={12} className="ml-auto text-zinc-600 opacity-0 group-hover:opacity-100" /></a>
                            <a href="https://wiki.guildwars2.com/wiki/Drizzlewood_Coast" target="_blank" className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer group"><Map size={16} className="text-zinc-500 group-hover:text-amber-400" /><span className="text-sm font-medium text-zinc-300 group-hover:text-white">{t.farmDrizzle}</span><ExternalLink size={12} className="ml-auto text-zinc-600 opacity-0 group-hover:opacity-100" /></a>
                        </div>
                    </div>
                    {apiKey && liquidatorData.length > 0 && (
                        <div className="bg-gradient-to-b from-red-950/20 to-zinc-900 p-6 rounded-3xl border border-red-900/30 shadow-xl">
                            <h3 className="text-sm font-black text-red-400 uppercase mb-2 flex items-center gap-2 tracking-wider"><Trash2 size={16} /> {t.liquidator} <InfoToolTip content={t.infoLiquidator} /></h3>
                            <div className="space-y-3 mt-4">
                                {liquidatorData.map((item, i) => <div key={i} className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-xl border border-red-900/10 hover:border-red-500/30 transition-colors"><span className="text-zinc-300 truncate text-sm font-medium">{item.count}x {getItemName(item.id, lang)}</span><span className="font-bold text-emerald-400 ml-3 text-sm">{formatGold(item.value)}</span></div>)}
                            </div>
                        </div>
                    )}
                </div>

                <div className="xl:col-span-6 space-y-6">
                    {/* PhandrelProtocol was here, moved to top level */}
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h2 className="text-2xl font-black flex items-center gap-3 text-white"><Activity className="text-amber-500" size={28} /> {t.opportunities} <InfoToolTip content={t.infoRanking} /></h2>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => setTrainCount(0)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all ${trainCount === 0 ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white'}`}>Single</button>
                                <button onClick={() => setTrainCount(3)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all ${trainCount === 3 ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white'}`}>{t.craftTop} 3</button>
                                <button onClick={() => setTrainCount(5)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all ${trainCount === 5 ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white'}`}>{t.craftTop} 5</button>
                            </div>
                        </div>
                        <span className="text-xs font-bold bg-amber-950/30 text-amber-500 px-4 py-1.5 rounded-full border border-amber-900/50 tracking-wider uppercase h-fit">{opportunities.length} Items</span>
                    </div>

                    <div className="space-y-4">
                        {opportunities.map((opp, index) => (
                            <div key={opp.id} className={`bg-zinc-900 rounded-3xl border transition-all duration-300 ease-out cursor-pointer group shadow-lg ${trainCount > 0 && index < trainCount ? 'border-amber-500 ring-4 ring-amber-500/10 bg-zinc-800 relative scale-[1.01]' : ''} ${expandedId === opp.id ? 'border-amber-600/50 shadow-amber-900/20 ring-1 ring-amber-900/50 scale-[1.01]' : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'} ${trainCount > 0 && index >= trainCount ? 'opacity-40 grayscale blur-[1px]' : ''}`} onClick={() => setExpandedId(expandedId === opp.id ? null : opp.id)}>
                                {trainCount > 0 && index < trainCount && (
                                    <div className="absolute -top-3 -right-3 bg-amber-500 text-black font-black text-xs px-2 py-1 rounded-full z-20 shadow-lg flex items-center gap-1"><Train size={12} /> {t.profitTrain}</div>
                                )}
                                <div className="p-6 flex items-center justify-between relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-amber-500 transition-colors"></div>
                                    <div className="flex items-center gap-6 z-10">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner border border-white/5 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-amber-500/50' : index === 1 ? 'bg-zinc-300 text-zinc-800' : index === 2 ? 'bg-orange-700 text-orange-200' : 'bg-zinc-800 text-zinc-600'}`}>#{index + 1}</div>
                                        <div>
                                            <h3 className="font-bold text-white text-xl flex items-center gap-2 mb-1 group-hover:text-amber-400 transition-colors">
                                                {getItemName(opp.id, lang)}
                                                {opp.synergy && <span className="bg-indigo-600/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-lg shadow-indigo-500/30 animate-pulse"><Recycle size={10} /> {t.synergy}</span>}
                                            </h3>
                                            <p className="text-xs text-zinc-500 font-medium italic max-w-xs truncate">{getItemDesc(opp.id, lang)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 z-10">
                                        <button onClick={(e) => { e.stopPropagation(); toggleWatch(opp.id); }} className={`p-2 rounded-lg transition-all ${watchlist.includes(opp.id) ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-600 hover:text-amber-400'}`}>⭐</button>
                                        <div className="text-right"><div className="flex items-center gap-2 justify-end text-emerald-400 font-black text-2xl tracking-tight">{formatGold(opp.potentialProfit)}</div><p className="text-xs text-zinc-500 font-mono mt-1 text-right">{opp.roi.toFixed(1)}% ROI</p></div>
                                    </div>
                                </div>
                                {expandedId === opp.id && (
                                    <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 fade-in">
                                        <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800 text-sm" onClick={(e) => e.stopPropagation()}>
                                            {/* Synergy Alert inside Card */}
                                            {opp.synergy && (
                                                <div className="mb-4 bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30 flex items-start gap-3">
                                                    <Recycle size={20} className="text-indigo-400 mt-1 flex-shrink-0" />
                                                    <div><h4 className="font-bold text-indigo-300 text-sm mb-1">{t.synergy}</h4><p className="text-indigo-200/70 text-xs">{t.synergyTip} {recycleStats.savingPct.toFixed(1)}%.</p></div>
                                                </div>
                                            )}
                                            <div className="mb-6 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/50">
                                                <h4 className="text-xs font-bold text-amber-500 uppercase mb-2 flex items-center gap-2"><Puzzle size={12} /> {t.why}</h4><p className="text-zinc-300 leading-relaxed text-sm">{getItemDesc(opp.id, lang)} {t.whyPromo}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center bg-zinc-900 p-3 rounded-xl border border-zinc-800"><p className="text-xs text-zinc-500 uppercase font-bold mb-1">{t.totalCost}</p><p className="font-mono font-black text-red-400 text-lg">{formatGold(opp.totalCost)}</p></div>
                                                <div className="text-center bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/30"><p className="text-xs text-emerald-500/70 uppercase font-bold mb-1">{t.profit}</p><p className="font-mono font-black text-emerald-400 text-xl">{formatGold(opp.potentialProfit)}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="xl:col-span-3 space-y-6">
                    {/* --- OPPORTUNITIES RANKING --- */}
                    {trainData ? (
                        <div className="bg-amber-950/20 rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl relative sticky top-6 animate-in slide-in-from-right-4 fade-in">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Train size={64} className="text-amber-500" /></div>
                            <div className="bg-amber-900/20 px-6 py-4 border-b border-amber-500/30 flex justify-between items-center">
                                <h3 className="text-sm font-black text-amber-500 uppercase flex items-center gap-2 tracking-wider"><ShoppingCart size={16} /> {t.shoppingList}</h3>
                                <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">TOP {trainCount}</span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-900">
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 text-center">{t.trainSummary}</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between"><span className="text-zinc-400 text-sm">Investment</span><span className="font-mono text-red-300 font-bold">{formatGold(trainData.totalInvestment)}</span></div>
                                        <div className="flex justify-between border-t border-zinc-800 pt-2 mt-2"><span className="text-emerald-400 font-bold text-sm">NET PROFIT</span><span className="font-mono text-emerald-400 font-black text-xl">{formatGold(trainData.totalProfit)}</span></div>
                                    </div>
                                </div>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.entries(trainData.shopping).map(([name, count]) => (
                                        <div key={name} className="flex justify-between items-center text-xs border-b border-zinc-800/50 pb-1 last:border-0">
                                            <span className="text-zinc-300">{name}</span>
                                            <span className="font-mono text-amber-500 font-bold">{count.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl">
                            <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex justify-between items-center"><h3 className="text-xs font-bold text-purple-400 uppercase flex items-center gap-2 tracking-wider"><Gem size={14} /> {t.gemExchange} <InfoToolTip content={t.infoGems} /></h3></div>
                            <div className="p-6 text-center">
                                <p className="text-xs text-zinc-500 uppercase font-bold mb-2">{t.gemsBuy}</p>
                                <div className="text-3xl font-black text-purple-300 tracking-tight flex items-center justify-center gap-2">
                                    {gems.coins_per_gem ? formatGold(gems.coins_per_gem * 400) : '---'}
                                </div>
                                <p className="text-[10px] text-zinc-600 mt-2">Live Rate</p>
                            </div>
                        </div>
                    )}

                    {strategyAvailable && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-zinc-400"><Scale size={18} className="text-amber-500" /> <span className="uppercase text-xs font-bold tracking-widest">{t.routes}</span></div>
                            <StrategyCard type="safe" guide={safeGuide} />
                            <StrategyCard type="balanced" guide={balancedGuide} />
                            <StrategyCard type="aggro" guide={aggroGuide} />
                        </div>
                    )}
                </div>
            </div>

            {/* KILONOVA SCANNER AREA was here, moved to top */}

            <footer className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-mono uppercase tracking-widest">
                <span>ACE_161914 // SYSTEM V16.0 KILONOVA</span>
                <a href="https://github.com/anuset89/Anuu_Verse" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors"><Github size={14} /> {t.openRepo}</a>
            </footer>
        </div >
    );
};

export default App;
