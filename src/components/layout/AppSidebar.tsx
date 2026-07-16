'use client';

import { ROUTES } from '@/constants/routes';
import { Avatar, BrandLogo, ConfirmModal } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useFollowRequests } from '@/hooks/useProfile';
import { useBroadcastRequests } from '@/hooks/useTestimonies';
import { cn, flattenPages } from '@/lib/utils';
import { Bell, BookOpen, Home, LogOut, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const notifCount = (followRequests.data?.results?.length ?? 0) + flattenPages(broadcastRequests.data).length;

  const handleLogout = useCallback(async () => {
    await logout.mutateAsync();
    window.location.href = ROUTES.SIGNIN;
    clearAuth();
  }, [logout, clearAuth]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border/60 bg-background lg:flex lg:w-[260px]">
        <div className="flex flex-col h-full px-3 py-2">
          {/* Logo */}
          <div className="flex items-center py-2 mb-3 justify-center">
            <BrandLogo size={100} className="shrink-0" />
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== ROUTES.HOME && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    'group flex items-center gap-4 rounded-none px-3 py-2.5 text-sm transition-colors duration-150',
                    active
                      ? 'bg-foreground/5 text-foreground font-semibold'
                      : 'text-foreground-secondary hover:bg-background-secondary hover:text-foreground',
                  )}
                >
                  <span className="relative">
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.5} />
                    {item.badge && notifCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center bg-foreground px-1 text-[10px] font-bold text-background">
                        {notifCount > 9 ? '9+' : notifCount}
                      </span>
                    )}
                  </span>
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-4 rounded-none px-3 py-2.5 text-sm text-foreground-secondary transition-colors duration-150 hover:bg-background-secondary hover:text-foreground mb-2"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
            <span className="hidden xl:inline">Logout</span>
          </button>

          <ConfirmModal
            isOpen={showLogoutConfirm}
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={handleLogout}
            title="Logout"
            message="Are you sure you want to log out?"
            confirmLabel="Logout"
            variant="danger"
            isPending={logout.isPending}
          />

          {/* User profile */}
          {user && (
            <Link
              href={ROUTES.profile(user.username ?? 'me')}
              prefetch={false}
              className="flex items-center gap-3 rounded-none p-3 transition-colors duration-150 hover:bg-background-secondary"
            >
              <Avatar src={user.profileImage} name={`${user.firstName} ${user.lastName}`} size="md" />
              <div className="hidden min-w-0 flex-1 xl:block">
                <p className="truncate text-sm font-semibold text-foreground">{`${user.firstName} ${user.lastName}`}</p>
                <p className="truncate text-xs text-muted">@{user.username}</p>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Mobile navigation"
      >
        {nav.slice(0, 5).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/home' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                'flex flex-1 items-center justify-center min-h-[48px] py-3 transition-colors',
                active ? 'text-foreground' : 'text-muted hover:text-foreground-secondary',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.5} />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
