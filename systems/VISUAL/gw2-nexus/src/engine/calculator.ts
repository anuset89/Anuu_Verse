
export const IDS = {
    // T5 Fine
    BLOOD_T5: 24294,
    BONE_T5: 24340,
    CLAW_T5: 24350,
    FANG_T5: 24356,
    SCALE_T5: 24288,
    TOTEM_T5: 24299,
    VENOM_T5: 24282,
    DUST_T5: 24276,

    // T6 Fine
    BLOOD_T6: 24295,
    BONE_T6: 24341,
    CLAW_T6: 24351,
    FANG_T6: 24357,
    SCALE_T6: 24289,
    TOTEM_T6: 24300,
    VENOM_T6: 24283,
    DUST_T6: 24277,

    // T5 Common
    ORE_T5: 19702,
    WOOD_T5: 19722,
    LEATHER_T5: 19729,
    CLOTH_T5: 19748,

    // T6 Common
    ORE_T6: 19703,
    WOOD_T6: 19725,
    LEATHER_T6: 19732,
    CLOTH_T6: 19745,

    // Runic / Runas
    LUCENT_MOTE: 85731,
    LUCENT_SHARD: 85750,
    CHARM_SKILL: 86171,
    CHARM_POTENCE: 86121,
    CHARM_BRILLIANCE: 86057,
    SYMBOL_CONTROL: 85689,
    SYMBOL_ENHANCEMENT: 85705,
    SYMBOL_PAIN: 85700,

    // Catalyst
    DUST: 24277,
};

const IDS_TO_NAME: Record<number, string> = {
    24294: "Potent Blood",
    24340: "Large Bone",
    24350: "Large Claw",
    24356: "Large Fang",
    24288: "Large Scale",
    24299: "Intricate Totem",
    24282: "Potent Venom",
    24276: "Incandescent Dust",
    24295: "Powerful Blood",
    24341: "Ancient Bone",
    24351: "Powerful Claw",
    24357: "Ancient Fang",
    24289: "Armored Scale",
    24300: "Elaborate Totem",
    24283: "Powerful Venom",
    24277: "Crystalline Dust",
    19702: "Mithril Ore",
    19722: "Elder Wood Log",
    19729: "Thick Leather Section",
    19748: "Silk Scrap",
    19703: "Orichalcum Ore",
    19725: "Ancient Wood Log",
    19732: "Hardened Leather Section",
    19745: "Gossamer Scrap",
    85731: "Lucent Mote",
    85750: "Lucent Shard",
    86171: "Charm of Skill",
    86121: "Charm of Potence",
    86057: "Charm of Brilliance",
    85689: "Symbol of Control",
    85705: "Symbol of Enhancement",
    85700: "Symbol of Pain",
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
    type: 'FINE' | 'COMMON' | 'RUNE';
}

export const analyzeMarket = (prices: Record<number, MarketItem>): AnuuStrategy[] => {
    const finePairs = [
        [IDS.BLOOD_T5, IDS.BLOOD_T6],
        [IDS.BONE_T5, IDS.BONE_T6],
        [IDS.CLAW_T5, IDS.CLAW_T6],
        [IDS.FANG_T5, IDS.FANG_T6],
        [IDS.SCALE_T5, IDS.SCALE_T6],
        [IDS.TOTEM_T5, IDS.TOTEM_T6],
        [IDS.VENOM_T5, IDS.VENOM_T6],
        [IDS.DUST_T5, IDS.DUST_T6],
    ];

    const commonPairs = [
        [IDS.ORE_T5, IDS.ORE_T6],
        [IDS.WOOD_T5, IDS.WOOD_T6],
        [IDS.LEATHER_T5, IDS.LEATHER_T6],
        [IDS.CLOTH_T5, IDS.CLOTH_T6],
    ];



    const results: AnuuStrategy[] = [];

    finePairs.forEach(([sourceId, targetId]) => {
        const t5 = prices[sourceId];
        const t6 = prices[targetId];
        const dust = prices[IDS.DUST];
        if (!t5 || !t6 || !dust) return;
        const cost = (t5.buys.unit_price * 50) + (t6.buys.unit_price * 1) + (dust.buys.unit_price * 5);
        const sell = t6.sells.unit_price * 7;
        const profit = (sell * 0.85) - cost;
        const roi = (profit / cost) * 100;
        results.push({
            sourceId, targetId,
            name: IDS_TO_NAME[targetId] || `Item ${targetId}`,
            sourceName: IDS_TO_NAME[sourceId] || `Material ${sourceId}`,
            costPerUnit: cost, sellPrice: t6.sells.unit_price, profitPerCraft: profit,
            roi, volatility: (t6.sells.unit_price - t6.buys.unit_price) / t6.sells.unit_price * 100,
            score: (roi * 2) + Math.min(20, t6.sells.quantity / 500),
            verdict: roi > 15 ? "HIGH PROD" : roi > 5 ? "VIABLE" : "STABLE",
            supplyQty: t6.sells.quantity, type: 'FINE'
        });
    });

    commonPairs.forEach(([sourceId, targetId]) => {
        const t5 = prices[sourceId];
        const t6 = prices[targetId];
        const dust = prices[IDS.DUST];
        if (!t5 || !t6 || !dust) return;
        const cost = (t5.buys.unit_price * 250) + (t6.buys.unit_price * 1) + (dust.buys.unit_price * 5);
        const sell = t6.sells.unit_price * 22;
        const profit = (sell * 0.85) - cost;
        const roi = (profit / cost) * 100;
        results.push({
            sourceId, targetId,
            name: IDS_TO_NAME[targetId] || `Item ${targetId}`,
            sourceName: IDS_TO_NAME[sourceId] || `Material ${sourceId}`,
            costPerUnit: cost, sellPrice: t6.sells.unit_price, profitPerCraft: profit,
            roi, volatility: (t6.sells.unit_price - t6.buys.unit_price) / t6.sells.unit_price * 100,
            score: (roi * 2) + Math.min(20, t6.sells.quantity / 5000),
            verdict: roi > 12 ? "BULK DEAL" : roi > 3 ? "STABLE" : "NARROW",
            supplyQty: t6.sells.quantity, type: 'COMMON'
        });
    });

    // Runes (Promotion Lucent Motes to Shards)
    if (prices[IDS.LUCENT_MOTE] && prices[IDS.LUCENT_SHARD]) {
        const mote = prices[IDS.LUCENT_MOTE];
        const shard = prices[IDS.LUCENT_SHARD];
        const cost = mote.buys.unit_price * 10; // 10 motes = 1 shard
        const profit = (shard.sells.unit_price * 0.85) - cost;
        const roi = (profit / cost) * 100;
        results.push({
            sourceId: IDS.LUCENT_MOTE, targetId: IDS.LUCENT_SHARD,
            name: "Lucent Shard", sourceName: "Lucent Mote",
            costPerUnit: cost, sellPrice: shard.sells.unit_price, profitPerCraft: profit,
            roi, volatility: (shard.sells.unit_price - shard.buys.unit_price) / shard.sells.unit_price * 100,
            score: roi + 10, verdict: roi > 5 ? "RUNIC PROFIT" : "UTILITY",
            supplyQty: shard.sells.quantity, type: 'RUNE'
        });
    }

    return results.sort((a, b) => b.score - a.score);
};
