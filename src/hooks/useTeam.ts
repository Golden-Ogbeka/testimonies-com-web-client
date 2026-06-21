'use client';

import { api, unwrap } from '@/lib/api';
import type { Paginated } from '@/types/api';
import type { ActivityLog, AddTeamMemberPayload, CreateRolePayload, TeamMember, TeamRole, UpdateRolePayload, UpdateTeamMemberPayload } from '@/types/domain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const teamKeys = {
  members: ['team', 'members'] as const,
  member: (id: string) => ['team', 'members', id] as const,
  search: (q: string) => ['team', 'members', 'search', q] as const,
  activity: (id: string) => ['team', 'members', id, 'activity'] as const,
  allActivity: ['team', 'activity'] as const,
  permissions: ['team', 'permissions'] as const,
  roles: ['team', 'roles'] as const,
  role: (id: string) => ['team', 'roles', id] as const,
};

// ─── Members ─────────────────────────────────────────────────────────────────

export function useTeamMembers() {
  return useQuery({
    queryKey: teamKeys.members,
    queryFn: async () => unwrap<Paginated<TeamMember>>((await api.get('/user/team/members')).data),
  });
}

export function useTeamMember(id: string) {
  return useQuery({
    queryKey: teamKeys.member(id),
    queryFn: async () => unwrap<TeamMember>((await api.get(`/user/team/members/${id}`)).data),
    enabled: !!id,
  });
}

export function useSearchTeamMembers(query: string) {
  return useQuery({
    queryKey: teamKeys.search(query),
    queryFn: async () => unwrap<Paginated<TeamMember>>((await api.get(`/user/team/members/search?query=${encodeURIComponent(query)}`)).data),
    enabled: query.length > 1,
  });
}

export function useTeamMemberActivity(id: string) {
  return useQuery({
    queryKey: teamKeys.activity(id),
    queryFn: async () => unwrap<Paginated<ActivityLog>>((await api.get(`/user/team/members/${id}/activity`)).data),
    enabled: !!id,
  });
}

export function useAllActivityLogs() {
  return useQuery({
    queryKey: teamKeys.allActivity,
    queryFn: async () => unwrap<Paginated<ActivityLog>>((await api.get('/user/team/activity/all')).data),
  });
}

export function useTeamPermissions() {
  return useQuery({
    queryKey: teamKeys.permissions,
    queryFn: async () => unwrap<{ permissions: string[] }>((await api.get('/user/team/permissions')).data),
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
    onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.members }),
  });
}

export function useLogActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { action: string; description: string }) => (await api.post('/user/team/activity/log', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.allActivity }),
  });
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export function useRoles() {
  return useQuery({
    queryKey: teamKeys.roles,
    queryFn: async () => unwrap<Paginated<TeamRole>>((await api.get('/user/team/roles')).data),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: teamKeys.role(id),
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
