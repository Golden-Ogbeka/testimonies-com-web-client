'use client';

import { Button } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useDeleteProfile } from '@/hooks/useProfile';
import { useDeleteAllReplies, useDeleteAllTestimonies } from '@/hooks/useTestimonies';
import { apiMessage } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteAccountSchema, deleteAllContentSchema } from '@/lib/validations';

export default function DangerZoneTab() {
  const router = useRouter();
  const { clearAuth } = useAuthState();
  const deleteProfile = useDeleteProfile();
  const deleteAllTestimonies = useDeleteAllTestimonies();
  const deleteAllReplies = useDeleteAllReplies();

  const deleteForm = useForm({ resolver: zodResolver(deleteAccountSchema), defaultValues: { password: '' } });
  const deleteTestimoniesForm = useForm({ resolver: zodResolver(deleteAllContentSchema), defaultValues: { password: '' } });
  const deleteRepliesForm = useForm({ resolver: zodResolver(deleteAllContentSchema), defaultValues: { password: '' } });

  return (
    <>
      <div className='rounded-xl border border-red-200 bg-red-50/30 p-4'>
        <h2 className='mb-1 text-sm font-bold text-red-600'>Delete All Testimonies</h2>
        <p className='mb-3 text-xs text-gray-500'>This will permanently delete all your testimonies.</p>
        <form className='flex gap-2' onSubmit={deleteTestimoniesForm.handleSubmit((v) => deleteAllTestimonies.mutate(v.password))}>
          <input type='password' placeholder='Confirm password' aria-label='Confirm password to delete testimonies'
            className='h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
            {...deleteTestimoniesForm.register('password')} />
          <Button type='submit' variant='danger' disabled={deleteAllTestimonies.isPending}>Delete all</Button>
        </form>
        {deleteTestimoniesForm.formState.errors.password?.message && <p className='mt-1 text-xs text-red-500'>{deleteTestimoniesForm.formState.errors.password.message}</p>}
      </div>

      <div className='rounded-xl border border-red-200 bg-red-50/30 p-4'>
        <h2 className='mb-1 text-sm font-bold text-red-600'>Delete All Replies</h2>
        <p className='mb-3 text-xs text-gray-500'>This will permanently delete all your replies.</p>
        <form className='flex gap-2' onSubmit={deleteRepliesForm.handleSubmit((v) => deleteAllReplies.mutate(v.password))}>
          <input type='password' placeholder='Confirm password' aria-label='Confirm password to delete replies'
            className='h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
            {...deleteRepliesForm.register('password')} />
          <Button type='submit' variant='danger' disabled={deleteAllReplies.isPending}>Delete all</Button>
        </form>
        {deleteRepliesForm.formState.errors.password?.message && <p className='mt-1 text-xs text-red-500'>{deleteRepliesForm.formState.errors.password.message}</p>}
      </div>

      <div className='rounded-xl border border-red-200 bg-red-50/30 p-4'>
        <h2 className='mb-1 text-sm font-bold text-red-600'>Delete Account</h2>
        <p className='mb-3 text-xs text-gray-500'>This action is irreversible. Your account will be permanently deleted.</p>
        <form className='flex gap-2' onSubmit={deleteForm.handleSubmit(async (v) => {
          try { await deleteProfile.mutateAsync(v); toast.success('Account deleted'); clearAuth(); router.replace(ROUTES.SIGNIN); } catch (err) { toast.error(apiMessage(err)); }
        })}>
          <input type='password' placeholder='Confirm password' aria-label='Confirm password to delete account'
            className='h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
            {...deleteForm.register('password')} />
          {deleteForm.formState.errors.password?.message && <p className='text-xs text-red-500'>{deleteForm.formState.errors.password.message}</p>}
          <Button type='submit' variant='danger' disabled={deleteProfile.isPending}>Delete account</Button>
        </form>
      </div>
    </>
  );
}
