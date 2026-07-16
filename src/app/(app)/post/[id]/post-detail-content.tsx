'use client';

import { EmptyState, SkeletonCard, VirtualList } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import ReplyComposer from '@/components/feed/ReplyComposer';
import ReplyItem from '@/components/feed/ReplyItem';
import { useReplies, useTestimony } from '@/hooks/useTestimonies';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function PostDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const testimony = useTestimony(id);
  const replies = useReplies(id);

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
        {testimony.data && <TestimonyCard testimony={testimony.data} />}

        <ReplyComposer testimonyId={id} />

        <div>
          {replies.isLoading && (
            <div className="p-4">
              <SkeletonCard />
            </div>
          )}
          {!replies.isLoading && (replies.data?.results ?? []).length === 0 && (
            <div className="p-4">
              <EmptyState title="No replies yet" message="Be the first to reply." icon={<MessageCircle className="h-8 w-8" />} />
            </div>
          )}
          {(replies.data?.results ?? []).length > 0 && (
            <VirtualList
              items={replies.data?.results ?? []}
              renderItem={(reply) => <ReplyItem key={reply._id} reply={reply} />}
              estimateSize={80}
            />
          )}
        </div>
      </div>
    </div>
  );
}
