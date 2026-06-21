import type { Metadata } from 'next';
import SignUpContent from './signup-content';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Testimonies account and start sharing your testimony.',
};

export default function SignUpPage() {
  return <SignUpContent />;
}
