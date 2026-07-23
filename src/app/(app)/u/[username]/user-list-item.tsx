'use client';

import { Avatar } from '@/components/common';
import type { User } from '@/types/auth';

export function UserListItem({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-card-hover">
      <Avatar src={user.profileImage} name={`${user.firstName} ${user.lastName}`} />
      <div>
        <p className="text-sm font-semibold text-foreground">{`${user.firstName} ${user.lastName}`}</p>
        <p className="text-xs text-muted">@{user.username}</p>
      </div>
    </div>
  );
}
