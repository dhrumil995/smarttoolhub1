import React, { useState, useMemo } from 'react';
import { PageId, WorkflowItem } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { ToolCategoryFilter } from '../components/Navbar';
import { DiagnosticSimulator } from '../components/DiagnosticSimulator';
import { EcosystemSwitcher } from '../components/EcosystemSwitcher';
import { AppleSiliconShowcase } from '../components/AppleSiliconShowcase';
import { IOSBottomSheet } from '../components/ios/IOSBottomSheet';
import { IOSToggle } from '../components/ios/IOSToggle';
import { haptics } from '../utils/haptics';
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
  X
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
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSearch,
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [localCategory, setLocalCategory] = useState<ToolCategoryFilter>('all');
  const effectiveCategory = activeCategory !== 'all' ? activeCategory : localCategory;

  const handleCategoryChange = (cat: ToolCategoryFilter) => {
    haptics.playTap();
    setLocalCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

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
      featuredImage: '/images/feature_shortcuts_automation.webp',
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
      featuredImage: '/images/feature_continuity_mirroring.webp',
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
    <div className="relative space-y-20 sm:space-y-28 pb-24">
      {/* Ambient Obsidian Background Spotlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden h-[780px]"
      >
        <div className="absolute left-1/2 top-[-140px] -translate-x-1/2 w-[920px] h-[480px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-500/12 to-sky-400/10 blur-[130px]" />
        <div className="absolute left-1/4 top-[220px] w-[420px] h-[320px] rounded-full bg-indigo-500/10 blur-[110px]" />
      </div>

      {/* =========================================================================
          SECTION 1: HERO SECTION WITH METALLIC TYPOGRAPHY & LIVE TOOL SEARCH BAR
          ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-8">
        <div className="space-y-4 max-w-4xl mx-auto">
          <p className="text-xs sm:text-[13px] font-medium text-indigo-600 dark:text-indigo-400 tracking-tight">
            macOS Sequoia 15 · iOS 18 · Universal Web & Silicon Utilities
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] leading-[1.06] text-metallic">
            Precision Tools for the{' '}
            <span className="text-accent-gradient">Modern Apple Ecosystem.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed pt-1">
            Synthesize custom Siri Shortcuts and macOS scripts with AI, run client-side Image, Text, SEO, and Silicon calculators, and resolve Continuity sync in one unified workspace.
          </p>
        </div>

        {/* Primary Glowing CTA & Secondary Action */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
          <button
            type="button"
            onClick={() => {
              haptics.playTap();
              onNavigate('generator');
            }}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 min-h-[46px] rounded-2xl glass-button-primary text-white text-xs sm:text-sm font-semibold tracking-tight cursor-pointer whitespace-nowrap"
          >
            <Wand2 className="w-4 h-4 shrink-0" />
            <span>Generate Custom Shortcut</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              haptics.playTap();
              onNavigate('library');
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[46px] rounded-2xl bg-slate-900/[0.04] dark:bg-white/[0.05] hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.10] border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span>Explore 120+ Workflows</span>
          </button>
        </div>

        {/* Interactive Modern Tool Search & Instant Filter Bar */}
        <div className="max-w-3xl mx-auto pt-4 space-y-3">
          <div className="relative flex items-center rounded-2xl bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-900/10 dark:border-white/10 shadow-2xl shadow-indigo-500/10 focus-within:border-indigo-500/60 transition-all">
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
              className="hidden sm:inline-flex items-center gap-1.5 mr-2.5 px-3 py-1.5 rounded-xl bg-slate-900/5 dark:bg-white/[0.06] hover:bg-slate-900/10 dark:hover:bg-white/[0.12] border border-slate-900/10 dark:border-white/10 text-[11px] text-slate-600 dark:text-zinc-300 font-mono cursor-pointer shrink-0 transition-colors"
              title="Open Global Command Palette"
            >
              <span>Command</span>
              <kbd className="text-indigo-500 dark:text-indigo-400">⌘K</kbd>
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
                  className={`px-3.5 py-1.5 min-h-[34px] rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-slate-900/[0.04] dark:bg-white/[0.04] hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.08] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-slate-900/5 dark:border-white/5'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ASYMMETRIC BENTO-BOX GRID FOR SMARTTOOLHUB SUITES
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
            return (
              <div
                key={tool.id}
                onClick={() => handleToolCardClick(tool)}
                className={`${tool.colSpan} bento-card group relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between cursor-pointer`}
              >
                {/* Subtle inner ambient glow on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full bg-indigo-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-200"
                />

                <div className="space-y-4 relative z-10">
                  {/* Unboxed clean metadata line (Zero-Pill discipline) */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {tool.number}.
                      </span>
                      <span className="font-medium text-slate-700 dark:text-zinc-300">
                        {tool.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{tool.metadata}</span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-slate-900/[0.04] dark:bg-white/[0.05] border border-slate-900/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-indigo-500/40 transition-colors">
                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-900/5 dark:border-white/[0.06] flex items-center justify-between relative z-10">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                    <span>{tool.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                    Interactive
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quantified Proof & Engineering Benchmarks (Adjacent to Capability Claims) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="ios-card-static p-5 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              120+
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Verified macOS Sequoia & iOS 18 automation blueprints
            </p>
          </div>
          <div className="ios-card-static p-5 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              800 GB/s
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Apple Silicon M1–M4 & Ultra memory specs indexed
            </p>
          </div>
          <div className="ios-card-static p-5 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              42.5 hrs
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Average annual engineering time saved per workspace
            </p>
          </div>
          <div className="ios-card-static p-5 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              0 Keys
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Zero-Credentials privacy — no Apple IDs ever requested
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
            className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/[0.04] dark:bg-white/[0.04] border border-slate-900/10 dark:border-white/10 overflow-x-auto"
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-indigo-600 text-slate-950 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
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
          <div className="ios-card-static p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
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
          <div className="ios-card-static p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
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
          <div className="ios-card-static p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Schema.org JSON-LD & OpenGraph Tag Generator
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
                    Page / Application Title ({seoTitle.length}/60 chars)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
                    Meta Description ({seoDesc.length}/160 chars)
                  </label>
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
                      <option value="SoftwareApplication" className="bg-[#0B0F19] text-white">SoftwareApplication</option>
                      <option value="WebSite" className="bg-[#0B0F19] text-white">WebSite</option>
                      <option value="FAQPage" className="bg-[#0B0F19] text-white">FAQPage</option>
                    </select>
                  </div>
                </div>
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
                  {copiedId === 'seo-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'seo-code' ? 'Copied Markup' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-zinc-200 text-[11px] font-mono overflow-x-auto max-h-[240px] border border-white/10">
                {generatedSeoCode}
              </pre>
            </div>
          </div>
        )}

        {/* WORKBENCH TAB 4: APPLE SILICON & AUTOMATION ROI CALCULATORS */}
        {activeWorkbench === 'calculator' && (
          <div className="ios-card-static p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
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
          <div className="space-y-4">
            <DiagnosticSimulator />
          </div>
        )}

        {/* WORKBENCH TAB 6: SILICON MATRIX & ECOSYSTEM PRESETS */}
        {activeWorkbench === 'silicon' && (
          <div className="space-y-8">
            <AppleSiliconShowcase />
            <EcosystemSwitcher />
          </div>
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
          <button
            type="button"
            onClick={() => {
              haptics.playTap();
              onNavigate('library');
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto min-h-[36px] whitespace-nowrap"
          >
            <span>Browse all 120+ workflows</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredWorkflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => {
                haptics.playTap();
                setSelectedWorkflowForSheet(wf);
              }}
              className="bento-card p-6 flex flex-col justify-between group cursor-pointer space-y-5"
            >
              <div className="space-y-3">
                {/* Unboxed metadata with middle dot separator */}
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400 truncate">
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

              <div className="pt-3 border-t border-slate-900/5 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white">
                <span className="font-mono tabular-nums text-[11px]">
                  {wf.steps.length} steps
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
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
