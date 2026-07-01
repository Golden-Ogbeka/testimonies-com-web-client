'use client';

import { api, unwrap } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { User } from '@/types/auth';
import type {
    BlockedUser,
    DeleteProfilePayload,
    FollowRequest,
    UpdateEmailPayload,
    UpdateOrgProfilePayload,
    UpdatePasswordPayload,
    UpdatePhonePayload,
    UpdateProfilePayload,
    UpdateUsernamePayload,
    UpdateVisibilityPayload,
} from '@/types/domain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const profileKeys = {
  profile: (id?: string) => ['profile', id ?? 'me'] as const,
  followers: (id: string) => ['profile', id, 'followers'] as const,
  following: (id: string) => ['profile', id, 'following'] as const,
  search: (q: string) => ['profile', 'search', q] as const,
  followRequests: ['profile', 'follow-requests'] as const,
  blocked: ['profile', 'blocked'] as const,
};

// ─── Read ────────────────────────────────────────────────────────────────────

export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: profileKeys.profile(username),
    queryFn: async () => unwrap<User>((await api.get(`/user/profile/username?username=${encodeURIComponent(username)}`)).data),
    enabled: !!username,
  });
}

export function useFollowers(id: string) {
  return useQuery({
    queryKey: profileKeys.followers(id),
    queryFn: async () => unwrap<Paginated<User>>((await api.get(`/user/profile/followers/${id}`)).data),
    enabled: !!id,
  });
}

export function useFollowing(id: string) {
  return useQuery({
    queryKey: profileKeys.following(id),
    queryFn: async () => unwrap<Paginated<User>>((await api.get(`/user/profile/following/${id}`)).data),
    enabled: !!id,
  });
}

export function useFollowRequests() {
  return useQuery({
    queryKey: profileKeys.followRequests,
    queryFn: async () => unwrap<Paginated<FollowRequest>>((await api.get('/user/profile/follow-requests')).data),
  });
}

export function useBlockedUsers(page = 1) {
  return useQuery({
    queryKey: [...profileKeys.blocked, page] as const,
    queryFn: async () => unwrap<Paginated<BlockedUser>>((await api.get(`/user/profile/blocked?page=${page}`)).data),
  });
}

export function useSearchUsers(name: string) {
  return useQuery({
    queryKey: profileKeys.search(name),
    queryFn: async () => unwrap<Paginated<User>>((await api.get(`/user/profile/search-users?name=${encodeURIComponent(name)}`)).data),
    enabled: name.length > 1,
  });
}

// ─── Profile Updates ─────────────────────────────────────────────────────────

export function useUpdateUserProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => (await api.patch('/user/profile/user', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

export function useUpdateOrgProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateOrgProfilePayload) => (await api.patch('/user/profile/organization', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

export function useUpdateEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateEmailPayload) => (await api.patch('/user/profile/email', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

export function useResendEmailOtp() {
  return useMutation({
    mutationFn: async () => (await api.post('/user/profile/email/resend-otp')).data,
  });
}

export function useVerifyEmailOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (verificationCode: string) => (await api.post('/user/profile/email/verify-otp', { verificationCode })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

export function useUpdateUsername() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateUsernamePayload) => (await api.patch('/user/profile/username', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

export function useUpdatePhone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdatePhonePayload) => (await api.patch('/user/profile/phone', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (payload: UpdatePasswordPayload) => (await api.patch('/user/profile/password', payload)).data,
  });
}

export function useUpdateProfileVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateVisibilityPayload) => (await api.patch('/user/profile/visibility', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

export function useDeleteProfile() {
  return useMutation({
    mutationFn: async (payload: DeleteProfilePayload) => (await api.delete('/user/profile/', { data: payload })).data,
  });
}

// ─── Pictures ────────────────────────────────────────────────────────────────

export function useUploadProfilePicture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profilePhoto', file);
      return (await api.patch('/user/profile/picture', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

export function useUploadCoverPicture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('coverImage', file);
      return (await api.patch('/user/profile/cover-picture', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.profile() }),
  });
}

// ─── Follow / Block ───────────────────────────────────────────────────────────

export function useFollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/profile/follow/${id}`)).data,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['profile'] });
      const snapshots: [string, unknown][] = [];
      const p = qc.getQueryData(profileKeys.profile());
      if (p) snapshots.push([JSON.stringify(profileKeys.profile()), p]);
      const flw = qc.getQueryData(profileKeys.following(id));
      if (flw) snapshots.push([JSON.stringify(profileKeys.following(id)), flw]);
      const flrs = qc.getQueryData(profileKeys.followers(id));
      if (flrs) snapshots.push([JSON.stringify(profileKeys.followers(id)), flrs]);
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      if (context?.snapshots) {
        for (const [key, data] of context.snapshots) qc.setQueryData(JSON.parse(key), data);
      }
    },
    onSettled: (_data, _err, id) => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      qc.invalidateQueries({ queryKey: profileKeys.following(id) });
      qc.invalidateQueries({ queryKey: profileKeys.followers(id) });
    },
  });
}

export function useUnfollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/profile/unfollow/${id}`)).data,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['profile'] });
      const snapshots: [string, unknown][] = [];
      const p = qc.getQueryData(profileKeys.profile());
      if (p) snapshots.push([JSON.stringify(profileKeys.profile()), p]);
      const flw = qc.getQueryData(profileKeys.following(id));
      if (flw) snapshots.push([JSON.stringify(profileKeys.following(id)), flw]);
      const flrs = qc.getQueryData(profileKeys.followers(id));
      if (flrs) snapshots.push([JSON.stringify(profileKeys.followers(id)), flrs]);
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      if (context?.snapshots) {
        for (const [key, data] of context.snapshots) qc.setQueryData(JSON.parse(key), data);
      }
    },
    onSettled: (_data, _err, id) => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      qc.invalidateQueries({ queryKey: profileKeys.following(id) });
      qc.invalidateQueries({ queryKey: profileKeys.followers(id) });
    },
  });
}

export function useAcceptFollowRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/profile/follow-requests/${id}/accept`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.followRequests }),
  });
}

export function useRejectFollowRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/profile/follow-requests/${id}/reject`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.followRequests }),
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/profile/block/${id}`)).data,
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: profileKeys.blocked });
      qc.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
}
