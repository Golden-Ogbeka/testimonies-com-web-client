import withPWAInit from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';

const withPWA = withPWAInit({
  dest: 'public',
  // Only register the service worker in production builds so the dev server
  // is not affected by caching.
  disable: process.env.NODE_ENV === 'development',
  // Cache the start URL so the app shell loads offline.
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // Service worker file name (defaults to sw.js).
  sw: 'sw.js',
  workboxOptions: {
    // Use a network-first strategy for API calls so fresh data is always
    // attempted, with the cache as a fallback when offline.
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\/api\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 60 * 5, // 5 minutes
          },
        },
      },
      // Cache user-uploaded images (Cloudinary / S3) with a stale-while-
      // revalidate strategy — fast loads with background refreshes.
      {
        urlPattern: /^https:\/\/(res\.cloudinary\.com|.*\.amazonaws\.com)\/.*/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'media-cache',
          expiration: {
            maxEntries: 128,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Localhost for development
      { protocol: 'http', hostname: 'localhost' },
      // Cloudinary — used for user-uploaded media
      { protocol: 'https', hostname: '**.cloudinary.com' },
      // AWS S3 — used for media storage
      { protocol: 'https', hostname: '**.amazonaws.com' },
      // TODO: Narrow this to your specific CDN/storage hostnames before go-live.
      // The wildcard below is intentionally left as a fallback during development.
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default withPWA(nextConfig);
