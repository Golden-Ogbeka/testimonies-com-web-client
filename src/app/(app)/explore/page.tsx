'use client';

import { Avatar, Card, EmptyState, SkeletonCard } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useSearchUsers } from '@/hooks/useProfile';
import { useFeed, useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Tab = 'people' | 'testimonies' | 'trending' | 'tags';

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>('people');
  const [query, setQuery] = useState('');

  const users = useSearchUsers(query);
  const trending = useTrending();
  const tags = useTestimonyTags(20);
  const feed = useFeed(1);

  const filteredTestimonies = query.length > 1
    ? (feed.data?.results ?? []).filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      )
    : (feed.data?.results ?? []);

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur'>
        <h1 className='mb-3 text-lg font-bold'>Explore</h1>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search people or testimonies...'
            className='w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='flex border-b border-slate-200'>
        {(['people', 'testimonies', 'trending', 'tags'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition hover:bg-slate-50 ${tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className='p-4 space-y-3'>
        {tab === 'people' && (
          <>
            {users.isLoading && <SkeletonCard />}
            {!users.isLoading && query.length > 1 && (users.data ?? []).length === 0 && (
              <EmptyState title='No users found' message='Try a different name.' />
            )}
            {query.length <= 1 && <p className='text-sm text-slate-500 text-center py-8'>Type at least 2 characters to search people.</p>}
            {(users.data ?? []).map((user) => (
              <Link key={user._id} href={`/u/${user.username}`}>
                <Card className='flex items-center gap-3 hover:bg-slate-50 transition-colors'>
                  <Avatar src={user.picture} name={user.fullName ?? user.username} />
                  <div>
                    <p className='font-semibold text-slate-900'>{user.fullName ?? user.username}</p>
                    <p className='text-sm text-slate-500'>@{user.username}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </>
        )}

        {tab === 'testimonies' && (
          <>
            {feed.isLoading && <SkeletonCard />}
            {filteredTestimonies.length === 0 && !feed.isLoading && (
              <EmptyState title='No testimonies found' message='Try a different keyword.' />
            )}
            {filteredTestimonies.map((t) => <TestimonyCard key={t._id} testimony={t} compact />)}
          </>
        )}

        {tab === 'trending' && (
          <>
            {trending.isLoading && <SkeletonCard />}
            {(trending.data ?? []).length === 0 && !trending.isLoading && (
              <EmptyState title='Nothing trending' message='Check back later.' />
            )}
            {(trending.data ?? []).map((t) => <TestimonyCard key={t._id} testimony={t} compact />)}
          </>
        )}

        {tab === 'tags' && (
          <>
            {tags.isLoading && <SkeletonCard />}
            <div className='flex flex-wrap gap-2'>
              {(tags.data ?? []).map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); setTab('testimonies'); }}
                  className='rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors'
                >
                  #{tag}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
