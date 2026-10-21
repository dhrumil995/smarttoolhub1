import React, { useState } from 'react';
import { Wand2, Copy, Check, CheckCircle2 } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface PromptImproverPageProps {
  navigate: (path: string) => void;
}

export const PromptImproverPage: React.FC<PromptImproverPageProps> = ({ navigate }) => {
  const [goal, setGoal] = useState<'Clear & Structured' | 'Creative Brainstorm' | 'Code & Technical' | 'Business & Professional'>('Clear & Structured');
  const [copiedPromptOnly, setCopiedPromptOnly] = useState(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'ai-prompt-improver') || LAUNCH_TOOLS[1];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'formula-helper' || t.slug === 'meeting-notes-action-items');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const goals: Array<{ id: 'Clear & Structured' | 'Creative Brainstorm' | 'Code & Technical' | 'Business & Professional'; label: string; desc: string }> = [
    { id: 'Clear & Structured', label: 'Clear & Structured', desc: 'Step-by-step role, task, and formatting' },
    { id: 'Creative Brainstorm', label: 'Creative', desc: 'Out-of-the-box ideas and novel angles' },
    { id: 'Code & Technical', label: 'Code & Technical', desc: 'Defensive edge cases, types, and logic' },
    { id: 'Business & Professional', label: 'Executive', desc: 'Concise executive tone and business impact' },
  ];

  const exampleChips = [
    'Write a workout plan for someone who is busy and only has 30 minutes at home with dumbbells.',
    'Give me marketing ideas for my local specialty coffee shop to attract remote workers on weekdays.',
    'Explain how blockchain smart contracts work to a 10-year-old using simple real-world metaphors.',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Prompt Improver"
      subheading="Transform rough requests into structured, high-performing prompts with explicit roles, clear rules, and output criteria. Works across ChatGPT, Claude, and Gemini."
      inputLabel="Paste your rough prompt or idea here"
      inputPlaceholder="e.g. Write a workout plan for someone who is busy and only has 30 minutes at home with dumbbells..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Improve & Structure Prompt"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/prompt-improver"
      requestPayload={(prompt) => ({
        prompt,
        goal,
      })}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Goal Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Optimization Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={`p-2.5 rounded-xl border text-left transition-colors focus-ring ${
                    goal === g.id
                      ? 'bg-[#101c33] border-[#ffb840] shadow-[0_0_12px_rgba(255, 184, 64,0.2)]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] hover:border-[rgba(143,163,192,0.3)]'
                  }`}
                >
                  <div className={`text-xs font-bold ${goal === g.id ? 'text-[#ffb840]' : 'text-[#f2f7ff]'}`}>
                    {g.label}
                  </div>
                  <div className="text-[10px] text-[#8fa3c0] mt-0.5 line-clamp-1">
                    {g.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const improvedPrompt: string = rawData?.improvedPrompt || '';
        const changes: string[] = rawData?.changes || [];

        const copyPromptOnly = async () => {
          try {
            await navigator.clipboard.writeText(improvedPrompt);
            setCopiedPromptOnly(true);
            setTimeout(() => setCopiedPromptOnly(false), 2000);
          } catch {
            // Handled
          }
        };

        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#ffb840] font-semibold flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Optimized Prompt ({goal})</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {improvedPrompt && (
                  <button
                    type="button"
                    onClick={copyPromptOnly}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.25)] text-xs font-semibold text-[#ffb840] hover:border-[#ffb840] transition-colors focus-ring"
                  >
                    {copiedPromptOnly ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPromptOnly ? 'Copied Prompt' : 'Copy Prompt Only'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onCopy(result)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#ffb840] transition-colors focus-ring"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied All' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            {/* Improved Prompt Box */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                Ready-to-Paste Prompt
              </label>
              <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(255, 184, 64,0.25)] text-sm text-[#f2f7ff] font-mono leading-relaxed whitespace-pre-wrap select-all">
                {improvedPrompt || result}
              </div>
            </div>

            {/* What Changed Section */}
            {changes.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[rgba(143,163,192,0.12)]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                  What I Changed &amp; Why
                </span>
                <div className="space-y-2">
                  {changes.map((change, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] flex items-start gap-2.5 text-xs text-[#8fa3c0]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#34e0a1] shrink-0 mt-0.5" />
                      <span className="text-[#f2f7ff] leading-relaxed">{change}</span>
                    </div>
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
            The AI Prompt Improver takes your rough one-sentence request and turns it into a structured, high-context prompt that gives you superior answers in ChatGPT, Claude, and Gemini on the very first try.
          </p>
          <p>
            Most AI responses turn out vague because rough prompts lack boundaries. This tool automatically inserts an authoritative persona, defines strict scope, sets negative constraints to prevent fluff, and specifies the exact formatting structure you need. Below the prompt, it provides a transparent list explaining every improvement made.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Paste your rough prompt',
          text: 'Type your raw idea into the box, whether it is a messy sentence or a few quick bullet points.',
        },
        {
          step: 'Pick an optimization goal',
          text: 'Select Clear & Structured, Creative, Code & Technical, or Executive to steer the prompt focus.',
        },
        {
          step: 'Copy and paste into your AI app',
          text: 'Tap Copy Prompt Only and paste it directly into ChatGPT, Claude, or Google Gemini.',
        },
      ]}
      workedExample={{
        title: 'Example: Vague Customer Service Prompt',
        scenario: 'Rough prompt: "Write an email to a customer whose package is late."',
        output: `### Improved Prompt:
You are a Senior Customer Experience Specialist known for calm, empathetic, and professional communication.

Task: Write a transparent, polite customer update email regarding an unexpected package delay.

Context & Boundaries:
- The customer ordered 5 days ago, and an unexpected regional weather event delayed fulfillment by 3 additional business days.
- Acknowledge their frustration immediately without offering defensive excuses.
- Provide a concrete rescheduled delivery window [Date Placeholder].
- Offer a goodwill gesture: 15% discount on their next order with code [CARE15].

Constraints:
- Keep the email under 160 words total.
- Avoid repetitive corporate clichés like "we value your business".
- Include a direct link [Tracking Link] to monitor updates in real time.

Output Format:
- Subject Line: Direct and honest (under 50 characters).
- Body: 3 short paragraphs with greeting, update, and sign-off.

### What I Changed:
1. Assigned a dedicated Customer Experience Specialist persona.
2. Added specific weather and timeline context so the AI avoids generic guesses.
3. Added strict negative constraints prohibiting corporate filler words and capping length at 160 words.`,
      }}
      tips={[
        'Define negative constraints: Saying what the AI should NOT do (e.g., "Do not use corporate buzzwords") eliminates 90% of generic AI phrasing.',
        'Always specify the target audience: Telling the AI whether the reader is a complete beginner or a senior engineer dramatically sharpens the response.',
        'Request bracketed placeholders: Having the AI leave placeholders like [Company Name] makes it easy to fill in your real details before sending.',
        'Ask for a specific output format: Explicitly asking for bullet points or markdown tables prevents long, unreadable walls of text.',
      ]}
      faq={[
        {
          question: 'Does this improved prompt work across all AI models?',
          answer: 'Yes. The structure follows universal prompt engineering standards that work reliably on ChatGPT, Claude 3.5 Sonnet, Google Gemini, and open-source models.',
        },
        {
          question: 'Why do short prompts often produce disappointing AI responses?',
          answer: 'When you give an AI a short prompt without constraints, it fills in the missing context with statistical averages. Adding persona, boundaries, and formatting requirements forces it to focus on your specific situation.',
        },
        {
          question: 'Can I edit the prompt before running it?',
          answer: 'Yes. The output is plain text. Simply copy it into your clipboard and tweak any bracketed placeholders or requirements as needed.',
        },
        {
          question: 'Are my private prompts recorded or stored?',
          answer: 'No. SmartToolHub operates with an ephemeral memory model. Your text is processed in real time and is never saved to a database or used for training.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
