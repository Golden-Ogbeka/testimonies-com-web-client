'use client';

import { Card, EmptyState, ErrorState, SkeletonCard } from '@/components/common';
import { Composer } from '@/components/feed/Composer';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useFeed, useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const feed = useFeed(page);
  const trending = useTrending();
  const tags = useTestimonyTags(8);

  return (
    <div className='flex'>
      <div className='flex-1 border-r border-slate-100'>
        <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur'>
          <h1 className='text-lg font-bold'>Home</h1>
        </div>

        <div className='p-4'>
          <Composer />
        </div>

        <div className='divide-y divide-slate-100'>
          {feed.isLoading && [1, 2, 3].map((n) => <div key={n} className='p-4'><SkeletonCard /></div>)}
          {feed.isError && <div className='p-4'><ErrorState message='Could not load feed.' onRetry={() => feed.refetch()} /></div>}
          {!feed.isLoading && !feed.isError && (feed.data?.results?.length ?? 0) === 0 && (
            <div className='p-4'><EmptyState title='No testimonies yet' message='Be the first to share your story.' /></div>
          )}
          {feed.data?.results?.map((item) => (
            <div key={item._id} className='px-4 py-2'>
              <TestimonyCard testimony={item} compact />
            </div>
          ))}
        </div>

        {feed.data && (feed.data.totalPages ?? 1) > 1 && (
          <div className='flex items-center justify-center gap-3 p-4'>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className='rounded-full px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-40'>← Prev</button>
            <span className='text-sm text-slate-500'>Page {page} of {feed.data.totalPages}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= (feed.data?.totalPages ?? 1)} className='rounded-full px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-40'>Next →</button>
          </div>
        )}
      </div>

      <aside className='hidden w-80 shrink-0 p-4 xl:block'>
        <Card className='mb-4'>
          <h3 className='mb-3 text-sm font-bold text-slate-900'>Trending</h3>
          {(trending.data ?? []).length === 0 && <p className='text-xs text-slate-500'>Nothing trending right now.</p>}
          <div className='space-y-2'>
            {(trending.data ?? []).slice(0, 5).map((item) => (
              <Link key={item._id} href={`/post/${item._id}`} className='block rounded-lg p-2 hover:bg-slate-50'>
                <p className='text-sm font-semibold text-slate-900 line-clamp-1'>{item.title}</p>
                <p className='text-xs text-slate-500 line-clamp-2'>{item.description}</p>
              </Link>
            ))}
          </div>
        </Card>

        {(tags.data ?? []).length > 0 && (
          <Card>
            <h3 className='mb-3 text-sm font-bold text-slate-900'>Popular Tags</h3>
            <div className='flex flex-wrap gap-1.5'>
              {(tags.data ?? []).map((tag) => (
                <span key={tag} className='rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600'>#{tag}</span>
              ))}
            </div>
          </Card>
        )}
      </aside>
    </div>
  );
}
