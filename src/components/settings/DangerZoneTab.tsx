'use client';

import { Button, Input } from '@/components/common';
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
      <div className="rounded-none border border-red-200 bg-red-50/30 p-4">
        <h2 className="mb-1 text-sm font-bold text-red-600">Delete All Testimonies</h2>
        <p className="mb-3 text-xs text-muted">This will permanently delete all your testimonies.</p>
        <form className="flex gap-2" onSubmit={deleteTestimoniesForm.handleSubmit((v) => deleteAllTestimonies.mutate(v.password))}>
          <Input
            type="password"
            placeholder="Confirm password"
            aria-label="Confirm password to delete testimonies"
            containerClassName="flex-1"
            className="h-10 focus:border-red-500/50 focus:ring-red-500/20"
            error={deleteTestimoniesForm.formState.errors.password?.message}
            {...deleteTestimoniesForm.register('password')}
          />
          <Button type="submit" variant="danger" disabled={deleteAllTestimonies.isPending}>
            Delete all
          </Button>
        </form>
      </div>

      <div className="rounded-none border border-red-200 bg-red-50/30 p-4">
        <h2 className="mb-1 text-sm font-bold text-red-600">Delete All Replies</h2>
        <p className="mb-3 text-xs text-muted">This will permanently delete all your replies.</p>
        <form className="flex gap-2" onSubmit={deleteRepliesForm.handleSubmit((v) => deleteAllReplies.mutate(v.password))}>
          <Input
            type="password"
            placeholder="Confirm password"
            aria-label="Confirm password to delete replies"
            containerClassName="flex-1"
            className="h-10 focus:border-red-500/50 focus:ring-red-500/20"
            error={deleteRepliesForm.formState.errors.password?.message}
            {...deleteRepliesForm.register('password')}
          />
          <Button type="submit" variant="danger" disabled={deleteAllReplies.isPending}>
            Delete all
          </Button>
        </form>
      </div>

      <div className="rounded-none border border-red-200 bg-red-50/30 p-4">
        <h2 className="mb-1 text-sm font-bold text-red-600">Delete Account</h2>
        <p className="mb-3 text-xs text-muted">This action is irreversible. Your account will be permanently deleted.</p>
        <form
          className="flex gap-2"
          onSubmit={deleteForm.handleSubmit(async (v) => {
            try {
              await deleteProfile.mutateAsync(v);
              toast.success('Account deleted');
              clearAuth();
              router.replace(ROUTES.SIGNIN);
            } catch (err) {
              toast.error(apiMessage(err));
            }
          })}
        >
          <Input
            type="password"
            placeholder="Confirm password"
            aria-label="Confirm password to delete account"
            containerClassName="flex-1"
            className="h-10 focus:border-red-500/50 focus:ring-red-500/20"
            error={deleteForm.formState.errors.password?.message}
            {...deleteForm.register('password')}
          />
          <Button type="submit" variant="danger" disabled={deleteProfile.isPending}>
            Delete account
          </Button>
        </form>
      </div>
    </>
  );
}
