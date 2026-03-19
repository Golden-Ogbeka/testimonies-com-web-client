'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Card, Input } from '@/components/common';
import { useSignIn, useSignInSendOtp } from '@/hooks/useAuth';
import { apiMessage } from '@/lib/utils';

type PasswordForm = { email: string; password: string };
type OtpRequestForm = { email: string };

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : '/home';
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  const signin = useSignIn();
  const signinOtp = useSignInSendOtp();
  const passwordForm = useForm<PasswordForm>();
  const otpForm = useForm<OtpRequestForm>();

  const onPasswordSubmit = async (values: PasswordForm) => {
    try {
      await signin.mutateAsync(values);
      toast.success('Welcome back');
      router.replace(redirectTo);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onOtpRequest = async (values: OtpRequestForm) => {
    try {
      await signinOtp.mutateAsync(values);
      toast.success('OTP sent to your email');
      router.push(
        `/verify-otp?mode=signin&email=${encodeURIComponent(values.email)}&returnTo=${encodeURIComponent(redirectTo)}`
      );
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <main className='mx-auto flex min-h-screen max-w-md items-center p-4'>
      <Card className='w-full'>
        <h1 className='mb-1 text-2xl font-bold'>Sign in</h1>
        <p className='mb-6 text-sm text-slate-500'>Welcome back to Testimonies.</p>

        <div className='mb-4 grid grid-cols-2 gap-2'>
          <Button variant={method === 'password' ? 'primary' : 'secondary'} onClick={() => setMethod('password')}>Password</Button>
          <Button variant={method === 'otp' ? 'primary' : 'secondary'} onClick={() => setMethod('otp')}>Email OTP</Button>
        </div>

        {method === 'password' ? (
          <form className='space-y-3' onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <Input placeholder='Email' {...passwordForm.register('email', { required: true })} />
            <Input type='password' placeholder='Password' {...passwordForm.register('password', { required: true })} />
            <Button type='submit' className='w-full' disabled={signin.isPending}>
              {signin.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <form className='space-y-3' onSubmit={otpForm.handleSubmit(onOtpRequest)}>
            <Input placeholder='Email' {...otpForm.register('email', { required: true })} />
            <Button type='submit' className='w-full' disabled={signinOtp.isPending}>
              {signinOtp.isPending ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        )}

        <div className='mt-4 flex items-center justify-between text-sm text-slate-600'>
          <Link href='/signup' className='text-blue-600'>Create account</Link>
          <Link href='/forgot-password' className='text-blue-600'>Forgot password?</Link>
        </div>
      </Card>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className='mx-auto flex min-h-screen max-w-md items-center p-4'><Card className='w-full'>Loading...</Card></main>}>
      <SignInContent />
    </Suspense>
  );
}
