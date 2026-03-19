import { Card } from './Card';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <Card className='text-center'>
      <p className='text-sm font-semibold text-slate-900'>{title}</p>
      <p className='mt-1 text-sm text-slate-500'>{message}</p>
    </Card>
  );
}
