import type { NextConfig } from 'next';

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

export default nextConfig;
