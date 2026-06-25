'use client';

import { useTestimonyTags, useTrending } from '@/hooks/useTestimonies';
import { ROUTES } from '@/constants/routes';
import { Hash, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function AppRightSidebar() {
  const trending = useTrending();
  const tags = useTestimonyTags(8);

  return (
    <aside className='sticky top-0 hidden h-screen w-[300px] shrink-0 border-l border-gray-200 bg-white xl:block'>
      <div className='h-full overflow-y-auto p-4'>
        <div className='rounded-xl border border-gray-200 bg-white p-4 mb-4'>
          <div className='mb-3 flex items-center gap-2'>
            <TrendingUp className='h-4 w-4 text-[#2C3248]' />
            <h3 className='text-sm font-bold text-gray-900'>Trending</h3>
          </div>
          {(trending.data?.results ?? []).length === 0 && (
            <p className='text-xs text-gray-400'>Nothing trending right now.</p>
          )}
          <div className='space-y-1'>
            {(trending.data?.results ?? []).slice(0, 5).map((item) => (
              <Link
                key={item._id}
                href={ROUTES.post(item._id)}
                className='block rounded-lg p-2 transition-colors hover:bg-gray-50'
              >
                <p className='text-sm font-semibold text-gray-900 line-clamp-1'>
                  {item.title}
                </p>
                <p className='mt-0.5 text-xs text-gray-500 line-clamp-2'>
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {(tags.data?.results ?? []).length > 0 && (
          <div className='rounded-xl border border-gray-200 bg-white p-4'>
            <div className='mb-3 flex items-center gap-2'>
              <Hash className='h-4 w-4 text-[#2C3248]' />
              <h3 className='text-sm font-bold text-gray-900'>Popular Tags</h3>
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {(tags.data?.results ?? []).map((tag) => (
                <Link
                  key={tag}
                  href={ROUTES.exploreTag(tag)}
                  className='rounded-full bg-[#2C3248]/5 px-2.5 py-1 text-xs font-medium text-[#2C3248] transition-colors hover:bg-[#2C3248]/10'
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
