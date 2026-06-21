'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ className, label, error, ...props }: InputProps) {
  const ariaLabel = props['aria-label'] ?? (label || (typeof props.placeholder === 'string' ? props.placeholder : undefined));
  return (
    <div className='space-y-1'>
      {label && <label className='text-xs font-medium text-gray-600'>{label}</label>}
      <input
        aria-label={ariaLabel}
        className={cn(
          'h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none transition-colors duration-150',
          'border-gray-300 placeholder:text-gray-400',
          'focus:border-[#2C3248] focus:ring-1 focus:ring-[#2C3248]/20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
