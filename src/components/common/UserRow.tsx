import Link from 'next/link';
import { Avatar } from './Avatar';

type UserRowProps = {
  user: { picture?: string; fullName?: string; username?: string; _id: string };
  href?: string;
  subtitle?: string;
};

export function UserRow({ user, href, subtitle }: UserRowProps) {
  const content = (
    <div className='flex items-center gap-3'>
      <Avatar src={user.picture} name={user.fullName ?? user.username} />
      <div>
        <p className='text-sm font-semibold text-gray-900'>{user.fullName ?? user.username}</p>
        {subtitle ? (
          <p className='text-xs text-gray-500'>{subtitle}</p>
        ) : (
          <p className='text-xs text-gray-500'>@{user.username}</p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50'>
          {content}
        </div>
      </Link>
    );
  }

  return content;
}
