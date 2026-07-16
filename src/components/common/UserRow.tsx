import Link from 'next/link';
import { Avatar } from './Avatar';

type UserRowProps = {
  user: { profileImage?: string; firstName?: string; lastName?: string; username?: string; _id: string };
  href?: string;
  subtitle?: string;
};

export function UserRow({ user, href, subtitle }: UserRowProps) {
  const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.username ?? 'User');
  const content = (
    <div className="flex items-center gap-3">
      <Avatar src={user.profileImage} name={displayName} />
      <div>
        <p className="text-sm font-semibold text-foreground">{displayName}</p>
        {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : <p className="text-xs text-muted">@{user.username}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <div className="flex items-center gap-3 rounded-none border border-border bg-card p-3 transition-colors hover:bg-card-hover">
          {content}
        </div>
      </Link>
    );
  }

  return content;
}
