import React from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Choose your tool',
    description: 'Pick the task you need help with — generating an Apple Shortcut, writing an email, or solving a spreadsheet formula.',
  },
  {
    number: '02',
    title: 'Type in plain words',
    description: 'Explain what you want in simple English. No prompt engineering experience or technical knowledge required.',
  },
  {
    number: '03',
    title: 'Copy and use in seconds',
    description: 'Get your clean, formatted result right away. Tap Copy to take it to your clipboard or share it directly to your apps.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 border-t border-[rgba(143,163,192,0.12)]">
      <div className="space-y-4 mb-10">
        <div className="text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
          Simple Workflow
        </div>
        <h2 className="h2-fluid font-display text-[#f2f7ff]">
          How it works.
        </h2>
        <p className="text-sm sm:text-base text-[#8fa3c0] max-w-xl">
          Everything is built for speed. Arrive from a search, get your answer, and continue with your day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="glass-surface rounded-3xl p-6 sm:p-7 space-y-4 relative overflow-hidden"
          >
            <div className="font-mono text-2xl font-bold text-[#0a84ff]">
              {step.number}
            </div>
            <h3 className="text-lg font-bold font-display text-[#f2f7ff]">
              {step.title}
            </h3>
            <p className="text-sm text-[#8fa3c0] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
