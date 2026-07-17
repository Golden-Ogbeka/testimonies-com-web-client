'use client';

import { Avatar, Button, Input, Textarea } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useUpdateOrgProfile, useUpdateUserProfile, useUploadCoverPicture, useUploadProfilePicture } from '@/hooks/useProfile';
import { apiMessage } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateProfileSchema, updateOrgProfileSchema } from '@/lib/validations';
import { useEffect } from 'react';

export default function ProfileTab() {
  const { user } = useAuthState();

  const updateProfile = useUpdateUserProfile();
  const updateOrg = useUpdateOrgProfile();
  const uploadPic = useUploadProfilePicture();
  const uploadCover = useUploadCoverPicture();

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
      profileForm.reset({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        bio: user.bio,
      });
      orgForm.reset({
        businessName: user.businessName ?? '',
        businessAddress: user.businessAddress ?? '',
        businessWebsite: user.businessWebsite ?? '',
        businessBio: user.businessBio ?? '',
      });
    }
  }, [user, profileForm, orgForm]);

  return (
    <>
      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Profile Picture & Cover</h2>
        <div className="mb-4 flex items-center gap-4">
          <Avatar src={user?.profileImage} name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} size="xl" />
          <div className="space-y-2">
            <label className="cursor-pointer rounded-none border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-card-hover">
              Change photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    await uploadPic.mutateAsync(file);
                    toast.success('Photo updated');
                  } catch (err) {
                    toast.error(apiMessage(err));
                  }
                }}
              />
            </label>
            <label className="block cursor-pointer rounded-none border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-card-hover">
              Change cover
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    await uploadCover.mutateAsync(file);
                    toast.success('Cover updated');
                  } catch (err) {
                    toast.error(apiMessage(err));
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {user?.accountType === 'organization' ? (
        <div className="rounded-none border border-border bg-background p-4">
          <h2 className="mb-4 text-sm font-bold text-foreground">Organization Info</h2>
          <form
            className="space-y-3"
            onSubmit={orgForm.handleSubmit(async (v) => {
              try {
                await updateOrg.mutateAsync(v);
                toast.success('Organization updated');
              } catch (err) {
                toast.error(apiMessage(err));
              }
            })}
          >
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
          <form
            className="space-y-3"
            onSubmit={profileForm.handleSubmit(async (v) => {
              try {
                await updateProfile.mutateAsync(v);
                toast.success('Profile updated');
              } catch (err) {
                toast.error(apiMessage(err));
              }
            })}
          >
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
