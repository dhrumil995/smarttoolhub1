import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { IconTile } from './IconTile.tsx';
import { ToolMeta } from '../../types/navigation.ts';
import { TOOL_ICON_MAP } from '../../data/tools.ts';

export interface ToolCardProps {
  tool: ToolMeta;
  navigate: (path: string) => void;
  className?: string;
}

/**
 * Standard Tool Card Anatomy conforming to Phase 3:
 * - 48px rounded-14px Icon tile
 * - Category label in Geist Mono
 * - Tool name (h3)
 * - One-line description (clamped to max 2 lines)
 * - Small arrow icon that slides 4px on hover
 * - Whole card is one link with a visible focus ring
 */
export const ToolCard: React.FC<ToolCardProps> = ({ tool, navigate, className = '' }) => {
  const toolIcon = TOOL_ICON_MAP[tool.slug] || tool.icon;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      navigate={navigate}
      className={`glass-surface p-6 rounded-3xl flex flex-col justify-between group interactive-hover border border-[rgba(143,163,192,0.14)] focus-laser transition-all duration-200 select-none ${className}`}
    >
      <div className="space-y-4">
        {/* Header row: Icon Tile + Category in Geist Mono */}
        <div className="flex items-center justify-between">
          <IconTile icon={toolIcon} />
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono uppercase text-[#39ff88] tracking-wider font-semibold">
              {tool.category}
            </span>
            {tool.isFlagship && (
              <>
                <span className="text-[#8fa3c0]/60" aria-hidden="true">·</span>
                <span className="text-[#39ff88] font-mono uppercase tracking-wider text-[11px] bg-[#0a1424] px-2 py-0.5 rounded border border-[rgba(57,255,136,0.25)]">
                  Flagship
                </span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-bold font-display text-[#f2f7ff] group-hover:text-[#39ff88] transition-colors leading-snug">
            {tool.name}
          </h3>
          <p className="text-sm text-[#8fa3c0] leading-relaxed mt-2 line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Footer row with sliding arrow (slides 4px on hover) */}
      <div className="pt-6 flex items-center justify-between text-xs font-semibold text-[#39ff88]">
        <span>Open tool</span>
        <div className="w-8 h-8 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.14)] flex items-center justify-center text-[#8fa3c0] group-hover:text-[#39ff88] group-hover:border-[#39ff88]/40 transition-colors">
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
};
