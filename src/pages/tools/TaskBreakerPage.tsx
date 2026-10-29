import React, { useState, useEffect } from 'react';
import {
  ListTree,
  CheckSquare,
  Square,
  Clock,
  Sparkles,
  Heart,
  RefreshCw,
  Copy,
  ChevronDown,
  Loader2,
  Info,
} from 'lucide-react';
import { ToolPageTemplate, ToolFaqItem } from '../../components/tools/ToolPageTemplate.tsx';
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
  completed?: boolean;
  substeps?: Array<{
    id: string;
    text: string;
    duration: string;
    completed?: boolean;
  }>;
}

const CHECKLIST_STORAGE_KEY = 'smarttoolhub_task_breaker_checklist';
const SUBSTEPS_STORAGE_KEY = 'smarttoolhub_task_breaker_substeps';

export const TaskBreakerPage: React.FC<TaskBreakerPageProps> = ({ navigate }) => {
  const [detailLevel, setDetailLevel] = useState<'few' | 'normal' | 'tiny'>('normal');
  const [timeAvailable, setTimeAvailable] = useState<string>('');
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return {};
  });

  const [substepsMap, setSubstepsMap] = useState<Record<number, Array<{ id: string; text: string; duration: string }>>>(() => {
    try {
      const stored = localStorage.getItem(SUBSTEPS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return {};
  });

  const [breakingDownStepId, setBreakingDownStepId] = useState<number | null>(null);
  const [activeTaskPrompt, setActiveTaskPrompt] = useState<string>('');

  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'task-breaker') || LAUNCH_TOOLS[16];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'study-plan-maker' || t.slug === 'ai-prompt-improver');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'File my self-employment taxes without panic',
    'Clean and declutter an overwhelming garage workshop',
    'Write a 10-page research paper starting from a blank page',
  ];

  const timeChips = [
    { label: 'Any time', value: '' },
    { label: '10 min', value: '10 min' },
    { label: '30 min', value: '30 min' },
    { label: '1 hour', value: '1 hour' },
    { label: 'A day', value: 'a day' },
  ];

  // Sync checklist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedIds));
    } catch {
      // Ignore
    }
  }, [checkedIds]);

  // Sync sub-steps to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SUBSTEPS_STORAGE_KEY, JSON.stringify(substepsMap));
    } catch {
      // Ignore
    }
  }, [substepsMap]);

  const toggleCheck = (id: string | number) => {
    const key = String(id);
    setCheckedIds((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (!prev[key]) {
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
    setSubstepsMap({});
    try {
      localStorage.removeItem(CHECKLIST_STORAGE_KEY);
      localStorage.removeItem(SUBSTEPS_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Checklist and sub-steps reset');
  };

  const handleBreakDownStepMore = async (step: StepItem, taskContext: string) => {
    if (breakingDownStepId === step.id) return;
    setBreakingDownStepId(step.id);

    try {
      const res = await fetch('/api/task-breaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskContext || 'Task Breakdown',
          parentStep: step.text,
          detailLevel: 'tiny',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate sub-steps. Please try again.');
      }

      const data = await res.json();
      if (Array.isArray(data.steps) && data.steps.length > 0) {
        const newSubsteps = data.steps.map((sub: any, idx: number) => ({
          id: `${step.id}.${idx + 1}`,
          text: sub.text,
          duration: sub.duration || '3 mins',
        }));

        setSubstepsMap((prev) => ({
          ...prev,
          [step.id]: newSubsteps,
        }));
        showToast(`Step ${step.id} broken into ${newSubsteps.length} micro-steps!`, 'success');
      } else {
        throw new Error('Could not break step down.');
      }
    } catch (err: any) {
      showToast(err.message || 'Could not break down step. Try again.', 'error');
    } finally {
      setBreakingDownStepId(null);
    }
  };

  const handleCopyAsTextList = (steps: StepItem[], encouragement: string, taskContext: string) => {
    let text = `Task Breakdown: ${taskContext || 'My Task'}\n`;
    if (encouragement) {
      text += `Note: ${encouragement}\n\n`;
    }
    steps.forEach((step) => {
      const isDone = !!checkedIds[String(step.id)];
      text += `${isDone ? '[X]' : '[ ]'} ${step.id}. [${step.duration}] ${step.text}\n`;
      const substeps = substepsMap[step.id];
      if (substeps && substeps.length > 0) {
        substeps.forEach((sub) => {
          const isSubDone = !!checkedIds[sub.id];
          text += `    ${isSubDone ? '[X]' : '[ ]'} ${sub.id} [${sub.duration}] ${sub.text}\n`;
        });
      }
    });

    try {
      navigator.clipboard.writeText(text);
      showToast('Copied checklist as clean text list!', 'success');
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const faqs: ToolFaqItem[] = [
    {
      question: 'Why does breaking tasks down help reduce procrastination?',
      answer:
        'Procrastination is an emotional regulation problem, not a time management issue. Large goals feel threatening because the path is unclear. Converting them into concrete, small physical steps lowers the required activation energy.',
    },
    {
      question: 'Are my tasks or personal notes stored on your server?',
      answer:
        'No. Prompts are processed ephemerally by our AI model and immediately discarded. Your checklist checkmark states are saved strictly in your device local storage.',
    },
    {
      question: 'What is the difference between Normal and Tiny steps?',
      answer:
        'Normal generates 5-7 standard 10-to-25 minute steps. Tiny steps generates 8-12 granular micro-steps (2-10 minutes each), which is especially helpful for ADHD or executive dysfunction.',
    },
    {
      question: 'Can I break down an individual step even further?',
      answer:
        'Yes. Click "Break down this step more" on any step to instantly unpack it into bite-sized 2-to-5 minute sub-steps.',
    },
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Task Breaker & Step Planner"
      subheading="Break down tasks and overwhelmed to-do lists into calm micro-steps with time estimates and tickable checklists. Beat task paralysis with zero guilt and zero pressure."
      inputLabel="What big task or goal feels overwhelming right now? (Max 500 characters)"
      inputPlaceholder="e.g. File my self-employment taxes, clean out the garage, or write the first draft of my project..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Break Down Tasks"
      apiEndpoint="/api/task-breaker"
      requestPayload={(input) => {
        setActiveTaskPrompt(input.slice(0, 500));
        return {
          task: input.slice(0, 500),
          detailLevel,
          timeAvailable: timeAvailable || undefined,
        };
      }}
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Detail Level Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Detail Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'few', label: 'Few Steps', sub: '3-5 milestones' },
                { id: 'normal', label: 'Normal', sub: '5-7 clear steps' },
                { id: 'tiny', label: 'Tiny Steps', sub: '8-12 micro-steps' },
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

          {/* Time I Have Chips */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Time I Have (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {timeChips.map((chip) => {
                const isSelected = timeAvailable === chip.value;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setTimeAvailable(chip.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus-ring ${
                      isSelected
                        ? 'bg-[#a3e635] text-[#050b14] border-[#a3e635] font-semibold'
                        : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.2)] hover:border-[#a3e635]/50 hover:text-[#f2f7ff]'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, input }) => {
        const steps: StepItem[] = rawData?.steps || [];
        const encouragement: string =
          rawData?.encouragement ||
          'Take a slow breath. You only need to do step 1 right now. The rest can wait.';
        const currentTask = input || activeTaskPrompt || 'Your Goal';

        // Compute total items and completed items (including any sub-steps)
        let totalItems = steps.length;
        let completedItems = steps.filter((s) => checkedIds[String(s.id)]).length;

        steps.forEach((s) => {
          const subs = substepsMap[s.id];
          if (subs && subs.length > 0) {
            totalItems += subs.length;
            completedItems += subs.filter((sub) => checkedIds[sub.id]).length;
          }
        });

        const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return (
          <div className="space-y-6">
            {/* Kind & Calm Encouragement Banner */}
            <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(163,230,53,0.3)] flex items-start gap-3 shadow-sm">
              <Heart className="w-5 h-5 text-[#a3e635] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#a3e635] block">
                  Calm & Kind Reminder
                </span>
                <p className="text-sm text-[#f2f7ff] leading-relaxed">
                  {encouragement}
                </p>
                <p className="text-[11px] text-[#8fa3c0] pt-1">
                  AI can make mistakes. Adjust the steps to fit your day.
                </p>
              </div>
            </div>

            {/* Interactive Checklist Container */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider block">
                    Interactive Step Checklist
                  </span>
                  <div className="text-lg font-bold font-display text-[#f2f7ff] mt-0.5">
                    {completedItems} of {totalItems} completed ({progressPct}%)
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
                    onClick={() => handleCopyAsTextList(steps, encouragement, currentTask)}
                    className="text-xs"
                  >
                    <Copy size={14} className="mr-1.5" />
                    <span>Copy as Text List</span>
                  </Button>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="h-2 w-full bg-[#101c33] rounded-full overflow-hidden p-0.5" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full bg-gradient-to-r from-[#a3e635] to-[#0a84ff] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Step Items List */}
              <div className="space-y-3 pt-2">
                {steps.map((step) => {
                  const stepKey = String(step.id);
                  const isChecked = !!checkedIds[stepKey];
                  const substeps = substepsMap[step.id] || [];
                  const isBreakingDown = breakingDownStepId === step.id;

                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
                        isChecked
                          ? 'bg-[#0a1424]/60 border-[rgba(163,230,53,0.2)] opacity-75'
                          : 'bg-[#101c33] border-[rgba(143,163,192,0.14)] hover:border-[#a3e635]/40'
                      }`}
                    >
                      {/* Parent Step Row */}
                      <div className="flex items-start gap-3 select-none">
                        <button
                          type="button"
                          onClick={() => toggleCheck(step.id)}
                          className="mt-0.5 text-[#a3e635] shrink-0 focus-ring rounded"
                          aria-label={isChecked ? `Uncheck step ${step.id}` : `Check step ${step.id}`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-[#34e0a1]" />
                          ) : (
                            <Square className="w-5 h-5 text-[#8fa3c0]" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              onClick={() => toggleCheck(step.id)}
                              className={`text-sm font-medium cursor-pointer ${
                                isChecked ? 'line-through text-[#8fa3c0]' : 'text-[#f2f7ff]'
                              }`}
                            >
                              <strong className="text-[#a3e635] mr-1.5">{step.id}.</strong>
                              {step.text}
                            </span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0a1424] text-[#a3e635] border border-[rgba(163,230,53,0.2)] shrink-0 flex items-center gap-1">
                              <Clock size={11} />
                              {step.duration}
                            </span>
                          </div>

                          {/* Action Button: Break Down This Step More */}
                          <div className="mt-2.5 pt-2 border-t border-[rgba(143,163,192,0.08)] flex items-center justify-between">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBreakDownStepMore(step, currentTask);
                              }}
                              disabled={isBreakingDown}
                              className="text-xs text-[#8fa3c0] hover:text-[#a3e635] flex items-center gap-1.5 transition-colors focus-ring rounded py-1 px-2 -ml-2 hover:bg-[#0a1424]"
                            >
                              {isBreakingDown ? (
                                <>
                                  <Loader2 size={13} className="animate-spin text-[#a3e635]" />
                                  <span>Breaking down step...</span>
                                </>
                              ) : (
                                <>
                                  <ListTree size={13} />
                                  <span>
                                    {substeps.length > 0 ? 'Re-break down this step' : 'Break down this step more'}
                                  </span>
                                </>
                              )}
                            </button>

                            {substeps.length > 0 && (
                              <span className="text-[11px] text-[#8fa3c0] font-mono">
                                {substeps.filter((sub) => checkedIds[sub.id]).length}/{substeps.length} sub-steps
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Nested Sub-Steps (if broken down) */}
                      {substeps.length > 0 && (
                        <div className="mt-3 pl-8 pr-2 py-2 space-y-2 border-l-2 border-[#a3e635]/30 ml-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#a3e635]/80 block">
                            Micro-Steps
                          </span>
                          {substeps.map((sub) => {
                            const isSubChecked = !!checkedIds[sub.id];
                            return (
                              <div
                                key={sub.id}
                                onClick={() => toggleCheck(sub.id)}
                                className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between gap-2 select-none transition-colors ${
                                  isSubChecked
                                    ? 'bg-[#0a1424]/40 border-[rgba(163,230,53,0.15)] opacity-70'
                                    : 'bg-[#0a1424] border-[rgba(143,163,192,0.1)] hover:border-[#a3e635]/30'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {isSubChecked ? (
                                    <CheckSquare className="w-4 h-4 text-[#34e0a1] shrink-0" />
                                  ) : (
                                    <Square className="w-4 h-4 text-[#8fa3c0] shrink-0" />
                                  )}
                                  <span className={isSubChecked ? 'line-through text-[#8fa3c0]' : 'text-[#f2f7ff]'}>
                                    <strong className="text-[#8fa3c0] mr-1">{sub.id}</strong> {sub.text}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-[#a3e635] px-1.5 py-0.5 rounded bg-[#101c33] shrink-0">
                                  {sub.duration}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Sticky Bar for quick copy and progress */}
            <div className="sm:hidden fixed bottom-3 inset-x-3 z-30 p-3 rounded-2xl bg-[#0a1424]/95 backdrop-blur-md border border-[rgba(143,163,192,0.2)] shadow-xl flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#f2f7ff] truncate">
                  {completedItems} of {totalItems} done ({progressPct}%)
                </div>
                <div className="text-[10px] text-[#8fa3c0] truncate">
                  Progress saved locally
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopyAsTextList(steps, encouragement, currentTask)}
                  className="text-xs py-1.5 px-3"
                >
                  <Copy size={13} className="mr-1" />
                  <span>Copy List</span>
                </Button>
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-4">
          <p>
            The Task Breaker dismantles daunting, ambiguous projects into calm, friction-free micro-steps. When a task feels too big—such as preparing self-employment tax returns, decluttering an overflowing garage, or drafting an academic paper—the human brain perceives the ambiguity as cognitive threat. This triggers executive dysfunction, task paralysis, and procrastination.
          </p>
          <p>
            By converting a vague objective into discrete, actionable physical movements (each with a 2 to 20 minute realistic time estimate), the activation energy needed to begin drops drastically. You can select your preferred detail level (Few Steps for high-level roadmaps, Normal for balanced milestones, or Tiny Steps for ADHD-friendly micro-actions). You can also set how much time you currently have available, such as 10 minutes or 1 hour, so your plan fits your current energy level.
          </p>
          <p>
            Best of all, every step features a "Break down this step more" button. If step 2 still feels too difficult or vague to start, tap the button to immediately split it into three gentle 2-minute sub-steps. Your completed checkboxes and sub-tasks are preserved automatically in your device's local storage with zero server retention.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Type your big task or goal',
          text: 'Enter whatever you feel stuck on in everyday plain language (up to 500 characters).',
        },
        {
          step: 'Select your detail level and time',
          text: 'Choose Tiny Steps if you are feeling frozen or choose Normal for structured milestones. Optionally tap your available time window.',
        },
        {
          step: 'Tick off steps as you go',
          text: 'Click Break Down Tasks. Tap checkboxes to check off completed items. Progress saves automatically in your browser.',
        },
        {
          step: 'Unpack sticky steps further',
          text: 'If any single step still feels too intimidating, click "Break down this step more" to unpack it into bite-sized micro-steps.',
        },
      ]}
      workedExample={{
        title: 'Worked Example: Decluttering an Overwhelming Home Workshop',
        scenario: 'A homeowner facing a chaotic garage workshop with loose tools, cardboard boxes, and scrap wood after 12 months of neglected clutter.',
        output: `### Action Plan: Declutter Garage Workshop
*Take a slow breath. You do not need to clean the entire room today. Just step 1.*

1. [3 mins] Put on safety gloves and set one large empty cardboard box by the doorway.
2. [5 mins] Walk around and pick up all obvious loose trash (scrap paper, empty bottles) and drop into the trash bin.
3. [10 mins] Gather all hand tools (hammers, screwdrivers, pliers) into a single plastic tote without organizing them yet.
   - [2 mins] Pick up hand tools from the center workbench.
   - [3 mins] Pick up tools resting on floor corners.
   - [3 mins] Move the full tote onto the lower metal shelf.
4. [5 mins] Sweep the main walking path from the doorway to the workbench with a push broom.
5. [15 mins] Sort the contents of just one small shelf into Keep vs. Donate.
6. [2 mins] Wipe your hands, celebrate the open floor space, and stop for the day.`,
      }}
      tips={[
        'The rule of five minutes: Tell yourself you only have to do step 1 for 3 to 5 minutes. You have full permission to pause or stop afterwards.',
        'Use the drill-down feature: If a step says "draft report outline" and you still feel stuck, click "Break down this step more" to reduce it to "Open a blank doc and write 3 headings".',
        'Single-step focus: Hide or ignore future steps until the active checkbox in front of you is marked complete.',
        'No pressure, no guilt: Missing a time estimate does not matter. The goal is purely forward momentum, not perfection.',
      ]}
      faq={faqs}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
