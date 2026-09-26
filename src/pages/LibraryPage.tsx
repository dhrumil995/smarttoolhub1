import React, { useState } from 'react';
import { PageId } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import {
  Search,
  Clock,
  ArrowRight,
  Bookmark,
  X
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
    } catch {}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          Curated Ecosystem Repository
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-metallic tracking-tight leading-tight">
          Verified Apple Workflow Library
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
          Explore complete production blueprints with tested hardware setups, keyboard shortcut cheat-sheets, and step-by-step actions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="ios-card-static p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Main Search Input */}
          <div className="relative w-full md:w-96 flex items-center">
            <Search className="w-4 h-4 text-indigo-500 dark:text-indigo-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, app name, or workflow..."
              aria-label="Search by keyword, app name, or workflow"
              className="w-full pl-10 pr-8 py-2.5 rounded-xl glass-input text-xs focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Native Tools Only Filter */}
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300 cursor-pointer shrink-0 select-none">
            <input
              type="checkbox"
              checked={builtInOnly}
              onChange={(e) => setBuiltInOnly(e.target.checked)}
              className="rounded accent-indigo-500"
            />
            <span>Show 100% Native Apple Tools Only</span>
          </label>
        </div>

        {/* Persona & Category Tabs */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 border-t border-slate-900/10 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium mr-1">
              Role:
            </span>
            {personas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPersona(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedPersona === p.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'glass-pill text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0B0F19] text-white">
                  {c === 'all' ? 'All Categories' : c}
                </option>
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
              className="bento-card p-6 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3.5">
                {/* Unboxed metadata row */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      {wf.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums shrink-0">{wf.setupTimeMinutes}m</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(e, wf.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
                    title={isSaved ? 'Remove bookmark' : 'Bookmark workflow'}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        isSaved ? 'text-indigo-400 fill-indigo-400' : ''
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {wf.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {wf.summary}
                </p>

                <div className="pt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                  <span className="font-medium text-slate-700 dark:text-zinc-300">Hardware: </span>
                  <span>
                    {wf.devicesRequired.map((d) => d.device.split('(')[0].trim()).join(' · ')}
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-900/5 dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-zinc-400">
                  {wf.steps.length} verified steps
                </span>
                <span className="text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1 font-semibold transition-colors">
                  <span>Open Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center ios-card-static p-8 space-y-3">
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            No workflows match your current filter
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Try clearing your search query or selecting All Categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedPersona('all');
              setSelectedCategory('all');
              setBuiltInOnly(false);
            }}
            className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
