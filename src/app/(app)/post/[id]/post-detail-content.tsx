'use client';

import { EmptyState, PageHeader, SkeletonCard, VirtualList } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import ReplyComposer from '@/components/feed/ReplyComposer';
import ReplyItem from '@/components/feed/ReplyItem';
import { useReplies, useTestimony } from '@/hooks/useTestimonies';
import { MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function PostDetailContent() {
  const { id } = useParams<{ id: string }>();
  const testimony = useTestimony(id);
  const replies = useReplies(id);

  return (
    <div>
      <PageHeader icon={MessageCircle} title='Testimony' />

      <div>
        {testimony.isLoading && <div className='p-4'><SkeletonCard /></div>}
        {testimony.data && <TestimonyCard testimony={testimony.data} />}

        <ReplyComposer testimonyId={id} />

        <div>
          {replies.isLoading && <div className='p-4'><SkeletonCard /></div>}
          {!replies.isLoading && (replies.data?.results ?? []).length === 0 && (
            <div className='p-4'>
              <EmptyState title='No replies yet' message='Be the first to reply.' icon={<MessageCircle className='h-8 w-8' />} />
            </div>
          )}
          {(replies.data?.results ?? []).length > 0 && (
            <VirtualList items={replies.data?.results ?? []} renderItem={(reply) => <ReplyItem key={reply._id} reply={reply} />} estimateSize={80} />
          )}
        </div>
      </div>
    </div>
  );
}
