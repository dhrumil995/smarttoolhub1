import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, Filter, SlidersHorizontal, LayoutGrid, List, Bookmark, ShieldCheck, Zap, ArrowUpDown } from 'lucide-react';
import { LAUNCH_TOOLS } from '../data/tools.ts';
import { ToolCard } from '../components/ui/ToolCard.tsx';
import { ToolRow } from '../components/ui/ToolRow.tsx';

interface ToolsHubPageProps {
  navigate: (path: string) => void;
}

type SortOption = 'recommended' | 'new' | 'deal' | 'a-z';
type PlatformOption = 'all' | 'iOS' | 'Android' | 'Mac' | 'Windows' | 'Web';
type ViewMode = 'grid' | 'list';

const SAVED_TOOLS_STORAGE_KEY = 'smarttoolhub_saved_slugs';

export const ToolsHubPage: React.FC<ToolsHubPageProps> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }
    return '';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('category') || 'all';
    }
    return 'all';
  });

  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformOption>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  // Saved Slugs state with localStorage persistence
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(SAVED_TOOLS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const toggleSave = (slug: string) => {
    setSavedSlugs((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(SAVED_TOOLS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Fallback
      }
      return next;
    });
  };

  // Sync search/category to URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (searchQuery.trim()) {
        url.searchParams.set('q', searchQuery.trim());
      } else {
        url.searchParams.delete('q');
      }
      if (selectedCategory && selectedCategory !== 'all') {
        url.searchParams.set('category', selectedCategory);
      } else {
        url.searchParams.delete('category');
      }
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  }, [searchQuery, selectedCategory]);

  const filteredTools = useMemo(() => {
    let list = LAUNCH_TOOLS.filter((tool) => {
      if (showSavedOnly && !savedSlugs.includes(tool.slug)) {
        return false;
      }

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' ||
        tool.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'ai' && tool.type === 'ai') ||
        (selectedCategory === 'writing' && (tool.category === 'Writing' || tool.category === 'Work')) ||
        (selectedCategory === 'productivity' && (tool.category === 'Productivity' || tool.category === 'Study'));

      // Platform filter
      let matchesPlatform = true;
      if (selectedPlatform === 'iOS') {
        matchesPlatform = tool.category === 'Apple' || tool.slug.includes('iphone') || tool.slug.includes('apple');
      } else if (selectedPlatform === 'Android') {
        matchesPlatform = tool.slug.includes('android') || tool.slug.includes('adb');
      } else if (selectedPlatform === 'Mac') {
        matchesPlatform = tool.category === 'Apple' || tool.slug.includes('mac') || Boolean(tool.keywords?.includes('mac'));
      } else if (selectedPlatform === 'Windows') {
        matchesPlatform = tool.slug.includes('autohotkey') || tool.slug.includes('bootable') || Boolean(tool.keywords?.includes('windows'));
      }

      // Deal filter
      let matchesDeal = true;
      if (sortBy === 'deal') {
        matchesDeal = tool.isFlagship || tool.type === 'client';
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)));

      return matchesCategory && matchesPlatform && matchesDeal && matchesSearch;
    });

    if (sortBy === 'new') {
      list = [...list].reverse();
    } else if (sortBy === 'a-z') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort((a, b) => (b.isFlagship ? 1 : 0) - (a.isFlagship ? 1 : 0));
    }

    return list;
  }, [selectedCategory, selectedPlatform, sortBy, searchQuery, showSavedOnly, savedSlugs]);

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Enterprise Title Block & Metric Row */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-700 font-bold mb-1.5">
              <span>Verified Utility Directory</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700">100% Client-Side Privacy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              All Tools &amp; Utilities
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-2xl">
              High-performance browser tools, file converters, developer diagnostics, and AI generators.
            </p>
          </div>

          {/* Quick Metrics Capsule Bar */}
          <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-gray-900">{LAUNCH_TOOLS.length}</span>
              <span>Online Tools</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              <span>0s Setup</span>
            </div>
          </div>
        </div>

        {/* Live Search & Segmented View Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Search Input Bar */}
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, format, language (e.g. shortcuts, pdf, regex)..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 shadow-xs focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Island: View Mode (Grid vs List) + Saved Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Saved Toggle Button */}
            <button
              type="button"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                showSavedOnly
                  ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : ''}`} />
              <span>Saved ({savedSlugs.length})</span>
            </button>

            {/* View Mode Segmented Switcher (Linear / Raycast Style) */}
            <div className="p-1 bg-gray-100 rounded-xl flex items-center gap-1 border border-gray-200/80">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row Island */}
      <div className="space-y-3 pt-3 border-y border-gray-200/80 py-3.5 bg-white/70 backdrop-blur-xs rounded-2xl px-3 sm:px-4 border border-gray-100">
        {/* Row 1: SORT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap -mx-2 px-2 sm:mx-0 sm:px-0">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-gray-400 mr-1 shrink-0">
              SORT
            </span>
            <button
              type="button"
              onClick={() => setSortBy('recommended')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                sortBy === 'recommended'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Recommended
            </button>
            <button
              type="button"
              onClick={() => setSortBy('new')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                sortBy === 'new'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              New
            </button>
            <button
              type="button"
              onClick={() => setSortBy('deal')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                sortBy === 'deal'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>100% Free Tools</span>
            </button>
            <button
              type="button"
              onClick={() => setSortBy('a-z')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                sortBy === 'a-z'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              A to Z
            </button>
          </div>

          {/* Dynamic Counter */}
          <div className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60 uppercase tracking-wider shrink-0 self-start sm:self-auto">
            {filteredTools.length} {filteredTools.length === 1 ? 'TOOL' : 'TOOLS'}
          </div>
        </div>

        {/* Row 2: PLATFORM Segmented Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap -mx-2 px-2 sm:mx-0 sm:px-0">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-gray-400 mr-1 shrink-0">
            PLATFORM
          </span>
          {(['all', 'iOS', 'Android', 'Mac', 'Windows', 'Web'] as PlatformOption[]).map((platform) => {
            const isActive = selectedPlatform === platform;
            return (
              <button
                key={platform}
                type="button"
                onClick={() => setSelectedPlatform(platform)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-purple-100 text-purple-800 border border-purple-300 font-semibold'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {platform === 'all' ? 'All Platforms' : platform}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Mode: Grid vs Dense List */}
      {filteredTools.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4.5 pt-1">
            {filteredTools.map((tool, idx) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                navigate={navigate}
                isSponsored={idx === 1}
                isSaved={savedSlugs.includes(tool.slug)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {filteredTools.map((tool) => (
              <ToolRow
                key={tool.slug}
                tool={tool}
                navigate={navigate}
                isSaved={savedSlugs.includes(tool.slug)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center font-bold text-lg">
            🔍
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {showSavedOnly ? 'No saved tools yet' : 'No tools match your criteria'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {showSavedOnly
              ? 'Click the bookmark icon on any tool card to save it for quick access.'
              : 'Try clearing your search keyword or switching to All Platforms.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedPlatform('all');
              setSelectedCategory('all');
              setSortBy('recommended');
              setShowSavedOnly(false);
            }}
            className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-semibold hover:bg-purple-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
