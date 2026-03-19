export function SkeletonCard() {
  return (
    <div className='animate-pulse rounded-2xl border border-slate-200 bg-white p-4'>
      <div className='mb-3 h-4 w-1/3 rounded bg-slate-200' />
      <div className='mb-2 h-3 w-full rounded bg-slate-200' />
      <div className='h-3 w-2/3 rounded bg-slate-200' />
    </div>
  );
}
