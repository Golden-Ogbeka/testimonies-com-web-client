'use client';

import { api, unwrap } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { CreatePromotionPayload, PromotionItem, PromotionStats, UpdatePromotionPayload } from '@/types/domain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePromotions() {
  return useQuery({
    queryKey: ['promotion', 'all'],
    queryFn: async () => unwrap<Paginated<PromotionItem>>((await api.get('/user/promotion')).data),
  });
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: async () => unwrap<PromotionItem>((await api.get(`/user/promotion/${id}`)).data),
    enabled: !!id,
  });
}

export function usePromotionRequests() {
  return useQuery({
    queryKey: ['promotion', 'requests'],
    queryFn: async () => unwrap<Paginated<PromotionItem>>((await api.get('/user/promotion/requests/all')).data),
  });
}

export function usePromotionStats() {
  return useQuery({
    queryKey: ['promotion', 'stats'],
    queryFn: async () => unwrap<PromotionStats>((await api.get('/user/promotion/stats/user')).data),
  });
}

export function usePromotionForAd() {
  return useQuery({
    queryKey: ['promotion', 'ad'],
    queryFn: async () => unwrap<PromotionItem>((await api.get('/user/promotion/view/ad')).data),
  });
}

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePromotionPayload) => (await api.post('/user/promotion', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotion'] }),
  });
}

export function useUpdatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdatePromotionPayload }) =>
      (await api.put(`/user/promotion/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotion'] }),
  });
}

export function useActivatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/promotion/${id}/activate`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotion'] }),
  });
}

export function useDeactivatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/promotion/${id}/deactivate`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotion'] }),
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/promotion/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotion'] }),
  });
}

export function useDeletePromotionRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/promotion/requests/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotion', 'requests'] }),
  });
}
