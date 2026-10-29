import React from 'react';
import { Search, Menu, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { ToolFinderLogo, SmartToolHubIcon } from './ToolFinderLogo.tsx';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  onOpenSearch,
  onOpenMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 safe-top">
      <div className="px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark (Visible across ALL screen sizes) */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            navigate={navigate}
            className="flex items-center gap-2.5 focus-ring rounded-xl py-1 px-1.5 -ml-1 hover:bg-gray-50 transition-colors"
            aria-label="SmartToolHub Home"
          >
            <SmartToolHubIcon size={32} />
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 leading-none">
              SmartToolHub<span className="text-[#0a84ff]">.</span>
            </span>
          </Link>

          {/* Desktop Breadcrumb indicator */}
          {currentPath !== '/' && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 font-medium ml-2 pl-3 border-l border-gray-200">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-700 font-semibold truncate max-w-xs">
                {currentPath === '/tools'
                  ? 'All Tools'
                  : currentPath.replace('/tools/', '').replace(/-/g, ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Center / Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-gray-500">
          <Link
            href="/tools"
            navigate={navigate}
            className={`transition-colors hover:text-purple-700 ${
              currentPath === '/tools' ? 'text-purple-700 font-bold' : ''
            }`}
          >
            All Tools
          </Link>
          <Link
            href="/tools?deal=true"
            navigate={navigate}
            className="transition-colors hover:text-purple-700"
          >
            Deals &amp; Free Tier
          </Link>
          <Link
            href="/pc-tools"
            navigate={navigate}
            className="transition-colors hover:text-purple-700"
          >
            PC Utilities
          </Link>
          <Link
            href="/guides"
            navigate={navigate}
            className="transition-colors hover:text-purple-700"
          >
            Guides
          </Link>
        </nav>

        {/* Actions (PWA + Search + Mobile Menu) */}
        <div className="flex items-center gap-2.5 ml-auto">
          <PWAInstallButton />

          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 h-10 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-gray-600 hover:text-gray-900 transition-all focus-ring touch-press"
            aria-label="Search tools"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline font-mono text-[10px] bg-white border border-gray-200 px-1 py-0.2 rounded text-gray-400">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Menu Drawer Trigger (Hidden on Desktop) */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="md:hidden w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:text-purple-700 hover:bg-gray-100 transition-all focus-ring touch-press shrink-0"
            aria-label="Open mobile menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
