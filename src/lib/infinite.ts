import { useInfiniteQuery, type InfiniteData, type QueryKey } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import type { Paginated } from '@/types/api';

type InfiniteQueryFn<T> = (page: number) => Promise<Paginated<T>>;

export function useInfiniteList<T>(
  queryKey: QueryKey,
  queryFn: InfiniteQueryFn<T>,
  enabled = true,
) {
  return useInfiniteQuery<Paginated<T>, Error, InfiniteData<Paginated<T>>, QueryKey, number>({
    queryKey,
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.currentPage < last.totalPages ? last.currentPage + 1 : undefined),
    enabled,
  });
}

export function useIntersect(callback: () => void, enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && enabled) callback();
    },
    [callback, enabled],
  );

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (ref.current) ref.current = null;
      if (node) {
        const observer = new IntersectionObserver(cb, { rootMargin: '200px' });
        observer.observe(node);
        ref.current = node;
        return () => observer.disconnect();
      }
    },
    [cb],
  );

  return setRef;
}
