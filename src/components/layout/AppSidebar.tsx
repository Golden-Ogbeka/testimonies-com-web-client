'use client';

import { ROUTES } from '@/constants/routes';
import { Avatar } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useFollowRequests } from '@/hooks/useProfile';
import { useBroadcastRequests } from '@/hooks/useTestimonies';
import { cn, flattenPages } from '@/lib/utils';
import {
  Bell, BookOpen, Feather, Home, LogOut,
  Search, Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useLogout } from '@/hooks/useAuth';

const nav = [
  { href: ROUTES.HOME, label: 'Home', icon: Home },
  { href: ROUTES.EXPLORE, label: 'Explore', icon: Search },
  { href: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell, badge: true },
  { href: ROUTES.MY_TESTIMONIES, label: 'My Content', icon: BookOpen },
  { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthState();
  const followRequests = useFollowRequests();
  const broadcastRequests = useBroadcastRequests();
  const logout = useLogout();

  const notifCount = (followRequests.data?.results?.length ?? 0) + flattenPages(broadcastRequests.data).length;

  const handleLogout = useCallback(async () => {
    await logout.mutateAsync();
    window.location.href = ROUTES.SIGNIN;
    clearAuth();
  }, [logout, clearAuth]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className='sticky top-0 hidden h-screen flex-col border-r border-gray-200 bg-white lg:flex lg:w-[275px] xl:w-[300px]'>
        <div className='flex flex-col h-full px-3 py-2'>
          {/* Logo */}
          <div className='flex items-center gap-2.5 px-3 py-4 mb-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#2C3248]'>
              <Feather className='h-4 w-4 text-white' />
            </div>
            <span className='text-base font-bold text-gray-900'>Testimonies</span>
          </div>

          {/* Nav */}
          <nav className='flex-1 space-y-0.5'>
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== ROUTES.HOME && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    'group flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150',
                    active
                      ? 'bg-[#2C3248]/5 text-[#2C3248] font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )}
                >
                  <span className='relative'>
                    <Icon className='h-5 w-5' strokeWidth={active ? 2.5 : 1.5} />
                    {item.badge && notifCount > 0 && (
                      <span className='absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#2C3248] px-1 text-[10px] font-bold text-white'>
                        {notifCount > 9 ? '9+' : notifCount}
                      </span>
                    )}
                  </span>
                  <span className='hidden lg:inline'>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className='flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 mb-2'
          >
            <LogOut className='h-5 w-5' strokeWidth={1.5} />
            <span className='hidden xl:inline'>Logout</span>
          </button>

          {/* User profile */}
          {user && (
            <Link
              href={ROUTES.profile(user.username ?? 'me')}
              prefetch={false}
              className='flex items-center gap-3 rounded-lg p-3 transition-colors duration-150 hover:bg-gray-100'
            >
              <Avatar src={user.picture} name={user.fullName ?? user.username} size='md' />
              <div className='hidden min-w-0 flex-1 xl:block'>
                <p className='truncate text-sm font-semibold text-gray-900'>{user.fullName ?? user.username}</p>
                <p className='truncate text-xs text-gray-500'>@{user.username}</p>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className='fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white lg:hidden' aria-label='Mobile navigation'>
        {nav.slice(0, 5).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/home' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                'flex flex-1 items-center justify-center py-3 transition-colors',
                active ? 'text-[#2C3248]' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon className='h-5 w-5' strokeWidth={active ? 2.5 : 1.5} />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
