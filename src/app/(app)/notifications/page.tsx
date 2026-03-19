'use client';

import { Avatar, Button, Card, EmptyState, SkeletonCard } from '@/components/common';
import { useAcceptFollowRequest, useFollowRequests, useRejectFollowRequest } from '@/hooks/useProfile';
import { useApproveBroadcastRequest, useBroadcastRequests, useRejectBroadcastRequest } from '@/hooks/useTestimonies';
import { apiMessage, cn } from '@/lib/utils';
import { Check, Radio, UserPlus, X } from 'lucide-react';
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
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur'>
        <h1 className='text-lg font-bold'>Notifications</h1>
      </div>

      <div className='flex border-b border-slate-200'>
        <button onClick={() => setTab('follow-requests')}
          className={cn('flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition hover:bg-slate-50', tab === 'follow-requests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500')}>
          <UserPlus className='h-4 w-4' />
          Follow Requests
          {followCount > 0 && <span className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white'>{followCount}</span>}
        </button>
        <button onClick={() => setTab('broadcast-requests')}
          className={cn('flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition hover:bg-slate-50', tab === 'broadcast-requests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500')}>
          <Radio className='h-4 w-4' />
          Broadcast Requests
          {broadcastCount > 0 && <span className='flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white'>{broadcastCount}</span>}
        </button>
      </div>

      <div className='p-4 space-y-3'>
        {tab === 'follow-requests' && (
          <>
            {followRequests.isLoading && <SkeletonCard />}
            {!followRequests.isLoading && followCount === 0 && (
              <EmptyState title='No follow requests' message='You have no pending follow requests.' />
            )}
            {(followRequests.data ?? []).map((req) => (
              <Card key={req._id} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Avatar src={req.requester?.picture} name={req.requester?.fullName ?? req.requester?.username} />
                  <div>
                    <p className='text-sm font-semibold text-slate-900'>{req.requester?.fullName ?? req.requester?.username}</p>
                    <p className='text-xs text-slate-500'>@{req.requester?.username} wants to follow you</p>
                    {req.createdAt && <p className='text-xs text-slate-400'>{new Date(req.createdAt).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={async () => { try { await acceptFollow.mutateAsync(req._id); toast.success('Follow request accepted'); } catch (err) { toast.error(apiMessage(err)); } }}
                    className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition'
                  >
                    <Check className='h-4 w-4' />
                  </button>
                  <button
                    onClick={async () => { try { await rejectFollow.mutateAsync(req._id); toast.success('Follow request rejected'); } catch (err) { toast.error(apiMessage(err)); } }}
                    className='flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === 'broadcast-requests' && (
          <>
            {broadcastRequests.isLoading && <SkeletonCard />}
            {!broadcastRequests.isLoading && broadcastCount === 0 && (
              <EmptyState title='No broadcast requests' message='No pending broadcast requests.' />
            )}
            {(broadcastRequests.data?.results ?? []).map((req) => (
              <Card key={req._id}>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <Radio className='h-4 w-4 text-purple-600' />
                      <p className='text-sm font-semibold text-slate-900'>{req.testimony?.title ?? 'Broadcast Request'}</p>
                    </div>
                    <p className='text-xs text-slate-500 line-clamp-2'>{req.testimony?.description}</p>
                    <span className={cn('mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium', req.status === 'approved' ? 'bg-green-100 text-green-700' : req.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700')}>
                      {req.status ?? 'pending'}
                    </span>
                  </div>
                </div>
                {(!req.status || req.status === 'pending') && (
                  <div className='mt-3 flex gap-2'>
                    <Button className='text-xs px-3 py-1.5' onClick={async () => { try { await approveBroadcast.mutateAsync(req._id); toast.success('Approved'); } catch (err) { toast.error(apiMessage(err)); } }}>
                      Approve
                    </Button>
                    <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={async () => { try { await rejectBroadcast.mutateAsync(req._id); toast.success('Rejected'); } catch (err) { toast.error(apiMessage(err)); } }}>
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
