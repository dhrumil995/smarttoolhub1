import React from 'react';
import { ArrowRight, Bookmark, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { IconTile } from './IconTile.tsx';
import { ToolMeta } from '../../types/navigation.ts';
import { TOOL_ICON_MAP } from '../../data/tools.ts';

export interface ToolRowProps {
  tool: ToolMeta;
  navigate: (path: string) => void;
  isSaved?: boolean;
  onToggleSave?: (slug: string) => void;
}

export const ToolRow: React.FC<ToolRowProps> = ({
  tool,
  navigate,
  isSaved = false,
  onToggleSave,
}) => {
  const toolIcon = TOOL_ICON_MAP[tool.slug] || tool.icon;

  return (
    <div className="bg-white border border-gray-200/80 hover:border-purple-300 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-4 transition-all hover:shadow-xs group select-none">
      {/* Left: Icon + Title + Description */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <Link
          href={`/tools/${tool.slug}`}
          navigate={navigate}
          className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0 group-hover:scale-105 transition-transform"
        >
          <IconTile icon={toolIcon} category={tool.category} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/tools/${tool.slug}`}
              navigate={navigate}
              className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors truncate"
            >
              {tool.name}
            </Link>

            {/* Verified Check */}
            <svg
              className="w-3.5 h-3.5 text-purple-600 shrink-0 fill-current"
              viewBox="0 0 20 20"
              aria-label="Verified Tool"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>

            {tool.isFlagship && (
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                Flagship
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 truncate mt-0.5">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Middle: Category & Privacy Metadata (Clean, quiet typography) */}
      <div className="hidden md:flex items-center gap-3 text-xs text-gray-400 font-medium shrink-0">
        <span className="text-gray-600 font-semibold">{tool.category}</span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1 text-emerald-600">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Client-Side</span>
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(tool.slug);
            }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus-ring ${
              isSaved
                ? 'text-purple-700 bg-purple-50'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save tool'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}

        <Link
          href={`/tools/${tool.slug}`}
          navigate={navigate}
          className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors shadow-xs"
        >
          <span>Launch</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
