import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';

interface PopularToolsProps {
  navigate: (path: string) => void;
}

export const PopularTools: React.FC<PopularToolsProps> = ({ navigate }) => {
  // Curate 4 top tools for quick everyday access
  const popular = LAUNCH_TOOLS.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 border-t border-[rgba(143,163,192,0.12)]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#39ff88] mb-2">
            Quick Launch
          </div>
          <h2 className="h2-fluid font-display text-[#f2f7ff]">
            Popular tools.
          </h2>
        </div>
        <Link
          href="/tools"
          navigate={navigate}
          className="text-xs font-mono uppercase tracking-wider text-[#39ff88] hover:underline focus-laser rounded py-1 inline-flex items-center gap-1"
        >
          <span>View all 8 tools</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {popular.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            navigate={navigate}
            className="glass-surface p-5 rounded-2xl flex items-center justify-between group interactive-hover border border-[rgba(143,163,192,0.14)] focus-laser"
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-3">
              <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex items-center justify-center text-[#39ff88] shrink-0 group-hover:border-[#39ff88] transition-colors">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#f2f7ff] group-hover:text-[#39ff88] transition-colors truncate">
                  {tool.name}
                </div>
                <div className="text-xs text-[#8fa3c0] truncate mt-0.5">
                  {tool.description}
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#0a1424] flex items-center justify-center text-[#8fa3c0] group-hover:text-[#39ff88] transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
