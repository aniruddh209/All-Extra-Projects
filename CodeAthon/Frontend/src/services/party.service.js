import apiClient from '../api/client';
import mockStorage from './mockStorage';

/**
 * Party / Customer API Service
 * Transparently falls back to client storage when backend routes are pending.
 */
export const partyService = {
  async getParties(params = {}) {
    try {
      const res = await apiClient.get('/parties', { params });
      return res.data || res;
    } catch (err) {
      const parties = mockStorage.getParties(params.search || '');
      return {
        success: true,
        data: {
          parties,
          pagination: {
            page: params.page || 1,
            totalPages: 1,
            total: parties.length,
            limit: params.limit || 10,
          },
        },
      };
    }
  },

  async getPartyById(id) {
    try {
      const res = await apiClient.get(`/parties/${id}`);
      return res.data || res;
    } catch (err) {
      const party = mockStorage.getPartyById(id);
      return {
        success: true,
        data: { party },
      };
    }
  },

  async createParty(payload) {
    try {
      const res = await apiClient.post('/parties', payload);
      return res.data || res;
    } catch (err) {
      const party = mockStorage.saveParty(payload);
      return {
        success: true,
        data: { party },
      };
    }
  },

  async updateParty(id, payload) {
    try {
      const res = await apiClient.put(`/parties/${id}`, payload);
      return res.data || res;
    } catch (err) {
      const party = mockStorage.saveParty({ ...payload, _id: id });
      return {
        success: true,
        data: { party },
      };
    }
  },

  async deleteParty(id) {
    try {
      const res = await apiClient.delete(`/parties/${id}`);
      return res.data || res;
    } catch (err) {
      mockStorage.deleteParty(id);
      return { success: true };
    }
  },

  async getPartyBills(id, params = {}) {
    try {
      const res = await apiClient.get(`/parties/${id}/bills`, { params });
      return res.data || res;
    } catch (err) {
      const bills = mockStorage.getBills().filter((b) => b.partyId === id);
      return {
        success: true,
        data: { bills },
      };
    }
  },
};

export default partyService;
