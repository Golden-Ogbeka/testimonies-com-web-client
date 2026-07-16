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
        size === 'sm' && 'rounded-none px-3 py-1.5 text-xs',
        size === 'md' && 'rounded-none px-4 py-2 text-sm',
        size === 'lg' && 'rounded-none px-6 py-3 text-base',
        variant === 'primary' && 'bg-primary text-background hover:bg-primary-light',
        variant === 'secondary' && 'bg-background-secondary text-foreground hover:bg-card-hover border border-border',
        variant === 'ghost' && 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary',
        variant === 'danger' && 'bg-danger text-white hover:bg-danger-hover',
        variant === 'outline' && 'border border-border text-foreground hover:bg-background-secondary',
        className,
      )}
      {...props}
    />
  );
}
