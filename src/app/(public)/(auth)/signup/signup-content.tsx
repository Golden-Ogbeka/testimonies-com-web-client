'use client';

import { Button, Input } from '@/components/common';
import { useSendOtp, useSignUpIndividual, useSignUpOrganization } from '@/hooks/useAuth';
import { apiMessage, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { individualSignUpFormSchema, organizationSignUpFormSchema } from '@/lib/validations';
import { ROUTES } from '@/constants/routes';

type IndividualForm = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
};
type OrgForm = {
  businessName: string;
  username: string;
  email: string;
  password: string;
  businessPhoneNumber: string;
  businessAddress: string;
};

export default function SignUpContent() {
  const router = useRouter();
  const [kind, setKind] = useState<'individual' | 'organization'>('individual');
  const signupIndividual = useSignUpIndividual();
  const signupOrg = useSignUpOrganization();
  const sendOtp = useSendOtp('signup');
  const individualForm = useForm<IndividualForm>({
    resolver: zodResolver(individualSignUpFormSchema),
  });
  const orgForm = useForm<OrgForm>({
    resolver: zodResolver(organizationSignUpFormSchema),
  });

  const onIndividualSubmit = async (values: IndividualForm) => {
    try {
      const names = values.fullName.trim().split(/\s+/);
      const lastName = names.length > 1 ? names.pop()! : '';
      const firstName = names.join(' ');
      await signupIndividual.mutateAsync({
        firstName,
        lastName,
        email: values.email,
        password: values.password,
        username: values.username,
        phoneNumber: values.phoneNumber,
      });
      await sendOtp.mutateAsync({ email: values.email });
      toast.success('Account created. Check your email for OTP.');
      router.replace(ROUTES.verifyOtp('signup', values.email));
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onOrgSubmit = async (values: OrgForm) => {
    try {
      await signupOrg.mutateAsync({
        businessName: values.businessName,
        businessEmail: values.email,
        password: values.password,
        username: values.username,
        businessPhoneNumber: values.businessPhoneNumber,
        businessAddress: values.businessAddress,
      });
      await sendOtp.mutateAsync({ email: values.email });
      toast.success('Organization account created. Check your email for OTP.');
      router.replace(ROUTES.verifyOtp('signup', values.email));
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const inputClass = 'h-[50px] rounded-none border-border text-base';

  return (
    <div className="flex w-full flex-col gap-4 py-8">
      <div className="grid grid-cols-2 gap-1 border border-border bg-background-secondary p-1">
        <button
          onClick={() => setKind('individual')}
          className={cn(
            'py-2 text-sm font-semibold transition-colors',
            kind === 'individual' ? 'bg-primary text-background' : 'text-foreground/50 hover:text-foreground',
          )}
        >
          Individual
        </button>
        <button
          onClick={() => setKind('organization')}
          className={cn(
            'py-2 text-sm font-semibold transition-colors',
            kind === 'organization' ? 'bg-primary text-background' : 'text-foreground/50 hover:text-foreground',
          )}
        >
          Organization
        </button>
      </div>

      {kind === 'individual' ? (
        <form className="flex flex-col gap-4" onSubmit={individualForm.handleSubmit(onIndividualSubmit)}>
          <Input
            label="Email"
            placeholder="Email"
            type="email"
            autoComplete="email"
            error={individualForm.formState.errors.email?.message}
            className={inputClass}
            {...individualForm.register('email')}
          />
          <Input
            label="Password"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            error={individualForm.formState.errors.password?.message}
            className={inputClass}
            {...individualForm.register('password')}
          />
          <Input
            label="Username"
            placeholder="Username"
            autoComplete="off"
            error={individualForm.formState.errors.username?.message}
            className={inputClass}
            {...individualForm.register('username')}
          />
          <Input
            label="Full name"
            placeholder="Full name"
            autoComplete="name"
            error={individualForm.formState.errors.fullName?.message}
            className={inputClass}
            {...individualForm.register('fullName')}
          />
          <Input
            label="Phone number"
            placeholder="Phone number (+1234567890)"
            autoComplete="tel"
            error={individualForm.formState.errors.phoneNumber?.message}
            className={inputClass}
            {...individualForm.register('phoneNumber')}
          />
          <Button
            type="submit"
            className="h-[50px] w-full rounded-none bg-primary text-background hover:bg-primary-light"
            size="lg"
            disabled={signupIndividual.isPending}
          >
            {signupIndividual.isPending ? 'Creating...' : 'Continue'}
          </Button>
        </form>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={orgForm.handleSubmit(onOrgSubmit)}>
          <Input
            label="Business email"
            placeholder="Business email"
            type="email"
            autoComplete="email"
            error={orgForm.formState.errors.email?.message}
            className={inputClass}
            {...orgForm.register('email')}
          />
          <Input
            label="Password"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            error={orgForm.formState.errors.password?.message}
            className={inputClass}
            {...orgForm.register('password')}
          />
          <Input
            label="Username"
            placeholder="Username"
            autoComplete="off"
            error={orgForm.formState.errors.username?.message}
            className={inputClass}
            {...orgForm.register('username')}
          />
          <Input
            label="Organization name"
            placeholder="Organization name"
            autoComplete="organization"
            error={orgForm.formState.errors.businessName?.message}
            className={inputClass}
            {...orgForm.register('businessName')}
          />
          <Input
            label="Phone number"
            placeholder="Business phone (+1234567890)"
            autoComplete="tel"
            error={orgForm.formState.errors.businessPhoneNumber?.message}
            className={inputClass}
            {...orgForm.register('businessPhoneNumber')}
          />
          <Input
            label="Business address"
            placeholder="Business address"
            autoComplete="street-address"
            error={orgForm.formState.errors.businessAddress?.message}
            className={inputClass}
            {...orgForm.register('businessAddress')}
          />
          <Button
            type="submit"
            className="h-[50px] w-full rounded-none bg-primary text-background hover:bg-primary-light"
            size="lg"
            disabled={signupOrg.isPending}
          >
            {signupOrg.isPending ? 'Creating...' : 'Continue'}
          </Button>
        </form>
      )}

      <div className="flex items-center gap-3 text-xs font-medium text-foreground/30">
        <span className="h-px flex-1 bg-foreground/10" />
        or
        <span className="h-px flex-1 bg-foreground/10" />
      </div>

      <div className="text-center text-sm text-foreground/70">
        Already have an account?{' '}
        <Link href={ROUTES.SIGNIN} className="font-semibold text-accent transition-colors hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
