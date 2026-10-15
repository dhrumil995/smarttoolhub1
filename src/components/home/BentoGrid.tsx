import React from 'react';
import { Smartphone, Sparkles, Mail, FileText, Hash, RefreshCw, Table, Calculator, ArrowUpRight } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';

interface BentoGridProps {
  navigate: (path: string) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ navigate }) => {
  return (
    <section id="tools-grid" className="py-12 sm:py-16 scroll-mt-20">
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#39ff88]">
          <span>Launch Suite · 8 Free AI Tools</span>
        </div>
        <h2 className="h2-fluid font-display text-[#f2f7ff]">
          Built for daily tasks.
        </h2>
        <p className="text-sm sm:text-base text-[#8fa3c0] max-w-xl">
          Tap any tool below to start immediately. No registration, no waitlists, and no paywalls.
        </p>
      </div>

      {/* 12-Column Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Item 1: Flagship Tool - Apple Shortcuts Generator (8 cols on lg) */}
        <div className="md:col-span-12 lg:col-span-8 glass-surface rounded-3xl p-6 sm:p-8 interactive-hover relative flex flex-col justify-between overflow-hidden border border-[rgba(57,255,136,0.25)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[rgba(57,255,136,0.12)] to-transparent pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#39ff88] uppercase tracking-wider">
                  Flagship Tool
                </span>
                <span className="text-[#8fa3c0] text-xs">·</span>
                <span className="text-xs text-[#8fa3c0]">iOS &amp; iPadOS Automation</span>
              </div>
              <span className="font-mono text-xs text-[#39ff88] bg-[#0a1424] px-2.5 py-1 rounded-md border border-[rgba(57,255,136,0.2)]">
                Featured
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#f2f7ff]">
              Apple Shortcuts Generator
            </h3>

            <p className="text-sm sm:text-base text-[#8fa3c0] max-w-xl leading-relaxed">
              Describe any automation in simple words. Get exact, numbered step-by-step instructions to configure it directly inside your iPhone or iPad Shortcuts app.
            </p>

            {/* Quick Demo Preview */}
            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] text-xs text-[#8fa3c0] font-mono space-y-1">
              <div className="text-[#39ff88]">&gt; Input: &ldquo;Send ETA to partner when I leave work&rdquo;</div>
              <div className="text-[#f2f7ff]">
                &rarr; Action 1: Get Current Location · Action 2: Calculate Travel Time · Action 3: Send Message
              </div>
            </div>
          </div>

          <div className="pt-6 relative z-10">
            <Link
              href="/tools/apple-shortcuts-generator"
              navigate={navigate}
              className="btn-laser text-sm"
            >
              <span>Build an Apple Shortcut</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Item 2: AI Prompt Improver (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
              <span className="font-mono uppercase text-[#5aa9ff]">Prompting</span>
              <span>·</span>
              <span>Everyday AI</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] flex items-center justify-center text-[#5aa9ff]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff]">
              AI Prompt Improver
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              Turn vague one-line thoughts into structured prompts with clear roles, rules, and output criteria.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/tools/ai-prompt-improver"
              navigate={navigate}
              className="text-xs font-semibold text-[#39ff88] hover:underline flex items-center gap-1.5 focus-laser rounded"
            >
              <span>Open Prompt Improver</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Item 3: AI Email Writer (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
              <span className="font-mono uppercase text-[#39ff88]">Writing</span>
              <span>·</span>
              <span>Work &amp; Personal</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] flex items-center justify-center text-[#39ff88]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff]">
              AI Email Writer
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              State your purpose, tone, and points. Get a ready-to-send email with polite subject lines and sign-offs.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/tools/ai-email-writer"
              navigate={navigate}
              className="text-xs font-semibold text-[#39ff88] hover:underline flex items-center gap-1.5 focus-laser rounded"
            >
              <span>Open Email Writer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Item 4: AI Summarizer (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
              <span className="font-mono uppercase text-[#ffb840]">Reading</span>
              <span>·</span>
              <span>Instant Notes</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] flex items-center justify-center text-[#ffb840]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff]">
              AI Summarizer
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              Paste long text, articles, or transcripts to extract quick executive bullet points and key takeaways.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/tools/ai-summarizer"
              navigate={navigate}
              className="text-xs font-semibold text-[#39ff88] hover:underline flex items-center gap-1.5 focus-laser rounded"
            >
              <span>Open Summarizer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Item 5: Excel & Google Sheets Formula Helper (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
              <span className="font-mono uppercase text-[#39ff88]">Spreadsheets</span>
              <span>·</span>
              <span>Excel &amp; Sheets</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] flex items-center justify-center text-[#39ff88]">
              <Table className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff]">
              Formula Helper
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              Describe what calculation you need. Get the exact formula with syntax breakdown and cell references.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/tools/formula-helper"
              navigate={navigate}
              className="text-xs font-semibold text-[#39ff88] hover:underline flex items-center gap-1.5 focus-laser rounded"
            >
              <span>Open Formula Helper</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Item 6: Caption & Hashtag Generator (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
              <span className="font-mono uppercase text-[#5aa9ff]">Social</span>
              <span>·</span>
              <span>Instagram &amp; TikTok</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] flex items-center justify-center text-[#5aa9ff]">
              <Hash className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff]">
              Caption &amp; Hashtags
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              Create catchy, natural post captions and niche hashtags to maximize reach without sounding robotic.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/tools/caption-hashtag-generator"
              navigate={navigate}
              className="text-xs font-semibold text-[#39ff88] hover:underline flex items-center gap-1.5 focus-laser rounded"
            >
              <span>Open Caption Tool</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Item 7: Rewrite & Tone Changer (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
              <span className="font-mono uppercase text-[#ffb840]">Tone</span>
              <span>·</span>
              <span>Clarity &amp; Style</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] flex items-center justify-center text-[#ffb840]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff]">
              Rewrite &amp; Tone Changer
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              Make draft copy shorter, more professional, friendlier, or direct while preserving the core message.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/tools/rewrite-tone-changer"
              navigate={navigate}
              className="text-xs font-semibold text-[#39ff88] hover:underline flex items-center gap-1.5 focus-laser rounded"
            >
              <span>Open Tone Changer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Item 8: Quick Calculators (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
              <span className="font-mono uppercase text-[#39ff88]">Utilities</span>
              <span>·</span>
              <span>Instant Offline Math</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] flex items-center justify-center text-[#39ff88]">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff]">
              Quick Calculators
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              Instant Retina @2x/@3x image dimensions, file download/transfer time, and battery charge estimates.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/tools/quick-calculators"
              navigate={navigate}
              className="text-xs font-semibold text-[#39ff88] hover:underline flex items-center gap-1.5 focus-laser rounded"
            >
              <span>Open Calculators</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
