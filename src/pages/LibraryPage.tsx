import React, { useState } from 'react';
import { PageId, PersonaType } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Laptop, 
  Smartphone, 
  Tablet, 
  SlidersHorizontal,
  Bookmark,
  Check
} from 'lucide-react';

interface LibraryPageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || '';
    }
    return '';
  });
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [builtInOnly, setBuiltInOnly] = useState<boolean>(false);
  const [savedWorkflows, setSavedWorkflows] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('smarttoolhub_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const personas = [
    { id: 'all', label: 'All Roles' },
    { id: 'creators', label: 'Creators' },
    { id: 'freelancers', label: 'Freelancers' },
    { id: 'students', label: 'Students' },
    { id: 'beginners', label: 'Beginners' },
    { id: 'developers', label: 'Developers' },
  ];

  const categories = [
    'all',
    'Audio & Video Production',
    'Productivity & Focus',
    'Study & Research',
    'Cross-Device File Sync',
    'Developer & Automation',
  ];

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedWorkflows.includes(id)
      ? savedWorkflows.filter((wId) => wId !== id)
      : [...savedWorkflows, id];
    setSavedWorkflows(updated);
    try {
      localStorage.setItem('smarttoolhub_bookmarks', JSON.stringify(updated));
    } catch {
      // localstorage guard
    }
  };

  const filtered = WORKFLOWS_DATA.filter((wf) => {
    const matchesSearch = searchQuery
      ? wf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesPersona = selectedPersona === 'all' || wf.persona === selectedPersona;
    const matchesCategory = selectedCategory === 'all' || wf.category === selectedCategory;
    const matchesBuiltIn = builtInOnly ? wf.isBuiltInOnly : true;

    return matchesSearch && matchesPersona && matchesCategory && matchesBuiltIn;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header — Apple Style */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-normal text-[#2997FF] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Ecosystem Repository</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-tight">
          Verified Apple Workflow Library
        </h1>
        <p className="text-sm sm:text-base text-[#86868B] leading-relaxed font-normal">
          Explore complete production blueprints with tested hardware setups, keyboard shortcut cheat-sheets, and step numbering.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-6 sm:p-7 rounded-[28px] border border-white/[0.08] space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#888888] absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, app name, or tag..."
              aria-label="Search by keyword, app name, or tag"
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-white placeholder-[#86868B] focus:outline-none"
            />
          </div>

          {/* Native Tools Only Filter */}
          <label className="flex items-center gap-2 text-xs text-[#A3A3A3] cursor-pointer shrink-0 select-none">
            <input
              type="checkbox"
              checked={builtInOnly}
              onChange={(e) => setBuiltInOnly(e.target.checked)}
              className="rounded bg-[#14161F] border-white/20 text-blue-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Show 100% Native Apple Tools Only</span>
          </label>
        </div>

        {/* Persona & Category Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
          {/* Persona Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#888888] font-medium mr-1">Role:</span>
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedPersona === p.id
                    ? 'bg-blue-500/25 text-blue-200 border border-blue-400/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                    : 'glass-pill text-[#888888] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#888888] font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg glass-input text-xs text-white focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#12141A] text-white">{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((wf) => {
          const isSaved = savedWorkflows.includes(wf.id);
          return (
            <div
              key={wf.id}
              onClick={() => onNavigate('workflow-detail', wf.id)}
              className="glass-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between cursor-pointer group relative border border-white/15 hover:border-blue-400/50 hover:shadow-[0_12px_35px_rgba(59,130,246,0.18)] transition-all"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-400/30">
                    {wf.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(e, wf.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-[#888888] hover:text-white transition-colors"
                      title={isSaved ? 'Remove bookmark' : 'Bookmark workflow'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-blue-400 fill-blue-400' : ''}`} />
                    </button>
                    <span className="text-[11px] text-[#888888] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-blue-400" />
                      {wf.setupTimeMinutes}m
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                  {wf.title}
                </h3>

                <p className="text-xs text-[#A3A3A3] line-clamp-3 leading-relaxed">
                  {wf.summary}
                </p>

                {/* Device Requirements */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block font-semibold">
                    Target Hardware
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {wf.devicesRequired.map((d, didx) => (
                      <span
                        key={didx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md glass-pill text-[#CCCCCC]"
                      >
                        {d.device.split('(')[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {wf.tags.slice(0, 3).map((tag, tidx) => (
                    <span key={tidx} className="text-[10px] text-[#666666]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#888888]">
                <span className="text-[11px] font-medium text-emerald-400/90">
                  {wf.steps.length} Verified Steps
                </span>
                <span className="text-white group-hover:text-blue-400 flex items-center gap-1 font-medium transition-colors">
                  Open Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-[#888888] glass-card rounded-2xl p-8">
          <p className="text-base font-semibold text-white">No workflows found</p>
          <p className="text-xs text-[#666666] mt-1">Try broadening your search term or unchecking filter constraints.</p>
        </div>
      )}
    </div>
  );
};
