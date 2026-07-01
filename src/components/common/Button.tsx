import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' && 'rounded-md px-3 py-1.5 text-xs',
        size === 'md' && 'rounded-lg px-4 py-2 text-sm',
        size === 'lg' && 'rounded-lg px-6 py-3 text-base',
        variant === 'primary' && 'bg-[#2C3248] text-white hover:bg-[#3a415a]',
        variant === 'secondary' && 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
        variant === 'ghost' && 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        className
      )}
      {...props}
    />
  );
}
