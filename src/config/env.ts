export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1',
  apiKey: process.env.NEXT_PUBLIC_API_KEY ?? '',
  appName: 'Testimonies',
};

export const isClient = typeof window !== 'undefined';
