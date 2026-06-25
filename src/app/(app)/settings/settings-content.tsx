'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, Lock, Settings, Shield, Trash2, User } from 'lucide-react';
import { PageHeader } from '@/components/common';
import ProfileTab from '@/components/settings/ProfileTab';
import AccountTab from '@/components/settings/AccountTab';
import PrivacyTab from '@/components/settings/PrivacyTab';
import SessionsTab from '@/components/settings/SessionsTab';
import DangerZoneTab from '@/components/settings/DangerZoneTab';

type SideTab = 'profile' | 'account' | 'privacy' | 'sessions' | 'danger';

const tabs: { id: SideTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'sessions', label: 'Sessions', icon: Lock },
  { id: 'danger', label: 'Danger Zone', icon: Trash2 },
];

export default function SettingsContent() {
  const [tab, setTab] = useState<SideTab>('profile');

  return (
    <div>
      <PageHeader icon={Settings} title='Settings' />

      <div className='flex'>
        <nav className='w-48 shrink-0 border-r border-gray-200 p-3 space-y-1'>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                tab === id ? 'bg-[#2C3248]/5 text-[#2C3248]' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              )}
            >
              <Icon className='h-4 w-4' /> {label}
            </button>
          ))}
        </nav>

        <div className='flex-1 p-6 space-y-6 max-w-xl'>
          {tab === 'profile' && <ProfileTab />}
          {tab === 'account' && <AccountTab />}
          {tab === 'privacy' && <PrivacyTab />}
          {tab === 'sessions' && <SessionsTab />}
          {tab === 'danger' && <DangerZoneTab />}
        </div>
      </div>
    </div>
  );
}
