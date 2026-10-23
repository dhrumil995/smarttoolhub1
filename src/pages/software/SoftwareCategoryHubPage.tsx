import React, { useState, useMemo } from 'react';
import { Search, Filter, ExternalLink, ArrowRight, ShieldCheck, Check, Terminal, Laptop, Smartphone, Apple, HelpCircle, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs.tsx';
import { SOFTWARE_APPS, DirectoryApp } from '../../data/softwareDirectory.ts';
import { COMPARISONS } from '../../data/comparisons.ts';

interface SoftwareCategoryHubPageProps {
  platform: 'apple' | 'android' | 'pc';
  navigate: (path: string) => void;
}

const PLATFORM_CONFIG = {
  apple: {
    title: 'Apple & Mac Software Directory',
    slug: 'apple-tools',
    platformLabel: 'macOS / iOS',
    icon: Apple,
    themeColor: '#8b5cf6',
    intro: `Welcome to the SmartToolHub curated Apple & Mac Software Directory. Modern macOS and iOS environments are renowned for polished design and hardware integration, yet power users, software developers, and creative professionals frequently encounter functional gaps: window snapping limitations, basic default audio volume routing, uncompressed media playback challenges, and complex external display controls.

Our directory features exclusively vetted, open-source and reputable native desktop applications built specifically for macOS. Every application listed here is evaluated on its genuine utility, battery efficiency, and privacy architecture. Unlike generic download portals that push bundled toolbars or sponsored rankings, we provide frank assessments: what each app does in plain words, who it is best suited for, two honest drawbacks to expect, and recommended zero-cost alternatives. All terminal installation commands utilize verified Homebrew casks, allowing you to deploy your entire Mac workspace cleanly and without manual installer drag-and-drops.`,
    relatedTools: [
      { name: 'Apple Shortcuts Generator', slug: 'apple-shortcuts-generator', desc: 'Generate custom iOS and macOS Shortcuts automation recipes.' },
      { name: 'Retina Image Size Calculator', slug: 'retina-image-size-calculator', desc: 'Calculate @1x, @2x, and @3x asset exports for Apple displays.' },
      { name: 'Battery Wear Calculator', slug: 'battery-wear-calculator', desc: 'Evaluate MacBook and iPad battery capacity degradation against factory specs.' },
      { name: 'Mac & Windows Shortcut Translator', slug: 'mac-windows-shortcut-translator', desc: 'Translate 85+ keyboard shortcuts between macOS and Windows.' },
    ],
  },
  android: {
    title: 'Android Power Tools Directory',
    slug: 'android-tools',
    platformLabel: 'Android',
    icon: Smartphone,
    themeColor: '#34e0a1',
    intro: `Welcome to the curated Android Power Tools Directory. Android provides unrivaled flexibility among mobile operating systems, allowing users to automate routine actions, manage background processes, and stream display feeds over low-latency connections without compromising security or rooting devices.

This directory focuses on verified open-source utilities, developer debugging tools, and system automation platforms available via official repositories such as GitHub and F-Droid. We detail how modern tools utilize Android 11+ Wireless Debugging and the Shizuku framework to grant fine-grained permissions without needing a computer tether or permanent bootloader modifications. Each entry includes plain-language feature summaries, permissions notices, realistic drawbacks, and verified ADB command templates. We strictly prohibit cracked software, carrier locks, FRP bypasses, or activation circumventions—highlighting only legitimate tools built by trusted open-source developers.`,
    relatedTools: [
      { name: 'ADB & Fastboot Command Builder', slug: 'adb-fastboot-command-builder', desc: 'Build exact Android Debug Bridge sequences for debloating and wireless pairing.' },
      { name: 'Android Automation Recipe Generator', slug: 'android-automation-generator', desc: 'Generate triggers and actions for Tasker and MacroDroid.' },
      { name: 'Battery Wear Calculator', slug: 'battery-wear-calculator', desc: 'Calculate smartphone battery health percentage and capacity loss.' },
      { name: 'LocalSend & File Transfer Time', slug: 'file-transfer-time-calculator', desc: 'Estimate transfer times for gigabyte video and backup files.' },
    ],
  },
  pc: {
    title: 'PC & Windows Software Directory',
    slug: 'pc-tools',
    platformLabel: 'Windows',
    icon: Laptop,
    themeColor: '#0a84ff',
    intro: `Welcome to the SmartToolHub PC & Windows Software Directory. Windows 11 and Windows 10 power hundreds of millions of personal computers worldwide, but out-of-the-box installations often suffer from sluggish indexing, cluttered context menus, and basic default system diagnostic tools.

This directory collects the definitive toolkit of high-performance utilities, file managers, storage analyzers, and desktop enhancers trusted by software engineers and IT professionals. From high-speed NTFS Master File Table analyzers like WizTree and Everything to customizable window tiling tools like Microsoft PowerToys, every utility featured here is vetted for performance, memory footprint, and safety. Each entry includes verified Windows Package Manager (winget) one-line install commands, two honest limitations, and links to matched browser calculators so you can inspect file hashes, drive speeds, and hardware telemetry directly in your browser.`,
    relatedTools: [
      { name: 'Install Command Generator', slug: 'install-command-generator', desc: 'Select apps from a checklist to generate unified winget install scripts.' },
      { name: 'File Checksum Verifier', slug: 'file-checksum-verifier', desc: 'Compute SHA-256 and MD5 hashes locally before flashing or installing.' },
      { name: 'Drive Speed Requirement Calculator', slug: 'drive-speed-requirement-calculator', desc: 'Verify if your SSD can sustain multi-stream ProRes or RAW video bitrates.' },
      { name: 'Drive Health Reader (S.M.A.R.T.)', slug: 'drive-health-reader', desc: 'Check reallocated sectors, operating temps, and NVMe TBW endurance.' },
    ],
  },
};

export const SoftwareCategoryHubPage: React.FC<SoftwareCategoryHubPageProps> = ({ platform, navigate }) => {
  const config = PLATFORM_CONFIG[platform];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter apps matching platform
  const apps = useMemo(() => {
    return Object.values(SOFTWARE_APPS).filter((app) => app.platform === platform);
  }, [platform]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => set.add(a.category));
    return ['All', ...Array.from(set)];
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.whoItsFor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apps, selectedCategory, searchQuery]);

  // Matching comparison guides
  const relevantComparisons = useMemo(() => {
    if (platform === 'pc') {
      return [
        COMPARISONS['wiztree-vs-treesize'],
        COMPARISONS['rufus-vs-ventoy'],
        COMPARISONS['powertoys-vs-flow-launcher'],
      ];
    }
    if (platform === 'apple') {
      return [COMPARISONS['3utools-vs-imazing']];
    }
    if (platform === 'android') {
      return [COMPARISONS['shizuku-adb-wireless-guide']];
    }
    return [];
  }, [platform]);

  // Schema.org BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://smarttoolhub.net/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: config.title,
        item: `https://smarttoolhub.net/${config.slug}`,
      },
    ],
  };

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-[#050a14] text-[#f2f7ff] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: config.title },
          ]}
          navigate={navigate}
        />

        {/* Hero Header */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-5 relative overflow-hidden">
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: config.themeColor }}
          />

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[rgba(143,163,192,0.2)] bg-[#101c33]"
              style={{ color: config.themeColor }}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                Software Directory
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff]">
                {config.title}
              </h1>
            </div>
          </div>

          <div className="text-sm sm:text-base text-[#9aaccb] leading-relaxed max-w-4xl space-y-3">
            {config.intro.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="pt-2 text-xs font-mono text-[#9aaccb] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34e0a1]" />
            <span>Based on official documentation and developer descriptions. No sponsored rankings.</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aaccb]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${config.platformLabel} apps (e.g. PowerToys, WizTree, archiver)...`}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#f2f7ff] placeholder-[#9aaccb] focus-ring"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all focus-ring ${
                    selectedCategory === cat
                      ? 'bg-[#101c33] border border-[#0a84ff] text-[#f2f7ff] shadow-sm'
                      : 'bg-[#0a1424] border border-[rgba(143,163,192,0.14)] text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* App Directory Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#9aaccb]">
            <span>Showing {filteredApps.length} verified applications</span>
            <span>Click any app for full editorial review & drawbacks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.slug}
                onClick={() => navigate(`/${config.slug}/${app.slug}`)}
                className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] hover:border-[#0a84ff] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101c33] text-[#6c7dff] uppercase font-bold">
                        {app.category}
                      </span>
                      <h3 className="text-lg font-bold text-[#f2f7ff] group-hover:text-[#0a84ff] transition-colors mt-1.5">
                        {app.name}
                      </h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#9aaccb] group-hover:text-[#0a84ff] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>

                  <p className="text-xs text-[#9aaccb] leading-relaxed line-clamp-2">
                    {app.tagline}
                  </p>

                  <div className="p-3 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#34e0a1] font-bold block">
                      Best For:
                    </span>
                    <p className="text-xs text-[#f2f7ff] line-clamp-2">
                      {app.whoItsFor}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(143,163,192,0.1)] text-xs font-mono text-[#9aaccb]">
                  {app.wingetId ? (
                    <span className="text-[11px] text-[#6c7dff]">winget: {app.wingetId}</span>
                  ) : app.brewName ? (
                    <span className="text-[11px] text-[#8b5cf6]">brew: {app.brewName}</span>
                  ) : (
                    <span>Direct Download</span>
                  )}
                  <span className="text-[11px] text-[#0a84ff] group-hover:underline">
                    Read Review &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
              <Search className="w-8 h-8 text-[#9aaccb] mx-auto opacity-50" />
              <p className="text-sm text-[#f2f7ff] font-bold">No applications found</p>
              <p className="text-xs text-[#9aaccb]">
                Try adjusting your search query or reset the category filter to "All".
              </p>
            </div>
          )}
        </div>

        {/* In-depth Head-to-Head Comparisons */}
        {relevantComparisons.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Head-to-Head Comparison Guides</span>
              </span>
              <span className="text-xs font-mono text-[#9aaccb]">
                Objective Benchmarks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {relevantComparisons.map((comp) => (
                <div
                  key={comp.slug}
                  onClick={() => navigate(`/compare/${comp.slug}`)}
                  className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] hover:border-[#6c7dff] cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#9aaccb] uppercase">Comparison</span>
                    <h4 className="text-sm font-bold text-[#f2f7ff] group-hover:text-[#6c7dff] transition-colors leading-snug">
                      {comp.optionAName} vs {comp.optionBName}
                    </h4>
                    <p className="text-xs text-[#9aaccb] line-clamp-2">
                      {comp.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#6c7dff] flex items-center gap-1">
                    <span>View Comparison</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related SmartToolHub Calculators & Tools */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#34e0a1] font-bold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>Related Browser Tools & Diagnostics</span>
            </span>
            <span className="text-xs font-mono text-[#9aaccb]">
              Zero-Install Browser Tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {config.relatedTools.map((t) => (
              <div
                key={t.slug}
                onClick={() => navigate(`/tools/${t.slug}`)}
                className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] hover:border-[#34e0a1] cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#f2f7ff] group-hover:text-[#34e0a1] transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-[#9aaccb] line-clamp-2 mt-1">
                    {t.desc}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#34e0a1] flex items-center gap-1">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
