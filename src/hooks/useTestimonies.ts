'use client';

import { api, unwrap } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { BroadcastRequest, Reply, Testimony, TestimonyStats } from '@/types/testimony';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const testimonyKeys = {
  feed: ['testimony', 'feed'] as const,
  trending: ['testimony', 'trending'] as const,
  detail: (id: string) => ['testimony', id] as const,
  replies: (id: string) => ['testimony', id, 'replies'] as const,
  myTestimonies: ['testimony', 'mine'] as const,
  myReplies: ['testimony', 'my-replies'] as const,
  userReplies: (userId: string) => ['testimony', 'user-replies', userId] as const,
  stats: ['testimony', 'stats'] as const,
  tags: (limit?: number) => ['testimony', 'tags', limit ?? 'all'] as const,
  broadcastRequests: ['testimony', 'broadcast', 'requests'] as const,
};

// ─── Feed & Discovery ────────────────────────────────────────────────────────

export function useFeed() {
  return useInfiniteQuery({
    queryKey: testimonyKeys.feed,
    queryFn: async ({ pageParam = 1 }) => unwrap<Paginated<Testimony>>((await api.get(`/user/testimony?page=${pageParam}`)).data),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: testimonyKeys.trending,
    queryFn: async () => unwrap<Paginated<Testimony>>((await api.get('/user/testimony/filter/trending')).data),
  });
}

export function useTestimony(id: string) {
  return useQuery({
    queryKey: testimonyKeys.detail(id),
    queryFn: async () => unwrap<Testimony>((await api.get(`/user/testimony/${id}`)).data),
    enabled: !!id,
  });
}

export function useReplies(id: string) {
  return useQuery({
    queryKey: testimonyKeys.replies(id),
    queryFn: async () => unwrap<Paginated<Reply>>((await api.get(`/user/testimony/${id}/replies`)).data),
    enabled: !!id,
  });
}

// ─── User's Own Content ──────────────────────────────────────────────────────

export function useMyTestimonies() {
  return useInfiniteQuery({
    queryKey: testimonyKeys.myTestimonies,
    queryFn: async ({ pageParam = 1 }) => unwrap<Paginated<Testimony>>((await api.get(`/user/testimony/user/my-testimonies?page=${pageParam}`)).data),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });
}

export function useMyReplies() {
  return useInfiniteQuery({
    queryKey: testimonyKeys.myReplies,
    queryFn: async ({ pageParam = 1 }) => unwrap<Paginated<Reply>>((await api.get(`/user/testimony/user/my-replies?page=${pageParam}`)).data),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });
}

export function useUserReplies(userId: string) {
  return useInfiniteQuery({
    queryKey: testimonyKeys.userReplies(userId),
    queryFn: async ({ pageParam = 1 }) => unwrap<Paginated<Reply>>((await api.get(`/user/testimony/user-replies/${userId}?page=${pageParam}`)).data),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    enabled: !!userId,
  });
}

export function useTestimonyStats() {
  return useQuery({
    queryKey: testimonyKeys.stats,
    queryFn: async () => unwrap<TestimonyStats>((await api.get('/user/testimony/stats/user')).data),
  });
}

export function useTestimonyTags(limit?: number) {
  return useQuery({
    queryKey: testimonyKeys.tags(limit),
    queryFn: async () => unwrap<Paginated<string>>((await api.get(`/user/testimony/tag/all${limit ? `?limit=${limit}` : ''}`)).data),
  });
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export function useCreateTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; description: string; tags?: string[]; mediaFiles?: File[]; isBroadcast?: boolean; broadcastOrganizationId?: string; isSecret?: boolean }) => {
      if (!payload.mediaFiles?.length) {
        const { mediaFiles: _mf, ...rest } = payload;
        void _mf;
        return (await api.post('/user/testimony', rest)).data;
      }

      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      payload.tags?.forEach((tag) => formData.append('tags[]', tag));
      payload.mediaFiles.forEach((file) => formData.append('testimonyMediaFiles', file));
      if (payload.isBroadcast !== undefined) formData.append('isBroadcast', String(payload.isBroadcast));
      if (payload.broadcastOrganizationId) formData.append('broadcastOrganizationId', payload.broadcastOrganizationId);
      if (payload.isSecret !== undefined) formData.append('isSecret', String(payload.isSecret));
      return (await api.post('/user/testimony', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'trending'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'tags'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'stats'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'mine'] });
    },
  });
}

export function useDeleteAllTestimonies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => (await api.post('/user/testimony/user/delete-all-testimonies', { password })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'mine'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'stats'] });
    },
  });
}

export function useDeleteAllReplies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => (await api.post('/user/testimony/user/delete-all-replies', { password })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'my-replies'] });
    },
  });
}

// ─── Likes ───────────────────────────────────────────────────────────────────

export function useLikeTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/testimony/${id}/like`)).data,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'stats'] });
    },
  });
}

export function useUnlikeTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/testimony/${id}/like`)).data,
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'stats'] });
    },
  });
}

// ─── Replies ─────────────────────────────────────────────────────────────────

export function useReplyToTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) =>
      (await api.post(`/user/testimony/${id}/reply`, { content })).data,
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: testimonyKeys.replies(vars.id) }),
  });
}

export function useUpdateReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) =>
      (await api.put(`/user/testimony/reply/${id}`, { description: content })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'my-replies'] });
    },
  });
}

export function useDeleteReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/testimony/reply/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'my-replies'] });
    },
  });
}

export function useLikeReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/testimony/reply/${id}/like`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'my-replies'] });
    },
  });
}

export function useUnlikeReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/testimony/reply/${id}/like`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'my-replies'] });
    },
  });
}

// ─── Broadcast ───────────────────────────────────────────────────────────────

export function useBroadcastRequests() {
  return useInfiniteQuery({
    queryKey: testimonyKeys.broadcastRequests,
    queryFn: async ({ pageParam = 1 }) => unwrap<Paginated<BroadcastRequest>>((await api.get(`/user/testimony/broadcast/requests?page=${pageParam}`)).data),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });
}

export function useApproveBroadcastRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/testimony/broadcast/requests/${id}/approve`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony', 'broadcast'] }),
  });
}

export function useRejectBroadcastRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/testimony/broadcast/requests/${id}/reject`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony', 'broadcast'] }),
  });
}
