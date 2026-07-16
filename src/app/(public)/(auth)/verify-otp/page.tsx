import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SpinnerPage } from '@/components/common';
import VerifyOtpContent from './verify-otp-content';

export const metadata: Metadata = {
  title: 'Verify OTP',
  description: 'Verify your email with the one-time password sent to you.',
};

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<SpinnerPage />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
