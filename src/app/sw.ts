import { defaultCache } from '@serwist/turbopack/worker';
import type { PrecacheEntry } from 'serwist';
import { ExpirationPlugin, NetworkFirst, Serwist, StaleWhileRevalidate } from 'serwist';

declare global {
  var __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /^https:\/\/.*\/api\/.*/,
      handler: new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 60 * 5 })],
        networkTimeoutSeconds: 10,
      }),
    },
    {
      matcher: /^https:\/\/(res\.cloudinary\.com|.*\.amazonaws\.com)\/.*/,
      handler: new StaleWhileRevalidate({
        cacheName: 'media-cache',
        plugins: [new ExpirationPlugin({ maxEntries: 128, maxAgeSeconds: 60 * 60 * 24 * 7 })],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
