import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageId } from './types';
import { Navbar, ToolCategoryFilter } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProProvider } from './context/ProContext';
import { ThemeProvider } from './context/ThemeContext';
import { SEOHead } from './components/SEOHead';
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
const CommandPalette = lazy(() => import('./components/CommandPalette').then(m => ({ default: m.CommandPalette })));
const SitemapModal = lazy(() => import('./components/SitemapModal').then(m => ({ default: m.SitemapModal })));

const prefetchSecondaryRoutes = () => {
  const routes = [
    () => import('./pages/GeneratorPage'),
    () => import('./pages/CompatibilityPage'),
    () => import('./pages/TroubleshootingPage'),
    () => import('./pages/LibraryPage'),
    () => import('./pages/PricingPage'),
    () => import('./components/CommandPalette'),
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
          'library', 'workflow-detail', 'pricing', 'privacy', 'terms', 'contact'
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

  const handleNavigate = (page: PageId, workflowId?: string) => {
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
      <SEOHead currentPage={currentPage} workflowId={selectedWorkflowId} />

      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <main className="flex-1 w-full relative">
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
        </Suspense>
      </main>

      {isSearchOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={handleNavigate}
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

      <Footer
        onNavigate={handleNavigate}
        onOpenSitemap={() => setIsSitemapOpen(true)}
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
