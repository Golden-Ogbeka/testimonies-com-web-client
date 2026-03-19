'use client';

import { EmptyState, SkeletonCard } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useMyReplies, useMyTestimonies, useTestimonyStats } from '@/hooks/useTestimonies';
import { cn } from '@/lib/utils';
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
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur'>
        <h1 className='text-lg font-bold'>My Content</h1>
      </div>

      {/* Stats bar */}
      {stats.data && (
        <div className='grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-200'>
          {[
            { label: 'Testimonies', value: stats.data.totalTestimonies },
            { label: 'Replies', value: stats.data.totalReplies },
            { label: 'Likes', value: stats.data.totalLikesReceived },
            { label: 'Views', value: stats.data.totalViewsReceived },
          ].map(({ label, value }) => (
            <div key={label} className='py-3 text-center'>
              <p className='text-lg font-bold text-slate-900'>{value ?? 0}</p>
              <p className='text-xs text-slate-500'>{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className='flex border-b border-slate-200'>
        {(['testimonies', 'replies', 'stats'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('flex-1 py-3 text-sm font-medium capitalize transition hover:bg-slate-50', tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500')}>
            {t}
          </button>
        ))}
      </div>

      <div className='divide-y divide-slate-100'>
        {tab === 'testimonies' && (
          <>
            {myTestimonies.isLoading && <div className='p-4'><SkeletonCard /></div>}
            {!myTestimonies.isLoading && (myTestimonies.data?.results ?? []).length === 0 && (
              <div className='p-4'><EmptyState title='No testimonies' message='You have not posted any testimonies yet.' /></div>
            )}
            {(myTestimonies.data?.results ?? []).map((t) => (
              <div key={t._id} className='px-4 py-2'><TestimonyCard testimony={t} compact /></div>
            ))}
            {myTestimonies.data && (myTestimonies.data.totalPages ?? 1) > 1 && (
              <div className='flex items-center justify-center gap-3 p-4'>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className='rounded-full px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-40'>← Prev</button>
                <span className='text-sm text-slate-500'>Page {page}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= (myTestimonies.data?.totalPages ?? 1)} className='rounded-full px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-40'>Next →</button>
              </div>
            )}
          </>
        )}

        {tab === 'replies' && (
          <>
            {myReplies.isLoading && <div className='p-4'><SkeletonCard /></div>}
            {!myReplies.isLoading && (myReplies.data?.results ?? []).length === 0 && (
              <div className='p-4'><EmptyState title='No replies' message='You have not replied to any testimonies yet.' /></div>
            )}
            {(myReplies.data?.results ?? []).map((reply) => (
              <div key={reply._id} className='px-4 py-3'>
                <p className='text-sm text-slate-700'>{reply.description}</p>
                <p className='mt-1 text-xs text-slate-400'>{new Date(reply.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </>
        )}

        {tab === 'stats' && stats.data && (
          <div className='p-4 grid grid-cols-2 gap-4'>
            {[
              { label: 'Total Testimonies', value: stats.data.totalTestimonies, color: 'blue' },
              { label: 'Total Replies', value: stats.data.totalReplies, color: 'purple' },
              { label: 'Likes Received', value: stats.data.totalLikesReceived, color: 'red' },
              { label: 'Views Received', value: stats.data.totalViewsReceived, color: 'green' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-2xl bg-${color}-50 p-6 text-center`}>
                <p className={`text-3xl font-bold text-${color}-700`}>{value ?? 0}</p>
                <p className='mt-1 text-sm text-slate-600'>{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
