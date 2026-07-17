'use client';

import { useEffect, useMemo } from 'react';
import { Avatar, Button, Input, Textarea } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useUpdateOrgProfile, useUpdateUserProfile, useUploadCoverPicture, useUploadProfilePicture } from '@/hooks/useProfile';
import { apiMessage } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateProfileSchema, updateOrgProfileSchema } from '@/lib/validations';
import { ImageUploadButton } from './image-upload-button';

export default function ProfileTab() {
  const { user } = useAuthState();

  const updateProfile = useUpdateUserProfile();
  const updateOrg = useUpdateOrgProfile();
  const uploadCover = useUploadCoverPicture();
  const uploadPhoto = useUploadProfilePicture();

  const profileForm = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', bio: '' },
  });
  const orgForm = useForm({
    resolver: zodResolver(updateOrgProfileSchema),
    defaultValues: { businessName: '', businessAddress: '', businessWebsite: '', businessBio: '' },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({ firstName: user.firstName ?? '', lastName: user.lastName ?? '', bio: user.bio });
      orgForm.reset({
        businessName: user.businessName ?? '',
        businessAddress: user.businessAddress ?? '',
        businessWebsite: user.businessWebsite ?? '',
        businessBio: user.businessBio ?? '',
      });
    }
  }, [user, profileForm, orgForm]);

  const onProfileSubmit = useMemo(
    () =>
      profileForm.handleSubmit(async (v) => {
        try {
          await updateProfile.mutateAsync(v);
          toast.success('Profile updated');
        } catch (err) {
          toast.error(apiMessage(err));
        }
      }),
    [profileForm, updateProfile],
  );

  const onOrgSubmit = useMemo(
    () =>
      orgForm.handleSubmit(async (v) => {
        try {
          await updateOrg.mutateAsync(v);
          toast.success('Organization updated');
        } catch (err) {
          toast.error(apiMessage(err));
        }
      }),
    [orgForm, updateOrg],
  );

  return (
    <>
      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Profile Picture & Cover</h2>

        <div className="relative mb-10">
          <div className="relative h-36 w-full overflow-hidden rounded-lg bg-gradient-to-r from-foreground/10 to-foreground/20">
            {user?.coverImageURL ? (
              <img src={user.coverImageURL} alt="Cover" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">No cover image</div>
            )}
            <ImageUploadButton
              mutation={uploadCover}
              successMsg="Cover updated"
              label="Cover"
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/70 disabled:opacity-50"
            />
          </div>

          <div className="absolute -bottom-10 left-0 flex items-end gap-4">
            <div className="relative">
              <Avatar
                src={user?.profileImage}
                name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
                size="xl"
                className="ring-4 ring-background"
              />
              <ImageUploadButton
                mutation={uploadPhoto}
                successMsg="Photo updated"
                label=""
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {user?.accountType === 'organization' ? (
        <div className="rounded-none border border-border bg-background p-4">
          <h2 className="mb-4 text-sm font-bold text-foreground">Organization Info</h2>
          <form className="space-y-3" onSubmit={onOrgSubmit}>
            <Input
              label="Business name"
              placeholder="Business name"
              error={orgForm.formState.errors.businessName?.message}
              {...orgForm.register('businessName')}
            />
            <Input
              label="Business address"
              placeholder="Business address"
              error={orgForm.formState.errors.businessAddress?.message}
              {...orgForm.register('businessAddress')}
            />
            <Input
              label="Website URL"
              placeholder="Website URL"
              error={orgForm.formState.errors.businessWebsite?.message}
              {...orgForm.register('businessWebsite')}
            />
            <Textarea
              label="Business bio"
              placeholder="Describe your organization"
              maxLength={500}
              error={orgForm.formState.errors.businessBio?.message}
              {...orgForm.register('businessBio')}
            />
            <Button type="submit" disabled={updateOrg.isPending}>
              Save
            </Button>
          </form>
        </div>
      ) : (
        <div className="rounded-none border border-border bg-background p-4">
          <h2 className="mb-4 text-sm font-bold text-foreground">Personal Info</h2>
          <form className="space-y-3" onSubmit={onProfileSubmit}>
            <Input
              label="First name"
              placeholder="First name"
              error={profileForm.formState.errors.firstName?.message}
              {...profileForm.register('firstName')}
            />
            <Input
              label="Last name"
              placeholder="Last name"
              error={profileForm.formState.errors.lastName?.message}
              {...profileForm.register('lastName')}
            />
            <Textarea
              label="Bio"
              placeholder="Tell us about yourself"
              maxLength={500}
              error={profileForm.formState.errors.bio?.message}
              {...profileForm.register('bio')}
            />
            <Button type="submit" disabled={updateProfile.isPending}>
              Save
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
