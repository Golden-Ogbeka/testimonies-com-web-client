'use client';

import moment from 'moment';
import { Avatar, Button, EmptyState, PageHeader, SkeletonCard, Spinner, TabBar, VirtualList } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useMe } from '@/hooks/useAuth';
import { useFollowers, useFollowing, useFollowUser, useProfileByUsername, useUnfollowUser } from '@/hooks/useProfile';
import { useFeed, useUserReplies } from '@/hooks/useTestimonies';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { flattenPages } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { Settings, User, UserMinus, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Tab = 'testimonies' | 'replies' | 'followers' | 'following';

export default function ProfileContent() {
  const { username } = useParams<{ username: string }>();
  const { data: me } = useMe();
  const profile = useProfileByUsername(username === 'me' ? (me?.username ?? '') : username);
  const follow = useFollowUser();
  const unfollow = useUnfollowUser();
  const [tab, setTab] = useState<Tab>('testimonies');

  const userId = profile.data?._id ?? '';
  const followers = useFollowers(userId);
  const following = useFollowing(userId);
  const userReplies = useUserReplies(userId);
  const feed = useFeed();
  const allFeedPages = flattenPages(feed.data);
  const userTestimonies = useMemo(() => allFeedPages.filter((t) => t.userDetails._id === userId), [allFeedPages, userId]);
  const allUserReplies = flattenPages(userReplies.data);

  const { ref: testimoniesSentinel, isIntersecting: testimoniesIntersecting } = useIntersectionObserver();
  const { ref: repliesSentinel, isIntersecting: repliesIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (tab === 'testimonies' && testimoniesIntersecting && feed.hasNextPage && !feed.isFetchingNextPage) {
      feed.fetchNextPage();
    }
  }, [tab, testimoniesIntersecting, feed]);

  useEffect(() => {
    if (tab === 'replies' && repliesIntersecting && userReplies.hasNextPage && !userReplies.isFetchingNextPage) {
      userReplies.fetchNextPage();
    }
  }, [tab, repliesIntersecting, userReplies]);

  const isMe = me?._id === userId;

  if (profile.isLoading) {
    return (
      <div className="p-4">
        <SkeletonCard />
      </div>
    );
  }

  if (!profile.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <EmptyState title="User not found" message="This profile does not exist." />
      </div>
    );
  }

  const user = profile.data;

  return (
    <div>
      <PageHeader icon={User} title={`@${user.username}`} />
      <div className="relative h-48 bg-gradient-to-r from-foreground/10 to-foreground/20">
        {user.coverImageURL && (
          <Image src={user.coverImageURL} alt="Profile cover image" fill className="object-cover" unoptimized priority />
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-14 mb-3">
          <Avatar src={user.profileImage} name={`${user.firstName} ${user.lastName}`} size="xl" className="ring-4 ring-background" />
          <div className="flex gap-2">
            {!isMe ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => follow.mutate(user._id)}
                  disabled={follow.isPending}
                  className="flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" /> Follow
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => unfollow.mutate(user._id)}
                  disabled={unfollow.isPending}
                  className="flex items-center gap-1.5"
                >
                  <UserMinus className="h-4 w-4" /> Unfollow
                </Button>
              </>
            ) : (
              <Link href={ROUTES.SETTINGS}>
                <Button variant="secondary" className="flex items-center gap-1.5">
                  <Settings className="h-4 w-4" /> Edit profile
                </Button>
              </Link>
            )}
          </div>
        </div>

        <h1 className="text-xl font-bold text-foreground">{`${user.firstName} ${user.lastName}`}</h1>
        <p className="text-sm text-muted">@{user.username}</p>
        {user.verified && <span className="mt-1 inline-block bg-green-50 px-2 py-0.5 text-xs text-green-700">Verified</span>}

        <div className="mt-3 flex gap-4 text-sm text-muted">
          <button
            onClick={() => setTab('followers')}
            aria-label="View followers"
            className="min-h-[44px] py-2 hover:text-foreground transition-colors"
          >
            <span className="font-bold text-foreground">{followers.data?.length ?? 0}</span> Followers
          </button>
          <button
            onClick={() => setTab('following')}
            aria-label="View following"
            className="min-h-[44px] py-2 hover:text-foreground transition-colors"
          >
            <span className="font-bold text-foreground">{following.data?.length ?? 0}</span> Following
          </button>
        </div>
      </div>

      <TabBar
        tabs={[
          { id: 'testimonies', label: 'Testimonies' },
          { id: 'replies', label: 'Replies' },
          { id: 'followers', label: 'Followers' },
          { id: 'following', label: 'Following' },
        ]}
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />

      <div>
        {tab === 'testimonies' && (
          <>
            {userTestimonies.length === 0 && (
              <div className="p-4">
                <EmptyState title="No testimonies" message="This user has not posted yet." />
              </div>
            )}
            {userTestimonies.length > 0 && (
              <VirtualList
                items={userTestimonies}
                renderItem={(t) => <TestimonyCard key={t._id} testimony={t} compact />}
                estimateSize={120}
              />
            )}
            <div ref={testimoniesSentinel} className="flex justify-center py-4">
              {feed.isFetchingNextPage && <Spinner />}
              {!feed.hasNextPage && userTestimonies.length > 0 && <p className="text-xs text-muted">You&apos;ve reached the end.</p>}
            </div>
          </>
        )}

        {tab === 'replies' && (
          <>
            {userReplies.isLoading && <SkeletonCard />}
            {allUserReplies.length === 0 && !userReplies.isLoading && (
              <div className="p-4">
                <EmptyState title="No replies" message="This user has not replied yet." />
              </div>
            )}
            {allUserReplies.map((reply) => (
              <div key={reply._id} className="border-b border-border px-4 py-3 hover:bg-card-hover">
                <p className="text-sm text-foreground">{reply.content}</p>
                <p className="mt-1 text-xs text-gray-400">{moment(reply.createdAt).fromNow()}</p>
              </div>
            ))}
            <div ref={repliesSentinel} className="flex justify-center py-4">
              {userReplies.isFetchingNextPage && <Spinner />}
              {!userReplies.hasNextPage && allUserReplies.length > 0 && <p className="text-xs text-muted">You&apos;ve reached the end.</p>}
            </div>
          </>
        )}

        {tab === 'followers' && (
          <>
            {followers.isLoading && <SkeletonCard />}
            {(followers.data ?? []).length === 0 && !followers.isLoading && (
              <div className="p-4">
                <EmptyState title="No followers" message="" />
              </div>
            )}
            {(followers.data ?? []).map((req) => {
              const u = req.followerDetails;
              if (!u) return null;
              return (
                <Link key={req._id} href={ROUTES.profile(u.username)} prefetch={false}>
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-card-hover">
                    <Avatar src={u.profileImage} name={`${u.firstName} ${u.lastName}`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{`${u.firstName} ${u.lastName}`}</p>
                      <p className="text-xs text-muted">@{u.username}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        )}

        {tab === 'following' && (
          <>
            {following.isLoading && <SkeletonCard />}
            {(following.data ?? []).length === 0 && !following.isLoading && (
              <div className="p-4">
                <EmptyState title="Not following anyone" message="" />
              </div>
            )}
            {(following.data ?? []).map((req) => {
              const u = req.leaderDetails;
              if (!u) return null;
              return (
                <Link key={req._id} href={ROUTES.profile(u.username)} prefetch={false}>
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-card-hover">
                    <Avatar src={u.profileImage} name={`${u.firstName} ${u.lastName}`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{`${u.firstName} ${u.lastName}`}</p>
                      <p className="text-xs text-muted">@{u.username}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
