import Image from 'next/image';
import { cn } from '@/lib/utils';

type AvatarProps = {
  name?: string;
  src?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-20 w-20 text-2xl',
};

export function Avatar({ name, src, className, size = 'md' }: AvatarProps) {
  const initial = (name?.trim()?.[0] ?? 'T').toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? 'user'}
        width={40}
        height={40}
        unoptimized
        className={cn('rounded-full object-cover ring-2 ring-gray-100', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-[#2C3248] font-semibold text-white',
        sizeMap[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
