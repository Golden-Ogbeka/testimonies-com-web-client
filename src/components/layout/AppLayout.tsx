'use client';

import { ROUTES } from '@/constants/routes';
import { AppSidebar } from './AppSidebar';
import { AppRightSidebar } from './AppRightSidebar';
import type { ReactNode } from 'react';
import { useAuthState } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.SIGNIN);
    }
  }, [isAuthenticated, router]);

  return (
    <div className='flex min-h-screen bg-white'>
      <AppSidebar />
      <main className='min-h-screen flex-1 border-x border-gray-200'>{children}</main>
      <AppRightSidebar />
    </div>
  );
}
