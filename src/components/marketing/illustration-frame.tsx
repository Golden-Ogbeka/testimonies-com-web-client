import Image from 'next/image';
import { cn } from '@/lib/utils';

type IllustrationFrameProps = {
  src: string;
  alt: string;
  priority?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  className?: string;
  imageClassName?: string;
};

const aspectClasses = {
  square: 'aspect-square max-w-md',
  portrait: 'aspect-[4/5] max-w-sm',
  landscape: 'aspect-[4/3] max-w-lg',
} as const;

export function IllustrationFrame({
  src,
  alt,
  priority = false,
  aspectRatio = 'square',
  className,
  imageClassName,
}: IllustrationFrameProps) {
  const sizes =
    aspectRatio === 'portrait'
      ? '(max-width: 640px) 100vw, 350px'
      : aspectRatio === 'landscape'
        ? '(max-width: 640px) 100vw, 512px'
        : '(max-width: 640px) 100vw, 450px';

  return (
    <div
      className={cn('relative w-full overflow-hidden border border-border bg-background-secondary', aspectClasses[aspectRatio], className)}
    >
      <div className="relative h-full w-full">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn('object-cover', imageClassName)} />
      </div>
    </div>
  );
}
