import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Testimonies',
    short_name: 'Testimonies',
    description: 'Share your testimony of God\'s goodness and inspire the world.',
    start_url: '/home',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2C3248',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
