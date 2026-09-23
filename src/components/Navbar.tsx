import React, { useState } from 'react';
import { PageId } from '../types';
import { usePro } from '../context/ProContext';
import { haptics } from '../utils/haptics';
import { 
  Search, 
  Menu, 
  X, 
  Volume2, 
  VolumeX,
  Wand2
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(haptics.isEnabled());
  const { isPro } = usePro();

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'generator', label: 'Generator' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'troubleshooting', label: 'Troubleshoot' },
    { id: 'library', label: 'Workflows' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const handleNav = (page: PageId) => {
    haptics.playTap();
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      role="banner" 
      className="sticky top-0 z-50 w-full h-[52px] border-b border-white/[0.08] bg-[#07080A]/85 backdrop-blur-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">
        
        {/* Zone 1: Pure Brand Wordmark */}
        <button 
          id="nav-brand-button"
          onClick={() => handleNav('home')} 
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none shrink-0"
          aria-label="SmartToolHub Home"
        >
          <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/20 bg-white/[0.06] flex items-center justify-center shrink-0">
            <picture>
              <source srcSet="/logo-sm.webp" type="image/webp" />
              <img 
                src="/logo.png" 
                alt="SmartToolHub Logo" 
                width="24"
                height="24"
                className="w-full h-full object-cover" 
              />
            </picture>
          </div>
          <span className="font-semibold text-sm sm:text-[15px] tracking-tight text-[#F5F5F7] group-hover:text-white transition-colors">
            SmartToolHub
          </span>
        </button>

        {/* Zone 2: Clean Typography Navigation Links */}
        <nav 
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-[13px] tracking-[-0.01em]"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNav(item.id)}
                className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-[#86868B] hover:text-[#F5F5F7]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-[#2997FF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Functional Interactive Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Button */}
          <button
            id="nav-search-button"
            onClick={() => {
              haptics.playTap();
              onOpenSearch();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/15 text-[#86868B] hover:text-[#F5F5F7] text-xs transition-all cursor-pointer"
            title="Search shortcuts, workflows, errors (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#2997FF] shrink-0" />
            <span className="hidden sm:inline text-xs text-[#86868B]">Search</span>
            <kbd className="hidden sm:inline-flex text-[10px] text-zinc-400 font-mono">⌘K</kbd>
          </button>

          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle"
            onClick={() => {
              const next = haptics.toggle();
              setSoundEnabled(next);
            }}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-[#86868B] hover:text-white transition-all cursor-pointer"
            title={soundEnabled ? "Audio feedback: ON" : "Audio feedback: MUTED"}
            aria-label="Toggle haptic sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#2997FF]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            id="nav-generator-cta"
            onClick={() => handleNav('generator')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium tracking-tight shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Wand2 className="w-3 h-3" />
            <span>Generate Flow</span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#86868B] hover:text-white bg-white/[0.05] border border-white/[0.08] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.10] bg-[#0A0A0C]/95 backdrop-blur-2xl px-4 py-3 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs tracking-tight transition-all ${
                  isActive
                    ? 'text-white bg-white/[0.08] font-medium'
                    : 'text-[#86868B] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2997FF]" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
