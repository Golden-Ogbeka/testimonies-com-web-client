import { Suspense } from 'react';
import type { Metadata } from 'next';
import SignInContent from './signin-content';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Testimonies account and share your story.',
};

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2C3248]' />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
