import React, { useState } from 'react';
import { Sparkles, Copy, Check, Share2, AlertCircle } from 'lucide-react';
import { shareWithFallback } from '../../utils/share.ts';

export const LiveMiniTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const samplePrompt = 'write email to client saying deliverable delayed by 2 days';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleExample = () => {
    setInput(samplePrompt);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setCopied(false);
    setShared(false);

    // Fast simulated response for the hero live mini-tool demo
    setTimeout(() => {
      const trimmed = input.trim();
      let generated = '';
      if (trimmed.toLowerCase().includes('client') || trimmed.toLowerCase().includes('email')) {
        generated = `Subject: Quick Update: Project Timeline & Next Steps\n\nHi [Client Name],\n\nI am writing to share a brief update on our timeline. To ensure the final deliverable meets our highest quality standards, we need two additional days to complete testing and final revisions.\n\nWe will deliver the completed package by [New Date, e.g., Thursday at 3 PM].\n\nThank you for your patience and partnership,\n[Your Name]`;
      } else {
        generated = `[Role: Expert Assistant]\n[Goal: ${trimmed}]\n[Instructions: Provide clear, actionable bullet points, tone-tailored phrasing, and next steps in under 150 words.]\n\n1. Purpose: Direct and polite communication.\n2. Context: Clear timeline adjustment.\n3. Action item: Specified confirmation deadline.`;
      }
      setResult(generated);
      setIsLoading(false);
    }, 600);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      showToast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Please select text manually');
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const res = await shareWithFallback({
      title: 'SmartToolHub Email Result',
      text: result,
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

  return (
    <div className="w-full glass-surface rounded-3xl p-5 sm:p-6 border border-[rgba(143,163,192,0.18)] shadow-2xl relative overflow-hidden">
      {toast && (
        <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-[#0a1424] border border-[#0a84ff] text-[11px] font-semibold text-[#0a84ff] shadow-lg flex items-center gap-1.5 animate-fade-in">
          <Check className="w-3.5 h-3.5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Mini Tool Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(143,163,192,0.12)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0a1424] border border-[rgba(10,132,255,0.3)] flex items-center justify-center text-[#0a84ff]">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="font-semibold text-sm text-[#f2f7ff]">Live Mini Demo</span>
            <span className="text-[#8fa3c0] text-xs ml-2">· Instant Test</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExample}
          className="text-xs text-[#0a84ff] hover:underline focus-ring rounded font-mono uppercase tracking-wider"
        >
          Try an example
        </button>
      </div>

      {/* Input Area */}
      <form onSubmit={handleGenerate} className="mt-4 space-y-3">
        <div>
          <label htmlFor="mini-tool-input" className="sr-only">
            Enter rough text or request
          </label>
          <textarea
            id="mini-tool-input"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a request (e.g. 'write email to client saying delayed by 2 days')..."
            className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.16)] rounded-xl p-3 text-base sm:text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-ring resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-[#050a14] border-t-transparent rounded-full animate-spin" />
              <span>Generating result...</span>
            </span>
          ) : (
            <span>Improve &amp; Format in 1-Click</span>
          )}
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <div className="mt-4 pt-4 border-t border-[rgba(143,163,192,0.12)] space-y-3" aria-live="polite">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#0a84ff]">
              Formatted Result
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs text-[#f2f7ff] hover:border-[#0a84ff] transition-colors focus-ring"
                aria-label="Copy result to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#0a84ff]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs text-[#8fa3c0] hover:text-[#f2f7ff] transition-colors focus-ring"
                aria-label="Share result"
              >
                {shared ? <Check className="w-3.5 h-3.5 text-[#0a84ff]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <pre className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] text-xs sm:text-sm text-[#f2f7ff] font-sans whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
            {result}
          </pre>

          {/* Honest Note */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#8fa3c0]/90">
            <AlertCircle className="w-3.5 h-3.5 text-[#ffb840] shrink-0" />
            <span>AI can make mistakes. Always check important details before sending.</span>
          </div>
        </div>
      )}
    </div>
  );
};
