import React from 'react';
import { PageId } from '../types';
import { ShieldCheck, ExternalLink, Mail, Wand2, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSitemap }) => {
  return (
    <footer
      role="contentinfo"
      className="border-t border-slate-900/10 dark:border-white/10 bg-[#F1F5F9] dark:bg-[#02050E] text-slate-500 dark:text-zinc-400 pt-16 pb-14 mt-20 relative z-10 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* High-End Conversion & Support CTA Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-900/10 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl shadow-2xl shadow-indigo-500/5">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Ready to automate your Apple workspace?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              Synthesize custom Siri Shortcuts, benchmark Apple Silicon, or reach our engineering team for custom workflow requests.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('generator')}
              className="px-5 py-2.5 min-h-[40px] rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Launch Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 min-h-[40px] rounded-xl bg-slate-900/[0.05] dark:bg-white/[0.06] hover:bg-slate-900/[0.10] dark:hover:bg-white/[0.12] border border-slate-900/10 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Contact Engineering
            </button>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900/10 dark:border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-900/10 dark:border-white/15 bg-slate-900/5 dark:bg-white/[0.06] shadow-sm shrink-0">
                <picture>
                  <source srcSet="/logo-sm.webp" type="image/webp" />
                  <img
                    src="/logo.png"
                    alt="SmartToolHub"
                    width="28"
                    height="28"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                SmartToolHub
              </span>
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
                <button
                  type="button"
                  onClick={() => onNavigate('generator')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  AI Shortcut Generator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('compatibility')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Compatibility Matrix
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('troubleshooting')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Continuity Sync Doctor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('library')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  120+ Workflow Library
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenSitemap) {
                      onOpenSitemap();
                    }
                  }}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sitemap & Search Index
                </button>
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
                <button
                  type="button"
                  onClick={() => onNavigate('workflow-detail', 'wf-continuity-camera-desk-view')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  4K Continuity Desk View
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('workflow-detail', 'wf-universal-control-freelancer-desk')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  Universal Control Setup
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('workflow-detail', 'wf-iphone-mirroring-macos-sequoia')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  iPhone Mirroring (macOS 15)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('workflow-detail', 'wf-student-sidecar-handwritten-math')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                >
                  Sidecar & Apple Pencil
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-4">
              Resources & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Pricing & Pro Access
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  href="https://developer.apple.com/documentation/appintents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Apple App Intents Docs</span>
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
