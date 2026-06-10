'use client';

import { api, unwrap } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { UpdateTestimonyPayload } from '@/types/domain';
import type { BroadcastRequest, Reply, Testimony, TestimonyStats } from '@/types/testimony';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const testimonyKeys = {
  feed: (page: number) => ['testimony', 'feed', page] as const,
  trending: ['testimony', 'trending'] as const,
  detail: (id: string) => ['testimony', id] as const,
  replies: (id: string) => ['testimony', id, 'replies'] as const,
  myTestimonies: (page: number) => ['testimony', 'mine', page] as const,
  myReplies: (page: number) => ['testimony', 'my-replies', page] as const,
  userReplies: (userId: string, page: number) => ['testimony', 'user-replies', userId, page] as const,
  stats: ['testimony', 'stats'] as const,
  tags: ['testimony', 'tags'] as const,
  replyDetail: (id: string) => ['testimony', 'reply', id] as const,
  liked: (id: string) => ['testimony', id, 'liked'] as const,
  likes: (id: string) => ['testimony', id, 'likes'] as const,
  replyLiked: (id: string) => ['testimony', 'reply', id, 'liked'] as const,
  replyLikes: (id: string) => ['testimony', 'reply', id, 'likes'] as const,
  broadcastRequests: (page: number) => ['testimony', 'broadcast', 'requests', page] as const,
  broadcastRequest: (id: string) => ['testimony', 'broadcast', 'request', id] as const,
  public: (page: number) => ['testimony', 'public', page] as const,
  publicDetail: (id: string) => ['testimony', 'public', id] as const,
};

// ─── Feed & Discovery ────────────────────────────────────────────────────────

export function useFeed(page = 1) {
  return useQuery({
    queryKey: testimonyKeys.feed(page),
    queryFn: async () => unwrap<Paginated<Testimony>>((await api.get(`/user/testimony?page=${page}`)).data),
  });
}

export function usePublicTestimonies(page = 1) {
  return useQuery({
    queryKey: testimonyKeys.public(page),
    queryFn: async () => unwrap<Paginated<Testimony>>((await api.get(`/user/testimony/public?page=${page}`)).data),
  });
}

export function usePublicTestimony(id: string) {
  return useQuery({
    queryKey: testimonyKeys.publicDetail(id),
    queryFn: async () => unwrap<Testimony>((await api.get(`/user/testimony/public/${id}`)).data),
    enabled: !!id,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: testimonyKeys.trending,
    queryFn: async () => unwrap<Testimony[]>((await api.get('/user/testimony/filter/trending')).data),
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
    queryFn: async () => unwrap<Reply[]>((await api.get(`/user/testimony/${id}/replies`)).data),
    enabled: !!id,
  });
}

export function useReplyDetail(id: string) {
  return useQuery({
    queryKey: testimonyKeys.replyDetail(id),
    queryFn: async () => unwrap<Reply>((await api.get(`/user/testimony/reply/details/${id}`)).data),
    enabled: !!id,
  });
}

// ─── User's Own Content ──────────────────────────────────────────────────────

export function useMyTestimonies(page = 1) {
  return useQuery({
    queryKey: testimonyKeys.myTestimonies(page),
    queryFn: async () => unwrap<Paginated<Testimony>>((await api.get(`/user/testimony/user/my-testimonies?page=${page}`)).data),
  });
}

export function useMyReplies(page = 1) {
  return useQuery({
    queryKey: testimonyKeys.myReplies(page),
    queryFn: async () => unwrap<Paginated<Reply>>((await api.get(`/user/testimony/user/my-replies?page=${page}`)).data),
  });
}

export function useUserReplies(userId: string, page = 1) {
  return useQuery({
    queryKey: testimonyKeys.userReplies(userId, page),
    queryFn: async () => unwrap<Paginated<Reply>>((await api.get(`/user/testimony/user-replies/${userId}?page=${page}`)).data),
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
    queryKey: testimonyKeys.tags,
    queryFn: async () => unwrap<string[]>((await api.get(`/user/testimony/tag/all${limit ? `?limit=${limit}` : ''}`)).data),
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useUpdateTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTestimonyPayload }) =>
      (await api.put(`/user/testimony/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useDeleteTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/testimony/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useDeleteAllTestimonies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => (await api.post('/user/testimony/user/delete-all-testimonies', { password })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useDeleteAllReplies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => (await api.post('/user/testimony/user/delete-all-replies', { password })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

// ─── Likes ───────────────────────────────────────────────────────────────────

function updateLikeInFeed(feed: Paginated<Testimony> | undefined, id: string, increment: number): Paginated<Testimony> | undefined {
  if (!feed) return feed;
  return {
    ...feed,
    results: feed.results.map((item) => {
      if (item._id !== id) return item;
      return {
        ...item,
        liked: increment > 0,
        likesCount: Math.max(0, (item.likesCount ?? 0) + increment),
      };
    }),
  };
}

export function useLikeTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/testimony/${id}/like`)).data,
    onMutate: async (id) => {
      const key = testimonyKeys.feed(1);
      const prev = qc.getQueryData<Paginated<Testimony>>(key);
      qc.setQueryData(key, updateLikeInFeed(prev, id, 1));
      return { key, prev };
    },
    onError: (_error, _id, context) => {
      if (context?.prev) qc.setQueryData(context.key, context.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useUnlikeTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/testimony/${id}/like`)).data,
    onMutate: async (id) => {
      const key = testimonyKeys.feed(1);
      const prev = qc.getQueryData<Paginated<Testimony>>(key);
      qc.setQueryData(key, updateLikeInFeed(prev, id, -1));
      return { key, prev };
    },
    onError: (_error, _id, context) => {
      if (context?.prev) qc.setQueryData(context.key, context.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useTestimonyLiked(id: string) {
  return useQuery({
    queryKey: testimonyKeys.liked(id),
    queryFn: async () => (await api.get(`/user/testimony/${id}/liked`)).data,
    enabled: !!id,
  });
}

export function useTestimonyLikes(id: string) {
  return useQuery({
    queryKey: testimonyKeys.likes(id),
    queryFn: async () => (await api.get(`/user/testimony/${id}/likes`)).data,
    enabled: !!id,
  });
}

// ─── Replies ─────────────────────────────────────────────────────────────────

export function useReplyToTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) =>
      (await api.post(`/user/testimony/${id}/reply`, { description })).data,
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: testimonyKeys.replies(vars.id) }),
  });
}

export function useUpdateReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) =>
      (await api.put(`/user/testimony/reply/${id}`, { description })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useDeleteReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/testimony/reply/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useLikeReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/testimony/reply/${id}/like`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useUnlikeReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/testimony/reply/${id}/like`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimony'] }),
  });
}

export function useReplyLiked(id: string) {
  return useQuery({
    queryKey: testimonyKeys.replyLiked(id),
    queryFn: async () => (await api.get(`/user/testimony/reply/${id}/liked`)).data,
    enabled: !!id,
  });
}

export function useReplyLikes(id: string) {
  return useQuery({
    queryKey: testimonyKeys.replyLikes(id),
    queryFn: async () => (await api.get(`/user/testimony/reply/${id}/likes`)).data,
    enabled: !!id,
  });
}

// ─── Broadcast ───────────────────────────────────────────────────────────────

export function useBroadcastRequests(page = 1) {
  return useQuery({
    queryKey: testimonyKeys.broadcastRequests(page),
    queryFn: async () => unwrap<Paginated<BroadcastRequest>>((await api.get(`/user/testimony/broadcast/requests?page=${page}`)).data),
  });
}

export function useBroadcastRequest(id: string) {
  return useQuery({
    queryKey: testimonyKeys.broadcastRequest(id),
    queryFn: async () => unwrap<BroadcastRequest>((await api.get(`/user/testimony/broadcast/requests/${id}`)).data),
    enabled: !!id,
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
