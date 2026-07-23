'use client';

import { useCallback } from 'react';
import { useAuthState } from '@/app/providers';
import { useDeleteProfile } from '@/hooks/useProfile';
import { useDeleteAllReplies, useDeleteAllTestimonies } from '@/hooks/useTestimonies';
import { ROUTES } from '@/constants/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { deleteAccountSchema, deleteAllContentSchema } from '@/lib/validations';
import { DangerSection } from './danger-section';

export default function DangerZoneTab() {
  const router = useRouter();
  const { clearAuth } = useAuthState();
  const deleteProfile = useDeleteProfile();
  const deleteAllTestimonies = useDeleteAllTestimonies();
  const deleteAllReplies = useDeleteAllReplies();

  const deleteForm = useForm({ resolver: zodResolver(deleteAccountSchema), defaultValues: { password: '' } });
  const deleteTestimoniesForm = useForm({ resolver: zodResolver(deleteAllContentSchema), defaultValues: { password: '' } });
  const deleteRepliesForm = useForm({ resolver: zodResolver(deleteAllContentSchema), defaultValues: { password: '' } });

  const handleDeleteTestimonies = useCallback(
    async (password: string) => {
      await deleteAllTestimonies.mutateAsync(password);
    },
    [deleteAllTestimonies],
  );

  const handleDeleteReplies = useCallback(
    async (password: string) => {
      await deleteAllReplies.mutateAsync(password);
    },
    [deleteAllReplies],
  );

  const handleDeleteAccount = useCallback(
    async (password: string) => {
      await deleteProfile.mutateAsync({ password });
      clearAuth();
      router.replace(ROUTES.SIGNIN);
    },
    [deleteProfile, clearAuth, router],
  );

  return (
    <>
      <DangerSection
        title="Delete All Testimonies"
        description="This will permanently delete all your testimonies."
        submitLabel="Delete all"
        isPending={deleteAllTestimonies.isPending}
        form={deleteTestimoniesForm}
        onSubmit={handleDeleteTestimonies}
        successMessage="All testimonies deleted"
      />

      <DangerSection
        title="Delete All Replies"
        description="This will permanently delete all your replies."
        submitLabel="Delete all"
        isPending={deleteAllReplies.isPending}
        form={deleteRepliesForm}
        onSubmit={handleDeleteReplies}
        successMessage="All replies deleted"
      />

      <DangerSection
        title="Delete Account"
        description="This action is irreversible. Your account will be permanently deleted."
        submitLabel="Delete account"
        isPending={deleteProfile.isPending}
        form={deleteForm}
        onSubmit={handleDeleteAccount}
        successMessage="Account deleted"
      />
    </>
  );
}
