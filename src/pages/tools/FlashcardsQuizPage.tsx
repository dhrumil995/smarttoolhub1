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
    'Mitosis divides one somatic cell into 2 identical diploid cells for growth and tissue repair. Meiosis divides a germ cell twice to form 4 genetically diverse haploid gametes. Cellular respiration produces ATP in the mitochondria through glycolysis, the Krebs cycle, and the electron transport chain.',
    'The U.S. Constitution separates federal power into three branches: the Legislative branch (Congress) makes laws and controls the budget, the Executive branch (President) enforces laws and commands the armed forces, and the Judicial branch (Supreme Court) interprets laws and reviews constitutionality.',
    'HTTP status code 200 OK means a request succeeded, 301 means a permanent redirect, 404 means the requested resource was not found, and 500 means an internal server error occurred. In JavaScript, async functions always return a Promise, and the await keyword pauses execution until that Promise settles.',
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
      subheading="Turn class notes, textbook chapters, or study guides into 10 flippable flashcards and a 4-question multiple-choice practice quiz. Built for students, teachers, and self-learners."
      inputLabel="Paste your class notes, textbook excerpt, or study list"
      inputPlaceholder="Paste a paragraph or bulleted list from your lecture notes, textbook chapter, vocabulary list, or certification guide..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Generate Flashcards & Quiz"
      apiEndpoint="/api/flashcards-quiz"
      requestPayload={(input) => ({ notes: input })}
      lastUpdated="November 2026"
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
        <div className="space-y-6">
          <div className="space-y-3">
            <p>
              The Flashcard and Quiz Maker converts your written study material—such as lecture notes, textbook paragraphs, or vocabulary lists—into 10 interactive flashcards and a 4-question multiple-choice quiz.
            </p>
            <p>
              <strong>Who this tool is for:</strong> It is built for high school and college students preparing for exams, teachers who want a quick comprehension check from a lesson handout, and self-learners studying coding, foreign languages, or professional certifications. Testing yourself on questions rather than passively re-reading notes helps you spot which terms you already know and which ones need another look.
            </p>
          </div>

          {/* Short "How It Works" Section */}
          <div className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
            <h3 className="text-base sm:text-lg font-bold font-display text-[#f2f7ff]">
              How It Works
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              When you paste your notes and click <strong>Generate Flashcards &amp; Quiz</strong>, the tool reads your text, picks out the key terms, dates, definitions, and cause-and-effect facts, and formats them into two study modes:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#d1dced] list-disc pl-5">
              <li>
                <strong>10 Flippable Flashcards:</strong> Each card puts one specific question or term on the front and a short, clear answer on the back. Click any card (or press the Spacebar) to flip it over, and use the Previous/Next buttons to move through the deck.
              </li>
              <li>
                <strong>4-Question Self-Test Quiz:</strong> Switch to the quiz tab to answer four multiple-choice questions based on your notes. Clicking an option immediately shows whether your choice is right or wrong and explains why.
              </li>
              <li>
                <strong>Easy Copy &amp; Export:</strong> You can copy the full set of questions and answers as plain text to paste into your own study documents, Anki, or Quizlet.
              </li>
            </ul>
          </div>

          {/* 3 Example Inputs Section */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold font-display text-[#f2f7ff]">
              3 Example Inputs You Can Try
            </h3>
            <p className="text-xs sm:text-sm text-[#8fa3c0]">
              Not sure what to paste? You can click any of the three example buttons above the text box, or copy one of these sample inputs:
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-1.5">
                <div className="text-xs font-mono uppercase text-[#a3e635] font-semibold">
                  Example Input 1 · Biology &amp; Science Notes (For Pre-Med &amp; Science Students)
                </div>
                <p className="text-xs sm:text-sm text-[#f2f7ff] font-mono bg-[#101c33] p-3 rounded-xl border border-[rgba(143,163,192,0.12)]">
                  &ldquo;Mitosis divides one somatic cell into 2 identical diploid cells for growth and tissue repair. Meiosis divides a germ cell twice to form 4 genetically diverse haploid gametes. Cellular respiration produces ATP in the mitochondria through glycolysis, the Krebs cycle, and the electron transport chain.&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-1.5">
                <div className="text-xs font-mono uppercase text-[#7db8ff] font-semibold">
                  Example Input 2 · History &amp; Civics Summary (For High School &amp; AP Students)
                </div>
                <p className="text-xs sm:text-sm text-[#f2f7ff] font-mono bg-[#101c33] p-3 rounded-xl border border-[rgba(143,163,192,0.12)]">
                  &ldquo;The U.S. Constitution separates federal power into three branches: the Legislative branch (Congress) makes laws and controls the budget, the Executive branch (President) enforces laws and commands the armed forces, and the Judicial branch (Supreme Court) interprets laws and reviews constitutionality.&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-1.5">
                <div className="text-xs font-mono uppercase text-[#34e0a1] font-semibold">
                  Example Input 3 · Web Development &amp; IT Notes (For Coding &amp; Certification Learners)
                </div>
                <p className="text-xs sm:text-sm text-[#f2f7ff] font-mono bg-[#101c33] p-3 rounded-xl border border-[rgba(143,163,192,0.12)]">
                  &ldquo;HTTP status code 200 OK means a request succeeded, 301 means a permanent redirect, 404 means the requested resource was not found, and 500 means an internal server error occurred. In JavaScript, async functions always return a Promise, and the await keyword pauses execution until that Promise settles.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Paste your notes or pick an example',
          text: 'Copy lecture notes, bullet points, or a textbook section into the box, or click one of the 3 example inputs.',
        },
        {
          step: 'Flip through your 10 flashcards',
          text: 'Click any card or press the Spacebar to flip between the question on the front and the answer on the back.',
        },
        {
          step: 'Check your memory with the quiz',
          text: 'Switch to the Self-Test Quiz tab to answer 4 multiple-choice questions and read the explanation for each answer.',
        },
      ]}
      workedExample={{
        title: 'Example Output: Cellular Biology & Energy Production Notes',
        scenario: 'A student pasting notes on mitosis, meiosis, and cellular respiration.',
        output: `### Sample Flashcards (3 of 10):
- Card 1: Where does glycolysis take place in the cell?
  Back: In the cytoplasm, producing 2 pyruvate molecules and a net gain of 2 ATP.
- Card 2: How many cells are produced at the end of mitosis vs. meiosis?
  Back: Mitosis produces 2 identical diploid cells; meiosis produces 4 genetically diverse haploid gametes.
- Card 3: Which enzyme complex uses the proton gradient to make ATP?
  Back: ATP synthase, located in the inner mitochondrial membrane.

### Sample Multiple-Choice Question:
Q: What is the net yield of ATP from one glucose molecule during glycolysis alone?
- [A] 4 ATP
- [B] 2 ATP (Correct - 4 ATP are made, but 2 ATP are used during the initial steps)
- [C] 32 ATP
- [D] 0 ATP`,
      }}
      tips={[
        'Keep one main idea per section: Pasting focused notes on a single topic or chapter produces clearer questions than mixing unrelated subjects.',
        'Answer out loud before flipping: Try to state the definition in your own words before clicking the card to check the back.',
        'Review missed quiz questions: When you miss a multiple-choice question, read the short explanation underneath and flip through that topic card again.',
        'Copy for Anki or Quizlet: Use the Copy button to paste your generated Q&A pairs into a spreadsheet or flashcard app.',
      ]}
      faq={[
        {
          question: 'Who is the Flashcard and Quiz Maker designed for?',
          answer: 'It is built for high school and college students studying for tests, teachers making quick review questions from lesson notes, and self-learners studying programming, certifications, or new languages.',
        },
        {
          question: 'How many flashcards and quiz questions does it create?',
          answer: 'Each run creates 10 flippable question-and-answer flashcards and 4 multiple-choice quiz questions with answer explanations based on the notes you paste.',
        },
        {
          question: 'Can I use this tool for foreign language vocabulary?',
          answer: 'Yes. You can paste vocabulary lists or grammar notes in Spanish, French, German, Japanese, Mandarin, and other languages to create translation and usage flashcards.',
        },
        {
          question: 'Are my pasted study notes saved on your server?',
          answer: 'No. Your notes are sent only to generate your flashcards and quiz in memory and are not stored in a database or used to train AI models.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
