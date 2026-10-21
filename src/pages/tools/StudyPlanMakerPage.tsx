import React, { useState } from 'react';
import { CalendarRange, Clock, BookOpen, Copy, Check, Table, Sparkles, CheckCircle2 } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';

interface StudyPlanMakerPageProps {
  navigate: (path: string) => void;
}

interface ScheduleDay {
  day: string;
  topic: string;
  focus: string;
  duration: string;
}

export const StudyPlanMakerPage: React.FC<StudyPlanMakerPageProps> = ({ navigate }) => {
  const [examDate, setExamDate] = useState<string>('');
  const [totalDays, setTotalDays] = useState<number>(14);
  const [hoursPerDay, setHoursPerDay] = useState<number>(2);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'study-plan-maker') || LAUNCH_TOOLS[19];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'task-breaker' || t.slug === 'flashcard-quiz-maker');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'AP Biology exam in 14 days with 2 hours per day',
    'Bar Exam Constitutional Law in 30 days with 4 hours per day',
    'AWS Solutions Architect exam in 10 days with 1.5 hours per day',
  ];

  const handleChipClick = (chip: string) => {
    if (chip.includes('AP Biology')) {
      setTotalDays(14);
      setHoursPerDay(2);
    } else if (chip.includes('Bar Exam')) {
      setTotalDays(30);
      setHoursPerDay(4);
    } else {
      setTotalDays(10);
      setHoursPerDay(1.5);
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Study Plan Maker"
      subheading="Generate realistic, day-by-day exam prep schedules formatted as a clean scrollable table. Balances content review, active practice, and mock test milestones with zero burnout."
      inputLabel="What subject or certification are you preparing for?"
      inputPlaceholder="e.g. AP Biology, CFA Level 1 Economics, MCAT Biochemistry, AWS Solutions Architect..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Build My Study Schedule"
      apiEndpoint="/api/study-plan"
      requestPayload={(input) => ({
        subject: input,
        examDate,
        totalDays,
        hoursPerDay,
      })}
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Days Remaining / Timeline Horizon */}
          <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-[#8fa3c0] uppercase">Preparation Timeline</span>
              <span className="font-mono font-bold text-[#a3e635]">{totalDays} Days</span>
            </div>
            <input
              type="range"
              min="3"
              max="30"
              step="1"
              value={totalDays}
              onChange={(e) => setTotalDays(Number(e.target.value))}
              className="w-full accent-[#a3e635]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#8fa3c0]">
              <span>3 Days (Sprint)</span>
              <span>14 Days (Standard)</span>
              <span>30 Days (Month)</span>
            </div>
          </div>

          {/* Daily Study Commitment */}
          <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-[#8fa3c0] uppercase">Daily Study Time</span>
              <span className="font-mono font-bold text-[#a3e635]">{hoursPerDay} hrs / day</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[1, 1.5, 2, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setHoursPerDay(hrs)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors focus-ring ${
                    hoursPerDay === hrs
                      ? 'bg-[#101c33] border-[#a3e635] text-[#a3e635]'
                      : 'bg-[#050a14] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
            <div className="text-[10px] text-[#8fa3c0] text-center pt-0.5">
              Total Commitment: {totalDays * hoursPerDay} study hours
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const schedule: ScheduleDay[] = rawData?.schedule || [];
        const strategy: string = rawData?.strategy || 'Focus on active problem solving rather than passive re-reading.';

        return (
          <div className="space-y-6">
            {/* Strategy Banner */}
            <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(163, 230, 53,0.3)] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#a3e635] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#a3e635] block">
                  Retention Strategy
                </span>
                <p className="text-sm text-[#f2f7ff] mt-0.5 leading-relaxed">
                  {strategy}
                </p>
              </div>
            </div>

            {/* Scrollable Schedule Table Container */}
            <div className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider block">
                    Day-by-Day Revision Timeline
                  </span>
                  <div className="text-sm font-bold text-[#f2f7ff]">
                    {schedule.length} Scheduled Study Days ({totalDays * hoursPerDay} Total Hours)
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onCopy(result)}
                  className="text-xs gap-1.5"
                >
                  <Copy size={14} />
                  <span>{copied ? 'Copied Schedule' : 'Copy Table'}</span>
                </Button>
              </div>

              {/* Scrollable Table View */}
              <div className="overflow-x-auto rounded-xl border border-[rgba(143,163,192,0.14)] max-h-[460px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#101c33] text-[#8fa3c0] font-mono uppercase tracking-wider border-b border-[rgba(143,163,192,0.18)] z-10">
                    <tr>
                      <th className="p-3 w-20">Day</th>
                      <th className="p-3 w-48 sm:w-60">Module / Topic</th>
                      <th className="p-3">Key Focus & Action Items</th>
                      <th className="p-3 w-24 text-right">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(143,163,192,0.1)]">
                    {schedule.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-[#101c33]/50 transition-colors ${
                          idx === schedule.length - 1 ? 'bg-[#0a1424]/30 text-[#a3e635]' : ''
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-[#a3e635] whitespace-nowrap">
                          {row.day}
                        </td>
                        <td className="p-3 font-semibold text-[#f2f7ff]">
                          {row.topic}
                        </td>
                        <td className="p-3 text-[#8fa3c0] leading-relaxed">
                          {row.focus}
                        </td>
                        <td className="p-3 font-mono text-[#8fa3c0] text-right whitespace-nowrap">
                          {row.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Study Plan Maker creates an organized, day-by-day revision schedule tailored to your available hours and upcoming exam date. Cramming everything into late-night sessions before a test triggers anxiety, sleep deprivation, and poor retrieval performance.
          </p>
          <p>
            This planner structures your preparation according to cognitive spaced repetition: foundational topics are front-loaded, followed by active practice sets, and culminating in full mock testing and high-yield review in the final 48 hours. The generated plan is displayed as a clean, scrollable schedule that you can copy into your calendar, spreadsheet, or daily notebook with one click.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Enter your subject or test name',
          text: 'Specify the exam, topic, or certification you need to master.',
        },
        {
          step: 'Select your days remaining and daily target',
          text: 'Drag the timeline slider (from 3 to 30 days) and select your realistic daily study hours.',
        },
        {
          step: 'Follow the timeline and copy your schedule',
          text: 'Review the day-by-day table and click Copy Table to export it directly into Google Sheets, Notion, or Apple Notes.',
        },
      ]}
      workedExample={{
        title: 'Example: 14-Day AP Biology Exam Revision Schedule',
        scenario: 'A high school student with 2 hours per day preparing for an upcoming AP Biology exam.',
        output: `### 14-Day Study Schedule (28 Hours Total):
- Day 1: Chemistry of Life & Water Properties (Water polarity, macromolecules, enzyme kinetics)
- Day 2: Cell Structure & Function (Membrane transport, osmosis, endomembrane system)
- Day 3: Cellular Energetics Part 1 (Glycolysis, Krebs cycle, electron transport chain)
- Day 4: Cellular Energetics Part 2 (Photosynthesis light reactions and Calvin cycle)
- Day 5: Midpoint Review & 25 Multiple Choice Practice Questions
- Day 6: Cell Communication & Cell Cycle (Signal transduction, mitosis, checkpoints)
- Day 7: Heredity & Mendelian Genetics (Punnett squares, non-Mendelian inheritance)
- Day 8: Gene Expression & Central Dogma (DNA replication, transcription, translation)
- Day 9: Biotechnology & Gel Electrophoresis (PCR, CRISPR, plasmid cloning)
- Day 10: Natural Selection & Population Genetics (Hardy-Weinberg equilibrium)
- Day 11: Ecology & Ecosystem Dynamics (Food webs, nutrient cycles, population growth curves)
- Day 12: Full Timed Practice Exam (Section 1 Multiple Choice + Section 2 Free Response)
- Day 13: Error Log Analysis & Targeted Weak Spot Review
- Day 14: Formula Sheet Review, High-Yield Concepts, and Rest`,
      }}
      tips={[
        'Log errors, not just hours: Keep an error notebook of every practice question you get wrong; reviewing this notebook on Day 13 is worth 5 hours of random reading.',
        'Protect your sleep schedule: Sleep is when your brain’s hippocampus consolidates short-term study memories into long-term neocortical networks. Never sacrifice sleep for late-night cramming.',
        'Never skip the mock exam day: Taking a full-length timed mock under exam conditions desensitizes test anxiety and trains your pacing.',
        'Use the Pomodoro 50/10 split: Study with zero distractions for 50 minutes, then take a full 10-minute break away from screens.',
      ]}
      faq={[
        {
          question: 'Can I copy the table directly into Google Sheets or Microsoft Excel?',
          answer: 'Yes. Click the Copy Table button to copy formatted Markdown and tab-delimited text that pastes cleanly into any spreadsheet or note-taking application.',
        },
        {
          question: 'What if I fall behind on my schedule by a day?',
          answer: 'Do not try to double your study time the next day. Simply regenerate your plan with the updated days remaining to redistribute the remaining topics realistically.',
        },
        {
          question: 'Does the planner account for rest days?',
          answer: 'For timelines over 14 days, the AI automatically integrates light review days and buffer periods to prevent academic burnout.',
        },
        {
          question: 'Is this tool free to use?',
          answer: 'Yes. SmartToolHub tools are 100% free with no sign-up or credit card required.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
