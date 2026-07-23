'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button, Input } from '@/components/common';
import { useSignIn, useSignInSendOtp } from '@/hooks/useAuth';
import { apiMessage } from '@/lib/utils';
import { signInSchema } from '@/lib/validations';
import { ROUTES, DEFAULT_REDIRECT } from '@/constants/routes';

type Form = { email: string; password: string };

export default function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : DEFAULT_REDIRECT;
  const signin = useSignIn();
  const signinOtp = useSignInSendOtp();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(signInSchema) });

  const onSubmit = useCallback(
    async (values: Form) => {
      try {
        await signin.mutateAsync(values);
        await signinOtp.mutateAsync({ email: values.email });
        toast.success('OTP sent to your email');
        router.push(ROUTES.verifyOtp('signin', values.email, redirectTo));
      } catch (error) {
        toast.error(apiMessage(error));
      }
    },
    [signin, signinOtp, router, redirectTo],
  );

  const loading = signin.isPending || signinOtp.isPending || isSubmitting;

  return (
    <div className="flex w-full flex-col gap-4 py-8">
      <div className="mb-2">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Sign In</h1>
        <p className="mt-1 text-sm text-foreground-secondary">Welcome back. Enter your credentials to continue.</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          placeholder="Email"
          error={errors.email?.message}
          className="h-[50px] rounded-none border-border text-base"
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          className="h-[50px] rounded-none border-border text-base"
          {...register('password')}
        />
        <Button
          type="submit"
          className="mt-1 h-[50px] w-full rounded-none bg-primary text-background hover:bg-primary-light"
          size="lg"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Continue'}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs font-medium text-foreground/30">
        <span className="h-px flex-1 bg-foreground/10" />
        or
        <span className="h-px flex-1 bg-foreground/10" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <Link href={ROUTES.SIGNUP} className="font-semibold text-accent transition-colors hover:underline">
            Create account
          </Link>
          <Link href={ROUTES.FORGOT_PASSWORD} className="font-semibold text-accent transition-colors hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
