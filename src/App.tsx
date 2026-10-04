import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageId } from './types';
import { Navbar, ToolCategoryFilter } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProProvider } from './context/ProContext';
import { ThemeProvider } from './context/ThemeContext';
import { SEOHead } from './components/SEOHead';
import { Breadcrumbs } from './components/Breadcrumbs';
import { haptics } from './utils/haptics';
import { WORKFLOWS_DATA } from './data/workflows';

// Lazy-load secondary pages and modals
const GeneratorPage = lazy(() => import('./pages/GeneratorPage').then(m => ({ default: m.GeneratorPage })));
const CompatibilityPage = lazy(() => import('./pages/CompatibilityPage').then(m => ({ default: m.CompatibilityPage })));
const TroubleshootingPage = lazy(() => import('./pages/TroubleshootingPage').then(m => ({ default: m.TroubleshootingPage })));
const LibraryPage = lazy(() => import('./pages/LibraryPage').then(m => ({ default: m.LibraryPage })));
const WorkflowDetailPage = lazy(() => import('./pages/WorkflowDetailPage').then(m => ({ default: m.WorkflowDetailPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const GuidesPage = lazy(() => import('./pages/GuidesPage').then(m => ({ default: m.GuidesPage })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then(m => ({ default: m.CommandPalette })));
const SitemapModal = lazy(() => import('./components/SitemapModal').then(m => ({ default: m.SitemapModal })));
const UserSettingsModal = lazy(() => import('./components/UserSettingsModal').then(m => ({ default: m.UserSettingsModal })));

const prefetchSecondaryRoutes = () => {
  const routes = [
    () => import('./pages/GeneratorPage'),
    () => import('./pages/CompatibilityPage'),
    () => import('./pages/TroubleshootingPage'),
    () => import('./pages/LibraryPage'),
    () => import('./pages/PricingPage'),
    () => import('./components/CommandPalette'),
    () => import('./components/UserSettingsModal'),
  ];
  routes.forEach((load) => {
    try {
      load();
    } catch (_) {}
  });
};

const PageLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
    <span className="text-xs text-zinc-400 font-mono">Loading workspace...</span>
  </div>
);

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-continuity-camera-desk-view');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<ToolCategoryFilter>('all');

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchSecondaryRoutes, { timeout: 1500 });
    } else {
      setTimeout(prefetchSecondaryRoutes, 1000);
    }
  }, []);

  useEffect(() => {
    const parseUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as PageId | null;
      const wfParam = params.get('workflow');
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');

      if (pathname.startsWith('workflows/')) {
        const slug = pathname.replace(/^workflows\//, '');
        const found = WORKFLOWS_DATA.find(w => w.slug === slug || w.id === slug);
        if (found) {
          setSelectedWorkflowId(found.id);
          setCurrentPage('workflow-detail');
          return;
        }
      }

      if (wfParam) {
        setSelectedWorkflowId(wfParam);
      }

      if (pageParam) {
        setCurrentPage(pageParam);
      } else if (pathname) {
        const validPages: PageId[] = [
          'home', 'generator', 'compatibility', 'troubleshooting', 
          'library', 'workflow-detail', 'pricing', 'privacy', 'terms', 'contact',
          'about', 'guides'
        ];
        if (validPages.includes(pathname as PageId)) {
          setCurrentPage(pathname as PageId);
        }
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  // Track SPA pageviews in Google Analytics (G-ZEGS3V0TTE)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        const pagePath = window.location.pathname + window.location.search;
        (window as any).gtag('config', 'G-ZEGS3V0TTE', {
          page_path: pagePath,
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    } catch (_) {}
  }, [currentPage, selectedWorkflowId]);

  const handleNavigate = (page: PageId, workflowId?: string, categoryParam?: string) => {
    haptics.playTap();
    if (workflowId) {
      setSelectedWorkflowId(workflowId);
    }
    setCurrentPage(page);

    try {
      const url = new URL(window.location.href);
      if (page === 'home') {
        url.pathname = '/';
        url.search = '';
      } else if (page === 'workflow-detail' && workflowId) {
        const found = WORKFLOWS_DATA.find(w => w.id === workflowId);
        if (found) {
          url.pathname = `/workflows/${found.slug}`;
          url.search = '';
        } else {
          url.searchParams.set('page', 'workflow-detail');
          url.searchParams.set('workflow', workflowId);
        }
      } else {
        url.pathname = `/${page}`;
        url.search = '';
        if (categoryParam) {
          url.searchParams.set('category', categoryParam);
        }
      }
      window.history.pushState({ page, workflowId }, '', url.toString());
    } catch (e) {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        haptics.playTap();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        haptics.playTap();
        setIsSettingsOpen((prev) => !prev);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            handleNavigate('home');
            break;
          case '2':
            e.preventDefault();
            handleNavigate('generator');
            break;
          case '3':
            e.preventDefault();
            handleNavigate('compatibility');
            break;
          case '4':
            e.preventDefault();
            handleNavigate('troubleshooting');
            break;
          case '5':
            e.preventDefault();
            handleNavigate('library');
            break;
          case '6':
            e.preventDefault();
            handleNavigate('pricing');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-[#F8FAFC] relative selection:bg-indigo-500 selection:text-white overflow-x-hidden transition-colors duration-200">
      {/* Dynamic Colorful Ambient Lighting Backdrops for Frosted Glassmorphism */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none" aria-hidden="true">
        {/* Violet / Indigo Aurora Core */}
        <div className="absolute -top-[12%] -left-[10%] w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-purple-500/10 blur-[130px] opacity-70 dark:opacity-80 transition-all duration-700" />
        
        {/* Electric Cyan / Sky Horizon Glow */}
        <div className="absolute top-[8%] -right-[12%] w-[620px] h-[620px] rounded-full bg-gradient-to-bl from-cyan-500/25 via-sky-600/15 to-blue-600/10 blur-[140px] opacity-60 dark:opacity-75 transition-all duration-700" />
        
        {/* Rose / Fuchsia Atmospheric Flare */}
        <div className="absolute top-[48%] -left-[15%] w-[580px] h-[580px] rounded-full bg-gradient-to-r from-rose-500/18 via-pink-600/15 to-purple-600/10 blur-[150px] opacity-50 dark:opacity-65 transition-all duration-700" />
        
        {/* Emerald / Mint Neural Node */}
        <div className="absolute top-[68%] -right-[10%] w-[560px] h-[560px] rounded-full bg-gradient-to-tl from-emerald-500/20 via-teal-500/15 to-cyan-600/10 blur-[140px] opacity-45 dark:opacity-60 transition-all duration-700" />
        
        {/* Amber / Sunset Ground Radiance */}
        <div className="absolute -bottom-[10%] left-[25%] w-[640px] h-[480px] rounded-full bg-gradient-to-t from-amber-500/15 via-indigo-600/10 to-transparent blur-[160px] opacity-40 dark:opacity-55 transition-all duration-700" />
        
        {/* Subtle Frosted Dot Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] opacity-70 dark:opacity-40" />
      </div>

      <SEOHead currentPage={currentPage} workflowId={selectedWorkflowId} />

      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <main className="flex-1 w-full relative">
        {currentPage !== 'home' && currentPage !== 'workflow-detail' && currentPage !== 'library' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-1">
            <Breadcrumbs
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
          </div>
        )}
        <Suspense fallback={<PageLoadingFallback />}>
          {currentPage === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenSearch={() => setIsSearchOpen(true)}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          )}
          {currentPage === 'generator' && (
            <GeneratorPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'compatibility' && (
            <CompatibilityPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'troubleshooting' && (
            <TroubleshootingPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'library' && (
            <LibraryPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'workflow-detail' && (
            <WorkflowDetailPage
              workflowId={selectedWorkflowId}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'pricing' && (
            <PricingPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'privacy' && (
            <PrivacyPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'terms' && (
            <TermsPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'contact' && (
            <ContactPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'about' && (
            <AboutPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'guides' && (
            <GuidesPage onNavigate={handleNavigate} />
          )}
        </Suspense>
      </main>

      {isSearchOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={handleNavigate}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </Suspense>
      )}

      {isSitemapOpen && (
        <Suspense fallback={null}>
          <SitemapModal
            isOpen={isSitemapOpen}
            onClose={() => setIsSitemapOpen(false)}
            onNavigate={handleNavigate}
          />
        </Suspense>
      )}

      {isSettingsOpen && (
        <Suspense fallback={null}>
          <UserSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </Suspense>
      )}

      <Footer
        onNavigate={handleNavigate}
        onOpenSitemap={() => setIsSitemapOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ProProvider>
        <AppContent />
      </ProProvider>
    </ThemeProvider>
  );
}

export default App;
