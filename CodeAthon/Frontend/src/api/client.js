import axios from 'axios';

/**
 * Centralized Axios API Client
 *
 * Configured with:
 * - baseURL from `import.meta.env.VITE_API_URL` (fallback to http://localhost:5001/api)
 * - `withCredentials: true` to transmit HTTP-only JWT cookies
 * - Response interceptor that normalizes API responses and extracts error messages
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor for consistent response formatting
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    let errors = [];

    if (error.response) {
      const data = error.response.data;
      message = data?.message || `Request failed with status ${error.response.status}`;
      errors = data?.errors || [];

      // Only dispatch session expiry event for protected endpoints during an active workflow
      const isAuthMeCall = error.config?.url?.includes('/auth/me');
      const isPublicPath = ['/login', '/signup', '/forgot-password', '/verify-otp', '/reset-password'].some(
        (path) => window.location.pathname.startsWith(path)
      );

      if (error.response.status === 401 && !isAuthMeCall && !isPublicPath) {
        window.dispatchEvent(new CustomEvent('auth:expired', { detail: { message } }));
      }
    } else if (error.request) {
      message = 'Unable to connect to the billing server. Please check your connection.';
    } else {
      message = error.message;
    }

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.errors = errors;
    normalizedError.originalError = error;

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
