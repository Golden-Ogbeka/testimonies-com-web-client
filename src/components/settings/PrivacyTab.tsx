'use client';

import { Avatar, Button } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useMe } from '@/hooks/useAuth';
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

export default function PrivacyTab() {
  useMe();
  const { user } = useAuthState();
  const updateVisibility = useUpdateProfileVisibility();
  const followRequests = useFollowRequests();
  const acceptFollow = useAcceptFollowRequest();
  const rejectFollow = useRejectFollowRequest();
  const blockedUsers = useBlockedUsers();
  const unblock = useUnblockUser();

  const currentVisibility = user?.profileVisibility ?? 'public';

  const handleVisibilityChange = async (v: 'public' | 'private' | 'secret') => {
    if (v === currentVisibility) return;
    try {
      await updateVisibility.mutateAsync({ profileVisibility: v });
      toast.success(`Visibility set to ${v}`);
    } catch (err) {
      toast.error(apiMessage(err));
    }
  };

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

  const handleUnblock = async (id: string) => {
    try {
      await unblock.mutateAsync(id);
      toast.success('User unblocked');
    } catch (err) {
      toast.error(apiMessage(err));
    }
  };

  return (
    <>
      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Profile Visibility</h2>
        <div className="space-y-2">
          {(['public', 'private', 'secret'] as const).map((v) => {
            const isActive = v === currentVisibility;
            return (
              <button
                key={v}
                onClick={() => handleVisibilityChange(v)}
                disabled={updateVisibility.isPending || isActive}
                className={`flex w-full items-center justify-between rounded-none border px-4 py-3 text-sm transition-colors ${
                  isActive ? 'border-foreground bg-foreground/5' : 'border-border hover:bg-card-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium capitalize text-foreground">{v}</span>
                  {isActive && <Check className="h-4 w-4 text-foreground" />}
                </div>
                <span className="text-xs text-muted">
                  {v === 'public' ? 'Anyone can see your profile' : v === 'private' ? 'Only followers can see' : 'Hidden from everyone'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Follow Requests</h2>
        {(followRequests.data?.followRequests ?? []).length === 0 && <p className="text-sm text-muted">No pending requests</p>}
        <div className="space-y-2">
          {(followRequests.data?.followRequests ?? []).map((req) => (
            <div key={req._id} className="flex items-center justify-between rounded-none border border-border p-3">
              <div className="flex items-center gap-2">
                <Avatar
                  src={req.followerDetails?.profileImage}
                  name={`${req.followerDetails?.firstName ?? ''} ${req.followerDetails?.lastName ?? ''}`}
                  size="sm"
                />
                <p className="text-sm font-medium text-foreground">{`${req.followerDetails?.firstName ?? ''} ${req.followerDetails?.lastName ?? ''}`}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleAcceptFollow(req._id)} className="px-3 py-1 text-xs">
                  Accept
                </Button>
                <Button variant="secondary" onClick={() => handleRejectFollow(req._id)} className="px-3 py-1 text-xs">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-none border border-border bg-background p-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Blocked Users</h2>
        {(blockedUsers.data ?? []).length === 0 && <p className="text-sm text-muted">No blocked users</p>}
        <div className="space-y-2">
          {(blockedUsers.data ?? []).map((item) => {
            const blockedName =
              item.userToBlockDetails?.firstName && item.userToBlockDetails?.lastName
                ? `${item.userToBlockDetails.firstName} ${item.userToBlockDetails.lastName}`
                : (item.userToBlockDetails?.firstName ?? item.userToBlockDetails?.lastName ?? item.userToBlockDetails?.username ?? 'User');
            return (
              <div key={item._id} className="flex items-center justify-between rounded-none border border-border p-3">
                <div className="flex items-center gap-2">
                  <Avatar src={item.userToBlockDetails?.profileImage} name={blockedName} size="sm" />
                  <p className="text-sm font-medium text-foreground">{blockedName}</p>
                </div>
                <Button variant="secondary" onClick={() => handleUnblock(item.userToBlockId ?? '')} className="px-3 py-1 text-xs">
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
