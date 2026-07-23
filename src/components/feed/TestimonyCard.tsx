'use client';

import { Avatar, ImagePreview } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useLikeTestimony, useUnlikeTestimony } from '@/hooks/useTestimonies';
import { cn } from '@/lib/utils';
import type { Testimony } from '@/types/testimony';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageCircle, Radio } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';

type Props = { testimony: Testimony; compact?: boolean };

function TestimonyCardBase({ testimony, compact }: Props) {
  const like = useLikeTestimony();
  const unlike = useUnlikeTestimony();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toggleLike = useCallback(() => {
    if (testimony.isLiked) {
      unlike.mutate(testimony._id);
      return;
    }
    like.mutate(testimony._id);
  }, [testimony.isLiked, testimony._id, like, unlike]);

  const fullName = `${testimony.userDetails.firstName} ${testimony.userDetails.lastName}`;

  return (
    <div className="group border-b border-border/60 px-5 py-4 transition-colors duration-300 hover:bg-card-hover/40">
      <div className="flex items-start gap-3.5">
        <Link href={ROUTES.profile(testimony.userDetails.username)}>
          <Avatar src={testimony.userDetails.profileImage} name={fullName} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={ROUTES.profile(testimony.userDetails.username)} className="text-sm font-semibold text-foreground hover:underline">
              {fullName}
            </Link>
            <span className="text-xs text-muted">@{testimony.userDetails.username}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-muted">{formatDistanceToNowStrict(new Date(testimony.createdAt), { addSuffix: true })}</span>
            {testimony.isBroadcast && (
              <span className="inline-flex items-center gap-1 bg-foreground/5 px-2 py-0.5 text-xs text-foreground">
                <Radio className="h-3 w-3" />
                Broadcast
              </span>
            )}
          </div>
          <Link href={ROUTES.post(testimony._id)}>
            <p className="mt-1.5 line-clamp-3 font-serif text-lg font-extralight leading-snug tracking-tight text-foreground">
              {testimony.title}
            </p>
            <p className={cn('mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground-secondary', compact && 'line-clamp-3')}>
              {testimony.description}
            </p>
          </Link>
          {testimony.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {testimony.tags.map((tag) => (
                <span key={tag} className="bg-foreground/5 px-2 py-0.5 text-xs text-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {testimony.mediaURLs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {testimony.mediaURLs.slice(0, 4).map((url, i) => (
                <button
                  key={url}
                  onClick={() => setPreviewUrl(url)}
                  aria-label="View image"
                  className="relative overflow-hidden rounded-none border border-border"
                >
                  <Image
                    src={url}
                    alt={`Image ${i + 1}`}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-cover transition-opacity hover:opacity-80"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center gap-6 text-xs text-muted">
            <button
              onClick={toggleLike}
              aria-label={testimony.isLiked ? 'Unlike testimony' : 'Like testimony'}
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-1 transition-colors hover:text-foreground',
                testimony.isLiked && 'text-foreground',
              )}
            >
              <Heart className={cn('h-4 w-4', testimony.isLiked && 'fill-foreground')} strokeWidth={1.5} />
              {testimony.likesCount}
            </button>
            <Link
              href={ROUTES.post(testimony._id)}
              className="inline-flex items-center gap-1.5 px-2 py-1 transition-colors hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              {testimony.repliesCount ?? 0}
            </Link>
          </div>
        </div>
      </div>

      {previewUrl && <ImagePreview src={previewUrl} onClose={() => setPreviewUrl(null)} />}
    </div>
  );
}

export const TestimonyCard = memo(TestimonyCardBase);
