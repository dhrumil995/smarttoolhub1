import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { IconTile } from '../ui/IconTile.tsx';

interface BentoGridProps {
  navigate: (path: string) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ navigate }) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
            <span>Featured Suite · 6 Flagship Tools</span>
          </div>
          <h2 className="h2-fluid font-display text-[#f2f7ff] mt-2">
            Engineered for clarity and speed<span className="text-[#0a84ff]">.</span>
          </h2>
        </div>
        <p className="body-fluid text-[#8fa3c0] max-w-md">
          Zero login barriers. High-signal outputs formatted for immediate use.
        </p>
      </div>

      {/* Exactly 6 Most Important Tools Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Item 1: Apple Shortcuts Generator (Featured Hero - 8 cols on lg) */}
        <div className="md:col-span-12 lg:col-span-8 glass-surface rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group interactive-hover border border-[rgba(143,163,192,0.16)]">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconTile icon="Workflow" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#0a84ff] uppercase tracking-wider">
                      Flagship Tool
                    </span>
                    <span className="text-[#8fa3c0] text-xs">·</span>
                    <span className="text-xs text-[#8fa3c0]">iOS &amp; iPadOS Automation</span>
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs text-[#0a84ff] bg-[#0a1424] px-2.5 py-1 rounded-md border border-[rgba(10,132,255,0.2)]">
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
              <div className="text-[#0a84ff]">&gt; Input: &ldquo;Send ETA to partner when I leave work&rdquo;</div>
              <div className="text-[#f2f7ff]">
                &rarr; Action 1: Get Current Location · Action 2: Calculate Travel Time · Action 3: Send Message
              </div>
            </div>
          </div>

          <div className="pt-6 relative z-10">
            <Link
              href="/tools/apple-shortcuts-generator"
              navigate={navigate}
              className="btn-primary text-sm"
            >
              <span>Build an Apple Shortcut</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Item 2: AI Prompt Improver (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between group border border-[rgba(143,163,192,0.16)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <IconTile icon="Wand2" />
              <div className="flex items-center gap-1.5 text-xs text-[#8fa3c0]">
                <span className="font-mono uppercase text-[#0a84ff]">Productivity</span>
              </div>
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff] group-hover:text-[#0a84ff] transition-colors">
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
              className="text-xs font-semibold text-[#0a84ff] hover:underline inline-flex items-center gap-1.5 focus-ring rounded-lg min-h-[44px] py-2"
            >
              <span>Open Prompt Improver</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Item 3: AI Email Writer (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between group border border-[rgba(143,163,192,0.16)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <IconTile icon="Mail" />
              <div className="flex items-center gap-1.5 text-xs text-[#8fa3c0]">
                <span className="font-mono uppercase text-[#0a84ff]">Writing</span>
              </div>
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff] group-hover:text-[#0a84ff] transition-colors">
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
              className="text-xs font-semibold text-[#0a84ff] hover:underline inline-flex items-center gap-1.5 focus-ring rounded-lg min-h-[44px] py-2"
            >
              <span>Open Email Writer</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Item 4: AI Summarizer (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between group border border-[rgba(143,163,192,0.16)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <IconTile icon="FileText" />
              <div className="flex items-center gap-1.5 text-xs text-[#8fa3c0]">
                <span className="font-mono uppercase text-[#0a84ff]">Writing</span>
              </div>
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff] group-hover:text-[#0a84ff] transition-colors">
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
              className="text-xs font-semibold text-[#0a84ff] hover:underline inline-flex items-center gap-1.5 focus-ring rounded-lg min-h-[44px] py-2"
            >
              <span>Open Summarizer</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Item 5: Excel & Google Sheets Formula Helper (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between group border border-[rgba(143,163,192,0.16)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <IconTile icon="Sigma" />
              <div className="flex items-center gap-1.5 text-xs text-[#8fa3c0]">
                <span className="font-mono uppercase text-[#0a84ff]">Productivity</span>
              </div>
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff] group-hover:text-[#0a84ff] transition-colors">
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
              className="text-xs font-semibold text-[#0a84ff] hover:underline inline-flex items-center gap-1.5 focus-ring rounded-lg min-h-[44px] py-2"
            >
              <span>Open Formula Helper</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Item 6: Caption & Hashtag Generator (4 cols on lg) */}
        <div className="md:col-span-6 lg:col-span-4 glass-surface rounded-3xl p-6 interactive-hover flex flex-col justify-between group border border-[rgba(143,163,192,0.16)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <IconTile icon="Hash" />
              <div className="flex items-center gap-1.5 text-xs text-[#8fa3c0]">
                <span className="font-mono uppercase text-[#0a84ff]">Social</span>
              </div>
            </div>
            <h3 className="text-xl font-bold font-display text-[#f2f7ff] group-hover:text-[#0a84ff] transition-colors">
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
              className="text-xs font-semibold text-[#0a84ff] hover:underline inline-flex items-center gap-1.5 focus-ring rounded-lg min-h-[44px] py-2"
            >
              <span>Open Caption Tool</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hub Redirection Link */}
      <div className="mt-8 text-center">
        <Link
          href="/tools"
          navigate={navigate}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[#0a84ff] text-xs font-semibold text-[#f2f7ff] hover:text-[#0a84ff] transition-all focus-ring"
        >
          <span>Explore All Tools in the Directory</span>
          <ArrowUpRight className="w-4 h-4 text-[#0a84ff]" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};
