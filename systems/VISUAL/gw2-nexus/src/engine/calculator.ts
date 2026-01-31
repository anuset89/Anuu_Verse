
export const IDS = {
    // T5 Fine
    BLOOD_T5: 24294, BONE_T5: 24340, CLAW_T5: 24350, FANG_T5: 24356, SCALE_T5: 24288, TOTEM_T5: 24299, VENOM_T5: 24282, DUST_T5: 24276,

    // T6 Fine
    BLOOD_T6: 24295, BONE_T6: 24341, CLAW_T6: 24351, FANG_T6: 24357, SCALE_T6: 24289, TOTEM_T6: 24300, VENOM_T6: 24283, DUST_T6: 24277,

    // T5 Common
    ORE_T5: 19702, WOOD_T5: 19722, LEATHER_T5: 19729, CLOTH_T5: 19748,

    // T6 Common
    ORE_T6: 19703, WOOD_T6: 19725, LEATHER_T6: 19732, CLOTH_T6: 19745,

    // Lodestones (Cores)
    CORE_ONYX: 24304, LODE_ONYX: 24305,
    CORE_MOLTEN: 24329, LODE_MOLTEN: 24330,
    CORE_GLACIAL: 24334, LODE_GLACIAL: 24335,
    CORE_DESTROYER: 24324, LODE_DESTROYER: 24325,
    CORE_CRYSTAL: 24320, LODE_CRYSTAL: 24321,
    CORE_CORRUPTED: 24339, LODE_CORRUPTED: 24338,
    CORE_CHARGED: 24309, LODE_CHARGED: 24310,

    // Runic
    LUCENT_MOTE: 85731, LUCENT_SHARD: 85750,

    // Ectoplasm & Mystic
    GLOB_ECTO: 19721,
    MYSTIC_CLOVER: 19675,
    MYSTIC_COIN: 19976,
    OBSIDIAN_SHARD: 19924,
    PHILO_STONE: 19673,

    // Rare/Exotic crafting
    VIAL_BLOOD: 24290, // T2 Blood for alternative conversions
    TINY_SCALES: 24284, // T2 Scales

    // Global Catalyst & Utility
    DUST: 24277,
    WINE: 19659, // Bottle of Elonian Wine
    CRYSTAL: 24319, // Mystic Crystal (made from Philo Stone)

    // Industrial / Research
    RESEARCH_NOTE: 94684,
    ANTIQUE_STONE: 95982,
    UNUSUAL_COIN: 95914,
    ANCIENT_SCROLL: 95856,
    MITHRIL_EARRING: 13357,
};

const IDS_TO_NAME: Record<number, string> = {
    // T5 Fine
    24294: "Potent Blood", 24340: "Large Bone", 24350: "Large Claw", 24356: "Large Fang", 24288: "Large Scale", 24299: "Intricate Totem", 24282: "Potent Venom", 24276: "Incandescent Dust",
    // T6 Fine
    24295: "Powerful Blood", 24341: "Ancient Bone", 24351: "Powerful Claw", 24357: "Ancient Fang", 24289: "Armored Scale", 24300: "Elaborate Totem", 24283: "Powerful Venom", 24277: "Crystalline Dust",
    // T5 Common
    19702: "Mithril Ore", 19722: "Elder Wood", 19729: "Thick Leather", 19748: "Silk Scrap",
    // T6 Common
    19703: "Orichalcum Ore", 19725: "Ancient Wood", 19732: "Hardened Leather", 19745: "Gossamer",
    // Lodestones
    24304: "Onyx Core", 24305: "Onyx Lodestone",
    24329: "Molten Core", 24330: "Molten Lodestone",
    24334: "Glacial Core", 24335: "Glacial Lodestone",
    24324: "Destroyer Core", 24325: "Destroyer Lodestone",
    24320: "Crystal Core", 24321: "Crystal Lodestone",
    24339: "Corrupted Core", 24338: "Corrupted Lodestone",
    24309: "Charged Core", 24310: "Charged Lodestone",
    // Runic & Mystic
    85731: "Lucent Mote", 85750: "Lucent Shard",
    19721: "Glob of Ectoplasm",
    19675: "Mystic Clover",
    19976: "Mystic Coin",
    19924: "Obsidian Shard",
    19673: "Philosopher's Stone",
    24319: "Mystic Crystal",
    // T2 Materials
    24290: "Vial of Blood",
    24284: "Tiny Scales",
    94684: "Research Note",
    95982: "Antique Summoning Stone",
    95914: "Unusual Coin",
    13357: "Mithril Earring",
};

export const IDS_TO_NAME_ES: Record<number, string> = {
    94684: "Nota de Investigación",
    95982: "Piedra de Invocación Antigua",
    95914: "Moneda Inusual",
    95856: "Pergamino Antiguo",
    13357: "Pendiente de Mithril",
    24295: "Sangre Poderosa", 24341: "Hueso Antiguo", 24351: "Garra Poderosa", 24357: "Colmillo Antiguo",
    24289: "Escama Blindada", 24300: "Tótem Elaborado", 24283: "Veneno Poderoso", 24277: "Polvo Cristalino",
    19703: "Mineral de Oricalco", 19725: "Madera Antigua", 19732: "Cuero Endurecido", 19745: "Gasa",
    24304: "Núcleo de Ónix", 24305: "Piedra de Imán de Ónix",
    24329: "Núcleo Fundido", 24330: "Piedra de Imán Fundida",
    24334: "Núcleo Glacial", 24335: "Piedra de Imán Glacial",
    24324: "Núcleo de Destructor", 24325: "Piedra de Imán de Destructor",
    24320: "Núcleo de Cristal", 24321: "Piedra de Imán de Cristal",
    24339: "Núcleo Corrupto", 24338: "Piedra de Imán Corrupta",
    24309: "Núcleo Cargado", 24310: "Piedra de Imán Cargada",
    85731: "Mota Luciente", 85750: "Fragmento Luciente",
    19721: "Bola de Ectoplasma", 19659: "Vino de Elona", 24319: "Cristal Místico"
};

export const getTranslatedName = (id: number, fallback: string, isEng: boolean) => {
    if (isEng) return fallback;
    return IDS_TO_NAME_ES[id] || fallback;
};

export interface MarketItem {
    id: number;
    buys: { quantity: number; unit_price: number };
    sells: { quantity: number; unit_price: number };
}

export interface AnuuStrategy {
    sourceId: number;
    targetId: number;
    name: string;
    sourceName: string;
    costPerUnit: number;
    sellPrice: number;
    profitPerCraft: number;
    roi: number;
    volatility: number;
    score: number;
    verdict: string;
    supplyQty: number;
    type: 'FINE' | 'COMMON' | 'RUNE' | 'LODE';
    recipe?: string;
}

export const analyzeMarket = (prices: Record<number, MarketItem>): AnuuStrategy[] => {
    const results: AnuuStrategy[] = [];
    const dust = prices[IDS.DUST];

    if (!dust) return [];

    // T5 to T6 FINE
    [
        [IDS.BLOOD_T5, IDS.BLOOD_T6], [IDS.BONE_T5, IDS.BONE_T6], [IDS.CLAW_T5, IDS.CLAW_T6], [IDS.FANG_T5, IDS.FANG_T6],
        [IDS.SCALE_T5, IDS.SCALE_T6], [IDS.TOTEM_T5, IDS.TOTEM_T6], [IDS.VENOM_T5, IDS.VENOM_T6], [IDS.DUST_T5, IDS.DUST_T6]
    ].forEach(([s, t]) => {
        if (!prices[s] || !prices[t]) return;
        const cost = (prices[s].buys.unit_price * 50) + (prices[t].buys.unit_price * 1) + (dust.buys.unit_price * 5);
        const profit = (prices[t].sells.unit_price * 7 * 0.85) - cost;
        const roi = (profit / cost) * 100;
        const volatility = (prices[t].sells.unit_price - prices[t].buys.unit_price) / prices[t].sells.unit_price * 100;
        const liquidityScore = Math.min(prices[t].sells.quantity / 10000, 1) * 30;
        const roiScore = Math.max(0, Math.min(roi, 50));
        const stabilityScore = Math.max(0, 20 - volatility);
        const score = roiScore + liquidityScore + stabilityScore;
        results.push({
            sourceId: s, targetId: t, name: IDS_TO_NAME[t], sourceName: IDS_TO_NAME[s],
            costPerUnit: cost, sellPrice: prices[t].sells.unit_price, profitPerCraft: profit,
            roi, volatility, score,
            verdict: roi > 15 ? "HIGH PROFIT" : roi > 5 ? "STABLE" : "BREAKEVEN",
            supplyQty: prices[t].sells.quantity, type: 'FINE',
            recipe: "50x T5 Material + 1x T6 Material + 5x Crystalline Dust + 5x Philosopher's Stones"
        });
    });

    // T5 to T6 COMMON
    [
        [IDS.ORE_T5, IDS.ORE_T6], [IDS.WOOD_T5, IDS.WOOD_T6], [IDS.LEATHER_T5, IDS.LEATHER_T6], [IDS.CLOTH_T5, IDS.CLOTH_T6]
    ].forEach(([s, t]) => {
        if (!prices[s] || !prices[t]) return;
        const cost = (prices[s].buys.unit_price * 250) + (prices[t].buys.unit_price * 1) + (dust.buys.unit_price * 5);
        const profit = (prices[t].sells.unit_price * 22 * 0.85) - cost;
        const roi = (profit / cost) * 100;
        const volatility = (prices[t].sells.unit_price - prices[t].buys.unit_price) / prices[t].sells.unit_price * 100;
        const liquidityScore = Math.min(prices[t].sells.quantity / 50000, 1) * 40;
        const roiScore = Math.max(0, Math.min(roi, 40));
        const stabilityScore = Math.max(0, 20 - volatility);
        const score = roiScore + liquidityScore + stabilityScore;
        results.push({
            sourceId: s, targetId: t, name: IDS_TO_NAME[t], sourceName: IDS_TO_NAME[s],
            costPerUnit: cost, sellPrice: prices[t].sells.unit_price, profitPerCraft: profit,
            roi, volatility, score,
            verdict: roi > 10 ? "MASS PRODUCTION" : roi > 3 ? "VIABLE" : "LOW MARGIN",
            supplyQty: prices[t].sells.quantity, type: 'COMMON',
            recipe: "250x T5 Material + 1x T6 Material + 5x Crystalline Dust + 5x Philosopher's Stones"
        });
    });

    // Lodestones
    [
        [IDS.CORE_ONYX, IDS.LODE_ONYX], [IDS.CORE_MOLTEN, IDS.LODE_MOLTEN], [IDS.CORE_GLACIAL, IDS.LODE_GLACIAL],
        [IDS.CORE_DESTROYER, IDS.LODE_DESTROYER], [IDS.CORE_CRYSTAL, IDS.LODE_CRYSTAL], [IDS.CORE_CORRUPTED, IDS.LODE_CORRUPTED],
        [IDS.CORE_CHARGED, IDS.LODE_CHARGED]
    ].forEach(([s, t]) => {
        if (!prices[s] || !prices[t]) return;
        const wineCost = 2560;
        const cost = (prices[s].buys.unit_price * 2) + wineCost + dust.buys.unit_price;
        const profit = (prices[t].sells.unit_price * 0.85) - cost;
        const roi = (profit / cost) * 100;
        const volatility = (prices[t].sells.unit_price - prices[t].buys.unit_price) / prices[t].sells.unit_price * 100;
        const liquidityScore = Math.min(prices[t].sells.quantity / 5000, 1) * 25;
        const roiScore = Math.max(0, Math.min(roi, 50));
        const stabilityScore = Math.max(0, 25 - volatility);
        const score = roiScore + liquidityScore + stabilityScore;
        results.push({
            sourceId: s, targetId: t, name: IDS_TO_NAME[t], sourceName: IDS_TO_NAME[s],
            costPerUnit: cost, sellPrice: prices[t].sells.unit_price, profitPerCraft: profit,
            roi, volatility, score,
            verdict: roi > 20 ? "RARE UPGRADE" : roi > 10 ? "PROFITABLE" : "RISKY",
            supplyQty: prices[t].sells.quantity, type: 'LODE',
            recipe: "2x Cores + 1x Bottle of Elonian Wine + 1x Pile of Crystalline Dust + 1x Mystic Crystal"
        });
    });

    // Runic
    if (prices[IDS.LUCENT_MOTE] && prices[IDS.LUCENT_SHARD]) {
        const s = IDS.LUCENT_MOTE;
        const t = IDS.LUCENT_SHARD;
        const cost = prices[s].buys.unit_price * 10;
        const profit = (prices[t].sells.unit_price * 0.85) - cost;
        const roi = (profit / cost) * 100;
        const volatility = (prices[t].sells.unit_price - prices[t].buys.unit_price) / prices[t].sells.unit_price * 100;
        const liquidityScore = Math.min(prices[t].sells.quantity / 3000, 1) * 20;
        const roiScore = Math.max(0, Math.min(roi, 60));
        const stabilityScore = Math.max(0, 20 - volatility);
        const score = roiScore + liquidityScore + stabilityScore;
        results.push({
            sourceId: s, targetId: t, name: IDS_TO_NAME[t], sourceName: IDS_TO_NAME[s],
            costPerUnit: cost, sellPrice: prices[t].sells.unit_price, profitPerCraft: profit,
            roi, volatility, score,
            verdict: roi > 25 ? "SPECULATIVE" : roi > 10 ? "RISKY" : "VOLATILE",
            supplyQty: prices[t].sells.quantity, type: 'RUNE',
            recipe: "10x Lucent Motes + 1x Charm/Symbol + 1x Ectoplasm + 50x Lucent Crystals"
        });
    }

    // Research Note Extraction
    if (prices[IDS.MITHRIL_EARRING] && prices[IDS.RESEARCH_NOTE]) {
        const cost = prices[IDS.MITHRIL_EARRING].buys.unit_price;
        const noteYield = 1;
        const profit = (prices[IDS.RESEARCH_NOTE].sells.unit_price * noteYield * 0.85) - cost;
        const roi = (profit / cost) * 100;
        results.push({
            sourceId: IDS.MITHRIL_EARRING, targetId: IDS.RESEARCH_NOTE, name: "Research Note", sourceName: "Mithril Earring",
            costPerUnit: cost, sellPrice: prices[IDS.RESEARCH_NOTE].sells.unit_price, profitPerCraft: profit,
            roi, volatility: 2, score: 95,
            verdict: "STABLE RESEARCH",
            supplyQty: 99999,
            type: 'COMMON',
            recipe: "Salvage Mithril Earring with Research Kit"
        });
    }

    // Industrial Exchange
    if (prices[IDS.UNUSUAL_COIN] && prices[IDS.ANTIQUE_STONE]) {
        const cost = prices[IDS.UNUSUAL_COIN].buys.unit_price * 1;
        const profit = (prices[IDS.ANTIQUE_STONE].sells.unit_price * 0.85) - cost;
        const roi = (profit / cost) * 100;
        results.push({
            sourceId: IDS.UNUSUAL_COIN, targetId: IDS.ANTIQUE_STONE, name: "Antique Summoning Stone", sourceName: "Unusual Coin",
            costPerUnit: cost, sellPrice: prices[IDS.ANTIQUE_STONE].sells.unit_price, profitPerCraft: profit,
            roi, volatility: 5, score: 90,
            verdict: "WEEKLY PRIORITY",
            supplyQty: prices[IDS.ANTIQUE_STONE].sells.quantity,
            type: 'LODE',
            recipe: "1x Unusual Coin (Vendor Exchange)"
        });
    }

    return results.sort((a, b) => b.roi - a.roi);
};
