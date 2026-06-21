import { Suspense } from 'react';
import { SpinnerPage } from '@/components/common';
import ExploreContent from './explore-content';

export default function ExplorePage() {
  return (
    <Suspense fallback={<SpinnerPage />}>
      <ExploreContent />
    </Suspense>
  );
}
