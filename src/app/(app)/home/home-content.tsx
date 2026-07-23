'use client';

import { EmptyState, ErrorState, PageHeader, SkeletonCard, Spinner, VirtualList } from '@/components/common';
import { Composer } from '@/components/feed/Composer';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useFeed } from '@/hooks/useTestimonies';
import { flattenPages } from '@/lib/utils';
import { Home } from 'lucide-react';
import { useEffect } from 'react';

export default function HomeContent() {
  const feed = useFeed();

  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && feed.hasNextPage && !feed.isFetchingNextPage) {
      feed.fetchNextPage();
    }
  }, [isIntersecting, feed.hasNextPage, feed.isFetchingNextPage, feed.fetchNextPage]);

  return (
    <>
      <PageHeader icon={Home} title="Home" />

      <Composer />

      <div>
        {feed.isLoading &&
          [1, 2, 3].map((n) => (
            <div key={n} className="p-4">
              <SkeletonCard />
            </div>
          ))}
        {feed.isError && (
          <div className="p-4">
            <ErrorState message="Could not load feed." onRetry={() => feed.refetch()} />
          </div>
        )}
        {!feed.isLoading && !feed.isError && flattenPages(feed.data).length === 0 && (
          <div className="p-4">
            <EmptyState title="No testimonies yet" message="Be the first to share your story." icon={<Home className="h-8 w-8" />} />
          </div>
        )}
        {!feed.isLoading && !feed.isError && flattenPages(feed.data).length > 0 && (
          <VirtualList
            items={flattenPages(feed.data)}
            renderItem={(item) => <TestimonyCard key={item._id} testimony={item} compact />}
            estimateSize={120}
          />
        )}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-4">
        {feed.isFetchingNextPage && <Spinner />}
        {!feed.hasNextPage && flattenPages(feed.data).length > 0 && (
          <p className="py-8 text-center text-xs text-muted">You&apos;ve reached the end.</p>
        )}
      </div>
    </>
  );
}
