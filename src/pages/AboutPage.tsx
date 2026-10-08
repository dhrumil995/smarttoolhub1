import React from 'react';
import { PageId } from '../types';
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Award, 
  BookOpen, 
  ExternalLink,
  Users,
  Compass,
  FileCode2,
  Mail,
  ArrowRight
} from 'lucide-react';
import { haptics } from '../utils/haptics';

interface AboutPageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Award className="w-3.5 h-3.5" />
          <span>Editorial Integrity & Engineering Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About SmartToolHub
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
          SmartToolHub is an independent systems engineering publication and utility workbench dedicated to empowering developers, creative professionals, and power users across macOS Sequoia and iOS 18.
        </p>
      </div>

      {/* Mission & Purpose */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ios-card-static p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Authentic Utility</h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Every tool on SmartToolHub executes client-side without third-party bloat, spyware, or account walls. We build tools that developers actually use every day.
          </p>
        </div>

        <div className="ios-card-static p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Silicon Benchmarked</h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            We don't publish theoretical guesses. Every memory bandwidth statistic, AWDL latency metric, and command is empirically validated on real Apple Silicon chips.
          </p>
        </div>

        <div className="ios-card-static p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Zero-Credentials</h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            We never ask for Apple IDs, passwords, or keychain data. All continuity and automation workflows rely strictly on Apple's native, encrypted protocols.
          </p>
        </div>
      </section>

      {/* Founder & Lead Architect */}
      <section className="ios-card-static p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200/80 dark:border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shrink-0">
              DA
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Dhrumil Aslaliya
              </h2>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                Founder, Principal Systems Architect & Lead Maintainer
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Surat, Gujarat, India · Systems Engineer & Apple Ecosystem Researcher
              </p>
            </div>
          </div>
          <a
            href="mailto:contact@smarttoolhub.net"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white shadow-sm"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Architect</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Why SmartToolHub Was Created</h3>
            <p>
              Apple's hardware ecosystem offers incredible cross-device continuity—from Universal Clipboard to iPhone Mirroring and Siri Shortcuts. However, official Apple Developer documentation is frequently fragmented, and user forums are filled with obsolete advice like "reboot both devices" or "sign out of iCloud."
            </p>
            <p>
              SmartToolHub was founded to provide transparent, peer-reviewed engineering teardowns of macOS and iOS subsystem protocols (such as AWDL, Bluetooth LE advertising tokens, and Bonjour mDNS), alongside client-side Retina media, prompt, and Silicon ROI calculators that run completely in-browser with zero latency.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Our Editorial & Lab Testing Standard</h3>
            <p>
              Every technical guide, diagnostic step, and automation blueprint published on SmartToolHub undergoes a 5-step peer-review methodology:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-zinc-300">
              <li><strong>Physical Hardware Verification:</strong> Tested across multiple OS versions on real Apple Silicon.</li>
              <li><strong>Non-Destructive POSIX Rules:</strong> Zero commands that compromise SIP, alter root permissions, or delete data.</li>
              <li><strong>Zero Affiliate Bias:</strong> No paid software sponsorships or pay-to-play review placements.</li>
              <li><strong>Continuous Maintenance:</strong> Blueprints are re-audited whenever Apple releases point updates (e.g., macOS 15.2, iOS 18.2).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Physical Hardware Testing Lab */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Hardware Testing Lab
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Empirically Tested on Physical Apple Hardware
          </h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-2xl">
            We do not rely on virtual machines or simulated environments. All Continuity handshakes, AirDrop peer-to-peer AWDL packets, and memory bandwidth figures are verified on our in-house lab devices:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-panel space-y-2">
            <Laptop className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">MacBook Pro 16" (M4 Max)</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              16-Core CPU, 40-Core GPU, 128GB Unified RAM. Used for local LLM quantization and heavy sips batch image processing.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel space-y-2">
            <Cpu className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Mac Studio (M2 Ultra)</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              24-Core CPU, 76-Core GPU, 800 GB/s bandwidth. Dedicated to testing multi-display Universal Control and ProRes workflows.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel space-y-2">
            <Smartphone className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">iPhone 16 Pro (iOS 18)</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              A18 Pro silicon, Wi-Fi 7, 2x2 MIMO. Used for diagnosing AWDL peer discovery, iPhone Mirroring, and Continuity Camera.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel space-y-2">
            <Tablet className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">iPad Pro 13" (M4)</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Ultra Retina XDR, Apple Pencil Pro. Used for Sidecar latency measurement and cross-device clipboard sync testing.
            </p>
          </div>
        </div>
      </section>

      {/* Commercial Disclosure & Advertising Transparency */}
      <section className="ios-card-static p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Commercial Partnerships & Monetization Disclosure
        </h2>
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          SmartToolHub operates under strict editorial independence. To fund ongoing hardware laboratory expenses, electricity, server hosting, and deep research, we monetize through:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-zinc-400">
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">1. SmartToolHub Pro Subscriptions:</span>
            <p>Direct user support providing access to our live Gemini AI Workflow Synthesizer and deep diagnostic assistant.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">2. Contextual Advertising (Google AdSense):</span>
            <p>Clearly labeled contextual display ads served in compliance with Google AdSense quality and transparency policies.</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-zinc-500 pt-1">
          We never accept sponsored editorial reviews, paid backlink placement, or vendor-influenced testing results. All editorial opinions are solely our own.
        </p>
      </section>

      {/* Quick Navigation to Other Trust Hubs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
        <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
          <a
            href="/guides"
            onClick={(e) => {
              e.preventDefault();
              haptics.playTap();
              onNavigate('guides');
            }}
            className="hover:text-indigo-600 dark:hover:text-white cursor-pointer text-decoration-none"
          >
            Read Engineering Guides →
          </a>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              haptics.playTap();
              onNavigate('privacy');
            }}
            className="hover:text-indigo-600 dark:hover:text-white cursor-pointer text-decoration-none"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              haptics.playTap();
              onNavigate('terms');
            }}
            className="hover:text-indigo-600 dark:hover:text-white cursor-pointer text-decoration-none"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              haptics.playTap();
              onNavigate('contact');
            }}
            className="hover:text-indigo-600 dark:hover:text-white cursor-pointer text-decoration-none"
          >
            Contact & Support
          </a>
        </div>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            haptics.playTap();
            onNavigate('home');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer text-decoration-none"
        >
          <span>Explore Interactive Workbench</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
