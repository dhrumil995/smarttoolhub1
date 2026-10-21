import React, { useState } from 'react';
import { Feather, Copy, Check, Sparkles, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';

interface NaturalRewritePageProps {
  navigate: (path: string) => void;
}

export const NaturalRewritePage: React.FC<NaturalRewritePageProps> = ({ navigate }) => {
  const [draftText, setDraftText] = useState<string>(
    'Furthermore, it is crucial to delve deep into the rich tapestry of opportunities. In summary, our innovative game-changer stands as a testament to our relentless dedication.'
  );

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'natural-rewrite') || LAUNCH_TOOLS[24];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'rewrite-tone-changer' || t.slug === 'ai-email-writer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Overly formal corporate memo full of "furthermore", "delve", and "tapestry"',
    'Stiff LinkedIn post with repetitive sentence lengths and robotic filler',
    'AI-generated project summary that sounds like a textbook instead of a teammate',
  ];

  const handleChipClick = (chip: string) => {
    if (chip.includes('corporate memo')) {
      setDraftText(
        'Furthermore, it is crucial to delve deep into the multifaceted tapestry of modern market dynamics. In conclusion, our bespoke solution stands as a testament to our steadfast commitment to excellence.'
      );
    } else if (chip.includes('LinkedIn post')) {
      setDraftText(
        'In today\'s fast-paced digital landscape, innovation is paramount. I am thrilled to share that our team has embarked on a transformative journey. Let us delve into how this paradigm shift will revolutionize our industry.'
      );
    } else {
      setDraftText(
        'The overarching objective of this sprint was to optimize throughput. Consequently, multiple algorithmic modifications were deployed to mitigate bottlenecks and foster synergy.'
      );
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Natural Rewrite (Human Voice Editor)"
      subheading="Edit stiff, robotic AI-assisted drafts into natural, engaging human writing. Cleans out repetitive transitions, strips hollow clichés, and varies sentence cadence so your ideas sound genuinely yours."
      inputLabel="Your AI-Assisted Draft to Humanize"
      inputPlaceholder="Paste the draft text you want to edit into natural, cadence-varied human prose..."
      examplePrompt={draftText}
      exampleChips={exampleChips}
      generateButtonText="Humanize & Polish Draft"
      apiEndpoint="/api/natural-rewrite"
      requestPayload={(input) => ({
        text: input,
      })}
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-3 pt-1">
          {/* Transparent Editorial Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] flex items-center justify-between gap-3 text-xs text-[#8fa3c0]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#f472d0] shrink-0" />
              <span className="font-medium text-[#f2f7ff]">
                Editorial Integrity: <strong className="text-[#f472d0]">Always review and make the text your own.</strong>
              </span>
            </div>
            <span className="hidden sm:inline font-mono text-[11px] text-[#8fa3c0]/70">
              Honest Craftsmanship
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#101c33]/60 border border-[rgba(143,163,192,0.12)] text-[11px] text-[#8fa3c0] leading-relaxed">
            <span className="font-semibold text-[#f2f7ff]">Note: </span>
            This tool focuses on editorial rhythm, vocabulary diversity, and clarity. We do not claim to bypass or deceive AI detection software. Authentic human communication comes from honest personal review.
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const rewritten: string = rawData?.rewritten || result;
        const improvements: string[] = rawData?.improvements || [];
        const disclaimer: string = rawData?.disclaimer || 'Always review and make the text your own.';

        return (
          <div className="space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#f472d0] font-bold">
                  Polished Human-Voice Version
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onCopy(rewritten)}
                  className="text-xs gap-1.5"
                >
                  <Copy size={14} />
                  <span>{copied ? 'Copied' : 'Copy Polished Text'}</span>
                </Button>
              </div>

              <div className="text-sm sm:text-base text-[#f2f7ff] leading-relaxed p-4 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.14)] whitespace-pre-wrap select-all font-sans">
                {rewritten}
              </div>

              {/* Improvements summary */}
              {improvements.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-mono uppercase text-[#8fa3c0] font-semibold block">
                    Cadence & Style Improvements Applied
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {improvements.map((imp, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.12)] text-xs text-[#f2f7ff] flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f472d0] shrink-0" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mandatory User Requirement Banner */}
              <div className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(244, 114, 208,0.25)] flex items-center gap-2 text-xs font-medium text-[#f472d0]">
                <Sparkles size={15} className="shrink-0" />
                <span>{disclaimer}</span>
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            When generative AI models draft copy, they often gravitate toward an unmistakable, stiff template: perfectly uniform compound sentences, hyper-predictable transitions (<em>"furthermore"</em>, <em>"in summary"</em>, <em>"delve"</em>, <em>"testament to"</em>), and emotional exaggeration (<em>"tapestry of possibilities"</em>, <em>"game-changing beacon"</em>).
          </p>
          <p>
            The <strong>Natural Rewrite Tool</strong> operates like a seasoned human copy editor sitting at your desk. It inspects your draft for robotic linguistic habits, introduces varied sentence lengths, strips corporate fluff, and injects conversational rhythm.
          </p>
          <p>
            Crucially, this tool maintains zero deception. It does not promise to "fool AI detectors" or cheat academic plagiarism tools. Instead, it provides thoughtful sentence construction and encourages you to bring your own real voice to every paragraph.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Paste Your Rough Draft',
          text: 'Paste any draft generated by ChatGPT, Gemini, or Claude that feels stiff, overly formal, or repetitive.',
        },
        {
          step: 'Review the Natural Rewrite',
          text: 'Examine the revised version with stripped cliches, diversified sentence structures, and plain conversational English.',
        },
        {
          step: 'Review and Make It Yours',
          text: 'Always review the final text, insert personal details or relevant anecdotes, and make sure the perspective is genuinely your own.',
        },
      ]}
      workedExample={{
        title: 'Overcoming AI Robot Speak in Business Proposals',
        scenario: 'Draft input: "Furthermore, it is critical to delve deep into the vibrant tapestry of consumer behavior. In summary, our innovative methodology stands as a testament to our steadfast pursuit of market excellence."',
        output: 'We need to pay closer attention to how our customers actually behave. Our new testing workflow gives us a clearer picture of what they want, and the initial numbers back that up.\n\nImprovements:\n• Removed robotic markers "furthermore", "delve deep", "vibrant tapestry", "testament to"\n• Shortened sentences for punchy clarity\n• Replaced vague corporate jargon with specific, relatable actions',
      }}
      tips={[
        'Read your rewritten draft out loud. If you stumble or run out of breath, break the sentence into two shorter thoughts.',
        'Delete introductory fluff like "In today\'s digital world" or "It is widely recognized that"—jump directly to your core point.',
        'Remember our golden guideline: Always review and make the text your own.',
      ]}
      faq={[
        {
          question: 'Does this tool guarantee bypassing AI detectors?',
          answer: 'No. We do not make any claims about bypassing AI detectors or beating scanning software. Detectors are statistically unreliable and fluctuate constantly. Our goal is solely to help you write clearer, more engaging English with authentic human cadence.',
        },
        {
          question: 'What robotic words does this tool remove?',
          answer: 'Common dead giveaways include "delve", "tapestry", "furthermore", "testament to", "plethora", "beacon", "game-changer", and formulaic conclusions starting with "In summary".',
        },
        {
          question: 'Is my draft stored on any server?',
          answer: 'No. Your pasted draft is processed in memory solely to return your edited version and is never stored on disk, logged, or saved.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
