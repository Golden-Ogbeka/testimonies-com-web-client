'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Card, Input } from '@/components/common';
import { useResendOtp, useVerifyOtp } from '@/hooks/useAuth';
import { apiMessage } from '@/lib/utils';

type OtpForm = { email: string; otp: string };

function VerifyOtpContent() {
  const params = useSearchParams();
  const router = useRouter();
  const mode = useMemo(() => {
    const val = params.get('mode');
    return val === 'signup' ? 'signup' : 'signin';
  }, [params]);
  const defaultEmail = params.get('email') ?? '';
  const returnTo = params.get('returnTo');
  const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : '/home';

  const verify = useVerifyOtp(mode);
  const resend = useResendOtp(mode);
  const { register, handleSubmit, getValues } = useForm<OtpForm>({ defaultValues: { email: defaultEmail } });

  const onSubmit = async (values: OtpForm) => {
    try {
      await verify.mutateAsync(values);
      toast.success('Verification successful');
      router.replace(redirectTo);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onResend = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    try {
      await resend.mutateAsync({ email });
      toast.success('OTP resent');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <main className='mx-auto flex min-h-screen max-w-md items-center p-4'>
      <Card className='w-full'>
        <h1 className='mb-4 text-2xl font-bold'>Verify OTP</h1>
        <form className='space-y-3' onSubmit={handleSubmit(onSubmit)}>
          <Input placeholder='Email' {...register('email', { required: true })} />
          <Input placeholder='OTP code' {...register('otp', { required: true })} />
          <Button type='submit' className='w-full' disabled={verify.isPending}>
            {verify.isPending ? 'Verifying...' : 'Verify'}
          </Button>
          <Button type='button' variant='secondary' className='w-full' onClick={onResend} disabled={resend.isPending}>
            {resend.isPending ? 'Resending...' : 'Resend OTP'}
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<main className='mx-auto flex min-h-screen max-w-md items-center p-4'><Card className='w-full'>Loading...</Card></main>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
