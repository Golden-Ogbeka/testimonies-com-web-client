'use client';

import { useCallback, useRef } from 'react';
import { apiMessage } from '@/lib/utils';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

interface ImageUploadButtonProps {
  mutation: { mutateAsync: (file: File) => Promise<unknown>; isPending: boolean };
  successMsg: string;
  label: string;
  className?: string;
  iconClassName?: string;
}

export function ImageUploadButton({ mutation, successMsg, label, className, iconClassName }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        await mutation.mutateAsync(file);
        toast.success(successMsg);
      } catch (err) {
        toast.error(apiMessage(err));
      }
    },
    [mutation, successMsg],
  );

  const trigger = useCallback(() => inputRef.current?.click(), []);

  return (
    <>
      <button type="button" onClick={trigger} disabled={mutation.isPending} className={className}>
        <Camera className={iconClassName ?? 'h-3.5 w-3.5'} />
        {mutation.isPending ? 'Uploading...' : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </>
  );
}
