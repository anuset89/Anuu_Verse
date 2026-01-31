import axios from 'axios';

// Use proxy in development to bypass CORS, direct API in production
const isDev = import.meta.env.DEV;
const API_BASE = isDev ? '/gw2api' : 'https://api.guildwars2.com/v2';

export interface MarketItem {
    id: number;
    whitelisted: boolean;
    buys: { quantity: number; unit_price: number };
    sells: { quantity: number; unit_price: number };
}

// Helper: In production, use query param for auth (avoids CORS preflight)
// In development, use Authorization header (works with proxy)
const authConfig = (apiKey: string) => {
    const key = apiKey.trim();
    if (isDev) {
        return { headers: { Authorization: `Bearer ${key}` } };
    } else {
        // Production: use access_token query param to avoid CORS issues
        return { params: { access_token: key } };
    }
};

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = {
    PRICES: 30 * 1000,      // 30 seconds
    ACCOUNT: 15 * 1000,     // 15 seconds (reduced for responsiveness)
    ITEMS: 5 * 60 * 1000,   // 5 minutes (static)
    TOKEN: 60 * 1000        // 1 minute
};

const getCached = (key: string, ttl: number) => {
    const item = cache.get(key);
    if (item && (Date.now() - item.timestamp < ttl)) {
        return item.data;
    }
    return null;
};

const setCache = (key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
};

export const gw2 = {
    async getPrices(ids: number[], force = false) {
        if (!ids.length) return [];
        const key = `prices-${ids.join(',')}`;
        if (!force) {
            const cached = getCached(key, CACHE_TTL.PRICES);
            if (cached) return cached;
        }

        try {
            const res = await axios.get(`${API_BASE}/commerce/prices?ids=${ids.join(',')}`);
            setCache(key, res.data);
            return res.data;
        } catch (e) {
            console.error("[GW2 API] Price Error", e);
            return [];
        }
    },

    async getBank(apiKey: string, force = false) {
        const key = `bank-${apiKey}`;
        if (!force) {
            const cached = getCached(key, CACHE_TTL.ACCOUNT);
            if (cached) return cached;
        }
        try {
            const url = isDev
                ? `${API_BASE}/account/bank`
                : `${API_BASE}/account/bank?access_token=${apiKey.trim()}`;
            const config = isDev ? authConfig(apiKey) : {};
            const res = await axios.get(url, config);
            setCache(key, res.data);
            return res.data;
        } catch (e) {
            console.error("[GW2 API] Bank Error", e);
            return [];
        }
    },

    async getMaterials(apiKey: string, force = false) {
        const key = `materials-${apiKey}`;
        if (!force) {
            const cached = getCached(key, CACHE_TTL.ACCOUNT);
            if (cached) return cached;
        }
        try {
            const url = isDev
                ? `${API_BASE}/account/materials`
                : `${API_BASE}/account/materials?access_token=${apiKey.trim()}`;
            const config = isDev ? authConfig(apiKey) : {};
            const res = await axios.get(url, config);
            setCache(key, res.data);
            return res.data;
        } catch (e) {
            console.error("[GW2 API] Materials Error", e);
            return [];
        }
    },

    async getWallet(apiKey: string, force = false) {
        const key = `wallet-${apiKey}`;
        if (!force) {
            const cached = getCached(key, CACHE_TTL.ACCOUNT);
            if (cached) return cached;
        }
        try {
            const url = isDev
                ? `${API_BASE}/account/wallet`
                : `${API_BASE}/account/wallet?access_token=${apiKey.trim()}`;
            const config = isDev ? authConfig(apiKey) : {};
            const res = await axios.get(url, config);
            setCache(key, res.data);
            return res.data;
        } catch (e) {
            console.error("[GW2 API] Wallet Error", e);
            return [];
        }
    },

    async getTokenInfo(apiKey: string) {
        const key = `token-${apiKey}`;
        const cached = getCached(key, CACHE_TTL.TOKEN);
        if (cached) return cached;

        try {
            const url = isDev
                ? `${API_BASE}/tokeninfo`
                : `${API_BASE}/tokeninfo?access_token=${apiKey.trim()}`;
            const config = isDev ? authConfig(apiKey) : {};
            const res = await axios.get(url, config);
            setCache(key, res.data);
            return res.data;
        } catch {
            console.warn("[GW2 API] Token Info failed, using fallback...");
            return { permissions: ['account', 'wallet', 'inventories', 'characters'] }; // Optimistic fallback
        }
    },

    async getCharacters(apiKey: string, force = false) {
        const key = `chars-${apiKey}`;
        if (!force) {
            const cached = getCached(key, CACHE_TTL.ACCOUNT);
            if (cached) return cached;
        }
        try {
            const url = isDev
                ? `${API_BASE}/characters?ids=all`
                : `${API_BASE}/characters?ids=all&access_token=${apiKey.trim()}`;
            const config = isDev ? authConfig(apiKey) : {};
            const res = await axios.get(url, config);
            setCache(key, res.data);
            return res.data;
        } catch (e) {
            console.error("[GW2 API] Characters Error", e);
            return [];
        }
    },

    async getSharedInventory(apiKey: string, force = false) {
        const key = `shared-${apiKey}`;
        if (!force) {
            const cached = getCached(key, CACHE_TTL.ACCOUNT);
            if (cached) return cached;
        }
        try {
            const url = isDev
                ? `${API_BASE}/account/inventory`
                : `${API_BASE}/account/inventory?access_token=${apiKey.trim()}`;
            const config = isDev ? authConfig(apiKey) : {};
            const res = await axios.get(url, config);
            setCache(key, res.data);
            return res.data;
        } catch (e) {
            console.error("[GW2 API] Shared Inventory Error", e);
            return [];
        }
    },

    async getItems(ids: number[]) {
        if (!ids.length) return [];
        // Static data, cache aggressively
        const key = `items-${ids.join(',')}`;
        const cached = getCached(key, CACHE_TTL.ITEMS);
        if (cached) return cached;

        try {
            // GW2 API allows up to 200 IDs at once
            const res = await axios.get(`${API_BASE}/items?ids=${ids.join(',')}`);
            setCache(key, res.data);
            return res.data;
        } catch (e) {
            console.error("[GW2 API] Items Error", e);
            return [];
        }
    }
};
