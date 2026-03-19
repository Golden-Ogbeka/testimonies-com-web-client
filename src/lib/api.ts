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
    if (status === 401) {
      storage.clear();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);

export function unwrap<T>(payload: unknown): T {
  const data = payload as { data?: T };
  return (data.data ?? payload) as T;
}
