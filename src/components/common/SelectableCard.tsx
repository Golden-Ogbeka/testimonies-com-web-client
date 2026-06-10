'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type SelectableCardProps = {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

export function SelectableCard({ selected, onClick, children, className }: SelectableCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-xl border bg-white p-4 transition-all',
        selected ? 'border-[#2C3248]/50 ring-1 ring-[#2C3248]/20' : 'border-gray-200 hover:border-gray-300',
        className
      )}
    >
      {children}
    </div>
  );
}
