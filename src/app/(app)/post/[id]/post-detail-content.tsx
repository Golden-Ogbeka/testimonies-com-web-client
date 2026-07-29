'use client';

import { EmptyState, ErrorState, SkeletonCard, Spinner, VirtualList } from '@/components/common';
import ReplyComposer from '@/components/feed/ReplyComposer';
import ReplyItem from '@/components/feed/ReplyItem';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useReplies, useTestimony } from '@/hooks/useTestimonies';
import { flattenPages } from '@/lib/utils';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PostDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const testimony = useTestimony(id);
  const replies = useReplies(id);
  const allReplies = flattenPages(replies.data);

  const { ref: sentinel, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && replies.hasNextPage && !replies.isFetchingNextPage) {
      replies.fetchNextPage();
    }
  }, [isIntersecting, replies.hasNextPage, replies.isFetchingNextPage, replies.fetchNextPage]);

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-lg">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-background-secondary"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <MessageCircle className="h-5 w-5 text-foreground" />
          <h1 className="font-serif text-xl font-extralight tracking-tight text-foreground">Testimony</h1>
        </div>
      </div>

      <div>
        {testimony.isLoading && (
          <div className="p-4">
            <SkeletonCard />
          </div>
        )}
        {testimony.isError && (
          <div className="p-4">
            <ErrorState message="Could not load this testimony." onRetry={() => testimony.refetch()} />
          </div>
        )}
        {testimony.data && <TestimonyCard testimony={testimony.data} />}

        {testimony.data && <ReplyComposer testimonyId={id} />}

        <div>
          {replies.isLoading && (
            <div className="p-4">
              <SkeletonCard />
            </div>
          )}
          {replies.isError && (
            <div className="p-4">
              <ErrorState message="Could not load replies." onRetry={() => replies.refetch()} />
            </div>
          )}
          {!replies.isLoading && !replies.isError && allReplies.length === 0 && (
            <div className="p-4">
              <EmptyState title="No replies yet" message="Be the first to reply." icon={<MessageCircle className="h-8 w-8" />} />
            </div>
          )}
          {allReplies.length > 0 && (
            <VirtualList items={allReplies} renderItem={(reply) => <ReplyItem key={reply._id} reply={reply} />} estimateSize={80} />
          )}
          <div ref={sentinel} className="flex justify-center py-4">
            {replies.isFetchingNextPage && <Spinner />}
            {!replies.hasNextPage && allReplies.length > 0 && <p className="text-xs text-muted">You&apos;ve reached the end.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
