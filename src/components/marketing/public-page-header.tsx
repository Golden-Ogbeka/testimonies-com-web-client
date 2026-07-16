import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PublicBadge } from './public-badge';

type PublicPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: string;
  icon?: LucideIcon;
  badgeVariant?: 'default' | 'accent';
  align?: 'left' | 'center';
  className?: string;
};

export function PublicPageHeader({
  eyebrow,
  title,
  description,
  meta,
  icon,
  badgeVariant = 'default',
  align = 'left',
  className,
}: PublicPageHeaderProps) {
  return (
    <header className={cn('mb-12 sm:mb-16', align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      <PublicBadge icon={icon} variant={badgeVariant}>
        {eyebrow}
      </PublicBadge>
      <h1
        className={cn(
          'font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl',
          align === 'center' ? 'mt-4' : 'mt-4',
        )}
      >
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            'mt-4 text-base font-medium leading-relaxed text-foreground/75 sm:text-lg',
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl',
          )}
        >
          {description}
        </p>
      )}
      {meta && <p className="mt-2 text-sm font-semibold text-foreground/60">{meta}</p>}
    </header>
  );
}
