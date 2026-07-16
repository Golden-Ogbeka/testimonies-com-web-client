import type { Metadata } from 'next';
import SignInContent from './signin-content';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Testimonies account and share your story.',
};

export default function SignInPage() {
  return <SignInContent />;
}
