import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageId } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProProvider } from './context/ProContext';
import { SEOHead } from './components/SEOHead';

// Lazy-load secondary pages and modals to shrink critical landing bundle size
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

// Lightweight Apple-style route fallback loader
const PageLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4 animate-in fade-in duration-200">
    <div className="w-8 h-8 rounded-full border-2 border-[#2997FF]/20 border-t-[#2997FF] animate-spin" />
    <span className="text-xs text-[#86868B] font-mono tracking-wider uppercase">Loading module...</span>
  </div>
);

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-continuity-camera-desk-view');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Initialize page from URL query params or pathname on load
  useEffect(() => {
    const parseUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as PageId | null;
      const wfParam = params.get('workflow');
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');

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

    const handlePopState = () => {
      parseUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top and synchronize URL when page changes
  const handleNavigate = (page: PageId, workflowId?: string) => {
    if (workflowId) {
      setSelectedWorkflowId(workflowId);
    }
    setCurrentPage(page);

    try {
      const url = new URL(window.location.href);
      if (page === 'home') {
        url.search = '';
      } else if (page === 'workflow-detail' && workflowId) {
        url.searchParams.set('page', 'workflow-detail');
        url.searchParams.set('workflow', workflowId);
      } else {
        url.searchParams.set('page', page);
        url.searchParams.delete('workflow');
      }
      window.history.pushState({ page, workflowId }, '', url.toString());
    } catch (e) {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for global Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#07080A] text-[#E5E5E5] relative selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Dynamic SEO Meta Tags & JSON-LD Structured Data */}
      <SEOHead currentPage={currentPage} workflowId={selectedWorkflowId} />

      {/* Ambient Lighting Orbs for Glassy UI Refraction */}
      <div className="glass-ambient-orbs">
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
        <div className="ambient-orb-3" />
      </div>

      {/* Top Navigation */}
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onOpenSearch={() => setIsSearchOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        <Suspense fallback={<PageLoadingFallback />}>
          {currentPage === 'home' && (
            <HomePage 
              onNavigate={handleNavigate} 
              onOpenSearch={() => setIsSearchOpen(true)} 
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

      {/* Global Command Palette / Search Modal (Loaded on-demand) */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onNavigate={handleNavigate}
          />
        </Suspense>
      )}

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export function App() {
  return (
    <ProProvider>
      <AppContent />
    </ProProvider>
  );
}

export default App;

