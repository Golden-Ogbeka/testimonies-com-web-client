'use client';

import { Avatar } from '@/components/common';
import { useMe } from '@/hooks/useAuth';
import { useFollowRequests } from '@/hooks/useProfile';
import { useBroadcastRequests } from '@/hooks/useTestimonies';
import { cn } from '@/lib/utils';
import { Bell, BookOpen, CreditCard, Home, Mail, Megaphone, Search, Settings, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/notifications', label: 'Notifications', icon: Bell, badge: true },
  { href: '/messages', label: 'Messages', icon: Mail },
  { href: '/my-testimonies', label: 'My Content', icon: BookOpen },
  { href: '/subscriptions', label: 'Subscription', icon: CreditCard },
  { href: '/promotions', label: 'Promotions', icon: Megaphone },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: me } = useMe();
  const followRequests = useFollowRequests();
  const broadcastRequests = useBroadcastRequests();

  const notifCount = (followRequests.data?.length ?? 0) + (broadcastRequests.data?.results?.length ?? 0);

  return (
    <aside className='sticky top-0 hidden h-screen w-[260px] flex-col border-r border-slate-200 bg-white p-4 lg:flex'>
      <div className='mb-6 flex items-center gap-2 text-lg font-bold text-slate-900'>
        <Sparkles className='h-5 w-5 text-blue-600' />
        Testimonies
      </div>

      <nav className='flex-1 space-y-1'>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          const count = item.badge ? notifCount : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100',
                active && 'bg-blue-50 text-blue-700'
              )}
            >
              <div className='relative'>
                <Icon className='h-5 w-5' />
                {count > 0 && (
                  <span className='absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white'>
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {me && (
        <Link href={`/u/${me.username ?? 'me'}`} className='flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-100'>
          <Avatar src={me.picture} name={me.fullName ?? me.username} className='h-9 w-9' />
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-slate-900'>{me.fullName ?? me.username}</p>
            <p className='truncate text-xs text-slate-500'>@{me.username}</p>
          </div>
        </Link>
      )}
    </aside>
  );
}
