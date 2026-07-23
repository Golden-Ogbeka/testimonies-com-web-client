'use client';

import { useCallback } from 'react';
import { Avatar, Button } from '@/components/common';
import { useAuthState } from '@/app/providers';
import {
  useBlockedUsers,
  useAcceptFollowRequest,
  useFollowRequests,
  useRejectFollowRequest,
  useUnblockUser,
  useUpdateProfileVisibility,
} from '@/hooks/useProfile';
import { apiMessage } from '@/lib/utils';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

type Visibility = 'public' | 'private' | 'secret';

const VISIBILITY_OPTIONS: { value: Visibility; description: string }[] = [
  { value: 'public', description: 'Anyone can see your profile' },
  { value: 'private', description: 'Only followers can see' },
  { value: 'secret', description: 'Hidden from everyone' },
];

export default function PrivacyTab() {
  const { user } = useAuthState();
  const updateVisibility = useUpdateProfileVisibility();
  const followRequests = useFollowRequests();
  const acceptFollow = useAcceptFollowRequest();
  const rejectFollow = useRejectFollowRequest();
  const blockedUsers = useBlockedUsers();
  const unblock = useUnblockUser();

  const currentVisibility = user?.profileVisibility ?? 'public';

  const handleVisibilityChange = useCallback(
    async (v: Visibility) => {
      if (v === currentVisibility) return;
      try {
        await updateVisibility.mutateAsync({ profileVisibility: v });
        toast.success(`Visibility set to ${v}`);
      } catch (err) {
        toast.error(apiMessage(err));
      }
    },
    [currentVisibility, updateVisibility],
  );

  const handleAcceptFollow = useCallback(
    async (id: string) => {
      try {
        await acceptFollow.mutateAsync(id);
        toast.success('Follow request accepted');
      } catch (err) {
        toast.error(apiMessage(err));
      }
    },
    [acceptFollow],
  );

  const handleRejectFollow = useCallback(
    async (id: string) => {
      try {
        await rejectFollow.mutateAsync(id);
        toast.success('Follow request rejected');
      } catch (err) {
        toast.error(apiMessage(err));
      }
    },
    [rejectFollow],
  );

  const handleUnblock = useCallback(
    async (id: string) => {
      try {
        await unblock.mutateAsync(id);
        toast.success('User unblocked');
      } catch (err) {
        toast.error(apiMessage(err));
      }
    },
    [unblock],
  );

  const followRequestList = followRequests.data?.followRequests ?? [];
  const blockedUserList = blockedUsers.data ?? [];

  return (
    <>
      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Profile Visibility</h2>
        <div className="space-y-2" role="radiogroup" aria-label="Profile visibility">
          {VISIBILITY_OPTIONS.map(({ value, description }) => {
            const isActive = value === currentVisibility;
            return (
              <button
                key={value}
                role="radio"
                aria-checked={isActive}
                onClick={() => handleVisibilityChange(value)}
                disabled={updateVisibility.isPending || isActive}
                className={`flex w-full items-center justify-between rounded-none border px-4 py-3 text-sm transition-colors ${
                  isActive ? 'border-foreground bg-foreground/5' : 'border-border hover:bg-card-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium capitalize text-foreground">{value}</span>
                  {isActive && <Check className="h-4 w-4 text-foreground" />}
                </div>
                <span className="text-xs text-muted">{description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Follow Requests</h2>
        {followRequestList.length === 0 && <p className="text-sm text-muted">No pending requests</p>}
        <div className="space-y-2">
          {followRequestList.map((req) => {
            const follower = req.followerDetails;
            const name = `${follower?.firstName ?? ''} ${follower?.lastName ?? ''}`.trim();
            return (
              <div key={req._id} className="flex items-center justify-between rounded-none border border-border p-3">
                <div className="flex items-center gap-2">
                  <Avatar src={follower?.profileImage} name={name || 'User'} size="sm" />
                  <p className="text-sm font-medium text-foreground">{name || 'User'}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleAcceptFollow(req._id)} disabled={acceptFollow.isPending} className="px-3 py-1 text-xs">
                    Accept
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleRejectFollow(req._id)}
                    disabled={rejectFollow.isPending}
                    className="px-3 py-1 text-xs"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Blocked Users</h2>
        {blockedUserList.length === 0 && <p className="text-sm text-muted">No blocked users</p>}
        <div className="space-y-2">
          {blockedUserList.map((item) => {
            const details = item.userToBlockDetails;
            const name =
              details?.firstName && details?.lastName
                ? `${details.firstName} ${details.lastName}`
                : (details?.firstName ?? details?.lastName ?? details?.username ?? 'User');
            return (
              <div key={item._id} className="flex items-center justify-between rounded-none border border-border p-3">
                <div className="flex items-center gap-2">
                  <Avatar src={details?.profileImage} name={name} size="sm" />
                  <p className="text-sm font-medium text-foreground">{name}</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleUnblock(item.userToBlockId ?? '')}
                  disabled={unblock.isPending}
                  className="px-3 py-1 text-xs"
                >
                  Unblock
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
