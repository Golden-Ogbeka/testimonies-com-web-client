'use client';

import { api, unwrap } from '@/lib/api';
import { storage } from '@/lib/storage';
import { useAuthState } from '@/app/providers';
import type { AuthResponse, OtpPayload, User } from '@/types/auth';
import type { Paginated } from '@/types/api';
import type { SignUpPayload } from '@/types/domain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const authKeys = {
  me: ['auth', 'me'] as const,
  sessions: ['auth', 'sessions'] as const,
};

function persistAuth(data: AuthResponse, qc: ReturnType<typeof useQueryClient>, setAuth?: (t: string, u: User) => void) {
  storage.setToken(data.token);
  storage.setUser(data.user);
  if (setAuth) setAuth(data.token, data.user);
  qc.invalidateQueries({ queryKey: authKeys.me });
}

export function useMe() {
  const { setAuth } = useAuthState();
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const data = await unwrap<User>((await api.get('/user/profile')).data);
      if (data) {
        storage.setUser(data);
        if (setAuth) {
          const token = storage.getToken();
          if (token) setAuth(token, data);
        }
      }
      return data;
    },
    enabled: !!storage.getToken(),
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) =>
      (await api.post('/user/auth/signin', payload)).data,
  });
}

export function useSignInSendOtp() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => (await api.post('/user/auth/signin/send-otp', payload)).data,
  });
}

export function useSignInResendOtp() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => (await api.post('/user/auth/signin/resend-otp', payload)).data,
  });
}

export function useSignUpIndividual() {
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => (await api.post('/user/auth/signup/individual', payload)).data,
  });
}

export function useSignUpOrganization() {
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => (await api.post('/user/auth/signup/organization', payload)).data,
  });
}

export function useSendOtp(mode: 'signup' | 'signin' | 'reset-password') {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const path = mode === 'reset-password' ? '/user/auth/reset-password' : `/user/auth/${mode}/send-otp`;
      return (await api.post(path, payload)).data;
    },
  });
}

export function useResendOtp(mode: 'signup' | 'signin' | 'reset-password') {
  return useMutation({
    mutationFn: async (payload: { email: string }) => (await api.post(`/user/auth/${mode}/resend-otp`, payload)).data,
  });
}

export function useVerifyOtp(mode: 'signup' | 'signin') {
  const qc = useQueryClient();
  const { setAuth } = useAuthState();
  return useMutation({
    mutationFn: async (payload: OtpPayload) =>
      unwrap<AuthResponse>((await api.post(`/user/auth/${mode}/verify-otp`, payload)).data),
    onSuccess: (data) => persistAuth(data, qc, setAuth),
  });
}

export function useResetPasswordUpdate() {
  return useMutation({
    mutationFn: async (payload: { email: string; verificationCode: string; newPassword: string }) =>
      (await api.post('/user/auth/reset-password/update', payload)).data,
  });
}

export function useSessions() {
  return useQuery({
    queryKey: authKeys.sessions,
    queryFn: async () =>
      unwrap<Paginated<{ _id: string; createdAt?: string; ip?: string; userAgent?: string }>>(
        (await api.get('/user/auth/sessions')).data
      ),
    enabled: !!storage.getToken(),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => (await api.delete(`/user/auth/session/${sessionId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.sessions }),
  });
}

export function useDeleteOtherSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.delete('/user/auth/sessions/others')).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.sessions }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post('/user/auth/logout');
    },
    onSettled: () => {
      storage.clear();
      qc.clear();
    },
  });
}

export function useCheckUsername(username: string) {
  return useQuery({
    queryKey: ['auth', 'username', username],
    queryFn: async () => (await api.get(`/user/auth/username/${encodeURIComponent(username)}`)).data,
    enabled: username.length > 2,
  });
}

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: ['auth', 'session', sessionId],
    queryFn: async () => (await api.get(`/user/auth/session/${sessionId}`)).data,
    enabled: !!sessionId,
  });
}
