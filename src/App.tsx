import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from './hooks/useRouter.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { BottomTabBar } from './components/layout/BottomTabBar.tsx';
import { MobileMenuDrawer } from './components/layout/MobileMenuDrawer.tsx';
import { SearchModal } from './components/layout/SearchModal.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { ScrollProgress } from './components/layout/ScrollProgress.tsx';
import { MetaManager } from './components/seo/MetaManager.tsx';
import { OfflineIndicator } from './components/layout/OfflineIndicator.tsx';
import { ToastProvider } from './components/ui/Toast.tsx';
import { ScrollToTop } from './components/ui/ScrollToTop.tsx';

// Eager load HomePage for instantaneous First Contentful Paint
import { HomePage } from './pages/HomePage.tsx';

// Code-split route chunks with React.lazy
const ToolsHubPage = lazy(() => import('./pages/ToolsHubPage.tsx').then(m => ({ default: m.ToolsHubPage })));
const SavedResultsPage = lazy(() => import('./pages/SavedResultsPage.tsx').then(m => ({ default: m.SavedResultsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage.tsx').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage.tsx').then(m => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.tsx').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage.tsx').then(m => ({ default: m.TermsPage })));
const PricingPage = lazy(() => import('./pages/PricingPage.tsx').then(m => ({ default: m.PricingPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx').then(m => ({ default: m.NotFoundPage })));

// Guide Pages
const GuidesHubPage = lazy(() => import('./pages/guides/GuidesHubPage.tsx').then(m => ({ default: m.GuidesHubPage })));
const GuideDetailPage = lazy(() => import('./pages/guides/GuideDetailPage.tsx').then(m => ({ default: m.GuideDetailPage })));

// Tool Pages
const AppleShortcutsPage = lazy(() => import('./pages/tools/AppleShortcutsPage.tsx').then(m => ({ default: m.AppleShortcutsPage })));
const PromptImproverPage = lazy(() => import('./pages/tools/PromptImproverPage.tsx').then(m => ({ default: m.PromptImproverPage })));
const EmailWriterPage = lazy(() => import('./pages/tools/EmailWriterPage.tsx').then(m => ({ default: m.EmailWriterPage })));
const SummarizerPage = lazy(() => import('./pages/tools/SummarizerPage.tsx').then(m => ({ default: m.SummarizerPage })));
const CaptionHashtagPage = lazy(() => import('./pages/tools/CaptionHashtagPage.tsx').then(m => ({ default: m.CaptionHashtagPage })));
const BioGeneratorPage = lazy(() => import('./pages/tools/BioGeneratorPage.tsx').then(m => ({ default: m.BioGeneratorPage })));
const TitleHeadlinePage = lazy(() => import('./pages/tools/TitleHeadlinePage.tsx').then(m => ({ default: m.TitleHeadlinePage })));
const RewriteTonePage = lazy(() => import('./pages/tools/RewriteTonePage.tsx').then(m => ({ default: m.RewriteTonePage })));
const FormulaHelperPage = lazy(() => import('./pages/tools/FormulaHelperPage.tsx').then(m => ({ default: m.FormulaHelperPage })));
const MeetingNotesPage = lazy(() => import('./pages/tools/MeetingNotesPage.tsx').then(m => ({ default: m.MeetingNotesPage })));
const RetinaCalculatorPage = lazy(() => import('./pages/tools/RetinaCalculatorPage.tsx').then(m => ({ default: m.RetinaCalculatorPage })));
const IPhoneChargePage = lazy(() => import('./pages/tools/IPhoneChargePage.tsx').then(m => ({ default: m.IPhoneChargePage })));
const FileTransferPage = lazy(() => import('./pages/tools/FileTransferPage.tsx').then(m => ({ default: m.FileTransferPage })));
const QuickCalculatorsPage = lazy(() => import('./pages/tools/QuickCalculatorsPage.tsx').then(m => ({ default: m.QuickCalculatorsPage })));

// Batch K Apple Tools
const IPhoneMockupMakerPage = lazy(() => import('./pages/tools/IPhoneMockupMakerPage.tsx').then(m => ({ default: m.IPhoneMockupMakerPage })));
const IPhoneBatteryHealthPage = lazy(() => import('./pages/tools/IPhoneBatteryHealthPage.tsx').then(m => ({ default: m.IPhoneBatteryHealthPage })));
const IPhoneStoragePlannerPage = lazy(() => import('./pages/tools/IPhoneStoragePlannerPage.tsx').then(m => ({ default: m.IPhoneStoragePlannerPage })));
const WallpaperGradientPage = lazy(() => import('./pages/tools/WallpaperGradientPage.tsx').then(m => ({ default: m.WallpaperGradientPage })));
const AppleSubscriptionPage = lazy(() => import('./pages/tools/AppleSubscriptionPage.tsx').then(m => ({ default: m.AppleSubscriptionPage })));

// Batch H Study & Focus Tools
const TaskBreakerPage = lazy(() => import('./pages/tools/TaskBreakerPage.tsx').then(m => ({ default: m.TaskBreakerPage })));
const ExplainSimplyPage = lazy(() => import('./pages/tools/ExplainSimplyPage.tsx').then(m => ({ default: m.ExplainSimplyPage })));
const FlashcardsQuizPage = lazy(() => import('./pages/tools/FlashcardsQuizPage.tsx').then(m => ({ default: m.FlashcardsQuizPage })));
const StudyPlanMakerPage = lazy(() => import('./pages/tools/StudyPlanMakerPage.tsx').then(m => ({ default: m.StudyPlanMakerPage })));

// Batch I Work & Creative Tools
const InvoiceGeneratorPage = lazy(() => import('./pages/tools/InvoiceGeneratorPage.tsx').then(m => ({ default: m.InvoiceGeneratorPage })));
const CoverLetterResumePage = lazy(() => import('./pages/tools/CoverLetterResumePage.tsx').then(m => ({ default: m.CoverLetterResumePage })));
const ProductDescriptionPage = lazy(() => import('./pages/tools/ProductDescriptionPage.tsx').then(m => ({ default: m.ProductDescriptionPage })));
const TranslatorTonePage = lazy(() => import('./pages/tools/TranslatorTonePage.tsx').then(m => ({ default: m.TranslatorTonePage })));
const NaturalRewritePage = lazy(() => import('./pages/tools/NaturalRewritePage.tsx').then(m => ({ default: m.NaturalRewritePage })));

// Batch J Private File Tools
const PdfMergePage = lazy(() => import('./pages/tools/PdfMergePage.tsx').then(m => ({ default: m.PdfMergePage })));
const PdfSplitPage = lazy(() => import('./pages/tools/PdfSplitPage.tsx').then(m => ({ default: m.PdfSplitPage })));
const ImageToPdfPage = lazy(() => import('./pages/tools/ImageToPdfPage.tsx').then(m => ({ default: m.ImageToPdfPage })));
const ImageToTextOcrPage = lazy(() => import('./pages/tools/ImageToTextOcrPage.tsx').then(m => ({ default: m.ImageToTextOcrPage })));

// Batch L Private Browser Tools
const InstallCommandGeneratorPage = lazy(() => import('./pages/tools/InstallCommandGeneratorPage.tsx').then(m => ({ default: m.InstallCommandGeneratorPage })));
const FileChecksumVerifierPage = lazy(() => import('./pages/tools/FileChecksumVerifierPage.tsx').then(m => ({ default: m.FileChecksumVerifierPage })));
const SubnetCalculatorPage = lazy(() => import('./pages/tools/SubnetCalculatorPage.tsx').then(m => ({ default: m.SubnetCalculatorPage })));
const BootableUsbChooserPage = lazy(() => import('./pages/tools/BootableUsbChooserPage.tsx').then(m => ({ default: m.BootableUsbChooserPage })));
const DriveSpeedCalculatorPage = lazy(() => import('./pages/tools/DriveSpeedCalculatorPage.tsx').then(m => ({ default: m.DriveSpeedCalculatorPage })));
const DriveHealthReaderPage = lazy(() => import('./pages/tools/DriveHealthReaderPage.tsx').then(m => ({ default: m.DriveHealthReaderPage })));
const ShortcutTranslatorPage = lazy(() => import('./pages/tools/ShortcutTranslatorPage.tsx').then(m => ({ default: m.ShortcutTranslatorPage })));
const BatchQrCodeGeneratorPage = lazy(() => import('./pages/tools/BatchQrCodeGeneratorPage.tsx').then(m => ({ default: m.BatchQrCodeGeneratorPage })));

// Batch M Automation and Command Helpers
const AndroidAutomationPage = lazy(() => import('./pages/tools/AndroidAutomationPage.tsx').then(m => ({ default: m.AndroidAutomationPage })));
const AutoHotkeyGeneratorPage = lazy(() => import('./pages/tools/AutoHotkeyGeneratorPage.tsx').then(m => ({ default: m.AutoHotkeyGeneratorPage })));
const AdbFastbootCommandBuilderPage = lazy(() => import('./pages/tools/AdbFastbootCommandBuilderPage.tsx').then(m => ({ default: m.AdbFastbootCommandBuilderPage })));
const CommandExplainerPage = lazy(() => import('./pages/tools/CommandExplainerPage.tsx').then(m => ({ default: m.CommandExplainerPage })));
const BatteryWearCalculatorPage = lazy(() => import('./pages/tools/BatteryWearCalculatorPage.tsx').then(m => ({ default: m.BatteryWearCalculatorPage })));

// Batch N Software Directory & Comparison Pages
const SoftwareCategoryHubPage = lazy(() => import('./pages/software/SoftwareCategoryHubPage.tsx').then(m => ({ default: m.SoftwareCategoryHubPage })));
const AppDetailPage = lazy(() => import('./pages/software/AppDetailPage.tsx').then(m => ({ default: m.AppDetailPage })));
const ComparisonPage = lazy(() => import('./pages/software/ComparisonPage.tsx').then(m => ({ default: m.ComparisonPage })));

// Lightweight zero-layout-shift loading fallback
const PageLoadingSkeleton: React.FC = () => (
  <div className="py-16 max-w-3xl mx-auto space-y-6 animate-pulse" aria-busy="true" aria-label="Loading page content">
    <div className="h-4 w-32 bg-[#101c33] rounded-lg" />
    <div className="h-10 w-3/4 bg-[#101c33] rounded-xl" />
    <div className="h-24 w-full bg-[#101c33] rounded-2xl" />
    <div className="h-48 w-full bg-[#101c33] rounded-3xl" />
  </div>
);

export default function App() {
  const { currentPath, navigate } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Keyboard shortcut listener for quick search ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !isSearchOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Route dispatcher with Suspense boundaries
  const renderContent = () => {
    // 1. Home (immediate render)
    if (currentPath === '/') {
      return <HomePage navigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />;
    }

    return (
      <Suspense fallback={<PageLoadingSkeleton />}>
        {(() => {
          // 2. Tools Hub
          if (currentPath === '/tools') {
            return <ToolsHubPage navigate={navigate} />;
          }

          // 3. Tool Detail Routes
          if (currentPath === '/tools/apple-shortcuts-generator') {
            return <AppleShortcutsPage navigate={navigate} />;
          }
          if (currentPath === '/tools/ai-prompt-improver') {
            return <PromptImproverPage navigate={navigate} />;
          }
          if (currentPath === '/tools/ai-email-writer') {
            return <EmailWriterPage navigate={navigate} />;
          }
          if (currentPath === '/tools/ai-summarizer') {
            return <SummarizerPage navigate={navigate} />;
          }
          if (currentPath === '/tools/caption-hashtag-generator') {
            return <CaptionHashtagPage navigate={navigate} />;
          }
          if (currentPath === '/tools/social-bio-generator') {
            return <BioGeneratorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/title-headline-generator') {
            return <TitleHeadlinePage navigate={navigate} />;
          }
          if (currentPath === '/tools/rewrite-tone-changer') {
            return <RewriteTonePage navigate={navigate} />;
          }
          if (currentPath === '/tools/formula-helper') {
            return <FormulaHelperPage navigate={navigate} />;
          }
          if (currentPath === '/tools/meeting-notes-action-items') {
            return <MeetingNotesPage navigate={navigate} />;
          }
          if (currentPath === '/tools/retina-image-size-calculator') {
            return <RetinaCalculatorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/iphone-charging-time-calculator') {
            return <IPhoneChargePage navigate={navigate} />;
          }
          if (currentPath === '/tools/file-transfer-time-calculator') {
            return <FileTransferPage navigate={navigate} />;
          }
          if (currentPath === '/tools/quick-calculators') {
            return <QuickCalculatorsPage navigate={navigate} />;
          }

          // Batch K Apple Tools Routes
          if (currentPath === '/tools/iphone-screenshot-mockup-maker') {
            return <IPhoneMockupMakerPage navigate={navigate} />;
          }
          if (currentPath === '/tools/iphone-battery-health-forecast') {
            return <IPhoneBatteryHealthPage navigate={navigate} />;
          }
          if (currentPath === '/tools/iphone-storage-planner') {
            return <IPhoneStoragePlannerPage navigate={navigate} />;
          }
          if (currentPath === '/tools/wallpaper-gradient-maker') {
            return <WallpaperGradientPage navigate={navigate} />;
          }
          if (currentPath === '/tools/apple-subscription-calculator') {
            return <AppleSubscriptionPage navigate={navigate} />;
          }

          // Batch H Study & Focus Tools Routes
          if (currentPath === '/tools/task-breaker') {
            return <TaskBreakerPage navigate={navigate} />;
          }
          if (currentPath === '/tools/explain-it-simply') {
            return <ExplainSimplyPage navigate={navigate} />;
          }
          if (currentPath === '/tools/flashcard-quiz-maker') {
            return <FlashcardsQuizPage navigate={navigate} />;
          }
          if (currentPath === '/tools/study-plan-maker') {
            return <StudyPlanMakerPage navigate={navigate} />;
          }

          // Batch I Work & Creative Tools Routes
          if (currentPath === '/tools/invoice-generator') {
            return <InvoiceGeneratorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/cover-letter-resume-bullets') {
            return <CoverLetterResumePage navigate={navigate} />;
          }
          if (currentPath === '/tools/product-description-generator') {
            return <ProductDescriptionPage navigate={navigate} />;
          }
          if (currentPath === '/tools/ai-translator-tone') {
            return <TranslatorTonePage navigate={navigate} />;
          }
          if (currentPath === '/tools/natural-rewrite') {
            return <NaturalRewritePage navigate={navigate} />;
          }

          // Batch J Private File Tools Routes
          if (currentPath === '/tools/pdf-merge') {
            return <PdfMergePage navigate={navigate} />;
          }
          if (currentPath === '/tools/pdf-split') {
            return <PdfSplitPage navigate={navigate} />;
          }
          if (currentPath === '/tools/image-to-pdf') {
            return <ImageToPdfPage navigate={navigate} />;
          }
          if (currentPath === '/tools/image-to-text-ocr') {
            return <ImageToTextOcrPage navigate={navigate} />;
          }

          // Batch L Private Browser Tools Routes
          if (currentPath === '/tools/install-command-generator') {
            return <InstallCommandGeneratorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/file-checksum-verifier') {
            return <FileChecksumVerifierPage navigate={navigate} />;
          }
          if (currentPath === '/tools/cidr-subnet-calculator') {
            return <SubnetCalculatorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/bootable-usb-chooser') {
            return <BootableUsbChooserPage navigate={navigate} />;
          }
          if (currentPath === '/tools/drive-speed-requirement-calculator') {
            return <DriveSpeedCalculatorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/drive-health-reader') {
            return <DriveHealthReaderPage navigate={navigate} />;
          }
          if (currentPath === '/tools/mac-windows-shortcut-translator') {
            return <ShortcutTranslatorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/batch-qr-code-generator') {
            return <BatchQrCodeGeneratorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/android-automation-generator') {
            return <AndroidAutomationPage navigate={navigate} />;
          }
          if (currentPath === '/tools/autohotkey-script-generator') {
            return <AutoHotkeyGeneratorPage navigate={navigate} />;
          }
          if (currentPath === '/tools/adb-fastboot-command-builder') {
            return <AdbFastbootCommandBuilderPage navigate={navigate} />;
          }
          if (currentPath === '/tools/command-explainer') {
            return <CommandExplainerPage navigate={navigate} />;
          }
          if (currentPath === '/tools/battery-wear-calculator') {
            return <BatteryWearCalculatorPage navigate={navigate} />;
          }

          // Batch N Software Directory Hubs & Details
          if (currentPath === '/apple-tools') {
            return <SoftwareCategoryHubPage platform="apple" navigate={navigate} />;
          }
          if (currentPath.startsWith('/apple-tools/')) {
            const slug = currentPath.replace('/apple-tools/', '').split('?')[0].split('#')[0];
            return <AppDetailPage platform="apple" slug={slug} navigate={navigate} />;
          }

          if (currentPath === '/android-tools') {
            return <SoftwareCategoryHubPage platform="android" navigate={navigate} />;
          }
          if (currentPath.startsWith('/android-tools/')) {
            const slug = currentPath.replace('/android-tools/', '').split('?')[0].split('#')[0];
            return <AppDetailPage platform="android" slug={slug} navigate={navigate} />;
          }

          if (currentPath === '/pc-tools') {
            return <SoftwareCategoryHubPage platform="pc" navigate={navigate} />;
          }
          if (currentPath.startsWith('/pc-tools/')) {
            const slug = currentPath.replace('/pc-tools/', '').split('?')[0].split('#')[0];
            return <AppDetailPage platform="pc" slug={slug} navigate={navigate} />;
          }

          // Batch N Comparisons
          if (currentPath.startsWith('/compare/')) {
            const slug = currentPath.replace('/compare/', '').split('?')[0].split('#')[0];
            return <ComparisonPage slug={slug} navigate={navigate} />;
          }

          // 4. Saved History
          if (currentPath === '/saved') {
            return <SavedResultsPage navigate={navigate} />;
          }

          // 5. Guides Hub & Detail Routes
          if (currentPath === '/guides') {
            return <GuidesHubPage navigate={navigate} />;
          }
          if (currentPath.startsWith('/guides/')) {
            const slug = currentPath.replace('/guides/', '').split('?')[0].split('#')[0];
            return <GuideDetailPage slug={slug} navigate={navigate} />;
          }

          // 6. Company & Legal Pages
          if (currentPath === '/about') {
            return <AboutPage navigate={navigate} />;
          }
          if (currentPath === '/contact') {
            return <ContactPage navigate={navigate} />;
          }
          if (currentPath === '/privacy') {
            return <PrivacyPage navigate={navigate} />;
          }
          if (currentPath === '/terms') {
            return <TermsPage navigate={navigate} />;
          }
          if (currentPath === '/pricing') {
            return <PricingPage navigate={navigate} />;
          }

          // 7. 404 Not Found
          return <NotFoundPage navigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />;
        })()}
      </Suspense>
    );
  };

  return (
    <ToastProvider>
      <div className="min-h-[100dvh] flex flex-col bg-[#050a14] text-[#f2f7ff] bg-ambient-grid relative selection:bg-[#0a84ff] selection:text-[#ffffff] overflow-x-hidden">
      {/* Dynamic SEO Meta & Schema.org JSON-LD Manager */}
      <MetaManager currentPath={currentPath} />

      {/* Top ambient glow */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-[380px] bg-top-glow z-0" aria-hidden="true" />

      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0a84ff] focus:text-[#ffffff] focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top thin Aurora Brand scroll indicator */}
      <ScrollProgress />

      {/* Top 3-Zone Navigation */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 relative z-10 pb-24 md:pb-12">
        <div className="max-w-[1200px] mx-auto px-5">
          <div key={currentPath} className="page-transition">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />

      {/* Semantic Footer with Independent Disclaimer */}
      <Footer navigate={navigate} />

      {/* Mobile Fixed Bottom Tab Dock */}
      <BottomTabBar
        currentPath={currentPath}
        navigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMore={() => setIsMenuOpen(true)}
      />

      {/* Full-Height Glass Sheet Navigation (Mobile) */}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigate={navigate}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigate={navigate}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />
    </div>
    </ToastProvider>
  );
}
