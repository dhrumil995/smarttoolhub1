import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Laptop, Apple, Smartphone, ArrowRight, ShieldCheck, Cpu, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { LAUNCH_TOOLS } from '../data/tools.ts';
import { ToolCard } from '../components/ui/ToolCard.tsx';
import { CategoryChips } from '../components/ui/CategoryChips.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface ToolsHubPageProps {
  navigate: (path: string) => void;
}

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
  const [typeFilter, setTypeFilter] = useState<'all' | 'client' | 'ai'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'a-z' | 'z-a'>('featured');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'Developer', label: 'Developer & CLI' },
    { id: 'Files', label: 'Files & Privacy' },
    { id: 'Apple', label: 'Apple Tools' },
    { id: 'Productivity', label: 'Productivity' },
    { id: 'Work', label: 'Work & Creative' },
    { id: 'Study', label: 'Study & Learning' },
    { id: 'Calculators', label: 'Calculators' },
    { id: 'Writing', label: 'Writing' },
  ];

  const filteredTools = useMemo(() => {
    let list = LAUNCH_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchesType =
        typeFilter === 'all' || tool.type === typeFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)));

      return matchesCategory && matchesType && matchesSearch;
    });

    if (sortBy === 'a-z') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'z-a') {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // featured: flagships first, then original order
      list = [...list].sort((a, b) => (b.isFlagship ? 1 : 0) - (a.isFlagship ? 1 : 0));
    }

    return list;
  }, [selectedCategory, typeFilter, searchQuery, sortBy]);

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

  return (
    <div className="py-6 sm:py-12 max-w-[1200px] mx-auto space-y-8">
      {/* Header Landmark */}
      <header className="space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
          Zero-Install Browser Utilities &amp; Productivity Tools
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          All Online Tools<span className="text-[#0a84ff]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] max-w-2xl leading-relaxed">
          High-performance developer diagnostics, client-side file tools, and AI automation assistants. 
          No accounts, no mandatory sign-ups, and zero tracking. Pick any tool below to run directly in your browser.
        </p>

        {/* Software Directories Quick Ribbon */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#9aaccb] font-medium mr-1">Looking for desktop &amp; phone apps?</span>
          <button
            type="button"
            onClick={() => navigate('/pc-tools')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a1424] hover:bg-[#101c33] border border-[rgba(143,163,192,0.14)] hover:border-[#0a84ff] text-[#f2f7ff] transition-all font-medium"
          >
            <Laptop size={13} className="text-[#0a84ff]" />
            <span>PC Tools (20)</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/apple-tools')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a1424] hover:bg-[#101c33] border border-[rgba(143,163,192,0.14)] hover:border-[#8b5cf6] text-[#f2f7ff] transition-all font-medium"
          >
            <Apple size={13} className="text-[#8b5cf6]" />
            <span>Apple Tools (10)</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/android-tools')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a1424] hover:bg-[#101c33] border border-[rgba(143,163,192,0.14)] hover:border-[#34e0a1] text-[#f2f7ff] transition-all font-medium"
          >
            <Smartphone size={13} className="text-[#34e0a1]" />
            <span>Android Tools (20)</span>
          </button>
        </div>
      </header>

      {/* Search, Filter and Sort Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8fa3c0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search all ${LAUNCH_TOOLS.length} tools...`}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.18)] text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-ring"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa3c0] hover:text-[#f2f7ff] p-1"
                aria-label="Clear search"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Quick Engine Type Toggles & Sort */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <div className="flex items-center bg-[#050a14] p-1 rounded-2xl border border-[rgba(143,163,192,0.14)]">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all ${
                  typeFilter === 'all'
                    ? 'bg-[#101c33] text-[#f2f7ff] font-semibold shadow'
                    : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('client')}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1 ${
                  typeFilter === 'client'
                    ? 'bg-[#101c33] text-[#34e0a1] font-semibold shadow'
                    : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                }`}
                title="Runs locally in browser memory with zero upload"
              >
                <ShieldCheck size={13} />
                <span>Client Offline</span>
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('ai')}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1 ${
                  typeFilter === 'ai'
                    ? 'bg-[#101c33] text-[#0a84ff] font-semibold shadow'
                    : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                }`}
                title="Powered by Gemini Flash API"
              >
                <Sparkles size={13} />
                <span>AI Powered</span>
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort tools"
              className="bg-[#050a14] border border-[rgba(143,163,192,0.18)] rounded-2xl px-3 py-2 text-xs font-mono text-[#f2f7ff] focus-ring"
            >
              <option value="featured">Featured First</option>
              <option value="a-z">Alphabetical (A &rarr; Z)</option>
              <option value="z-a">Alphabetical (Z &rarr; A)</option>
            </select>
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="pt-2 border-t border-[rgba(143,163,192,0.1)]">
          <CategoryChips
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[#8fa3c0] px-1">
        <span>Showing {filteredTools.length} of {LAUNCH_TOOLS.length} tools</span>
        <span>Runs instantly with zero sign-up</span>
      </div>

      {/* Tools Grid with Universal ToolCard Anatomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            navigate={navigate}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <EmptyState
          icon="SearchX"
          message="No tools match that search query or filter."
          actionLabel="Reset filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setTypeFilter('all');
          }}
          className="my-12"
        />
      )}
    </div>
  );
};
