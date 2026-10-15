import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { ToolMeta, GuideMeta } from '../../types/navigation.ts';
import { Link } from '../../hooks/useRouter.tsx';
import { saveToolResult } from '../../utils/storage.ts';
import { AdSlot } from '../ads/AdSlot.tsx';

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolPageTemplateProps {
  tool: ToolMeta;
  heading: string;
  subheading: string;
  inputLabel: string;
  inputPlaceholder: string;
  examplePrompt: string;
  generateButtonText?: string;
  whatItDoesContent: React.ReactNode;
  howToUseSteps: Array<{ step: string; text: string }>;
  workedExample: { title: string; scenario: string; output: string };
  tips: string[];
  faq: ToolFaqItem[];
  relatedTools: ToolMeta[];
  relatedGuide: GuideMeta;
  lastUpdated: string;
  navigate: (path: string) => void;
  extraControls?: React.ReactNode;
}

export const ToolPageTemplate: React.FC<ToolPageTemplateProps> = ({
  tool,
  heading,
  subheading,
  inputLabel,
  inputPlaceholder,
  examplePrompt,
  generateButtonText = 'Generate Result',
  whatItDoesContent,
  howToUseSteps,
  workedExample,
  tips,
  faq,
  relatedTools,
  relatedGuide,
  lastUpdated,
  navigate,
  extraControls,
}) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleExampleClick = () => {
    setInput(examplePrompt);
    setError(null);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setError(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setCopied(false);
    setShared(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: tool.slug,
          input: input.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "That didn't work. Try again in a moment.");
      }

      setResult(data.result);
      // Save result to localStorage
      saveToolResult(tool.slug, tool.name, input.trim(), data.result);
    } catch (err: any) {
      setError(err?.message || "That didn't work. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    if (!result) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} Result · SmartToolHub`,
          text: result,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <article className="py-6 sm:py-10 max-w-4xl mx-auto space-y-10">
      {/* 1. Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#39ff88] transition-colors focus-laser rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <Link href="/tools" navigate={navigate} className="hover:text-[#39ff88] transition-colors focus-laser rounded">
          Tools
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff] truncate">{tool.name}</span>
      </nav>

      {/* 2. Tool Header & Kicker */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8fa3c0]">
          <span className="font-mono uppercase text-[#39ff88] font-semibold">{tool.category}</span>
          <span aria-hidden="true">·</span>
          <span>Updated {lastUpdated}</span>
          <span aria-hidden="true">·</span>
          <span>
            By{' '}
            <Link href="/about" navigate={navigate} className="text-[#f2f7ff] hover:underline focus-laser rounded">
              Dhrumil Aslaliya
            </Link>
          </span>
        </div>

        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          {heading}
        </h1>

        <p className="body-fluid text-[#8fa3c0] max-w-2xl leading-relaxed">
          {subheading}
        </p>
      </header>

      {/* 3. Primary Tool Interactive Card (Mobile-First: Input first, big button, result directly below) */}
      <section aria-label="Tool input and generator" className="glass-surface rounded-3xl p-5 sm:p-7 border border-[rgba(143,163,192,0.18)] shadow-2xl space-y-5">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="tool-input" className="text-xs font-mono uppercase tracking-wider text-[#f2f7ff] font-semibold">
              {inputLabel}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExampleClick}
                className="text-xs font-mono text-[#39ff88] hover:underline focus-laser rounded uppercase tracking-wider"
              >
                Try an example
              </button>
              {input && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#8fa3c0] hover:text-[#f2f7ff] focus-laser rounded inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <textarea
              id="tool-input"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              maxLength={2000}
              className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-2xl p-4 text-base text-[#f2f7ff] placeholder-[#8fa3c0] focus-laser resize-y min-h-[110px]"
              style={{ fontSize: '16px' }} // Prevent iOS zoom
            />
            <div className="flex justify-between items-center text-[11px] text-[#8fa3c0] mt-1.5 px-1">
              <span>Plain English description · No tech jargon required</span>
              <span>{input.length}/2,000</span>
            </div>
          </div>

          {/* Optional Extra Controls (e.g. Tone, Platform selector) */}
          {extraControls}

          {/* Big Full-Width Primary Action Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-full btn-laser disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(57,255,136,0.25)]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#050a14] border-t-transparent rounded-full animate-spin" />
                <span>Generating in seconds...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-current" />
                <span>{generateButtonText}</span>
              </span>
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-[#ff5c7a]/10 border border-[#ff5c7a]/30 text-xs text-[#ff5c7a] flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Area Directly Below */}
        {result && (
          <div className="pt-5 border-t border-[rgba(143,163,192,0.14)] space-y-3" aria-live="polite">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#39ff88] font-semibold">
                Your Result
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#39ff88] transition-colors focus-laser"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#39ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs text-[#8fa3c0] hover:text-[#f2f7ff] transition-colors focus-laser"
                >
                  {shared ? <Check className="w-3.5 h-3.5 text-[#39ff88]" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Output Container with Internal Scroll */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto selection:bg-[#39ff88] selection:text-[#050a14]">
              {result}
            </div>

            {/* Honest Disclaimer */}
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]/90 pt-1">
              <AlertCircle className="w-4 h-4 text-[#ffb840] shrink-0" />
              <span>AI can make mistakes. Always check important names, commands, and formulas before implementing.</span>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="pt-2 text-[11px] text-[#8fa3c0]/80">
          Privacy: Text you enter is sent securely to the AI service to produce your result and is not stored or shared by us.
        </div>
      </section>

      {/* 4. Editorial Content (400+ Words: What it does, How to use, Worked example, Tips) */}
      <section className="space-y-8 pt-4">
        {/* What It Does */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff]">
            What this tool does
          </h2>
          <div className="text-sm sm:text-base text-[#8fa3c0] leading-relaxed space-y-2">
            {whatItDoesContent}
          </div>
        </div>

        {/* How to Use It in 3-4 Steps */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff]">
            How to use it step by step
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {howToUseSteps.map((step, idx) => (
              <div key={step.step} className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
                <div className="font-mono text-xs text-[#39ff88] uppercase tracking-wider font-bold">
                  Step 0{idx + 1}
                </div>
                <div className="font-semibold text-sm text-[#f2f7ff]">{step.step}</div>
                <p className="text-xs text-[#8fa3c0] leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Worked Example */}
        <div className="glass-surface p-6 rounded-3xl border border-[rgba(143,163,192,0.14)] space-y-3">
          <div className="text-xs font-mono uppercase text-[#39ff88] tracking-wider font-semibold">
            Worked Example
          </div>
          <h3 className="text-lg font-bold font-display text-[#f2f7ff]">
            {workedExample.title}
          </h3>
          <div className="text-xs text-[#8fa3c0] font-mono p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.12)]">
            <span className="text-[#39ff88]">&gt; Input: </span>{workedExample.scenario}
          </div>
          <div className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed whitespace-pre-wrap p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.12)]">
            {workedExample.output}
          </div>
        </div>

        {/* Pro Tips */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff]">
            Tips for the best results
          </h2>
          <ul className="space-y-2 text-sm text-[#8fa3c0]">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#39ff88] font-bold">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4-Question Tool FAQ */}
        <div className="space-y-4 pt-4 border-t border-[rgba(143,163,192,0.12)]">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff]">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faq.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={item.question} className="glass-surface rounded-2xl border border-[rgba(143,163,192,0.12)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 focus-laser"
                  >
                    <span className="font-semibold text-sm text-[#f2f7ff]">{item.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8fa3c0] transition-transform ${isOpen ? 'rotate-180 text-[#39ff88]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#8fa3c0] leading-relaxed border-t border-[rgba(143,163,192,0.08)]">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reserved Ad Slot (Zero CLS, below FAQ and above related links) */}
        <AdSlot format="banner" />

        {/* Internal Linking: 2 Related Tools & 1 Related Guide */}
        <div className="pt-8 border-t border-[rgba(143,163,192,0.12)] space-y-6">
          <div className="text-xs font-mono uppercase tracking-wider text-[#39ff88]">
            Related Tools &amp; Guides
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <Link
                key={relTool.id}
                href={`/tools/${relTool.slug}`}
                navigate={navigate}
                className="glass-surface p-4 rounded-2xl border border-[rgba(143,163,192,0.12)] hover:border-[#39ff88] transition-colors focus-laser"
              >
                <div className="text-[10px] font-mono uppercase text-[#39ff88]">{relTool.category}</div>
                <div className="font-semibold text-sm text-[#f2f7ff] mt-1">{relTool.name}</div>
                <p className="text-xs text-[#8fa3c0] line-clamp-2 mt-1">{relTool.description}</p>
              </Link>
            ))}

            <Link
              href={`/guides/${relatedGuide.slug}`}
              navigate={navigate}
              className="glass-surface p-4 rounded-2xl border border-[rgba(143,163,192,0.12)] hover:border-[#39ff88] transition-colors focus-laser"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#5aa9ff]">
                <BookOpen className="w-3 h-3" />
                <span>Related Guide</span>
              </div>
              <div className="font-semibold text-sm text-[#f2f7ff] mt-1">{relatedGuide.title}</div>
              <p className="text-xs text-[#8fa3c0] line-clamp-2 mt-1">{relatedGuide.summary}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Action Bar (Appears when result exists) */}
      {result && (
        <div className="md:hidden fixed bottom-14 left-0 right-0 p-3 bg-[#050a14]/95 backdrop-blur-[20px] border-t border-[rgba(143,163,192,0.2)] z-30 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 btn-laser h-11 text-xs"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Result'}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="btn-glass h-11 px-4 text-xs"
          >
            <Share2 className="w-4 h-4 text-[#8fa3c0]" />
          </button>
        </div>
      )}
    </article>
  );
};
