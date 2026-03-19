import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-blue-500 placeholder:text-slate-400 focus:ring-2',
        className
      )}
      {...props}
    />
  );
}
