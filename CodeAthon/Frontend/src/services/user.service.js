import apiClient from '../api/client';
import mockStorage from './mockStorage';

/**
 * User / Team Management API Service
 * Transparently falls back to client storage when backend routes are pending.
 */
export const userService = {
  async getUsers(params = {}) {
    try {
      const res = await apiClient.get('/users', { params });
      return res.data || res;
    } catch (err) {
      const users = mockStorage.getUsers();
      return {
        success: true,
        data: { users },
      };
    }
  },

  async getUserById(id) {
    try {
      const res = await apiClient.get(`/users/${id}`);
      return res.data || res;
    } catch (err) {
      const user = mockStorage.getUserById(id);
      return {
        success: true,
        data: { user },
      };
    }
  },

  async createUser(payload) {
    try {
      const res = await apiClient.post('/users', payload);
      return res.data || res;
    } catch (err) {
      const user = mockStorage.saveUser(payload);
      return {
        success: true,
        data: { user },
      };
    }
  },

  async updateUser(id, payload) {
    try {
      const res = await apiClient.put(`/users/${id}`, payload);
      return res.data || res;
    } catch (err) {
      const user = mockStorage.saveUser({ ...payload, _id: id });
      return {
        success: true,
        data: { user },
      };
    }
  },

  async toggleStatus(id, isActive) {
    try {
      const res = await apiClient.patch(`/users/${id}/status`, { isActive });
      return res.data || res;
    } catch (err) {
      mockStorage.toggleUserStatus(id, isActive);
      return { success: true };
    }
  },

  async deleteUser(id) {
    try {
      const res = await apiClient.delete(`/users/${id}`);
      return res.data || res;
    } catch (err) {
      mockStorage.deleteUser(id);
      return { success: true };
    }
  },
};

export default userService;
