'use client';

import { Avatar, Button, EmptyState, Input, PageHeader, SearchInput, SelectableCard, SkeletonCard, StatusBadge, TabBar } from '@/components/common';
import {
  useAddMember, useAllActivityLogs, useAssignRole,
  useCreateRole, useDeactivateMember, useDeleteRole,
  useReactivateMember, useRemoveMember, useRoles,
  useSearchTeamMembers, useTeamMemberActivity,
  useTeamMembers, useTeamPermissions,
} from '@/hooks/useTeam';
import { apiMessage } from '@/lib/utils';
import { Activity, Shield, Users } from 'lucide-react';
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
  const selectedMember = useTeamMemberActivity(selectedMemberId);
  const allActivity = useAllActivityLogs();
  const permissions = useTeamPermissions();
  const roles = useRoles();

  const addMember = useAddMember();
  const deactivate = useDeactivateMember();
  const reactivate = useReactivateMember();
  const remove = useRemoveMember();
  const assignRole = useAssignRole();
  const createRole = useCreateRole();
  const deleteRole = useDeleteRole();

  const addForm = useForm({ defaultValues: { email: '' } });
  const roleForm = useForm({ defaultValues: { name: '', permissions: '' } });
  const assignForm = useForm({ defaultValues: { roleId: '' } });

  const displayedMembers = searchQuery.length > 1 ? (searchResults.data?.results ?? []) : (members.data?.results ?? []);

  return (
    <div>
      <PageHeader icon={Users} title='Team' />

      <TabBar
        tabs={[
          { id: 'members', label: 'Members', icon: Users },
          { id: 'roles', label: 'Roles', icon: Shield },
          { id: 'activity', label: 'Activity', icon: Activity },
          { id: 'permissions', label: 'Permissions', icon: Shield },
        ]}
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />

      <div className='p-4 space-y-4'>
        {tab === 'members' && (
          <>
            <div className='rounded-xl border border-gray-200 bg-white p-4'>
              <h3 className='mb-3 text-sm font-bold text-gray-900'>Add Member</h3>
              <form className='flex gap-2' onSubmit={addForm.handleSubmit(async (v) => {
                try { await addMember.mutateAsync(v); toast.success('Member added'); addForm.reset(); } catch (err) { toast.error(apiMessage(err)); }
              })}>
                <Input placeholder='Member email' {...addForm.register('email')} />
                <Button type='submit' disabled={addMember.isPending}>Add</Button>
              </form>
            </div>

            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder='Search members...' />

            {members.isLoading && <SkeletonCard />}
            {displayedMembers.length === 0 && !members.isLoading && <EmptyState title='No members' message='Add your first team member.' icon={<Users className='h-8 w-8' />} />}

            <div className='space-y-2'>
              {displayedMembers.map((member) => (
                <SelectableCard key={member._id} selected={selectedMemberId === member._id} onClick={() => setSelectedMemberId(selectedMemberId === member._id ? '' : member._id)}>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Avatar name={member.fullName ?? member.email} />
                      <div>
                        <p className='text-sm font-semibold text-gray-900'>{member.fullName ?? member.email}</p>
                        <p className='text-xs text-gray-500'>{member.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={member.status} />
                  </div>

                  {selectedMemberId === member._id && (
                    <div className='mt-3 border-t border-gray-200 pt-3 space-y-3'>
                      <form className='flex gap-2' onSubmit={assignForm.handleSubmit(async (v) => {
                        try { await assignRole.mutateAsync({ id: member._id, roleId: v.roleId }); toast.success('Role assigned'); } catch (err) { toast.error(apiMessage(err)); }
                      })}>
                        <select {...assignForm.register('roleId')}
                          className='flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-[#2C3248]/50'>
                          <option value=''>Select role...</option>
                          {(roles.data?.results ?? []).map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
                        </select>
                        <Button type='submit' variant='secondary' className='text-xs px-3'>Assign</Button>
                      </form>

                      <div className='flex flex-wrap gap-2'>
                        <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={() => deactivate.mutate(member._id)}>Deactivate</Button>
                        <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={() => reactivate.mutate(member._id)}>Reactivate</Button>
                        <Button variant='danger' className='text-xs px-3 py-1.5' onClick={() => remove.mutate(member._id)}>Remove</Button>
                      </div>

                      {selectedMember.data?.results && selectedMember.data.results.length > 0 && (
                        <div>
                          <p className='mb-1 text-xs font-semibold text-gray-500'>Recent Activity</p>
                          {selectedMember.data.results.slice(0, 3).map((log) => (
                            <p key={log._id} className='text-xs text-gray-400'>{log.action} · {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </SelectableCard>
              ))}
            </div>
          </>
        )}

        {tab === 'roles' && (
          <>
            <div className='rounded-xl border border-gray-200 bg-white p-4'>
              <h3 className='mb-3 text-sm font-bold text-gray-900'>Create Role</h3>
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
            </div>

            {roles.isLoading && <SkeletonCard />}
            {(roles.data?.results ?? []).length === 0 && !roles.isLoading && <EmptyState title='No roles' message='Create your first role.' icon={<Shield className='h-8 w-8' />} />}
            <div className='space-y-2'>
              {(roles.data?.results ?? []).map((role) => (
                <SelectableCard key={role._id} selected={selectedRoleId === role._id} onClick={() => setSelectedRoleId(selectedRoleId === role._id ? '' : role._id)}>
                  <div className='flex items-center justify-between'>
                    <p className='font-semibold text-gray-900'>{role.name}</p>
                    <Button variant='danger' className='text-xs px-3 py-1' onClick={(e) => { e.stopPropagation(); deleteRole.mutate(role._id); }}>Delete</Button>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </>
        )}

        {tab === 'activity' && (
          <>
            {allActivity.isLoading && <SkeletonCard />}
            {(allActivity.data?.results ?? []).length === 0 && !allActivity.isLoading && <EmptyState title='No activity' message='No team activity logged yet.' icon={<Activity className='h-8 w-8' />} />}
            <div className='space-y-2'>
              {(allActivity.data?.results ?? []).map((log) => (
                <div key={log._id} className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4'>
                  <Avatar name={log.member?.fullName ?? log.member?.email} size='sm' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>{log.action}</p>
                    <p className='text-xs text-gray-500'>{log.member?.fullName ?? log.member?.email} · {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'permissions' && (
          <div className='rounded-xl border border-gray-200 bg-white p-4'>
            <h3 className='mb-3 text-sm font-bold text-gray-900'>Available Permissions</h3>
            {permissions.isLoading && <SkeletonCard />}
            <pre className='overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-500'>
              {JSON.stringify((permissions.data as { data?: unknown })?.data ?? permissions.data ?? {}, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
