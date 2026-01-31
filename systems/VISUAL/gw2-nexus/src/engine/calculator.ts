
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
    WINE: 19632, // Bottle of Elonian Wine
    CRYSTAL: 19925, // Mystic Crystal
    STONE: 19673,  // Philosopher's Stone

    // Industrial / Research
    RESEARCH_NOTE: 94684,
    ANTIQUE_STONE: 95982,
    UNUSUAL_COIN: 95914,
    ANCIENT_SCROLL: 95856,
    MITHRIL_EARRING: 13357,
};

export const IDS_TO_NAME: Record<number, string> = {
    // T5
    24294: "Powerful Blood", 24340: "Ancient Bone", 24350: "Vicious Claw", 24356: "Vicious Fang",
    24288: "Armored Scale", 24299: "Elaborate Totem", 24282: "Powerful Venom Sac", 24276: "Crystalline Dust",
    // T6
    24295: "Powerful Blood", 24341: "Ancient Bone", 24351: "Vicious Claw", 24357: "Vicious Fang",
    24289: "Armored Scale", 24300: "Elaborate Totem", 24283: "Powerful Venom Sac", 24277: "Crystalline Dust",
    // T5 Common
    19702: "Mithril Ore", 19722: "Elder Wood Log", 19729: "Thick Leather Section", 19748: "Silk Scrap",
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
    19925: "Mystic Crystal",
    19632: "Bottle of Elonian Wine",
    // T2 Materials
    24290: "Vial of Blood",
    24284: "Tiny Scales",
    94684: "Research Note",
    95982: "Antique Summoning Stone",
    95914: "Unusual Coin",
    95856: "Ancient Scroll",
    13357: "Mithril Earring",
};

export const IDS_TO_NAME_ES: Record<number, string> = {
    94684: "Nota de Investigación",
    95982: "Piedra de Invocación Antigua",
    95914: "Moneda Inusual",
    95856: "Pergamino Antiguo",
    13357: "Pendiente de Mithril",
    24295: "Sangre Poderosa", 24341: "Hueso Antiguo", 24351: "Garra Poderosa", 24357: "Colmillo Antiguo",
    24289: "Escama Blindada", 24300: "Tótem Elaborado", 24283: "Veneno Poderoso",
    19703: "Mineral de Oricalco", 19725: "Madera Antigua", 19732: "Cuero Endurecido", 19745: "Gasa",
    24304: "Núcleo de Ónix", 24305: "Piedra de Imán de Ónix",
    24329: "Núcleo Fundido", 24330: "Piedra de Imán Fundida",
    24334: "Núcleo Glacial", 24335: "Piedra de Imán Glacial",
    24324: "Núcleo de Destructor", 24325: "Piedra de Imán de Destructor",
    24320: "Núcleo de Cristal", 24321: "Piedra de Imán de Cristal",
    24339: "Núcleo Corrupto", 24338: "Piedra de Imán Corrupta",
    24309: "Núcleo Cargado", 24310: "Piedra de Imán Cargada",
    85731: "Mota Luciente", 85750: "Fragmento Luciente",
    19632: "Botella de Vino de Elona",
    19925: "Cristal Místico",
    19673: "Piedra Filosofal",
    19721: "Globo de Ectoplasma",
    19976: "Moneda Mística",
    19675: "Trébol Místico",
    24277: "Polvo Cristalino"
};

export const getTranslatedName = (id: number, fallback: string, isEng: boolean) => {
    if (isEng) return fallback;
    return IDS_TO_NAME_ES[id] || fallback;
};

export interface AnuuStrategy {
    id: string;
    name: string;
    type: 'COMMON' | 'FINE' | 'LODE' | 'RUNE' | 'INDUSTRIAL';
    sourceId: number;
    sourceName: string;
    targetId: number;
    profitPerCraft: number;
    roi: number;
    supplyQty: number;
    sellPrice: number;
    recipe?: string;
    verdict?: string;
}

export interface MarketItem {
    id: number;
    buys: { unit_price: number };
    sells: { unit_price: number; quantity: number };
}

export const analyzeMarket = (prices: Record<number, MarketItem>): AnuuStrategy[] => {
    const strategies: AnuuStrategy[] = [];

    // 1. T5 to T6 Fine Materials (Promotion)
    const types = ['BLOOD', 'BONE', 'CLAW', 'FANG', 'SCALE', 'TOTEM', 'VENOM', 'DUST'] as const;
    types.forEach(type => {
        const idT5 = IDS[`${type}_T5` as keyof typeof IDS];
        const idT6 = IDS[`${type}_T6` as keyof typeof IDS];
        const p5 = prices[idT5];
        const p6 = prices[idT6];
        const pDust = prices[IDS.DUST];

        if (p5 && p6 && pDust) {
            const cost = (p5.buys.unit_price * 50) + (pDust.buys.unit_price * 5) + (p6.buys.unit_price * 1);
            const revenue = p6.sells.unit_price * 7;
            const profit = revenue * 0.85 - cost;

            strategies.push({
                id: `fine-${type}`,
                name: `${type} T6 Promotion`,
                type: 'FINE',
                sourceId: idT5,
                sourceName: `${type} T5`,
                targetId: idT6,
                profitPerCraft: profit,
                roi: profit / cost,
                supplyQty: p5.sells.quantity,
                sellPrice: p6.sells.unit_price,
                verdict: 'UPGRADE',
                recipe: '50 T5 + 1 T6 + 5 Dust + 5 Stones -> ~7 T6'
            });
        }
    });

    // 2. Common Materials (Promotion)
    const commonTypes = ['ORE', 'WOOD', 'LEATHER', 'CLOTH'] as const;
    commonTypes.forEach(type => {
        const idT5 = IDS[`${type}_T5` as keyof typeof IDS];
        const idT6 = IDS[`${type}_T6` as keyof typeof IDS];
        const p5 = prices[idT5];
        const p6 = prices[idT6];
        const pDust = prices[IDS.DUST];

        if (p5 && p6 && pDust) {
            const cost = (p5.buys.unit_price * 250) + (pDust.buys.unit_price * 5) + (p6.buys.unit_price * 1);
            const revenue = p6.sells.unit_price * 22; // Yield for commons
            const profit = revenue * 0.85 - cost;

            strategies.push({
                id: `common-${type}`,
                name: `${type} T6 Promotion`,
                type: 'COMMON',
                sourceId: idT5,
                sourceName: `${type} T5`,
                targetId: idT6,
                profitPerCraft: profit,
                roi: profit / cost,
                supplyQty: p5.sells.quantity,
                sellPrice: p6.sells.unit_price,
                verdict: 'VOLUME',
                recipe: '250 T5 + 1 T6 + 5 Dust + 5 Stones -> ~22 T6'
            });
        }
    });

    // 3. Cores to Lodestones
    const lodeTypes = ['ONYX', 'MOLTEN', 'GLACIAL', 'DESTROYER', 'CRYSTAL', 'CORRUPTED', 'CHARGED'] as const;
    lodeTypes.forEach(type => {
        const idCore = IDS[`CORE_${type}` as keyof typeof IDS];
        const idLode = IDS[`LODE_${type}` as keyof typeof IDS];
        const pCore = prices[idCore];
        const pLode = prices[idLode];
        const pDust = prices[IDS.DUST];

        if (pCore && pLode && pDust) {
            const cost = (pCore.buys.unit_price * 2) + (pDust.buys.unit_price * 1) + 2560; // 25s 60c for wine
            const revenue = pLode.sells.unit_price * 1;
            const profit = revenue * 0.85 - cost;

            strategies.push({
                id: `lode-${type}`,
                name: `${type} Lodestone`,
                type: 'LODE',
                sourceId: idCore,
                sourceName: `${type} Core`,
                targetId: idLode,
                profitPerCraft: profit,
                roi: profit / cost,
                supplyQty: pCore.sells.quantity,
                sellPrice: pLode.sells.unit_price,
                verdict: 'UPGRADE',
                recipe: '2 Cores + 1 Dust + 1 Wine + 1 Crystal -> 1 Lodestone'
            });
        }
    });

    // 4. Lucent Mote Optimization (Runic)
    const pMote = prices[IDS.LUCENT_MOTE];
    const pShard = prices[IDS.LUCENT_SHARD];
    if (pMote && pShard) {
        const cost = pMote.buys.unit_price * 10;
        const revenue = pShard.sells.unit_price;
        const profit = revenue * 0.85 - cost;

        strategies.push({
            id: 'runic-lucent',
            name: 'Lucent Shard Processing',
            type: 'RUNE',
            sourceId: IDS.LUCENT_MOTE,
            sourceName: 'Lucent Mote',
            targetId: IDS.LUCENT_SHARD,
            profitPerCraft: profit,
            roi: profit / cost,
            supplyQty: pMote.sells.quantity,
            sellPrice: pShard.sells.unit_price,
            verdict: 'WEEKLY',
            recipe: '10 Motes -> 1 Shard'
        });
    }

    // 5. Industrial: Research Notes via Mithril Earrings
    const pMithril = prices[IDS.ORE_T5];
    if (pMithril) {
        // Mithril Earring cost (simplified: 2 mithril ingots ~ 4 ore + 1 hook)
        // Profit is calculated based on "potential value" of a research note (approx 1s-2s)
        const cost = pMithril.buys.unit_price * 4;
        const profit = 150 - cost; // Assuming 1s 50c value per note

        strategies.push({
            id: 'industrial-research',
            name: 'Research Notes (Earrings)',
            type: 'INDUSTRIAL',
            sourceId: IDS.ORE_T5,
            sourceName: 'Mithril Ore',
            targetId: IDS.RESEARCH_NOTE,
            profitPerCraft: profit,
            roi: profit / cost,
            supplyQty: pMithril.sells.quantity,
            sellPrice: 150, // Potential value per note
            verdict: 'RESEARCH',
            recipe: '4 Ore -> 1 Research Note'
        });
    }

    return strategies.sort((a, b) => b.roi - a.roi);
};
