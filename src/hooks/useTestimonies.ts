'use client';

import { api, unwrap } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { User } from '@/types/auth';
import type { BroadcastRequest, Reply, Testimony, TestimonyStats } from '@/types/testimony';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';

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

function toggleInfiniteTestimonyLike(qc: ReturnType<typeof useQueryClient>, key: readonly string[], id: string) {
  qc.setQueryData<InfiniteData<Paginated<Testimony>>>(key, (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        results: page.results.map((t) =>
          t._id === id
            ? { ...t, isLiked: !t.isLiked, likesCount: t.likesCount + (t.isLiked ? -1 : 1) }
            : t
        ),
      })),
    };
  });
}

function togglePaginatedTestimonyLike(qc: ReturnType<typeof useQueryClient>, key: readonly string[], id: string) {
  qc.setQueryData<Paginated<Testimony>>(key, (old) => {
    if (!old) return old;
    return {
      ...old,
      results: old.results.map((t) =>
        t._id === id
          ? { ...t, isLiked: !t.isLiked, likesCount: t.likesCount + (t.isLiked ? -1 : 1) }
          : t
      ),
    };
  });
}

function optimisticToggleTestimonyLike(qc: ReturnType<typeof useQueryClient>, id: string) {
  toggleInfiniteTestimonyLike(qc, ['testimony', 'feed'], id);
  toggleInfiniteTestimonyLike(qc, ['testimony', 'mine'], id);
  togglePaginatedTestimonyLike(qc, ['testimony', 'trending'], id);
  qc.setQueryData<Testimony>(['testimony', id], (old) => {
    if (!old) return old;
    return { ...old, isLiked: !old.isLiked, likesCount: old.likesCount + (old.isLiked ? -1 : 1) };
  });
}

function snapshotTestimonyLikeQueries(qc: ReturnType<typeof useQueryClient>) {
  const snapshots: [string, unknown][] = [];
  const qFeed = qc.getQueryData<InfiniteData<Paginated<Testimony>>>(['testimony', 'feed']);
  if (qFeed) snapshots.push([JSON.stringify(['testimony', 'feed']), qFeed]);
  const qTrending = qc.getQueryData<Paginated<Testimony>>(['testimony', 'trending']);
  if (qTrending) snapshots.push([JSON.stringify(['testimony', 'trending']), qTrending]);
  const qMine = qc.getQueryData<InfiniteData<Paginated<Testimony>>>(['testimony', 'mine']);
  if (qMine) snapshots.push([JSON.stringify(['testimony', 'mine']), qMine]);
  return snapshots;
}

export function useLikeTestimony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/testimony/${id}/like`)).data,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['testimony'] });
      const snapshots = snapshotTestimonyLikeQueries(qc);
      optimisticToggleTestimonyLike(qc, id);
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      if (context?.snapshots) {
        for (const [key, data] of context.snapshots) {
          qc.setQueryData(JSON.parse(key), data);
        }
      }
    },
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
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['testimony'] });
      const snapshots = snapshotTestimonyLikeQueries(qc);
      optimisticToggleTestimonyLike(qc, id);
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      if (context?.snapshots) {
        for (const [key, data] of context.snapshots) {
          qc.setQueryData(JSON.parse(key), data);
        }
      }
    },
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
    onMutate: async ({ id, content }) => {
      await qc.cancelQueries({ queryKey: ['testimony'] });
      const snapshotReplies = qc.getQueryData<Paginated<Reply>>(testimonyKeys.replies(id));
      const me = qc.getQueryData<User>(['auth', 'me']);
      const tempReply: Reply = {
        _id: `temp-${Date.now()}`,
        testimonyId: id,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userDetails: {
          _id: me?._id ?? '',
          username: me?.username ?? '',
          firstName: me?.firstName ?? '',
          lastName: me?.lastName ?? '',
          accountType: me?.accountType ?? 'individual',
          profileImage: me?.profileImage ?? '',
          profileVisibility: me?.profileVisibility ?? 'public',
        },
        likesCount: 0,
        isLiked: false,
      };
      const snapshotTestimony = qc.getQueryData<Testimony>(testimonyKeys.detail(id));
      qc.setQueryData<Testimony>(testimonyKeys.detail(id), (old) => {
        if (!old) return old;
        return { ...old, repliesCount: old.repliesCount + 1 };
      });
      qc.setQueryData<InfiniteData<Paginated<Testimony>>>(['testimony', 'feed'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            results: p.results.map((t) =>
              t._id === id ? { ...t, repliesCount: t.repliesCount + 1 } : t
            ),
          })),
        };
      });
      qc.setQueryData<Paginated<Testimony>>(['testimony', 'trending'], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((t) =>
            t._id === id ? { ...t, repliesCount: t.repliesCount + 1 } : t
          ),
        };
      });
      qc.setQueryData<InfiniteData<Paginated<Testimony>>>(['testimony', 'mine'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            results: p.results.map((t) =>
              t._id === id ? { ...t, repliesCount: t.repliesCount + 1 } : t
            ),
          })),
        };
      });
      qc.setQueryData<Paginated<Reply>>(testimonyKeys.replies(id), (old) => {
        if (!old) return { results: [tempReply], totalResults: 1, resultsPerPage: 20, currentPage: 1, totalPages: 1, nextPage: null, prevPage: null };
        return { ...old, results: [tempReply, ...old.results], totalResults: old.totalResults + 1 };
      });
      return { snapshotReplies, snapshotTestimony, id };
    },
    onError: (_err, vars, context) => {
      if (context?.snapshotReplies) qc.setQueryData(testimonyKeys.replies(context.id), context.snapshotReplies);
      if (context?.snapshotTestimony) qc.setQueryData(testimonyKeys.detail(context.id), context.snapshotTestimony);
    },
    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: testimonyKeys.replies(vars.id) });
      qc.invalidateQueries({ queryKey: testimonyKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'stats'] });
    },
  });
}

// export function useUpdateReply() { // TODO: enable for v2
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ id, content }: { id: string; content: string }) =>
//       (await api.put(`/user/testimony/reply/${id}`, { description: content })).data,
//     onMutate: async ({ id, content }) => {
//       await qc.cancelQueries({ queryKey: ['testimony', 'my-replies'] });
//       const snapshot = qc.getQueryData<InfiniteData<Paginated<Reply>>>(['testimony', 'my-replies']);
//       qc.setQueryData<InfiniteData<Paginated<Reply>>>(['testimony', 'my-replies'], (old) => {
//         if (!old) return old;
//         return {
//           ...old,
//           pages: old.pages.map((p) => ({
//             ...p,
//             results: p.results.map((r) => (r._id === id ? { ...r, content } : r)),
//           })),
//         };
//       });
//       return { snapshot, key: ['testimony', 'my-replies'] as const };
//     },
//     onError: (_err, _id, context) => {
//       if (context?.snapshot) qc.setQueryData(context.key, context.snapshot);
//     },
//     onSettled: () => {
//       qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
//       qc.invalidateQueries({ queryKey: ['testimony', 'my-replies'] });
//     },
//   });
// }

export function useDeleteReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; testimonyId: string }) => (await api.delete(`/user/testimony/reply/${id}`)).data,
    onMutate: async ({ id, testimonyId }) => {
      await qc.cancelQueries({ queryKey: ['testimony'] });
      const snapshotMyReplies = qc.getQueryData<InfiniteData<Paginated<Reply>>>(['testimony', 'my-replies']);
      const snapshotReplies = qc.getQueryData<Paginated<Reply>>(['testimony', testimonyId, 'replies']);
      qc.setQueryData<InfiniteData<Paginated<Reply>>>(['testimony', 'my-replies'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({ ...p, results: p.results.filter((r) => r._id !== id) })),
        };
      });
      qc.setQueryData<Paginated<Reply>>(['testimony', testimonyId, 'replies'], (old) => {
        if (!old) return old;
        return { ...old, results: old.results.filter((r) => r._id !== id), totalResults: Math.max(0, old.totalResults - 1) };
      });
      qc.setQueryData<Testimony>(['testimony', testimonyId], (old) => {
        if (!old) return old;
        return { ...old, repliesCount: Math.max(0, old.repliesCount - 1) };
      });
      qc.setQueryData<InfiniteData<Paginated<Testimony>>>(['testimony', 'feed'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            results: p.results.map((t) =>
              t._id === testimonyId ? { ...t, repliesCount: Math.max(0, t.repliesCount - 1) } : t
            ),
          })),
        };
      });
      qc.setQueryData<Paginated<Testimony>>(['testimony', 'trending'], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((t) =>
            t._id === testimonyId ? { ...t, repliesCount: Math.max(0, t.repliesCount - 1) } : t
          ),
        };
      });
      return { snapshotMyReplies, snapshotReplies, testimonyId };
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshotMyReplies) qc.setQueryData(['testimony', 'my-replies'], context.snapshotMyReplies);
      if (context?.snapshotReplies) qc.setQueryData(['testimony', context.testimonyId, 'replies'], context.snapshotReplies);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'my-replies'] });
    },
  });
}

function optimisticToggleReplyLike(qc: ReturnType<typeof useQueryClient>, testimonyId: string, id: string) {
  qc.setQueryData<Paginated<Reply>>(['testimony', testimonyId, 'replies'], (old) => {
    if (!old) return old;
    return {
      ...old,
      results: old.results.map((r) =>
        r._id === id
          ? { ...r, isLiked: !r.isLiked, likesCount: r.likesCount + (r.isLiked ? -1 : 1) }
          : r
      ),
    };
  });
  qc.setQueryData<InfiniteData<Paginated<Reply>>>(['testimony', 'my-replies'], (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        results: page.results.map((r) =>
          r._id === id
            ? { ...r, isLiked: !r.isLiked, likesCount: r.likesCount + (r.isLiked ? -1 : 1) }
            : r
        ),
      })),
    };
  });
}

export function useLikeReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; testimonyId: string }) => (await api.post(`/user/testimony/reply/${id}/like`)).data,
    onMutate: async ({ id, testimonyId }) => {
      await qc.cancelQueries({ queryKey: ['testimony', testimonyId, 'replies'] });
      await qc.cancelQueries({ queryKey: ['testimony', 'my-replies'] });
      const snapshots: [string, unknown][] = [];
      const replyData = qc.getQueryData<Paginated<Reply>>(['testimony', testimonyId, 'replies']);
      if (replyData) snapshots.push([JSON.stringify(['testimony', testimonyId, 'replies']), replyData]);
      const myReplyData = qc.getQueryData<InfiniteData<Paginated<Reply>>>(['testimony', 'my-replies']);
      if (myReplyData) snapshots.push([JSON.stringify(['testimony', 'my-replies']), myReplyData]);
      optimisticToggleReplyLike(qc, testimonyId, id);
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      if (context?.snapshots) {
        for (const [key, data] of context.snapshots) {
          qc.setQueryData(JSON.parse(key), data);
        }
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['testimony', 'feed'] });
      qc.invalidateQueries({ queryKey: ['testimony', 'my-replies'] });
    },
  });
}

export function useUnlikeReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; testimonyId: string }) => (await api.delete(`/user/testimony/reply/${id}/like`)).data,
    onMutate: async ({ id, testimonyId }) => {
      await qc.cancelQueries({ queryKey: ['testimony', testimonyId, 'replies'] });
      await qc.cancelQueries({ queryKey: ['testimony', 'my-replies'] });
      const snapshots: [string, unknown][] = [];
      const replyData = qc.getQueryData<Paginated<Reply>>(['testimony', testimonyId, 'replies']);
      if (replyData) snapshots.push([JSON.stringify(['testimony', testimonyId, 'replies']), replyData]);
      const myReplyData = qc.getQueryData<InfiniteData<Paginated<Reply>>>(['testimony', 'my-replies']);
      if (myReplyData) snapshots.push([JSON.stringify(['testimony', 'my-replies']), myReplyData]);
      optimisticToggleReplyLike(qc, testimonyId, id);
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      if (context?.snapshots) {
        for (const [key, data] of context.snapshots) {
          qc.setQueryData(JSON.parse(key), data);
        }
      }
    },
    onSettled: () => {
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
