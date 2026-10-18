import React, { useState } from 'react';
import { UserRound, Copy, Check } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface BioGeneratorPageProps {
  navigate: (path: string) => void;
}

export const BioGeneratorPage: React.FC<BioGeneratorPageProps> = ({ navigate }) => {
  const [platform, setPlatform] = useState<'Twitter/X' | 'Instagram' | 'LinkedIn' | 'TikTok'>('Twitter/X');
  const [bioLength, setBioLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [interests, setInterests] = useState('');
  const [copiedBioIdx, setCopiedBioIdx] = useState<number | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'social-bio-generator') || LAUNCH_TOOLS[5];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'caption-hashtag-generator' || t.slug === 'title-headline-generator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const platforms: Array<{ id: 'Twitter/X' | 'Instagram' | 'LinkedIn' | 'TikTok'; label: string; limit: number }> = [
    { id: 'Twitter/X', label: 'Twitter / X', limit: 160 },
    { id: 'Instagram', label: 'Instagram', limit: 150 },
    { id: 'LinkedIn', label: 'LinkedIn', limit: 220 },
    { id: 'TikTok', label: 'TikTok', limit: 80 },
  ];

  const lengths: Array<{ id: 'short' | 'medium' | 'detailed'; label: string }> = [
    { id: 'short', label: 'Short' },
    { id: 'medium', label: 'Medium' },
    { id: 'detailed', label: 'Detailed' },
  ];

  const exampleChips = [
    'Product Designer & Figma Educator',
    'Freelance Copywriter & Ghostwriter for B2B SaaS',
    'Strength Coach & Clinical Sports Nutritionist',
  ];

  const currentLimit = platforms.find((p) => p.id === platform)?.limit || 160;

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Social Bio Generator"
      subheading="Craft 4 compelling profile bios tailored for Twitter/X, Instagram, LinkedIn, and TikTok. Compare angles and check character limits in one tap."
      inputLabel="Your Role or Profession"
      inputPlaceholder="e.g. Senior Frontend Engineer & Open Source Contributor..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Generate 4 Profile Bios"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/bio-generator"
      requestPayload={(role) => ({
        role,
        interests,
        platform,
        length: bioLength,
      })}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Interests & Topics input */}
          <div className="space-y-1.5">
            <label htmlFor="bio-interests" className="text-xs font-mono uppercase tracking-wider text-[#f2f7ff] font-semibold">
              Interests, Skills, or Hobbies
            </label>
            <input
              id="bio-interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. React, UI design, pour-over coffee, building indie apps"
              className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl px-3.5 py-2.5 text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-laser"
            />
          </div>

          {/* Platform Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                Target Platform
              </label>
              <span className="text-[11px] font-mono text-[#5aa9ff]">
                Limit: {currentLimit} characters
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`py-2 px-3 text-xs rounded-xl font-medium transition-colors border text-center focus-laser ${
                    platform === p.id
                      ? 'bg-[#39ff88] text-[#050a14] border-[#39ff88] font-bold shadow-[0_0_12px_rgba(57,255,136,0.3)]'
                      : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Length Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Bio Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {lengths.map((len) => (
                <button
                  key={len.id}
                  type="button"
                  onClick={() => setBioLength(len.id)}
                  className={`py-1.5 px-3 text-xs rounded-xl font-medium transition-colors border text-center focus-laser ${
                    bioLength === len.id
                      ? 'bg-[#5aa9ff] text-[#050a14] border-[#5aa9ff] font-bold shadow-[0_0_10px_rgba(90,169,255,0.3)]'
                      : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                  }`}
                >
                  {len.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const bios: Array<{ style: string; text: string; charCount: number }> = rawData?.bios || [];

        const copySingleBio = async (text: string, idx: number) => {
          try {
            await navigator.clipboard.writeText(text);
            setCopiedBioIdx(idx);
            setTimeout(() => setCopiedBioIdx(null), 2000);
          } catch {
            // Handled
          }
        };

        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#39ff88] font-semibold flex items-center gap-1.5">
                <UserRound className="w-3.5 h-3.5" aria-hidden="true" />
                <span>4 Profile Bios for {platform}</span>
              </span>

              <button
                type="button"
                onClick={() => onCopy(result)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#39ff88] transition-colors focus-laser"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#39ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied All' : 'Copy All'}</span>
              </button>
            </div>

            {/* Bios List */}
            <div className="space-y-3">
              {bios.length > 0 ? (
                bios.map((b, idx) => {
                  const isWithinLimit = b.text.length <= currentLimit;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[rgba(57,255,136,0.3)] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101c33] text-[#39ff88] border border-[rgba(57,255,136,0.2)]">
                            {b.style}
                          </span>
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                              isWithinLimit
                                ? 'bg-[#050a14] text-[#8fa3c0] border border-[rgba(143,163,192,0.15)]'
                                : 'bg-[rgba(255,85,85,0.15)] text-[#ff6b6b] border border-[rgba(255,85,85,0.3)]'
                            }`}
                          >
                            {b.text.length} / {currentLimit} chars
                          </span>
                        </div>
                        <p className="text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap">
                          {b.text}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => copySingleBio(b.text, idx)}
                        className="self-end sm:self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#8fa3c0] hover:text-[#39ff88] hover:border-[#39ff88] transition-colors focus-laser"
                        title="Copy this bio"
                      >
                        {copiedBioIdx === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#39ff88]" />
                            <span className="text-[#39ff88]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Bio</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
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
            The Social Bio Generator creates four distinct, ready-to-use profile bios tailored to your profession, interests, and target social network. It solves the tricky challenge of summarizing who you are in fewer than 160 characters.
          </p>
          <p>
            Every profile bio is crafted with a specific audience perspective in mind: a crisp minimalist option, an authentic creator story, an executive professional statement, and an approachable everyday introduction. Each result displays an active character counter so you know it fits your profile without awkward truncation.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Enter your role and interests',
          text: 'Type your main title or job, and add a few hobbies, favorite tools, or personal passions.',
        },
        {
          step: 'Select platform and length',
          text: 'Choose Twitter/X (160 limit), Instagram (150 limit), LinkedIn (220 limit), or TikTok (80 limit).',
        },
        {
          step: 'Copy your favorite bio',
          text: 'Tap Copy Bio on the angle that best represents your voice, and paste directly into your social profile settings.',
        },
      ]}
      workedExample={{
        title: 'Example: Freelance Web Designer & Coffee Enthusiast',
        scenario: 'Role: Freelance Web Designer | Interests: Framer, Figma, specialty coffee, building micro-apps',
        output: `### Option 1: Minimalist & Punchy (84 / 160 chars)
Web designer crafting fast digital experiences with Figma & Framer. Coffee first.

### Option 2: Creator & Storyteller (134 / 160 chars)
Designing clean websites for founders and sharing the process out loud. Fueled by espresso and curious ideas. DMs open for new projects.

### Option 3: Professional & Credible (147 / 160 chars)
Freelance Web Designer specializing in high-converting Framer landing pages. Helping early-stage startups look world-class. Book a quick audit below.

### Option 4: Casual & Approachable (118 / 160 chars)
Making the web look sharp one pixel at a time. Big fan of cold brew, indie apps, and clean layouts. Let's build something.`,
      }}
      tips={[
        'Include a clear call to action: Ending with "DMs open" or "Read my newsletter below" increases profile link clicks.',
        'Use line breaks wisely: On Instagram, vertical spacing makes bullet-style bios much easier to scan.',
        'Match the tone to the platform: Keep LinkedIn focused on business value, while Twitter and Instagram welcome personality and fun hobbies.',
        'Keep one primary link in mind: Make sure the promise in your bio naturally points people toward your bio link.',
      ]}
      faq={[
        {
          question: 'What are the character limits for bios on different platforms?',
          answer: 'Twitter/X allows 160 characters, Instagram allows 150 characters, TikTok allows 80 characters, and LinkedIn allows 220 characters for your headline. Our generator enforces these limits automatically.',
        },
        {
          question: 'Can I include emojis in my generated bio?',
          answer: 'Yes. The generator includes 1 to 2 tasteful emojis that fit your industry. You can easily remove or adjust them before saving your profile.',
        },
        {
          question: 'How do I pick between the four generated styles?',
          answer: 'Choose Minimalist if you want a clean look, Creator if you share tips and build an audience, Professional if you are pitching freelance clients, or Casual for personal accounts.',
        },
        {
          question: 'Is my personal information stored anywhere?',
          answer: 'No. The bio generator processes your input in real time and does not save your profile details, name, or interests to any database.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
