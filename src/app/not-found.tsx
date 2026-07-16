import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { BrandLogo } from '@/components/common';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-6">
          <BrandLogo size={100} />
        </div>
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted">This page does not exist or has been removed.</p>
        <Link
          href={ROUTES.HOME}
          className="mt-6 inline-flex items-center justify-center rounded-none bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary-light"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
