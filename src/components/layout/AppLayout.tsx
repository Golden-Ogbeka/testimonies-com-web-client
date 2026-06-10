'use client';

import { AppSidebar } from './AppSidebar';
import { AppMobileNav } from './AppMobileNav';
import type { ReactNode } from 'react';
import { useAuthState } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className='mx-auto flex min-h-screen max-w-[1280px] bg-white'>
      <AppSidebar />
      <main className='min-h-screen flex-1 border-x border-gray-200 lg:max-w-[600px]'>
        {children}
      </main>
      <AppMobileNav />
    </div>
  );
}
