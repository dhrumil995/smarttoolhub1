import React, { useState } from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface SummarizerPageProps {
  navigate: (path: string) => void;
}

export const SummarizerPage: React.FC<SummarizerPageProps> = ({ navigate }) => {
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium'>('medium');

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'ai-summarizer') || LAUNCH_TOOLS[2];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'ai-email-writer' || t.slug === 'rewrite-tone-changer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const exampleChips = [
    'Artificial intelligence models rely on transformer architecture introduced in 2017. Transformers process entire sequences simultaneously rather than word-by-word, drastically speeding up training on clusters of GPUs. This allows models to capture long-range dependencies across thousands of tokens, enabling breakthroughs in code generation, language translation, and reasoning tasks. However, training requires substantial electrical power, high-bandwidth memory, and specialized datacenter infrastructure.',
    'Remote work has fundamentally changed office occupancy in global financial centers. While some firms have mandated three or four days in person, surveys reveal employee satisfaction increases noticeably with hybrid flexibility. Commercial real estate developers are converting vacant cubicle offices into residential lofts or medical facilities. Municipal transit authorities are also rebalancing train schedules to accommodate mid-week peaks rather than traditional Monday-to-Friday rush hours.',
    'Electric vehicle adoption increased by twenty-eight percent last year across Western Europe. Key drivers included governmental tax credits, expanding highway fast-charging corridors, and greater battery energy density that reduced range anxiety. However, mineral supply constraints for lithium and nickel continue to pose pricing challenges for entry-level models under thirty thousand dollars.',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Text Summarizer"
      subheading="Condense long articles, meeting notes, transcripts, and research into a punchy 3-sentence summary and 5 clear key points in seconds."
      inputLabel="Paste text to summarize"
      inputPlaceholder="Paste paragraphs from an article, transcript, research memo, or email chain..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Summarize in Seconds"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/summarizer"
      requestPayload={(text) => ({
        text,
        length: summaryLength,
      })}
      extraControls={
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
            Summary Detail Level
          </label>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            <button
              type="button"
              onClick={() => setSummaryLength('short')}
              className={`py-2 px-3 text-xs rounded-xl font-medium transition-colors border text-center focus-ring ${
                summaryLength === 'short'
                  ? 'bg-[#0a84ff] text-[#050a14] border-[#0a84ff] font-bold shadow-[0_0_12px_rgba(10, 132, 255,0.3)]'
                  : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
              }`}
            >
              Short (Fast Scan)
            </button>
            <button
              type="button"
              onClick={() => setSummaryLength('medium')}
              className={`py-2 px-3 text-xs rounded-xl font-medium transition-colors border text-center focus-ring ${
                summaryLength === 'medium'
                  ? 'bg-[#0a84ff] text-[#050a14] border-[#0a84ff] font-bold shadow-[0_0_12px_rgba(10, 132, 255,0.3)]'
                  : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
              }`}
            >
              Medium (Detailed)
            </button>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, onShare, copied, shared }) => {
        const summary = rawData?.summary || '';
        const keyPoints: string[] = rawData?.keyPoints || [];

        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0a84ff] font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Executive Summary</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCopy(result)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#0a84ff] transition-colors focus-ring"
                >
                  <span className="text-xs">{copied ? 'Copied All' : 'Copy All'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShare(result)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs text-[#8fa3c0] hover:text-[#f2f7ff] transition-colors focus-ring"
                >
                  <span className="text-xs">{shared ? 'Shared' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* 3-Sentence Summary Card */}
            {summary && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#0a84ff] font-semibold">
                  3-Sentence Summary
                </div>
                <p className="text-sm text-[#f2f7ff] leading-relaxed">
                  {summary}
                </p>
              </div>
            )}

            {/* 5 Key Points Card */}
            {keyPoints.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#0a84ff] font-semibold">
                  5 Key Points
                </div>
                <ul className="space-y-2">
                  {keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#8fa3c0]">
                      <CheckCircle2 className="w-4 h-4 text-[#34e0a1] shrink-0 mt-0.5" />
                      <span className="text-[#f2f7ff]">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fallback Display if Structured Fields Are Not Split */}
            {!summary && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <>
          <p>
            The AI Text Summarizer turns lengthy articles, messy meeting notes, PDF chapters, and long emails into an easy-to-digest briefing. You do not need to spend fifteen minutes reading thousands of words just to pull out a few action items or key facts.
          </p>
          <p>
            Every summary is formatted into two clean parts: a clear 3-sentence summary that captures the core message, followed by five bullet points highlighting specific numbers, dates, decisions, and takeaways. You can toggle between Short for a lightning-fast scan or Medium for a more detailed review.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Paste your raw text',
          text: 'Copy the text from an article, transcript, memo, or newsletter and paste it into the input box.',
        },
        {
          step: 'Choose your detail level',
          text: 'Pick Short if you only need the main headline facts, or Medium if you want deeper context across the bullet points.',
        },
        {
          step: 'Copy or share your summary',
          text: 'Tap Copy to paste the summary into Slack, Notion, or your email draft, or share it directly to your mobile notes.',
        },
      ]}
      workedExample={{
        title: 'Example: Engineering Sprint Retrospective Notes',
        scenario: 'Team sprint discussion about slow automated test runs, server costs, and new release timelines.',
        output: `### 3-Sentence Summary:
The engineering team decided to overhaul manual QA cycles by adding automated integration tests next sprint. This transition will reduce release verification times from four days to under twenty-four hours. Management approved a modest cloud infrastructure budget to support parallel test runners starting on Monday.

### 5 Key Points:
1. Manual regression testing was identified as the cause of 65% of release delays last quarter.
2. Two senior engineers will dedicate the upcoming sprint to setting up Playwright test suites.
3. Target turnaround for release sign-offs is now set at under 24 hours.
4. Cloud test runner budget of $200 per month was officially approved by the director.
5. The next team review is scheduled for Friday to measure early build speed improvements.`,
      }}
      tips={[
        'Remove website navigation links, copyright footers, or ads before pasting for the cleanest summary.',
        'Use the Short mode when you only have thirty seconds before walking into a meeting.',
        'The summarizer preserves exact numbers, percentages, and dollar amounts without guessing.',
        'You can paste meeting transcripts or podcast notes to quickly pull out next steps and assigned tasks.',
      ]}
      faq={[
        {
          question: 'What is the difference between Short and Medium mode?',
          answer: 'Short mode keeps sentences tight and produces brief one-line bullet points. Medium mode provides richer context around background reasons and next steps.',
        },
        {
          question: 'How long can the pasted text be?',
          answer: 'You can paste up to 4,000 characters at once, which comfortably covers articles, email chains, and typical meeting transcripts.',
        },
        {
          question: 'Does the tool make up facts if the text is incomplete?',
          answer: 'No. The AI model is strictly instructed to only summarize information explicitly found in your pasted text, preventing hallucinated numbers or false claims.',
        },
        {
          question: 'Are my pasted articles or private notes saved anywhere?',
          answer: 'No. Everything is processed ephemerally through our server API and is never recorded, saved in a database, or used to train models.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
