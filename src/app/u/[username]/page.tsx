'use client';

import { Avatar, Button, EmptyState, SkeletonCard } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useMe } from '@/hooks/useAuth';
import {
  useFollowers, useFollowing,
  useFollowUser,
  useProfileByUsername,
  useUnfollowUser,
} from '@/hooks/useProfile';
import { useFeed, useUserReplies } from '@/hooks/useTestimonies';
import { cn } from '@/lib/utils';
import { Settings, UserMinus, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type Tab = 'testimonies' | 'replies' | 'followers' | 'following';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data: me } = useMe();
  const profile = useProfileByUsername(username === 'me' ? (me?.username ?? '') : username);
  const follow = useFollowUser();
  const unfollow = useUnfollowUser();
  const [tab, setTab] = useState<Tab>('testimonies');

  const userId = profile.data?._id ?? '';
  const followers = useFollowers(userId);
  const following = useFollowing(userId);
  const userReplies = useUserReplies(userId);
  const feed = useFeed(1);
  const userTestimonies = feed.data?.results?.filter((t) => t.user?._id === userId) ?? [];

  const isMe = me?._id === userId;

  if (profile.isLoading) {
    return <div className='p-4'><SkeletonCard /></div>;
  }

  if (!profile.data) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <EmptyState title='User not found' message='This profile does not exist.' />
      </div>
    );
  }

  const user = profile.data;

  return (
    <div>
      <div className='relative h-48 bg-gradient-to-r from-[#2C3248]/10 to-[#2C3248]/20'>
        {user.coverPicture && (
          <Image src={user.coverPicture} alt='cover' fill className='object-cover' unoptimized />
        )}
      </div>

      <div className='px-4 pb-4'>
        <div className='flex items-end justify-between -mt-14 mb-3'>
          <Avatar src={user.picture} name={user.fullName ?? user.username} size='xl' className='ring-4 ring-white' />
          <div className='flex gap-2'>
            {!isMe ? (
              <>
                <Button
                  variant='secondary'
                  onClick={() => follow.mutate(user._id)}
                  disabled={follow.isPending}
                  className='flex items-center gap-1.5'
                >
                  <UserPlus className='h-4 w-4' /> Follow
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => unfollow.mutate(user._id)}
                  disabled={unfollow.isPending}
                  className='flex items-center gap-1.5'
                >
                  <UserMinus className='h-4 w-4' /> Unfollow
                </Button>
              </>
            ) : (
              <Link href='/settings'>
                <Button variant='secondary' className='flex items-center gap-1.5'>
                  <Settings className='h-4 w-4' /> Edit profile
                </Button>
              </Link>
            )}
          </div>
        </div>

        <h1 className='text-xl font-bold text-gray-900'>{user.fullName ?? user.username}</h1>
        <p className='text-sm text-gray-500'>@{user.username}</p>
        {user.verified && (
          <span className='mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700'>Verified</span>
        )}

        <div className='mt-3 flex gap-4 text-sm text-gray-500'>
          <button onClick={() => setTab('followers')} className='hover:text-gray-700 transition-colors'>
            <span className='font-bold text-gray-900'>{followers.data?.length ?? 0}</span> Followers
          </button>
          <button onClick={() => setTab('following')} className='hover:text-gray-700 transition-colors'>
            <span className='font-bold text-gray-900'>{following.data?.length ?? 0}</span> Following
          </button>
        </div>
      </div>

      <div className='flex border-b border-gray-200'>
        {(['testimonies', 'replies', 'followers', 'following'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-3 text-sm font-medium capitalize transition-colors hover:bg-gray-50',
              tab === t ? 'border-b-2 border-[#2C3248] text-[#2C3248]' : 'text-gray-500'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        {tab === 'testimonies' && (
          <>
            {userTestimonies.length === 0 && (
              <div className='p-4'>
                <EmptyState title='No testimonies' message='This user has not posted yet.' />
              </div>
            )}
            {userTestimonies.map((t) => <TestimonyCard key={t._id} testimony={t} compact />)}
          </>
        )}

        {tab === 'replies' && (
          <>
            {userReplies.isLoading && <SkeletonCard />}
            {(userReplies.data?.results ?? []).length === 0 && !userReplies.isLoading && (
              <div className='p-4'>
                <EmptyState title='No replies' message='This user has not replied yet.' />
              </div>
            )}
            {(userReplies.data?.results ?? []).map((reply) => (
              <div key={reply._id} className='border-b border-gray-200 px-4 py-3 hover:bg-gray-50'>
                <p className='text-sm text-gray-700'>{reply.description}</p>
                <p className='mt-1 text-xs text-gray-400'>{new Date(reply.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </>
        )}

        {tab === 'followers' && (
          <>
            {followers.isLoading && <SkeletonCard />}
            {(followers.data ?? []).length === 0 && !followers.isLoading && (
              <div className='p-4'><EmptyState title='No followers' message='' /></div>
            )}
            {(followers.data ?? []).map((u) => (
              <Link key={u._id} href={`/u/${u.username}`}>
                <div className='flex items-center gap-3 border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50'>
                  <Avatar src={u.picture} name={u.fullName ?? u.username} />
                  <div>
                    <p className='text-sm font-semibold text-gray-900'>{u.fullName ?? u.username}</p>
                    <p className='text-xs text-gray-500'>@{u.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {tab === 'following' && (
          <>
            {following.isLoading && <SkeletonCard />}
            {(following.data ?? []).length === 0 && !following.isLoading && (
              <div className='p-4'><EmptyState title='Not following anyone' message='' /></div>
            )}
            {(following.data ?? []).map((u) => (
              <Link key={u._id} href={`/u/${u.username}`}>
                <div className='flex items-center gap-3 border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50'>
                  <Avatar src={u.picture} name={u.fullName ?? u.username} />
                  <div>
                    <p className='text-sm font-semibold text-gray-900'>{u.fullName ?? u.username}</p>
                    <p className='text-xs text-gray-500'>@{u.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
