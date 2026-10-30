import apiClient from '../api/client';
import mockStorage from './mockStorage';

/**
 * Shop / Organization Settings API Service
 * Transparently falls back to client storage when backend routes are pending.
 */
export const shopService = {
  async getShop() {
    try {
      const res = await apiClient.get('/shop');
      return res.data || res;
    } catch (err) {
      const shop = mockStorage.getShop();
      return {
        success: true,
        data: { shop },
      };
    }
  },

  async updateShop(payload) {
    try {
      const res = await apiClient.put('/shop', payload);
      return res.data || res;
    } catch (err) {
      const shop = mockStorage.saveShop(payload);
      return {
        success: true,
        data: { shop },
      };
    }
  },
};

export default shopService;
