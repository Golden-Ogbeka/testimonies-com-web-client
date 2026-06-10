'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useResendOtp, useVerifyOtp } from '@/hooks/useAuth';
import { apiMessage } from '@/lib/utils';
import { Feather } from 'lucide-react';

type OtpForm = { email: string; otp: string };

function VerifyOtpContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthState();
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
      const data = await verify.mutateAsync(values);
      setAuth(data.token, data.user);
      toast.success('Verification successful');
      router.replace(redirectTo);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onResend = async () => {
    const email = getValues('email');
    if (!email) { toast.error('Enter your email first'); return; }
    try {
      await resend.mutateAsync({ email });
      toast.success('OTP resent');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <div className='flex flex-1 items-center justify-center px-4 py-12'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C3248]'>
              <Feather className='h-6 w-6 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>Verify OTP</h1>
            <p className='mt-1 text-sm text-gray-500'>Enter the code sent to your email</p>
          </div>

          <form className='space-y-3' onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder='Email' {...register('email', { required: true })} />
            <Input placeholder='OTP code' {...register('otp', { required: true })} />
            <Button type='submit' className='w-full' size='lg' disabled={verify.isPending}>
              {verify.isPending ? 'Verifying...' : 'Verify'}
            </Button>
            <Button type='button' variant='secondary' className='w-full' onClick={onResend} disabled={resend.isPending}>
              {resend.isPending ? 'Resending...' : 'Resend OTP'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2C3248]' />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
