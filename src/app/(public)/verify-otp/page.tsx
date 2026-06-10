'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button, OtpInput, SpinnerPage } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useResendOtp, useVerifyOtp } from '@/hooks/useAuth';
import { useCooldown } from '@/hooks/useCooldown';
import { apiMessage } from '@/lib/utils';
import { Feather } from 'lucide-react';

const COOLDOWN = 120;

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

  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState('');

  const verify = useVerifyOtp(mode);
  const resendOtp = useResendOtp(mode);
  const cooldown = useCooldown(COOLDOWN);

  const onSubmit = async () => {
    if (!code.trim() || code.length < 6) { toast.error('Enter the complete verification code'); return; }
    try {
      const data = await verify.mutateAsync({ email, verificationCode: code });
      setAuth(data.token, data.user);
      toast.success('Verification successful');
      router.replace(redirectTo);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onResend = async () => {
    if (!email) { toast.error('Enter your email first'); return; }
    try {
      await resendOtp.mutateAsync({ email });
      cooldown.reset();
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

          <div className='space-y-4'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              className='h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2C3248] focus:ring-1 focus:ring-[#2C3248]/20'
            />

            <div className='flex justify-center'>
              <OtpInput value={code} onChange={setCode} numInputs={6} />
            </div>

            <Button
              onClick={onSubmit}
              className='w-full'
              size='lg'
              disabled={verify.isPending || code.length < 6}
            >
              {verify.isPending ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          <div className='mt-4 text-center'>
            <Button
              type='button'
              variant='ghost'
              disabled={cooldown.isRunning || resendOtp.isPending}
              onClick={onResend}
              className='text-sm'
            >
              {resendOtp.isPending ? 'Sending...' : cooldown.isRunning ? `Resend OTP (${cooldown.fmt()})` : 'Resend OTP'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<SpinnerPage />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
