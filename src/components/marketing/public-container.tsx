import { cn } from '@/lib/utils';

type PublicContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
} as const;

export function PublicContainer({ children, className, size = 'lg' }: PublicContainerProps) {
  return <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>{children}</div>;
}
