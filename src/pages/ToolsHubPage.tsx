import React, { useState } from 'react';
import { Search, Zap, ArrowUpRight } from 'lucide-react';
import { LAUNCH_TOOLS } from '../data/tools.ts';
import { Link } from '../hooks/useRouter.tsx';
import { AdSlot } from '../components/ads/AdSlot.tsx';

interface ToolsHubPageProps {
  navigate: (path: string) => void;
}

export const ToolsHubPage: React.FC<ToolsHubPageProps> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'automation', label: 'Automation' },
    { id: 'writing', label: 'Writing & Text' },
    { id: 'utilities', label: 'Utilities & Math' },
  ];

  const filteredTools = LAUNCH_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
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
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8fa3c0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 8 tools..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-laser"
          />
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#39ff88] text-[#050a14]'
                  : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            navigate={navigate}
            className="glass-surface p-6 rounded-3xl flex flex-col justify-between group interactive-hover border border-[rgba(143,163,192,0.14)] focus-laser"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex items-center justify-center text-[#39ff88] group-hover:border-[#39ff88] transition-colors">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
                  <span className="font-mono uppercase">{tool.category}</span>
                  {tool.isFlagship && (
                    <>
                      <span>·</span>
                      <span className="text-[#39ff88] font-mono uppercase">Flagship</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold font-display text-[#f2f7ff] group-hover:text-[#39ff88] transition-colors">
                  {tool.name}
                </h2>
                <p className="text-sm text-[#8fa3c0] leading-relaxed mt-1.5">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-[#39ff88]">
              <span>Open tool</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 space-y-3 glass-surface rounded-3xl border border-[rgba(143,163,192,0.12)]">
          <p className="text-sm text-[#8fa3c0]">No tools found matching &ldquo;{searchQuery}&rdquo;</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="btn-glass text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Reserved Ad Slot at Bottom of Tools Hub */}
      <AdSlot format="banner" />
    </div>
  );
};
