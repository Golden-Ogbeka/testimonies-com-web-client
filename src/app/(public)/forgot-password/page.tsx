'use client';

import { Button, Input } from '@/components/common';
import { useResendOtp, useResetPasswordUpdate, useSendOtp } from '@/hooks/useAuth';
import { apiMessage } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Feather } from 'lucide-react';

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
    <div className='flex min-h-screen flex-col bg-white'>
      <div className='flex flex-1 items-center justify-center px-4 py-12'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C3248]'>
              <Feather className='h-6 w-6 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>Reset password</h1>
            <p className='mt-1 text-sm text-gray-500'>
              {step === 'send-otp' ? 'Enter your email to receive a reset code.' : `Enter the OTP sent to ${email}.`}
            </p>
          </div>

          {step === 'send-otp' ? (
            <form className='space-y-3' onSubmit={otpForm.handleSubmit(onSendOtp)}>
              <Input placeholder='Email' type='email' {...otpForm.register('email', { required: true })} />
              <Button type='submit' className='w-full' size='lg' disabled={sendOtp.isPending}>
                {sendOtp.isPending ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form className='space-y-3' onSubmit={resetForm.handleSubmit(onReset)}>
              <Input placeholder='OTP code' {...resetForm.register('otp', { required: true })} />
              <Input placeholder='New password' type='password' {...resetForm.register('password', { required: true })} />
              <Button type='submit' className='w-full' size='lg' disabled={reset.isPending}>
                {reset.isPending ? 'Resetting...' : 'Reset password'}
              </Button>
              <Button type='button' variant='secondary' className='w-full' onClick={() => resendOtp.mutate({ email })} disabled={resendOtp.isPending}>
                Resend OTP
              </Button>
              <button type='button' onClick={() => setStep('send-otp')} className='w-full text-center text-xs text-gray-500 hover:text-gray-700 transition-colors'>
                Use a different email
              </button>
            </form>
          )}

          <div className='mt-6 text-center'>
            <Link href='/signin' className='text-sm font-medium text-[#2C3248] hover:text-[#3a415a] transition-colors'>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
