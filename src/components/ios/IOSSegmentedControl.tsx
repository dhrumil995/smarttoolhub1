import React from 'react';
import { haptics } from '../../utils/haptics';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface IOSSegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function IOSSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
}: IOSSegmentedControlProps<T>) {
  const handleSelect = (nextValue: T) => {
    if (nextValue !== value) {
      haptics.playTap();
      onChange(nextValue);
    }
  };

  const sizeClasses = {
    sm: 'p-0.5 text-xs',
    md: 'p-1 text-xs sm:text-[13px]',
    lg: 'p-1.5 text-sm',
  };

  const itemPadding = {
    sm: 'px-2.5 py-1',
    md: 'px-3.5 py-1.5 min-h-[36px]',
    lg: 'px-5 py-2 min-h-[44px]',
  };

  return (
    <div
      role="tablist"
      className={`inline-flex items-center rounded-xl bg-neutral-200/80 dark:bg-[#1C1C1E] p-1 border border-black/[0.04] dark:border-white/[0.08] backdrop-blur-md select-none max-w-full overflow-x-auto ${sizeClasses[size]} ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => handleSelect(option.value)}
            className={`relative flex items-center justify-center gap-1.5 rounded-lg font-medium tracking-tight whitespace-nowrap cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF] active:scale-[0.97] ${itemPadding[size]} ${
              isSelected
                ? 'bg-white dark:bg-[#2C2C2E] text-neutral-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.06)] font-semibold'
                : 'text-[#86868B] hover:text-neutral-900 dark:hover:text-[#F5F5F7]'
            }`}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
