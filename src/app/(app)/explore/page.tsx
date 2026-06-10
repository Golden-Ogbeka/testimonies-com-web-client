'use client';

import { EmptyState, PageHeader, SearchInput, SkeletonCard, SpinnerPage, TabBar, UserRow } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useSearchUsers } from '@/hooks/useProfile';
import { useFeed, useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { Hash, Search, TrendingUp, Users } from 'lucide-react';
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
        <SearchInput value={query} onChange={(v) => { setQuery(v); setTab(v ? 'people' : 'people'); }} placeholder='Search people or testimonies...' />
      </div>

      <TabBar
        tabs={[
          { id: 'people', label: 'People', icon: Users },
          { id: 'testimonies', label: 'Testimonies', icon: Search },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'tags', label: 'Tags', icon: Hash },
        ]}
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />

      <div className='p-4 space-y-3'>
        {tab === 'people' && (
          <>
            {users.isLoading && <SkeletonCard />}
            {!users.isLoading && query.length > 1 && (users.data?.results ?? []).length === 0 && (
              <EmptyState title='No users found' message='Try a different name.' icon={<Users className='h-8 w-8' />} />
            )}
            {query.length <= 1 && (
              <p className='py-8 text-center text-sm text-gray-400'>Type at least 2 characters to search people.</p>
            )}
            {(users.data?.results ?? []).map((user) => (
              <UserRow key={user._id} user={user} href={`/u/${user.username}`} />
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
            {(trending.data?.results ?? []).length === 0 && !trending.isLoading && (
              <EmptyState title='Nothing trending' message='Check back later.' icon={<TrendingUp className='h-8 w-8' />} />
            )}
            {(trending.data?.results ?? []).map((t) => <TestimonyCard key={t._id} testimony={t} compact />)}
          </>
        )}

        {tab === 'tags' && (
          <>
            {tags.isLoading && <SkeletonCard />}
            <div className='flex flex-wrap gap-2'>
              {(tags.data?.results ?? []).map((tag) => (
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
    <Suspense fallback={<SpinnerPage />}>
      <ExploreContent />
    </Suspense>
  );
}
