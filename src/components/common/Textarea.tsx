'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ className, label, error, ...rest }: TextareaProps) {
  return (
    <div className='space-y-1'>
      {label && <label className='text-xs font-medium text-gray-600'>{label}</label>}
      <textarea
        className={cn(
          'w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors duration-150',
          'border-gray-300',
          'focus:border-[#2C3248]/50 focus:ring-1 focus:ring-[#2C3248]/20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...rest}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
