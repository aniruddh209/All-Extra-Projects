import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import authService from '../services/auth.service';
import ROUTES from '../constants/routes';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Load session from /api/auth/me on mount
  const checkSession = useCallback(async () => {
    try {
      const data = await authService.getMe();
      if (data?.user) {
        setUser(data.user);
        setShop(data.shop);
      } else {
        setUser(null);
        setShop(null);
      }
    } catch (err) {
      // 401 or network error - unauthenticated session
      setUser(null);
      setShop(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    // Listen for global session expiry event dispatched by client.js
    const handleAuthExpired = (e) => {
      setUser(null);
      setShop(null);
      queryClient.clear();
      toast.error(e.detail?.message || 'Your session has expired. Please log in again.');
      window.location.href = ROUTES.LOGIN;
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [checkSession, queryClient]);

  // Login handler
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setShop(data.shop);
      queryClient.clear(); // Flush cache for new tenant
      toast.success(`Welcome back, ${data.user.name}`);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup handler
  const signup = async (payload) => {
    setIsLoading(true);
    try {
      const data = await authService.signup(payload);
      setUser(data.user);
      setShop(data.shop);
      queryClient.clear();
      toast.success('Account created successfully!');
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      setUser(null);
      setShop(null);
      queryClient.clear();
      toast.success('Signed out successfully');
      window.location.href = ROUTES.LOGIN;
    }
  };

  // Update shop profile in state (e.g. after shop settings update)
  const updateShop = (newShopData) => {
    setShop((prev) => ({ ...prev, ...newShopData }));
  };

  const value = {
    user,
    shop,
    role: user?.role || 'STAFF',
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    signup,
    logout,
    refreshUser: checkSession,
    updateShop,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
