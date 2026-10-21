import React, { useState } from 'react';
import { Heading, Copy, Check } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface TitleHeadlinePageProps {
  navigate: (path: string) => void;
}

export const TitleHeadlinePage: React.FC<TitleHeadlinePageProps> = ({ navigate }) => {
  const [contentType, setContentType] = useState<'blog' | 'YouTube' | 'product page'>('blog');
  const [copiedTitleIdx, setCopiedTitleIdx] = useState<number | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'title-headline-generator') || LAUNCH_TOOLS[6];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'caption-hashtag-generator' || t.slug === 'social-bio-generator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const contentTypes: Array<{ id: 'blog' | 'YouTube' | 'product page'; label: string; desc: string }> = [
    { id: 'blog', label: 'Blog & Articles', desc: 'SEO-optimized hooks & reader guides' },
    { id: 'YouTube', label: 'YouTube Videos', desc: 'High CTR thumbnail & search titles' },
    { id: 'product page', label: 'Product Pages', desc: 'High-converting value propositions' },
  ];

  const exampleChips = [
    'How remote workers can stop feeling exhausted by 3 PM every day',
    'Building an iOS app in 24 hours using AI tools and zero code',
    'Ergonomic wooden laptop stand made from reclaimed walnut wood',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Title & Headline Generator"
      subheading="Generate 10 click-worthy, high-converting headlines for blog posts, YouTube videos, and product pages. Compare 10 proven psychological angles with instant one-tap copy."
      inputLabel="What is your topic, article, video, or product about?"
      inputPlaceholder="e.g. Simple morning stretching routine to relieve lower back pain from sitting all day..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Generate 10 Catchy Headlines"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/title-headline"
      requestPayload={(topic) => ({
        topic,
        contentType,
      })}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Content Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Content Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {contentTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setContentType(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all focus-ring ${
                    contentType === item.id
                      ? 'bg-[#101c33] border-[#ff4f9a] shadow-[0_0_12px_rgba(255, 79, 154,0.2)]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] hover:border-[rgba(143,163,192,0.3)]'
                  }`}
                >
                  <div className={`text-xs font-bold ${contentType === item.id ? 'text-[#ff4f9a]' : 'text-[#f2f7ff]'}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[#8fa3c0] mt-0.5">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const titles: Array<{ style: string; text: string }> = rawData?.titles || [];

        const copySingleTitle = async (text: string, idx: number) => {
          try {
            await navigator.clipboard.writeText(text);
            setCopiedTitleIdx(idx);
            setTimeout(() => setCopiedTitleIdx(null), 2000);
          } catch {
            // Handled
          }
        };

        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#ff4f9a] font-semibold flex items-center gap-1.5">
                <Heading className="w-3.5 h-3.5" />
                <span>10 Headlines for {contentType}</span>
              </span>

              <button
                type="button"
                onClick={() => onCopy(result)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#ff4f9a] transition-colors focus-ring"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied All 10 Titles' : 'Copy All'}</span>
              </button>
            </div>

            {/* Titles List */}
            <div className="space-y-2.5">
              {titles.length > 0 ? (
                titles.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[rgba(255, 79, 154,0.3)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101c33] text-[#5aa9ff] border border-[rgba(90,169,255,0.2)]">
                          {t.style}
                        </span>
                        <span className="text-[11px] font-mono text-[#8fa3c0]">
                          #{idx + 1}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#f2f7ff] leading-snug">
                        {t.text}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copySingleTitle(t.text, idx)}
                      className="self-end sm:self-center inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs font-medium text-[#8fa3c0] hover:text-[#ff4f9a] hover:border-[#ff4f9a] transition-colors focus-ring whitespace-nowrap"
                      title="Copy this headline"
                    >
                      {copiedTitleIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                          <span className="text-[#34e0a1]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Title</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#0a1424] text-sm text-[#8fa3c0] whitespace-pre-wrap font-mono">
                  {result}
                </div>
              )}
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Title and Headline Generator creates ten distinct, high-converting titles for blog posts, YouTube videos, and product landing pages. It gives you multiple creative angles so you can pick the one that grabs the most attention without sounding like spam.
          </p>
          <p>
            Every set of ten titles covers proven psychological hooks: step-by-step how-to guides, numbered listicles, curiosity gaps, thought-provoking questions, beginner primers, and high-impact warnings. This variety helps you test different angles on social media or find the perfect title for search engine optimization.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Enter your core topic',
          text: 'Type a brief summary of what your article, video, or product provides to the reader.',
        },
        {
          step: 'Choose your content format',
          text: 'Select Blog & Articles, YouTube Videos, or Product Pages so the headline length and rhythm match the medium.',
        },
        {
          step: 'Compare and copy',
          text: 'Review the ten angles side-by-side, tap Copy Title on your favorite, or copy the entire list to brainstorm with your team.',
        },
      ]}
      workedExample={{
        title: 'Example: How to Wake Up Early Without Feeling Tired',
        scenario: 'Topic: How to wake up early without feeling groggy, building a solid nighttime routine | Format: Blog',
        output: `### 10 Catchy Headlines

1. [How-To Guide] How to Wake Up at 6 AM Full of Energy (Even If You Are a Night Owl)
2. [Numbered List] 7 Simple Nighttime Habits That Make Waking Up Early Effortless
3. [Curiosity Hook] The Real Reason You Feel Exhausted at 7 AM (It Is Not Lack of Sleep)
4. [Question Angle] Struggling to Get Out of Bed? Why Your Evening Routine Is the Culprit
5. [Beginner Friendly] The Beginner's Guide to Becoming a Morning Person in 14 Days
6. [Direct Promise] How I Stopped Morning Grogginess in 3 Days With One Bedroom Tweak
7. [Contrarian View] Why Setting 5 Alarms Actually Keeps You Tired All Morning
8. [Ultimate Masterclass] The Master Guide to Waking Up Early and Feeling Fully Rested
9. [Insider Secret] 4 Sleep Doctor Secrets for Waking Up Refreshed Without Heavy Coffee
10. [High Impact / Urgent] Stop Doing This at 9 PM If You Want to Wake Up Energized Tomorrow`,
      }}
      tips={[
        'Keep YouTube titles under 60 characters: Titles over 60 characters often get cut off on mobile screens, making your hook invisible.',
        'Use specific numbers: Headings with odd numbers like "7" or "11" consistently generate higher click-through rates than round numbers.',
        'Match title with thumbnail: When publishing on YouTube, make sure the title and the thumbnail text complement each other rather than saying the exact same thing.',
        'Test two headlines on social media: Post the same article on X or LinkedIn with two different headline angles to see which sparks more clicks.',
      ]}
      faq={[
        {
          question: 'Are these headlines optimized for Google SEO?',
          answer: 'Yes. The generator ensures the primary keyword appears near the front of the headline while keeping total character length under 60 to 70 characters so search engines do not truncate it.',
        },
        {
          question: 'What makes YouTube titles different from blog titles?',
          answer: 'YouTube titles prioritize immediate emotional curiosity and fast comprehension on mobile devices, while blog titles focus more on keyword clarity and reader promise.',
        },
        {
          question: 'Can I generate headlines for eCommerce product pages?',
          answer: 'Yes. Select the "Product Pages" button. The tool creates high-converting value proposition headers designed to explain the key benefit to shoppers instantly.',
        },
        {
          question: 'Is there a limit on how many titles I can generate?',
          answer: 'No. The Title and Headline Generator is completely free with no usage caps, credits, or account requirements.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
