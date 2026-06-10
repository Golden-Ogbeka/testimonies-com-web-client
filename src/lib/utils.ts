import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function apiMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message || 'Something went wrong. Please try again.';
  }
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string; error?: { message?: string } } } }).response;
    return response?.data?.error?.message ?? response?.data?.message ?? 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
