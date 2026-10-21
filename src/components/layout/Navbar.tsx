import React from 'react';
import { Search, Menu, Zap } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
}

const NAV_LINKS = [
  { label: 'Tools', href: '/tools' },
  { label: 'Guides', href: '/guides' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  onOpenSearch,
  onOpenMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050a14]/85 backdrop-blur-[18px] border-b border-[rgba(143,163,192,0.16)] safe-top">
      <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          href="/"
          navigate={navigate}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#f2f7ff] hover:text-white transition-colors whitespace-nowrap shrink-0 focus-ring rounded-lg p-1 -ml-1"
          aria-label="SmartToolHub Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0a1424] border border-[rgba(10,132,255,0.35)] flex items-center justify-center text-[#0a84ff] shadow-[0_0_12px_rgba(10,132,255,0.2)]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-display text-xl tracking-[-0.04em] text-[#f2f7ff]">
            SmartToolHub<span className="text-[#0a84ff]">.</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9aaccb]"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = currentPath === link.href || currentPath.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                navigate={navigate}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm focus-ring rounded-sm ${
                  isActive
                    ? 'text-[#f2f7ff] border-[#0a84ff] font-semibold'
                    : 'border-transparent hover:text-[#f2f7ff]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions (PWA Install + Search + Pro CTA + Mobile Menu) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* PWA In-App Install Trigger */}
          <PWAInstallButton />

          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 h-10 px-3 md:px-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-xs text-[#9aaccb] hover:text-[#f2f7ff] hover:border-[rgba(143,163,192,0.32)] transition-all focus-ring"
            aria-label="Search tools and guides"
          >
            <Search className="w-4 h-4 text-[#9aaccb]" />
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#101c33] text-[#9aaccb] rounded border border-[rgba(143,163,192,0.2)]">
              /
            </kbd>
          </button>

          {/* Desktop Pro Primary Button */}
          <Link
            href="/pricing"
            navigate={navigate}
            className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-xl bg-gradient-to-r from-[#0b6bf0] via-[#7a45f5] to-[#d6347f] text-white font-bold text-xs tracking-wide uppercase transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(10,132,255,0.35)] active:scale-[0.97] focus-ring"
          >
            Pro
          </Link>

          {/* Mobile Sheet Menu Toggle - 44x44px minimum tap target */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff] transition-colors focus-ring"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
