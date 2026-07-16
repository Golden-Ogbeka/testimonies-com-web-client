'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Feather, Heart, Sparkles, Smile, Compass, HeartHandshake, Menu, X } from 'lucide-react';
import { FloatingPills, GridBackground, PublicLinkButton } from '@/components/marketing';
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

const AUTH_FLOATING_PILLS = [
  {
    label: 'Answered Prayer',
    icon: Sparkles,
    color: 'from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-800',
    top: '12%',
    left: '8%',
    delay: '0s',
  },
  {
    label: "God's Grace",
    icon: Heart,
    color: 'from-amber-100 to-amber-200 border-amber-300 text-amber-800',
    top: '8%',
    right: '12%',
    delay: '1s',
  },
  {
    label: 'Healing & Peace',
    icon: Smile,
    color: 'from-blue-100 to-blue-200 border-blue-300 text-blue-800',
    top: '45%',
    left: '4%',
    delay: '2s',
  },
  {
    label: 'Shared Hope',
    icon: Compass,
    color: 'from-indigo-100 to-indigo-200 border-indigo-300 text-indigo-800',
    bottom: '22%',
    left: '10%',
    delay: '1.5s',
  },
  {
    label: 'Miracles',
    icon: HeartHandshake,
    color: 'from-rose-100 to-rose-200 border-rose-300 text-rose-800',
    bottom: '15%',
    right: '8%',
    delay: '0.5s',
  },
] as const;

function PublicLogo({ className }: { className?: string }) {
  return (
    <Link href={ROUTES.LANDING} className={cn('group flex items-center gap-2 transition-transform active:scale-95', className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-primary-muted transition-colors group-hover:bg-accent-muted">
        <Feather className="h-5 w-5 text-foreground transition-transform group-hover:rotate-12" />
      </div>
      <span className="font-serif text-xl font-bold tracking-tight text-foreground">Testimonies</span>
    </Link>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const [menuOpenPath, setMenuOpenPath] = React.useState<string | null>(null);
  const mobileMenuOpen = menuOpenPath === pathname;

  const isAuthPage = React.useMemo(
    () =>
      pathname.startsWith('/signin') ||
      pathname.startsWith('/signup') ||
      pathname.startsWith('/verify-otp') ||
      pathname.startsWith('/forgot-password'),
    [pathname],
  );

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
      <GridBackground />

      {!isAuthPage && (
        <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md transition-all duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <PublicLogo />

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
                <PublicLinkButton href={ROUTES.SIGNUP} variant="primary" size="sm" className="px-4 py-2 text-sm">
                  Create Account
                </PublicLinkButton>
              </div>

              <button
                type="button"
                onClick={toggleMobileMenu}
                className="rounded-lg border border-transparent p-2 text-foreground transition-all hover:border-border hover:bg-background-secondary md:hidden"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="absolute top-16 right-0 left-0 z-45 border-b border-border bg-background shadow-md md:hidden">
              <nav className="flex flex-col space-y-1 p-4" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'rounded-lg px-3 py-2.5 text-base font-semibold transition-colors hover:bg-background-secondary',
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
                    className="w-full rounded-lg border border-border py-2.5 text-center text-sm font-semibold transition-all hover:bg-background-secondary"
                  >
                    Sign In
                  </Link>
                  <PublicLinkButton href={ROUTES.SIGNUP} variant="primary" size="sm" className="w-full justify-center">
                    Create Account
                  </PublicLinkButton>
                </div>
              </nav>
            </div>
          )}
        </header>
      )}

      <main className={cn('relative z-10 flex flex-1 flex-col', isAuthPage && 'items-center justify-center')}>
        {isAuthPage ? (
          <div className="relative flex min-h-screen w-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <FloatingPills pills={[...AUTH_FLOATING_PILLS]} />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-md backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg sm:p-10">
              <div className="mb-6 flex justify-center">
                <PublicLogo />
              </div>
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {!isAuthPage && (
        <footer className="relative z-10 border-t border-border bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-12 md:gap-8">
              <div className="flex flex-col items-start gap-4 md:col-span-5">
                <PublicLogo />
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

            <div className="flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 text-xs font-medium text-foreground/65 sm:flex-row">
              <p>&copy; {new Date().getFullYear()} Testimonies.com. All rights reserved.</p>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-background-secondary px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-ping" />
                Live
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
