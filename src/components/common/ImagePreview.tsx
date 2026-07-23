'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // If the user clicks outside the image, close the preview. We need to calculate the rendered size of the image because it may be scaled down to fit in the viewport.
    // this is necessary because the image is set to object-contain, which means it will scale down to fit in the container while maintaining its aspect ratio. We need to calculate the rendered size of the image and check if the click was outside of that area.
    const image = e.currentTarget;
    const bounds = image.getBoundingClientRect();
    const scale = Math.min(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;
    const renderedLeft = (bounds.width - renderedWidth) / 2;
    const renderedTop = (bounds.height - renderedHeight) / 2;
    const clickX = e.clientX - bounds.left;
    const clickY = e.clientY - bounds.top;

    if (clickX < renderedLeft || clickX > renderedLeft + renderedWidth || clickY < renderedTop || clickY > renderedTop + renderedHeight) {
      onClose();
      return;
    }

    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center bg-white/20 text-white transition-colors hover:bg-white/40"
      >
        <X className="h-5 w-5" />
      </button>
      {/* Use a relative wrapper so next/image fill works inside the flex container */}
      <div className="relative max-w-full py-20" style={{ width: '100%', height: '90vh' }} onClick={onClose}>
        <Image src={src} alt={alt} fill className="object-contain" unoptimized sizes="100vw" onClick={handleImageClick} />
      </div>
    </div>
  );
}
