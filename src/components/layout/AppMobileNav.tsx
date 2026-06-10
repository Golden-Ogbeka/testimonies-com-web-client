'use client';

import { cn } from '@/lib/utils';
import { Bell, Feather, Home, Mail, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/home', icon: Home },
  { href: '/explore', icon: Search },
  { href: '/my-testimonies', icon: Feather },
  { href: '/notifications', icon: Bell },
  { href: '/messages', icon: Mail },
];

export function AppMobileNav() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white lg:hidden'>
      {items.map(({ href, icon: Icon }) => {
        const active = pathname === href || (href !== '/home' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 items-center justify-center py-3.5 transition-colors',
              active ? 'text-[#2C3248]' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Icon className='h-5 w-5' strokeWidth={active ? 2.5 : 1.5} />
          </Link>
        );
      })}
    </nav>
  );
}
