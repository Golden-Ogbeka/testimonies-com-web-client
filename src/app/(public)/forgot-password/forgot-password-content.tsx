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
import { Feather } from 'lucide-react';
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

  return (
    <main className='flex min-h-screen flex-col bg-white'>
      <div className='flex flex-1 items-center justify-center px-4 py-12'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C3248]'>
              <Feather className='h-6 w-6 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>Reset password</h1>
            <p className='mt-1 text-sm text-gray-500'>
              {step === 'send-otp'
                ? 'Enter your email to receive a reset code.'
                : `Enter the code sent to ${email}.`}
            </p>
          </div>

          {step === 'send-otp' ? (
            <form className='space-y-3' onSubmit={otpForm.handleSubmit(onSendOtp)}>
              <Input
                placeholder='Email'
                type='email'
                error={otpForm.formState.errors.email?.message}
                {...otpForm.register('email')}
              />
              <Button
                type='submit'
                className='w-full'
                size='lg'
                disabled={sendOtp.isPending}
              >
                {sendOtp.isPending ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form className='space-y-4' onSubmit={resetForm.handleSubmit(onReset)}>
              <div className='flex justify-center'>
                <OtpInput value={code} onChange={setCode} numInputs={6} />
              </div>
              <Input
                placeholder='New password'
                label='New password'
                type='password'
                error={resetForm.formState.errors.password?.message}
                {...resetForm.register('password')}
              />
              <Button
                type='submit'
                className='w-full'
                size='lg'
                disabled={reset.isPending || code.length < 6}
              >
                {reset.isPending ? 'Resetting...' : 'Reset password'}
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='w-full'
                disabled={cooldown.isRunning || resendOtp.isPending}
                onClick={async () => {
                  try { await resendOtp.mutateAsync({ email }); cooldown.reset(); toast.success('OTP resent'); }
                  catch (err) { toast.error(apiMessage(err)); }
                }}
              >
                {resendOtp.isPending
                  ? 'Sending...'
                  : cooldown.isRunning
                    ? `Resend OTP (${cooldown.fmt()})`
                    : 'Resend OTP'}
              </Button>
              <button
                type='button'
                onClick={() => setStep('send-otp')}
                className='w-full text-center text-xs text-gray-500 hover:text-gray-700 transition-colors'
              >
                Use a different email
              </button>
            </form>
          )}

          <div className='mt-6 text-center'>
            <Link
              href={ROUTES.SIGNIN}
              className='text-sm font-medium text-[#2C3248] hover:text-[#3a415a] transition-colors'
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
