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
      className={cn(
        'group relative w-full overflow-hidden rounded-3xl border border-border bg-background-secondary p-3 shadow-md transition-shadow duration-300 hover:shadow-lg sm:p-4',
        aspectClasses[aspectRatio],
        className,
      )}
    >
      <div className="pointer-events-none absolute top-0 left-0 h-8 w-8 rounded-tl-2xl border-t border-l border-foreground/30" />
      <div className="pointer-events-none absolute top-0 right-0 h-8 w-8 rounded-tr-2xl border-t border-r border-foreground/30" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 rounded-bl-2xl border-b border-l border-foreground/30" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 rounded-br-2xl border-b border-r border-foreground/30" />

      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover transition-transform duration-700 group-hover:scale-[1.03]', imageClassName)}
        />
      </div>
    </div>
  );
}
