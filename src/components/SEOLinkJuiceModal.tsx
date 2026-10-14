import React, { useState, useMemo } from 'react';
import { PageId } from '../types';
import { 
  INTERNAL_LINKING_PLAN_50_PAGES, 
  PageLinkingProfile, 
  getLinkJuiceAuditMetrics 
} from '../data/internalLinking';
import { 
  X, 
  Search, 
  Network, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  Layers, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { haptics } from '../utils/haptics';

interface SEOLinkJuiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const SEOLinkJuiceModal: React.FC<SEOLinkJuiceModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'most-clicks' | 'least-clicks'>('all');
  const [selectedSilo, setSelectedSilo] = useState<string>('all');
  const [copiedPlan, setCopiedPlan] = useState(false);

  const metrics = useMemo(() => getLinkJuiceAuditMetrics(), []);

  const silos = [
    'all',
    'Core Portal',
    'Continuity & Wireless',
    'Automation & Shortcuts',
    'Apple Silicon & Hardware',
    'Media & Production',
    'System Utilities & Security',
  ];

  const filteredPages = useMemo(() => {
    return INTERNAL_LINKING_PLAN_50_PAGES.filter((page) => {
      const matchesSearch =
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.semanticKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTier =
        filterTier === 'all' ? true : page.clicksCategory === filterTier;

      const matchesSilo =
        selectedSilo === 'all' ? true : page.topicalSilo === selectedSilo;

      return matchesSearch && matchesTier && matchesSilo;
    });
  }, [searchQuery, filterTier, selectedSilo]);

  const handleNavigateToPage = (path: string) => {
    haptics.playTap();
    onClose();
    if (path.startsWith('/workflows/')) {
      const slug = path.replace('/workflows/', '');
      onNavigate('workflow-detail', slug);
    } else {
      const pageId = path.replace(/^\/+/, '') as PageId;
      onNavigate(pageId || 'home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyFullMarkdownPlan = async () => {
    haptics.playTap();
    const rows = INTERNAL_LINKING_PLAN_50_PAGES.map((p, idx) => {
      const outbound = p.outboundEquityTargets.map((o) => `[${o.anchorText}](${o.targetPath})`).join(', ');
      return `| ${idx + 1} | \`${p.path}\` | **${p.clicksCategory}** | ${p.topicalSilo} | ${p.inboundEquitySources.length} Inbound | ${outbound} |`;
    }).join('\n');

    const markdown = `# SmartToolHub 50-Page Internal Linking Architecture & Link Juice Flow Plan

**Total Canonical Pages:** ${metrics.totalPages}  
**Power Donors (Most Clicks):** ${metrics.powerPages}  
**Growth Target Receivers (Least Clicks):** ${metrics.growthTargetPages}  
**Total Link Equity Connections:** ${metrics.totalConnections}  
**Average Links Per Node:** ${metrics.avgOutboundLinksPerHub}  

| # | Page URL | Clicks Tier | Topical Silo | Inbound Donors | Outbound Link Equity Targets |
|---|----------|-------------|--------------|----------------|------------------------------|
${rows}
`;

    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedPlan(true);
      setTimeout(() => setCopiedPlan(false), 2500);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#080C16] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="seo-modal-title"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Network className="w-3 h-3" />
                <span>SEO Architecture Live</span>
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
                50 Canonical Nodes
              </span>
            </div>
            <h2 id="seo-modal-title" className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Internal Link Juice Distribution Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-2xl">
              Directing PageRank and topical authority from high-traffic power hubs to weaker, high-potential deep pages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyFullMarkdownPlan}
              className="px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
              title="Copy 50-page internal linking table as markdown"
            >
              {copiedPlan ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPlan ? 'Copied Plan' : 'Export Plan'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* High-Level Link Juice KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:px-6 bg-slate-100/60 dark:bg-white/[0.01] border-b border-slate-200 dark:border-white/10 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Total Canonical Pages</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">50 Pages</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Power Donors (Most Clicks)</span>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{metrics.powerPages} Hubs</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Growth Targets (Least Clicks)</span>
            <div className="text-lg font-bold font-mono text-amber-500">{metrics.growthTargetPages} Pages</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">Total Internal Link Bridges</span>
            <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">{metrics.totalConnections} Links</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by page title, URL path, or target keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Click Tier Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setFilterTier('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterTier === 'all'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All (50)
              </button>
              <button
                type="button"
                onClick={() => setFilterTier('most-clicks')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterTier === 'most-clicks'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Most Clicks ({metrics.powerPages})
              </button>
              <button
                type="button"
                onClick={() => setFilterTier('least-clicks')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterTier === 'least-clicks'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Least Clicks ({metrics.growthTargetPages})
              </button>
            </div>

            {/* Silo Filter */}
            <select
              value={selectedSilo}
              onChange={(e) => setSelectedSilo(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs font-medium text-slate-700 dark:text-zinc-300 cursor-pointer"
            >
              {silos.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s === 'all' ? 'All Topical Silos' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable 50-Page Table / Card Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Displaying {filteredPages.length} of 50 Canonical URLs</span>
            <span>Link Juice Priority Flow</span>
          </div>

          <div className="space-y-3">
            {filteredPages.map((page, idx) => {
              const isPower = page.clicksCategory === 'most-clicks';
              return (
                <div
                  key={page.path}
                  className={`p-4 rounded-2xl border transition-all ${
                    isPower
                      ? 'bg-emerald-500/[0.03] border-emerald-500/20 dark:border-emerald-500/15'
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-zinc-300">
                          #{idx + 1}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isPower
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {isPower ? '⚡ Power Donor (High Clicks)' : '🎯 Target Receiver (Low Clicks)'}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                          {page.topicalSilo}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {page.title}
                      </h4>

                      <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <span>{page.path}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigateToPage(page.path)}
                      className="self-start lg:self-center px-3.5 py-1.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm shrink-0"
                    >
                      <span>Visit Live Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Outbound Link Equity Targets */}
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-indigo-500" />
                      <span>Transfers Link Juice To ({page.outboundEquityTargets.length} Outbound Connections):</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {page.outboundEquityTargets.map((target, tidx) => (
                        <button
                          key={tidx}
                          type="button"
                          onClick={() => handleNavigateToPage(target.targetPath)}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 text-[11px] text-slate-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer transition-all"
                          title={`Target: ${target.targetTitle}`}
                        >
                          <span className="font-semibold">{target.anchorText}</span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500">→</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Semantic Keywords Tag Row */}
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500 dark:text-zinc-400">
                    <span className="font-semibold">Target Search Queries:</span>
                    {page.semanticKeywords.map((k, kidx) => (
                      <span key={kidx} className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 font-mono">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 sm:px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% Crawlable Internal Linking & Sitemaps.org Protocol Compliant</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer self-end sm:self-auto"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
