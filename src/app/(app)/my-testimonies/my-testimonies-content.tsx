'use client';

import { EmptyState, PageHeader, SkeletonCard, Spinner, TabBar, VirtualList } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMyReplies, useMyTestimonies, useTestimonyStats } from '@/hooks/useTestimonies';
import { flattenPages } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { BookOpen, Eye, Heart, Reply } from 'lucide-react';
import { useEffect, useState } from 'react';

type Tab = 'testimonies' | 'replies' | 'stats';

export default function MyTestimoniesContent() {
  const [tab, setTab] = useState<Tab>('testimonies');

  const myTestimonies = useMyTestimonies();
  const myReplies = useMyReplies();
  const stats = useTestimonyStats();

  const { ref: testimoniesSentinel, isIntersecting: testimoniesIntersecting } = useIntersectionObserver();
  const { ref: repliesSentinel, isIntersecting: repliesIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (testimoniesIntersecting && myTestimonies.hasNextPage && !myTestimonies.isFetchingNextPage) {
      myTestimonies.fetchNextPage();
    }
  }, [testimoniesIntersecting, myTestimonies.hasNextPage, myTestimonies.isFetchingNextPage, myTestimonies.fetchNextPage]);

  useEffect(() => {
    if (repliesIntersecting && myReplies.hasNextPage && !myReplies.isFetchingNextPage) {
      myReplies.fetchNextPage();
    }
  }, [repliesIntersecting, myReplies.hasNextPage, myReplies.isFetchingNextPage, myReplies.fetchNextPage]);

  return (
    <div>
      <PageHeader icon={BookOpen} title="My Content" />

      {stats.data && (
        <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
          {[
            { label: 'Testimonies', value: stats.data.testimoniesCount, icon: BookOpen },
            { label: 'Replies', value: stats.data.repliesCount, icon: Reply },
            { label: 'Likes', value: stats.data.likesReceivedCount, icon: Heart },
            { label: 'Views', value: stats.data.viewsReceivedCount, icon: Eye },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="py-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Icon className="h-3 w-3 text-foreground" />
                <p className="text-lg font-bold text-foreground">{value ?? 0}</p>
              </div>
              <p className="text-xs text-muted">{label}</p>
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
            {myTestimonies.isLoading && (
              <div className="p-4">
                <SkeletonCard />
              </div>
            )}
            {!myTestimonies.isLoading && flattenPages(myTestimonies.data).length === 0 && (
              <div className="p-4">
                <EmptyState
                  title="No testimonies"
                  message="You have not posted any testimonies yet."
                  icon={<BookOpen className="h-8 w-8" />}
                />
              </div>
            )}
            {flattenPages(myTestimonies.data).length > 0 && (
              <VirtualList
                items={flattenPages(myTestimonies.data)}
                renderItem={(t) => <TestimonyCard key={t._id} testimony={t} compact />}
                estimateSize={120}
              />
            )}
            <div ref={testimoniesSentinel} className="flex justify-center py-4">
              {myTestimonies.isFetchingNextPage && <Spinner />}
              {!myTestimonies.hasNextPage && flattenPages(myTestimonies.data).length > 0 && (
                <p className="text-xs text-muted">You&apos;ve reached the end.</p>
              )}
            </div>
          </>
        )}

        {tab === 'replies' && (
          <>
            {myReplies.isLoading && (
              <div className="p-4">
                <SkeletonCard />
              </div>
            )}
            {!myReplies.isLoading && flattenPages(myReplies.data).length === 0 && (
              <div className="p-4">
                <EmptyState
                  title="No replies"
                  message="You have not replied to any testimonies yet."
                  icon={<Reply className="h-8 w-8" />}
                />
              </div>
            )}
            {flattenPages(myReplies.data).length > 0 && (
              <VirtualList
                items={flattenPages(myReplies.data)}
                renderItem={(reply) => (
                  <div key={reply._id} className="border-b border-border px-4 py-3 hover:bg-card-hover">
                    <p className="text-sm text-foreground">{reply.content}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDistanceToNowStrict(new Date(reply.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                )}
                estimateSize={80}
              />
            )}
            <div ref={repliesSentinel} className="flex justify-center py-4">
              {myReplies.isFetchingNextPage && <Spinner />}
              {!myReplies.hasNextPage && flattenPages(myReplies.data).length > 0 && (
                <p className="text-xs text-muted">You&apos;ve reached the end.</p>
              )}
            </div>
          </>
        )}

        {tab === 'stats' && stats.data && (
          <div className="grid grid-cols-2 gap-4 p-4">
            {[
              { label: 'Total Testimonies', value: stats.data.testimoniesCount },
              { label: 'Total Replies', value: stats.data.repliesCount },
              { label: 'Likes Received', value: stats.data.likesReceivedCount },
              { label: 'Views Received', value: stats.data.viewsReceivedCount },
            ].map(({ label, value }) => (
              <div key={label} className="overflow-hidden rounded-none border border-border bg-background p-4 text-center sm:p-6">
                <p className="truncate text-2xl font-bold text-foreground sm:text-3xl">{value ?? 0}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
