import { Button } from './Button';
import { Card } from './Card';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className='text-center'>
      <p className='text-sm font-semibold text-red-700'>Something went wrong</p>
      <p className='mt-1 text-sm text-slate-600'>{message}</p>
      {onRetry ? (
        <Button variant='secondary' className='mt-3' onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Card>
  );
}
