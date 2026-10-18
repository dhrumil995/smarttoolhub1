import React from 'react';
import { SectionHeader } from '../ui/SectionHeader.tsx';
import { Accordion } from '../ui/Accordion.tsx';

interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_QUESTIONS: FaqItem[] = [
  {
    question: 'Are all the tools on SmartToolHub really free to use?',
    answer: 'Yes. All launch tools are completely free to use. There are no credit cards required, no trial periods, and no locked results. We plan to support hosting costs through a minimal number of non-intrusive ads and an optional Pro plan for users who want higher daily caps.',
  },
  {
    question: 'Do I need to create an account or provide an email?',
    answer: 'No. You can open any tool, paste your text, and get your result in seconds. Your generated history and favorite tools are stored locally on your own device using browser localStorage so you never have to remember a password.',
  },
  {
    question: 'What happens to the text and data I enter?',
    answer: 'The text you enter is sent securely to the AI service strictly to generate your response. We do not store, sell, or train models on your personal prompts or generated results.',
  },
  {
    question: 'Can the AI make mistakes in its answers?',
    answer: 'Yes. While the models provide accurate, structured responses, AI models can occasionally produce errors, incorrect dates, or syntax inaccuracies in formulas. Always review important messages, code, and calculations before sending or implementing them.',
  },
  {
    question: 'Will these tools work smoothly on mobile phones and tablets?',
    answer: 'Yes. SmartToolHub is built mobile-first. We designed large 44px+ tap targets, zero horizontal scrolling, and a dedicated 56px bottom navigation dock tailored for single-thumb smartphone navigation.',
  },
  {
    question: 'Is SmartToolHub affiliated with Apple Inc. or Google LLC?',
    answer: 'No. SmartToolHub is an independent website created by Dhrumil Aslaliya. We are not affiliated with, sponsored by, or endorsed by Apple Inc. or Google LLC. Apple Shortcuts is a trademark of Apple Inc.',
  },
];

export const FaqSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 border-t border-[rgba(143,163,192,0.12)]">
      <SectionHeader
        eyebrow="Honest Answers"
        eyebrowIcon="HelpCircle"
        title="Frequently asked questions"
        subtext="Clear answers about how SmartToolHub operates, your privacy, and our independence."
      />

      <div className="max-w-3xl">
        <Accordion items={FAQ_QUESTIONS} defaultOpenIndex={0} />
      </div>
    </section>
  );
};
