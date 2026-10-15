import React, { useState } from 'react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface RewriteTonePageProps {
  navigate: (path: string) => void;
}

export const RewriteTonePage: React.FC<RewriteTonePageProps> = ({ navigate }) => {
  const [targetTone, setTargetTone] = useState('Shorter & Punchier');
  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'rewrite-tone-changer') || LAUNCH_TOOLS[5];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'ai-email-writer' || t.slug === 'ai-prompt-improver');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const toneChoices = [
    'Shorter & Punchier',
    'Friendlier & Warmer',
    'More Formal & Executive',
    'Persuasive & Confident',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Rewrite &amp; Tone Changer"
      subheading="Transform rough drafts or awkward messages into shorter, friendlier, more formal, or persuasive text while keeping your exact meaning intact."
      inputLabel="Paste text to rewrite"
      inputPlaceholder="Paste an email, message, bio, proposal, or paragraph you want to polish..."
      examplePrompt="I think we should probably reschedule our meeting because I have too much other stuff going on right now and won't be able to prepare properly."
      generateButtonText="Rewrite in Selected Tone"
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
            Target Tone: {targetTone}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {toneChoices.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setTargetTone(tone)}
                className={`py-2 px-3 text-xs rounded-xl font-medium transition-colors border text-center ${
                  targetTone === tone
                    ? 'bg-[#39ff88] text-[#050a14] border-[#39ff88] font-bold'
                    : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The Rewrite and Tone Changer adjusts the personality, length, and authority of your writing without changing the facts or original intent.
          </p>
          <p>
            Whether you wrote an email that sounds too blunt, a memo that is far too long, or a proposal that lacks punch, this tool rephrases your sentences with clean syntax, active verbs, and natural human flow.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Paste your draft text',
          text: 'Paste the rough paragraph or sentence you want to improve.',
        },
        {
          step: 'Choose your tone goal',
          text: 'Select whether you need it shorter, friendlier, more formal, or more persuasive.',
        },
        {
          step: 'Review and copy',
          text: 'Get the rewritten copy alongside an explanation of the stylistic changes made.',
        },
      ]}
      workedExample={{
        title: 'Example: Shifting from Blunt to Warm & Professional',
        scenario: 'Original: "You did not send the files so I cannot start work. Send them today."',
        output: `### Rewritten (Friendlier & Warmer):
"Hi [Name], just checking in on the project files. Once you have a moment to send those over, I will dive right in and get started. Let me know if you run into any trouble with the transfer!"

### Changes Made:
- Removed accusatory phrasing ("You did not send").
- Reframed the delay around ready-to-help enthusiasm.
- Kept the underlying message and urgency without creating friction.`,
      }}
      tips={[
        'Pick one clear goal: If you need extreme brevity, choose "Shorter & Punchier" to eliminate filler words.',
        'Preserve your voice: If the suggestion feels too polished, blend your favorite phrases from the rewrite with your original draft.',
        'Use for difficult messages: It is ideal for saying "no" politely to invitations or scope creep.',
        'Check names and pronouns: Ensure the pronouns match your relationship with the recipient.',
      ]}
      faq={[
        {
          question: 'Does this change the meaning of my text?',
          answer: 'No. The AI is instructed to retain 100% of the facts, dates, and core intent while only altering sentence structure, vocabulary, and rhythm.',
        },
        {
          question: 'Can I use this for resumes and cover letters?',
          answer: 'Yes. Selecting "Persuasive & Confident" or "More Formal & Executive" works well for resume bullet points and LinkedIn bios.',
        },
        {
          question: 'How is this different from a grammar checker?',
          answer: 'Grammar checkers fix punctuation and spelling errors. This tool alters tone, cadence, and psychological impact so your writing achieves its goal.',
        },
        {
          question: 'Is there a limit on how many times I can rewrite?',
          answer: 'No. Feel free to try multiple tones on the same sentence to find the perfect phrasing.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
