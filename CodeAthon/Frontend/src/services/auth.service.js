import apiClient from '../api/client';

/**
 * Authentication API Service
 * Centralizes all frontend network requests for authentication and account management.
 */
export const authService = {
  /**
   * Register a new business owner and their shop.
   * Sets HTTP-only authentication cookie on the client.
   * @param {object} payload - { name, email, password, confirmPassword, businessName, state }
   * @returns {Promise<{ user: object, shop: object, token: string }>}
   */
  async signup(payload) {
    const res = await apiClient.post('/auth/signup', payload);
    return res.data;
  },

  /**
   * Authenticate existing user with email and password.
   * Sets HTTP-only authentication cookie on the client.
   * @param {object} credentials - { email, password }
   * @returns {Promise<{ user: object, shop: object, token: string }>}
   */
  async login(credentials) {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  /**
   * Clear the active session and evict JWT cookie.
   * @returns {Promise<void>}
   */
  async logout() {
    return apiClient.post('/auth/logout');
  },

  /**
   * Fetch current session profile and active shop association.
   * @returns {Promise<{ user: object, shop: object }>}
   */
  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  /**
   * Request a 6-digit password reset OTP to user email.
   * @param {string} email
   * @returns {Promise<{ message: string }>}
   */
  async forgotPassword(email) {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res;
  },

  /**
   * Verify 6-digit OTP code to acquire temporary reset token.
   * @param {object} payload - { email, otp }
   * @returns {Promise<{ resetToken: string, message: string }>}
   */
  async verifyOtp({ email, otp }) {
    const res = await apiClient.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  /**
   * Submit new password along with verified resetToken.
   * @param {object} payload - { email, resetToken, password, confirmPassword }
   * @returns {Promise<{ message: string }>}
   */
  async resetPassword(payload) {
    const res = await apiClient.post('/auth/reset-password', payload);
    return res;
  },
};

export default authService;
