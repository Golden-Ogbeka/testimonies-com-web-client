import type { Metadata, Viewport } from 'next';
import { Inter, Lora } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '500', '600', '700'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl && process.env.NODE_ENV === 'production') {
  // Fail the build rather than silently serving wrong OpenGraph/Twitter URLs.
  throw new Error('NEXT_PUBLIC_SITE_URL is required in production. Set it in your environment variables.');
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl ?? 'http://localhost:3000'),
  title: { template: '%s — Testimonies', default: 'Testimonies — Share His Goodness' },
  description: "Share your testimony of God's goodness and inspire the world.",
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192.png',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Testimonies',
  },
  openGraph: {
    type: 'website',
    siteName: 'Testimonies',
    title: 'Testimonies — Share His Goodness',
    description: "Share your testimony of God's goodness and inspire the world.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testimonies — Share His Goodness',
    description: "Share your testimony of God's goodness and inspire the world.",
  },
};

export const viewport: Viewport = {
  themeColor: '#1f2947',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script id="strip-ext-attrs" strategy="beforeInteractive" src="/strip-ext-attrs.js" />
      </head>
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
