import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { haptics } from '../utils/haptics';
import { useHaptics } from '../utils/useHaptics';
import luxuryLogoImg from '../assets/images/smarttoolhub_luxury_logo_1790827199493.jpg';
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
  Cpu,
  Sliders,
  Volume2
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
  onOpenSettings?: () => void;
  activeCategory?: ToolCategoryFilter;
  onSelectCategory?: (category: ToolCategoryFilter) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenSettings,
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, toggleTheme } = useTheme();
  const { intensity, setIntensity } = useHaptics();

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'generator', label: 'Generator' },
    { id: 'library', label: 'Workflows' },
    { id: 'guides', label: 'Guides' },
    { id: 'troubleshooting', label: 'Diagnostics' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'about', label: 'About' },
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
        {/* Zone 1: Brand Wordmark & Luxury 3D Emblem */}
        <a
          id="nav-brand-button"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="flex items-center gap-3 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl shrink-0 py-1 active:scale-[0.98] transition-transform"
          aria-label="SmartToolHub Home"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-slate-300 dark:border-white/25 bg-[#030712] flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(99,102,241,0.28),inset_0_1px_0_0_rgba(255,255,255,0.28)] group-hover:border-indigo-400/70 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.45)] transition-all">
            <img
              src={luxuryLogoImg}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/logo.png')) {
                  target.src = '/images/smarttoolhub_luxury_logo_1790827199493.jpg';
                }
              }}
              alt="SmartToolHub Emblem"
              width="32"
              height="32"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-none tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">
              SmartToolHub
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 dark:text-zinc-500 mt-0.5 hidden sm:inline">
              Apple Studio Suite
            </span>
          </div>
        </a>

        {/* Zone 2: Primary Navigation & Category Dropdown */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 text-[13px] font-medium"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const itemHref = item.id === 'home' ? '/' : `/${item.id}`;
            return (
              <a
                key={item.id}
                id={`nav-link-${item.id}`}
                href={itemHref}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.id);
                }}
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
              </a>
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
              <div className="absolute top-full right-0 mt-3 w-80 p-2 rounded-2xl bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-2xl border border-slate-300/80 dark:border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.16)] z-50">
                <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500 border-b border-slate-200/80 dark:border-white/10 pb-2">
                  Tool Suites & Workbenches
                </div>
                <div className="space-y-1 mt-1.5">
                  {toolCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = activeCategory === cat.id;
                    const catHref = cat.id === 'all' ? '/' : cat.id === 'shortcuts' ? '/generator' : cat.id === 'diagnostics' ? '/troubleshooting' : `/?category=${cat.id}`;
                    return (
                      <a
                        key={cat.id}
                        href={catHref}
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryPick(cat.id);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-600 dark:text-indigo-300'
                            : 'border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-900/5 dark:hover:bg-white/[0.05] text-slate-700 dark:text-zinc-200'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-900/5 dark:bg-white/[0.05] border border-slate-300/80 dark:border-white/15 flex items-center justify-center shrink-0 mt-0.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
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
                      </a>
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
            className="flex items-center gap-2.5 px-3 py-1.5 min-h-[38px] rounded-xl glass-pill text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer whitespace-nowrap shrink-0"
            title="Search tools, shortcuts, and workflows (⌘K)"
            aria-label="Search tools and workflows"
          >
            <Search className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span className="hidden sm:inline text-xs">Search tools...</span>
            <kbd className="hidden sm:inline-flex apple-key text-[10px]">
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
            className="w-[38px] h-[38px] rounded-xl glass-pill text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer shrink-0"
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Obsidian Dark'} mode`}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* User Profile & Persistent Haptics Settings Trigger */}
          <button
            id="nav-settings-button"
            type="button"
            onClick={() => {
              haptics.playTap();
              onOpenSettings?.();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[38px] rounded-xl glass-pill text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer shrink-0 transition-all hover:border-indigo-400/40"
            title={`Haptics: ${intensity.toUpperCase()} · User Profile & Settings`}
            aria-label="User Profile and Haptic Feedback Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span className="hidden xl:inline text-xs font-medium">Settings</span>
            <span
              className={`flex items-center gap-1 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full font-semibold transition-all ${
                intensity === 'high'
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30'
                  : intensity === 'low'
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-400/20 text-slate-500 dark:text-zinc-400 border border-slate-400/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  intensity === 'high'
                    ? 'bg-indigo-400 shadow-[0_0_6px_#818CF8]'
                    : intensity === 'low'
                    ? 'bg-cyan-400 shadow-[0_0_6px_#22D3EE]'
                    : 'bg-slate-400'
                }`}
              />
              <span>{intensity}</span>
            </span>
          </button>

          {/* Primary Action CTA */}
          <button
            id="nav-generator-cta"
            type="button"
            onClick={() => handleNav('generator')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 min-h-[38px] rounded-xl glass-button-primary text-white font-semibold text-xs tracking-tight shadow-[0_6px_20px_rgba(99,102,241,0.35)] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Launch Generator</span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            id="nav-mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-[38px] h-[38px] rounded-xl glass-pill text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer shrink-0"
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
              const itemHref = item.id === 'home' ? '/' : `/${item.id}`;
              return (
                <a
                  key={item.id}
                  href={itemHref}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-white bg-indigo-500/10 dark:bg-white/[0.08] font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </a>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-900/10 dark:border-white/10 space-y-1">
            <div className="px-3 py-1 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
              Tool Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {toolCategories.map((cat) => {
                const catHref = cat.id === 'all' ? '/' : cat.id === 'shortcuts' ? '/generator' : cat.id === 'diagnostics' ? '/troubleshooting' : `/?category=${cat.id}`;
                return (
                  <a
                    key={cat.id}
                    href={catHref}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryPick(cat.id);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left bg-slate-900/[0.03] dark:bg-white/[0.03] hover:bg-slate-900/[0.06] dark:hover:bg-white/[0.07] border border-slate-900/5 dark:border-white/5 text-slate-700 dark:text-zinc-300 truncate"
                  >
                    <span className="truncate">{cat.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Persistent Haptics & Sensory Feedback Setting in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-900/10 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>Haptic Feedback</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings?.();
                }}
                className="text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                Profile & Settings
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['high', 'low', 'off'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setIntensity(level)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    intensity === level
                      ? level === 'high'
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                        : level === 'low'
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-slate-600 text-white shadow-md'
                      : 'bg-slate-900/[0.04] dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      level === 'high'
                        ? 'bg-indigo-300'
                        : level === 'low'
                        ? 'bg-cyan-300'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span>{level}</span>
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
