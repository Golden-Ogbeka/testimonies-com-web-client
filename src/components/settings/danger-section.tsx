'use client';

import { useMemo } from 'react';
import { Button, Input } from '@/components/common';
import { apiMessage } from '@/lib/utils';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface DangerSectionProps {
  title: string;
  description: string;
  submitLabel: string;
  isPending: boolean;
  form: UseFormReturn<{ password: string }>;
  onSubmit: (password: string) => Promise<void>;
  successMessage: string;
}

export function DangerSection({ title, description, submitLabel, isPending, form, onSubmit, successMessage }: DangerSectionProps) {
  const handleSubmit = useMemo(
    () =>
      form.handleSubmit(async (v) => {
        try {
          await onSubmit(v.password);
          toast.success(successMessage);
          form.reset();
        } catch (err) {
          toast.error(apiMessage(err));
        }
      }),
    [form, onSubmit, successMessage],
  );

  return (
    <div className="rounded-none border border-red-200 bg-red-50/30 p-4">
      <h2 className="mb-1 text-sm font-bold text-red-600">{title}</h2>
      <p className="mb-3 text-xs text-muted">{description}</p>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Confirm password"
          aria-label={`Confirm password to ${title.toLowerCase()}`}
          containerClassName="flex-1"
          className="h-10 focus:border-red-500/50 focus:ring-red-500/20"
          error={form.formState.errors.password?.message}
          {...form.register('password')}
        />
        <Button type="submit" variant="danger" disabled={isPending}>
          {submitLabel}
        </Button>
      </form>
    </div>
  );
}
