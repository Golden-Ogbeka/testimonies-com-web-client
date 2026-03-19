'use client';

import { Button, Card, Input } from '@/components/common';
import { useResendOtp, useResetPasswordUpdate, useSendOtp } from '@/hooks/useAuth';
import { apiMessage } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Step = 'send-otp' | 'reset';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('send-otp');
  const [email, setEmail] = useState('');

  const sendOtp = useSendOtp('reset-password');
  const resendOtp = useResendOtp('reset-password');
  const reset = useResetPasswordUpdate();

  const otpForm = useForm({ defaultValues: { email: '' } });
  const resetForm = useForm({ defaultValues: { otp: '', password: '' } });

  const onSendOtp = async (values: { email: string }) => {
    try {
      await sendOtp.mutateAsync(values);
      setEmail(values.email);
      toast.success('OTP sent to your email');
      setStep('reset');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onReset = async (values: { otp: string; password: string }) => {
    try {
      await reset.mutateAsync({ email, otp: values.otp, password: values.password });
      toast.success('Password reset successfully. Please sign in.');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <main className='mx-auto flex min-h-screen max-w-md items-center p-4'>
      <Card className='w-full'>
        <h1 className='mb-1 text-2xl font-bold'>Reset password</h1>
        <p className='mb-6 text-sm text-slate-500'>
          {step === 'send-otp' ? 'Enter your email to receive a reset code.' : `Enter the OTP sent to ${email}.`}
        </p>

        {step === 'send-otp' ? (
          <form className='space-y-3' onSubmit={otpForm.handleSubmit(onSendOtp)}>
            <Input placeholder='Email' type='email' {...otpForm.register('email', { required: true })} />
            <Button type='submit' className='w-full' disabled={sendOtp.isPending}>
              {sendOtp.isPending ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form className='space-y-3' onSubmit={resetForm.handleSubmit(onReset)}>
            <Input placeholder='OTP code' {...resetForm.register('otp', { required: true })} />
            <Input placeholder='New password' type='password' {...resetForm.register('password', { required: true })} />
            <Button type='submit' className='w-full' disabled={reset.isPending}>
              {reset.isPending ? 'Resetting...' : 'Reset password'}
            </Button>
            <Button type='button' variant='secondary' className='w-full' onClick={() => resendOtp.mutate({ email })} disabled={resendOtp.isPending}>
              Resend OTP
            </Button>
            <button type='button' onClick={() => setStep('send-otp')} className='w-full text-center text-xs text-slate-500 hover:text-slate-700'>
              Use a different email
            </button>
          </form>
        )}

        <div className='mt-4 text-center text-sm'>
          <Link href='/signin' className='text-blue-600'>Back to sign in</Link>
        </div>
      </Card>
    </main>
  );
}
