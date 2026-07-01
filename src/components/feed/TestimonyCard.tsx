'use client';

import { memo, useCallback, useState } from 'react';
import moment from 'moment';
import { ROUTES } from '@/constants/routes';
import { Avatar, ImagePreview } from '@/components/common';
import { useLikeTestimony, useUnlikeTestimony } from '@/hooks/useTestimonies';
import { cn } from '@/lib/utils';
import type { Testimony } from '@/types/testimony';
import { Heart, MessageCircle, Radio } from 'lucide-react';
import Link from 'next/link';

type Props = { testimony: Testimony; compact?: boolean };

function TestimonyCardBase({ testimony, compact }: Props) {
  const like = useLikeTestimony();
  const unlike = useUnlikeTestimony();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toggleLike = useCallback(() => {
    if (testimony.isLiked) { unlike.mutate(testimony._id); return; }
    like.mutate(testimony._id);
  }, [testimony.isLiked, testimony._id, like, unlike]);

  const fullName = `${testimony.userDetails.firstName} ${testimony.userDetails.lastName}`;

  return (
    <div className='group border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50/50'>
      <div className='flex items-start gap-3'>
        <Link href={ROUTES.profile(testimony.userDetails.username)}>
          <Avatar src={testimony.userDetails.profileImage} name={fullName} size='md' />
        </Link>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <Link
              href={ROUTES.profile(testimony.userDetails.username)}
              className='text-sm font-semibold text-gray-900 hover:underline'
            >
              {fullName}
            </Link>
            <span className='text-xs text-gray-500'>@{testimony.userDetails.username}</span>
            <span className='text-xs text-gray-300'>·</span>
            <span className='text-xs text-gray-500'>{moment(testimony.createdAt).fromNow()}</span>
            {testimony.isBroadcast && (
              <span className='inline-flex items-center gap-1 rounded-full bg-[#2C3248]/5 px-2 py-0.5 text-xs text-[#2C3248]'>
                <Radio className='h-3 w-3' />Broadcast
              </span>
            )}
          </div>
          <Link href={ROUTES.post(testimony._id)}>
            <p className='mt-1 text-[15px] font-semibold text-gray-900'>{testimony.title}</p>
            <p className={cn('mt-0.5 whitespace-pre-wrap text-sm text-gray-600', compact && 'line-clamp-3')}>
              {testimony.description}
            </p>
          </Link>
          {testimony.tags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {testimony.tags.map((tag) => (
                <span key={tag} className='rounded-full bg-[#2C3248]/5 px-2 py-0.5 text-xs text-[#2C3248]'>
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {testimony.mediaURLs.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {testimony.mediaURLs.slice(0, 4).map((url, i) => (
                <button
                  key={url}
                  onClick={() => setPreviewUrl(url)}
                  aria-label='View image'
                  className='overflow-hidden rounded-lg border border-gray-200'
                >
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    className='h-20 w-20 object-cover transition-opacity hover:opacity-80'
                  />
                </button>
              ))}
            </div>
          )}
          <div className='mt-3 flex items-center gap-6 text-xs text-gray-500'>
            <button
              onClick={toggleLike}
              aria-label={testimony.isLiked ? 'Unlike testimony' : 'Like testimony'}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:text-[#2C3248]',
                testimony.isLiked && 'text-[#2C3248]'
              )}
            >
              <Heart className={cn('h-4 w-4', testimony.isLiked && 'fill-[#2C3248]')} strokeWidth={1.5} />
              {testimony.likesCount}
            </button>
            <Link
              href={ROUTES.post(testimony._id)}
              className='inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:text-[#2C3248]'
            >
              <MessageCircle className='h-4 w-4' strokeWidth={1.5} />
              {testimony.repliesCount ?? 0}
            </Link>
          </div>
        </div>
      </div>

      {previewUrl && (
        <ImagePreview src={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </div>
  );
}

export const TestimonyCard = memo(TestimonyCardBase);
