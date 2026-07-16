import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
};

export function PageHeader({ icon: Icon, title, children }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-lg">
      <div className="flex items-center gap-2.5">
        <Icon className="h-5 w-5 text-foreground/60" strokeWidth={1.5} />
        <h1 className="font-serif text-xl font-extralight tracking-tight text-foreground">{title}</h1>
      </div>
      {children}
    </div>
  );
}
