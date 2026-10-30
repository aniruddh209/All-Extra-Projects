import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import AppRouter from './routes/AppRouter';

// ─── TanStack Query Client ───
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Inner App Content wired to global AuthContext
 */
function AppContent() {
  const { user, shop, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <>
      <AppRouter user={user} shop={shop} onLogout={logout} />
      <Toaster
        position="top-right"
        theme={theme}
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#151515' : '#FFFFFF',
            border: theme === 'dark' ? '1px solid #252525' : '1px solid #E4E4E7',
            color: theme === 'dark' ? '#F5F5F5' : '#18181B',
            fontFamily: 'Inter, sans-serif',
          },
        }}
        closeButton
      />
    </>
  );
}

/**
 * Root Application Component
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
