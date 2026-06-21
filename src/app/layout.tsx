import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { template: '%s — Testimonies', default: 'Testimonies — Share His Goodness' },
  description: 'Share your testimony of God\'s goodness and inspire the world.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Testimonies',
    title: 'Testimonies — Share His Goodness',
    description: 'Share your testimony of God\'s goodness and inspire the world.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testimonies — Share His Goodness',
    description: 'Share your testimony of God\'s goodness and inspire the world.',
  },
};

export const viewport: Viewport = {
  themeColor: '#2C3248',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Script id="strip-ext-attrs" strategy="beforeInteractive" src='/strip-ext-attrs.js' />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
