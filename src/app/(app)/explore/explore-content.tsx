'use client';

import { EmptyState, PageHeader, SearchInput, SkeletonCard, Spinner, TabBar, UserRow } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useSearchUsers } from '@/hooks/useProfile';
import { useFeed, useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { useDebounce } from '@/hooks/useDebounce';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { flattenPages } from '@/lib/utils';
import { ArrowLeft, Hash, Search, TrendingUp, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import type { LucideIcon } from 'lucide-react';

type Tab = 'people' | 'trending' | 'tags';

const EXPLORE_TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'people', label: 'People', icon: Users },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'tags', label: 'Tags', icon: Hash },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlTag = searchParams.get('tag') ?? '';
  const [localTab, setLocalTab] = useState<Tab>(urlTag ? 'tags' : 'people');
  const [query, setQuery] = useState(urlTag);
  const debouncedQuery = useDebounce(query);

  const selectedTag = urlTag;
  const tab = urlTag ? 'tags' : localTab;

  const users = useSearchUsers(tab === 'people' ? debouncedQuery : '');
  const trending = useTrending();
  const tags = useTestimonyTags(20);
  const feed = useFeed();

  const { ref: sentinelRef, isIntersecting } = useIntersectionObserver();

  const allFeedItems = flattenPages(feed.data);

  const tagTestimonies = useMemo(
    () => (selectedTag ? allFeedItems.filter((t) => t.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())) : []),
    [selectedTag, allFeedItems],
  );

  useEffect(() => {
    if (selectedTag && isIntersecting && feed.hasNextPage && !feed.isFetchingNextPage) {
      feed.fetchNextPage();
    }
  }, [selectedTag, isIntersecting, feed.hasNextPage, feed.isFetchingNextPage, feed.fetchNextPage]);

  const handleTagClick = (tag: string) => {
    router.push(ROUTES.exploreTag(tag));
  };

  const handleClearTag = () => {
    setQuery('');
    router.push(ROUTES.EXPLORE);
  };

  const handleTabChange = (t: string) => {
    const newTab = t as Tab;
    setLocalTab(newTab);
    if (newTab !== 'tags') handleClearTag();
  };

  return (
    <div>
      <PageHeader icon={Search} title="Explore" />

      <TabBar tabs={EXPLORE_TABS} activeTab={tab} onTabChange={handleTabChange} />

      <div className="p-4 space-y-3">
        {tab === 'people' && (
          <>
            <SearchInput value={query} onChange={setQuery} placeholder="Search people..." />
            {users.isLoading && <SkeletonCard />}
            {!users.isLoading && debouncedQuery.length > 1 && (users.data?.users ?? []).length === 0 && (
              <EmptyState title="No users found" message="Try a different name." icon={<Users className="h-8 w-8" />} />
            )}
            {debouncedQuery.length <= 1 && (
              <p className="py-8 text-center text-sm text-muted">Type at least 2 characters to search people.</p>
            )}
            {(users.data?.users ?? []).map((user) => (
              <UserRow key={user._id} user={user} href={ROUTES.profile(user.username)} />
            ))}
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
            {selectedTag ? (
              <>
                <button
                  onClick={handleClearTag}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> All tags
                </button>
                <h2 className="text-base font-bold text-foreground">#{selectedTag}</h2>
                {feed.isLoading && <SkeletonCard />}
                {!feed.isLoading && tagTestimonies.length === 0 && (
                  <EmptyState
                    title="No testimonies found"
                    message={`No testimonies with tag #${selectedTag}.`}
                    icon={<Hash className="h-8 w-8" />}
                  />
                )}
                {tagTestimonies.length > 0 && tagTestimonies.map((t) => <TestimonyCard key={t._id} testimony={t} compact />)}
                <div ref={sentinelRef} className="flex justify-center py-4">
                  {feed.isFetchingNextPage && <Spinner />}
                </div>
              </>
            ) : (
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
          </>
        )}
      </div>
    </div>
  );
}

export default ExploreContent;
