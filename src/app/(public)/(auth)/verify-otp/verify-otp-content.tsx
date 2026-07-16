'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button, Input, OtpInput } from '@/components/common';
import { useResendOtp, useVerifyOtp } from '@/hooks/useAuth';
import { useCooldown } from '@/hooks/useCooldown';
import { apiMessage } from '@/lib/utils';
import { ROUTES, DEFAULT_REDIRECT } from '@/constants/routes';

const COOLDOWN = 120;

export default function VerifyOtpContent() {
  const params = useSearchParams();
  const router = useRouter();
  const mode = useMemo(() => {
    const val = params.get('mode');
    return val === 'signup' ? 'signup' : 'signin';
  }, [params]);
  const defaultEmail = params.get('email') ?? '';
  const returnTo = params.get('returnTo');
  const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : DEFAULT_REDIRECT;

  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState('');

  const verify = useVerifyOtp(mode);
  const resendOtp = useResendOtp(mode);
  const cooldown = useCooldown(COOLDOWN);

  const onSubmit = async () => {
    if (!code.trim() || code.length < 6) {
      toast.error('Enter the complete verification code');
      return;
    }
    try {
      await verify.mutateAsync({ email, verificationCode: code });
      if (mode === 'signin') {
        toast.success('Verification successful');
        window.location.href = redirectTo;
      } else {
        toast.success('Verification successful. Sign in to continue');
        router.push(ROUTES.SIGNIN);
      }
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onResend = async () => {
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    try {
      await resendOtp.mutateAsync({ email });
      cooldown.reset();
      toast.success('OTP resent');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 py-8">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        aria-label="Email address"
        className="h-[50px] rounded-none border-border text-base"
        disabled
        readOnly
      />

      <div className="flex justify-center">
        <OtpInput value={code} onChange={setCode} numInputs={6} />
      </div>

      <Button
        onClick={onSubmit}
        className="h-[50px] w-full rounded-none bg-primary text-background hover:bg-primary-light"
        size="lg"
        disabled={verify.isPending || code.length < 6}
      >
        {verify.isPending ? 'Verifying...' : 'Verify'}
      </Button>

      <Button type="button" variant="ghost" disabled={cooldown.isRunning || resendOtp.isPending} onClick={onResend} className="text-sm">
        {resendOtp.isPending ? 'Sending...' : cooldown.isRunning ? `Resend OTP (${cooldown.fmt()})` : 'Resend OTP'}
      </Button>
    </div>
  );
}
