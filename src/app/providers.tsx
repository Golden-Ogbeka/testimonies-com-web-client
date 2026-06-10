'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Toaster } from 'sonner';
import { createQueryClient } from '@/lib/query-client';
import { storage } from '@/lib/storage';
import type { User } from '@/types/auth';

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthState>({
  token: null,
  user: null,
  isAuthenticated: false,
  setAuth: () => {},
  clearAuth: () => {},
});

export const useAuthState = () => useContext(AuthContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(storedUser);

    const handler = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  const setAuth = useCallback((t: string, u: User) => {
    storage.setToken(t);
    storage.setUser(u);
    setToken(t);
    setUser(u);
  }, []);

  const clearAuth = useCallback(() => {
    storage.clear();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, setAuth, clearAuth }}>
        {children}
        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1a1a2e',
              border: '1px solid #e5e7eb',
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
