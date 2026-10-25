import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronRight, History, Zap } from 'lucide-react';
import { LAUNCH_TOOLS, TOOL_ICON_MAP } from '../../data/tools.ts';
import { SOFTWARE_APPS } from '../../data/softwareDirectory.ts';
import { COMPARISONS } from '../../data/comparisons.ts';
import { GUIDE_ARTICLES } from '../../data/guides.ts';
import { Icon } from '../ui/Icon.tsx';
import { EmptyState } from '../ui/EmptyState.tsx';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

interface SearchItem {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
  iconName?: string;
  badge?: string;
}

const RECENT_SEARCHES_KEY = 'smarttoolhub_recent_searches';

function highlightMatch(text: string, query: string): React.ReactNode {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return text;
  const index = text.toLowerCase().indexOf(trimmed);
  if (index === -1) return text;
  const before = text.slice(0, index);
  const match = text.slice(index, index + trimmed.length);
  const after = text.slice(index + trimmed.length);
  return (
    <>
      {before}
      <mark className="bg-[rgba(10,132,255,0.22)] text-[#5aa9ff] font-bold rounded-sm px-0.5">
        {match}
      </mark>
      {after}
    </>
  );
}

/**
 * Universal Search conforming to Phase 3:
 * - Search field with Search icon and clear (X) button
 * - Mobile: full-screen search sheet with recent searches and 6 popular tools
 * - Desktop: "/" keyboard trigger, Escape to close
 * - Results grouped by category across tools, software directory, and comparisons
 * - Matching text highlight
 * - Arrow keys (Up/Down) & Enter selection
 */
export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored).slice(0, 5));
        }
      } catch {
        // Fallback
      }
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Global keyboard shortcut '/' to open and 'Escape' to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !isOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 6 Popular Tools for Quick Launch
  const popularTools = useMemo(() => LAUNCH_TOOLS.slice(0, 6), []);

  // Complete searchable corpus across Tools, 50 Software Profiles, and Comparisons
  const allSearchableItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];

    // 1. Launch Tools
    for (const t of LAUNCH_TOOLS) {
      items.push({
        id: `tool-${t.id}`,
        name: t.name,
        description: t.description,
        category: `${t.category} Tools`,
        path: `/tools/${t.slug}`,
        iconName: TOOL_ICON_MAP[t.slug] || t.icon,
      });
    }

    // 2. Software Directory (50 Apps)
    for (const app of Object.values(SOFTWARE_APPS)) {
      const hub = app.platform === 'apple' ? 'apple-tools' : app.platform === 'android' ? 'android-tools' : 'pc-tools';
      items.push({
        id: `app-${app.slug}`,
        name: app.name,
        description: app.tagline,
        category: `${app.platformLabel} Software`,
        path: `/${hub}/${app.slug}`,
        iconName: app.platform === 'apple' ? 'Apple' : app.platform === 'android' ? 'Smartphone' : 'Laptop',
        badge: app.category,
      });
    }

    // 3. Comparisons
    for (const comp of Object.values(COMPARISONS)) {
      items.push({
        id: `comp-${comp.slug}`,
        name: comp.title,
        description: comp.subtitle,
        category: 'Software Comparisons',
        path: `/compare/${comp.slug}`,
        iconName: 'Scale',
        badge: `${comp.optionAName} vs ${comp.optionBName}`,
      });
    }

    // 4. How-To Guides
    for (const guide of Object.values(GUIDE_ARTICLES)) {
      items.push({
        id: `guide-${guide.slug}`,
        name: guide.title,
        description: guide.summary,
        category: 'How-To Guides',
        path: `/guides/${guide.slug}`,
        iconName: 'BookOpen',
        badge: guide.readTime,
      });
    }

    // 5. Hub Directories & Releases
    items.push({
      id: 'hub-pc',
      name: 'PC & Windows Software Directory',
      description: '20 verified Windows utilities with winget commands, drawbacks, and reviews.',
      category: 'Software Directory Hubs',
      path: '/pc-tools',
      iconName: 'Laptop',
      badge: '20 Apps',
    });
    items.push({
      id: 'hub-apple',
      name: 'Apple & Mac Software Directory',
      description: '10 verified macOS utilities with Homebrew cask commands and drawbacks.',
      category: 'Software Directory Hubs',
      path: '/apple-tools',
      iconName: 'Apple',
      badge: '10 Apps',
    });
    items.push({
      id: 'hub-android',
      name: 'Android Power Tools Directory',
      description: '20 verified Android tools for wireless debugging, automation, and Shizuku.',
      category: 'Software Directory Hubs',
      path: '/android-tools',
      iconName: 'Smartphone',
      badge: '20 Apps',
    });
    items.push({
      id: 'hub-changelog',
      name: 'Changelog & Platform Releases',
      description: 'Release history from v1.0 to v2.4 with RSS feed and version highlights.',
      category: 'Platform Updates',
      path: '/changelog',
      iconName: 'Sparkles',
      badge: 'What\'s New',
    });
    items.push({
      id: 'hub-saved',
      name: 'Saved Results & Bookmarked Tools',
      description: 'Locally saved calculations, script recipes, and software bookmarks.',
      category: 'Personal Toolkit',
      path: '/saved',
      iconName: 'History',
      badge: 'Offline',
    });

    return items;
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allSearchableItems.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  }, [query, allSearchableItems]);

  // Group filtered items by category
  const groupedResults = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    for (const item of filteredItems) {
      const cat = item.category;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return map;
  }, [filteredItems]);

  // Flat list of visible selectable items
  const flatSelectableList = filteredItems;

  const handleSelect = (path: string, termToSave?: string) => {
    if (termToSave && termToSave.trim().length > 1) {
      try {
        const updated = [termToSave.trim(), ...recentSearches.filter((s) => s !== termToSave.trim())].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Fallback
      }
    }
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (flatSelectableList.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatSelectableList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatSelectableList.length) % flatSelectableList.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = flatSelectableList[selectedIndex];
      if (chosen) {
        handleSelect(chosen.path, query);
      }
    }
  };

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      className="fixed inset-0 z-50 flex items-start justify-center p-0 md:p-4 pt-0 md:pt-20 bg-[#050a14]/90 backdrop-blur-[24px]"
      onClick={onClose}
    >
      <div
        className="w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl bg-[#0a1424] border-0 md:border border-[rgba(143,163,192,0.18)] rounded-none md:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col overflow-hidden safe-top safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar with Search Icon and Clear Button */}
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.18)] focus-within:border-[#0a84ff] focus-within:shadow-[0_0_12px_rgba(10,132,255,0.25)] transition-colors shrink-0">
          <Search size={18} className="text-[#9aaccb] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a tool name (e.g. shortcuts, email, formulas)..."
            className="flex-1 bg-transparent text-base sm:text-sm text-[#f2f7ff] placeholder-[#9aaccb] focus:outline-none"
            style={{ fontSize: '16px' }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="text-[#9aaccb] hover:text-[#f2f7ff] p-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus-ring rounded-lg"
              aria-label="Clear search input"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block font-mono text-[10px] text-[#9aaccb] px-2 py-0.5 rounded border border-[rgba(143,163,192,0.16)]">
                ESC
              </span>
              <button
                type="button"
                onClick={onClose}
                className="md:hidden text-sm font-medium text-[#9aaccb] hover:text-[#f2f7ff] min-h-[44px] px-2 flex items-center justify-center focus-ring rounded-lg"
                aria-label="Close search"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Body Container */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-1">
          {/* Query Active: Show Grouped Results */}
          {query.trim().length > 0 ? (
            filteredItems.length > 0 ? (
              <div className="space-y-5">
                {Array.from(groupedResults.entries()).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#5aa9ff] px-2 font-bold">
                      {category}
                    </div>
                    <div className="space-y-1.5">
                      {items.map((item) => {
                        const globalIndex = flatSelectableList.findIndex((t) => t.id === item.id);
                        const isKeyboardSelected = globalIndex === selectedIndex;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelect(item.path, query)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left group focus-ring select-none ${
                              isKeyboardSelected
                                ? 'bg-[#101c33] border-[#0a84ff] shadow-[0_0_16px_rgba(10,132,255,0.25)]'
                                : 'bg-[#050a14]/60 hover:bg-[#101c33] border-[rgba(143,163,192,0.12)] hover:border-[#0a84ff]/50'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0 pr-2">
                              <div className="w-9 h-9 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex items-center justify-center text-[#0a84ff] shrink-0">
                                <Icon name={item.iconName || 'Wand2'} size="sm" strokeWidth={1.75} aria-hidden={true} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-[#f2f7ff] truncate group-hover:text-[#5aa9ff] transition-colors">
                                    {highlightMatch(item.name, query)}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0a1424] text-[#9aaccb] border border-[rgba(143,163,192,0.14)] shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-[#9aaccb] truncate mt-0.5">
                                  {highlightMatch(item.description, query)}
                                </div>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-[#9aaccb] group-hover:text-[#5aa9ff] shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6">
                <EmptyState
                  icon="SearchX"
                  message="No tools match that. Try a shorter word."
                  actionLabel="Clear search"
                  onAction={() => setQuery('')}
                />
              </div>
            )
          ) : (
            /* Idle View: Recent Searches & 6 Popular Tools */
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#9aaccb] font-semibold flex items-center gap-1.5">
                      <History size={13} className="text-[#0a84ff]" aria-hidden="true" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[11px] text-[#9aaccb] hover:text-[#ff5c7a] transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.16)] text-xs text-[#f2f7ff] hover:border-[#0a84ff] hover:text-[#5aa9ff] transition-colors inline-flex items-center gap-1.5 focus-ring"
                      >
                        <Search size={12} className="text-[#9aaccb]" aria-hidden="true" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6 Popular Tools */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9aaccb] font-semibold flex items-center gap-1.5 px-1">
                  <Zap size={13} className="text-[#ffb840]" aria-hidden="true" />
                  <span>Popular Tools</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {popularTools.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleSelect(`/tools/${tool.slug}`)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#050a14]/60 hover:bg-[#101c33] border border-[rgba(143,163,192,0.12)] hover:border-[#0a84ff]/50 transition-all text-left group focus-ring"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex items-center justify-center text-[#0a84ff] shrink-0">
                          <Icon name={TOOL_ICON_MAP[tool.slug] || tool.icon} size="sm" strokeWidth={1.75} aria-hidden={true} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#f2f7ff] truncate group-hover:text-[#5aa9ff] transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-[11px] font-mono text-[#9aaccb] uppercase">
                            {tool.category}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[#9aaccb] group-hover:text-[#5aa9ff] shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & shortcut cues */}
        <div className="mt-4 pt-3 border-t border-[rgba(143,163,192,0.12)] flex items-center justify-between text-[11px] font-mono text-[#9aaccb] shrink-0">
          <div className="hidden sm:flex items-center gap-4">
            <span>&uarr;&darr; to navigate</span>
            <span>&crarr; to select</span>
            <span>ESC to close</span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigate('/tools');
              onClose();
            }}
            className="hover:text-[#7db8ff] text-[#7db8ff] hover:underline transition-colors ml-auto text-xs font-semibold"
          >
            Explore all {LAUNCH_TOOLS.length} tools &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
