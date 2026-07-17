'use client';

import { useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { ROUTES } from '@/constants/routes';
import { Hash, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function AppRightSidebar() {
  const trending = useTrending();
  const tags = useTestimonyTags(8);

  return (
    <aside className="sticky top-0 hidden h-screen w-[300px] shrink-0 border-l border-border/60 bg-background xl:block">
      <div className="h-full overflow-y-auto p-5">
        <div className="mb-5 rounded-none bg-background-secondary/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
            <h3 className="text-xs font-semibold tracking-wide text-foreground/60 uppercase">Trending</h3>
          </div>
          {(trending.data?.results ?? []).length === 0 && <p className="text-xs text-muted">Nothing trending right now.</p>}
          <div className="space-y-1">
            {(trending.data?.results ?? []).slice(0, 5).map((item) => (
              <Link key={item._id} href={ROUTES.post(item._id)} className="block rounded-none p-2 transition-colors hover:bg-card-hover">
                <p className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted line-clamp-2">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {(tags.data ?? []).length > 0 && (
          <div className="rounded-none bg-background-secondary/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Hash className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
              <h3 className="text-xs font-semibold tracking-wide text-foreground/60 uppercase">Popular Tags</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(tags.data ?? []).map((tag) => (
                <Link
                  key={tag}
                  href={ROUTES.exploreTag(tag)}
                  className="bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-foreground/10"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
