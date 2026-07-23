'use client';

import { useVirtualizer } from '@tanstack/react-virtual';

type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: number;
  overscan?: number;
  sentinel?: React.ReactNode;
};

export function VirtualList<T>({ items, renderItem, estimateSize = 100, overscan = 5, sentinel }: Props<T>) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => (typeof document !== 'undefined' ? document.documentElement : null),
    estimateSize: () => estimateSize,
    overscan,
  });

  const paddingTop = virtualizer.getVirtualItems().length > 0 ? virtualizer.getVirtualItems()[0].start : 0;
  const paddingBottom =
    virtualizer.getVirtualItems().length > 0
      ? virtualizer.getTotalSize() - virtualizer.getVirtualItems()[virtualizer.getVirtualItems().length - 1].end
      : 0;

  return (
    <>
      <div style={{ paddingTop, paddingBottom }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
      {sentinel}
    </>
  );
}
