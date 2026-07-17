'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools), { ssr: false });
import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { Toaster } from 'sonner';
import { createQueryClient } from '@/lib/query-client';
import { storage } from '@/lib/storage';
import type { User } from '@/types/auth';

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthState>({
  token: null,
  user: null,
  isAuthenticated: false,
  initialized: false,
  setAuth: () => {},
  clearAuth: () => {},
});

export const useAuthState = () => useContext(AuthContext);

function readAuth() {
  if (typeof window === 'undefined') return { token: null, user: null };
  return { token: storage.getToken(), user: storage.getUser() };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const initialized = true;

  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      const initial = readAuth();
      setToken(initial.token);
      setUser(initial.user);
    }
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
      <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, initialized, setAuth, clearAuth }}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1a1a2e',
              border: '1px solid #e5e7eb',
            },
          }}
        />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
