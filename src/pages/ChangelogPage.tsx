import React, { useState } from 'react';
import { Sparkles, Calendar, Tag, Terminal, ExternalLink, Rss, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Filter } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs.tsx';

interface ChangelogPageProps {
  navigate: (path: string) => void;
}

interface ReleaseItem {
  version: string;
  date: string;
  tagline: string;
  badge: string;
  type: 'Major' | 'Feature' | 'Update';
  highlights: string[];
  links: Array<{ title: string; href: string }>;
  description: string;
}

const RELEASES: ReleaseItem[] = [
  {
    version: 'v2.4',
    date: 'October 2026',
    tagline: 'Curated Software Directory & Head-to-Head Comparison Guides',
    badge: 'Latest Release',
    type: 'Major',
    description:
      'Added 50 deeply researched software profiles across PC, Apple, and Android ecosystems, alongside 5 objective head-to-head comparison benchmarks with verified winget and Homebrew cask commands.',
    highlights: [
      '50 Software Profiles with 350+ words original reviews, drawbacks, who it is for, and CLI commands.',
      '3 Platform Category Hubs: /pc-tools (20 apps), /apple-tools (10 apps), /android-tools (20 apps).',
      '5 Head-to-Head Comparison Guides (WizTree vs TreeSize, Rufus vs Ventoy, PowerToys vs Flow Launcher, 3uTools vs iMazing, Shizuku & ADB Guide).',
      'Interactive Bulk Script Builder on directory hubs to generate unified multi-app winget/brew commands.',
      'Apple Official Backup Advisory & honest drawbacks on every software profile without sponsored rankings.',
    ],
    links: [
      { title: 'PC & Windows Directory', href: '/pc-tools' },
      { title: 'Apple & Mac Directory', href: '/apple-tools' },
      { title: 'Android Directory', href: '/android-tools' },
      { title: 'Rufus vs Ventoy Comparison', href: '/compare/rufus-vs-ventoy' },
    ],
  },
  {
    version: 'v2.3',
    date: 'October 2026',
    tagline: 'Automation & Command Helpers with Gemini Backend Proxies',
    badge: 'Feature Pack',
    type: 'Feature',
    description:
      'Introduced developer and power-user automation assistants powered by server-side Gemini 2.5 Flash models with real-time parameter validation and rate limiting.',
    highlights: [
      'Android Automation Recipe Generator for Tasker and MacroDroid triggers.',
      'AutoHotkey v2 Script Generator for Windows hotkeys, GUI automation, and window tiling.',
      'ADB & Fastboot Command Builder with interactive wireless debugging and debloating templates.',
      'Command Explainer decoding complex bash, PowerShell, and Docker one-liners parameter-by-parameter.',
      'Battery Wear Calculator forecasting smartphone and laptop battery cycles and capacity degradation.',
    ],
    links: [
      { title: 'Android Automation Generator', href: '/tools/android-automation-generator' },
      { title: 'AutoHotkey v2 Generator', href: '/tools/autohotkey-script-generator' },
      { title: 'ADB & Fastboot Builder', href: '/tools/adb-fastboot-command-builder' },
    ],
  },
  {
    version: 'v2.2',
    date: 'September 2026',
    tagline: 'Zero-Install Browser Diagnostics & Hardware Utilities',
    badge: 'Feature Pack',
    type: 'Feature',
    description:
      'Launched 8 offline-first client-side browser tools for hardware diagnostics, network subnet calculations, and package manager generation.',
    highlights: [
      'Unified Install Command Generator with multi-package winget, brew, apt, and choco exports.',
      'File Checksum Verifier using browser Web Crypto API (SHA-256, MD5) with zero cloud upload.',
      'CIDR Subnet Calculator with binary breakdowns, host ranges, and wildcard mask computation.',
      'Bootable USB Chooser with 5-question recommendation engine for Rufus, Ventoy, Etcher, and Raspberry Pi Imager.',
      'Drive Speed Requirement Calculator calculating ProRes 422 HQ / RAW 4K-8K bitrate thresholds.',
      'Drive Health S.M.A.R.T. Reader decoding NVMe and SATA telemetry safely in the browser.',
      'Mac & Windows Shortcut Translator with 85+ mapped keyboard shortcuts.',
      'Batch QR Code Generator generating up to 50 SVG/PNG codes with instant ZIP download.',
    ],
    links: [
      { title: 'File Checksum Verifier', href: '/tools/file-checksum-verifier' },
      { title: 'CIDR Subnet Calculator', href: '/tools/cidr-subnet-calculator' },
      { title: 'Drive Health Reader', href: '/tools/drive-health-reader' },
    ],
  },
  {
    version: 'v2.1',
    date: 'September 2026',
    tagline: 'Private Client-Side File Processing Engine',
    badge: 'Privacy Update',
    type: 'Feature',
    description:
      'Deployed client-side WebAssembly and PDF engines allowing users to merge, split, and OCR documents without sending sensitive documents to external servers.',
    highlights: [
      'PDF Merge & PDF Split operating 100% locally in browser memory using pdf-lib.',
      'Image to PDF converter supporting multi-page drag-and-drop collation.',
      'Image to Text OCR utilizing WebAssembly Tesseract.js engine for private text extraction.',
      'Strict zero-telemetry guarantee: zero document data leaves client memory.',
    ],
    links: [
      { title: 'PDF Merge', href: '/tools/pdf-merge' },
      { title: 'Image to Text OCR', href: '/tools/image-to-text-ocr' },
    ],
  },
  {
    version: 'v2.0',
    date: 'August 2026',
    tagline: 'Productivity & Focus AI Assistants',
    badge: 'Ecosystem',
    type: 'Update',
    description:
      'Expanded daily workflow productivity tools for students, freelancers, and analysts.',
    highlights: [
      'Excel & Google Sheets Formula Helper solving nested formulas and REGEX queries.',
      'Task Breaker breaking daunting multi-day projects into 15-minute actionable steps.',
      'Freelancer Invoice Generator with client-side PDF export and tax calculations.',
      'Study Plan Maker and Flashcard Quiz Generator for accelerated technical learning.',
    ],
    links: [
      { title: 'Formula Helper', href: '/tools/formula-helper' },
      { title: 'Task Breaker', href: '/tools/task-breaker' },
    ],
  },
  {
    version: 'v1.0',
    date: 'July 2026',
    tagline: 'SmartToolHub Launch & Apple Ecosystem Utilities',
    badge: 'Initial Launch',
    type: 'Major',
    description:
      'Initial release of SmartToolHub with foundational Apple utilities, instant AI prompt optimizers, and zero-registration tools.',
    highlights: [
      'Apple Shortcuts Generator with step-by-step iOS action plans.',
      'Retina Image Size Calculator for @1x, @2x, @3x developer assets.',
      'iPhone Charging Time and File Transfer Time calculators.',
      'Responsive dark-first theme with Navy Black and Laser Green aesthetic.',
    ],
    links: [
      { title: 'Apple Shortcuts Generator', href: '/tools/apple-shortcuts-generator' },
      { title: 'Retina Calculator', href: '/tools/retina-image-size-calculator' },
    ],
  },
];

export const ChangelogPage: React.FC<ChangelogPageProps> = ({ navigate }) => {
  const [filterType, setFilterType] = useState<string>('All');

  const filteredReleases = RELEASES.filter((r) => {
    if (filterType === 'All') return true;
    return r.type === filterType;
  });

  return (
    <div className="min-h-screen bg-[#050a14] text-[#f2f7ff] pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Changelog & Releases' },
          ]}
          navigate={navigate}
        />

        {/* Hero Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none bg-[#0a84ff]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0a84ff] font-bold">
                Platform Evolution
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff]">
                Changelog &amp; Release History
              </h1>
            </div>

            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs font-mono text-[#f2f7ff] hover:border-[#0a84ff] hover:text-[#0a84ff] transition-all self-start sm:self-auto"
            >
              <Rss className="w-4 h-4 text-[#ff9500]" />
              <span>RSS Updates Feed</span>
              <ExternalLink className="w-3 h-3 text-[#9aaccb]" />
            </a>
          </div>

          <p className="text-sm sm:text-base text-[#9aaccb] leading-relaxed max-w-2xl">
            Track every new browser tool, software profile, and algorithm enhancement deployed to SmartToolHub.
            We ship fast, privacy-first tools with zero tracking and zero mandatory sign-up.
          </p>

          <div className="flex items-center gap-2 text-xs font-mono text-[#34e0a1] pt-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Open, transparent development. All tools run client-side or via secure server proxies.</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#9aaccb] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {['All', 'Major', 'Feature', 'Update'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                filterType === type
                  ? 'bg-[#101c33] border border-[#0a84ff] text-[#f2f7ff]'
                  : 'bg-[#0a1424] border border-[rgba(143,163,192,0.12)] text-[#9aaccb] hover:text-[#f2f7ff]'
              }`}
            >
              {type === 'All' ? 'All Releases' : type}
            </button>
          ))}
        </div>

        {/* Release Timeline */}
        <div className="space-y-6">
          {filteredReleases.map((release) => (
            <div
              key={release.version}
              className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-5 hover:border-[rgba(10,132,255,0.4)] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(143,163,192,0.12)] pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#0a84ff]">
                    {release.version}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-[#f2f7ff]">
                    {release.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#9aaccb]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{release.date}</span>
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#f2f7ff]">
                  {release.tagline}
                </h2>
                <p className="text-sm text-[#9aaccb] mt-1.5 leading-relaxed">
                  {release.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#34e0a1] font-bold block">
                  Key Changes &amp; Additions:
                </span>
                <ul className="space-y-2">
                  {release.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#f2f7ff]/90 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#34e0a1] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Jump Links */}
              {release.links.length > 0 && (
                <div className="pt-3 border-t border-[rgba(143,163,192,0.1)] flex flex-wrap gap-2">
                  {release.links.map((link) => (
                    <button
                      key={link.title}
                      type="button"
                      onClick={() => navigate(link.href)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.14)] text-xs text-[#9aaccb] hover:text-[#0a84ff] hover:border-[#0a84ff] transition-all"
                    >
                      <span>{link.title}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
