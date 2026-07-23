'use client';

import { Button, Input, OtpInput } from '@/components/common';
import { useResendOtp, useResetPasswordUpdate, useSendOtp } from '@/hooks/useAuth';
import { useCooldown } from '@/hooks/useCooldown';
import { apiMessage } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { forgotPasswordOtpSchema, resetPasswordSchema } from '@/lib/validations';
import { ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';

const COOLDOWN = 120;

type Step = 'send-otp' | 'reset';

export default function ForgotPasswordContent() {
  const [step, setStep] = useState<Step>('send-otp');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [code, setCode] = useState('');

  const sendOtp = useSendOtp('reset-password');
  const resendOtp = useResendOtp('reset-password');
  const reset = useResetPasswordUpdate();
  const cooldown = useCooldown(COOLDOWN);

  const otpForm = useForm({ resolver: zodResolver(forgotPasswordOtpSchema), defaultValues: { email: '' } });
  const resetForm = useForm({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: '' } });

  const onSendOtp = async (values: { email: string }) => {
    try {
      await sendOtp.mutateAsync(values);
      setEmail(values.email);
      cooldown.reset();
      toast.success('OTP sent to your email');
      setStep('reset');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onReset = async (values: { password: string }) => {
    if (!code.trim() || code.length < 6) {
      toast.error('Enter the complete verification code');
      return;
    }
    try {
      await reset.mutateAsync({
        email,
        verificationCode: code,
        newPassword: values.password,
      });
      toast.success('Password reset successfully. Please sign in.');
      resetForm.reset();
      router.push(ROUTES.SIGNIN);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const inputClass = 'h-[50px] rounded-none border-border text-base';

  return (
    <div className="flex w-full flex-col gap-4 py-8">
      <div className="mb-2">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Password Reset</h1>
        <p className="mt-1 text-sm text-foreground-secondary">Enter your email to receive a verification code and reset your password.</p>
      </div>
      {step === 'send-otp' ? (
        <form className="flex flex-col gap-4" onSubmit={otpForm.handleSubmit(onSendOtp)}>
          <Input
            label="Email"
            placeholder="Email"
            type="email"
            error={otpForm.formState.errors.email?.message}
            className={inputClass}
            {...otpForm.register('email')}
          />
          <Button
            type="submit"
            className="h-[50px] w-full rounded-none bg-primary text-background hover:bg-primary-light"
            size="lg"
            disabled={sendOtp.isPending}
          >
            {sendOtp.isPending ? 'Sending...' : 'Continue'}
          </Button>
        </form>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={resetForm.handleSubmit(onReset)}>
          <div className="flex justify-center">
            <OtpInput value={code} onChange={setCode} numInputs={6} />
          </div>
          <Input
            placeholder="New password"
            label="New password"
            type="password"
            error={resetForm.formState.errors.password?.message}
            className={inputClass}
            {...resetForm.register('password')}
          />
          <Button
            type="submit"
            className="h-[50px] w-full rounded-none bg-primary text-background hover:bg-primary-light"
            size="lg"
            disabled={reset.isPending || code.length < 6}
          >
            {reset.isPending ? 'Resetting...' : 'Reset password'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={cooldown.isRunning || resendOtp.isPending}
            onClick={async () => {
              try {
                await resendOtp.mutateAsync({ email });
                cooldown.reset();
                toast.success('OTP resent');
              } catch (err) {
                toast.error(apiMessage(err));
              }
            }}
          >
            {resendOtp.isPending ? 'Sending...' : cooldown.isRunning ? `Resend OTP (${cooldown.fmt()})` : 'Resend OTP'}
          </Button>
          <button
            type="button"
            onClick={() => setStep('send-otp')}
            className="w-full text-center text-xs text-foreground/50 hover:text-foreground transition-colors"
          >
            Use a different email
          </button>
        </form>
      )}

      <div className="flex items-center gap-3 text-xs font-medium text-foreground/30">
        <span className="h-px flex-1 bg-foreground/10" />
        or
        <span className="h-px flex-1 bg-foreground/10" />
      </div>

      <div className="text-center text-sm text-foreground/70">
        <Link href={ROUTES.SIGNIN} className="font-semibold text-accent transition-colors hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
