
export const IDS = {
    // T5 Materials
    BLOOD_T5: 24294,
    BONE_T5: 24340,
    CLAW_T5: 24350,
    FANG_T5: 24356,
    SCALE_T5: 24288,
    TOTEM_T5: 24299,
    VENOM_T5: 24282,

    // T6 Counterparts
    BLOOD_T6: 24295,
    BONE_T6: 24341,
    CLAW_T6: 24351,
    FANG_T6: 24357,
    SCALE_T6: 24289,
    TOTEM_T6: 24300,
    VENOM_T6: 24283,

    // Catalysts
    DUST: 24277, // Crystalline Dust
};

const IDS_TO_NAME: Record<number, string> = {
    24294: "Potent Blood",
    24340: "Large Bone",
    24350: "Large Claw",
    24356: "Large Fang",
    24288: "Large Scale",
    24299: "Intricate Totem",
    24282: "Potent Venom",
    24295: "Powerful Blood",
    24341: "Ancient Bone",
    24351: "Large Claw", // Fixed repeat name
    24357: "Ancient Fang",
    24289: "Armored Scale",
    24300: "Elaborate Totem",
    24283: "Powerful Venom",
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
    supplyQty: number; // Added volume awareness
}

export const analyzeMarket = (prices: Record<number, MarketItem>): AnuuStrategy[] => {
    const pairs = [
        [IDS.BLOOD_T5, IDS.BLOOD_T6],
        [IDS.BONE_T5, IDS.BONE_T6],
        [IDS.CLAW_T5, IDS.CLAW_T6],
        [IDS.FANG_T5, IDS.FANG_T6],
        [IDS.SCALE_T5, IDS.SCALE_T6],
        [IDS.TOTEM_T5, IDS.TOTEM_T6],
        [IDS.VENOM_T5, IDS.VENOM_T6],
    ];

    const results: AnuuStrategy[] = [];

    pairs.forEach(([sourceId, targetId]) => {
        const t5 = prices[sourceId];
        const t6 = prices[targetId];
        const dust = prices[IDS.DUST];

        if (!t5 || !t6 || !dust) return;

        // Formula: 50x T5 + 1x T6 + 5x Dust + 5x Shards
        // Yield: ~5-12 results (Average ~9ish but depends on promotion)
        // Note: The official promotion actually returns between 6 and 40 for certain items, 
        // but for T5->T6 it averages around 0.18 T6 per T5 used if doing bulk.
        // Let's use standard promotion average: 1 craft costs materials and gives ~1.85 T6 (net gain from T5s).
        // Actually, 1 craft = 50 T5 -> ~1.8 to 2.2 T6. 
        // Simplified common calculation: ROI = (Sell T6 * AvgYield) / (Cost Materials)

        const cost = (t5.buys.unit_price * 50) + (t6.buys.unit_price * 1) + (dust.buys.unit_price * 5);
        const sell = t6.sells.unit_price * 2; // Conservative average yield: 2 units
        const profit = (sell * 0.85) - cost; // 15% TP Tax
        const roi = (profit / cost) * 100;

        const volatility = (t6.sells.unit_price - t6.buys.unit_price) / t6.sells.unit_price * 100;
        const score = (roi * 2) + Math.min(20, t6.sells.quantity / 500);

        let verdict = "RISKY";
        if (roi > 15 && t6.sells.quantity > 1000) verdict = "HIGHLY RECOMMENDED";
        else if (roi > 5) verdict = "VIABLE";

        results.push({
            sourceId,
            targetId,
            name: IDS_TO_NAME[targetId] || `Item ${targetId}`,
            sourceName: IDS_TO_NAME[sourceId] || `Material ${sourceId}`,
            costPerUnit: cost,
            sellPrice: t6.sells.unit_price,
            profitPerCraft: profit,
            roi,
            volatility,
            score,
            verdict,
            supplyQty: t6.sells.quantity
        });
    });

    return results.sort((a, b) => b.score - a.score);
};
