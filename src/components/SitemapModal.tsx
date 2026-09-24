import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  Check, 
  Copy, 
  ExternalLink, 
  Search, 
  FileCode, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Download,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getAllSitemapRoutes, SitemapRoute, resolveBaseUrl } from '../utils/sitemapGenerator';
import { haptics } from '../utils/haptics';
import { PageId } from '../types';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [routes, setRoutes] = useState<SitemapRoute[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedXml, setCopiedXml] = useState<boolean>(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const baseUrl = resolveBaseUrl();
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  useEffect(() => {
    if (isOpen) {
      const discovered = getAllSitemapRoutes();
      setRoutes(discovered);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['all', 'core', 'tool', 'workflow', 'filter', 'legal'];

  const filteredRoutes = routes.filter((r) => {
    const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      r.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopySitemapUrl = () => {
    haptics.playTap();
    navigator.clipboard.writeText(sitemapUrl).then(() => {
      setCopiedUrl(true);
      haptics.playSuccess();
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  };

  const handleDownloadXml = () => {
    haptics.playTap();
    window.open('/sitemap.xml', '_blank');
  };

  const handlePingGoogle = () => {
    haptics.playTap();
    setPingStatus('Pinging Googlebot...');
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    // Open ping URL in background or new tab
    const win = window.open(pingUrl, '_blank');
    setTimeout(() => {
      setPingStatus('Ping Signal Dispatched!');
      haptics.playSuccess();
      setTimeout(() => setPingStatus(null), 3000);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Automated Sitemap & Indexing Hub"
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-white/[0.12] bg-[#0A0B0E] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">SEO Infrastructure</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-xs text-emerald-400 font-medium">Auto-Generated Dynamic XML</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Automated Sitemap & Indexing Hub
            </h2>
            <p className="text-xs text-[#86868B] max-w-xl">
              Dynamically identifies all core pages, tools, and curated workflows for immediate crawling and indexing by Google, Bing, and DuckDuckGo.
            </p>
          </div>

          <button
            onClick={() => {
              haptics.playTap();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-[#86868B] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Bar */}
        <div className="px-6 py-4 border-b border-white/[0.06] bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.06]">
            <Globe className="w-3.5 h-3.5 text-[#2997FF]" />
            <span className="truncate max-w-[280px] sm:max-w-md">{sitemapUrl}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySitemapUrl}
              className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.10] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
            </button>

            <button
              onClick={handleDownloadXml}
              className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.10] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-[#2997FF]" />
              <span>View XML</span>
            </button>

            <button
              onClick={handlePingGoogle}
              className="px-3 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{pingStatus || 'Ping Search Engines'}</span>
            </button>
          </div>
        </div>

        {/* Filtering & Search Bar */}
        <div className="px-6 py-3 border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  haptics.playTap();
                  setFilterCategory(cat);
                }}
                className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-white text-black font-medium shadow-sm'
                    : 'text-[#86868B] hover:text-white'
                }`}
              >
                {cat} {cat === 'all' ? `(${routes.length})` : ''}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter routes or keywords..."
              className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-[#2997FF] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Routes Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 max-h-[50vh]">
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-12 text-[#86868B] text-xs">
              No routes matched your query.
            </div>
          ) : (
            filteredRoutes.map((r, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-white/[0.12] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-[#2997FF] border border-white/[0.08]">
                      {r.category}
                    </span>
                    <span className="font-semibold text-white truncate">{r.title}</span>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-400 truncate">
                    {r.path}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#86868B] shrink-0">
                  <div className="text-right">
                    <span className="block text-zinc-300 font-mono">Priority: {r.priority.toFixed(2)}</span>
                    <span className="block text-zinc-500">{r.changefreq} · {r.lastmod}</span>
                  </div>

                  <a
                    href={r.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors"
                    title="Open live route"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-black/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#86868B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>XML conforms strictly to sitemaps.org 0.9 & Google Image Search 1.1 specs</span>
          </div>

          <div className="text-zinc-500">
            Total Discovered URLs: <span className="text-white font-medium">{routes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
