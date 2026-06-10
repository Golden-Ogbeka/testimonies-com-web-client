'use client';

import { api, unwrap } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { ConversationPreview, Message } from '@/types/message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const msgKeys = {
  contacts: ['messaging', 'contacts'] as const,
  history: ['messaging', 'history'] as const,
  conversation: (userId: string) => ['messaging', 'conversation', userId] as const,
};

export function useContacts() {
  return useQuery({
    queryKey: msgKeys.contacts,
    queryFn: async () => unwrap<Paginated<ConversationPreview>>((await api.get('/user/messaging/contacts')).data),
  });
}

export function useHistory() {
  return useQuery({
    queryKey: msgKeys.history,
    queryFn: async () => unwrap<Paginated<Message>>((await api.get('/user/messaging/history')).data),
  });
}

export function useConversation(userId: string) {
  return useQuery({
    queryKey: msgKeys.conversation(userId),
    queryFn: async () => unwrap<Paginated<Message>>((await api.get(`/user/messaging/conversation/${userId}`)).data),
    enabled: !!userId,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { recipientId: string; recipientType: 'user' | 'organization'; content: string }) =>
      (await api.post('/user/messaging/send', payload)).data,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['messaging'] });
      qc.invalidateQueries({ queryKey: msgKeys.conversation(vars.recipientId) });
    },
  });
}

export function useEditMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => (await api.put(`/user/messaging/message/${id}`, { content })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messaging'] }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/messaging/message/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messaging'] }),
  });
}

export function useMarkConversationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => (await api.patch(`/user/messaging/conversation/${userId}/read`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messaging'] }),
  });
}

export function useMarkAllConversationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.patch('/user/messaging/conversations/read-all')).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messaging'] }),
  });
}

export function useGetUserForMessaging(id: string) {
  return useQuery({
    queryKey: ['messaging', 'user', id],
    queryFn: async () => (await api.get(`/user/messaging/user/${id}`)).data,
    enabled: !!id,
  });
}

export function useSearchMessages(keyword: string, page = 1) {
  return useQuery({
    queryKey: ['messaging', 'search', keyword, page],
    queryFn: async () => unwrap<Paginated<Message>>((await api.get(`/user/messaging/search?q=${encodeURIComponent(keyword)}&page=${page}`)).data),
    enabled: keyword.length > 1,
  });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.patch(`/user/messaging/message/${id}/read`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messaging'] }),
  });
}
