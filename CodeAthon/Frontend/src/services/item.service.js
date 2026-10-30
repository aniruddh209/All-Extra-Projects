import apiClient from '../api/client';
import mockStorage from './mockStorage';

/**
 * Items / Products API Service
 * Transparently falls back to client storage when backend routes are pending.
 */
export const itemService = {
  async getItems(params = {}) {
    try {
      const res = await apiClient.get('/items', { params });
      return res.data || res;
    } catch (err) {
      const items = mockStorage.getItems(params.search || '', params.gstPercent);
      return {
        success: true,
        data: {
          items,
          pagination: {
            page: params.page || 1,
            totalPages: 1,
            total: items.length,
            limit: params.limit || 10,
          },
        },
      };
    }
  },

  async getItemById(id) {
    try {
      const res = await apiClient.get(`/items/${id}`);
      return res.data || res;
    } catch (err) {
      const item = mockStorage.getItemById(id);
      return {
        success: true,
        data: { item },
      };
    }
  },

  async createItem(payload) {
    try {
      const res = await apiClient.post('/items', payload);
      return res.data || res;
    } catch (err) {
      const item = mockStorage.saveItem(payload);
      return {
        success: true,
        data: { item },
      };
    }
  },

  async updateItem(id, payload) {
    try {
      const res = await apiClient.put(`/items/${id}`, payload);
      return res.data || res;
    } catch (err) {
      const item = mockStorage.saveItem({ ...payload, _id: id });
      return {
        success: true,
        data: { item },
      };
    }
  },

  async deleteItem(id) {
    try {
      const res = await apiClient.delete(`/items/${id}`);
      return res.data || res;
    } catch (err) {
      mockStorage.deleteItem(id);
      return { success: true };
    }
  },
};

export default itemService;
