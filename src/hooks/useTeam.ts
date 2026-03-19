'use client';

import { api, unwrap } from '@/lib/api';
import type { ActivityLog, AddTeamMemberPayload, CreateRolePayload, TeamMember, TeamRole, UpdateRolePayload, UpdateTeamMemberPayload } from '@/types/domain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ─── Members ─────────────────────────────────────────────────────────────────

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team', 'members'],
    queryFn: async () => unwrap<TeamMember[]>((await api.get('/user/team/members')).data),
  });
}

export function useTeamMember(id: string) {
  return useQuery({
    queryKey: ['team', 'members', id],
    queryFn: async () => unwrap<TeamMember>((await api.get(`/user/team/members/${id}`)).data),
    enabled: !!id,
  });
}

export function useSearchTeamMembers(query: string) {
  return useQuery({
    queryKey: ['team', 'members', 'search', query],
    queryFn: async () => unwrap<TeamMember[]>((await api.get(`/user/team/members/search?query=${encodeURIComponent(query)}`)).data),
    enabled: query.length > 1,
  });
}

export function useTeamMemberActivity(id: string) {
  return useQuery({
    queryKey: ['team', 'members', id, 'activity'],
    queryFn: async () => unwrap<ActivityLog[]>((await api.get(`/user/team/members/${id}/activity`)).data),
    enabled: !!id,
  });
}

export function useAllActivityLogs() {
  return useQuery({
    queryKey: ['team', 'activity'],
    queryFn: async () => unwrap<ActivityLog[]>((await api.get('/user/team/activity/all')).data),
  });
}

export function useTeamPermissions() {
  return useQuery({
    queryKey: ['team', 'permissions'],
    queryFn: async () => (await api.get('/user/team/permissions')).data,
  });
}

export function useAddMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddTeamMemberPayload) => (await api.post('/user/team/members', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'members'] }),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTeamMemberPayload }) =>
      (await api.put(`/user/team/members/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'members'] }),
  });
}

export function useDeactivateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/team/members/${id}/deactivate`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'members'] }),
  });
}

export function useReactivateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.post(`/user/team/members/${id}/reactivate`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'members'] }),
  });
}

export function useRemoveMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/team/members/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'members'] }),
  });
}

export function useAssignRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, roleId }: { id: string; roleId: string }) =>
      (await api.post(`/user/team/members/${id}/assign-role`, { roleId })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'members'] }),
  });
}

export function useLogActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => (await api.post('/user/team/activity/log', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'activity'] }),
  });
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export function useRoles() {
  return useQuery({
    queryKey: ['team', 'roles'],
    queryFn: async () => unwrap<TeamRole[]>((await api.get('/user/team/roles')).data),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['team', 'roles', id],
    queryFn: async () => unwrap<TeamRole>((await api.get(`/user/team/roles/${id}`)).data),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => (await api.post('/user/team/roles', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'roles'] }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      (await api.put(`/user/team/roles/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'roles'] }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/user/team/roles/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team', 'roles'] }),
  });
}
