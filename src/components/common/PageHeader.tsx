import type { LucideIcon } from 'lucide-react';

type PageHeaderProps = {
  icon: LucideIcon;
  title: string;
};

export function PageHeader({ icon: Icon, title }: PageHeaderProps) {
  return (
    <div className='sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-lg'>
      <div className='flex items-center gap-2'>
        <Icon className='h-5 w-5 text-[#2C3248]' />
        <h1 className='text-lg font-bold text-gray-900'>{title}</h1>
      </div>
    </div>
  );
}
