'use client';

import { useEffect, useState } from 'react';

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), { threshold: 0, ...options });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, options]);

  return { ref: setNode, isIntersecting };
}
