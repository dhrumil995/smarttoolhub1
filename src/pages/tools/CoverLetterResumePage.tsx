import React, { useState } from 'react';
import { Briefcase, FileText, CheckCircle2, Copy, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';

interface CoverLetterResumePageProps {
  navigate: (path: string) => void;
}

export const CoverLetterResumePage: React.FC<CoverLetterResumePageProps> = ({ navigate }) => {
  const [mode, setMode] = useState<'cover-letter' | 'bullets'>('cover-letter');
  const [role, setRole] = useState<string>('Senior Frontend Engineer');
  const [company, setCompany] = useState<string>('Stripe');
  const [background, setBackground] = useState<string>('5 years React and TypeScript experience. Reduced checkout page bundle size by 35% and improved Core Web Vitals across 2 million daily shoppers.');

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'cover-letter-resume-bullets') || LAUNCH_TOOLS[21];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'ai-email-writer' || t.slug === 'rewrite-tone-changer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Senior Frontend Engineer at Stripe with React & performance background',
    'Rough bullet: Helped make our mobile app checkout faster for customers',
    'Product Marketing Manager applying to Notion with 4 years SaaS experience',
  ];

  const handleChipClick = (chip: string) => {
    if (chip.includes('Senior Frontend Engineer')) {
      setMode('cover-letter');
      setRole('Senior Frontend Engineer');
      setCompany('Stripe');
      setBackground('5 years React & TypeScript experience. Reduced web checkout bundle size by 35% and improved Core Web Vitals for 2 million daily users.');
    } else if (chip.includes('Rough bullet')) {
      setMode('bullets');
      setRole('Mobile App Engineer');
      setCompany('');
      setBackground('Helped make our mobile app checkout faster for customers by removing unneeded analytics scripts and caching product images.');
    } else {
      setMode('cover-letter');
      setRole('Product Marketing Manager');
      setCompany('Notion');
      setBackground('4 years B2B SaaS marketing. Led go-to-market launch for collaborative workspace feature resulting in 40,000 signups in month one.');
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Cover Letter & Resume Bullet Improver"
      subheading="Draft tailored 3-paragraph cover letters or transform rough experience notes into punchy, metric-driven resume bullets. Strictly honest: action verbs and supplied facts only, never invented achievements."
      inputLabel="Your Background Experience or Rough Bullet"
      inputPlaceholder="Paste your background summary, key achievements, or a rough resume bullet point..."
      examplePrompt={background}
      exampleChips={exampleChips}
      generateButtonText={mode === 'bullets' ? 'Strengthen Resume Bullets' : 'Write Cover Letter'}
      apiEndpoint="/api/cover-letter-resume"
      requestPayload={(input) => ({
        mode,
        role,
        company,
        background: input,
      })}
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
            <button
              type="button"
              onClick={() => setMode('cover-letter')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all focus-ring flex items-center justify-center gap-2 ${
                mode === 'cover-letter'
                  ? 'bg-[#101c33] text-[#f472d0] shadow-md border border-[rgba(244, 114, 208,0.3)]'
                  : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
              }`}
            >
              <FileText size={15} />
              <span>Tailored Cover Letter</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('bullets')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all focus-ring flex items-center justify-center gap-2 ${
                mode === 'bullets'
                  ? 'bg-[#101c33] text-[#f472d0] shadow-md border border-[rgba(244, 114, 208,0.3)]'
                  : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
              }`}
            >
              <Briefcase size={15} />
              <span>3 Strong Resume Bullets</span>
            </button>
          </div>

          {/* Role and Company Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8fa3c0]">
                Target Job Title / Role
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Product Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8fa3c0]">
                Target Company (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Stripe, Linear, Notion, or leave blank"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
            </div>
          </div>

          {/* Strict Honesty Guarantee */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#f472d0] bg-[#0a1424] px-3.5 py-2 rounded-xl border border-[rgba(244, 114, 208,0.25)]">
            <ShieldCheck size={16} className="shrink-0" />
            <span>Integrity Lock: We never invent false companies, fake numbers, or imaginary achievements. Only your real experiences are polished.</span>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const isBullets = mode === 'bullets';
        const bullets: string[] = rawData?.bullets || [];

        return (
          <div className="space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#f472d0] uppercase tracking-wider font-semibold">
                    {isBullets ? '3 Action-Verb Resume Bullets' : 'Tailored Cover Letter'}
                  </span>
                  <div className="text-xs text-[#8fa3c0] mt-0.5">
                    Target: {role} {company ? `at ${company}` : ''}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onCopy(result)}
                  className="text-xs gap-1.5"
                >
                  <Copy size={14} />
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
                </Button>
              </div>

              {isBullets && bullets.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {bullets.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.14)] text-xs sm:text-sm text-[#f2f7ff] leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f472d0] mt-2 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap bg-[#101c33] p-4 rounded-xl border border-[rgba(143,163,192,0.14)]">
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
            The Cover Letter and Resume Bullet Improver refines your real professional experiences into crisp, high-impact career copy. Most applicant tracking systems (ATS) and human hiring managers spend fewer than 10 seconds scanning a resume; they look specifically for strong action verbs and verified outcomes.
          </p>
          <p>
            Unlike generic AI tools that hallucinate fake metrics, fabricated revenue numbers, and false leadership claims, this tool adheres to strict integrity constraints. It restructures your actual background using proven STAR (Situation, Task, Action, Result) principles, using numbers and metrics only if you provided them in your prompt.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Select Cover Letter or Resume Bullets',
          text: 'Toggle between a short 3-paragraph application letter or 3 high-impact resume bullet points.',
        },
        {
          step: 'Enter your target role and company',
          text: 'Specify the exact job title and company name so the vocabulary aligns with the hiring manager expectations.',
        },
        {
          step: 'Paste your raw background experience',
          text: 'Provide unformatted bullets, rough notes, or metrics from your current role.',
        },
        {
          step: 'Copy and paste into your application',
          text: 'Review the output and copy it directly into your Word doc, Google Docs, or applicant portal.',
        },
      ]}
      workedExample={{
        title: 'Example: Polishing a Rough Engineering Bullet',
        scenario: 'A developer with a rough note: "Helped make our web checkout faster by deleting old tracking scripts and caching images."',
        output: `### 3 High-Impact Resume Bullets:
• Accelerated web checkout performance by auditing third-party scripts and implementing browser asset caching protocols.
• Streamlined customer checkout friction by reducing render-blocking dependencies across high-traffic checkout funnels.
• Partnered cross-functionally to optimize Core Web Vitals, eliminating obsolete telemetry tags to improve page responsiveness.

Notice: No invented percentages or fabricated revenue stats—just clear, active, confident engineering phrasing.`,
      }}
      tips={[
        'Avoid invented metrics: Never let an AI tool invent "boosted revenue by 42%" on your behalf; interviewers will ask you to explain the exact math during live rounds.',
        'Keep cover letters under 250 words: Hiring managers despise multi-page cover letters. Three crisp paragraphs demonstrating cultural fit and direct value always outperform a novel.',
        'Begin with active verbs: Words like Spearheaded, Engineered, Orchestrated, Consolidated, and Overhauled carry significantly more weight than passive verbs like "Helped with" or "Responsible for".',
        'Match keywords from the job description: Incorporate 2-3 specific technical keywords from the company’s job listing into your background notes.',
      ]}
      faq={[
        {
          question: 'Does this tool guarantee passing Applicant Tracking Systems (ATS)?',
          answer: 'No tool can guarantee ATS passage because ATS platforms simply parse text for relevant keywords. However, using clear standard formatting and industry action verbs makes your text significantly easier for ATS parsers to index.',
        },
        {
          question: 'Will this tool invent accomplishments I did not achieve?',
          answer: 'No. We have strictly instructed the AI prompt to never fabricate numbers, clients, or technologies. It only restructures and clarifies facts you provide.',
        },
        {
          question: 'Are my resume notes saved or shared with recruiters?',
          answer: 'No. SmartToolHub operates zero storage for prompts. Your career details are processed ephemerally and discarded immediately.',
        },
        {
          question: 'Can I generate both bullets and a cover letter from the same notes?',
          answer: 'Yes. Simply toggle the mode button at the top and click generate again.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
