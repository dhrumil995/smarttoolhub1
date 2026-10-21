import React from 'react';
import { Icon } from './Icon.tsx';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * Segmented Control conforming to Phase 3:
 * - Pill group with 44px height
 * - Sliding/active brand gradient highlight (green background + navy text)
 * - Icon plus label
 * - ARIA role="radiogroup" with role="radio" and aria-checked
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel = 'Select option',
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex items-center h-11 p-1 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] max-w-full overflow-x-auto scrollbar-none ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;

        return (
          <button
            key={opt.value}
            role="radio"
            type="button"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none focus-ring ${
              isSelected
                ? 'bg-gradient-to-r from-[#0b6bf0] via-[#7a45f5] to-[#d6347f] text-white font-bold shadow-[0_2px_12px_rgba(11,107,240,0.35)]'
                : 'text-[#9aaccb] hover:text-[#f2f7ff] hover:bg-[rgba(143,163,192,0.06)]'
            }`}
          >
            {opt.icon && (
              <Icon
                name={opt.icon}
                size="sm"
                strokeWidth={1.75}
                className={isSelected ? 'text-white' : 'text-[#9aaccb]'}
                aria-hidden={true}
              />
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
