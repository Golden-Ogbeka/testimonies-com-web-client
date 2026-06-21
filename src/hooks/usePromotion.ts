'use client';

import { api, unwrap } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { CreatePromotionPayload, PromotionItem, PromotionStats, UpdatePromotionPayload } from '@/types/domain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const promotionKeys = {
  all: ['promotion', 'all'] as const,
  detail: (id: string) => ['promotion', id] as const,
  requests: ['promotion', 'requests'] as const,
  stats: ['promotion', 'stats'] as const,
  ad: ['promotion', 'ad'] as const,
};

export function usePromotions() {
  return useQuery({
    queryKey: promotionKeys.all,
    queryFn: async () => unwrap<Paginated<PromotionItem>>((await api.get('/user/promotion')).data),
  });
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: promotionKeys.detail(id),
    queryFn: async () => unwrap<PromotionItem>((await api.get(`/user/promotion/${id}`)).data),
    enabled: !!id,
  });
}

export function usePromotionRequests() {
  return useQuery({
    queryKey: promotionKeys.requests,
    queryFn: async () => unwrap<Paginated<PromotionItem>>((await api.get('/user/promotion/requests/all')).data),
  });
}

export function usePromotionStats() {
  return useQuery({
    queryKey: promotionKeys.stats,
    queryFn: async () => unwrap<PromotionStats>((await api.get('/user/promotion/stats/user')).data),
  });
}

export function usePromotionForAd() {
  return useQuery({
    queryKey: promotionKeys.ad,
    queryFn: async () => unwrap<PromotionItem>((await api.get('/user/promotion/view/ad')).data),
  });
}

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePromotionPayload) => (await api.post('/user/promotion', payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: promotionKeys.all });
      qc.invalidateQueries({ queryKey: promotionKeys.stats });
    },
  });
}

export function useUpdatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdatePromotionPayload }) =>
      (await api.put(`/user/promotion/${id}`, payload)).data,
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: promotionKeys.all });
      qc.invalidateQueries({ queryKey: promotionKeys.detail(id) });
    },
  });
}

export function useActivatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/promotion/${id}/activate`)).data,
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: promotionKeys.all });
      qc.invalidateQueries({ queryKey: promotionKeys.detail(id) });
    },
  });
}

export function useDeactivatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/promotion/${id}/deactivate`)).data,
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: promotionKeys.all });
      qc.invalidateQueries({ queryKey: promotionKeys.detail(id) });
    },
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/promotion/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: promotionKeys.all }),
  });
}

export function useDeletePromotionRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/promotion/requests/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotion', 'requests'] }),
  });
}
