'use client';

import { Avatar } from '@/components/common';
import { useLikeTestimony, useUnlikeTestimony } from '@/hooks/useTestimonies';
import { cn } from '@/lib/utils';
import type { Testimony } from '@/types/testimony';
import { Heart, Lock, MessageCircle, Radio } from 'lucide-react';
import Link from 'next/link';

type Props = { testimony: Testimony; compact?: boolean };

export function TestimonyCard({ testimony, compact }: Props) {
  const like = useLikeTestimony();
  const unlike = useUnlikeTestimony();

  const toggleLike = () => {
    if (testimony.liked) { unlike.mutate(testimony._id); return; }
    like.mutate(testimony._id);
  };

  return (
    <div className='group border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50/50'>
      <div className='flex items-start gap-3'>
        <Link href={`/u/${testimony.user?.username ?? ''}`}>
          <Avatar src={testimony.user?.picture} name={testimony.user?.fullName ?? testimony.user?.username} size='md' />
        </Link>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <Link
              href={`/u/${testimony.user?.username ?? ''}`}
              className='text-sm font-semibold text-gray-900 hover:underline'
            >
              {testimony.user?.fullName ?? testimony.user?.username ?? 'User'}
            </Link>
            <span className='text-xs text-gray-500'>@{testimony.user?.username ?? 'anonymous'}</span>
            <span className='text-xs text-gray-300'>·</span>
            <span className='text-xs text-gray-500'>{new Date(testimony.createdAt).toLocaleDateString()}</span>
            {testimony.isBroadcast && (
              <span className='inline-flex items-center gap-1 rounded-full bg-[#2C3248]/5 px-2 py-0.5 text-xs text-[#2C3248]'>
                <Radio className='h-3 w-3' />Broadcast
              </span>
            )}
            {testimony.isSecret && (
              <span className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500'>
                <Lock className='h-3 w-3' />Secret
              </span>
            )}
          </div>
          <Link href={`/post/${testimony._id}`}>
            <p className='mt-1 text-[15px] font-semibold text-gray-900'>{testimony.title}</p>
            <p className={cn('mt-0.5 whitespace-pre-wrap text-sm text-gray-600', compact && 'line-clamp-3')}>
              {testimony.description}
            </p>
          </Link>
          {testimony.tags && testimony.tags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {testimony.tags.map((tag) => (
                <span key={tag} className='rounded-full bg-[#2C3248]/5 px-2 py-0.5 text-xs text-[#2C3248]'>
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className='mt-3 flex items-center gap-6 text-xs text-gray-500'>
            <button
              onClick={toggleLike}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:text-[#2C3248]',
                testimony.liked && 'text-[#2C3248]'
              )}
            >
              <Heart className={cn('h-4 w-4', testimony.liked && 'fill-[#2C3248]')} strokeWidth={1.5} />
              {testimony.likesCount ?? 0}
            </button>
            <Link
              href={`/post/${testimony._id}`}
              className='inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:text-[#2C3248]'
            >
              <MessageCircle className='h-4 w-4' strokeWidth={1.5} />
              {testimony.repliesCount ?? 0}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
