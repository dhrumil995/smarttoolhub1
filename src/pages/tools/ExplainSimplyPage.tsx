import React, { useState } from 'react';
import { GraduationCap, Sparkles, BookOpen, HelpCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';

interface ExplainSimplyPageProps {
  navigate: (path: string) => void;
}

interface QuizItem {
  question: string;
  answer: string;
  explanation: string;
}

export const ExplainSimplyPage: React.FC<ExplainSimplyPageProps> = ({ navigate }) => {
  const [level, setLevel] = useState<'age10' | 'highschool' | 'college'>('age10');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'explain-it-simply') || LAUNCH_TOOLS[17];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'flashcard-quiz-maker' || t.slug === 'task-breaker');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Quantum computing and qubits',
    'Inflation and central bank interest rates',
    'CRISPR gene editing technology',
  ];

  const toggleReveal = (idx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Explain It Simply (AI Tutor)"
      subheading="Master complex topics through the Feynman Technique. Get crystal-clear explanations tailored to age 10, high school, or college depth, complete with real-world analogies and self-testing quizzes."
      inputLabel="What concept or complex topic do you want explained?"
      inputPlaceholder="e.g. How does quantum entanglement work? or Explain why the Federal Reserve raises interest rates..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Explain This Concept"
      apiEndpoint="/api/explain-simply"
      requestPayload={(input) => ({ topic: input, level })}
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-2 pt-1">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
            Target Audience Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'age10', label: 'Age 10', sub: 'Simple words, vivid imagery' },
              { id: 'highschool', label: 'High School', sub: 'Clear intuition, real-world context' },
              { id: 'college', label: 'College', sub: 'Rigorous principles & mechanics' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setLevel(lvl.id as any)}
                className={`p-3 rounded-xl border text-left transition-colors focus-ring ${
                  level === lvl.id
                    ? 'bg-[#101c33] border-[#a3e635] text-[#a3e635]'
                    : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                }`}
              >
                <div className="text-xs font-bold text-[#f2f7ff]">{lvl.label}</div>
                <div className="text-[10px] text-[#8fa3c0] mt-0.5">{lvl.sub}</div>
              </button>
            ))}
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const explanation: string = rawData?.explanation || result;
        const everydayExample: string = rawData?.everydayExample || '';
        const quiz: QuizItem[] = rawData?.quiz || [];

        return (
          <div className="space-y-6">
            {/* Core Explanation Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#a3e635] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <BookOpen size={14} />
                  <span>The Core Idea ({level.toUpperCase()})</span>
                </span>
                <span className="text-[11px] font-mono text-[#8fa3c0]">Feynman Technique</span>
              </div>
              <div className="text-sm sm:text-base text-[#f2f7ff] leading-relaxed whitespace-pre-wrap space-y-2">
                {explanation}
              </div>
            </div>

            {/* Everyday Analogy Card */}
            {everydayExample && (
              <div className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(163,230,53,0.3)] space-y-2">
                <span className="text-xs font-mono text-[#a3e635] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Everyday Analogy</span>
                </span>
                <p className="text-sm text-[#f2f7ff] leading-relaxed">
                  {everydayExample}
                </p>
              </div>
            )}

            {/* 3-Question Active Recall Quiz */}
            {quiz.length > 0 && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider block">
                      Active Recall Check
                    </span>
                    <div className="text-sm font-bold text-[#f2f7ff]">
                      3 Questions with Hidden Answers
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#5aa9ff]">Tap to Reveal</span>
                </div>

                <div className="space-y-3">
                  {quiz.map((q, idx) => {
                    const isRevealed = !!revealedAnswers[idx];
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.14)] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-xs sm:text-sm font-semibold text-[#f2f7ff] flex items-start gap-2">
                            <span className="text-[#a3e635] font-mono font-bold">Q{idx + 1}:</span>
                            <span>{q.question}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleReveal(idx)}
                            className="p-1.5 rounded-lg bg-[#0a1424] text-[#8fa3c0] hover:text-[#a3e635] transition-colors focus-ring shrink-0 flex items-center gap-1 text-xs"
                          >
                            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span className="hidden sm:inline">{isRevealed ? 'Hide' : 'Reveal'}</span>
                          </button>
                        </div>

                        {/* Collapsible Answer */}
                        {isRevealed && (
                          <div className="pt-2 border-t border-[rgba(143,163,192,0.12)] space-y-1 text-xs animate-fade-in">
                            <div className="text-[#a3e635] font-bold flex items-center gap-1">
                              <CheckCircle2 size={13} />
                              <span>Answer: {q.answer}</span>
                            </div>
                            <p className="text-[#8fa3c0] leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            Explain It Simply uses the celebrated Feynman Technique to strip away cognitive overload, academic jargon, and confusing acronyms. Nobel laureate Richard Feynman argued that if you cannot explain a concept to a child in plain language, you do not truly understand it yourself.
          </p>
          <p>
            Whether you are reviewing advanced biology, macroeconomic fiscal policy, or distributed computer systems, this tool translates concepts into clear metaphors you can visualize immediately. Each explanation includes a memorable everyday analogy and a 3-question active recall quiz with hidden answers to verify that the concept actually stuck.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Type your topic or paste dense text',
          text: 'Enter a single concept like "General Relativity" or paste a confusing paragraph from a textbook.',
        },
        {
          step: 'Select your target comprehension level',
          text: 'Choose Age 10 for intuitive metaphors, High School for core mechanics, or College for theoretical precision.',
        },
        {
          step: 'Test your retention with the quiz',
          text: 'Attempt to answer the 3 questions in your head before clicking Reveal to verify your understanding.',
        },
      ]}
      workedExample={{
        title: 'Example: Explaining Quantum Computing to a 10-Year-Old',
        scenario: 'A student trying to understand what makes quantum computers fundamentally different from standard MacBooks.',
        output: `### Simple Explanation (Age 10):
A normal computer thinks like a light switch: the switch is either completely ON (1) or completely OFF (0). Every app, video game, and photo on your phone is built out of millions of these ON/OFF switches.

A quantum computer uses special switches called "qubits". Imagine spinning a coin on a table: while the coin is spinning fast in circles, it is not heads and it is not tails—it is a blur of both at the same exact time. Because qubits can explore all combinations simultaneously, a quantum computer can solve massive mazes in seconds instead of years.

### Everyday Analogy:
Imagine you lose your favorite toy in a giant library. A normal computer checks one bookshelf at a time: shelf 1, shelf 2, shelf 3. A quantum computer sends thousands of invisible ghost helpers into every aisle all at once, finding the toy immediately.

### Check Your Understanding:
Q1: How is a qubit different from a normal computer switch?
- Answer: A normal switch is only 1 or 0; a qubit can be in both states at once (superposition).`,
      }}
      tips={[
        'Teach it back out loud: After reading the explanation, try summarizing the everyday analogy to a friend or into your voice notes.',
        'Use Age 10 first, then step up: If a college textbook is incomprehensible, start with the Age 10 explanation to build intuition before moving up to College depth.',
        'Actively guess before revealing quiz answers: Testing your memory before seeing the answer triggers the hypercorrection effect, cementing neural pathways.',
        'Copy to your notes: Click Copy All to paste the summary and questions into your study deck or Obsidian vault.',
      ]}
      faq={[
        {
          question: 'What is the Feynman Technique?',
          answer: 'The Feynman Technique is a 4-step mental model: 1) Pick a concept, 2) Explain it in simple language as if teaching a beginner, 3) Identify knowledge gaps where you used jargon, and 4) Simplify and refine.',
        },
        {
          question: 'Can I paste long lecture notes or textbook excerpts?',
          answer: 'Yes. You can paste up to 5,000 characters of dense textbook or paper excerpts. The AI will distill the foundational thesis and explain it clearly.',
        },
        {
          question: 'Does this tool support STEM subjects and math?',
          answer: 'Yes. It explains calculus, physics, chemistry, computer science algorithms, economics, and legal principles with customized conceptual breakdowns.',
        },
        {
          question: 'Are quiz answers generated from my specific topic?',
          answer: 'Yes. The 3 quiz questions test the primary mechanisms and common misconceptions of your exact query.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
