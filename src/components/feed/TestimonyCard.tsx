'use client';

import { Avatar, Card } from '@/components/common';
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
    <Card className='space-y-3 hover:bg-slate-50 transition-colors'>
      <div className='flex items-start gap-3'>
        <Link href={`/u/${testimony.user?.username ?? ''}`}>
          <Avatar src={testimony.user?.picture} name={testimony.user?.fullName ?? testimony.user?.username} />
        </Link>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <Link href={`/u/${testimony.user?.username ?? ''}`} className='text-sm font-semibold text-slate-900 hover:underline'>
              {testimony.user?.fullName ?? testimony.user?.username ?? 'User'}
            </Link>
            <span className='text-xs text-slate-400'>@{testimony.user?.username ?? 'anonymous'}</span>
            {testimony.isBroadcast && <span className='inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700'><Radio className='h-3 w-3' />Broadcast</span>}
            {testimony.isSecret && <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600'><Lock className='h-3 w-3' />Secret</span>}
          </div>
          <Link href={`/post/${testimony._id}`}>
            <p className='mt-1 text-sm font-semibold text-slate-900'>{testimony.title}</p>
            <p className={cn('mt-0.5 whitespace-pre-wrap text-sm text-slate-700', compact && 'line-clamp-3')}>{testimony.description}</p>
          </Link>
          {testimony.tags && testimony.tags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {testimony.tags.map((tag) => (
                <span key={tag} className='rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600'>#{tag}</span>
              ))}
            </div>
          )}
          <div className='mt-3 flex items-center gap-4 text-xs text-slate-500'>
            <button
              onClick={toggleLike}
              className={cn('inline-flex items-center gap-1 rounded-full px-2 py-1 transition hover:bg-red-50 hover:text-red-500', testimony.liked && 'text-red-500')}
            >
              <Heart className={cn('h-4 w-4', testimony.liked && 'fill-red-500 text-red-500')} />
              {testimony.likesCount ?? 0}
            </button>
            <Link href={`/post/${testimony._id}`} className='inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-blue-50 hover:text-blue-500'>
              <MessageCircle className='h-4 w-4' />
              {testimony.repliesCount ?? 0}
            </Link>
            <span className='ml-auto text-slate-400'>{new Date(testimony.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
