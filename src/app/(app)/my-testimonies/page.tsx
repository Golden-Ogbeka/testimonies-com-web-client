'use client';

import { EmptyState, SkeletonCard } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useMyReplies, useMyTestimonies, useTestimonyStats } from '@/hooks/useTestimonies';
import { cn } from '@/lib/utils';
import { BookOpen, Heart, Eye, Reply } from 'lucide-react';
import { useState } from 'react';

type Tab = 'testimonies' | 'replies' | 'stats';

export default function MyTestimoniesPage() {
  const [tab, setTab] = useState<Tab>('testimonies');
  const [page, setPage] = useState(1);

  const myTestimonies = useMyTestimonies(page);
  const myReplies = useMyReplies(page);
  const stats = useTestimonyStats();

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-lg'>
        <div className='flex items-center gap-2'>
          <BookOpen className='h-5 w-5 text-[#2C3248]' />
          <h1 className='text-lg font-bold text-gray-900'>My Content</h1>
        </div>
      </div>

      {stats.data && (
        <div className='grid grid-cols-4 divide-x divide-gray-200 border-b border-gray-200'>
          {[
            { label: 'Testimonies', value: stats.data.totalTestimonies, icon: BookOpen },
            { label: 'Replies', value: stats.data.totalReplies, icon: Reply },
            { label: 'Likes', value: stats.data.totalLikesReceived, icon: Heart },
            { label: 'Views', value: stats.data.totalViewsReceived, icon: Eye },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className='py-3 text-center'>
              <div className='flex items-center justify-center gap-1'>
                <Icon className='h-3 w-3 text-[#2C3248]' />
                <p className='text-lg font-bold text-gray-900'>{value ?? 0}</p>
              </div>
              <p className='text-xs text-gray-500'>{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className='flex border-b border-gray-200'>
        {(['testimonies', 'replies', 'stats'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-3 text-sm font-medium capitalize transition-colors hover:bg-gray-50',
              tab === t ? 'border-b-2 border-[#2C3248] text-[#2C3248]' : 'text-gray-500'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        {tab === 'testimonies' && (
          <>
            {myTestimonies.isLoading && <div className='p-4'><SkeletonCard /></div>}
            {!myTestimonies.isLoading && (myTestimonies.data?.results ?? []).length === 0 && (
              <div className='p-4'>
                <EmptyState title='No testimonies' message='You have not posted any testimonies yet.' icon={<BookOpen className='h-8 w-8' />} />
              </div>
            )}
            {(myTestimonies.data?.results ?? []).map((t) => (
              <TestimonyCard key={t._id} testimony={t} compact />
            ))}
            {myTestimonies.data && (myTestimonies.data.totalPages ?? 1) > 1 && (
              <div className='flex items-center justify-center gap-4 border-t border-gray-200 p-4'>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className='rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-40'>
                  ← Prev
                </button>
                <span className='text-sm text-gray-400'>Page {page}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= (myTestimonies.data?.totalPages ?? 1)}
                  className='rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-40'>
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'replies' && (
          <>
            {myReplies.isLoading && <div className='p-4'><SkeletonCard /></div>}
            {!myReplies.isLoading && (myReplies.data?.results ?? []).length === 0 && (
              <div className='p-4'>
                <EmptyState title='No replies' message='You have not replied to any testimonies yet.' icon={<Reply className='h-8 w-8' />} />
              </div>
            )}
            {(myReplies.data?.results ?? []).map((reply) => (
              <div key={reply._id} className='border-b border-gray-200 px-4 py-3 hover:bg-gray-50'>
                <p className='text-sm text-gray-700'>{reply.description}</p>
                <p className='mt-1 text-xs text-gray-400'>{new Date(reply.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </>
        )}

        {tab === 'stats' && stats.data && (
          <div className='grid grid-cols-2 gap-4 p-4'>
            {[
              { label: 'Total Testimonies', value: stats.data.totalTestimonies },
              { label: 'Total Replies', value: stats.data.totalReplies },
              { label: 'Likes Received', value: stats.data.totalLikesReceived },
              { label: 'Views Received', value: stats.data.totalViewsReceived },
            ].map(({ label, value }) => (
              <div key={label} className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
                <p className='text-3xl font-bold text-[#2C3248]'>{value ?? 0}</p>
                <p className='mt-1 text-sm text-gray-500'>{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
