'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';
import type { ButtonProps } from './Button';

type ConfirmVariant = 'danger' | 'warning' | 'default';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isPending?: boolean;
};

const variantStyles: Record<ConfirmVariant, ButtonProps['variant']> = {
  danger: 'danger',
  warning: 'secondary',
  default: 'primary',
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isPending,
}: ConfirmModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-sm rounded-none bg-background p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-muted transition-colors hover:bg-background-secondary hover:text-foreground-secondary"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 id="confirm-title" className="text-lg font-bold text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm text-foreground-secondary">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant={variantStyles[variant]} onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
