
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

    // Global Catalyst & Utility
    DUST: 24277,
    WINE: 19659, // Bottle of Elonian Wine
};

const IDS_TO_NAME: Record<number, string> = {
    24294: "Potent Blood", 24340: "Large Bone", 24350: "Large Claw", 24356: "Large Fang", 24288: "Large Scale", 24299: "Intricate Totem", 24282: "Potent Venom", 24276: "Incandescent Dust",
    24295: "Powerful Blood", 24341: "Ancient Bone", 24351: "Powerful Claw", 24357: "Ancient Fang", 24289: "Armored Scale", 24300: "Elaborate Totem", 24283: "Powerful Venom", 24277: "Crystalline Dust",
    19702: "Mithril Ore", 19722: "Elder Wood Log", 19729: "Thick Leather Section", 19748: "Silk Scrap",
    19703: "Orichalcum Ore", 19725: "Ancient Wood Log", 19732: "Hardened Leather Section", 19745: "Gossamer Scrap",
    24304: "Onyx Core", 24305: "Onyx Lodestone",
    24329: "Molten Core", 24330: "Molten Lodestone",
    24334: "Glacial Core", 24335: "Glacial Lodestone",
    24324: "Destroyer Core", 24325: "Destroyer Lodestone",
    24320: "Crystal Core", 24321: "Crystal Lodestone",
    24339: "Corrupted Core", 24338: "Corrupted Lodestone",
    24309: "Charged Core", 24310: "Charged Lodestone",
    85731: "Lucent Mote", 85750: "Lucent Shard",
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
        results.push({
            sourceId: s, targetId: t, name: IDS_TO_NAME[t], sourceName: IDS_TO_NAME[s],
            costPerUnit: cost, sellPrice: prices[t].sells.unit_price, profitPerCraft: profit,
            roi: (profit / cost) * 100, volatility: (prices[t].sells.unit_price - prices[t].buys.unit_price) / prices[t].sells.unit_price * 100,
            score: (profit / 10000) * 10 + 5, verdict: "HIGH PROFIT", supplyQty: prices[t].sells.quantity, type: 'FINE'
        });
    });

    // T5 to T6 COMMON
    [
        [IDS.ORE_T5, IDS.ORE_T6], [IDS.WOOD_T5, IDS.WOOD_T6], [IDS.LEATHER_T5, IDS.LEATHER_T6], [IDS.CLOTH_T5, IDS.CLOTH_T6]
    ].forEach(([s, t]) => {
        if (!prices[s] || !prices[t]) return;
        const cost = (prices[s].buys.unit_price * 250) + (prices[t].buys.unit_price * 1) + (dust.buys.unit_price * 5);
        const profit = (prices[t].sells.unit_price * 22 * 0.85) - cost;
        results.push({
            sourceId: s, targetId: t, name: IDS_TO_NAME[t], sourceName: IDS_TO_NAME[s],
            costPerUnit: cost, sellPrice: prices[t].sells.unit_price, profitPerCraft: profit,
            roi: (profit / cost) * 100, volatility: (prices[t].sells.unit_price - prices[t].buys.unit_price) / prices[t].sells.unit_price * 100,
            score: (profit / 10000) * 8, verdict: "MASS PRODUCTION", supplyQty: prices[t].sells.quantity, type: 'COMMON'
        });
    });

    // Lodestones
    [
        [IDS.CORE_ONYX, IDS.LODE_ONYX], [IDS.CORE_MOLTEN, IDS.LODE_MOLTEN], [IDS.CORE_GLACIAL, IDS.LODE_GLACIAL],
        [IDS.CORE_DESTROYER, IDS.LODE_DESTROYER], [IDS.CORE_CRYSTAL, IDS.LODE_CRYSTAL], [IDS.CORE_CORRUPTED, IDS.LODE_CORRUPTED],
        [IDS.CORE_CHARGED, IDS.LODE_CHARGED]
    ].forEach(([s, t]) => {
        if (!prices[s] || !prices[t]) return;
        const wineCost = 2560; // 25s 60c from Miyani
        const cost = (prices[s].buys.unit_price * 2) + wineCost + dust.buys.unit_price;
        const profit = (prices[t].sells.unit_price * 0.85) - cost;
        results.push({
            sourceId: s, targetId: t, name: IDS_TO_NAME[t], sourceName: IDS_TO_NAME[s],
            costPerUnit: cost, sellPrice: prices[t].sells.unit_price, profitPerCraft: profit,
            roi: (profit / cost) * 100, volatility: (prices[t].sells.unit_price - prices[t].buys.unit_price) / prices[t].sells.unit_price * 100,
            score: (profit / 1000) * 5, verdict: "RARE UPGRADE", supplyQty: prices[t].sells.quantity, type: 'LODE'
        });
    });

    // Runic
    if (prices[IDS.LUCENT_MOTE] && prices[IDS.LUCENT_SHARD]) {
        const s = IDS.LUCENT_MOTE;
        const t = IDS.LUCENT_SHARD;
        const cost = prices[s].buys.unit_price * 10;
        const profit = (prices[t].sells.unit_price * 0.85) - cost;
        results.push({
            sourceId: s, targetId: t, name: IDS_TO_NAME[t], sourceName: IDS_TO_NAME[s],
            costPerUnit: cost, sellPrice: prices[t].sells.unit_price, profitPerCraft: profit,
            roi: (profit / cost) * 100, volatility: (prices[t].sells.unit_price - prices[t].buys.unit_price) / prices[t].sells.unit_price * 100,
            score: (profit / 100) * 2, verdict: "SPECULATIVE", supplyQty: prices[t].sells.quantity, type: 'RUNE'
        });
    }

    return results.sort((a, b) => b.roi - a.roi);
};
