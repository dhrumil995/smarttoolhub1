import React from 'react';
import { PageId } from '../types';
import { ShieldCheck, ExternalLink, Mail, Wand2, ArrowRight } from 'lucide-react';
import luxuryLogoImg from '../assets/images/smarttoolhub_luxury_logo_1790827199493.jpg';

interface FooterProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSitemap?: () => void;
  onOpenSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSitemap, onOpenSettings }) => {
  return (
    <footer
      role="contentinfo"
      className="border-t border-slate-900/10 dark:border-white/10 bg-[#F1F5F9] dark:bg-[#02050E] text-slate-500 dark:text-zinc-400 pt-16 pb-14 mt-20 relative z-10 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* High-End Conversion & Support CTA Banner */}
        <div className="mb-14 p-6 sm:p-8 ios-card-static flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 max-w-2xl relative z-10">
            <div className="hidden sm:flex w-16 h-16 rounded-2xl overflow-hidden border border-white/20 bg-[#030712] shrink-0 shadow-[0_10px_30px_rgba(99,102,241,0.3)]">
              <img
                src={luxuryLogoImg}
                onError={(e) => {
                  e.currentTarget.src = '/images/smarttoolhub_luxury_logo_1790827199493.jpg';
                }}
                alt="SmartToolHub Studio Emblem"
                width="64"
                height="64"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-105"
              />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Ready to automate your Apple workspace?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Synthesize custom Siri Shortcuts, benchmark Apple Silicon, or reach our engineering team for custom workflow requests.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0 relative z-10">
            <a
              href="/generator"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('generator');
              }}
              className="px-5 py-2.5 min-h-[40px] rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Launch Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              className="px-5 py-2.5 min-h-[40px] rounded-xl glass-pill text-xs font-semibold text-slate-900 dark:text-white cursor-pointer whitespace-nowrap"
            >
              Contact Engineering
            </a>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80 dark:border-white/15">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-300 dark:border-white/25 bg-[#030712] shadow-[0_4px_14px_rgba(99,102,241,0.25)] shrink-0">
                <img
                  src={luxuryLogoImg}
                  onError={(e) => {
                    e.currentTarget.src = '/images/smarttoolhub_luxury_logo_1790827199493.jpg';
                  }}
                  alt="SmartToolHub"
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none text-slate-900 dark:text-white tracking-tight">
                  SmartToolHub
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 mt-0.5">
                  Obsidian Pro Ecosystem
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Precision multi-device automations, client-side media & SEO utilities, and Continuity diagnostics for macOS Sequoia and iOS 18.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>Zero-Credentials Architecture · No passwords required</span>
            </div>
          </div>

          {/* Core Suites */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-4">
              Platform Suites
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="/generator"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('generator');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  AI Shortcut Generator
                </a>
              </li>
              <li>
                <a
                  href="/compatibility"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('compatibility');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Compatibility Matrix
                </a>
              </li>
              <li>
                <a
                  href="/troubleshooting"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('troubleshooting');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Continuity Sync Doctor
                </a>
              </li>
              <li>
                <a
                  href="/library"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('library');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  120+ Workflow Library
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  onClick={(e) => {
                    if (onOpenSitemap) {
                      e.preventDefault();
                      onOpenSitemap();
                    }
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sitemap & Search Index
                </a>
              </li>
            </ul>
          </div>

          {/* Featured Blueprints */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-4">
              Popular Blueprints
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="/workflows/continuity-camera-desk-view"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('workflow-detail', 'wf-continuity-camera-desk-view');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  4K Continuity Desk View
                </a>
              </li>
              <li>
                <a
                  href="/workflows/universal-control-freelancer-desk"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('workflow-detail', 'wf-universal-control-freelancer-desk');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  Universal Control Setup
                </a>
              </li>
              <li>
                <a
                  href="/workflows/iphone-mirroring-macos-sequoia"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('workflow-detail', 'wf-iphone-mirroring-macos-sequoia');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  iPhone Mirroring (macOS 15)
                </a>
              </li>
              <li>
                <a
                  href="/workflows/student-sidecar-handwritten-math"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('workflow-detail', 'wf-student-sidecar-handwritten-math');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  Sidecar & Apple Pencil
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-4">
              Editorial & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenSettings?.()}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Preferences & Haptics</span>
                </button>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('about');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  About SmartToolHub
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('guides');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Engineering Guides
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('privacy');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('terms');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Support
                </a>
              </li>
              <li>
                <a
                  href="/ads.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>ads.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Copyright & Independent Publication Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-zinc-500">
          <p className="text-center md:text-left leading-relaxed max-w-3xl">
            SmartToolHub is an independent engineering reference and workflow utility platform. Mac, iPhone, iPad, macOS, iOS, AirDrop, Sidecar, and Apple Intelligence are trademarks of Apple Inc.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="mailto:aslaliyamohit9@gmail.com"
              className="hover:text-slate-900 dark:hover:text-zinc-300 transition-colors font-mono"
            >
              aslaliyamohit9@gmail.com
            </a>
            <span aria-hidden="true">·</span>
            <span>© 2026 SmartToolHub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
