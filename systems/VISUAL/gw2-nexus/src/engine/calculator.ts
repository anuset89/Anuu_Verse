
// --- ANUU VERSUS: MARKET CALCULATION ENGINE ---
// Identities involved: KALI (Risk), THOTH (Knowledge), 4NVSET (Logic)

// --- CONSTANTS ---
export const IDS = {
    ECTO: 19721,
    DUST: 24277,
    SPIRIT_SHARD_VALUE: 5000, // conservative value in copper (50s)

    // T6 Materials
    BLOOD: 24295,
    BONE: 24358,
    CLAW: 24351,
    DUST_T6: 24277,
    FANG: 24357,
    SCALE: 24289,
    TOTEM: 24300,
    VENOM: 24283,

    // T5 Materials
    BLOOD_T5: 24294,
    BONE_T5: 24341,
    CLAW_T5: 24350,
    DUST_T5: 24276,
    FANG_T5: 24356,
    SCALE_T5: 24288,
    TOTEM_T5: 24299,
    VENOM_T5: 24282,
};

export const RECIPES: Record<number, number> = {
    [IDS.BLOOD]: IDS.BLOOD_T5,
    [IDS.BONE]: IDS.BONE_T5,
    [IDS.CLAW]: IDS.CLAW_T5,
    [IDS.FANG]: IDS.FANG_T5,
    [IDS.SCALE]: IDS.SCALE_T5,
    [IDS.TOTEM]: IDS.TOTEM_T5,
    [IDS.VENOM]: IDS.VENOM_T5,
};

export const NAMES: Record<number, { en: string, es: string }> = {
    [IDS.BLOOD]: { en: "Powerful Blood", es: "Sangre Poderosa" },
    [IDS.BONE]: { en: "Ancient Bone", es: "Hueso Antiguo" },
    [IDS.CLAW]: { en: "Vicious Claw", es: "Garra Viciosa" },
    [IDS.FANG]: { en: "Vicious Fang", es: "Colmillo Vicioso" },
    [IDS.SCALE]: { en: "Armored Scale", es: "Escama Blindada" },
    [IDS.TOTEM]: { en: "Elaborate Totem", es: "Tótem Elaborado" },
    [IDS.VENOM]: { en: "Powerful Venom", es: "Veneno Poderoso" },
    [IDS.ECTO]: { en: "Glob of Ectoplasm", es: "Pegote de Ectoplasma" },
    [IDS.DUST]: { en: "Crystalline Dust", es: "Polvo Cristalino" },

    // T5 Names
    [IDS.BLOOD_T5]: { en: "Potent Blood", es: "Sangre Potente" },
    [IDS.BONE_T5]: { en: "Large Bone", es: "Hueso Grande" },
    [IDS.CLAW_T5]: { en: "Sharp Claw", es: "Garra Afilada" },
    [IDS.FANG_T5]: { en: "Large Fang", es: "Colmillo Grande" },
    [IDS.SCALE_T5]: { en: "Large Scale", es: "Escama Grande" },
    [IDS.TOTEM_T5]: { en: "Intricate Totem", es: "Tótem Intrincado" },
    [IDS.VENOM_T5]: { en: "Potent Venom", es: "Veneno Potente" },
    [IDS.DUST_T5]: { en: "Incandescent Dust", es: "Polvo Incandescente" }
};

// --- LOGIC ---

export interface MarketItem {
    id: number;
    buys: { unit_price: number; quantity: number };
    sells: { unit_price: number; quantity: number };
}

export interface AnuuStrategy {
    targetId: number;
    sourceId: number;
    name: string;
    sourceName: string;

    // Costs
    costPerUnit: number; // 50 T5 + 1 T6 + 5 Dust + Others
    sellPrice: number;   // 0.85 * Sell Listing (TP Tax)

    // Results (per promotion ~= 6.85 items on average)
    profitPerCraft: number;
    roi: number;  // Return on Investment %

    // Risk Metrics
    volatility: number; // Spread %
    liquidity: 'HIGH' | 'MEDIUM' | 'LOW';

    // Anuu's Mediation
    verdict: string;
    score: number; // 0-100 Anuu Score
}

// Helper: Format gold
export const formatGold = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const cop = Math.floor(copper % 100);
    return `${gold}g ${silver}s ${cop}c`;
};

// --- CORE CALCULATION ---
export const analyzeMarket = (prices: Record<number, MarketItem>, ectoPrice?: number): AnuuStrategy[] => {
    const strategies: AnuuStrategy[] = [];

    // Base cost of Dust: Either calculate from Ecto salvage or buy directly
    let dustCost = prices[IDS.DUST]?.buys?.unit_price || 0;

    if (ectoPrice && prices[IDS.ECTO]) {
        // Ecto Salvage Logic: ~1.85 Dust per Ecto + Luck
        // Cost = Ecto Price / 1.85 (simplified)
        // If salvaging is cheaper, use that.
        const salvageCost = prices[IDS.ECTO].buys.unit_price / 1.85;
        if (salvageCost < dustCost) {
            dustCost = salvageCost;
        }
    }

    if (!dustCost) return []; // Cannot calculate without dust

    // Iterate T6 recipes
    Object.entries(RECIPES).forEach(([t6IdStr, t5Id]) => {
        const t6Id = parseInt(t6IdStr);
        const t6 = prices[t6Id];
        const t5 = prices[t5Id];

        if (!t6 || !t5) return;

        // Formula: 50 T5 + 1 T6 + 5 Dust + 5 Philo Stone (assume free/spirit shards)
        const costInput = (50 * t5.buys.unit_price) + (1 * t6.buys.unit_price) + (5 * dustCost);

        // Output: Average 6.85 T6 items (statistically proven)
        const outputValue = (6.85 * t6.sells.unit_price) * 0.85; // 15% TP Tax deducted

        const profit = outputValue - costInput;
        const roi = (profit / costInput) * 100;

        // --- ANUU MEDIATION LOGIC ---
        const spread = (t6.sells.unit_price - t6.buys.unit_price) / t6.buys.unit_price;
        const volatility = spread * 100;

        let score = 0;
        let verdict = "NEUTRAL";

        // Score Calculation
        if (roi > 20) score += 40;
        else if (roi > 10) score += 20;
        else score -= 10;

        if (profit > 5000) score += 30; // >50s profit per click

        if (volatility < 10) score += 10; // Stable
        else if (volatility > 30) score -= 20; // Risky

        if (t6.sells.quantity > 50000) score += 10; // High supply usually means liquidity

        // Verdict
        if (score > 60) verdict = "STRONGLY RECOMMENDED";
        else if (score > 30) verdict = "VIABLE";
        else if (score > 0) verdict = "MARGINAL";
        else verdict = "AVOID / LOSS";

        strategies.push({
            targetId: t6Id,
            sourceId: t5Id,
            name: NAMES[t6Id]?.en || "Unknown",
            sourceName: NAMES[t5Id]?.en || "Unknown T5",
            costPerUnit: costInput,
            sellPrice: outputValue,
            profitPerCraft: profit,
            roi,
            volatility,
            liquidity: t6.sells.quantity > 50000 ? 'HIGH' : t6.sells.quantity > 10000 ? 'MEDIUM' : 'LOW',
            verdict,
            score
        });
    });

    return strategies.sort((a, b) => b.score - a.score);
};
