import axios from 'axios';
import { env } from '@/config/env';
import { storage } from '@/lib/storage';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  config.headers = config.headers ?? {};
  if (env.apiKey) config.headers['x-api-key'] = env.apiKey;
  if (token) config.headers['x-jwt-token'] = token;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.error?.message ?? error?.response?.data?.message ?? '';

    if (status === 401) {
      storage.clear();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }

    const enhancedError = new Error(message || 'Something went wrong') as Error & {
      response?: typeof error.response;
      status?: number;
    };
    enhancedError.response = error?.response;
    enhancedError.status = status;
    return Promise.reject(enhancedError);
  }
);

export function unwrap<T>(payload: unknown): T {
  const response = payload as { data?: T; success?: boolean };
  if (response?.data !== undefined) return response.data as T;
  return payload as T;
}
