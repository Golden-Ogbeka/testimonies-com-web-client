'use client';

import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  // Stabilise the options reference so an inline object literal passed by a
  // caller doesn't recreate the IntersectionObserver on every render.
  const optionsRef = useRef(options);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), {
      threshold: 0,
      ...optionsRef.current,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { ref: setNode, isIntersecting };
}
