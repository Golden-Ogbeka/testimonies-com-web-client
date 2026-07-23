import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  size?: number;
  href?: string;
  priority?: boolean;
};

export function BrandLogo({ className, size = 32, href, priority = false }: BrandLogoProps) {
  const img = (
    <Image
      src="/brand/logo.png"
      alt="Testimonies"
      width={size}
      height={size}
      priority={priority}
      className={cn('h-auto object-contain', className)}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex transition-transform active:scale-95">
        {img}
      </Link>
    );
  }

  return img;
}
