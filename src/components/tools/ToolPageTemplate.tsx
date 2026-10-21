import React, { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  Share2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  BookOpen,
  RotateCcw,
  Zap,
  Clock,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { ToolMeta, GuideMeta } from '../../types/navigation.ts';
import { Link } from '../../hooks/useRouter.tsx';
import { saveToolResult, getToolHistoryBySlug, clearToolHistoryBySlug, SavedItem } from '../../utils/storage.ts';
import { AdSlot } from '../ads/AdSlot.tsx';
import { shareWithFallback } from '../../utils/share.ts';
import { IconTile } from '../ui/IconTile.tsx';
import { TOOL_ICON_MAP, getCategoryTheme } from '../../data/tools.ts';
import { Button, CopyButton } from '../ui/Button.tsx';
import { useToast } from '../ui/Toast.tsx';
import { AiLoadingState } from '../ui/AiLoadingState.tsx';
import { ErrorState } from '../ui/ErrorState.tsx';
import { FormField, CharacterCounter } from '../ui/FormField.tsx';
import { Breadcrumbs } from '../ui/Breadcrumbs.tsx';
import { ToolTabs } from '../ui/ToolTabs.tsx';
import { ResultCard } from '../ui/ResultCard.tsx';
import { Accordion } from '../ui/Accordion.tsx';
import { StickyActionBar } from '../ui/StickyActionBar.tsx';
import { ToolCard } from '../ui/ToolCard.tsx';

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface CustomResultRenderProps {
  result: string;
  rawData: any;
  input: string;
  onCopy: (textToCopy?: string) => void;
  onShare: (textToShare?: string) => void;
  copied: boolean;
  shared: boolean;
  isRefining: boolean;
  onRefine?: (action: string) => void;
}

export interface ToolPageTemplateProps {
  tool: ToolMeta;
  heading: string;
  subheading: string;
  inputLabel: string;
  inputPlaceholder: string;
  examplePrompt: string;
  exampleChips?: string[];
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
  extraResultActions?: (result: string, input: string) => React.ReactNode;
  apiEndpoint?: string;
  requestPayload?: (input: string) => Record<string, any>;
  customResultRenderer?: (props: CustomResultRenderProps) => React.ReactNode;
  onRefineRequest?: (action: string, currentResult: string, rawData: any, setRawData: (d: any) => void, setResult: (r: string) => void) => Promise<void>;
  onClientCompute?: (input: string) => { result: string; rawData?: any };
}

export const ToolPageTemplate: React.FC<ToolPageTemplateProps> = ({
  tool,
  heading,
  subheading,
  inputLabel,
  inputPlaceholder,
  examplePrompt,
  exampleChips,
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
  extraResultActions,
  apiEndpoint = '/api/generate',
  requestPayload,
  customResultRenderer,
  onRefineRequest,
  onClientCompute,
}) => {
  const theme = getCategoryTheme(tool.category);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [rawData, setRawData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeToolTab, setActiveToolTab] = useState<'result' | 'examples' | 'history'>('result');
  const [recentItems, setRecentItems] = useState<SavedItem[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    setRecentItems(getToolHistoryBySlug(tool.slug));
  }, [tool.slug, result]);

  const handleExampleClick = (text: string) => {
    setInput(text);
    setError(null);
    setValidationError(null);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setRawData(null);
    setError(null);
    setValidationError(null);
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    showToast('Generation cancelled', 'info');
  };

  const handleClearRecent = () => {
    clearToolHistoryBySlug(tool.slug);
    setRecentItems([]);
    showToast('Recent history cleared', 'info');
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!input.trim()) {
      setValidationError('Please enter what you need before generating.');
      return;
    }
    setValidationError(null);

    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setCopied(false);
    setShared(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (onClientCompute) {
        const computed = onClientCompute(input.trim());
        setResult(computed.result);
        setRawData(computed.rawData || computed);
        saveToolResult(tool.slug, tool.name, input.trim(), computed.result);
        setRecentItems(getToolHistoryBySlug(tool.slug));
        setIsLoading(false);
        return;
      }

      const payload = requestPayload
        ? requestPayload(input.trim())
        : { tool: tool.slug, input: input.trim() };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "That didn't work. Try again in a moment.");
      }

      const generatedResult = data.result || (typeof data === 'string' ? data : JSON.stringify(data));
      setResult(generatedResult);
      setRawData(data);
      saveToolResult(tool.slug, tool.name, input.trim(), generatedResult);
      setRecentItems(getToolHistoryBySlug(tool.slug));
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      setError("That didn't work. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (action: string) => {
    if (!onRefineRequest || !result || isRefining) return;
    setIsRefining(true);
    try {
      await onRefineRequest(action, result, rawData, setRawData, setResult);
      setRecentItems(getToolHistoryBySlug(tool.slug));
      showToast('Updated result successfully!');
    } catch (err: any) {
      showToast(err?.message || "Could not refine. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopy = async (textToCopy?: string) => {
    const text = textToCopy || result;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Please select and copy manually');
    }
  };

  const handleShare = async (textToShare?: string) => {
    const text = textToShare || result;
    if (!text) return;
    const res = await shareWithFallback({
      title: `${tool.name} Result · SmartToolHub`,
      text: text,
      url: typeof window !== 'undefined' ? window.location.href : '',
    });

    if (res.success) {
      if (res.mode === 'native') {
        setShared(true);
        showToast('Shared successfully!');
        setTimeout(() => setShared(false), 2000);
      } else {
        setCopied(true);
        showToast('Copied to clipboard! (Share sheet not supported)');
        setTimeout(() => setCopied(false), 2000);
      }
    } else if (res.message !== 'Share dismissed') {
      showToast(res.message);
    }
  };

  // Determine the 3 example chips
  const chips = exampleChips && exampleChips.length > 0 ? exampleChips.slice(0, 3) : [examplePrompt];

  return (
    <article className="py-6 sm:py-10 max-w-4xl mx-auto space-y-10 relative">
      {/* Mobile in-page "Back to tools" link (Phase 4 requirement) */}
      <div className="sm:hidden -mb-6">
        <Link
          href="/tools"
          navigate={navigate}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8fa3c0] hover:text-[#7db8ff] transition-colors py-2 px-1 focus-ring rounded-lg min-h-[44px]"
          aria-label="Back to tools"
        >
          <ArrowLeft size={16} aria-hidden="true" className="text-[#7db8ff]" />
          <span>Back to tools</span>
        </Link>
      </div>

      {/* 1. Breadcrumbs Landmark with Mobile Truncation */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: tool.name },
        ]}
        navigate={navigate}
      />

      {/* 2. Tool Header & Kicker with IconTile */}
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <IconTile icon={TOOL_ICON_MAP[tool.slug] || tool.icon} />
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8fa3c0]">
              <span style={{ color: theme.color }} className="font-mono uppercase font-semibold">{tool.category}</span>
              <span aria-hidden="true">·</span>
              <span>Updated {lastUpdated}</span>
              <span aria-hidden="true">·</span>
              <span>
                By{' '}
                <Link href="/about" navigate={navigate} className="text-[#f2f7ff] hover:underline focus-ring rounded">
                  Dhrumil Aslaliya
                </Link>
              </span>
            </div>
            <div className="text-xs text-[#8fa3c0] mt-0.5">Free tool · No sign-up · Results in seconds</div>
          </div>
        </div>

        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          {heading}
        </h1>

        <p className="body-fluid text-[#8fa3c0] max-w-2xl leading-relaxed">
          {subheading}
        </p>
      </header>

      {/* 3. Primary Tool Interactive Card */}
      <section aria-label="Tool input and generator" className="glass-surface rounded-3xl p-5 sm:p-7 border border-[rgba(143,163,192,0.18)] shadow-2xl space-y-5">
        <form onSubmit={handleGenerate} className="space-y-4">
          <FormField
            id="tool-input"
            label={inputLabel}
            error={validationError}
            action={
              input ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#8fa3c0] hover:text-[#f2f7ff] focus-ring rounded inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              ) : null
            }
          >
            {({ id, 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedBy, className: borderClass }) => (
              <div>
                <textarea
                  id={id}
                  rows={4}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder={inputPlaceholder}
                  maxLength={2500}
                  aria-invalid={ariaInvalid}
                  aria-describedby={ariaDescribedBy}
                  className={`w-full bg-[#0a1424] border ${borderClass} rounded-2xl p-4 text-base text-[#f2f7ff] placeholder-[#8fa3c0] focus-ring resize-y min-h-[110px] transition-colors`}
                  style={{ fontSize: '16px' }}
                />
                <div className="flex justify-between items-center text-[11px] text-[#8fa3c0] mt-1.5 px-1">
                  <span>Plain English description · No tech jargon required</span>
                  <CharacterCounter current={input.length} max={2500} />
                </div>
              </div>
            )}
          </FormField>

          {/* Try an Example Chips (3 Examples) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
              Try an example:
            </span>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleExampleClick(chip)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#7db8ff] hover:border-[rgba(143,163,192,0.3)] transition-colors text-left max-w-full truncate focus-ring"
                >
                  {chip.length > 55 ? `${chip.slice(0, 55)}...` : chip}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Extra Controls (Tone, Platform selectors) */}
          {extraControls}

          {/* Big Full-Width Primary Action Button (48px height) with Loading State */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            loadingLabel="Generating in seconds..."
            leadingIcon="Zap"
            className="w-full h-12 shadow-[0_4px_16px_rgba(11,107,240,0.28)] text-sm font-bold"
          >
            {generateButtonText}
          </Button>
        </form>

        {/* AI Loading State with Rotating Statuses and Cancel Button */}
        {isLoading && (
          <AiLoadingState onCancel={handleCancel} />
        )}

        {/* Standard Error State with Try Again Button */}
        {error && (
          <ErrorState message={error} onRetry={() => handleGenerate()} />
        )}

        {/* Result Area Directly Below */}
        {result && !isLoading && (
          <div className="pt-5 border-t border-[rgba(143,163,192,0.14)] space-y-3" aria-live="polite">
            {customResultRenderer ? (
              customResultRenderer({
                result,
                rawData,
                input,
                onCopy: handleCopy,
                onShare: handleShare,
                copied,
                shared,
                isRefining,
                onRefine: handleRefine,
              })
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span style={{ color: theme.color }} className="font-mono text-xs uppercase tracking-wider font-semibold">
                    Your Result
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {extraResultActions?.(result, input)}
                    <CopyButton
                      textToCopy={result}
                      onCopySuccess={() => showToast('Copied to clipboard!')}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleShare()}
                      leadingIcon="Share2"
                    >
                      <span>Share</span>
                    </Button>
                  </div>
                </div>

                {/* Output Container with Internal Scroll */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto selection:bg-[rgba(10,132,255,0.3)] selection:text-[#f2f7ff]">
                  {result}
                </div>
              </>
            )}

            {/* Honest Disclaimer */}
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]/90 pt-1">
              <AlertCircle className="w-4 h-4 text-[#ffb840] shrink-0" />
              <span>AI can make mistakes. Always check important names, commands, and facts before sending.</span>
            </div>
          </div>
        )}

        {/* Recent Results (Last 5 per tool) */}
        {recentItems.length > 0 && (
          <div className="pt-5 border-t border-[rgba(143,163,192,0.14)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#7db8ff]" />
                <span>Recent Results ({recentItems.length})</span>
              </div>
              <button
                type="button"
                onClick={handleClearRecent}
                className="text-[11px] text-[#ff5c7a] hover:underline inline-flex items-center gap-1 focus-ring rounded"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
            <div className="space-y-2">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#0a1424]/80 border border-[rgba(143,163,192,0.12)] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate flex-1">
                    <span className="font-semibold text-[#f2f7ff]">{item.prompt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.result)}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-[#8fa3c0] hover:text-[#7db8ff] hover:border-[rgba(10,132,255,0.4)] transition-colors focus-ring inline-flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="pt-2 text-[11px] text-[#8fa3c0]/80">
          Privacy: Text you enter is processed securely by the AI service to produce your result and is not stored on our servers.
        </div>
      </section>

      {/* 4. Editorial Content */}
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
                <div style={{ color: theme.color }} className="font-mono text-xs uppercase tracking-wider font-bold">
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
          <div style={{ color: theme.color }} className="text-xs font-mono uppercase tracking-wider font-semibold">
            Worked Example
          </div>
          <h3 className="text-lg font-bold font-display text-[#f2f7ff]">
            {workedExample.title}
          </h3>
          <div className="text-xs text-[#8fa3c0] font-mono p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.12)]">
            <span className="text-[#7db8ff]">&gt; Input: </span>{workedExample.scenario}
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
                <span style={{ color: theme.color }} className="font-bold">✓</span>
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
                    className="w-full p-4 text-left flex items-center justify-between gap-4 focus-ring"
                  >
                    <span className="font-semibold text-sm text-[#f2f7ff]">{item.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8fa3c0] transition-transform ${isOpen ? 'rotate-180 text-[#5aa9ff]' : ''}`} />
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

        {/* Reserved Ad Slot (Zero CLS) */}
        <AdSlot format="banner" />

        {/* Internal Linking: 2 Related Tools & 1 Related Guide */}
        <div className="pt-8 border-t border-[rgba(143,163,192,0.12)] space-y-6">
          <div className="text-xs font-mono uppercase tracking-wider text-[#7db8ff]">
            Related Tools &amp; Guides
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.slice(0, 2).map((relTool) => (
              <Link
                key={relTool.id}
                href={`/tools/${relTool.slug}`}
                navigate={navigate}
                className="glass-surface p-4 rounded-2xl border border-[rgba(143,163,192,0.12)] hover:border-[rgba(10,132,255,0.4)] transition-colors focus-ring group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <IconTile icon={TOOL_ICON_MAP[relTool.slug] || relTool.icon} size="md" />
                    <span className="text-[10px] font-mono uppercase text-[#7db8ff]">{relTool.category}</span>
                  </div>
                  <div className="font-semibold text-sm text-[#f2f7ff] group-hover:text-[#7db8ff] transition-colors">{relTool.name}</div>
                  <p className="text-xs text-[#8fa3c0] line-clamp-2 mt-1">{relTool.description}</p>
                </div>
              </Link>
            ))}

            <Link
              href={`/guides/${relatedGuide.slug}`}
              navigate={navigate}
              className="glass-surface p-4 rounded-2xl border border-[rgba(143,163,192,0.12)] hover:border-[rgba(10,132,255,0.4)] transition-colors focus-ring"
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
        <div className="md:hidden fixed bottom-14 left-0 right-0 p-3 bg-[#050a14]/95 backdrop-blur-[20px] border-t border-[rgba(143,163,192,0.2)] z-30 flex items-center gap-2">
          {extraResultActions?.(result, input)}
          <button
            type="button"
            onClick={() => handleCopy()}
            className="flex-1 btn-primary h-11 text-xs"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Result'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleShare()}
            aria-label="Share result"
            className="btn-glass h-11 px-3.5 text-xs shrink-0"
          >
            <Share2 className="w-4 h-4 text-[#8fa3c0]" />
          </button>
        </div>
      )}
    </article>
  );
};
