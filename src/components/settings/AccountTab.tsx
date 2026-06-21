'use client';

import { Button, Input } from '@/components/common';
import { useResendEmailOtp, useUpdateEmail, useUpdatePassword, useUpdatePhone, useUpdateUsername, useVerifyEmailOtp } from '@/hooks/useProfile';
import { apiMessage } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateEmailSchema, updateUsernameSchema, updatePhoneSchema, updatePasswordSchema } from '@/lib/validations';
import { useState } from 'react';

export default function AccountTab() {
  const emailForm = useForm({ resolver: zodResolver(updateEmailSchema), defaultValues: { email: '' } });
  const usernameForm = useForm({ resolver: zodResolver(updateUsernameSchema), defaultValues: { username: '' } });
  const phoneForm = useForm({ resolver: zodResolver(updatePhoneSchema), defaultValues: { phoneNumber: '' } });
  const passwordForm = useForm({ resolver: zodResolver(updatePasswordSchema), defaultValues: { oldPassword: '', newPassword: '', confirmNewPassword: '' } });

  const updateEmail = useUpdateEmail();
  const resendEmailOtp = useResendEmailOtp();
  const verifyEmailOtp = useVerifyEmailOtp();
  const updateUsername = useUpdateUsername();
  const updatePhone = useUpdatePhone();
  const updatePassword = useUpdatePassword();

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const onEmailSubmit = async (v: { email: string }) => {
    try { await updateEmail.mutateAsync(v); setOtpSent(true); toast.success('OTP sent to new email'); } catch (err) { toast.error(apiMessage(err)); }
  };

  const onVerifyOtp = async () => {
    try { await verifyEmailOtp.mutateAsync(otpCode); toast.success('Email verified'); setOtpSent(false); } catch (err) { toast.error(apiMessage(err)); }
  };

  const onUsernameSubmit = async (v: { username: string }) => {
    try { await updateUsername.mutateAsync(v); toast.success('Username updated'); } catch (err) { toast.error(apiMessage(err)); }
  };

  const onPhoneSubmit = async (v: { phoneNumber: string }) => {
    try { await updatePhone.mutateAsync(v); toast.success('Phone updated'); } catch (err) { toast.error(apiMessage(err)); }
  };

  const onPasswordSubmit = async (v: { oldPassword: string; newPassword: string; confirmNewPassword: string }) => {
    try { await updatePassword.mutateAsync(v); toast.success('Password updated'); passwordForm.reset(); } catch (err) { toast.error(apiMessage(err)); }
  };

  return (
    <>
      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <h2 className='mb-4 text-sm font-bold text-gray-900'>Email</h2>
        <form className='space-y-3' onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
          <Input label='New email' placeholder='New email' type='email' error={emailForm.formState.errors.email?.message} {...emailForm.register('email')} />
          <Button type='submit' disabled={updateEmail.isPending}>Update email</Button>
        </form>
        {otpSent && (
          <div className='mt-3 flex gap-2'>
            <Input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder='Enter OTP' />
            <Button onClick={onVerifyOtp}>Verify</Button>
            <Button variant='secondary' onClick={() => resendEmailOtp.mutate()}>Resend</Button>
          </div>
        )}
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <h2 className='mb-4 text-sm font-bold text-gray-900'>Username</h2>
        <form className='space-y-3' onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}>
          <Input label='New username' placeholder='New username' error={usernameForm.formState.errors.username?.message} {...usernameForm.register('username')} />
          <Button type='submit' disabled={updateUsername.isPending}>Update username</Button>
        </form>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <h2 className='mb-4 text-sm font-bold text-gray-900'>Phone</h2>
        <form className='space-y-3' onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
          <Input label='Phone number' placeholder='+1234567890' error={phoneForm.formState.errors.phoneNumber?.message} {...phoneForm.register('phoneNumber')} />
          <Button type='submit' disabled={updatePhone.isPending}>Update phone</Button>
        </form>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <h2 className='mb-4 text-sm font-bold text-gray-900'>Password</h2>
        <form className='space-y-3' onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <Input label='Current password' type='password' placeholder='Current password' error={passwordForm.formState.errors.oldPassword?.message} {...passwordForm.register('oldPassword')} />
          <Input label='New password' type='password' placeholder='New password' error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register('newPassword')} />
          <Input label='Confirm new password' type='password' placeholder='Confirm new password' error={passwordForm.formState.errors.confirmNewPassword?.message} {...passwordForm.register('confirmNewPassword')} />
          <Button type='submit' disabled={updatePassword.isPending}>Update password</Button>
        </form>
      </div>
    </>
  );
}
