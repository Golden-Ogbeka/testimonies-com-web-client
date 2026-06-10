'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input } from '@/components/common';
import { useSignIn, useSignInSendOtp } from '@/hooks/useAuth';
import { apiMessage } from '@/lib/utils';
import { Feather } from 'lucide-react';

type Form = { email: string; password: string };

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : '/home';
  const signin = useSignIn();
  const signinOtp = useSignInSendOtp();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Form>();

  const onSubmit = async (values: Form) => {
    try {
      await signin.mutateAsync(values);
      await signinOtp.mutateAsync({ email: values.email });
      toast.success('OTP sent to your email');
      router.push(`/verify-otp?mode=signin&email=${encodeURIComponent(values.email)}&returnTo=${encodeURIComponent(redirectTo)}`);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const loading = signin.isPending || signinOtp.isPending || isSubmitting;

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <div className='flex flex-1 items-center justify-center px-4 py-12'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C3248]'>
              <Feather className='h-6 w-6 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>Welcome back</h1>
            <p className='mt-1 text-sm text-gray-500'>Sign in to share your testimony</p>
          </div>

          <form className='space-y-3' onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder='Email' {...register('email', { required: true })} />
            <Input type='password' placeholder='Password' {...register('password', { required: true })} />
            <Button type='submit' className='w-full' size='lg' disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className='mt-6 flex items-center justify-between text-sm'>
            <Link href='/signup' className='font-medium text-[#2C3248] hover:text-[#3a415a] transition-colors'>
              Create account
            </Link>
            <Link href='/forgot-password' className='font-medium text-[#2C3248] hover:text-[#3a415a] transition-colors'>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
