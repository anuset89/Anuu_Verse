import axios from 'axios';

const API_BASE = 'https://api.guildwars2.com/v2';

// 9 Identities as Origins


// Cache structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CACHE: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 300000; // 5 minutes

export const gw2 = {
    async get(endpoint: string) {
        if (CACHE[endpoint] && Date.now() - CACHE[endpoint].timestamp < CACHE_TTL) {
            return CACHE[endpoint].data;
        }
        try {
            const res = await axios.get(`${API_BASE}${endpoint}`);
            CACHE[endpoint] = { data: res.data, timestamp: Date.now() };
            return res.data;
        } catch (error) {
            console.error(`[ANUU_BROKER] API Error on ${endpoint}:`, error);
            throw error;
        }
    },

    async getPrices(ids: number[]) {
        // Chunk requests to avoid URL length limits
        const chunks = [];
        for (let i = 0; i < ids.length; i += 200) {
            chunks.push(ids.slice(i, i + 200));
        }

        const results = await Promise.all(chunks.map(chunk =>
            this.get(`/commerce/prices?ids=${chunk.join(',')}`)
        ));

        return results.flat();
    },

    async getWallet(apiKey: string) {
        if (!apiKey) return [];
        try {
            const res = await axios.get(`${API_BASE}/account/wallet`, {
                headers: { Authorization: `Bearer ${apiKey}` }
            });
            return res.data;
        } catch {
            return []; // Fail gracefully
        }
    },



    async getMaterials(apiKey: string) {
        if (!apiKey) return [];
        try {
            const res = await axios.get(`${API_BASE}/account/materials`, {
                headers: { Authorization: `Bearer ${apiKey}` }
            });
            return res.data;
        } catch {
            return [];
        }
    }
};
