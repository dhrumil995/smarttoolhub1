import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_QUESTIONS: FaqItem[] = [
  {
    question: 'Are all the tools on SmartToolHub really free to use?',
    answer: 'Yes. All 8 launch tools are completely free to use. There are no credit cards required, no trial periods, and no locked results. We plan to support hosting costs through a minimal number of non-intrusive ads and an optional Pro plan for users who want higher daily caps.',
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 border-t border-[rgba(143,163,192,0.12)]">
      <div className="space-y-4 mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-[#39ff88]">
          Honest Answers
        </div>
        <h2 className="h2-fluid font-display text-[#f2f7ff]">
          Frequently asked questions.
        </h2>
        <p className="text-sm sm:text-base text-[#8fa3c0] max-w-xl">
          Clear answers about how SmartToolHub operates, your privacy, and our independence.
        </p>
      </div>

      <div className="space-y-3 max-w-3xl">
        {FAQ_QUESTIONS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.question}
              className="glass-surface rounded-2xl border border-[rgba(143,163,192,0.14)] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                aria-expanded={isOpen}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus-laser"
              >
                <span className="font-semibold text-sm sm:text-base text-[#f2f7ff]">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#8fa3c0] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#39ff88]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-[#8fa3c0] leading-relaxed border-t border-[rgba(143,163,192,0.08)]">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
