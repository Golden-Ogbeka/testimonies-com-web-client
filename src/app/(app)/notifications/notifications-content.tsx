'use client';

import { Avatar, EmptyState, PageHeader, SkeletonCard, Spinner, StatusBadge, TabBar, VirtualList } from '@/components/common';
import { useAcceptFollowRequest, useFollowRequests, useRejectFollowRequest } from '@/hooks/useProfile';
import { useApproveBroadcastRequest, useBroadcastRequests, useRejectBroadcastRequest } from '@/hooks/useTestimonies';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { flattenPages } from '@/lib/utils';
import { apiMessage } from '@/lib/utils';
import { Bell, Check, Radio, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Tab = 'follow-requests' | 'broadcast-requests';

export default function NotificationsContent() {
  const [tab, setTab] = useState<Tab>('follow-requests');

  const followRequests = useFollowRequests();
  const acceptFollow = useAcceptFollowRequest();
  const rejectFollow = useRejectFollowRequest();

  const broadcastRequests = useBroadcastRequests();
  const approveBroadcast = useApproveBroadcastRequest();
  const rejectBroadcast = useRejectBroadcastRequest();

  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && broadcastRequests.hasNextPage && !broadcastRequests.isFetchingNextPage) {
      broadcastRequests.fetchNextPage();
    }
  }, [isIntersecting, broadcastRequests]);

  const followCount = followRequests.data?.results?.length ?? 0;
  const broadcastItems = flattenPages(broadcastRequests.data);
  const broadcastCount = broadcastItems.length;

  const handleAcceptFollow = async (id: string) => {
    try {
      await acceptFollow.mutateAsync(id);
      toast.success('Follow request accepted');
    } catch (err) {
      toast.error(apiMessage(err));
    }
  };

  const handleRejectFollow = async (id: string) => {
    try {
      await rejectFollow.mutateAsync(id);
      toast.success('Follow request rejected');
    } catch (err) {
      toast.error(apiMessage(err));
    }
  };

  const handleApproveBroadcast = async (id: string) => {
    try {
      await approveBroadcast.mutateAsync(id);
      toast.success('Approved');
    } catch (err) {
      toast.error(apiMessage(err));
    }
  };

  const handleRejectBroadcast = async (id: string) => {
    try {
      await rejectBroadcast.mutateAsync(id);
      toast.success('Rejected');
    } catch (err) {
      toast.error(apiMessage(err));
    }
  };

  return (
    <div>
      <PageHeader icon={Bell} title="Notifications" />

      <TabBar
        tabs={[
          { id: 'follow-requests', label: 'Follow Requests', icon: UserPlus, badge: followCount },
          { id: 'broadcast-requests', label: 'Broadcast Requests', icon: Radio, badge: broadcastCount },
        ]}
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />

      <div className="p-4 space-y-3">
        {tab === 'follow-requests' && (
          <>
            {followRequests.isLoading && <SkeletonCard />}
            {!followRequests.isLoading && followCount === 0 && (
              <EmptyState
                title="No follow requests"
                message="You have no pending follow requests."
                icon={<UserPlus className="h-8 w-8" />}
              />
            )}
            {(followRequests.data?.results ?? []).map((req) => (
              <div key={req._id} className="flex items-center justify-between rounded-none border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={req.followerDetails?.profileImage}
                    name={`${req.followerDetails?.firstName ?? ''} ${req.followerDetails?.lastName ?? ''}`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{`${req.followerDetails?.firstName ?? ''} ${req.followerDetails?.lastName ?? ''}`}</p>
                    <p className="text-xs text-muted">@{req.followerDetails?.username} wants to follow you</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptFollow(req._id)}
                    aria-label="Accept follow request"
                    className="flex h-10 w-10 items-center justify-center bg-foreground text-background transition-colors hover:bg-primary-light"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRejectFollow(req._id)}
                    aria-label="Reject follow request"
                    className="flex h-10 w-10 items-center justify-center border border-border text-muted transition-colors hover:bg-background-secondary hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
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
              <EmptyState title="No broadcast requests" message="No pending broadcast requests." icon={<Radio className="h-8 w-8" />} />
            )}
            <VirtualList
              items={broadcastItems}
              estimateSize={140}
              renderItem={(req) => (
                <div key={req._id} className="rounded-none border border-border bg-background p-4 mx-4 mb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Radio className="h-4 w-4 text-foreground" />
                        <p className="text-sm font-semibold text-foreground">{req.testimony?.title ?? 'Broadcast Request'}</p>
                      </div>
                      <p className="text-xs text-muted line-clamp-2">{req.testimony?.description}</p>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
                  {(!req.status || req.status === 'pending') && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleApproveBroadcast(req._id)}
                        aria-label="Approve broadcast request"
                        className="rounded-none bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-colors hover:bg-primary-light"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectBroadcast(req._id)}
                        aria-label="Reject broadcast request"
                        className="rounded-none border border-border px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card-hover"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
              sentinel={
                <div ref={sentinelRef} className="flex justify-center py-4">
                  {broadcastRequests.isFetchingNextPage && <Spinner />}
                  {!broadcastRequests.hasNextPage && broadcastCount > 0 && (
                    <p className="text-xs text-muted">You&apos;ve reached the end.</p>
                  )}
                </div>
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
