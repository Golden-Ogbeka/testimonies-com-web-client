'use client';

import { Avatar, Button, Card, EmptyState, SkeletonCard } from '@/components/common';
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
import { UserMinus, UserPlus } from 'lucide-react';
import Image from 'next/image';
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
  // testimonies filtered by userId via feed
  const feed = useFeed(1);
  const userTestimonies = feed.data?.results?.filter((t) => t.user?._id === userId) ?? [];

  const isMe = me?._id === userId;

  if (profile.isLoading) {
    return <div className='p-4'><SkeletonCard /></div>;
  }

  if (!profile.data) {
    return <div className='p-4'><EmptyState title='User not found' message='This profile does not exist.' /></div>;
  }

  const user = profile.data;

  return (
    <div>
      {/* Cover */}
      <div className='relative h-40 bg-gradient-to-r from-blue-500 to-purple-600'>
        {user.coverPicture && (
          <Image src={user.coverPicture} alt='cover' fill className='object-cover' unoptimized />
        )}
      </div>

      {/* Profile header */}
      <div className='px-4 pb-4'>
        <div className='flex items-end justify-between -mt-10 mb-3'>
          <Avatar src={user.picture} name={user.fullName ?? user.username} className='h-20 w-20 text-2xl ring-4 ring-white' />
          {!isMe && (
            <div className='flex gap-2'>
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
            </div>
          )}
          {isMe && (
            <Button variant='secondary' onClick={() => window.location.href = '/settings'}>Edit profile</Button>
          )}
        </div>

        <h1 className='text-xl font-bold text-slate-900'>{user.fullName ?? user.username}</h1>
        <p className='text-sm text-slate-500'>@{user.username}</p>
        {user.verified && <span className='mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700'>Verified</span>}

        <div className='mt-3 flex gap-4 text-sm text-slate-600'>
          <button onClick={() => setTab('followers')} className='hover:underline'>
            <span className='font-bold text-slate-900'>{followers.data?.length ?? 0}</span> Followers
          </button>
          <button onClick={() => setTab('following')} className='hover:underline'>
            <span className='font-bold text-slate-900'>{following.data?.length ?? 0}</span> Following
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex border-b border-slate-200'>
        {(['testimonies', 'replies', 'followers', 'following'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-3 text-sm font-medium capitalize transition hover:bg-slate-50',
              tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className='divide-y divide-slate-100 p-4'>
        {tab === 'testimonies' && (
          <>
            {userTestimonies.length === 0 && <EmptyState title='No testimonies' message='This user has not posted yet.' />}
            {userTestimonies.map((t) => <TestimonyCard key={t._id} testimony={t} compact />)}
          </>
        )}

        {tab === 'replies' && (
          <>
            {userReplies.isLoading && <SkeletonCard />}
            {(userReplies.data?.results ?? []).length === 0 && !userReplies.isLoading && (
              <EmptyState title='No replies' message='This user has not replied yet.' />
            )}
            {(userReplies.data?.results ?? []).map((reply) => (
              <Card key={reply._id} className='mb-2'>
                <p className='text-sm text-slate-700'>{reply.description}</p>
                <p className='mt-1 text-xs text-slate-400'>{new Date(reply.createdAt).toLocaleDateString()}</p>
              </Card>
            ))}
          </>
        )}

        {tab === 'followers' && (
          <>
            {followers.isLoading && <SkeletonCard />}
            {(followers.data ?? []).length === 0 && !followers.isLoading && <EmptyState title='No followers' message='' />}
            {(followers.data ?? []).map((u) => (
              <div key={u._id} className='flex items-center gap-3 py-2'>
                <Avatar src={u.picture} name={u.fullName ?? u.username} className='h-9 w-9' />
                <div>
                  <p className='text-sm font-semibold'>{u.fullName ?? u.username}</p>
                  <p className='text-xs text-slate-500'>@{u.username}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'following' && (
          <>
            {following.isLoading && <SkeletonCard />}
            {(following.data ?? []).length === 0 && !following.isLoading && <EmptyState title='Not following anyone' message='' />}
            {(following.data ?? []).map((u) => (
              <div key={u._id} className='flex items-center gap-3 py-2'>
                <Avatar src={u.picture} name={u.fullName ?? u.username} className='h-9 w-9' />
                <div>
                  <p className='text-sm font-semibold'>{u.fullName ?? u.username}</p>
                  <p className='text-xs text-slate-500'>@{u.username}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
