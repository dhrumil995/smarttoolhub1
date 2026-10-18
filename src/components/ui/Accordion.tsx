import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export interface AccordionItem {
  id?: string;
  question: string;
  answer: string | React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Universal Accordion (FAQ) conforming to Phase 3:
 * - Plus icon that rotates 45 degrees to become an X when open
 * - Smooth transition
 * - Native details/summary or accessible button/panel structure
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
  allowMultiple = false,
  className = '',
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex !== null ? [defaultOpenIndex] : []
  );

  const toggleIndex = (idx: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(idx) ? [] : [idx]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const headerId = `accordion-header-${idx}`;
        const panelId = `accordion-panel-${idx}`;

        return (
          <div
            key={idx}
            className={`rounded-2xl transition-all duration-200 border ${
              isOpen
                ? 'bg-[#0a1424] border-[rgba(57,255,136,0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                : 'glass-surface border-[rgba(143,163,192,0.12)] hover:border-[rgba(143,163,192,0.24)]'
            }`}
          >
            <h3>
              <button
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleIndex(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-[#f2f7ff] focus-laser rounded-2xl transition-colors"
              >
                <span className="leading-snug">{item.question}</span>

                {/* Plus icon rotates 45 degrees to become an X when open */}
                <div
                  className={`w-7 h-7 rounded-lg bg-[#050a14] border border-[rgba(143,163,192,0.16)] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-45 text-[#ff5c7a] border-[#ff5c7a]/30' : 'text-[#8fa3c0] hover:text-[#39ff88]'
                  }`}
                  aria-hidden="true"
                >
                  <Plus size={16} strokeWidth={2} />
                </div>
              </button>
            </h3>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#8fa3c0] leading-relaxed border-t border-[rgba(143,163,192,0.08)] animate-in fade-in slide-in-from-top-1"
              >
                {typeof item.answer === 'string' ? (
                  <p className="whitespace-pre-wrap">{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
