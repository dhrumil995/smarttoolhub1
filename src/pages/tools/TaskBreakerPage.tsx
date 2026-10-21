import React, { useState, useEffect } from 'react';
import { ListTree, CheckSquare, Square, Clock, Sparkles, Heart, RefreshCw } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface TaskBreakerPageProps {
  navigate: (path: string) => void;
}

interface StepItem {
  id: number;
  text: string;
  duration: string;
  completed: boolean;
}

const CHECKLIST_STORAGE_KEY = 'smarttoolhub_task_breaker_checklist';

export const TaskBreakerPage: React.FC<TaskBreakerPageProps> = ({ navigate }) => {
  const [detailLevel, setDetailLevel] = useState<'few' | 'normal' | 'tiny'>('normal');
  const [checkedIds, setCheckedIds] = useState<Record<number, boolean>>(() => {
    try {
      const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return {};
  });

  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'task-breaker') || LAUNCH_TOOLS[16];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'study-plan-maker' || t.slug === 'ai-prompt-improver');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'File my 2026 self-employment taxes without panic',
    'Clean and declutter an overwhelming garage workshop',
    'Write a 10-page research paper starting from blank page',
  ];

  // Sync checklist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Ignore
    }
  }, [checkedIds]);

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (!prev[id]) {
        try {
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(10);
          }
        } catch {
          // ignore
        }
      }
      return updated;
    });
  };

  const handleResetChecklist = () => {
    setCheckedIds({});
    showToast('Checklist reset');
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Task Breaker & Step Planner"
      subheading="Break overwhelming goals and paralyzing to-do lists into calm, bite-sized micro-steps with time estimates and tickable checklists. Designed to beat procrastination with zero pressure."
      inputLabel="What big task or goal feels overwhelming right now?"
      inputPlaceholder="e.g. Clean and organize my entire home office, or Write the first draft of my college thesis..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Break Into Tiny Steps"
      apiEndpoint="/api/task-breaker"
      requestPayload={(input) => ({ task: input, detailLevel })}
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-2 pt-1">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
            Step Detail Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'few', label: 'Few Steps', sub: '3-5 Milestones (20-40 min)' },
              { id: 'normal', label: 'Normal', sub: '5-7 Actionable Steps (10-25 min)' },
              { id: 'tiny', label: 'Tiny Steps', sub: '8-12 Micro-Steps (2-10 min)' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setDetailLevel(lvl.id as any)}
                className={`p-3 rounded-xl border text-left transition-colors focus-ring ${
                  detailLevel === lvl.id
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
        const steps: StepItem[] = rawData?.steps || [];
        const encouragement: string = rawData?.encouragement || 'Take it one step at a time. The first step is the only one you need to focus on right now.';
        const completedCount = steps.filter((s) => checkedIds[s.id]).length;
        const totalCount = steps.length;
        const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return (
          <div className="space-y-6">
            {/* Encouragement Banner */}
            <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(163, 230, 53,0.3)] flex items-start gap-3">
              <Heart className="w-5 h-5 text-[#a3e635] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#a3e635] block">
                  Calm Reminder
                </span>
                <p className="text-sm text-[#f2f7ff] mt-0.5 leading-relaxed">
                  {encouragement}
                </p>
              </div>
            </div>

            {/* Interactive Checklist Header */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider block">
                    Interactive Step Checklist
                  </span>
                  <div className="text-lg font-bold font-display text-[#f2f7ff] mt-0.5">
                    {completedCount} of {totalCount} completed ({progressPct}%)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetChecklist}
                    className="text-xs text-[#8fa3c0]"
                  >
                    <RefreshCw size={14} className="mr-1.5" />
                    <span>Reset</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onCopy(result)}
                    className="text-xs"
                  >
                    <span>{copied ? 'Copied' : 'Copy All'}</span>
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-[#101c33] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#a3e635] to-[#0a84ff] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Step Items */}
              <div className="space-y-2.5 pt-2">
                {steps.map((step) => {
                  const isChecked = !!checkedIds[step.id];
                  return (
                    <div
                      key={step.id}
                      onClick={() => toggleCheck(step.id)}
                      className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-[#0a1424]/50 border-[rgba(163, 230, 53,0.2)] opacity-70'
                          : 'bg-[#101c33] border-[rgba(143,163,192,0.14)] hover:border-[#a3e635]/50'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-[#a3e635] shrink-0 focus-ring rounded"
                        aria-label={isChecked ? `Uncheck step ${step.id}` : `Check step ${step.id}`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-[#34e0a1]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#8fa3c0]" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-sm font-medium ${
                              isChecked ? 'line-through text-[#8fa3c0]' : 'text-[#f2f7ff]'
                            }`}
                          >
                            {step.text}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0a1424] text-[#a3e635] border border-[rgba(163, 230, 53,0.2)] shrink-0">
                            {step.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Task Breaker dismantles daunting, ambiguous projects into calm, friction-free micro-steps. When a task feels too big—such as preparing tax returns, cleaning out an attic, or drafting an academic thesis—the brain's amygdala interprets the ambiguity as a threat, triggering task paralysis and procrastination.
          </p>
          <p>
            By decomposing your goal into discrete physical actions (each requiring 5 to 20 minutes), the mental barrier to starting evaporates. You can switch between "Few Steps" for high-level roadmaps or "Tiny Steps" for ADHD-friendly micro-actions. Each step includes a realistic time estimate and an interactive checkbox that saves your progress directly into your browser's local storage.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Type your overwhelming task or goal',
          text: 'Enter whatever you have been putting off in everyday natural language.',
        },
        {
          step: 'Choose your detail level',
          text: 'Select Tiny Steps if you feel frozen and need 5-minute easy wins, or Normal for structured milestone planning.',
        },
        {
          step: 'Generate and tick off your steps',
          text: 'Click Break Into Tiny Steps. Tap each checkbox as you complete items. Your checked progress persists automatically.',
        },
      ]}
      workedExample={{
        title: 'Example: Decluttering an Overwhelming Home Office',
        scenario: 'A user facing a messy desk, piles of paperwork, and tangled cables after 6 months of neglect.',
        output: `### Action Plan: Declutter Home Office
*Take a slow breath. You only need to touch one category at a time.*

1. [5 mins] Clear all coffee mugs, water glasses, and food wrappers into the kitchen sink.
2. [5 mins] Put all pens, markers, and scissors into a single cup or drawer.
3. [10 mins] Gather all loose papers into one neat stack without reading or sorting them yet.
4. [5 mins] Wipe the open desk surface with a damp cloth or disinfectant wipe.
5. [15 mins] Sort the paper stack into two piles: Shred/Recycle vs. Needs Action.
6. [10 mins] Coil loose computer and phone charger cables using velcro ties.
7. [5 mins] Empty the room trash can and step back to appreciate the clear workspace.`,
      }}
      tips={[
        'Start with the lowest friction step: The goal of step 1 is not to finish the project; it is simply to start moving without resistance.',
        'Use the Pomodoro technique: Set a timer for 20 minutes and promise yourself you can stop as soon as the timer chimes.',
        'Avoid multi-tasking: Focus entirely on the single checkbox in front of you. Ignore all subsequent steps until the active one is done.',
        'Progress saves locally: You can close your browser tab or lock your phone; your completed checkboxes will be preserved when you return.',
      ]}
      faq={[
        {
          question: 'Why does breaking tasks down help reduce procrastination?',
          answer: 'Procrastination is an emotional regulation problem, not a time management issue. Large goals feel threatening because the path is unclear. Converting them into concrete, small physical steps lowers the required activation energy.',
        },
        {
          question: 'Are my tasks or personal notes stored on your server?',
          answer: 'No. Prompts are processed ephemerally by our AI model and immediately discarded. Your checklist checkmark states are saved strictly in your device local storage.',
        },
        {
          question: 'What is the difference between Normal and Tiny steps?',
          answer: 'Normal generates 5-7 standard 15-to-30 minute phases. Tiny steps generates 8-12 granular micro-steps (2-10 minutes each), which is especially helpful for ADHD or executive dysfunction.',
        },
        {
          question: 'Can I copy the steps into Apple Reminders or Notion?',
          answer: 'Yes. Click the Copy All button to copy the numbered checklist with time estimates directly to your clipboard.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
