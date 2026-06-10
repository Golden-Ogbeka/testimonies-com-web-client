'use client';

import { Avatar, EmptyState, SkeletonCard } from '@/components/common';
import { useAcceptFollowRequest, useFollowRequests, useRejectFollowRequest } from '@/hooks/useProfile';
import { useApproveBroadcastRequest, useBroadcastRequests, useRejectBroadcastRequest } from '@/hooks/useTestimonies';
import { apiMessage, cn } from '@/lib/utils';
import { Bell, Check, Radio, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Tab = 'follow-requests' | 'broadcast-requests';

export default function NotificationsPage() {
  const [tab, setTab] = useState<Tab>('follow-requests');

  const followRequests = useFollowRequests();
  const acceptFollow = useAcceptFollowRequest();
  const rejectFollow = useRejectFollowRequest();

  const broadcastRequests = useBroadcastRequests();
  const approveBroadcast = useApproveBroadcastRequest();
  const rejectBroadcast = useRejectBroadcastRequest();

  const followCount = followRequests.data?.length ?? 0;
  const broadcastCount = broadcastRequests.data?.results?.length ?? 0;

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-lg'>
        <div className='flex items-center gap-2'>
          <Bell className='h-5 w-5 text-[#2C3248]' />
          <h1 className='text-lg font-bold text-gray-900'>Notifications</h1>
        </div>
      </div>

      <div className='flex border-b border-gray-200'>
        <button onClick={() => setTab('follow-requests')}
          className={cn('flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-gray-50',
            tab === 'follow-requests' ? 'border-b-2 border-[#2C3248] text-[#2C3248]' : 'text-gray-500')}>
          <UserPlus className='h-4 w-4' />
          Follow Requests
          {followCount > 0 && <span className='flex h-5 w-5 items-center justify-center rounded-full bg-[#2C3248] text-[10px] font-bold text-white'>{followCount}</span>}
        </button>
        <button onClick={() => setTab('broadcast-requests')}
          className={cn('flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-gray-50',
            tab === 'broadcast-requests' ? 'border-b-2 border-[#2C3248] text-[#2C3248]' : 'text-gray-500')}>
          <Radio className='h-4 w-4' />
          Broadcast Requests
          {broadcastCount > 0 && <span className='flex h-5 w-5 items-center justify-center rounded-full bg-[#2C3248] text-[10px] font-bold text-white'>{broadcastCount}</span>}
        </button>
      </div>

      <div className='p-4 space-y-3'>
        {tab === 'follow-requests' && (
          <>
            {followRequests.isLoading && <SkeletonCard />}
            {!followRequests.isLoading && followCount === 0 && (
              <EmptyState title='No follow requests' message='You have no pending follow requests.' icon={<UserPlus className='h-8 w-8' />} />
            )}
            {(followRequests.data ?? []).map((req) => (
              <div key={req._id} className='flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4'>
                <div className='flex items-center gap-3'>
                  <Avatar src={req.requester?.picture} name={req.requester?.fullName ?? req.requester?.username} />
                  <div>
                    <p className='text-sm font-semibold text-gray-900'>{req.requester?.fullName ?? req.requester?.username}</p>
                    <p className='text-xs text-gray-500'>@{req.requester?.username} wants to follow you</p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={async () => { try { await acceptFollow.mutateAsync(req._id); toast.success('Follow request accepted'); } catch (err) { toast.error(apiMessage(err)); } }}
                    className='flex h-8 w-8 items-center justify-center rounded-full bg-[#2C3248] text-white transition-colors hover:bg-[#3a415a]'
                  >
                    <Check className='h-4 w-4' />
                  </button>
                  <button
                    onClick={async () => { try { await rejectFollow.mutateAsync(req._id); toast.success('Follow request rejected'); } catch (err) { toast.error(apiMessage(err)); } }}
                    className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'broadcast-requests' && (
          <>
            {broadcastRequests.isLoading && <SkeletonCard />}
            {!broadcastRequests.isLoading && broadcastCount === 0 && (
              <EmptyState title='No broadcast requests' message='No pending broadcast requests.' icon={<Radio className='h-8 w-8' />} />
            )}
            {(broadcastRequests.data?.results ?? []).map((req) => (
              <div key={req._id} className='rounded-xl border border-gray-200 bg-white p-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <Radio className='h-4 w-4 text-[#2C3248]' />
                      <p className='text-sm font-semibold text-gray-900'>{req.testimony?.title ?? 'Broadcast Request'}</p>
                    </div>
                    <p className='text-xs text-gray-500 line-clamp-2'>{req.testimony?.description}</p>
                    <span className={cn('mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                      req.status === 'approved' ? 'bg-green-50 text-green-700' :
                      req.status === 'rejected' ? 'bg-red-50 text-red-600' :
                      'bg-[#2C3248]/5 text-[#2C3248]')}>
                      {req.status ?? 'pending'}
                    </span>
                  </div>
                </div>
                {(!req.status || req.status === 'pending') && (
                  <div className='mt-3 flex gap-2'>
                    <button onClick={async () => { try { await approveBroadcast.mutateAsync(req._id); toast.success('Approved'); } catch (err) { toast.error(apiMessage(err)); } }}
                      className='rounded-lg bg-[#2C3248] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#3a415a]'>
                      Approve
                    </button>
                    <button onClick={async () => { try { await rejectBroadcast.mutateAsync(req._id); toast.success('Rejected'); } catch (err) { toast.error(apiMessage(err)); } }}
                      className='rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50'>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
