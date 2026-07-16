'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  src: string;
  alt?: string;
  onClose: () => void;
};

export function ImagePreview({ src, alt = 'Preview', onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center bg-white/20 text-white transition-colors hover:bg-white/40"
      >
        <X className="h-5 w-5" />
      </button>
      <img src={src} alt={alt} className="max-h-[85vh] max-w-full object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
