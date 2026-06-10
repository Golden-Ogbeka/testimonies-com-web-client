import { STORAGE_KEYS } from '@/constants/storage';
import type { AuthKind, User } from '@/types/auth';

const canUseStorage = typeof window !== 'undefined';
const TOKEN_COOKIE = 'testimonies_token';

export const storage = {
  getToken(): string {
    if (!canUseStorage) return '';
    return localStorage.getItem(STORAGE_KEYS.token) ?? '';
  },
  setToken(token: string): void {
    if (!canUseStorage) return;
    localStorage.setItem(STORAGE_KEYS.token, token);
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 7}`;
  },
  getAuthKind(): AuthKind | null {
    if (!canUseStorage) return null;
    const value = localStorage.getItem(STORAGE_KEYS.authKind);
    if (value === 'individual' || value === 'organization') return value;
    return null;
  },
  setAuthKind(kind: AuthKind): void {
    if (!canUseStorage) return;
    localStorage.setItem(STORAGE_KEYS.authKind, kind);
  },
  getUser(): User | null {
    if (!canUseStorage) return null;
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  setUser(user: User): void {
    if (!canUseStorage) return;
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  },
  clear(): void {
    if (!canUseStorage) return;
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.authKind);
    localStorage.removeItem(STORAGE_KEYS.user);
    document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; path=/; SameSite=Lax`;
  },
};
