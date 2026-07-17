'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  maxLength?: number;
};

export function Textarea({ className, label, error, maxLength, onChange, ...rest }: TextareaProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = React.useState(0);

  const autoResize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  React.useEffect(() => {
    autoResize();
  }, [autoResize]);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setCharCount(e.target.value.length);
    autoResize();
    onChange?.(e);
  };

  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-medium text-foreground-secondary">{label}</label>}
      <textarea
        ref={ref}
        rows={3}
        maxLength={maxLength}
        onChange={handleChange}
        className={cn(
          'w-full resize-none overflow-hidden rounded-none border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors duration-150',
          'border-border',
          'focus:border-foreground/50 focus:ring-1 focus:ring-foreground/20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...rest}
      />
      <div className="flex items-center justify-between">
        {error && <p className="text-xs text-red-500">{error}</p>}
        {maxLength !== undefined && (
          <p className={cn('text-xs ml-auto', charCount > maxLength ? 'text-red-500' : 'text-muted')}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
