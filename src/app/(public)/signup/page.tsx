'use client';

import { Button, Card, Input } from '@/components/common';
import { useSignUpIndividual, useSignUpOrganization } from '@/hooks/useAuth';
import { apiMessage, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type IndividualForm = { fullName: string; username: string; email: string; password: string };
type OrgForm = { organizationName: string; username: string; email: string; password: string };

export default function SignUpPage() {
  const router = useRouter();
  const [kind, setKind] = useState<'individual' | 'organization'>('individual');
  const signupIndividual = useSignUpIndividual();
  const signupOrg = useSignUpOrganization();
  const individualForm = useForm<IndividualForm>();
  const orgForm = useForm<OrgForm>();

  const onIndividualSubmit = async (values: IndividualForm) => {
    try {
      await signupIndividual.mutateAsync(values);
      toast.success('Account created. Check your email for OTP.');
      router.replace(`/verify-otp?mode=signup&email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  const onOrgSubmit = async (values: OrgForm) => {
    try {
      await signupOrg.mutateAsync(values);
      toast.success('Organization account created. Check your email for OTP.');
      router.replace(`/verify-otp?mode=signup&email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <main className='mx-auto flex min-h-screen max-w-md items-center p-4'>
      <Card className='w-full'>
        <h1 className='mb-1 text-2xl font-bold'>Create account</h1>
        <p className='mb-6 text-sm text-slate-500'>Join Testimonies and start sharing your story.</p>

        <div className='mb-5 grid grid-cols-2 gap-2'>
          <button
            onClick={() => setKind('individual')}
            className={cn('rounded-xl py-2 text-sm font-medium transition', kind === 'individual' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}
          >
            Individual
          </button>
          <button
            onClick={() => setKind('organization')}
            className={cn('rounded-xl py-2 text-sm font-medium transition', kind === 'organization' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}
          >
            Organization
          </button>
        </div>

        {kind === 'individual' ? (
          <form className='space-y-3' onSubmit={individualForm.handleSubmit(onIndividualSubmit)}>
            <Input placeholder='Full name' {...individualForm.register('fullName', { required: true })} />
            <Input placeholder='Username' {...individualForm.register('username', { required: true })} />
            <Input placeholder='Email' type='email' {...individualForm.register('email', { required: true })} />
            <Input placeholder='Password' type='password' {...individualForm.register('password', { required: true })} />
            <Button type='submit' className='w-full' disabled={signupIndividual.isPending}>
              {signupIndividual.isPending ? 'Creating...' : 'Create account'}
            </Button>
          </form>
        ) : (
          <form className='space-y-3' onSubmit={orgForm.handleSubmit(onOrgSubmit)}>
            <Input placeholder='Organization name' {...orgForm.register('organizationName', { required: true })} />
            <Input placeholder='Username' {...orgForm.register('username', { required: true })} />
            <Input placeholder='Email' type='email' {...orgForm.register('email', { required: true })} />
            <Input placeholder='Password' type='password' {...orgForm.register('password', { required: true })} />
            <Button type='submit' className='w-full' disabled={signupOrg.isPending}>
              {signupOrg.isPending ? 'Creating...' : 'Create organization'}
            </Button>
          </form>
        )}

        <div className='mt-4 text-sm text-slate-600'>
          Already have an account? <Link href='/signin' className='text-blue-600'>Sign in</Link>
        </div>
      </Card>
    </main>
  );
}
