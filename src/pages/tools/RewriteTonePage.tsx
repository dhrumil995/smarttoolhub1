import React, { useState } from 'react';
import { PenLine, ArrowRight, Check, Copy } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface RewriteTonePageProps {
  navigate: (path: string) => void;
}

export const RewriteTonePage: React.FC<RewriteTonePageProps> = ({ navigate }) => {
  const [tone, setTone] = useState<'friendlier' | 'more formal' | 'shorter' | 'simpler'>('friendlier');
  const [copiedRewritten, setCopiedRewritten] = useState(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'rewrite-tone-changer') || LAUNCH_TOOLS[3];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'ai-email-writer' || t.slug === 'ai-summarizer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const toneChoices: Array<{ id: 'friendlier' | 'more formal' | 'shorter' | 'simpler'; label: string }> = [
    { id: 'friendlier', label: 'Friendlier' },
    { id: 'more formal', label: 'More Formal' },
    { id: 'shorter', label: 'Shorter' },
    { id: 'simpler', label: 'Simpler' },
  ];

  const exampleChips = [
    'You did not send the project files on time so I cannot do my work today. Please send them immediately.',
    'I think we should probably reschedule our meeting because I have too much other stuff going on right now and won\'t be able to prepare properly.',
    'In accordance with our contractual stipulations, failure to remit remuneration within thirty days initiates delinquency protocols.',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Rewrite and Tone Changer"
      subheading="Change how your words feel without changing what they mean. Choose friendlier, more formal, shorter, or simpler to get an instant before-and-after view."
      inputLabel="Paste text to rewrite"
      inputPlaceholder="Paste a draft message, email sentence, bio, or memo..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Rewrite Text"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/rewrite-tone"
      requestPayload={(text) => ({
        text,
        tone,
      })}
      extraControls={
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
            Target Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {toneChoices.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTone(item.id)}
                className={`py-2 px-3 text-xs rounded-xl font-medium transition-colors border text-center focus-ring ${
                  tone === item.id
                    ? 'bg-[#0a84ff] text-[#050a14] border-[#0a84ff] font-bold shadow-[0_0_12px_rgba(10, 132, 255,0.3)]'
                    : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, input, onCopy, onShare, copied, shared }) => {
        const rewritten = rawData?.rewritten || result;
        const original = rawData?.original || input;
        const changes = rawData?.changes || '';

        const copyOnlyRewritten = async () => {
          try {
            await navigator.clipboard.writeText(rewritten);
            setCopiedRewritten(true);
            setTimeout(() => setCopiedRewritten(false), 2000);
          } catch {
            // Handled
          }
        };

        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0a84ff] font-semibold flex items-center gap-1.5">
                <PenLine className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Before &amp; After Comparison</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copyOnlyRewritten}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a84ff] text-[#050a14] text-xs font-bold hover:bg-[#0a84ff]/90 transition-colors focus-ring shadow-[0_0_12px_rgba(10, 132, 255,0.25)]"
                >
                  {copiedRewritten ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRewritten ? 'Copied Rewrite' : 'Copy Rewrite'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShare(rewritten)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs text-[#8fa3c0] hover:text-[#f2f7ff] transition-colors focus-ring"
                >
                  <span className="text-xs">{shared ? 'Shared' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Before and After Side-by-Side (or stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Before Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424]/80 border border-[rgba(143,163,192,0.14)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8fa3c0]">
                  <span>Original Draft (Before)</span>
                  <span>{original.length} chars</span>
                </div>
                <p className="text-sm text-[#8fa3c0] leading-relaxed whitespace-pre-wrap">
                  {original}
                </p>
              </div>

              {/* After Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[#0a84ff]/30 space-y-2 shadow-[0_0_15px_rgba(10, 132, 255,0.08)]">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#0a84ff] font-bold">
                  <span className="flex items-center gap-1">
                    <span>Rewritten ({tone})</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <span>{rewritten.length} chars</span>
                </div>
                <p className="text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap font-medium selection:bg-[#0a84ff] selection:text-[#050a14]">
                  {rewritten}
                </p>
              </div>
            </div>

            {/* What Changed Summary Card */}
            {changes && (
              <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] flex items-start gap-2.5 text-xs text-[#8fa3c0]">
                <div className="font-mono text-[#0a84ff] font-bold uppercase shrink-0">Note:</div>
                <div className="leading-relaxed text-[#f2f7ff]">{changes}</div>
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <>
          <p>
            The Rewrite and Tone Changer adjusts how your sentences sound without altering their meaning. If a sentence you wrote sounds a little too blunt, too complicated, or too long, this tool reformats the phrasing into clean, modern language.
          </p>
          <p>
            You get an instant Before and After view that places your original text next to the rewritten version. You can see the exact character difference and read a quick note on why the new version works better. Pick from four tailored tones: Friendlier for warmer teamwork, More Formal for senior managers, Shorter to remove clutter, or Simpler for crystal-clear readability.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Paste your draft sentence or message',
          text: 'Type or paste the sentence that feels awkward, wordy, or difficult to phrase comfortably.',
        },
        {
          step: 'Select your target tone',
          text: 'Choose Friendlier, More Formal, Shorter, or Simpler depending on who will read the message.',
        },
        {
          step: 'Compare and copy the result',
          text: 'Review the side-by-side Before and After boxes, then tap Copy Rewrite to paste it directly into your chat or email.',
        },
      ]}
      workedExample={{
        title: 'Example: Shifting from Harsh to Professional & Friendly',
        scenario: 'Draft: "You did not send the project files on time so I cannot do my work today. Please send them immediately."',
        output: `### Original (Before):
"You did not send the project files on time so I cannot do my work today. Please send them immediately."

### Rewritten (Friendlier):
"Hi [Name], just checking in on the project files. As soon as you have a chance to send those over, I will jump right in and get started. Let me know if you run into any trouble with the transfer!"

### Why this works:
It removes the blame-focused phrasing while keeping the exact same urgency and making sure the project moves forward without friction.`,
      }}
      tips={[
        'Use "Simpler" mode when explaining technical ideas or contracts to clients who prefer plain English.',
        'Use "Shorter" mode to cut fluff from LinkedIn updates, resume bullet points, or Slack messages.',
        'The tool never replaces important dates, times, prices, or names.',
        'You can tap different tones on the same text to see which style best fits your personal voice.',
      ]}
      faq={[
        {
          question: 'Does this change what my message actually means?',
          answer: 'No. The AI is instructed to preserve 100% of your facts, dates, commitments, and core intent. Only the vocabulary, rhythm, and sentence structure are refined.',
        },
        {
          question: 'How does the Before and After view help me?',
          answer: 'It lets you compare your original draft side-by-side with the new phrasing and review the character count so you can be confident your message strikes the right chord.',
        },
        {
          question: 'Which tone should I use for asking for a favor?',
          answer: 'The Friendlier tone works best. It softens direct commands into helpful requests, which makes people far more willing to help you quickly.',
        },
        {
          question: 'Are my private messages or emails stored on your server?',
          answer: 'No. SmartToolHub operates with an ephemeral architecture. Your text is processed in memory to generate the rewrite and is immediately discarded.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
