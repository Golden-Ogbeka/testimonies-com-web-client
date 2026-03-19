import Image from 'next/image';
import { cn } from '@/lib/utils';

type AvatarProps = {
  name?: string;
  src?: string;
  className?: string;
};

export function Avatar({ name, src, className }: AvatarProps) {
  const initial = (name?.trim()?.[0] ?? 'T').toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? 'user'}
        width={40}
        height={40}
        unoptimized
        className={cn('h-10 w-10 rounded-full object-cover', className)}
      />
    );
  }

  return (
    <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white', className)}>
      {initial}
    </div>
  );
}
