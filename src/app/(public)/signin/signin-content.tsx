'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button, Input } from '@/components/common';
import { useSignIn, useSignInSendOtp } from '@/hooks/useAuth';
import { apiMessage } from '@/lib/utils';
import { signInSchema } from '@/lib/validations';
import { ROUTES, DEFAULT_REDIRECT } from '@/constants/routes';
import { Feather } from 'lucide-react';

type Form = { email: string; password: string };

export default function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : DEFAULT_REDIRECT;
  const signin = useSignIn();
  const signinOtp = useSignInSendOtp();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(signInSchema) });

  const onSubmit = useCallback(async (values: Form) => {
    try {
      await signin.mutateAsync(values);
      await signinOtp.mutateAsync({ email: values.email });
      toast.success('OTP sent to your email');
      router.push(ROUTES.verifyOtp('signin', values.email, redirectTo));
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }, [signin, signinOtp, router, redirectTo]);

  const loading = signin.isPending || signinOtp.isPending || isSubmitting;

  return (
    <main className='flex min-h-screen flex-col bg-white'>
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
            <Input
              label='Email'
              placeholder='Email'
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label='Password'
              type='password'
              placeholder='Password'
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type='submit' className='w-full mt-5' size='lg' disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className='mt-6 flex items-center justify-between text-sm'>
            <Link
              href={ROUTES.SIGNUP}
              className='font-medium text-[#2C3248] hover:text-[#3a415a] transition-colors'
            >
              Create account
            </Link>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className='font-medium text-[#2C3248] hover:text-[#3a415a] transition-colors'
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
