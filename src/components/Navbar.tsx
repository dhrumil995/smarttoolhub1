import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { haptics } from '../utils/haptics';
import { useHaptics } from '../utils/useHaptics';
const websiteLogo = '/logo.svg';
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
      label: 'All Tools',
      desc: 'Helpful utilities for iPhone, iPad, and Mac',
      icon: Wand2,
    },
    {
      id: 'shortcuts',
      label: 'Shortcut Generator',
      desc: 'Create Siri Shortcuts in everyday English',
      icon: Wand2,
    },
    {
      id: 'image',
      label: 'Image & Media Tools',
      desc: 'Resize photos, calculate ratios, and optimize files',
      icon: Image,
    },
    {
      id: 'text',
      label: 'Text & Prompt Tools',
      desc: 'Word counter, text formatter, and prompt ideas',
      icon: FileText,
    },
    {
      id: 'seo',
      label: 'SEO & Meta Tools',
      desc: 'Meta tag generator, social previews, and sitemaps',
      icon: Globe,
    },
    {
      id: 'calculator',
      label: 'Speed & Time Calculators',
      desc: 'Fast charging curves and file transfer estimates',
      icon: Calculator,
    },
    {
      id: 'diagnostics',
      label: 'Device Connection Guide',
      desc: 'Fix AirDrop, Universal Clipboard, and Mirroring',
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark & Luxury 3D Emblem */}
        <a
          id="nav-brand-button"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--laser)] rounded-xl shrink-0 py-1 active:scale-[0.98] transition-transform min-w-0"
          aria-label="SmartToolHub Home"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/15 bg-[#050713] flex items-center justify-center shrink-0 shadow-[0_2px_12px_rgba(57,255,136,0.18)] group-hover:border-[var(--laser)]/60 group-hover:shadow-[0_0_16px_var(--laser-glow)] transition-all">
            <img
              src={websiteLogo}
              alt="SmartToolHub Logo"
              width="32"
              height="32"
              decoding="async"
              className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-[15px] sm:text-base leading-none tracking-tight text-[var(--ink)] group-hover:text-[var(--laser)] transition-colors whitespace-nowrap">
              SmartToolHub
            </span>
            <span className="text-[10px] sm:text-[11px] text-[var(--mute)] mt-0.5 hidden sm:inline truncate">
              Apple Automation Tools
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
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--laser)] rounded-md ${
                  isActive
                    ? 'text-[var(--laser)] font-semibold'
                    : 'text-[var(--mute)] hover:text-[var(--ink)]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-[var(--laser)] shadow-[0_0_8px_var(--laser-glow)] rounded-full" />
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
              className={`flex items-center gap-1.5 py-1 text-[13px] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--laser)] rounded-md ${
                categoryDropdownOpen || activeCategory !== 'all'
                  ? 'text-[var(--laser)] font-semibold'
                  : 'text-[var(--mute)] hover:text-[var(--ink)]'
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
              <div className="absolute top-full right-0 mt-3 w-80 p-2 rounded-2xl bg-[#0a1424]/95 backdrop-blur-2xl border border-[var(--line)] shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-50">
                <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--mute)] border-b border-[var(--line)] pb-2">
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
                            ? 'bg-[var(--laser)]/10 border-[var(--laser)]/35 text-[var(--laser)]'
                            : 'border-transparent hover:border-[var(--line)] hover:bg-white/[0.04] text-[var(--ink)]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-[var(--line)] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-[var(--laser)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-[var(--ink)] truncate">
                            {cat.label}
                          </div>
                          <div className="text-[11px] text-[var(--mute)] truncate mt-0.5">
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Instant Command Search Trigger */}
          <button
            id="nav-search-button"
            type="button"
            onClick={() => {
              haptics.playTap();
              onOpenSearch();
            }}
            className="flex items-center justify-center gap-2 w-9 h-9 sm:w-auto sm:h-9 px-0 sm:px-3 rounded-xl bg-[rgba(16,28,51,0.65)] hover:bg-[rgba(16,28,51,0.95)] border border-[var(--line)] hover:border-[var(--laser)]/40 text-[var(--mute)] hover:text-[var(--ink)] text-xs cursor-pointer whitespace-nowrap shrink-0 transition-all active:scale-95"
            title="Search tools, shortcuts, and workflows (⌘K)"
            aria-label="Search tools and workflows"
          >
            <Search className="w-4 h-4 text-[var(--laser)] shrink-0" />
            <span className="hidden sm:inline text-xs font-medium">Search</span>
            <kbd className="hidden md:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[var(--mute)]">
              ⌘K
            </kbd>
          </button>

          {/* Quick Theme Toggle (Kept in DOM with id for test suites, hidden on narrow mobile) */}
          <button
            id="nav-theme-toggle"
            type="button"
            onClick={() => {
              haptics.playTap();
              toggleTheme();
            }}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-[rgba(16,28,51,0.65)] hover:bg-[rgba(16,28,51,0.95)] border border-[var(--line)] hover:border-[var(--laser)]/40 text-[var(--mute)] hover:text-[var(--ink)] items-center justify-center cursor-pointer shrink-0 transition-all active:scale-95"
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-[var(--laser)]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
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
            className="relative flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:h-9 px-0 sm:px-2.5 rounded-xl bg-[rgba(16,28,51,0.65)] hover:bg-[rgba(16,28,51,0.95)] border border-[var(--line)] hover:border-[var(--laser)]/40 text-[var(--mute)] hover:text-[var(--ink)] text-xs cursor-pointer shrink-0 transition-all active:scale-95"
            title={`Haptics: ${intensity.toUpperCase()} · User Profile & Settings`}
            aria-label="User Profile and Haptic Feedback Settings"
          >
            <Sliders className="w-4 h-4 text-[var(--laser)] shrink-0" />
            <span className="hidden xl:inline text-xs font-medium">Settings</span>
            {/* Mobile indicator dot */}
            <span
              className={`sm:hidden absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                intensity === 'high'
                  ? 'bg-[var(--laser)] shadow-[0_0_6px_var(--laser)]'
                  : intensity === 'low'
                  ? 'bg-cyan-400 shadow-[0_0_6px_#22D3EE]'
                  : 'bg-slate-500'
              }`}
            />
            {/* Desktop badge */}
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full font-semibold transition-all ${
                intensity === 'high'
                  ? 'bg-[var(--laser)]/15 text-[var(--laser)] border border-[var(--laser)]/30'
                  : intensity === 'low'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  intensity === 'high'
                    ? 'bg-[var(--laser)] shadow-[0_0_6px_var(--laser)]'
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
            className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 h-9 px-3 sm:px-4 rounded-xl bg-[var(--laser)] hover:bg-[var(--laser-dim)] text-[#050a14] font-bold text-xs tracking-tight shadow-[0_4px_14px_rgba(57,255,136,0.3)] transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#050a14] shrink-0" />
            <span className="hidden md:inline">Launch Generator</span>
            <span className="md:hidden">Generator</span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            id="nav-mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-[rgba(16,28,51,0.65)] hover:bg-[rgba(16,28,51,0.95)] border border-[var(--line)] hover:border-[var(--laser)]/40 text-[var(--ink)] flex items-center justify-center cursor-pointer shrink-0 transition-all active:scale-95"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[var(--laser)]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer (Positioned cleanly below header with zero button overlap) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50 border-b border-[var(--line)] bg-[#0a1424]/98 backdrop-blur-2xl px-4 py-4 space-y-4 shadow-[0_24px_60px_rgba(0,0,0,0.85)] max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--mute)]">
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
                      ? 'text-[var(--laser)] bg-[var(--laser)]/10 border border-[var(--laser)]/30 font-semibold'
                      : 'text-[var(--mute)] hover:text-[var(--ink)] hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--laser)] shadow-[0_0_6px_var(--laser)]" />}
                </a>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[var(--line)] space-y-1">
            <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--mute)]">
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
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left bg-white/[0.03] hover:bg-white/[0.07] border border-[var(--line)] hover:border-[var(--laser)]/30 text-[var(--mute)] hover:text-[var(--ink)] truncate"
                  >
                    <span className="truncate">{cat.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Persistent Haptics & Sensory Feedback Setting in Mobile Drawer */}
          <div className="pt-3 border-t border-[var(--line)] space-y-2">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ink)]">
                <Sliders className="w-3.5 h-3.5 text-[var(--laser)]" />
                <span>Haptic Feedback</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings?.();
                }}
                className="text-[11px] text-[var(--laser)] font-semibold hover:underline cursor-pointer"
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
                        ? 'bg-[var(--laser)] text-[#050a14] shadow-[0_0_12px_var(--laser-glow)] font-bold'
                        : level === 'low'
                        ? 'bg-cyan-400 text-[#050a14] shadow-md shadow-cyan-500/30 font-bold'
                        : 'bg-slate-700 text-white shadow-md'
                      : 'bg-white/[0.04] text-[var(--mute)] hover:text-[var(--ink)] hover:bg-white/[0.08]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      level === 'high'
                        ? 'bg-[#050a14]'
                        : level === 'low'
                        ? 'bg-[#050a14]'
                        : 'bg-slate-400'
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
              className="w-full h-11 rounded-xl bg-[var(--laser)] hover:bg-[var(--laser-dim)] text-[#050a14] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(57,255,136,0.35)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-[#050a14]" />
              <span>Launch AI Shortcut Generator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
