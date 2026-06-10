export function SkeletonCard() {
  return (
    <div className='animate-pulse rounded-xl border border-gray-100 bg-white p-4'>
      <div className='mb-3 flex items-center gap-3'>
        <div className='h-10 w-10 rounded-full bg-gray-100' />
        <div className='flex-1 space-y-2'>
          <div className='h-3 w-1/3 rounded bg-gray-100' />
          <div className='h-2 w-1/4 rounded bg-gray-100' />
        </div>
      </div>
      <div className='space-y-2'>
        <div className='h-3 w-3/4 rounded bg-gray-100' />
        <div className='h-3 w-full rounded bg-gray-100' />
        <div className='h-3 w-2/3 rounded bg-gray-100' />
      </div>
    </div>
  );
}
