import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Feather } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white px-4'>
      <div className='text-center max-w-sm'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2C3248]'>
          <Feather className='h-8 w-8 text-white' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900'>404</h1>
        <p className='mt-2 text-sm text-gray-500'>
          This page does not exist or has been removed.
        </p>
        <Link
          href={ROUTES.HOME}
          className='mt-6 inline-flex items-center justify-center rounded-lg bg-[#2C3248] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3a415a]'
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
