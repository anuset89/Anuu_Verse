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

export const gw2 = {
    async getPrices(ids: number[]) {
        if (!ids.length) return [];
        try {
            const res = await axios.get(`${API_BASE}/commerce/prices?ids=${ids.join(',')}`);
            return res.data;
        } catch (e) {
            console.error("GW2 API Price Error", e);
            return [];
        }
    },

    async getMaterials(apiKey: string) {
        try {
            const res = await axios.get(`${API_BASE}/account/materials`, {
                headers: { Authorization: `Bearer ${apiKey.trim()}` }
            });
            return res.data;
        } catch (e) {
            console.error("GW2 API Materials Error", e);
            return [];
        }
    },

    async getWallet(apiKey: string) {
        try {
            const res = await axios.get(`${API_BASE}/account/wallet`, {
                headers: { Authorization: `Bearer ${apiKey.trim()}` }
            });
            return res.data;
        } catch (e) {
            console.error("GW2 API Wallet Error", e);
            return [];
        }
    },

    async getTokenInfo(apiKey: string) {
        try {
            const res = await axios.get(`${API_BASE}/tokeninfo`, {
                headers: { Authorization: `Bearer ${apiKey.trim()}` }
            });
            return res.data;
        } catch {
            console.warn("Token Info failed, using fallback...");
            return { permissions: ['account', 'wallet', 'inventories'] }; // Fallback optimista
        }
    }
};
