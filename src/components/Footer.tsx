import React from 'react';
import { PageId } from '../types';
import { ShieldCheck, Heart, ExternalLink, Mail, MessageSquare, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSitemap }) => {
  return (
    <footer role="contentinfo" className="border-t border-white/[0.08] bg-black text-[#86868B] pt-14 pb-12 mt-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Contact & Help Banner — Apple Style */}
        <div className="mb-12 p-6 sm:p-7 rounded-[22px] bg-white/[0.04] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/15 border border-[#0071E3]/25 flex items-center justify-center text-[#2997FF] shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F5F5F7]">Have a question or workflow request?</p>
              <p className="text-xs text-[#86868B] font-normal">Our editorial and engineering team personally responds to all inquiries.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="mailto:aslaliyamohit9@gmail.com?subject=SmartToolHub%20Query"
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-xs font-normal text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-[0_2px_8px_rgba(0,113,227,0.35)]"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>aslaliyamohit9@gmail.com</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.14] text-xs text-[#F5F5F7] transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Contact Support
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-[9px] overflow-hidden border border-white/20 bg-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <picture>
                  <source srcSet="/logo-sm.webp" type="image/webp" />
                  <img 
                    src="/logo.png" 
                    alt="SmartToolHub verified Apple Workflows and Continuity diagnostics" 
                    width="28" 
                    height="28" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover" 
                  />
                </picture>
              </div>
              <span className="font-semibold text-base text-[#F5F5F7] tracking-[-0.02em]">SmartToolHub</span>
            </div>
            <p className="text-xs text-[#86868B] max-w-sm leading-relaxed font-normal">
              Empowering Mac, iPhone, and iPad users with personalized multi-device workflows, verified Continuity shortcuts, hardware compatibility checks, and diagnostic steps.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-[#86868B]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero-Credentials: No Apple ID or passwords requested.</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-4">Core Tools</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('generator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Workflow Generator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('compatibility')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Device Compatibility Checker
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('troubleshooting')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Troubleshooting Wizard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('library')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Workflow Library
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (onOpenSitemap) {
                      onOpenSitemap();
                    } else {
                      window.open('/sitemap.xml', '_blank');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  title="View auto-generated Google & Bing Sitemap XML"
                >
                  <span>Sitemap & Indexing</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">XML</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Featured Workflows */}
          <div>
            <h4 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-4">Top Workflows</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('workflow-detail', 'wf-continuity-camera-desk-view')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  4K Continuity Desk View
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('workflow-detail', 'wf-universal-control-freelancer-desk')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Universal Control Setup
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('workflow-detail', 'wf-iphone-mirroring-macos-sequoia')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  iPhone Mirroring (macOS 15)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('workflow-detail', 'wf-student-sidecar-handwritten-math')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Sidecar & Apple Pencil
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div>
            <h4 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-4">Trust & Contact</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pricing & Subscriptions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[#68B4FF]"
                >
                  <span>Contact & Support</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#0071E3]/20 text-[#68B4FF]">Fast</span>
                </button>
              </li>
              <li>
                <a 
                  href="mailto:aslaliyamohit9@gmail.com"
                  className="hover:text-white transition-colors text-[11px] font-mono text-[#86868B] block truncate"
                  title="Direct contact email"
                >
                  aslaliyamohit9@gmail.com
                </a>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a 
                  href="https://developer.apple.com/documentation/appintents" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-[11px] text-[#2997FF]"
                  title="Apple Developer App Intents & Shortcuts Documentation"
                >
                  <span>Apple App Intents Spec</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a 
                  href="https://support.apple.com/guide/security/welcome/web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-[11px] text-zinc-400"
                  title="Apple Platform Security Architecture Guide"
                >
                  <span>Apple Platform Security</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a 
                  href="https://opensource.apple.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-[11px] text-zinc-400"
                  title="Apple Open Source Darwin & macOS Foundation"
                >
                  <span>Apple Open Source</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a 
                  href="https://support.apple.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-[11px] text-zinc-400"
                >
                  <span>Official Apple Support</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer & Status — Apple Style */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#666666]">
          <p className="text-center md:text-left leading-relaxed max-w-4xl">
            SmartToolHub is an independent reference publication and workflow discovery tool. 
            Mac, iPhone, iPad, macOS, iOS, iPadOS, AirDrop, Sidecar, and Apple Intelligence are registered trademarks of Apple Inc. 
            SmartToolHub is not affiliated with, endorsed by, or sponsored by Apple Inc.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </span>
            <span>•</span>
            <span>© 2026 SmartToolHub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
