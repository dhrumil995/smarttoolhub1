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

const CATEGORY_CHIP_COLORS: Record<string, { bg: string; text: string; shadow: string }> = {
  all: { bg: 'bg-gradient-to-r from-[#0b6bf0] via-[#7a45f5] to-[#d6347f]', text: 'text-white', shadow: 'shadow-[0_2px_12px_rgba(11,107,240,0.35)]' },
  writing: { bg: 'bg-[#0a84ff]', text: 'text-white', shadow: 'shadow-[0_2px_12px_rgba(10,132,255,0.35)]' },
  social: { bg: 'bg-[#ff4f9a]', text: 'text-white', shadow: 'shadow-[0_2px_12px_rgba(255,79,154,0.35)]' },
  productivity: { bg: 'bg-[#ffb840]', text: 'text-[#050a14]', shadow: 'shadow-[0_2px_12px_rgba(255,184,64,0.35)]' },
  apple: { bg: 'bg-[#8b5cf6]', text: 'text-white', shadow: 'shadow-[0_2px_12px_rgba(139,92,246,0.35)]' },
  calculators: { bg: 'bg-[#34e0a1]', text: 'text-[#050a14]', shadow: 'shadow-[0_2px_12px_rgba(52,224,161,0.35)]' },
  text: { bg: 'bg-[#38d0ff]', text: 'text-[#050a14]', shadow: 'shadow-[0_2px_12px_rgba(56,208,255,0.35)]' },
  developer: { bg: 'bg-[#6c7dff]', text: 'text-white', shadow: 'shadow-[0_2px_12px_rgba(108,125,255,0.35)]' },
  images: { bg: 'bg-[#ff8a3d]', text: 'text-white', shadow: 'shadow-[0_2px_12px_rgba(255,138,61,0.35)]' },
  study: { bg: 'bg-[#a3e635]', text: 'text-[#050a14]', shadow: 'shadow-[0_2px_12px_rgba(163,230,53,0.35)]' },
  work: { bg: 'bg-[#f472d0]', text: 'text-[#050a14]', shadow: 'shadow-[0_2px_12px_rgba(244,114,208,0.35)]' },
  files: { bg: 'bg-[#4ade80]', text: 'text-[#050a14]', shadow: 'shadow-[0_2px_12px_rgba(74,222,128,0.35)]' },
};

/**
 * Category Chips conforming to Colourful Aurora system:
 * - Horizontally scrollable on mobile (no wrap, snap scrolling)
 * - Fading edge masks
 * - Each chip has its assigned category icon
 * - Active chip filled with category colour (or brand gradient for 'all')
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
          const activeStyle = CATEGORY_CHIP_COLORS[cat.id.toLowerCase()] || CATEGORY_CHIP_COLORS.all;

          return (
            <button
              key={cat.id}
              role="tab"
              type="button"
              aria-selected={isSelected}
              onClick={() => onSelect(cat.id)}
              className={`snap-start inline-flex items-center gap-2 h-11 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-ring select-none shrink-0 ${
                isSelected
                  ? `${activeStyle.bg} ${activeStyle.text} ${activeStyle.shadow} font-bold`
                  : 'bg-[#0a1424] text-[#9aaccb] border border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff] hover:border-[rgba(143,163,192,0.3)]'
              }`}
            >
              <Icon
                name={iconName}
                size="sm"
                strokeWidth={1.75}
                className={isSelected ? activeStyle.text : 'text-current'}
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
