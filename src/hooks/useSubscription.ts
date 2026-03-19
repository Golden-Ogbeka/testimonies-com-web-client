'use client';

import { api, unwrap } from '@/lib/api';
import type { CancelSubscriptionPayload, PaySubscriptionPayload, SubscribePayload, SubscriptionHistoryItem, SubscriptionPlan, VerifyPaymentPayload } from '@/types/domain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const subscriptionKeys = {
  plans: ['subscription', 'plans'] as const,
  plan: (id: string) => ['subscription', 'plans', id] as const,
  status: ['subscription', 'status'] as const,
  history: ['subscription', 'history'] as const,
};

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans,
    queryFn: async () => unwrap<SubscriptionPlan[]>((await api.get('/user/subscription/plans')).data),
  });
}

export function useSubscriptionPlan(id: string) {
  return useQuery({
    queryKey: subscriptionKeys.plan(id),
    queryFn: async () => unwrap<SubscriptionPlan>((await api.get(`/user/subscription/plans/${id}`)).data),
    enabled: !!id,
  });
}

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: subscriptionKeys.status,
    queryFn: async () => (await api.get('/user/subscription/status')).data,
  });
}

export function useSubscriptionHistory() {
  return useQuery({
    queryKey: subscriptionKeys.history,
    queryFn: async () => unwrap<SubscriptionHistoryItem[]>((await api.get('/user/subscription/history')).data),
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SubscribePayload) => (await api.post('/user/subscription/subscribe', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription'] }),
  });
}

export function usePaySubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PaySubscriptionPayload) => (await api.post('/user/subscription/pay', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription'] }),
  });
}

export function useVerifyPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VerifyPaymentPayload) => (await api.post('/user/subscription/verify-payment', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription'] }),
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CancelSubscriptionPayload = {}) => (await api.post('/user/subscription/cancel', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription'] }),
  });
}
