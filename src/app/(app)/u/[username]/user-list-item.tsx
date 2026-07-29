'use client';

import { Avatar } from '@/components/common';
import type { User } from '@/types/auth';

export function UserListItem({ user }: { user: User }) {
  const displayName =
    user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.businessName ?? user.username ?? 'User');
  const avatarSrc = user.profileImage || user.businessLogoURL;

  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-card-hover">
      <Avatar src={avatarSrc} name={displayName} />
      <div>
        <p className="text-sm font-semibold text-foreground">{displayName}</p>
        <p className="text-xs text-muted">@{user.username ?? 'unknown'}</p>
      </div>
    </div>
  );
}
