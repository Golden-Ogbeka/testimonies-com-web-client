import type { Metadata } from 'next';
import ForgotPasswordContent from './forgot-password-content';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Testimonies account password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
