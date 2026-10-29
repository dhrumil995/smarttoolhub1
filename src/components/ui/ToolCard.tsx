import React from 'react';
import { ArrowRight, Bookmark, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { IconTile } from './IconTile.tsx';
import { ToolMeta } from '../../types/navigation.ts';
import { TOOL_ICON_MAP } from '../../data/tools.ts';

export interface ToolCardProps {
  tool: ToolMeta;
  navigate: (path: string) => void;
  className?: string;
  isSponsored?: boolean;
  isSaved?: boolean;
  onToggleSave?: (slug: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  navigate,
  className = '',
  isSponsored = false,
  isSaved = false,
  onToggleSave,
}) => {
  const toolIcon = TOOL_ICON_MAP[tool.slug] || tool.icon;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-purple-300 transition-all duration-200 flex flex-col justify-between p-4.5 group relative select-none ${className}`}
    >
      <div>
        {/* Top Header Row: Icon + Bookmark + Badges */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/tools/${tool.slug}`}
            navigate={navigate}
            className="focus-ring rounded-xl block"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-center text-purple-700 shadow-xs group-hover:scale-105 transition-transform duration-200">
              <IconTile icon={toolIcon} category={tool.category} />
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            {isSponsored ? (
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                SPONSORED
              </span>
            ) : tool.isFlagship ? (
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                Flagship
              </span>
            ) : null}

            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleSave(tool.slug);
                }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors focus-ring ${
                  isSaved
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-300 hover:text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={isSaved ? 'Remove from saved' : 'Save tool'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title with Verified Check Badge */}
        <div className="mt-3.5">
          <Link
            href={`/tools/${tool.slug}`}
            navigate={navigate}
            className="focus-ring rounded inline-block"
          >
            <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors flex items-center gap-1.5 leading-snug">
              <span className="truncate">{tool.name}</span>
              {/* Verified Blue/Purple Badge */}
              <svg
                className="w-4 h-4 text-purple-600 shrink-0 fill-current"
                viewBox="0 0 20 20"
                aria-label="Verified Tool"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </h3>
          </Link>

          {/* Clean unboxed metadata with typographic separators */}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400 font-medium">
            <span className="text-purple-700 font-semibold">{tool.category}</span>
            <span aria-hidden="true">·</span>
            <span>Client-Side</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">100% Free</span>
          </div>

          {/* Clamped Description */}
          <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-2 min-h-[34px]">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Bottom CTA Row: Purple 'Visit Site >' Button */}
      <div className="pt-3.5 mt-2 border-t border-gray-100 flex flex-col gap-2">
        <Link
          href={`/tools/${tool.slug}`}
          navigate={navigate}
          className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all focus-ring group/btn"
        >
          <span>Launch Tool</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
