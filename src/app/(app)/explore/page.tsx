'use client';

import { Avatar, EmptyState, SkeletonCard } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useSearchUsers } from '@/hooks/useProfile';
import { useFeed, useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { Hash, Search, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

type Tab = 'people' | 'testimonies' | 'trending' | 'tags';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTag = searchParams.get('tag') ?? '';
  const [tab, setTab] = useState<Tab>(initialTag ? 'tags' : 'people');
  const [query, setQuery] = useState(initialTag);

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

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setTab('testimonies');
    router.push(`/explore?tag=${tag}`);
  };

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-lg'>
        <h1 className='mb-3 text-lg font-bold text-gray-900'>Explore</h1>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setTab(e.target.value ? 'people' : 'people'); }}
            placeholder='Search people or testimonies...'
            className='w-full rounded-full border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2C3248]/50 focus:ring-1 focus:ring-[#2C3248]/20'
          />
        </div>
      </div>

      <div className='flex border-b border-gray-200'>
        {([
          { id: 'people' as Tab, label: 'People', icon: Users },
          { id: 'testimonies' as Tab, label: 'Testimonies', icon: Search },
          { id: 'trending' as Tab, label: 'Trending', icon: TrendingUp },
          { id: 'tags' as Tab, label: 'Tags', icon: Hash },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors hover:bg-gray-50 ${
              tab === id ? 'border-b-2 border-[#2C3248] text-[#2C3248]' : 'text-gray-500'
            }`}
          >
            <Icon className='h-4 w-4' /> {label}
          </button>
        ))}
      </div>

      <div className='p-4 space-y-3'>
        {tab === 'people' && (
          <>
            {users.isLoading && <SkeletonCard />}
            {!users.isLoading && query.length > 1 && (users.data ?? []).length === 0 && (
              <EmptyState title='No users found' message='Try a different name.' icon={<Users className='h-8 w-8' />} />
            )}
            {query.length <= 1 && (
              <p className='py-8 text-center text-sm text-gray-400'>Type at least 2 characters to search people.</p>
            )}
            {(users.data ?? []).map((user) => (
              <Link key={user._id} href={`/u/${user.username}`}>
                <div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50'>
                  <Avatar src={user.picture} name={user.fullName ?? user.username} />
                  <div>
                    <p className='font-semibold text-gray-900'>{user.fullName ?? user.username}</p>
                    <p className='text-sm text-gray-500'>@{user.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {tab === 'testimonies' && (
          <>
            {feed.isLoading && <SkeletonCard />}
            {filteredTestimonies.length === 0 && !feed.isLoading && (
              <EmptyState title='No testimonies found' message='Try a different keyword.' icon={<Search className='h-8 w-8' />} />
            )}
            {filteredTestimonies.map((t) => <TestimonyCard key={t._id} testimony={t} compact />)}
          </>
        )}

        {tab === 'trending' && (
          <>
            {trending.isLoading && <SkeletonCard />}
            {(trending.data ?? []).length === 0 && !trending.isLoading && (
              <EmptyState title='Nothing trending' message='Check back later.' icon={<TrendingUp className='h-8 w-8' />} />
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
                  onClick={() => handleTagClick(tag)}
                  className='rounded-full bg-[#2C3248]/5 px-4 py-2 text-sm font-medium text-[#2C3248] transition-colors hover:bg-[#2C3248]/10'
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

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className='flex items-center justify-center p-12'>
        <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#2C3248]' />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
