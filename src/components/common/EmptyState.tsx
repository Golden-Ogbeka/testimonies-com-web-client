export function EmptyState({ title, message, icon }: { title: string; message: string; icon?: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      {icon && <div className='mb-4 text-gray-300'>{icon}</div>}
      <p className='text-sm font-semibold text-gray-900'>{title}</p>
      <p className='mt-1 text-sm text-gray-500'>{message}</p>
    </div>
  );
}
