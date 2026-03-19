import { Bell, Home, Mail, Search, User } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';

const mobileNav = [
  { href: '/home', icon: Home },
  { href: '/explore', icon: Search },
  { href: '/notifications', icon: Bell },
  { href: '/messages', icon: Mail },
  { href: '/u/me', icon: User },
];

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className='mx-auto flex min-h-screen max-w-[1300px] bg-white'>
      <AppSidebar />
      <main className='min-h-screen flex-1 border-x border-slate-200 pb-16 lg:pb-0'>{children}</main>

      {/* Mobile bottom nav */}
      <nav className='fixed bottom-0 left-0 right-0 z-50 flex border-t border-slate-200 bg-white lg:hidden'>
        {mobileNav.map(({ href, icon: Icon }) => (
          <Link key={href} href={href} className='flex flex-1 items-center justify-center py-3 text-slate-500 hover:text-blue-600'>
            <Icon className='h-5 w-5' />
          </Link>
        ))}
      </nav>
    </div>
  );
}
