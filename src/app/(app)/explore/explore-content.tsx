'use client';

import { EmptyState, PageHeader, SearchInput, SkeletonCard, Spinner, TabBar, UserRow, VirtualList } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useSearchUsers } from '@/hooks/useProfile';
import { useFeed, useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { useDebounce } from '@/hooks/useDebounce';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { flattenPages } from '@/lib/utils';
import { Hash, Search, TrendingUp, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ROUTES } from '@/constants/routes';

type Tab = 'people' | 'testimonies' | 'trending' | 'tags';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTag = searchParams.get('tag') ?? '';
  const [tab, setTab] = useState<Tab>(initialTag ? 'tags' : 'people');
  const [query, setQuery] = useState(initialTag);
  const debouncedQuery = useDebounce(query);

  const users = useSearchUsers(debouncedQuery);
  const trending = useTrending();
  const tags = useTestimonyTags(20);
  const feed = useFeed();

  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (tab !== 'testimonies' && isIntersecting && feed.hasNextPage && !feed.isFetchingNextPage) {
      feed.fetchNextPage();
    }
  }, [tab, isIntersecting, feed]);

  const allFeedItems = flattenPages(feed.data);

  const filteredTestimonies = useMemo(
    () =>
      query.length > 1
        ? allFeedItems.filter(
            (t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase()),
          )
        : allFeedItems,
    [query, allFeedItems],
  );

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setTab('testimonies');
    router.push(ROUTES.exploreTag(tag));
  };

  return (
    <div>
      <PageHeader icon={Search} title="Explore">
        <div className="mt-3">
          <SearchInput value={query} onChange={(v) => setQuery(v)} placeholder="Search people or testimonies..." />
        </div>
      </PageHeader>

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

      <div className="p-4 space-y-3">
        {tab === 'people' && (
          <>
            {users.isLoading && <SkeletonCard />}
            {!users.isLoading && debouncedQuery.length > 1 && (users.data?.users ?? []).length === 0 && (
              <EmptyState title="No users found" message="Try a different name." icon={<Users className="h-8 w-8" />} />
            )}
            {debouncedQuery.length <= 1 && (
              <p className="py-8 text-center text-sm text-gray-400">Type at least 2 characters to search people.</p>
            )}
            {(users.data?.users ?? []).map((user) => (
              <UserRow key={user._id} user={user} href={ROUTES.profile(user.username)} />
            ))}
          </>
        )}

        {tab === 'testimonies' && (
          <>
            {feed.isLoading && <SkeletonCard />}
            {filteredTestimonies.length === 0 && !feed.isLoading && (
              <EmptyState title="No testimonies found" message="Try a different keyword." icon={<Search className="h-8 w-8" />} />
            )}
            {filteredTestimonies.length > 0 && (
              <VirtualList
                items={filteredTestimonies}
                renderItem={(t) => <TestimonyCard key={t._id} testimony={t} compact />}
                estimateSize={120}
              />
            )}
            {feed.hasNextPage && (
              <div ref={sentinelRef} className="flex justify-center py-4">
                {feed.isFetchingNextPage && <Spinner />}
              </div>
            )}
          </>
        )}

        {tab === 'trending' && (
          <>
            {trending.isLoading && <SkeletonCard />}
            {(trending.data?.results ?? []).length === 0 && !trending.isLoading && (
              <EmptyState title="Nothing trending" message="Check back later." icon={<TrendingUp className="h-8 w-8" />} />
            )}
            {(trending.data?.results ?? []).map((t) => (
              <TestimonyCard key={t._id} testimony={t} compact />
            ))}
          </>
        )}

        {tab === 'tags' && (
          <>
            {tags.isLoading && <SkeletonCard />}
            <div className="flex flex-wrap gap-2">
              {(tags.data ?? []).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="bg-foreground/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
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

export default ExploreContent;
