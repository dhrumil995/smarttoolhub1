import React, { useState } from 'react';
import { PageId } from '../types';
import { usePro } from '../context/ProContext';
import { 
  Wand2, 
  Cpu, 
  Wrench, 
  BookOpen, 
  Search, 
  Menu, 
  X, 
  ShieldCheck,
  Sparkles,
  Zap,
  Mail
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPro, togglePro } = usePro();

  const navItems: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Overview', icon: Sparkles },
    { id: 'generator', label: 'Generator', icon: Wand2 },
    { id: 'compatibility', label: 'Compatibility', icon: Cpu },
    { id: 'troubleshooting', label: 'Troubleshoot', icon: Wrench },
    { id: 'library', label: 'Workflows', icon: BookOpen },
    { id: 'pricing', label: 'Pricing', icon: ShieldCheck },
  ];

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      role="banner" 
      className="sticky top-0 z-50 w-full h-[52px] border-b border-white/[0.08] bg-black/80 backdrop-blur-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <button 
          id="nav-brand-button"
          onClick={() => handleNav('home')} 
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none shrink-0"
          aria-label="SmartToolHub Home"
        >
          <div className="w-7 h-7 rounded-[9px] overflow-hidden border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] bg-white/[0.06] group-hover:border-white/40 transition-all flex items-center justify-center shrink-0">
            <picture>
              <source srcSet="/logo-sm.webp" type="image/webp" />
              <img 
                src="/logo.png" 
                alt="SmartToolHub Logo" 
                width="28"
                height="28"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </picture>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-[15px] tracking-[-0.02em] text-[#F5F5F7] group-hover:text-white transition-colors">
              SmartToolHub
            </span>
            {isPro && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0071E3]/20 text-[#68B4FF] border border-[#0071E3]/30">
                PRO
              </span>
            )}
          </div>
        </button>

        {/* Desktop Navigation Links (Visible on lg screens: 1024px+) */}
        <nav 
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-1"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] tracking-[-0.01em] transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#F5F5F7] bg-white/[0.10] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.25)]'
                    : 'text-[#86868B] hover:text-[#F5F5F7] hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2997FF]' : 'text-[#86868B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search Button */}
          <button
            id="nav-search-button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] hover:border-white/20 text-[#86868B] hover:text-[#F5F5F7] text-xs tracking-[-0.01em] transition-all cursor-pointer"
            title="Search workflows, shortcuts, and errors (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#2997FF] shrink-0" />
            <span className="hidden sm:inline text-xs text-[#86868B]">Search</span>
            <kbd className="hidden sm:inline-flex apple-key text-[10px] py-0 px-1 ml-0.5">⌘K</kbd>
          </button>

          {/* Pro Mode Pill Toggle */}
          <button
            id="nav-plan-toggle"
            onClick={togglePro}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border shrink-0 ${
              isPro
                ? 'bg-[#0071E3]/20 border-[#0071E3]/40 text-[#68B4FF] hover:bg-[#0071E3]/30 shadow-[0_0_12px_rgba(0,113,227,0.25)]'
                : 'bg-white/[0.06] border-white/[0.12] text-[#86868B] hover:text-white hover:bg-white/[0.10]'
            }`}
            title="Toggle between Free and Pro mode to test AI synthesis features"
          >
            {isPro ? (
              <>
                <Sparkles className="w-3 h-3 text-[#2997FF] shrink-0" />
                <span className="hidden sm:inline">Pro Active</span>
                <span className="sm:hidden">PRO</span>
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Unlock Pro</span>
                <span className="sm:hidden">PRO</span>
              </>
            )}
          </button>

          {/* Generator Primary CTA (Apple Pill Style) */}
          <button
            id="nav-generator-cta"
            onClick={() => handleNav('generator')}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-normal tracking-[-0.01em] shadow-[0_2px_8px_rgba(0,113,227,0.35)] transition-all duration-200 hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <Wand2 className="w-3 h-3" />
            <span>Generate</span>
          </button>

          {/* Mobile Menu Toggle (Visible on < lg screens) */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full text-[#86868B] hover:text-white bg-white/[0.06] border border-white/[0.10] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Visible on < lg screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.10] bg-black/95 backdrop-blur-2xl px-4 py-3 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-normal tracking-[-0.01em] transition-all ${
                  isActive
                    ? 'text-white bg-white/[0.12] border border-white/[0.15]'
                    : 'text-[#86868B] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2997FF]' : 'text-[#86868B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-white/[0.08] space-y-2">
            <button
              onClick={() => handleNav('contact')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#86868B] hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-[#2997FF]" />
              <span>Contact & Support</span>
            </button>
            <a
              href="mailto:aslaliyamohit9@gmail.com"
              className="mx-1 px-3 py-2 rounded-xl bg-[#0071E3]/15 border border-[#0071E3]/25 text-xs text-[#68B4FF] flex items-center justify-between"
            >
              <span className="font-mono text-[11px]">aslaliyamohit9@gmail.com</span>
              <span className="text-[10px] text-[#2997FF] font-medium">Email Support →</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
