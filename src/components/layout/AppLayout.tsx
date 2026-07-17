'use client';

import { ROUTES } from '@/constants/routes';
import { AppSidebar } from './AppSidebar';
import { AppRightSidebar } from './AppRightSidebar';
import type { ReactNode } from 'react';
import { useAuthState } from '@/app/providers';
import { useMe } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  useMe();
  const { isAuthenticated, initialized } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace(ROUTES.SIGNIN);
    }
  }, [initialized, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex min-h-screen flex-1 border-x border-border pb-16 lg:pb-0">
        <div className="mx-auto w-full">{children}</div>
      </main>
      <AppRightSidebar />
    </div>
  );
}
