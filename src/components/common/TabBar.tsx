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
    <div className='flex border-b border-gray-200'>
      {tabs.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors hover:bg-gray-50',
            activeTab === id ? 'border-b-2 border-[#2C3248] text-[#2C3248]' : 'text-gray-500'
          )}
        >
          {Icon && <Icon className='h-4 w-4' />}
          {label}
          {badge !== undefined && badge > 0 && (
            <span className='flex h-5 w-5 items-center justify-center rounded-full bg-[#2C3248] text-[10px] font-bold text-white'>
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
