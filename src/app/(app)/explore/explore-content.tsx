'use client';

import { EmptyState, PageHeader, SearchInput, SkeletonCard, TabBar, UserRow } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useSearchUsers } from '@/hooks/useProfile';
import { useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { useDebounce } from '@/hooks/useDebounce';
import { Hash, Search, TrendingUp, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';

type Tab = 'people' | 'trending' | 'tags';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTag = searchParams.get('tag') ?? '';
  const [tab, setTab] = useState<Tab>(initialTag ? 'tags' : 'people');
  const [query, setQuery] = useState(initialTag);
  const debouncedQuery = useDebounce(query);

  const users = useSearchUsers(tab === 'people' ? debouncedQuery : '');
  const trending = useTrending();
  const tags = useTestimonyTags(20);

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setTab('people');
    router.push(ROUTES.exploreTag(tag));
  };

  return (
    <div>
      <PageHeader icon={Search} title="Explore" />

      <TabBar
        tabs={[
          { id: 'people', label: 'People', icon: Users },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'tags', label: 'Tags', icon: Hash },
        ]}
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />

      <div className="p-4 space-y-3">
        {tab === 'people' && (
          <>
            <SearchInput value={query} onChange={(v) => setQuery(v)} placeholder="Search people..." />
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
