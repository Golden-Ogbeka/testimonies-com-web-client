import { cn } from '@/lib/utils';

type PublicPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function PublicPageHeader({ eyebrow, title, description, meta, align = 'left', className }: PublicPageHeaderProps) {
  return (
    <header className={cn('mb-12 sm:mb-16', align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground/50">{eyebrow}</p>
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
