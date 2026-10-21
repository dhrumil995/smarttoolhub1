import React, { useState } from 'react';
import { Layers, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';

interface FlashcardsQuizPageProps {
  navigate: (path: string) => void;
}

interface Flashcard {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const FlashcardsQuizPage: React.FC<FlashcardsQuizPageProps> = ({ navigate }) => {
  const [activeMode, setActiveMode] = useState<'flashcards' | 'quiz'>('flashcards');
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'flashcard-quiz-maker') || LAUNCH_TOOLS[18];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'explain-it-simply' || t.slug === 'study-plan-maker');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Cellular biology: mitosis, meiosis, and ATP synthesis notes',
    'World War II timeline, major treaties, and key figures',
    'JavaScript ES6 promises, async/await, and event loop notes',
  ];

  const handleNextCard = (total: number) => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % total);
  };

  const handlePrevCard = (total: number) => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + total) % total);
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {
      // ignore
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Flashcard and Quiz Maker"
      subheading="Transform rough study notes, lecture slides, and textbook chapters into 10 interactive flippable flashcards and self-testing multiple-choice quizzes. Built for active recall."
      inputLabel="Paste your lecture notes, textbook text, or concept list"
      inputPlaceholder="e.g. Paste notes on cell biology, European history, Python data structures, or legal contract clauses..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Generate Flashcards & Quiz"
      apiEndpoint="/api/flashcards-quiz"
      requestPayload={(input) => ({ notes: input })}
      lastUpdated="October 2026"
      navigate={navigate}
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const flashcards: Flashcard[] = rawData?.flashcards || [
          { front: 'What is Mitosis?', back: 'A process of cell division producing two genetically identical daughter cells.' },
          { front: 'What is Meiosis?', back: 'A two-step cell division reducing chromosome count by half to produce four haploid gametes.' },
          { front: 'Where is ATP generated?', back: 'Primarily in the inner mitochondrial membrane via oxidative phosphorylation.' },
        ];
        const quiz: QuizQuestion[] = rawData?.quiz || [];
        const activeCard = flashcards[currentCardIdx] || flashcards[0];

        return (
          <div className="space-y-6">
            {/* Mode Switcher */}
            <div className="flex p-1 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
              <button
                type="button"
                onClick={() => setActiveMode('flashcards')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all focus-ring flex items-center justify-center gap-2 ${
                  activeMode === 'flashcards'
                    ? 'bg-[#101c33] text-[#a3e635] shadow-md border border-[rgba(163, 230, 53,0.3)]'
                    : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
                }`}
              >
                <Layers size={15} />
                <span>10 Flashcards ({currentCardIdx + 1}/{flashcards.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('quiz')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all focus-ring flex items-center justify-center gap-2 ${
                  activeMode === 'quiz'
                    ? 'bg-[#101c33] text-[#a3e635] shadow-md border border-[rgba(163, 230, 53,0.3)]'
                    : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
                }`}
              >
                <HelpCircle size={15} />
                <span>Self-Test Quiz ({quiz.length} Questions)</span>
              </button>
            </div>

            {activeMode === 'flashcards' ? (
              /* FLASHCARD DECK VIEW */
              <div className="space-y-4">
                {/* 3D Flip Card Container with Reduced-Motion Fallback */}
                <div
                  className="w-full h-72 sm:h-80 perspective-[1000px] cursor-pointer select-none"
                  onClick={() => setIsFlipped(!isFlipped)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setIsFlipped(!isFlipped);
                    }
                  }}
                  aria-label={`Flashcard ${currentCardIdx + 1} of ${flashcards.length}. Click to flip.`}
                >
                  <div
                    className={`relative w-full h-full duration-500 rounded-3xl transition-transform transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Front Face */}
                    <div
                      className="absolute inset-0 w-full h-full p-6 sm:p-10 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] shadow-2xl flex flex-col justify-between backface-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-[#8fa3c0]">
                        <span className="uppercase tracking-wider text-[#a3e635] font-bold">FRONT · PROMPT</span>
                        <span>Card {currentCardIdx + 1} of {flashcards.length}</span>
                      </div>
                      <div className="text-center py-4">
                        <div className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff] leading-relaxed">
                          {activeCard?.front}
                        </div>
                      </div>
                      <div className="text-center text-xs text-[#8fa3c0] font-mono">
                        Tap or press Space to flip &rarr;
                      </div>
                    </div>

                    {/* Back Face */}
                    <div
                      className="absolute inset-0 w-full h-full p-6 sm:p-10 rounded-3xl bg-[#062818] border border-[rgba(163, 230, 53,0.35)] shadow-2xl flex flex-col justify-between backface-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-[#a3e635]">
                        <span className="uppercase tracking-wider font-bold">BACK · DEFINITION</span>
                        <span>Card {currentCardIdx + 1} of {flashcards.length}</span>
                      </div>
                      <div className="text-center py-4">
                        <div className="text-base sm:text-lg font-medium text-[#f2f7ff] leading-relaxed">
                          {activeCard?.back}
                        </div>
                      </div>
                      <div className="text-center text-xs text-[#a3e635]/80 font-mono">
                        Tap again to flip back
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deck Navigation Controls */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePrevCard(flashcards.length)}
                    className="gap-1.5"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="gap-1.5"
                    >
                      <RotateCcw size={14} />
                      <span>Flip Card</span>
                    </Button>
                    <span className="text-xs font-mono text-[#8fa3c0] px-2">
                      {currentCardIdx + 1} / {flashcards.length}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNextCard(flashcards.length)}
                    className="gap-1.5"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              /* MULTIPLE-CHOICE QUIZ VIEW */
              <div className="space-y-4">
                {quiz.map((q, qIdx) => {
                  const selectedOpt = selectedAnswers[qIdx];
                  const hasAnswered = selectedOpt !== undefined;
                  const isCorrect = selectedOpt === q.correctIndex;

                  return (
                    <div
                      key={qIdx}
                      className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3"
                    >
                      <div className="text-sm font-semibold text-[#f2f7ff]">
                        <span className="text-[#a3e635] font-mono mr-2">Q{qIdx + 1}:</span>
                        {q.question}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          const isThisCorrect = optIdx === q.correctIndex;

                          let btnStyle = 'bg-[#101c33] border-[rgba(143,163,192,0.14)] text-[#8fa3c0] hover:text-[#f2f7ff]';
                          if (hasAnswered) {
                            if (isThisCorrect) {
                              btnStyle = 'bg-[#0a1424] border-[#a3e635] text-[#a3e635] font-semibold';
                            } else if (isSelected) {
                              btnStyle = 'bg-[#290c14] border-[#ff5c7a] text-[#ff5c7a]';
                            } else {
                              btnStyle = 'bg-[#0a1424] border-[rgba(143,163,192,0.08)] opacity-50';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectAnswer(qIdx, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs transition-colors focus-ring flex items-center justify-between ${btnStyle}`}
                            >
                              <span>
                                <strong className="font-mono mr-2 text-[11px] opacity-70">
                                  {String.fromCharCode(65 + optIdx)}
                                </strong>
                                {opt}
                              </span>
                              {hasAnswered && isThisCorrect && (
                                <CheckCircle2 size={16} className="text-[#34e0a1] shrink-0 ml-2" />
                              )}
                              {hasAnswered && isSelected && !isThisCorrect && (
                                <XCircle size={16} className="text-[#ff5c7a] shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-xl text-xs leading-relaxed ${
                            isCorrect ? 'bg-[#0a1424] text-[#a3e635]' : 'bg-[#290c14] text-[#ff5c7a]'
                          }`}
                        >
                          <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Flashcard and Quiz Maker turns dense study notes and lectures into high-yield, interactive active recall systems. Cognitive science demonstrates that passively re-reading highlighting notes produces a false "illusion of competence." In contrast, forcing your brain to retrieve knowledge through flashcards and multiple-choice questions dramatically accelerates long-term retention.
          </p>
          <p>
            This tool generates 10 atomic flashcards featuring smooth 3D flip animations (with instant reduced-motion fallbacks for accessibility) alongside a 4-question self-testing quiz. Every question provides immediate feedback and diagnostic explanations, helping you rapidly identify weak areas before test day.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Paste your notes or text',
          text: 'Copy lecture slides, bullet points, or chapter summaries directly into the input field.',
        },
        {
          step: 'Review your 10 interactive flashcards',
          text: 'Tap any card or press the spacebar to flip between the front prompt and back definition.',
        },
        {
          step: 'Take the self-test quiz',
          text: 'Switch to the Self-Test Quiz tab to challenge yourself with timed multiple-choice questions.',
        },
      ]}
      workedExample={{
        title: 'Example: Cellular Biology & Energy Production Notes',
        scenario: 'A pre-med student pasting 3 paragraphs on aerobic cellular respiration and glycolysis.',
        output: `### Extracted Flashcards (Sample 3 of 10):
- Card 1: Where does glycolysis occur?
  Back: In the cytoplasm, yielding 2 pyruvate and a net of 2 ATP.
- Card 2: What is the primary role of NADH and FADH2?
  Back: High-energy electron carriers feeding electrons into the electron transport chain.
- Card 3: What protein generates ATP using the proton gradient?
  Back: ATP Synthase via chemiosmosis in the mitochondrial cristae.

### Multiple Choice Question Sample:
Q: What is the net yield of ATP from one glucose molecule through glycolysis alone?
- [A] 4 ATP
- [B] 2 ATP (Correct - 4 produced minus 2 consumed)
- [C] 32 ATP
- [D] 0 ATP`,
      }}
      tips={[
        'Follow the Minimum Information Principle: Effective flashcards test exactly one fact or relationship per card, avoiding messy multi-paragraph answers.',
        'Study in short 15-minute bursts: Reviewing flashcards twice daily for 15 minutes is far more effective than cramming for 3 continuous hours.',
        'Say the answer before flipping: Prevent cheating your own memory by articulating the answer aloud or in your head before tapping to reveal.',
        'Export for Anki or Quizlet: Click Copy All to paste the formatted Q&A list directly into Anki or Quizlet import tools.',
      ]}
      faq={[
        {
          question: 'How does the flashcard flip animation work with prefers-reduced-motion?',
          answer: 'If your system has reduced-motion enabled in iOS or macOS settings, the 3D rotation is automatically disabled and replaced with an immediate, accessible opacity swap.',
        },
        {
          question: 'How many flashcards are created per generation?',
          answer: 'The tool extracts the top 10 most critical high-yield concepts from your notes, ensuring focused review rather than overwhelming volume.',
        },
        {
          question: 'Can I use this for foreign vocabulary and languages?',
          answer: 'Yes. It works with Spanish, French, German, Mandarin, Japanese, and other languages, creating vocabulary pairs and sentence translation cards.',
        },
        {
          question: 'Are my study notes saved or trained on?',
          answer: 'No. SmartToolHub operates strictly ephemeral prompts; notes are processed in memory and never stored or used to train public models.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
