import React, { useState } from 'react';
import {
  Home,
  LayoutGrid,
  Tag,
  Search,
  Sparkles,
  BookOpen,
  CheckSquare,
  Calendar,
  CalendarDays,
  Mail,
  FolderKanban,
  Target,
  Terminal,
  ShieldCheck,
  Calculator,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ToolFinderLogo } from './ToolFinderLogo.tsx';
import { Link } from '../../hooks/useRouter.tsx';

interface SidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
  className?: string;
}

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  count?: number;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All Tools', icon: LayoutGrid },
  { id: 'ai', label: 'AI Tools', icon: Sparkles, count: 24 },
  { id: 'writing', label: 'AI Note-Taking', icon: BookOpen, count: 8 },
  { id: 'productivity', label: 'AI To Do Lists', icon: CheckSquare, count: 6 },
  { id: 'study', label: 'AI Daily Planners', icon: Calendar, count: 5 },
  { id: 'apple', label: 'AI Calendar Apps', icon: CalendarDays, count: 7 },
  { id: 'work', label: 'AI Email Apps', icon: Mail, count: 6 },
  { id: 'developer', label: 'AI Project Management', icon: FolderKanban, count: 9 },
  { id: 'calculators', label: 'AI Focus Apps', icon: Target, count: 5 },
  { id: 'Developer', label: 'Developer & CLI', icon: Terminal, count: 12 },
  { id: 'Files', label: 'Privacy & Files', icon: ShieldCheck, count: 8 },
  { id: 'Calculators', label: 'Calculators', icon: Calculator, count: 9 },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  navigate,
  onOpenSearch,
  className = '',
}) => {
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  // Determine current active category from URL
  const selectedCategory = (() => {
    if (typeof window !== 'undefined' && currentPath.startsWith('/tools')) {
      const params = new URLSearchParams(window.location.search);
      return params.get('category') || (currentPath === '/tools' ? 'all' : '');
    }
    return '';
  })();

  const isHome = currentPath === '/';
  const isTools = currentPath.startsWith('/tools');
  const isDeals = currentPath.includes('deal=true') || currentPath === '/pricing';

  return (
    <aside
      className={`w-64 h-screen sticky top-0 bg-white border-r border-gray-200/80 flex flex-col justify-between shrink-0 select-none z-30 transition-all ${className}`}
      aria-label="Sidebar Navigation"
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-5 scrollbar-thin">
        {/* Brand Header */}
        <Link
          href="/"
          navigate={navigate}
          className="px-2 py-1 -ml-1 rounded-xl hover:bg-gray-50 transition-colors focus-ring inline-block"
          aria-label="SmartToolHub Home"
        >
          <ToolFinderLogo size="md" showSubtitle />
        </Link>

        {/* Search Input Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="mt-5 w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-400 hover:text-gray-700 transition-all text-xs focus-ring group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
            <span className="font-normal text-gray-500">Search tools...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-400 bg-white border border-gray-200 rounded shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Main Nav Items */}
        <nav className="mt-5 space-y-1" aria-label="Main Menu">
          <Link
            href="/"
            navigate={navigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isHome
                ? 'bg-purple-50 text-purple-700 font-semibold shadow-xs'
                : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
            }`}
          >
            <Home className={`w-4 h-4 ${isHome ? 'text-purple-700' : 'text-gray-400'}`} />
            <span>Home</span>
          </Link>

          <Link
            href="/tools"
            navigate={navigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isTools && (!selectedCategory || selectedCategory === 'all')
                ? 'bg-purple-50 text-purple-700 font-semibold shadow-xs'
                : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${isTools && (!selectedCategory || selectedCategory === 'all') ? 'text-purple-700' : 'text-gray-400'}`} />
            <span>All Tools</span>
            <span className="ml-auto text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-100/80 text-purple-700 font-semibold">
              55+
            </span>
          </Link>

          <Link
            href="/tools?deal=true"
            navigate={navigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isDeals
                ? 'bg-purple-50 text-purple-700 font-semibold shadow-xs'
                : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
            }`}
          >
            <Tag className={`w-4 h-4 ${isDeals ? 'text-purple-700' : 'text-gray-400'}`} />
            <span>Deals &amp; Free Tier</span>
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-wider">
              100% Free
            </span>
          </Link>
        </nav>

        {/* Categories Section */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-700 px-2 py-1 mb-2 focus-ring rounded"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              CATEGORIES
            </span>
            {categoriesOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {categoriesOpen && (
            <div className="space-y-0.5 max-h-[38vh] overflow-y-auto pr-1 scrollbar-thin">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isCatActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (cat.id === 'all') {
                        navigate('/tools');
                      } else {
                        navigate(`/tools?category=${encodeURIComponent(cat.id)}`);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                      isCatActive
                        ? 'bg-purple-50 text-purple-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isCatActive ? 'text-purple-700' : 'text-gray-400'
                        }`}
                      />
                      <span className="truncate">{cat.label}</span>
                    </div>
                    {cat.count && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Sponsored Card + Social Links */}
      <div className="p-4 border-t border-gray-200/80 bg-gray-50/50 space-y-3 shrink-0">
        {/* Sponsored Card */}
        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-xs hover:border-purple-200 transition-all group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
              FEATURED
            </span>
            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
              Top Pick
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
              ⚡
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                Apple Shortcuts Generator
              </h4>
              <p className="text-[11px] text-gray-500 truncate">
                AI iOS automation builder
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/tools/apple-shortcuts-generator')}
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-500 flex items-center justify-center transition-colors shrink-0"
              aria-label="Open Apple Shortcuts Generator"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Social Icons row */}
        <div className="flex items-center justify-between px-1 text-gray-400 pt-1">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-red-600 transition-colors p-1"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-600 transition-colors p-1"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-600 transition-colors p-1"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="hover:text-gray-900 transition-colors p-1"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
};
