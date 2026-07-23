import type { Metadata, Viewport } from 'next';
import { Inter, Lora } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { template: '%s — Testimonies', default: 'Testimonies — Share His Goodness' },
  description: "Share your testimony of God's goodness and inspire the world.",
  icons: { icon: '/favicon.svg' },
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
  themeColor: '#fbfbfb',
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
