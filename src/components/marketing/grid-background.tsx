import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FloatingPill = {
  label: string;
  icon: LucideIcon;
  color: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: string;
};

type FloatingPillsProps = {
  pills: FloatingPill[];
  className?: string;
};

export function FloatingPills({ pills, className }: FloatingPillsProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden select-none motion-reduce:hidden', className)} aria-hidden>
      {pills.map((pill) => {
        const IconComponent = pill.icon;
        return (
          <div
            key={pill.label}
            className={cn(
              'absolute hidden items-center gap-2 rounded-full border bg-gradient-to-r px-3 py-1.5 shadow-sm backdrop-blur-sm motion-safe:animate-pulse sm:flex',
              pill.color,
            )}
            style={{
              top: pill.top,
              bottom: pill.bottom,
              left: pill.left,
              right: pill.right,
              animationDelay: pill.delay,
              animationDuration: '6s',
            }}
          >
            <IconComponent className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-tight whitespace-nowrap">{pill.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function GridBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 grid grid-cols-4 gap-0 border-x border-border/10 opacity-60 md:grid-cols-8"
      aria-hidden
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className={cn('h-full border-r border-border/20', i % 2 === 1 && 'hidden md:block')} />
      ))}
    </div>
  );
}
