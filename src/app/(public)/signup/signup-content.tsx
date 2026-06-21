'use client';

import { Button, Input } from '@/components/common';
import { useSignUpIndividual, useSignUpOrganization } from '@/hooks/useAuth';
import { apiMessage, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { individualSignUpFormSchema, organizationSignUpFormSchema } from '@/lib/validations';
import { ROUTES } from '@/constants/routes';
import { Feather } from 'lucide-react';

type IndividualForm = { fullName: string; username: string; email: string; password: string; phoneNumber: string };
type OrgForm = { businessName: string; username: string; email: string; password: string; businessPhoneNumber: string; businessAddress: string };

export default function SignUpContent() {
  const router = useRouter();
  const [kind, setKind] = useState<'individual' | 'organization'>('individual');
  const signupIndividual = useSignUpIndividual();
  const signupOrg = useSignUpOrganization();
  const individualForm = useForm<IndividualForm>({ resolver: zodResolver(individualSignUpFormSchema) });
  const orgForm = useForm<OrgForm>({ resolver: zodResolver(organizationSignUpFormSchema) });

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
      toast.success('Organization account created. Check your email for OTP.');
      router.replace(ROUTES.verifyOtp('signup', values.email));
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
            <h1 className='text-2xl font-bold text-gray-900'>Create account</h1>
            <p className='mt-1 text-sm text-gray-500'>Join and start sharing your story.</p>
          </div>

          <div className='mb-6 grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1'>
            <button
              onClick={() => setKind('individual')}
              className={cn(
                'rounded-md py-2 text-sm font-medium transition-colors',
                kind === 'individual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Individual
            </button>
            <button
              onClick={() => setKind('organization')}
              className={cn(
                'rounded-md py-2 text-sm font-medium transition-colors',
                kind === 'organization' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Organization
            </button>
          </div>

          {kind === 'individual' ? (
            <form className='space-y-3' onSubmit={individualForm.handleSubmit(onIndividualSubmit)}>
              <Input placeholder='Full name' error={individualForm.formState.errors.fullName?.message} {...individualForm.register('fullName')} />
              <Input placeholder='Username' error={individualForm.formState.errors.username?.message} {...individualForm.register('username')} />
              <Input placeholder='Email' type='email' error={individualForm.formState.errors.email?.message} {...individualForm.register('email')} />
              <Input placeholder='Phone number (+1234567890)' error={individualForm.formState.errors.phoneNumber?.message} {...individualForm.register('phoneNumber')} />
              <Input placeholder='Password' type='password' error={individualForm.formState.errors.password?.message} {...individualForm.register('password')} />
              <Button type='submit' className='w-full' size='lg' disabled={signupIndividual.isPending}>
                {signupIndividual.isPending ? 'Creating...' : 'Create account'}
              </Button>
            </form>
          ) : (
            <form className='space-y-3' onSubmit={orgForm.handleSubmit(onOrgSubmit)}>
              <Input placeholder='Organization name' error={orgForm.formState.errors.businessName?.message} {...orgForm.register('businessName')} />
              <Input placeholder='Username' error={orgForm.formState.errors.username?.message} {...orgForm.register('username')} />
              <Input placeholder='Business email' type='email' error={orgForm.formState.errors.email?.message} {...orgForm.register('email')} />
              <Input placeholder='Business phone (+1234567890)' error={orgForm.formState.errors.businessPhoneNumber?.message} {...orgForm.register('businessPhoneNumber')} />
              <Input placeholder='Business address' error={orgForm.formState.errors.businessAddress?.message} {...orgForm.register('businessAddress')} />
              <Input placeholder='Password' type='password' error={orgForm.formState.errors.password?.message} {...orgForm.register('password')} />
              <Button type='submit' className='w-full' size='lg' disabled={signupOrg.isPending}>
                {signupOrg.isPending ? 'Creating...' : 'Create organization'}
              </Button>
            </form>
          )}

          <div className='mt-6 text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <Link href={ROUTES.SIGNIN} className='font-medium text-[#2C3248] hover:text-[#3a415a] transition-colors'>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
