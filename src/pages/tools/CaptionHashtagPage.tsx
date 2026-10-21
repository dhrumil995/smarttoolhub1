import React, { useState } from 'react';
import { Hash, Copy, Check, Sparkles } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface CaptionHashtagPageProps {
  navigate: (path: string) => void;
}

export const CaptionHashtagPage: React.FC<CaptionHashtagPageProps> = ({ navigate }) => {
  const [platform, setPlatform] = useState<'Instagram' | 'TikTok' | 'LinkedIn' | 'X'>('Instagram');
  const [mood, setMood] = useState<'engaging' | 'funny' | 'professional' | 'inspirational' | 'casual'>('engaging');
  const [copiedCaptionIdx, setCopiedCaptionIdx] = useState<number | null>(null);
  const [copiedHashtagIdx, setCopiedHashtagIdx] = useState<number | null>(null);
  const [copiedAllTags, setCopiedAllTags] = useState(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'caption-hashtag-generator') || LAUNCH_TOOLS[4];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'social-bio-generator' || t.slug === 'title-headline-generator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const platforms: Array<{ id: 'Instagram' | 'TikTok' | 'LinkedIn' | 'X'; label: string }> = [
    { id: 'Instagram', label: 'Instagram' },
    { id: 'TikTok', label: 'TikTok' },
    { id: 'LinkedIn', label: 'LinkedIn' },
    { id: 'X', label: 'X (Twitter)' },
  ];

  const moods: Array<{ id: 'engaging' | 'funny' | 'professional' | 'inspirational' | 'casual'; label: string }> = [
    { id: 'engaging', label: 'Engaging' },
    { id: 'funny', label: 'Funny' },
    { id: 'professional', label: 'Professional' },
    { id: 'inspirational', label: 'Inspirational' },
    { id: 'casual', label: 'Casual' },
  ];

  const exampleChips = [
    'Behind the scenes making handcrafted ceramic matcha bowls in our home pottery studio.',
    'Launching a 10-minute daily productivity planner app for busy freelancers and creators.',
    'Weekend morning hike with coffee overlooking Mount Hood with crisp autumn leaves.',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Caption & Hashtag Generator"
      subheading="Create 5 catchy social media captions and 15 curated high-reach hashtags in seconds. Pick your platform and mood for instant post-ready results."
      inputLabel="What is your photo, video, or post about?"
      inputPlaceholder="e.g. Fresh batch of homemade cinnamon rolls coming out of the oven on a rainy Saturday morning..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Generate 5 Captions & 15 Hashtags"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/caption-hashtags"
      requestPayload={(topic) => ({
        topic,
        platform,
        mood,
      })}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Platform Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Target Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`py-2 px-3 text-xs rounded-xl font-medium transition-colors border text-center focus-ring ${
                    platform === p.id
                      ? 'bg-[#ff4f9a] text-[#050a14] border-[#ff4f9a] font-bold shadow-[0_0_12px_rgba(255, 79, 154,0.3)]'
                      : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Post Mood &amp; Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`py-1.5 px-3 text-xs rounded-xl font-medium transition-colors border text-center focus-ring ${
                    mood === m.id
                      ? 'bg-[#5aa9ff] text-[#050a14] border-[#5aa9ff] font-bold shadow-[0_0_10px_rgba(90,169,255,0.3)]'
                      : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const captions: string[] = rawData?.captions || [];
        const hashtags: string[] = rawData?.hashtags || [];

        const copySingleCaption = async (text: string, idx: number) => {
          try {
            await navigator.clipboard.writeText(text);
            setCopiedCaptionIdx(idx);
            setTimeout(() => setCopiedCaptionIdx(null), 2000);
          } catch {
            // Handled
          }
        };

        const copySingleHashtag = async (tag: string, idx: number) => {
          try {
            await navigator.clipboard.writeText(tag);
            setCopiedHashtagIdx(idx);
            setTimeout(() => setCopiedHashtagIdx(null), 1500);
          } catch {
            // Handled
          }
        };

        const copyAllHashtags = async () => {
          try {
            await navigator.clipboard.writeText(hashtags.join(' '));
            setCopiedAllTags(true);
            setTimeout(() => setCopiedAllTags(false), 2000);
          } catch {
            // Handled
          }
        };

        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#ff4f9a] font-semibold flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                <span>Generated Content ({platform} · {mood})</span>
              </span>

              <button
                type="button"
                onClick={() => onCopy(result)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#ff4f9a] transition-colors focus-ring"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Everything' : 'Copy All'}</span>
              </button>
            </div>

            {/* 5 Captions Section */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                5 Caption Angles
              </div>

              {captions.length > 0 ? (
                <div className="space-y-2.5">
                  {captions.map((caption, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[rgba(255, 79, 154,0.3)] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101c33] text-[#ff4f9a] border border-[rgba(255, 79, 154,0.2)]">
                            Option {idx + 1}
                          </span>
                        </div>
                        <p className="text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap">
                          {caption}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => copySingleCaption(caption, idx)}
                        className="self-end sm:self-start inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs font-medium text-[#8fa3c0] hover:text-[#ff4f9a] hover:border-[#ff4f9a] transition-colors focus-ring"
                        title="Copy this caption"
                      >
                        {copiedCaptionIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-[#34e0a1]" />
                            <span className="text-[#34e0a1]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0a1424] text-sm text-[#8fa3c0] whitespace-pre-wrap font-mono">
                  {result}
                </div>
              )}
            </div>

            {/* 15 Hashtags Section */}
            {hashtags.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[rgba(143,163,192,0.12)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                    15 Targeted Hashtags
                  </span>
                  <button
                    type="button"
                    onClick={copyAllHashtags}
                    className="inline-flex items-center gap-1.5 text-xs text-[#ff4f9a] font-semibold hover:underline focus-ring"
                  >
                    {copiedAllTags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAllTags ? 'Copied All 15 Tags' : 'Copy All 15 Tags'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => copySingleHashtag(tag, idx)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[#ff4f9a] text-xs font-mono text-[#5aa9ff] hover:text-[#ff4f9a] transition-colors flex items-center gap-1.5 focus-ring"
                      title="Tap to copy single hashtag"
                    >
                      <span>{tag}</span>
                      {copiedHashtagIdx === idx ? (
                        <Check className="w-3 h-3 text-[#34e0a1]" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-40 hover:opacity-100" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Caption and Hashtag Generator creates five natural social media captions and fifteen relevant hashtags in seconds. It stops you from staring at a blank screen when you have a photo or video ready to publish.
          </p>
          <p>
            Instead of giving you repetitive slogans, this tool offers five distinct angles: punchy, storytelling, questions that spark comments, educational tips, and calls to action. Each hashtag is selected to match your chosen platform, balancing large community tags with targeted topic keywords.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Describe your post',
          text: 'Type what is happening in your photo or video, or paste your main announcement into the input field.',
        },
        {
          step: 'Pick platform and mood',
          text: 'Select Instagram, TikTok, LinkedIn, or X, and choose the mood that fits your audience.',
        },
        {
          step: 'Copy in one tap',
          text: 'Tap Copy on your favorite caption or grab the entire bundle of 15 hashtags to paste straight into your social app.',
        },
      ]}
      workedExample={{
        title: 'Example: Artisanal Bakery Launching Sourdough Loaves',
        scenario: 'Pasted idea: Fresh crusty sourdough loaves coming out of the stone oven with butter and rosemary.',
        output: `### 5 Social Captions

Option 1 (Punchy):
Stone oven morning. Fresh crusty rosemary sourdough just pulled.

Option 2 (Storytelling):
There is nothing quite like hearing the crackle of a fresh loaf cooling on the rack. We spent 36 hours fermenting this sourdough with wild starter and fresh rosemary from our garden. Warm slices are waiting on the counter.

Option 3 (Interactive Question):
Are you team crispy end crust or soft center slice? Sourdough debate starts now in the comments.

Option 4 (Educational Tip):
Pro baking tip: listening to the "singing" crackle right out of the oven tells you the moisture balance is spot on.

Option 5 (Call to Action):
Fresh batches drop every morning at 7 AM. Come grab yours before the rosemary loaves sell out!

### 15 Hashtags:
#SourdoughBaking #ArtisanBread #RealBread #StoneOven #BreadLovers #BakeryLife #WildYeast #FreshBreadDaily #BakingCommunity #BreadPorn #MorningRoutine #RosemarySourdough #FoodieGram #HandmadeFood #LocalBakery`,
      }}
      tips={[
        'Mention your audience in the description: Writing "for small business owners" helps the generator tailor vocabulary and hashtags.',
        'Use interactive questions: Questions in the first two lines boost early comments, which tells social algorithms to share your post wider.',
        'Rotate your hashtags: Do not paste the exact same 30 hashtags every single day. Using 10 to 15 relevant tags per post yields higher engagement.',
        'Keep TikTok and Instagram captions readable: Break long text into short 1-to-2 line paragraphs so readers do not scroll past.',
      ]}
      faq={[
        {
          question: 'How many hashtags should I use on Instagram and TikTok?',
          answer: 'Current social media algorithms favor 5 to 15 targeted, accurate hashtags rather than 30 spammy tags. Our tool produces 15 high-relevance tags so you can paste them all or pick your top 10.',
        },
        {
          question: 'Can I generate professional captions for LinkedIn?',
          answer: 'Yes. Simply tap the LinkedIn platform button. The tool adjusts sentence structure, removes unnecessary slang, and highlights professional insights and clear discussions.',
        },
        {
          question: 'Are emojis included in the generated captions?',
          answer: 'The tool uses 1 to 2 tasteful emojis that match the mood you selected. You can easily delete or replace them before posting.',
        },
        {
          question: 'Is this caption generator free to use?',
          answer: 'Yes. You can generate unlimited captions and hashtags with no account, no credits, and no subscription fees.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
