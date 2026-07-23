'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'FAQs', href: ROUTES.FAQS },
  { label: 'Terms', href: ROUTES.TERMS },
  { label: 'Privacy', href: ROUTES.PRIVACY_POLICY },
] as const;

const FOOTER_LINKS = {
  platform: [
    { label: 'About Us', href: ROUTES.ABOUT },
    { label: 'FAQs', href: ROUTES.FAQS },
  ],
  legal: [
    { label: 'Terms of Service', href: ROUTES.TERMS },
    { label: 'Privacy Policy', href: ROUTES.PRIVACY_POLICY },
    { label: 'Cookie Policy', href: ROUTES.COOKIE_POLICY },
  ],
} as const;

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const [menuOpenPath, setMenuOpenPath] = React.useState<string | null>(null);
  const mobileMenuOpen = menuOpenPath === pathname;

  React.useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = React.useCallback(() => setMenuOpenPath(null), []);
  const toggleMobileMenu = React.useCallback(() => setMenuOpenPath((current) => (current === pathname ? null : pathname)), [pathname]);

  return (
    <div className="theme-public relative flex min-h-screen flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased selection:bg-primary-muted selection:text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <BrandLogo href={ROUTES.LANDING} size={100} className="shrink-0" />

            <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'group relative py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground',
                    pathname === item.href && 'text-foreground',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-[2px] w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100',
                      pathname === item.href && 'origin-left scale-x-100',
                    )}
                  />
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-4 md:flex">
              <Link href={ROUTES.SIGNIN} className="text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground">
                Sign In
              </Link>
              <Link
                href={ROUTES.SIGNUP}
                className="inline-flex items-center justify-center rounded-none bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-light"
              >
                Create Account
              </Link>
            </div>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="border border-transparent p-2 text-foreground transition-all hover:border-border hover:bg-background-secondary md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-14 right-0 left-0 z-45 border-b border-border bg-background shadow-md sm:top-16 md:hidden">
            <nav className="flex flex-col space-y-1 p-4" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'px-3 py-2.5 text-base font-semibold transition-colors hover:bg-background-secondary',
                    pathname === item.href && 'bg-background-secondary',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 flex flex-col gap-2 border-t border-border pt-3">
                <Link
                  href={ROUTES.SIGNIN}
                  onClick={closeMobileMenu}
                  className="w-full rounded-none border border-border py-2.5 text-center text-sm font-semibold transition-all hover:bg-background-secondary"
                >
                  Sign In
                </Link>
                <Link
                  href={ROUTES.SIGNUP}
                  onClick={closeMobileMenu}
                  className="w-full justify-center rounded-none bg-primary py-2.5 text-center text-sm font-semibold text-background transition-colors hover:bg-primary-light"
                >
                  Create Account
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="relative z-10 flex flex-1 flex-col">{children}</main>

      <footer className="relative z-10 border-t border-border bg-background px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 pb-10 sm:pb-12 md:grid-cols-12 md:gap-8">
            <div className="flex flex-col items-start gap-4 md:col-span-5">
              <BrandLogo size={100} className="w-full max-w-[140px]" />
              <p className="max-w-sm text-sm leading-relaxed font-medium text-foreground/75">
                A modern, faith-centered space for sharing authentic accounts of God&apos;s goodness, inspiring hope and building global
                community.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 md:justify-items-end">
              <div className="flex min-w-[120px] flex-col gap-3">
                <span className="text-xs font-bold tracking-wider text-foreground/50 uppercase">Platform</span>
                {FOOTER_LINKS.platform.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex min-w-[120px] flex-col gap-3">
                <span className="text-xs font-bold tracking-wider text-foreground/50 uppercase">Legal</span>
                {FOOTER_LINKS.legal.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="col-span-2 flex min-w-[120px] flex-col gap-3 sm:col-span-1">
                <span className="text-xs font-bold tracking-wider text-foreground/50 uppercase">Community</span>
                <a
                  href="mailto:support@testimonies.com"
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  Contact Support
                </a>
                <span className="mt-1 text-xs text-foreground/60 italic">Share His Goodness</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 text-xs font-medium text-foreground/65 sm:flex-row sm:pt-8">
            <p>&copy; {new Date().getFullYear()} Testimonies.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
