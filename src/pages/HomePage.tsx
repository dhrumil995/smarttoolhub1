import React, { useState, useMemo, Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PageId, WorkflowItem } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { ToolCategoryFilter } from '../components/Navbar';
import { IOSBottomSheet } from '../components/ios/IOSBottomSheet';
import { IOSToggle } from '../components/ios/IOSToggle';
import { haptics } from '../utils/haptics';
import { getGlassTheme } from '../utils/glassTheme';
import luxuryLogoImg from '../assets/images/smarttoolhub_luxury_logo_1790827199493.webp';
import heroStudioImg from '../assets/images/hero_mac_studio_ecosystem_1790827213135.webp';
import shortcutsAutomationImg from '../assets/images/feature_shortcuts_automation_1790175491181.webp';
import bentoRetinaImg from '../assets/images/bento_retina_image_engine_1790827223139.webp';
import bentoSiliconImg from '../assets/images/bento_apple_silicon_neural_1790827235951.webp';
import bentoContinuityImg from '../assets/images/bento_continuity_sync_matrix_1790827245735.webp';
import { IPhone3DMockup } from '../components/IPhone3DMockup';
import { HomeShortcutGenerator } from '../components/HomeShortcutGenerator';
import { FreeAppleTools } from '../components/FreeAppleTools';
import { SemanticShortcutsFAQ } from '../components/SemanticShortcutsFAQ';

// Lazy load heavy workbench tabs only when requested by user
const DiagnosticSimulator = lazy(() =>
  import('../components/DiagnosticSimulator').then((m) => ({ default: m.DiagnosticSimulator }))
);
const EcosystemSwitcher = lazy(() =>
  import('../components/EcosystemSwitcher').then((m) => ({ default: m.EcosystemSwitcher }))
);
const AppleSiliconShowcase = lazy(() =>
  import('../components/AppleSiliconShowcase').then((m) => ({ default: m.AppleSiliconShowcase }))
);
import {
  Wand2,
  Wrench,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Search,
  Image,
  FileText,
  Globe,
  Calculator,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Sliders,
  Terminal,
  Cpu,
  X,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSearch: () => void;
  activeCategory?: ToolCategoryFilter;
  onSelectCategory?: (category: ToolCategoryFilter) => void;
}

interface BentoToolItem {
  id: string;
  number: string;
  title: string;
  category: ToolCategoryFilter;
  categoryLabel: string;
  metadata: string;
  description: string;
  colSpan: string;
  icon: React.FC<{ className?: string }>;
  ctaLabel: string;
  actionType: 'workbench' | 'navigate';
  workbenchTab?: 'image' | 'text' | 'seo' | 'calculator' | 'diagnostics' | 'silicon';
  targetPage?: PageId;
  featuredImage?: string;
  fallbackImage?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSearch,
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [localCategory, setLocalCategory] = useState<ToolCategoryFilter>('all');
  const shouldReduceMotion = useReducedMotion();
  const effectiveCategory = activeCategory !== 'all' ? activeCategory : localCategory;

  const handleCategoryChange = (cat: ToolCategoryFilter) => {
    haptics.playTap();
    setLocalCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  // Main Generator Initial Prompt state (wired to Free Tools quick prompts)
  const [generatorInitialPrompt, setGeneratorInitialPrompt] = useState<string>('');

  // Interactive Workbench active utility tab
  const [activeWorkbench, setActiveWorkbench] = useState<
    'image' | 'text' | 'seo' | 'calculator' | 'diagnostics' | 'silicon'
  >('image');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. IMAGE TOOLS STATE (Retina Scale, Aspect Ratio & macOS sips batch generator)
  const [imgWidth, setImgWidth] = useState<number>(1920);
  const [imgHeight, setImgHeight] = useState<number>(1080);
  const [imgFormat, setImgFormat] = useState<'webp' | 'jpeg' | 'png' | 'heic'>('webp');
  const [imgQuality, setImgQuality] = useState<number>(85);

  // 2. TEXT GENERATOR STATE (Case/Slug converter, Token estimator, Shortcut Prompt synthesizer)
  const [textInput, setTextInput] = useState<string>(
    'Automate daily macOS Sequoia workspace layout, resize recent screenshots to 1440px WebP, and archive to iCloud Drive.'
  );
  const [textMode, setTextMode] = useState<'prompt' | 'slug' | 'uppercase' | 'camelcase'>('prompt');

  // 3. SEO TOOLS STATE (JSON-LD & OpenGraph Meta Builder)
  const [seoTitle, setSeoTitle] = useState<string>('SmartToolHub — Apple Ecosystem & Web Utility Suite');
  const [seoDesc, setSeoDesc] = useState<string>(
    'Synthesize native Apple Shortcuts, optimize Retina media assets, generate Schema.org JSON-LD, and benchmark Apple Silicon.'
  );
  const [seoUrl, setSeoUrl] = useState<string>('https://smarttoolhub.app');
  const [seoType, setSeoType] = useState<'SoftwareApplication' | 'WebSite' | 'FAQPage'>('SoftwareApplication');

  // 4. CALCULATOR STATE (Apple Silicon LLM Memory Bandwidth & Automation ROI Calculator)
  const [selectedChip, setSelectedChip] = useState<'m4-max' | 'm4-pro' | 'm4' | 'm3-ultra'>('m4-max');
  const [tasksPerDay, setTasksPerDay] = useState<number>(12);
  const [minutesPerTask, setMinutesPerTask] = useState<number>(4);
  const [hourlyRate, setHourlyRate] = useState<number>(85);

  // Bottom sheet state for workflow quick preview
  const [selectedWorkflowForSheet, setSelectedWorkflowForSheet] = useState<WorkflowItem | null>(null);
  const [autoRunInShortcuts, setAutoRunInShortcuts] = useState<boolean>(true);
  const [icloudSyncEnabled, setIcloudSyncEnabled] = useState<boolean>(true);

  const copyToClipboard = async (text: string, id: string) => {
    haptics.playTap();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // All Bento Tools combining SmartToolHub utility categories & Apple Ecosystem intelligence
  const bentoTools: BentoToolItem[] = [
    {
      id: 'tool-ai-shortcuts',
      number: '01',
      title: 'AI Shortcut & Script Generator',
      category: 'shortcuts',
      categoryLabel: 'AI Automation',
      metadata: 'macOS Sequoia · iOS 18 · AppleScript & Zsh',
      description:
        'Describe any multi-device workflow in plain English. Synthesize native Siri Shortcuts action graphs, AppleScript automation, and POSIX shell scripts.',
      colSpan: 'md:col-span-6 lg:col-span-7',
      icon: Wand2,
      ctaLabel: 'Open AI Shortcut Generator',
      actionType: 'navigate',
      targetPage: 'generator',
      featuredImage: shortcutsAutomationImg,
      fallbackImage: '/images/feature_shortcuts_automation.webp',
    },
    {
      id: 'tool-image-studio',
      number: '02',
      title: 'Image & Retina Media Studio',
      category: 'image',
      categoryLabel: 'Image Tools',
      metadata: 'Aspect Ratio · @2x/@3x Retina · macOS sips CLI',
      description:
        'Calculate exact Retina @2x/@3x asset dimensions, estimate WebP/HEIC compression savings, and generate one-line macOS sips batch image conversion commands.',
      colSpan: 'md:col-span-6 lg:col-span-5',
      icon: Image,
      ctaLabel: 'Launch Image Studio',
      actionType: 'workbench',
      workbenchTab: 'image',
      featuredImage: bentoRetinaImg,
      fallbackImage: '/images/bento_retina_image_engine_1790827223139.jpg',
    },
    {
      id: 'tool-text-generator',
      number: '03',
      title: 'Text & Prompt Synthesizer',
      category: 'text',
      categoryLabel: 'Text Generators',
      metadata: 'LLM Token Counter · Case & Slug · Prompt Engine',
      description:
        'Transform raw notes into structured Apple Intelligence prompts, convert URL slugs and variable cases, and inspect live token and character metrics.',
      colSpan: 'md:col-span-3 lg:col-span-4',
      icon: FileText,
      ctaLabel: 'Open Text Generator',
      actionType: 'workbench',
      workbenchTab: 'text',
    },
    {
      id: 'tool-seo-schema',
      number: '04',
      title: 'Technical SEO & Schema Builder',
      category: 'seo',
      categoryLabel: 'SEO Tools',
      metadata: 'JSON-LD Graph · OpenGraph · Sitemap XML',
      description:
        'Generate validated Schema.org JSON-LD structured data, OpenGraph social cards, and inspect search engine indexability in real time.',
      colSpan: 'md:col-span-3 lg:col-span-4',
      icon: Globe,
      ctaLabel: 'Open SEO Builder',
      actionType: 'workbench',
      workbenchTab: 'seo',
    },
    {
      id: 'tool-calculators',
      number: '05',
      title: 'Silicon & Automation ROI Calculators',
      category: 'calculator',
      categoryLabel: 'Calculators',
      metadata: 'M1–M4 Max Bandwidth · Local LLM · Time Saved',
      description:
        'Calculate Apple Silicon unified memory bandwidth for local AI models and quantify annual engineering hours and dollar savings from workflow automation.',
      colSpan: 'md:col-span-6 lg:col-span-4',
      icon: Calculator,
      ctaLabel: 'Launch Calculators',
      actionType: 'workbench',
      workbenchTab: 'calculator',
      featuredImage: bentoSiliconImg,
      fallbackImage: '/images/bento_apple_silicon_neural_1790827235951.jpg',
    },
    {
      id: 'tool-continuity-doctor',
      number: '06',
      title: 'Continuity & AWDL Sync Doctor',
      category: 'diagnostics',
      categoryLabel: 'Sync Diagnostics',
      metadata: 'iPhone Mirroring · Universal Clipboard · AirDrop',
      description:
        'Diagnose peer-to-peer AWDL wireless handshakes, Bluetooth LE discovery tokens, and Continuity Camera Desk View disconnects without rebooting.',
      colSpan: 'md:col-span-6 lg:col-span-12',
      icon: Wrench,
      ctaLabel: 'Run Interactive Sync Doctor',
      actionType: 'workbench',
      workbenchTab: 'diagnostics',
      featuredImage: bentoContinuityImg,
      fallbackImage: '/images/bento_continuity_sync_matrix_1790827245735.jpg',
    },
  ];

  const filteredBentoTools = useMemo(() => {
    return bentoTools.filter((tool) => {
      const matchesCat = effectiveCategory === 'all' || tool.category === effectiveCategory;
      const q = heroSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.categoryLabel.toLowerCase().includes(q) ||
        tool.metadata.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [effectiveCategory, heroSearch]);

  const filteredWorkflows = useMemo(() => {
    const q = heroSearch.trim().toLowerCase();
    if (!q) return WORKFLOWS_DATA.slice(0, 4);
    return WORKFLOWS_DATA.filter(
      (wf) =>
        wf.title.toLowerCase().includes(q) ||
        wf.summary.toLowerCase().includes(q) ||
        wf.category.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [heroSearch]);

  const handleToolCardClick = (tool: BentoToolItem) => {
    haptics.playTap();
    if (tool.actionType === 'navigate' && tool.targetPage) {
      onNavigate(tool.targetPage);
      return;
    }
    if (tool.workbenchTab) {
      setActiveWorkbench(tool.workbenchTab);
      document.getElementById('interactive-workbench')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Image calculator derived values
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const safeW = Math.max(1, imgWidth || 1);
  const safeH = Math.max(1, imgHeight || 1);
  const divisor = gcd(safeW, safeH);
  const aspectRatioStr = `${Math.round(safeW / divisor)}:${Math.round(safeH / divisor)}`;
  const megapixels = ((safeW * safeH) / 1_000_000).toFixed(2);
  const estSizeKb = Math.max(
    12,
    Math.round(
      ((safeW * safeH * 3) / 1024) *
        (imgFormat === 'webp' ? 0.045 : imgFormat === 'heic' ? 0.04 : imgFormat === 'jpeg' ? 0.07 : 0.22) *
        (imgQuality / 85)
    )
  );
  const sipsCommand = `sips -Z ${Math.max(safeW, safeH)} -s format ${imgFormat} -s formatOptions ${imgQuality} *.png --out ./optimized/`;

  // Text generator derived values
  const wordCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  const charCount = textInput.length;
  const estTokens = Math.ceil(charCount / 3.8);
  const transformedText = useMemo(() => {
    const raw = textInput.trim();
    if (!raw) return '';
    if (textMode === 'slug') {
      return raw
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    }
    if (textMode === 'uppercase') {
      return raw.toUpperCase();
    }
    if (textMode === 'camelcase') {
      return raw
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }
    return `Act as an Apple Shortcuts & macOS Sequoia Automation Architect.\nObjective: ${raw}\nOutput: Provide step-by-step native App Intents, input/output variables, and fallback shell commands.`;
  }, [textInput, textMode]);

  // SEO Schema derived output
  const generatedSeoCode = useMemo(() => {
    const schemaObj = {
      '@context': 'https://schema.org',
      '@type': seoType,
      name: seoTitle,
      description: seoDesc,
      url: seoUrl,
      ...(seoType === 'SoftwareApplication'
        ? {
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'macOS 15, iOS 18, Web',
          }
        : {}),
    };
    return `<title>${seoTitle}</title>\n<meta name="description" content="${seoDesc}" />\n<meta property="og:title" content="${seoTitle}" />\n<meta property="og:description" content="${seoDesc}" />\n<meta property="og:url" content="${seoUrl}" />\n<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
  }, [seoTitle, seoDesc, seoUrl, seoType]);

  // Calculator derived metrics
  const chipSpecs: Record<
    'm4-max' | 'm4-pro' | 'm4' | 'm3-ultra',
    { name: string; bandwidthGbs: number; maxRamGb: number; max70bToks: number }
  > = {
    'm4-max': { name: 'Apple M4 Max (16-core CPU / 40-core GPU)', bandwidthGbs: 546, maxRamGb: 128, max70bToks: 14.2 },
    'm4-pro': { name: 'Apple M4 Pro (14-core CPU / 20-core GPU)', bandwidthGbs: 273, maxRamGb: 64, max70bToks: 7.4 },
    m4: { name: 'Apple M4 (10-core CPU / 10-core GPU)', bandwidthGbs: 120, maxRamGb: 32, max70bToks: 3.1 },
    'm3-ultra': { name: 'Apple M3 Ultra (32-core CPU / 80-core GPU)', bandwidthGbs: 800, maxRamGb: 192, max70bToks: 21.5 },
  };
  const activeChip = chipSpecs[selectedChip];
  const hoursSavedPerYear = Math.round(((tasksPerDay * minutesPerTask * 260) / 60) * 10) / 10;
  const annualDollarSavings = Math.round(hoursSavedPerYear * hourlyRate);

  const categoryButtons: { id: ToolCategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Suites' },
    { id: 'shortcuts', label: 'AI Shortcuts' },
    { id: 'image', label: 'Image Tools' },
    { id: 'text', label: 'Text Generators' },
    { id: 'seo', label: 'SEO Tools' },
    { id: 'calculator', label: 'Calculators' },
    { id: 'diagnostics', label: 'Sync Doctor' },
  ];

  return (
    <div className="relative space-y-16 sm:space-y-24 pb-24">
      {/* Aurora-style gradient background with heavily blurred blue (#0a84ff), pink (#ff4f9a), and amber (#ffb840) blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden h-[920px]"
      >
        {/* Blue #0a84ff blob */}
        <div className="absolute left-1/2 top-[-100px] -translate-x-1/2 w-[720px] sm:w-[980px] h-[480px] rounded-full bg-[#0a84ff]/25 blur-[140px]" />
        {/* Pink #ff4f9a blob */}
        <div className="absolute right-[5%] top-[140px] w-[380px] sm:w-[540px] h-[420px] rounded-full bg-[#ff4f9a]/20 blur-[130px]" />
        {/* Amber #ffb840 blob */}
        <div className="absolute left-[5%] top-[220px] w-[360px] sm:w-[480px] h-[380px] rounded-full bg-[#ffb840]/16 blur-[130px]" />
      </div>

      {/* =========================================================================
          SECTION 1: HERO SECTION WITH H1, VALUE PROP, PRIMARY CTA & 3D IPHONE MOCKUP
          ========================================================================= */}
      <section className="relative pt-10 sm:pt-16 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-8">
        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.02,
              },
            },
          }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 },
              },
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400 text-xs font-mono will-change-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff4f9a]" />
            <span>macOS Sequoia 15 · iOS 18 Siri App Intents Ready</span>
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.985 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: 'spring', stiffness: 240, damping: 26, mass: 0.9 },
              },
            }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] leading-[1.08] text-metallic font-heading will-change-transform"
          >
            Apple Shortcuts Generator{' '}
            <span className="text-accent-gradient">for iOS 18 &amp; macOS Sequoia</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 260, damping: 28, mass: 0.85 },
              },
            }}
            className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed pt-1 will-change-transform"
          >
            Generate custom, production-ready Siri Shortcuts and macOS automation workflows in seconds with AI.
          </motion.p>
        </motion.div>

        {/* Primary Action Button & Secondary Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
          <a
            href="#generator"
            onClick={(e) => {
              e.preventDefault();
              haptics.playTap();
              document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
              const input = document.getElementById('shortcut-prompt-input');
              if (input) input.focus();
            }}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-2xl glass-button-primary text-white text-xs sm:text-sm font-bold tracking-tight cursor-pointer whitespace-nowrap text-decoration-none shadow-[0_12px_28px_rgba(10,132,255,0.4)]"
          >
            <Wand2 className="w-4 h-4 shrink-0" />
            <span>Generate a shortcut</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>

          <a
            href="#ideas"
            onClick={(e) => {
              e.preventDefault();
              haptics.playTap();
              document.getElementById('ideas')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-2xl glass-pill text-slate-900 dark:text-white text-xs sm:text-sm font-semibold tracking-tight cursor-pointer whitespace-nowrap text-decoration-none"
          >
            <Sparkles className="w-4 h-4 text-[#ffb840] shrink-0" />
            <span>Explore 5 Free Tools</span>
          </a>
        </div>

        {/* CSS 3D iPhone Mockup with Live Shortcut Preview & Parallax Floating Glass Chips */}
        <div className="pt-2">
          <IPhone3DMockup
            onRunSample={() => {
              document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Interactive Modern Tool Search & Instant Filter Bar */}
        <div className="max-w-3xl mx-auto pt-4 space-y-3">
          <div className="relative flex items-center rounded-2xl bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-300/90 dark:border-white/20 hover:border-indigo-500/45 dark:hover:border-indigo-400/45 shadow-[0_20px_50px_rgba(99,102,241,0.12),inset_0_1px_0_0_rgba(255,255,255,0.18)] focus-within:!border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
            <Search className="w-4 h-4 text-indigo-500 dark:text-indigo-400 ml-4 shrink-0" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Filter tools & workflows (e.g., Image resizer, JSON-LD SEO, M4 Max calculator, AirDrop fix)..."
              aria-label="Filter tools and workflows"
              className="w-full py-3.5 px-3.5 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
            />
            {heroSearch && (
              <button
                type="button"
                onClick={() => setHeroSearch('')}
                className="p-1.5 mr-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenSearch}
              className="hidden sm:inline-flex items-center gap-1.5 mr-2.5 px-3 py-1.5 rounded-xl glass-pill text-[11px] text-slate-600 dark:text-zinc-300 font-mono cursor-pointer shrink-0"
              title="Open Global Command Palette"
            >
              <span>Command</span>
              <kbd className="text-indigo-500 dark:text-indigo-400 font-semibold">⌘K</kbd>
            </button>
          </div>

          {/* Interactive Category Filter Buttons */}
          <div
            role="tablist"
            aria-label="Filter tools by category"
            className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
          >
            {categoryButtons.map((btn) => {
              const isSelected = effectiveCategory === btn.id;
              return (
                <button
                  key={btn.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleCategoryChange(btn.id)}
                  className={`tilt-tab-3d px-3.5 py-1.5 min-h-[34px] rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-400/60 text-white shadow-[0_6px_20px_rgba(99,102,241,0.35),inset_0_1px_0_0_rgba(255,255,255,0.3)]'
                      : 'glass-pill text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Luxury Apple Ecosystem Studio Visual Showcase & Architecture Logos */}
        <div className="max-w-5xl mx-auto pt-8 space-y-8">
          {/* Framed Obsidian Hardware & Workflow Studio Preview */}
          <div className="relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/80 via-slate-100/40 to-transparent dark:from-white/[0.14] dark:via-white/[0.04] dark:to-transparent border border-slate-300/90 dark:border-white/20 shadow-[0_30px_90px_-15px_rgba(79,70,229,0.28),inset_0_1px_0_0_rgba(255,255,255,0.25)] overflow-hidden group">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-[#030712] border border-white/15">
              <img
                src={heroStudioImg}
                onError={(e) => {
                  e.currentTarget.src = '/images/hero_mac_studio_ecosystem_1790827213135.webp';
                }}
                alt="SmartToolHub Apple Ecosystem Hardware and Automation Studio"
                referrerPolicy="no-referrer"
                fetchPriority="high"
                decoding="async"
                width={1280}
                height={548}
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              {/* Atmospheric Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/70 via-transparent to-[#030712]/70" />

              {/* Top-left Luxury Emblem Overlay */}
              <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#030712]/80 backdrop-blur-xl border border-white/20 shadow-lg">
                <img
                  src={luxuryLogoImg}
                  onError={(e) => {
                    e.currentTarget.src = '/images/smarttoolhub_luxury_logo_1790827199493.webp';
                  }}
                  alt="SmartToolHub Studio Emblem"
                  referrerPolicy="no-referrer"
                  decoding="async"
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-md object-cover border border-white/20"
                />
                <span className="text-[11px] font-semibold tracking-tight text-white">
                  Obsidian Studio Engine
                </span>
                <span className="text-[10px] font-mono text-indigo-300 hidden sm:inline">
                  · M4 Max Ready
                </span>
              </div>

              {/* Bottom Floating Studio Status Strip */}
              <div className="absolute bottom-3.5 inset-x-3.5 sm:bottom-5 sm:inset-x-5 flex flex-wrap items-center justify-between gap-3 text-left">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-300">
                    Multi-Device Continuity Architecture
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Native Siri Shortcuts, Retina Media Pipeline & Zero-Latency AWDL Handoff
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] font-mono text-zinc-200">
                    macOS 15 Sequoia
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] font-mono text-zinc-200">
                    iOS 18.2
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-indigo-500/25 backdrop-blur-md border border-indigo-400/40 text-[11px] font-mono text-indigo-200">
                    800 GB/s Unified Memory
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Native Apple & Web Standards Partner / Ecosystem Logo Ribbon */}
          <div className="pt-2 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
              Engineered for Native Apple Architecture & Modern Web Standards
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-left">
              {/* Logo 1: Apple macOS Sequoia */}
              <div className="glass-panel px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 group hover:border-indigo-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-900/5 dark:bg-white/[0.06] border border-slate-300/60 dark:border-white/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-slate-800 dark:text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.79-.96 2.84 1.04.08 2.08-.52 2.72-1.3" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">macOS Sequoia</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">Darwin 24.x</div>
                </div>
              </div>

              {/* Logo 2: Apple Silicon M4 Max */}
              <div className="glass-panel px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 group hover:border-indigo-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-900/5 dark:bg-white/[0.06] border border-slate-300/60 dark:border-white/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                    <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">Apple Silicon</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">M1 – M4 Max</div>
                </div>
              </div>

              {/* Logo 3: Siri Shortcuts Engine */}
              <div className="glass-panel px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 group hover:border-indigo-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-900/5 dark:bg-white/[0.06] border border-slate-300/60 dark:border-white/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-violet-500 dark:text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">Shortcuts API</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">Native Actions</div>
                </div>
              </div>

              {/* Logo 4: Retina & ProRes sips */}
              <div className="glass-panel px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 group hover:border-indigo-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-900/5 dark:bg-white/[0.06] border border-slate-300/60 dark:border-white/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-cyan-500 dark:text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">Retina XDR</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">@2x/@3x sips</div>
                </div>
              </div>

              {/* Logo 5: Schema.org & GEO */}
              <div className="glass-panel px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 group hover:border-indigo-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-900/5 dark:bg-white/[0.06] border border-slate-300/60 dark:border-white/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">Schema.org</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">JSON-LD @graph</div>
                </div>
              </div>

              {/* Logo 6: AWDL Wireless Continuity */}
              <div className="glass-panel px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 group hover:border-indigo-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-900/5 dark:bg-white/[0.06] border border-slate-300/60 dark:border-white/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <circle cx="12" cy="20" r="1" fill="currentColor" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">AWDL Sync</div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">Peer-to-Peer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: MAIN POLISHED APPLE SHORTCUT GENERATOR TOOL
          ========================================================================= */}
      <HomeShortcutGenerator
        initialPrompt={generatorInitialPrompt}
        onOpenFullGenerator={() => onNavigate('generator')}
      />

      {/* =========================================================================
          SECTION 3: HOW IT WORKS IN 3 STEPS
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-mono">
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            From natural thought to native Siri voice trigger in under sixty seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bento-card p-6 sm:p-8 tilt-card-3d relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0a84ff] to-[#38bdf8] text-white flex items-center justify-center text-sm font-extrabold font-mono shadow-md">
                01
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Describe Your Routine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Type what you want to automate in everyday English — like &ldquo;Mute notifications when calendar event starts&rdquo; or &ldquo;Batch convert screenshots to WebP.&rdquo;
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-blue-500 dark:text-blue-400 flex items-center gap-1.5">
              <span>Natural language intent parsing</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bento-card p-6 sm:p-8 tilt-card-3d relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff4f9a] to-[#ff75b5] text-white flex items-center justify-center text-sm font-extrabold font-mono shadow-md">
                02
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                AI Synthesizes Action Graph
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                SmartToolHub constructs validated iOS 18 &amp; macOS Sequoia App Intents, variable links, AppleScript fallbacks, and parameter sanity checks.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-pink-500 dark:text-pink-400 flex items-center gap-1.5">
              <span>Zero third-party runtime bloat</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bento-card p-6 sm:p-8 tilt-card-3d relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ffb840] to-[#ffd166] text-black flex items-center justify-center text-sm font-extrabold font-mono shadow-md">
                03
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Run on iPhone, iPad &amp; Mac
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Import actions into your native Shortcuts app with iCloud sync. Trigger with Siri voice, your Apple Watch, or Action Button.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
              <span>Instant Siri &amp; Widget triggers</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURE GRID
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-mono">
            <span>Engineering Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Built for Native Apple Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            Engineered specifically for Darwin 24.x, Apple Silicon unified memory, and Apple Intelligence App Intents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bento-card p-6 tilt-card-3d space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Siri Voice &amp; App Intents
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Full compatibility with iOS 18 Siri Intents, Action Button shortcuts, and Control Center toggle controls.
            </p>
          </div>

          <div className="bento-card p-6 tilt-card-3d space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              100% Private (No Tracking)
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Calculators and workflow generators run client-side. No telemetry, user logins, or persistent tracking cookies.
            </p>
          </div>

          <div className="bento-card p-6 tilt-card-3d space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Apple Silicon Tuned
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Accurate M1–M4 unified memory bandwidth models, local LLM token speed estimates, and native macOS sips commands.
            </p>
          </div>

          <div className="bento-card p-6 tilt-card-3d space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-400/30 text-pink-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Cross-Device Continuity
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Diagnose AWDL peer-to-peer handoffs, AirDrop discovery tokens, and iPhone Mirroring without restarting your devices.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: 5 SMALL FREE TOOLS (EACH WITH OWN H2, LABELS & INSTANT RESULTS)
          ========================================================================= */}
      <FreeAppleTools
        onLoadPromptIntoGenerator={(promptText) => {
          setGeneratorInitialPrompt(promptText);
        }}
      />

      {/* =========================================================================
          SECTION 6: SEMANTIC FAQ ACCORDION (<DETAILS> ELEMENTS)
          ========================================================================= */}
      <SemanticShortcutsFAQ />

      {/* =========================================================================
          SECTION 7: ASYMMETRIC BENTO-BOX GRID FOR SMARTTOOLHUB SUITES
          ========================================================================= */}
      <section
        id="bento-tools-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-900/10 dark:border-white/10 pb-4">
          <div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Modular Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              SmartToolHub Bento Suite
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
            <span>Showing {filteredBentoTools.length} of {bentoTools.length} suites</span>
            {effectiveCategory !== 'all' && (
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className="text-indigo-500 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5">
          {filteredBentoTools.map((tool) => {
            const Icon = tool.icon;
            const theme = getGlassTheme(tool.category);
            const toolHref = tool.targetPage
              ? `/${tool.targetPage}`
              : tool.workbenchTab
              ? `/?category=${tool.category}`
              : '/';
            return (
              <a
                key={tool.id}
                href={toolHref}
                onClick={(e) => {
                  e.preventDefault();
                  handleToolCardClick(tool);
                }}
                className={`${tool.colSpan} ${theme.cardClass} group relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between cursor-pointer rounded-3xl transition-all duration-300 text-left no-underline`}
              >
                {/* Dynamic colored ambient light glow on hover */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full ${theme.glowClass} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-300`}
                />

                <div className="space-y-4 relative z-10">
                  {/* Unboxed clean metadata line (Zero-Pill discipline) */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`font-mono font-semibold ${theme.textAccentClass} tabular-nums`}>
                        {tool.number}.
                      </span>
                      <span className="font-medium text-slate-700 dark:text-zinc-300">
                        {tool.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{tool.metadata}</span>
                    </div>
                    <div className={`w-9 h-9 rounded-xl ${theme.iconBgClass} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Luxury Visual Showcase Banner inside Bento Card when featuredImage is present */}
                  {tool.featuredImage && (
                    <div className="relative h-36 sm:h-44 w-full rounded-2xl overflow-hidden bg-[#030712] border border-slate-300/80 dark:border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
                      <img
                        src={tool.featuredImage}
                        onError={(e) => {
                          if (tool.fallbackImage && e.currentTarget.src !== tool.fallbackImage) {
                            e.currentTarget.src = tool.fallbackImage;
                          }
                        }}
                        alt={tool.title}
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={280}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[10px] font-mono text-zinc-200 bg-[#030712]/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.dotColor }} />
                        <span>{tool.categoryLabel} Engine</span>
                      </div>
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-white/12 flex items-center justify-between relative z-10">
                  <span className={`text-xs font-semibold text-slate-900 dark:text-white ${theme.textAccentClass} transition-colors flex items-center gap-1.5`}>
                    <span>{tool.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                    Interactive
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Quantified Proof & Engineering Benchmarks in Clean High-Fi Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bento-card p-5 space-y-1.5 rounded-2xl border border-white/10 dark:border-white/10 hover:border-indigo-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
              120+
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">
              Verified macOS Sequoia & iOS 18 automation blueprints
            </p>
          </div>
          <div className="bento-card p-5 space-y-1.5 rounded-2xl border border-white/10 dark:border-white/10 hover:border-cyan-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
              800 GB/s
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">
              Apple Silicon M1–M4 & Ultra memory specs indexed
            </p>
          </div>
          <div className="bento-card p-5 space-y-1.5 rounded-2xl border border-white/10 dark:border-white/10 hover:border-emerald-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
              140+ hrs
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">
              Average annual engineering time saved per workspace
            </p>
          </div>
          <div className="bento-card p-5 space-y-1.5 rounded-2xl border border-white/10 dark:border-white/10 hover:border-amber-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
              0 Keys
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">
              Zero-Credentials privacy — 100% client-side execution
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INTERACTIVE SMARTTOOLHUB UTILITY WORKBENCH
          Real, immediately usable tools for Image, Text, SEO, Calculators & Sync
          ========================================================================= */}
      <section
        id="interactive-workbench"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-900/10 dark:border-white/10 pb-4">
          <div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Live Client-Side Execution
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Interactive Utility Workbench
            </h2>
          </div>

          {/* Workbench Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Select active utility workbench"
            className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/[0.04] dark:bg-white/[0.04] border border-slate-300/80 dark:border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] overflow-x-auto"
          >
            {[
              { id: 'image', label: 'Image Tools', icon: Image },
              { id: 'text', label: 'Text & Prompts', icon: FileText },
              { id: 'seo', label: 'SEO & Schema', icon: Globe },
              { id: 'calculator', label: 'Calculators', icon: Calculator },
              { id: 'diagnostics', label: 'Sync Doctor', icon: Wrench },
              { id: 'silicon', label: 'Silicon Matrix', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeWorkbench === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => {
                    haptics.playTap();
                    setActiveWorkbench(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-white dark:bg-indigo-600 border-slate-300 dark:border-indigo-400/60 text-slate-950 dark:text-white shadow-[0_4px_12px_rgba(99,102,241,0.25),inset_0_1px_0_0_rgba(255,255,255,0.3)]'
                      : 'border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300/50 dark:hover:border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* WORKBENCH TAB 1: IMAGE & RETINA MEDIA STUDIO */}
        {activeWorkbench === 'image' && (
          <div className="glass-cyan p-6 sm:p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">
            <div className="lg:col-span-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Retina Scale, Aspect Ratio & macOS sips Optimizer
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Enter target pixel dimensions to compute exact aspect ratios, @2x/@3x Retina exports, estimated WebP/HEIC payload sizes, and native macOS batch CLI commands.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={imgWidth}
                    onChange={(e) => setImgWidth(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono tabular-nums"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={imgHeight}
                    onChange={(e) => setImgHeight(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono tabular-nums"
                  />
                </div>
              </div>

              {/* Preset Resolutions */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: '4K UHD (3840×2160)', w: 3840, h: 2160 },
                  { label: 'MacBook 16" (3456×2234)', w: 3456, h: 2234 },
                  { label: 'OpenGraph (1200×630)', w: 1200, h: 630 },
                  { label: 'App Store (1290×2796)', w: 1290, h: 2796 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setImgWidth(preset.w);
                      setImgHeight(preset.h);
                    }}
                    className="px-2.5 py-1.5 rounded-lg glass-pill text-[11px] text-slate-700 dark:text-zinc-300 cursor-pointer whitespace-nowrap"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block">
                    Target Format
                  </label>
                  <select
                    value={imgFormat}
                    onChange={(e) => setImgFormat(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  >
                    <option value="webp" className="bg-[#0B0F19] text-white">WebP (Next-Gen Web)</option>
                    <option value="heic" className="bg-[#0B0F19] text-white">HEIC (Apple Native)</option>
                    <option value="jpeg" className="bg-[#0B0F19] text-white">JPEG (Universal)</option>
                    <option value="png" className="bg-[#0B0F19] text-white">PNG (Lossless)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block">
                    Compression Quality ({imgQuality}%)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={imgQuality}
                    onChange={(e) => setImgQuality(Number(e.target.value))}
                    className="w-full accent-indigo-500 mt-2.5"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between space-y-5 border-t lg:border-t-0 lg:border-l border-slate-900/10 dark:border-white/10 pt-6 lg:pt-0 lg:pl-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl glass-panel">
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Aspect Ratio</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                    {aspectRatioStr}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl glass-panel">
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Sensor Resolution</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                    {megapixels} MP
                  </div>
                </div>
                <div className="p-3.5 rounded-xl glass-panel">
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Est. Output Size</div>
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-0.5">
                    ~{estSizeKb} KB
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel space-y-2 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Retina Asset Density Scale
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono tabular-nums text-[11px] text-slate-600 dark:text-zinc-300">
                  <div>@1x: {Math.round(safeW / 2)}×{Math.round(safeH / 2)}</div>
                  <div>@2x: {safeW}×{safeH}</div>
                  <div>@3x: {Math.round(safeW * 1.5)}×{Math.round(safeH * 1.5)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>macOS Native Batch Conversion Command</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(sipsCommand, 'sips-cmd')}
                    className="inline-flex items-center gap-1 text-indigo-500 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    {copiedId === 'sips-cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'sips-cmd' ? 'Copied' : 'Copy CLI'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 text-zinc-200 text-xs font-mono overflow-x-auto border border-white/10">
                  {sipsCommand}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* WORKBENCH TAB 2: TEXT & PROMPT GENERATORS */}
        {activeWorkbench === 'text' && (
          <div className="glass-amber p-6 sm:p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Text Transformer & Shortcut Prompt Builder
                </h3>
                <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-zinc-400">
                  {wordCount} words · {charCount} chars · ~{estTokens} tokens
                </div>
              </div>

              <textarea
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter workflow description, article title, or raw text..."
                className="w-full p-3.5 rounded-xl glass-input text-xs sm:text-sm leading-relaxed focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'prompt', label: 'AI Shortcut Prompt' },
                  { id: 'slug', label: 'URL Slugify' },
                  { id: 'camelcase', label: 'camelCase Variable' },
                  { id: 'uppercase', label: 'UPPERCASE' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTextMode(mode.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      textMode === mode.id
                        ? 'bg-indigo-600 text-white'
                        : 'glass-pill text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-slate-900/10 dark:border-white/10 pt-6 lg:pt-0 lg:pl-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    Synthesized Output
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transformedText, 'text-out')}
                    className="inline-flex items-center gap-1 text-indigo-500 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    {copiedId === 'text-out' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'text-out' ? 'Copied' : 'Copy Output'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-zinc-200 text-xs font-mono whitespace-pre-wrap leading-relaxed border border-white/10 min-h-[140px]">
                  {transformedText}
                </pre>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const url = new URL(window.location.href);
                      url.pathname = '/generator';
                      url.searchParams.set('task', textInput);
                      window.history.pushState({}, '', url.toString());
                    } catch (_) {}
                    onNavigate('generator');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button-primary text-white text-xs font-semibold cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Send to Full AI Shortcut Generator</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORKBENCH TAB 3: TECHNICAL SEO & SCHEMA BUILDER */}
        {activeWorkbench === 'seo' && (
          <div className="glass-emerald p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
            {/* Active Site SEO & GEO Indexing Status Strip */}
            <div className="p-4 rounded-xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600 dark:text-zinc-300">
                <span className="font-semibold text-slate-900 dark:text-white">
                  SmartToolHub Active SEO & GEO Engine
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  JSON-LD @graph (6 Entities)
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">Canonical & OpenGraph Synced</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg glass-pill text-[11px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                >
                  <span>/sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg glass-pill text-[11px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                >
                  <span>/llms.txt (AI Search)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg glass-pill text-[11px] font-mono text-slate-600 dark:text-zinc-300 flex items-center gap-1"
                >
                  <span>/robots.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Schema.org JSON-LD & OpenGraph Tag Generator
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <label className="font-medium text-slate-700 dark:text-zinc-300">
                        Page / Application Title
                      </label>
                      <span
                        className={`font-mono tabular-nums text-[11px] ${
                          seoTitle.length >= 30 && seoTitle.length <= 60
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-500'
                        }`}
                      >
                        {seoTitle.length}/60 chars (Optimal: 30–60)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <label className="font-medium text-slate-700 dark:text-zinc-300">
                        Meta Description
                      </label>
                      <span
                        className={`font-mono tabular-nums text-[11px] ${
                          seoDesc.length >= 120 && seoDesc.length <= 160
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-500'
                        }`}
                      >
                        {seoDesc.length}/160 chars (Optimal: 120–160)
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        value={seoUrl}
                        onChange={(e) => setSeoUrl(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
                        Schema Entity Type
                      </label>
                      <select
                        value={seoType}
                        onChange={(e) => setSeoType(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
                      >
                        <option value="SoftwareApplication" className="bg-[#0B0F19] text-white">
                          SoftwareApplication
                        </option>
                        <option value="WebSite" className="bg-[#0B0F19] text-white">
                          WebSite
                        </option>
                        <option value="FAQPage" className="bg-[#0B0F19] text-white">
                          FAQPage
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Live Google SERP & Social Snippet Preview */}
                <div className="p-4 rounded-xl glass-panel space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                    Live Search Engine & Social Snippet Preview
                  </div>
                  <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 truncate">
                    {seoUrl}
                  </div>
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate">
                    {seoTitle || 'Untitled Page'}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {seoDesc || 'Add a meta description between 120 and 160 characters.'}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-3 border-t lg:border-t-0 lg:border-l border-slate-900/10 dark:border-white/10 pt-6 lg:pt-0 lg:pl-8">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    Production HTML Head & JSON-LD Markup
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedSeoCode, 'seo-code')}
                    className="inline-flex items-center gap-1 text-indigo-500 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    {copiedId === 'seo-code' ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === 'seo-code' ? 'Copied Markup' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-zinc-200 text-[11px] font-mono overflow-x-auto max-h-[280px] border border-white/10">
                  {generatedSeoCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* WORKBENCH TAB 4: APPLE SILICON & AUTOMATION ROI CALCULATORS */}
        {activeWorkbench === 'calculator' && (
          <div className="glass-rose p-6 sm:p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">
            {/* Left: Automation ROI Calculator */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Workflow Automation ROI Calculator
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Quantify annual time and engineering cost savings from automating repetitive macOS & iOS tasks.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                    Runs / Day
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={tasksPerDay}
                    onChange={(e) => setTasksPerDay(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                    Min Saved / Run
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={minutesPerTask}
                    onChange={(e) => setMinutesPerTask(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                    Hourly Value ($)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value) || 10)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl glass-panel">
                  <div className="text-xs text-slate-500 dark:text-zinc-400">Annual Time Reclaimed</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
                    {hoursSavedPerYear} hrs/yr
                  </div>
                </div>
                <div className="p-4 rounded-2xl glass-panel">
                  <div className="text-xs text-slate-500 dark:text-zinc-400">Annual Productivity Value</div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-1">
                    ${annualDollarSavings.toLocaleString()}/yr
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Apple Silicon Memory Bandwidth & LLM Estimator */}
            <div className="lg:col-span-6 space-y-5 border-t lg:border-t-0 lg:border-l border-slate-900/10 dark:border-white/10 pt-6 lg:pt-0 lg:pl-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Apple Silicon Unified Memory & AI Throughput
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Compare hardware memory bandwidth and local 4-bit 70B LLM inference speed across Apple Silicon chips.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(Object.keys(chipSpecs) as Array<keyof typeof chipSpecs>).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedChip(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      selectedChip === key
                        ? 'bg-indigo-600 text-white'
                        : 'glass-pill text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl glass-panel">
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Memory Bandwidth</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                    {activeChip.bandwidthGbs} GB/s
                  </div>
                </div>
                <div className="p-3.5 rounded-xl glass-panel">
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Max Unified RAM</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                    {activeChip.maxRamGb} GB
                  </div>
                </div>
                <div className="p-3.5 rounded-xl glass-panel">
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">70B Q4 Inference</div>
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-0.5">
                    ~{activeChip.max70bToks} tok/s
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKBENCH TAB 5: CONTINUITY & SYNC DOCTOR */}
        {activeWorkbench === 'diagnostics' && (
          <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-400">Loading Continuity Sync Doctor...</div>}>
            <div className="space-y-4">
              <DiagnosticSimulator />
            </div>
          </Suspense>
        )}

        {/* WORKBENCH TAB 6: SILICON MATRIX & ECOSYSTEM PRESETS */}
        {activeWorkbench === 'silicon' && (
          <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-zinc-400">Loading Silicon Architecture Matrix...</div>}>
            <div className="space-y-8">
              <AppleSiliconShowcase />
              <EcosystemSwitcher />
            </div>
          </Suspense>
        )}
      </section>

      {/* =========================================================================
          SECTION 4: VERIFIED APPLE WORKFLOW BLUEPRINTS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-900/10 dark:border-white/10 pb-4">
          <div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Production Blueprints
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Featured Multi-Device Workflows
            </h2>
          </div>
          <a
            href="/library"
            onClick={(e) => {
              e.preventDefault();
              haptics.playTap();
              onNavigate('library');
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto min-h-[36px] whitespace-nowrap"
          >
            <span>Browse all 120+ workflows</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredWorkflows.map((wf) => {
            const theme = getGlassTheme(wf.category);
            return (
              <a
                key={wf.id}
                href={`/workflows/${wf.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  haptics.playTap();
                  setSelectedWorkflowForSheet(wf);
                }}
                className={`${theme.cardClass} p-6 flex flex-col justify-between group cursor-pointer space-y-5 rounded-3xl transition-all duration-300 hover:scale-[1.02] shadow-lg text-left no-underline`}
              >
                <div className="space-y-3">
                  {/* Unboxed metadata with middle dot separator */}
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                    <span className={`font-semibold ${theme.textAccentClass} truncate`}>
                      {wf.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums shrink-0">{wf.setupTimeMinutes}m setup</span>
                  </div>

                  <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                    {wf.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {wf.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900/5 dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white">
                  <span className="font-mono tabular-nums text-[11px]">
                    {wf.steps.length} steps
                  </span>
                  <span className={`font-semibold ${theme.textAccentClass} flex items-center gap-1`}>
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          WORKFLOW INSPECTOR MODAL (BOTTOM SHEET)
          ========================================================================= */}
      {selectedWorkflowForSheet && (
        <IOSBottomSheet
          isOpen={!!selectedWorkflowForSheet}
          onClose={() => setSelectedWorkflowForSheet(null)}
          title={selectedWorkflowForSheet.title}
          description={`${selectedWorkflowForSheet.category} · ${selectedWorkflowForSheet.setupTimeMinutes} min setup`}
        >
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-900/[0.04] dark:bg-white/[0.05] border border-slate-900/10 dark:border-white/10 space-y-2">
              <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 block">
                Blueprint Summary
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed">
                {selectedWorkflowForSheet.summary}
              </p>
            </div>

            <div className="space-y-1 divide-y divide-slate-900/10 dark:divide-white/10 p-3 rounded-2xl bg-slate-900/[0.02] dark:bg-white/[0.03] border border-slate-900/10 dark:border-white/10">
              <IOSToggle
                checked={autoRunInShortcuts}
                onChange={setAutoRunInShortcuts}
                label="Launch in Apple Shortcuts"
                sublabel="Open automation actions directly in macOS or iOS Shortcuts"
              />
              <IOSToggle
                checked={icloudSyncEnabled}
                onChange={setIcloudSyncEnabled}
                label="iCloud Cross-Device Sync"
                sublabel="Keep workflow triggers synchronized across Mac, iPhone, and iPad"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const id = selectedWorkflowForSheet.id;
                  setSelectedWorkflowForSheet(null);
                  onNavigate('workflow-detail', id);
                }}
                className="flex-1 py-3 px-4 rounded-xl glass-button-primary text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Full Blueprint</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWorkflowForSheet(null)}
                className="py-3 px-5 rounded-xl glass-pill text-xs font-semibold text-slate-700 dark:text-zinc-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </IOSBottomSheet>
      )}
    </div>
  );
};
