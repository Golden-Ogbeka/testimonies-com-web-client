'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn('space-y-3 sm:space-y-4', className)}>
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={faq.question}
            className={cn(
              'overflow-hidden rounded-2xl border border-border bg-background transition-all duration-200',
              isOpen ? 'border-foreground/30 shadow-sm' : 'hover:border-foreground/20',
            )}
          >
            <button
              id={buttonId}
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className={cn(
                'flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-150 sm:px-6 sm:py-5',
                isOpen ? 'bg-background-secondary' : 'hover:bg-primary-muted/20',
              )}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className="pr-4 font-serif text-base font-bold text-foreground sm:text-lg">{faq.question}</span>
              <ChevronDown
                className={cn('h-5 w-5 shrink-0 text-foreground/60 transition-transform duration-200', isOpen && 'rotate-180')}
                aria-hidden
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-border px-5 py-4 sm:px-6 sm:py-5">
                  <p className="text-sm font-medium leading-relaxed text-foreground/80">{faq.answer}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
