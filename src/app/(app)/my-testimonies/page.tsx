'use client';

import { EmptyState, PageHeader, Pagination, SkeletonCard, TabBar } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useMyReplies, useMyTestimonies, useTestimonyStats } from '@/hooks/useTestimonies';
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
      <PageHeader icon={BookOpen} title='My Content' />

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

      <TabBar
        tabs={[
          { id: 'testimonies', label: 'Testimonies' },
          { id: 'replies', label: 'Replies' },
          { id: 'stats', label: 'Stats' },
        ]}
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />

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
              <Pagination page={page} totalPages={myTestimonies.data?.totalPages ?? 1} onPageChange={setPage} />
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
                <p className='text-sm text-gray-700'>{reply.content}</p>
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
