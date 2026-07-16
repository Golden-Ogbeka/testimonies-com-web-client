'use client';

import { Avatar, Button } from '@/components/common';
import {
  useBlockedUsers,
  useAcceptFollowRequest,
  useFollowRequests,
  useRejectFollowRequest,
  useUnblockUser,
  useUpdateProfileVisibility,
} from '@/hooks/useProfile';

export default function PrivacyTab() {
  const updateVisibility = useUpdateProfileVisibility();
  const followRequests = useFollowRequests();
  const acceptFollow = useAcceptFollowRequest();
  const rejectFollow = useRejectFollowRequest();
  const blockedUsers = useBlockedUsers();
  const unblock = useUnblockUser();

  return (
    <>
      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Profile Visibility</h2>
        <div className="space-y-2">
          {(['public', 'private', 'secret'] as const).map((v) => (
            <button
              key={v}
              onClick={() => updateVisibility.mutate({ profileVisibility: v })}
              className="flex w-full items-center justify-between rounded-none border border-border px-4 py-3 text-sm transition-colors hover:bg-card-hover"
            >
              <span className="font-medium capitalize text-foreground">{v}</span>
              <span className="text-xs text-muted">
                {v === 'public' ? 'Anyone can see your profile' : v === 'private' ? 'Only followers can see' : 'Hidden from everyone'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Follow Requests</h2>
        {(followRequests.data?.results ?? []).length === 0 && <p className="text-sm text-muted">No pending requests</p>}
        <div className="space-y-2">
          {(followRequests.data?.results ?? []).map((req) => (
            <div key={req._id} className="flex items-center justify-between rounded-none border border-border p-3">
              <div className="flex items-center gap-2">
                <Avatar
                  src={req.requester?.profileImage}
                  name={`${req.requester?.firstName ?? ''} ${req.requester?.lastName ?? ''}`}
                  size="sm"
                />
                <p className="text-sm font-medium text-foreground">{`${req.requester?.firstName ?? ''} ${req.requester?.lastName ?? ''}`}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => acceptFollow.mutate(req._id)} className="px-3 py-1 text-xs">
                  Accept
                </Button>
                <Button variant="secondary" onClick={() => rejectFollow.mutate(req._id)} className="px-3 py-1 text-xs">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Blocked Users</h2>
        {(blockedUsers.data?.results ?? []).length === 0 && <p className="text-sm text-muted">No blocked users</p>}
        <div className="space-y-2">
          {(blockedUsers.data?.results ?? []).map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-none border border-border p-3">
              <div className="flex items-center gap-2">
                <Avatar
                  src={item.blockedUser?.profileImage}
                  name={`${item.blockedUser?.firstName ?? ''} ${item.blockedUser?.lastName ?? ''}`}
                  size="sm"
                />
                <p className="text-sm font-medium text-foreground">{`${item.blockedUser?.firstName ?? ''} ${item.blockedUser?.lastName ?? ''}`}</p>
              </div>
              <Button variant="secondary" onClick={() => unblock.mutate(item.blockedUser?._id ?? '')} className="px-3 py-1 text-xs">
                Unblock
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
