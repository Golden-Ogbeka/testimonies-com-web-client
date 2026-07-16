import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IllustrationFrame } from './illustration-frame';
import { PublicContainer } from './public-container';
import { PublicPageHeader } from './public-page-header';

type PublicLinkButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: 'px-6 py-3 text-sm',
  md: 'px-8 py-4 text-base',
  lg: 'px-8 py-4 text-base sm:text-lg',
} as const;

export function PublicLinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  showArrow = false,
  className,
}: PublicLinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center justify-center rounded-none font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-95',
        sizeClasses[size],
        variant === 'primary' && 'bg-foreground text-background shadow-md shadow-foreground/10 hover:bg-foreground/90',
        variant === 'secondary' && 'border border-border bg-background text-foreground hover:bg-background-secondary',
        className,
      )}
    >
      {children}
      {showArrow && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />}
    </Link>
  );
}

type PublicSectionProps = {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  background?: 'default' | 'muted' | 'accent';
  padding?: 'md' | 'lg';
  id?: string;
};

export function PublicSection({ children, className, bordered = false, background = 'default', padding = 'lg', id }: PublicSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative',
        bordered && 'border-b border-border',
        background === 'muted' && 'bg-background-secondary/30',
        background === 'accent' && 'bg-accent-muted/20',
        background === 'default' && 'bg-background',
        padding === 'md' && 'py-16 sm:py-20',
        padding === 'lg' && 'py-20 sm:py-28',
        className,
      )}
    >
      {children}
    </section>
  );
}

type PublicPageProps = {
  children: React.ReactNode;
  className?: string;
};

export function PublicPage({ children, className }: PublicPageProps) {
  return <div className={cn('flex min-h-0 flex-col bg-transparent', className)}>{children}</div>;
}

type PublicPageBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export function PublicPageBody({ children, className }: PublicPageBodyProps) {
  return <div className={cn('py-16 sm:py-24', className)}>{children}</div>;
}

type StatItem = {
  value: string;
  label: string;
};

type StatsRowProps = {
  stats: StatItem[];
  className?: string;
};

export function StatsRow({ stats, className }: StatsRowProps) {
  return (
    <div className={cn('grid w-full max-w-md grid-cols-3 gap-4 border-t border-border/80 pt-6 sm:gap-6', className)}>
      {stats.map((stat) => (
        <div key={stat.label}>
          <span className="font-serif text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</span>
          <p className="mt-1 text-[10px] font-semibold text-foreground/60 sm:text-xs">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  href?: string;
  linkLabel?: string;
};

type FeatureGridProps = {
  features: FeatureItem[];
  className?: string;
};

export function FeatureGrid({ features, className }: FeatureGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-0 overflow-hidden border border-border bg-background shadow-sm md:grid-cols-3', className)}>
      {features.map((feature, idx) => {
        const IconComp = feature.icon;
        return (
          <div
            key={feature.title}
            className={cn(
              'group flex flex-col items-start justify-between border-b border-border p-6 transition-all duration-300 hover:bg-background-secondary sm:p-8 md:border-r md:border-b-0',
              idx === features.length - 1 && 'md:border-r-0',
              idx === features.length - 1 && 'border-b-0 md:border-b-0',
            )}
          >
            <div className="space-y-5 sm:space-y-6">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-none border border-border bg-gradient-to-br transition-transform group-hover:scale-105',
                  feature.color,
                )}
              >
                <IconComp className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm font-medium leading-relaxed text-foreground/70">{feature.description}</p>
            </div>
            {feature.href && (
              <div className="pt-6 sm:pt-8">
                <Link
                  href={feature.href}
                  className="group/link inline-flex items-center text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:text-accent"
                >
                  {feature.linkLabel ?? 'Explore Feature'}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

type QuoteBlockProps = {
  quote: string;
  cite: string;
  icon?: LucideIcon;
  className?: string;
};

export function QuoteBlock({ quote, cite, icon: Icon, className }: QuoteBlockProps) {
  return (
    <div className={cn('mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8', className)}>
      {Icon && <Icon className="mx-auto mb-8 h-10 w-10 text-accent motion-safe:animate-pulse" aria-hidden />}
      <blockquote className="mx-auto max-w-4xl font-serif text-2xl italic leading-relaxed text-foreground sm:text-3xl lg:text-4xl">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <cite className="mt-6 block text-sm font-bold tracking-widest text-foreground/50 not-italic uppercase">{cite}</cite>
    </div>
  );
}

type PublicCtaProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
};

export function PublicCta({ title, description, primaryHref, primaryLabel, secondaryHref, secondaryLabel, className }: PublicCtaProps) {
  return (
    <div className={cn('relative z-10 mx-auto max-w-4xl space-y-8 px-4 text-center sm:px-6 lg:px-8', className)}>
      <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">{title}</h2>
      <p className="mx-auto max-w-xl text-base font-medium leading-relaxed text-foreground/75 sm:text-lg">{description}</p>
      <div className="flex flex-col items-stretch justify-center gap-4 pt-2 sm:flex-row sm:items-center">
        <PublicLinkButton href={primaryHref} variant="primary" size="md">
          {primaryLabel}
        </PublicLinkButton>
        {secondaryHref && secondaryLabel && (
          <PublicLinkButton href={secondaryHref} variant="secondary" size="md">
            {secondaryLabel}
          </PublicLinkButton>
        )}
      </div>
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = 'center', className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 sm:mb-16', align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      <span className="text-xs font-bold tracking-wider text-foreground/50 uppercase">{eyebrow}</span>
      <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base font-medium text-foreground/75 sm:text-lg">{description}</p>}
    </div>
  );
}

type SplitContentLayoutProps = {
  children: React.ReactNode;
  illustration: React.ReactNode;
  reverse?: boolean;
  className?: string;
};

export function SplitContentLayout({ children, illustration, reverse = false, className }: SplitContentLayoutProps) {
  return (
    <div className={cn('grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16', className)}>
      <div className={cn('lg:col-span-7', reverse && 'lg:order-2')}>{children}</div>
      <div className={cn('flex w-full justify-center lg:col-span-5 lg:justify-end', reverse && 'lg:order-1 lg:justify-start')}>
        {illustration}
      </div>
    </div>
  );
}

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  meta: string;
  children: React.ReactNode;
  backHref: string;
  backLabel?: string;
};

export function LegalPageShell({ eyebrow, title, meta, children, backHref, backLabel = 'Back to Home' }: LegalPageShellProps) {
  return (
    <PublicPage>
      <PublicPageBody>
        <PublicContainer size="lg">
          <SplitContentLayout
            illustration={
              <IllustrationFrame
                src="/testimonies_trust_illustration.png"
                alt="Trust, privacy, and protection illustration"
                aspectRatio="portrait"
              />
            }
          >
            <div>
              <PublicPageHeader eyebrow={eyebrow} title={title} meta={meta} />
              <div className="space-y-10 text-sm font-medium leading-relaxed text-foreground/80 sm:text-base">{children}</div>
              <div className="mt-10 flex border-t border-border pt-8">
                <PublicLinkButton href={backHref} variant="primary" size="sm" showArrow>
                  {backLabel}
                </PublicLinkButton>
              </div>
            </div>
          </SplitContentLayout>
        </PublicContainer>
      </PublicPageBody>
    </PublicPage>
  );
}

type LegalSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-inside list-disc space-y-2 pl-2 text-sm">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
