import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { haptics } from '../utils/haptics';
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Wand2,
  Image,
  FileText,
  Globe,
  Calculator,
  Wrench,
  Cpu
} from 'lucide-react';

export type ToolCategoryFilter =
  | 'all'
  | 'shortcuts'
  | 'image'
  | 'text'
  | 'seo'
  | 'calculator'
  | 'diagnostics';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSearch: () => void;
  activeCategory?: ToolCategoryFilter;
  onSelectCategory?: (category: ToolCategoryFilter) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, toggleTheme } = useTheme();

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'generator', label: 'Generator' },
    { id: 'library', label: 'Workflows' },
    { id: 'troubleshooting', label: 'Diagnostics' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const toolCategories: {
    id: ToolCategoryFilter;
    label: string;
    desc: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'all',
      label: 'All Smart Tools',
      desc: 'Complete suite of Apple & web utilities',
      icon: Wand2,
    },
    {
      id: 'shortcuts',
      label: 'AI Shortcut Generator',
      desc: 'Synthesize Siri Shortcuts, AppleScript & Zsh',
      icon: Wand2,
    },
    {
      id: 'image',
      label: 'Image & Media Tools',
      desc: 'Retina scale, aspect ratio & sips batch optimizer',
      icon: Image,
    },
    {
      id: 'text',
      label: 'Text & Prompt Generators',
      desc: 'Prompt builder, token counter & text transformer',
      icon: FileText,
    },
    {
      id: 'seo',
      label: 'SEO & Schema Tools',
      desc: 'JSON-LD schema builder, OpenGraph & sitemap',
      icon: Globe,
    },
    {
      id: 'calculator',
      label: 'Silicon & ROI Calculators',
      desc: 'Apple Silicon memory bandwidth & automation ROI',
      icon: Calculator,
    },
    {
      id: 'diagnostics',
      label: 'Continuity & Sync Doctor',
      desc: 'AirDrop, Universal Clipboard & Mirroring fixes',
      icon: Wrench,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (page: PageId) => {
    haptics.playTap();
    onNavigate(page);
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
  };

  const handleCategoryPick = (catId: ToolCategoryFilter) => {
    haptics.playTap();
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('bento-tools-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      document.getElementById('bento-tools-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full h-16 ios-glass-nav transition-colors duration-200 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          id="nav-brand-button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl shrink-0 py-1 active:scale-[0.98] transition-transform"
          aria-label="SmartToolHub Home"
        >
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-900/10 dark:border-white/15 bg-slate-900/5 dark:bg-white/[0.06] flex items-center justify-center shrink-0 shadow-sm">
            <picture>
              <source srcSet="/logo-sm.webp" type="image/webp" />
              <img
                src="/logo.png"
                alt="SmartToolHub"
                width="28"
                height="28"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </picture>
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">
            SmartToolHub
          </span>
        </button>

        {/* Zone 2: Primary Navigation & Category Dropdown */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 text-[13px] font-medium"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNav(item.id)}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 rounded-full" />
                )}
              </button>
            );
          })}

          {/* Interactive Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                haptics.playTap();
                setCategoryDropdownOpen((prev) => !prev);
              }}
              aria-expanded={categoryDropdownOpen}
              className={`flex items-center gap-1.5 py-1 text-[13px] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md ${
                categoryDropdownOpen || activeCategory !== 'all'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  categoryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 p-2 rounded-2xl bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-2xl border border-slate-900/10 dark:border-white/10 shadow-2xl shadow-indigo-500/10 z-50">
                <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                  Tool Suites & Workbenches
                </div>
                <div className="space-y-0.5 mt-1">
                  {toolCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryPick(cat.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
                            : 'hover:bg-slate-900/5 dark:hover:bg-white/[0.05] text-slate-700 dark:text-zinc-200'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-900/5 dark:bg-white/[0.05] border border-slate-900/10 dark:border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {cat.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                            {cat.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Right Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Instant Command Search Trigger */}
          <button
            id="nav-search-button"
            type="button"
            onClick={() => {
              haptics.playTap();
              onOpenSearch();
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 min-h-[38px] rounded-xl bg-slate-900/[0.04] dark:bg-white/[0.04] hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.08] border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Search tools, shortcuts, and workflows (⌘K)"
            aria-label="Search tools and workflows"
          >
            <Search className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span className="hidden sm:inline text-xs">Search tools...</span>
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] rounded bg-slate-900/5 dark:bg-white/[0.06] border border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-zinc-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Quick Theme Toggle */}
          <button
            id="nav-theme-toggle"
            type="button"
            onClick={() => {
              haptics.playTap();
              toggleTheme();
            }}
            className="w-[38px] h-[38px] rounded-xl bg-slate-900/[0.04] dark:bg-white/[0.04] hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.08] border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Obsidian Dark'} mode`}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Primary Action CTA */}
          <button
            id="nav-generator-cta"
            type="button"
            onClick={() => handleNav('generator')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 min-h-[38px] rounded-xl bg-white text-slate-950 hover:bg-zinc-200 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200 font-semibold text-xs tracking-tight shadow-lg shadow-indigo-500/10 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Launch Generator</span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            id="nav-mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-[38px] h-[38px] rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-900/[0.04] dark:bg-white/[0.04] border border-slate-900/10 dark:border-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer (Positioned cleanly below header with zero button overlap) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50 border-b border-slate-900/10 dark:border-white/10 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-2xl px-4 py-4 space-y-4 shadow-2xl">
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
              Navigation
            </div>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-white bg-indigo-500/10 dark:bg-white/[0.08] font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-900/10 dark:border-white/10 space-y-1">
            <div className="px-3 py-1 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
              Tool Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {toolCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryPick(cat.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left bg-slate-900/[0.03] dark:bg-white/[0.03] hover:bg-slate-900/[0.06] dark:hover:bg-white/[0.07] border border-slate-900/5 dark:border-white/5 text-slate-700 dark:text-zinc-300 truncate"
                >
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleNav('generator')}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Launch AI Shortcut Generator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
