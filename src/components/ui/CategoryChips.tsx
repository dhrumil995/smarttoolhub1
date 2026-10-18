import React, { useRef } from 'react';
import { Icon } from './Icon.tsx';
import { CATEGORY_ICON_MAP } from '../../data/tools.ts';

export interface CategoryItem {
  id: string;
  label: string;
  icon?: string;
}

export interface CategoryChipsProps {
  categories: CategoryItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

/**
 * Category Chips conforming to Phase 3:
 * - Horizontally scrollable on mobile (no wrap, snap scrolling)
 * - Fading edge masks
 * - Each chip has its assigned category icon
 * - Active chip is filled laser green with navy text
 */
export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedId,
  onSelect,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative max-w-full overflow-hidden ${className}`}>
      {/* Fading Edge Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#050a14] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#050a14] to-transparent z-10" />

      {/* Snap Scroll Row */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Filter tools by category"
        className="flex items-center gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory px-4 py-1.5"
      >
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const iconName = cat.icon || CATEGORY_ICON_MAP[cat.id] || 'LayoutGrid';

          return (
            <button
              key={cat.id}
              role="tab"
              type="button"
              aria-selected={isSelected}
              onClick={() => onSelect(cat.id)}
              className={`snap-start inline-flex items-center gap-2 h-11 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-laser select-none shrink-0 ${
                isSelected
                  ? 'bg-[#39ff88] text-[#050a14] font-bold shadow-[0_0_16px_rgba(57,255,136,0.3)]'
                  : 'bg-[#0a1424] text-[#8fa3c0] border border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff] hover:border-[rgba(143,163,192,0.3)]'
              }`}
            >
              <Icon
                name={iconName}
                size="sm"
                strokeWidth={1.75}
                className={isSelected ? 'text-[#050a14]' : 'text-current'}
                aria-hidden={true}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
