import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status?: string;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
};

export function StatusBadge({ status, activeLabel = 'Active', inactiveLabel = 'Inactive', className }: StatusBadgeProps) {
  const s = status ?? 'pending';

  if (s === 'active' || s === 'approved') {
    return <span className={cn('inline-block bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700', className)}>{activeLabel}</span>;
  }

  if (s === 'rejected') {
    return <span className={cn('inline-block bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600', className)}>Rejected</span>;
  }

  return (
    <span className={cn('inline-block bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500', className)}>
      {s === 'pending' ? 'Pending' : inactiveLabel}
    </span>
  );
}
