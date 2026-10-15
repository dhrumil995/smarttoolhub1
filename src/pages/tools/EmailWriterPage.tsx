import React, { useState } from 'react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface EmailWriterPageProps {
  navigate: (path: string) => void;
}

export const EmailWriterPage: React.FC<EmailWriterPageProps> = ({ navigate }) => {
  const [selectedTone, setSelectedTone] = useState('Professional & Friendly');
  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'ai-email-writer') || LAUNCH_TOOLS[2];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'rewrite-tone-changer' || t.slug === 'ai-summarizer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const toneOptions = ['Professional & Friendly', 'Short & Direct', 'Formal Executive', 'Gentle Follow-Up'];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Email Writer"
      subheading="Draft ready-to-send emails in seconds. Give your purpose, select a tone, list your main points, and get an email with a catchy subject line and polite closing."
      inputLabel="Purpose and key bullet points"
      inputPlaceholder="e.g. Ask landlord to fix leaking kitchen sink, mention it started Wednesday, ask for repair window by Friday..."
      examplePrompt="Ask manager for 2 days off next month (November 14-15) for family commitment. Mention all projects will be completed ahead of time."
      generateButtonText="Write Ready-to-Send Email"
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
            Select Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {toneOptions.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setSelectedTone(tone)}
                className={`py-2 px-3 text-xs rounded-xl font-medium transition-colors border text-center ${
                  selectedTone === tone
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
            The AI Email Writer eliminates the stress of drafting emails from scratch. Whether you need to ask your boss for time off, follow up with a quiet freelance client, or respond to an inquiry, this tool formats your core thoughts into polished email prose.
          </p>
          <p>
            It generates high-converting subject lines, structured paragraphs that respect your recipient’s time, and clean calls to action so there is no ambiguity on next steps.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Define your purpose',
          text: 'Type a few bullets describing who the email is for and what you need to achieve.',
        },
        {
          step: 'Pick your tone',
          text: 'Choose between Professional & Friendly, Short & Direct, Formal Executive, or Gentle Follow-Up.',
        },
        {
          step: 'Copy and paste into your mail app',
          text: 'Tap Copy to bring the subject and body into Gmail, Outlook, or Apple Mail.',
        },
      ]}
      workedExample={{
        title: 'Example: Inquiring on an Overdue Invoice',
        scenario: 'Freelance client invoice #1042 was due 5 days ago. Need polite reminder with payment link.',
        output: `Subject: Friendly Reminder: Invoice #1042 past due date

Hi [Client Name],

I hope you are having a productive week.

I am checking in regarding Invoice #1042 ($1,450 for October Design Services), which reached its due date on [Date]. 

Could you please confirm if this has been processed for payment or if you need me to resend the PDF invoice or payment link?

You can view and settle the invoice directly here: [Link]

Thank you for your time,
[Your Name]`,
      }}
      tips={[
        'Lead with the call to action: Tell the recipient early what decision or information you need.',
        'Keep body paragraphs under 3 sentences: Short paragraphs are much easier to scan on phone screens.',
        'Use placeholders: Leave [Name] and [Date] brackets so you remember to customize them before hitting send.',
        'Review tone before sending: Make sure the generated greeting matches how you normally address the person.',
      ]}
      faq={[
        {
          question: 'Can I write emails in different languages?',
          answer: 'Yes. If you enter your prompt in Spanish, French, German, or any other major language, the generated email will be written in that language.',
        },
        {
          question: 'Will the email sound like a generic AI robot?',
          answer: 'No. The prompt guidelines emphasize 7th-grade reading level, human pacing, active voice, and zero corporate buzzwords.',
        },
        {
          question: 'Are my email drafts saved on your servers?',
          answer: 'No. Your email inputs and outputs are processed ephemerally and are never stored on our database.',
        },
        {
          question: 'How do I handle sensitive work topics?',
          answer: 'We recommend omitting private personal names or confidential project code-names; use placeholders like [Project Alpha] instead.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
