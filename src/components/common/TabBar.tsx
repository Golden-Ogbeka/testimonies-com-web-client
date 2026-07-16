'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type Tab = {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: number;
};

type TabBarProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
};

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-border" role="tablist">
      {tabs.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          role="tab"
          aria-selected={activeTab === id}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors hover:bg-card-hover min-h-[44px]',
            activeTab === id ? 'border-b-2 border-foreground text-foreground' : 'text-muted',
          )}
        >
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <span className="truncate">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="flex h-5 w-5 items-center justify-center bg-foreground text-[10px] font-bold text-background">{badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
