import axios from 'axios';

/**
 * Centralized Axios instance for all API calls.
 *
 * Configuration:
 * - baseURL from VITE_API_URL environment variable
 * - withCredentials: true — sends HTTP-only JWT cookies with every request
 * - JSON content type
 *
 * All service files (auth.service.js, party.service.js, etc.)
 * import this instance instead of creating their own.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Response interceptor.
 * Extracts the response data directly so service files
 * don't need to destructure res.data everywhere.
 *
 * On error, extracts the server's error message if available,
 * or falls back to a generic message.
 */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Extract the API error response if available
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    const apiError = {
      message,
      status: error.response?.status,
      errors: error.response?.data?.errors || [],
    };

    return Promise.reject(apiError);
  }
);

export default api;
