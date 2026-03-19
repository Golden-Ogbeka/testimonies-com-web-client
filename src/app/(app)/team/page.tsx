'use client';

import { Avatar, Button, Card, EmptyState, Input, SkeletonCard } from '@/components/common';
import {
    useAddMember,
    useAllActivityLogs,
    useAssignRole,
    useCreateRole,
    useDeactivateMember,
    useDeleteRole,
    useReactivateMember, useRemoveMember,
    useRole,
    useRoles,
    useSearchTeamMembers,
    useTeamMember,
    useTeamMemberActivity,
    useTeamMembers,
    useTeamPermissions,
    useUpdateMember,
    useUpdateRole,
} from '@/hooks/useTeam';
import { apiMessage, cn } from '@/lib/utils';
import { Activity, Search, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Tab = 'members' | 'roles' | 'activity' | 'permissions';

export default function TeamPage() {
  const [tab, setTab] = useState<Tab>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const members = useTeamMembers();
  const searchResults = useSearchTeamMembers(searchQuery);
  const selectedMember = useTeamMember(selectedMemberId);
  const memberActivity = useTeamMemberActivity(selectedMemberId);
  const allActivity = useAllActivityLogs();
  const permissions = useTeamPermissions();
  const roles = useRoles();
  const selectedRole = useRole(selectedRoleId);

  const addMember = useAddMember();
  const updateMember = useUpdateMember();
  const deactivate = useDeactivateMember();
  const reactivate = useReactivateMember();
  const remove = useRemoveMember();
  const assignRole = useAssignRole();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const addForm = useForm({ defaultValues: { email: '' } });
  const roleForm = useForm({ defaultValues: { name: '', permissions: '' } });
  const assignForm = useForm({ defaultValues: { roleId: '' } });

  const displayedMembers = searchQuery.length > 1 ? (searchResults.data ?? []) : (members.data ?? []);

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur'>
        <h1 className='text-lg font-bold'>Team</h1>
      </div>

      <div className='flex border-b border-slate-200'>
        {([
          { id: 'members', label: 'Members', icon: Users },
          { id: 'roles', label: 'Roles', icon: Shield },
          { id: 'activity', label: 'Activity', icon: Activity },
          { id: 'permissions', label: 'Permissions', icon: Shield },
        ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn('flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition hover:bg-slate-50', tab === id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500')}>
            <Icon className='h-4 w-4' />{label}
          </button>
        ))}
      </div>

      <div className='p-4 space-y-4'>
        {/* Members tab */}
        {tab === 'members' && (
          <>
            <Card>
              <h3 className='mb-3 text-sm font-bold'>Add Member</h3>
              <form className='flex gap-2' onSubmit={addForm.handleSubmit(async (v) => {
                try { await addMember.mutateAsync(v); toast.success('Member added'); addForm.reset(); } catch (err) { toast.error(apiMessage(err)); }
              })}>
                <Input placeholder='Member email' {...addForm.register('email')} />
                <Button type='submit' disabled={addMember.isPending}>Add</Button>
              </form>
            </Card>

            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search members...'
                className='w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500' />
            </div>

            {members.isLoading && <SkeletonCard />}
            {displayedMembers.length === 0 && !members.isLoading && <EmptyState title='No members' message='Add your first team member.' />}

            <div className='space-y-2'>
              {displayedMembers.map((member) => (
                <Card key={member._id} className={cn('cursor-pointer transition', selectedMemberId === member._id && 'ring-2 ring-blue-600')}
                  onClick={() => setSelectedMemberId(selectedMemberId === member._id ? '' : member._id)}>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Avatar name={member.fullName ?? member.email} className='h-9 w-9' />
                      <div>
                        <p className='text-sm font-semibold'>{member.fullName ?? member.email}</p>
                        <p className='text-xs text-slate-500'>{member.email}</p>
                      </div>
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}>
                      {member.status ?? 'active'}
                    </span>
                  </div>

                  {selectedMemberId === member._id && (
                    <div className='mt-3 border-t border-slate-100 pt-3 space-y-3'>
                      {/* Assign role */}
                      <form className='flex gap-2' onSubmit={assignForm.handleSubmit(async (v) => {
                        try { await assignRole.mutateAsync({ id: member._id, roleId: v.roleId }); toast.success('Role assigned'); } catch (err) { toast.error(apiMessage(err)); }
                      })}>
                        <select {...assignForm.register('roleId')} className='flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500'>
                          <option value=''>Select role...</option>
                          {(roles.data ?? []).map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
                        </select>
                        <Button type='submit' variant='secondary' className='text-xs px-3'>Assign</Button>
                      </form>

                      <div className='flex flex-wrap gap-2'>
                        <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={() => deactivate.mutate(member._id)}>Deactivate</Button>
                        <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={() => reactivate.mutate(member._id)}>Reactivate</Button>
                        <Button variant='danger' className='text-xs px-3 py-1.5' onClick={() => remove.mutate(member._id)}>Remove</Button>
                      </div>

                      {memberActivity.data && memberActivity.data.length > 0 && (
                        <div>
                          <p className='mb-1 text-xs font-semibold text-slate-600'>Recent Activity</p>
                          {memberActivity.data.slice(0, 3).map((log) => (
                            <p key={log._id} className='text-xs text-slate-500'>{log.action} · {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Roles tab */}
        {tab === 'roles' && (
          <>
            <Card>
              <h3 className='mb-3 text-sm font-bold'>Create Role</h3>
              <form className='space-y-2' onSubmit={roleForm.handleSubmit(async (v) => {
                try {
                  await createRole.mutateAsync({ name: v.name, permissions: v.permissions ? v.permissions.split(',').map((p) => p.trim()) : [] });
                  toast.success('Role created'); roleForm.reset();
                } catch (err) { toast.error(apiMessage(err)); }
              })}>
                <Input placeholder='Role name' {...roleForm.register('name')} />
                <Input placeholder='Permissions (comma-separated)' {...roleForm.register('permissions')} />
                <Button type='submit' disabled={createRole.isPending}>Create role</Button>
              </form>
            </Card>

            {roles.isLoading && <SkeletonCard />}
            {(roles.data ?? []).length === 0 && !roles.isLoading && <EmptyState title='No roles' message='Create your first role.' />}
            <div className='space-y-2'>
              {(roles.data ?? []).map((role) => (
                <Card key={role._id} className={cn('cursor-pointer transition', selectedRoleId === role._id && 'ring-2 ring-blue-600')}
                  onClick={() => setSelectedRoleId(selectedRoleId === role._id ? '' : role._id)}>
                  <div className='flex items-center justify-between'>
                    <p className='font-semibold text-slate-900'>{role.name}</p>
                    <Button variant='danger' className='text-xs px-3 py-1' onClick={(e) => { e.stopPropagation(); deleteRole.mutate(role._id); }}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Activity tab */}
        {tab === 'activity' && (
          <>
            {allActivity.isLoading && <SkeletonCard />}
            {(allActivity.data ?? []).length === 0 && !allActivity.isLoading && <EmptyState title='No activity' message='No team activity logged yet.' />}
            <div className='space-y-2'>
              {(allActivity.data ?? []).map((log) => (
                <Card key={log._id} className='flex items-center gap-3'>
                  <Avatar name={log.member?.fullName ?? log.member?.email} className='h-8 w-8 text-xs' />
                  <div>
                    <p className='text-sm font-medium'>{log.action}</p>
                    <p className='text-xs text-slate-500'>{log.member?.fullName ?? log.member?.email} · {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Permissions tab */}
        {tab === 'permissions' && (
          <Card>
            <h3 className='mb-3 text-sm font-bold'>Available Permissions</h3>
            {permissions.isLoading && <SkeletonCard />}
            <pre className='overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-600'>
              {JSON.stringify(permissions.data?.data ?? permissions.data ?? {}, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
