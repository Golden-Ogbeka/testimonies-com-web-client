'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { storage } from '@/lib/storage';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!storage.getToken()) {
      router.replace('/signin');
      return;
    }
  }, [router]);

  return <AppLayout>{children}</AppLayout>;
}
