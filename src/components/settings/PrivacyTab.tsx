'use client';

import { Avatar, Button } from '@/components/common';
import { useBlockedUsers, useAcceptFollowRequest, useFollowRequests, useRejectFollowRequest, useUnblockUser, useUpdateProfileVisibility } from '@/hooks/useProfile';

export default function PrivacyTab() {
  const updateVisibility = useUpdateProfileVisibility();
  const followRequests = useFollowRequests();
  const acceptFollow = useAcceptFollowRequest();
  const rejectFollow = useRejectFollowRequest();
  const blockedUsers = useBlockedUsers();
  const unblock = useUnblockUser();

  return (
    <>
      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <h2 className='mb-4 text-sm font-bold text-gray-900'>Profile Visibility</h2>
        <div className='space-y-2'>
          {(['public', 'private', 'secret'] as const).map((v) => (
            <button
              key={v}
              onClick={() => updateVisibility.mutate({ profileVisibility: v })}
              className='flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm transition-colors hover:bg-gray-50'
            >
              <span className='font-medium capitalize text-gray-700'>{v}</span>
              <span className='text-xs text-gray-400'>
                {v === 'public' ? 'Anyone can see your profile' : v === 'private' ? 'Only followers can see' : 'Hidden from everyone'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <h2 className='mb-4 text-sm font-bold text-gray-900'>Follow Requests</h2>
        {(followRequests.data?.results ?? []).length === 0 && <p className='text-sm text-gray-500'>No pending requests</p>}
        <div className='space-y-2'>
          {(followRequests.data?.results ?? []).map((req) => (
            <div key={req._id} className='flex items-center justify-between rounded-lg border border-gray-200 p-3'>
              <div className='flex items-center gap-2'>
                <Avatar src={req.requester?.picture} name={req.requester?.fullName ?? req.requester?.username} size='sm' />
                <p className='text-sm font-medium text-gray-700'>{req.requester?.fullName ?? req.requester?.username}</p>
              </div>
              <div className='flex gap-2'>
                <Button onClick={() => acceptFollow.mutate(req._id)} className='px-3 py-1 text-xs'>Accept</Button>
                <Button variant='secondary' onClick={() => rejectFollow.mutate(req._id)} className='px-3 py-1 text-xs'>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <h2 className='mb-4 text-sm font-bold text-gray-900'>Blocked Users</h2>
        {(blockedUsers.data?.results ?? []).length === 0 && <p className='text-sm text-gray-500'>No blocked users</p>}
        <div className='space-y-2'>
          {(blockedUsers.data?.results ?? []).map((item) => (
            <div key={item._id} className='flex items-center justify-between rounded-lg border border-gray-200 p-3'>
              <div className='flex items-center gap-2'>
                <Avatar src={item.blockedUser?.picture} name={item.blockedUser?.fullName ?? item.blockedUser?.username} size='sm' />
                <p className='text-sm font-medium text-gray-700'>{item.blockedUser?.fullName ?? item.blockedUser?.username}</p>
              </div>
              <Button variant='secondary' onClick={() => unblock.mutate(item.blockedUser?._id ?? '')} className='px-3 py-1 text-xs'>Unblock</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
