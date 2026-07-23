'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/common';
import { ROUTES } from '@/constants/routes';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background lg:h-screen lg:max-h-screen lg:flex-row lg:overflow-hidden">
      <section className="relative flex flex-1 flex-col items-center px-6 pb-10 pt-16 text-center lg:overflow-y-auto">
        <div className="flex w-full max-w-[30rem] grow flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <BrandLogo href={ROUTES.LANDING} size={250} className="max-h-[48px] w-auto" priority />
          </div>

          <div className="mt-7 flex w-full sm:mt-20">
            <div className="flex w-full grow flex-col text-left">{children}</div>
          </div>
        </div>

        <footer className="w-full max-w-[30rem] pt-8 text-xs leading-5 text-foreground/70">
          By continuing, you agree to the{' '}
          <Link href={ROUTES.TERMS} className="font-semibold text-accent hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href={ROUTES.PRIVACY_POLICY} className="font-semibold text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </footer>
      </section>
    </div>
  );
}
