'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ className, label, error, ...rest }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-medium text-foreground-secondary">{label}</label>}
      <textarea
        className={cn(
          'w-full resize-none rounded-none border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors duration-150',
          'border-border',
          'focus:border-foreground/50 focus:ring-1 focus:ring-foreground/20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
