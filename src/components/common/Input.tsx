'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  containerClassName?: string;
};

export function Input({ className, label, error, type, containerClassName, ...rest }: InputProps) {
  const [visible, setVisible] = React.useState(false);
  const isPassword = type === 'password';

  return (
    <div className={cn('space-y-1', containerClassName)}>
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <div className="relative">
        <input
          type={isPassword && visible ? 'text' : type}
          className={cn(
            'h-10 w-full rounded-lg border bg-white text-sm text-gray-900 outline-none transition-colors duration-150',
            'border-gray-300 placeholder:text-gray-400',
            'focus:border-primary focus:ring-1 focus:ring-primary/20',
            isPassword ? 'px-3 pr-10' : 'px-3',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
