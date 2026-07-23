'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, Shield, Trash2, User, Eye } from 'lucide-react';
import { PageHeader } from '@/components/common';
import ProfileTab from '@/components/settings/ProfileTab';
import AccountTab from '@/components/settings/AccountTab';
import PrivacyTab from '@/components/settings/PrivacyTab';
import DangerZoneTab from '@/components/settings/DangerZoneTab';

type SideTab = 'profile' | 'account' | 'privacy' | 'danger';

const tabs: { id: SideTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'danger', label: 'Danger Zone', icon: Trash2 },
];

function SettingsContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = (searchParams.get('tab') as SideTab) || 'profile';

  const setTab = (id: SideTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', id);
    router.push(`/settings?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <PageHeader icon={Settings} title="Settings" />

      <div className="flex flex-col md:flex-row">
        <nav className="flex overflow-x-auto border-b border-border md:w-48 md shrink-0 md:flex-col md:border-b-0 md:border-r md:overflow-x-visible p-2 md:p-3 space-x-1 md:space-x-0 md:space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex items-center gap-2 rounded-none px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap min-h-[44px]',
                tab === id ? 'bg-foreground/5 text-foreground' : 'text-muted hover:bg-background-secondary hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>

        <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-xl">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'account' && <AccountTab />}
          {tab === 'privacy' && <PrivacyTab />}
          {tab === 'danger' && <DangerZoneTab />}
        </div>
      </div>
    </div>
  );
}

export default function SettingsContent() {
  return (
    <Suspense fallback={null}>
      <SettingsContentInner />
    </Suspense>
  );
}
