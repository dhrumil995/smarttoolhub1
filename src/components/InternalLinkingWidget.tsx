import React from 'react';
import { PageId } from '../types';
import { getInternalLinksForPage, getInboundEquityForPage, INTERNAL_LINKING_PLAN_50_PAGES } from '../data/internalLinking';
import { ArrowUpRight, Compass, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface InternalLinkingWidgetProps {
  currentPath: string;
  onNavigate: (page: PageId, workflowId?: string) => void;
  className?: string;
  title?: string;
  showSiloExplorer?: boolean;
}

export const InternalLinkingWidget: React.FC<InternalLinkingWidgetProps> = ({
  currentPath,
  onNavigate,
  className = '',
  title = 'Recommended Ecosystem Next Steps & Related Blueprints',
  showSiloExplorer = true,
}) => {
  const cleanPath = currentPath.replace(/\/+$/, '') || '/';
  const outboundLinks = getInternalLinksForPage(cleanPath);
  const inboundSources = getInboundEquityForPage(cleanPath);
  const currentProfile = INTERNAL_LINKING_PLAN_50_PAGES.find((p) => p.path === cleanPath);

  // If no direct outbound links defined, provide topical cluster fallback
  const fallbackLinks = currentProfile
    ? INTERNAL_LINKING_PLAN_50_PAGES.filter(
        (p) => p.topicalSilo === currentProfile.topicalSilo && p.path !== cleanPath
      ).slice(0, 4).map((p) => ({
        targetPath: p.path,
        targetTitle: p.title,
        anchorText: p.title.split(':')[0] || p.title,
        relationship: 'topic-sibling' as const,
        equityValue: 'medium' as const,
      }))
    : [];

  const displayLinks = outboundLinks.length > 0 ? outboundLinks : fallbackLinks;

  const handleLinkClick = (e: React.MouseEvent, targetPath: string) => {
    e.preventDefault();
    haptics.playTap();

    if (targetPath.startsWith('/workflows/')) {
      const slug = targetPath.replace('/workflows/', '');
      onNavigate('workflow-detail', slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const pageName = targetPath.replace(/^\/+/, '') as PageId;
      onNavigate(pageName || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`space-y-6 pt-4 select-none ${className}`}>
      {/* Header with Semantic Subtext */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/10 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>

        {currentProfile && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
              <Layers className="w-3 h-3" />
              <span>{currentProfile.topicalSilo} Silo</span>
            </span>
          </div>
        )}
      </div>

      {/* Primary Contextual Outbound Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {displayLinks.map((link, idx) => {
          const isHighValue = link.equityValue === 'high';
          return (
            <a
              key={idx}
              href={link.targetPath}
              onClick={(e) => handleLinkClick(e, link.targetPath)}
              className="ios-card-static p-4 group flex flex-col justify-between hover:border-indigo-500/40 transition-all text-left cursor-pointer no-underline relative overflow-hidden"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    {link.relationship === 'deep-action' && <Zap className="w-2.5 h-2.5" />}
                    {link.relationship === 'troubleshooting-bridge' && <ShieldCheck className="w-2.5 h-2.5 text-amber-500" />}
                    {link.relationship.replace('-', ' ')}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {link.anchorText}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                  {link.targetTitle}
                </p>
              </div>

              {isHighValue && (
                <div className="mt-3 pt-2.5 border-t border-slate-900/5 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
                  <span className="font-mono">Priority Authority Flow</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Explore →</span>
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* Topical Inbound Authority Badges */}
      {inboundSources.length > 0 && showSiloExplorer && (
        <div className="p-3.5 rounded-2xl bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-900/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-medium text-[11px]">Associated Authority Hubs:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {inboundSources.map((src, sidx) => (
              <a
                key={sidx}
                href={src.sourcePath}
                onClick={(e) => handleLinkClick(e, src.sourcePath)}
                className="px-2.5 py-1 rounded-lg glass-pill text-[11px] font-medium text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>{src.sourceTitle}</span>
                <span className="text-slate-400 dark:text-zinc-500 text-[10px]">↖</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
