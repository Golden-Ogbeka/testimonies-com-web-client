import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type PublicBadgeProps = {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'default' | 'accent';
  className?: string;
};

export function PublicBadge({ children, icon: Icon, variant = 'default', className }: PublicBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
        variant === 'default' && 'border-border bg-background-secondary text-foreground/70',
        variant === 'accent' && 'border-accent-border bg-accent-muted text-foreground',
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />}
      {children}
    </span>
  );
}
