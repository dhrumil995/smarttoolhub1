import React from 'react';
import { PageId } from '../types';
import { 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Mail, 
  ArrowRight,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { haptics } from '../utils/haptics';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Independent Apple Toolbox</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About SmartToolHub
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          SmartToolHub is a free toolbox built for everyday iPhone, iPad, and Mac owners. Build Apple Shortcuts in seconds, calculate charging times, and discover easy automation recipes in plain English.
        </p>
      </div>

      {/* Core Mission Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ios-card-static p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Built for Everyday Users</h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Every tool on SmartToolHub runs instantly in your browser with zero bloat, no forced sign-ups, and no technical jargon. Practical tools designed for everyday Apple owners.
          </p>
        </div>

        <div className="ios-card-static p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Apple Shortcuts Focused</h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Clear, step-by-step shortcuts and automation recipes. We focus on Apple's built-in tools like Siri Shortcuts, AirDrop, and Continuity that cost nothing to use.
          </p>
        </div>

        <div className="ios-card-static p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Zero Credentials Required</h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            We never ask for Apple IDs, passwords, or personal credentials. All calculations run client-side in your web browser with complete privacy.
          </p>
        </div>
      </section>

      {/* Creator & Maintainer */}
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
                Creator &amp; Independent Maintainer
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Surat, Gujarat, India · Apple Ecosystem Enthusiast &amp; Web Developer
              </p>
            </div>
          </div>
          <a
            href="mailto:contact@smarttoolhub.net"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white shadow-sm"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Creator</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Why SmartToolHub Was Created</h3>
            <p>
              Apple's Shortcuts app is one of the most powerful tools on iPhone, iPad, and Mac, but building workflows from scratch can feel daunting. Many guides online are either too technical or buried behind complicated forums.
            </p>
            <p>
              SmartToolHub was created to make automation accessible to everyone. Simply describe what you want in plain English, and generate ready-to-use Shortcuts action steps in seconds.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Our Editorial Principles</h3>
            <p>
              Every guide and tool on SmartToolHub follows clear, honest principles:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-zinc-300">
              <li><strong>Plain English:</strong> Short sentences and easy instructions without confusing jargon.</li>
              <li><strong>Safe &amp; Non-Destructive:</strong> Only safe, native actions that never endanger your device or data.</li>
              <li><strong>Independent:</strong> We are independent and not affiliated with Apple Inc.</li>
              <li><strong>Continuous Maintenance:</strong> Blueprints are kept up to date with new iOS and macOS versions.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Supported Apple Ecosystem Devices */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Apple Ecosystem
          </p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Built for Your Devices
          </h2>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-2xl">
            SmartToolHub workflows and tools work across the Apple devices you use every day:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-panel space-y-2">
            <Smartphone className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">iPhone</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              iOS 16, iOS 17, and iOS 18 automations, Action Button triggers, and fast charging estimates.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel space-y-2">
            <Tablet className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">iPad</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              iPadOS Split View, Apple Pencil shortcuts, Stage Manager setups, and Universal Clipboard.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel space-y-2">
            <Laptop className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Mac</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              macOS Sonoma and Sequoia Shortcuts, menu bar triggers, Quick Actions, and Finder automations.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel space-y-2">
            <Cpu className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Apple Watch &amp; Home</h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Wrist complications, watchOS action triggers, and HomeKit smart home automation recipes.
            </p>
          </div>
        </div>
      </section>

      {/* Commercial Disclosure & Advertising Transparency */}
      <section className="ios-card-static p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Monetization &amp; Independence Disclosure
        </h2>
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          SmartToolHub operates under strict editorial independence. To fund website hosting, domain renewal, and ongoing development, the site is supported through:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-zinc-400">
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">1. SmartToolHub Pro Subscriptions:</span>
            <p>Optional supporter plans that unlock AI workflow generation and advanced features.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">2. Contextual Advertising:</span>
            <p>Non-intrusive display ads served in compliance with Google AdSense quality guidelines.</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-zinc-500 pt-1">
          We never accept paid reviews or sponsored placements. All guides and opinions are independent. SmartToolHub is not affiliated with Apple Inc.
        </p>
      </section>

      {/* Quick Navigation */}
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
            Read Shortcuts Guides →
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
            Contact
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
          <span>Generate Apple Shortcuts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
