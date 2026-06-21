'use client';

import { EmptyState, ErrorState, PageHeader, SkeletonCard, Spinner } from '@/components/common';
import { Composer } from '@/components/feed/Composer';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useFeed, useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { flattenPages } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { Feather, TrendingUp, Hash } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomeContent() {
  const feed = useFeed();
  const trending = useTrending();
  const tags = useTestimonyTags(8);

  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && feed.hasNextPage && !feed.isFetchingNextPage) {
      feed.fetchNextPage();
    }
  }, [isIntersecting, feed.hasNextPage, feed.isFetchingNextPage, feed.fetchNextPage]);

  return (
    <div className='flex'>
      <div className='min-h-screen flex-1'>
        <PageHeader icon={Feather} title='Home' />

        <Composer />

        <div>
          {feed.isLoading && [1, 2, 3].map((n) => (
            <div key={n} className='p-4'><SkeletonCard /></div>
          ))}
          {feed.isError && (
            <div className='p-4'>
              <ErrorState message='Could not load feed.' onRetry={() => feed.refetch()} />
            </div>
          )}
          {!feed.isLoading && !feed.isError && flattenPages(feed.data).length === 0 && (
            <div className='p-4'>
              <EmptyState title='No testimonies yet' message='Be the first to share your story.' icon={<Feather className='h-8 w-8' />} />
            </div>
          )}
          {flattenPages(feed.data).map((item) => (
            <TestimonyCard key={item._id} testimony={item} compact />
          ))}
        </div>

        <div ref={sentinelRef} className='flex justify-center py-4'>
          {feed.isFetchingNextPage && <Spinner />}
          {!feed.hasNextPage && flattenPages(feed.data).length > 0 && (
            <p className='text-xs text-gray-400'>You've reached the end.</p>
          )}
        </div>
      </div>

      <aside className='hidden w-80 shrink-0 border-l border-gray-200 p-4 xl:block'>
        <div className='rounded-xl border border-gray-200 bg-white p-4 mb-4'>
          <div className='mb-3 flex items-center gap-2'>
            <TrendingUp className='h-4 w-4 text-[#2C3248]' />
            <h3 className='text-sm font-bold text-gray-900'>Trending</h3>
          </div>
          {(trending.data?.results ?? []).length === 0 && (
            <p className='text-xs text-gray-400'>Nothing trending right now.</p>
          )}
          <div className='space-y-1'>
            {(trending.data?.results ?? []).slice(0, 5).map((item) => (
              <Link
                key={item._id}
                href={ROUTES.post(item._id)}
                className='block rounded-lg p-2 transition-colors hover:bg-gray-50'
              >
                <p className='text-sm font-semibold text-gray-900 line-clamp-1'>{item.title}</p>
                <p className='mt-0.5 text-xs text-gray-500 line-clamp-2'>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {(tags.data?.results ?? []).length > 0 && (
          <div className='rounded-xl border border-gray-200 bg-white p-4'>
            <div className='mb-3 flex items-center gap-2'>
              <Hash className='h-4 w-4 text-[#2C3248]' />
              <h3 className='text-sm font-bold text-gray-900'>Popular Tags</h3>
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {(tags.data?.results ?? []).map((tag) => (
                <Link
                  key={tag}
                  href={ROUTES.exploreTag(tag)}
                  className='rounded-full bg-[#2C3248]/5 px-2.5 py-1 text-xs font-medium text-[#2C3248] transition-colors hover:bg-[#2C3248]/10'
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
