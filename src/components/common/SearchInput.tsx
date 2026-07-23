'use client';

import { Search } from 'lucide-react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/20"
      />
    </div>
  );
}
