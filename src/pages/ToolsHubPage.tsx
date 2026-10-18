import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { LAUNCH_TOOLS } from '../data/tools.ts';
import { AdSlot } from '../components/ads/AdSlot.tsx';
import { ToolCard } from '../components/ui/ToolCard.tsx';
import { CategoryChips } from '../components/ui/CategoryChips.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface ToolsHubPageProps {
  navigate: (path: string) => void;
}

export const ToolsHubPage: React.FC<ToolsHubPageProps> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'Writing', label: 'Writing' },
    { id: 'Social', label: 'Social' },
    { id: 'Productivity', label: 'Productivity' },
    { id: 'Apple', label: 'Apple' },
    { id: 'Calculators', label: 'Calculators' },
    { id: 'Text', label: 'Text' },
    { id: 'Developer', label: 'Developer' },
    { id: 'Images', label: 'Images' },
  ];

  const filteredTools = LAUNCH_TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'all' || tool.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-6 sm:py-12 max-w-[1200px] mx-auto space-y-8">
      {/* Header Landmark */}
      <header className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#39ff88]">
          Free AI Tool Directory
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          All AI Tools<span className="text-[#39ff88]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] max-w-xl">
          Free AI tools that just work. No sign-up. Results in seconds. Pick a tool below to start immediately.
        </p>
      </header>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8fa3c0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search all ${LAUNCH_TOOLS.length} tools...`}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-laser"
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

        {/* Snap Scrolling Category Chips with Fading Edges and Icons */}
        <div className="flex-1 min-w-0">
          <CategoryChips
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
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
          message="No tools match that. Try a shorter word."
          actionLabel="Reset filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
          className="my-10"
        />
      )}

      {/* Ad placement reserved slot */}
      <AdSlot format="banner" className="my-8" />
    </div>
  );
};
