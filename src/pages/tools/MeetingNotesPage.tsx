import React, { useState } from 'react';
import { ListChecks, Copy, Check, Users, ListTodo, CheckCircle2 } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface MeetingNotesPageProps {
  navigate: (path: string) => void;
}

export const MeetingNotesPage: React.FC<MeetingNotesPageProps> = ({ navigate }) => {
  const [copiedActionsOnly, setCopiedActionsOnly] = useState(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'meeting-notes-action-items') || LAUNCH_TOOLS[8];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'ai-prompt-improver' || t.slug === 'formula-helper');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const exampleChips = [
    'Sprint planning 10/16: Sarah reported auth bug is fixed. Mike will deploy migration on Friday 8 PM. Agreed to push billing revamp to Q1. Sarah to update JIRA tickets by EOD.',
    'Client call with Acme Corp: Dave and Lisa attended. Client requested custom SSO integration. We agreed on 2-week trial. Dave sending agreement by Thursday. Lisa scheduling kickoff for next Tuesday.',
    'Quarterly marketing sync: Decided to pause Twitter ads and reallocate $4k budget to YouTube sponsorships. Alex to contact creator agency by Oct 20. Priya reviewing landing page copy by tomorrow 3 PM.',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Meeting Notes to Action Items"
      subheading="Turn messy transcripts and scattered meeting notes into an executive summary, clear key decisions, and assigned action items with owners and deadlines."
      inputLabel="Paste your meeting notes or raw transcript"
      inputPlaceholder="e.g. 10/16 sync: Discussed timeline for v2 launch. Alex mentioned frontend is 90% ready. Taylor needs API keys by Wednesday..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Extract Action Items & Summary"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/meeting-notes"
      requestPayload={(notes) => ({
        notes,
      })}
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const summary: string = rawData?.summary || '';
        const decisions: string[] = rawData?.decisions || [];
        const actionItems: Array<{ task: string; owner: string; priority: string }> = rawData?.actionItems || [];

        const copyActionsOnly = async () => {
          try {
            const formattedActions = actionItems
              .map((item, idx) => `${idx + 1}. [${item.priority}] ${item.owner}: ${item.task}`)
              .join('\n');
            await navigator.clipboard.writeText(formattedActions);
            setCopiedActionsOnly(true);
            setTimeout(() => setCopiedActionsOnly(false), 2000);
          } catch {
            // Handled
          }
        };

        const getPriorityStyle = (priority: string) => {
          const lower = priority.toLowerCase();
          if (lower.includes('high')) {
            return 'bg-[rgba(255,85,85,0.15)] text-[#ff6b6b] border border-[rgba(255,85,85,0.3)]';
          }
          if (lower.includes('medium')) {
            return 'bg-[rgba(255,184,64,0.15)] text-[#ffb840] border border-[rgba(255,184,64,0.3)]';
          }
          return 'bg-[rgba(57,255,136,0.12)] text-[#39ff88] border border-[rgba(57,255,136,0.25)]';
        };

        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#39ff88] font-semibold flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Extracted Action Items &amp; Summary</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {actionItems.length > 0 && (
                  <button
                    type="button"
                    onClick={copyActionsOnly}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.25)] text-xs font-semibold text-[#39ff88] hover:border-[#39ff88] transition-colors focus-laser"
                  >
                    {copiedActionsOnly ? <Check className="w-3.5 h-3.5 text-[#39ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedActionsOnly ? 'Copied Action Items' : 'Copy Action Items Only'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onCopy(result)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#39ff88] transition-colors focus-laser"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#39ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Everything' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            {/* Summary Section */}
            {summary && (
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                  Executive Summary
                </label>
                <p className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-sm text-[#f2f7ff] leading-relaxed">
                  {summary}
                </p>
              </div>
            )}

            {/* Key Decisions */}
            {decisions.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-[rgba(143,163,192,0.12)]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5aa9ff]" />
                  <span>Key Decisions Made</span>
                </span>
                <div className="space-y-2">
                  {decisions.map((decision, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] text-xs text-[#f2f7ff] leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="text-[#5aa9ff] font-bold font-mono">#{idx + 1}</span>
                      <span>{decision}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items List */}
            {actionItems.length > 0 ? (
              <div className="space-y-2.5 pt-2 border-t border-[rgba(143,163,192,0.12)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-[#39ff88]" />
                    <span>Action Items ({actionItems.length})</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {actionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[rgba(57,255,136,0.3)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#101c33] text-[#f2f7ff] border border-[rgba(143,163,192,0.2)] flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#39ff88]" />
                            <span>{item.owner}</span>
                          </span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${getPriorityStyle(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#f2f7ff] leading-snug">
                          {item.task}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#0a1424] text-sm text-[#8fa3c0] whitespace-pre-wrap font-mono">
                {result}
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Meeting Notes to Action Items tool converts unstructured notes, quick bullet points, or transcript excerpts into an organized summary, a clear list of decisions, and prioritized tasks assigned to specific people.
          </p>
          <p>
            Instead of spending fifteen minutes re-reading messy meeting notes after a call, simply paste them here. The tool identifies who committed to which task, highlights agreed deadlines, and separates what was decided from what needs to be done next. You can copy the entire summary or just the task list with a single click.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Paste your raw notes or transcript',
          text: 'Paste whatever was typed during the meeting, whether it is bullet points, rough shorthand, or a chat log.',
        },
        {
          step: 'Review decisions and tasks',
          text: 'The tool extracts a 2-sentence executive summary, key team decisions, and tasks tagged with owners.',
        },
        {
          step: 'Copy straight into Slack or JIRA',
          text: 'Tap Copy Action Items Only to paste straight into your team chat, project manager, or follow-up email.',
        },
      ]}
      workedExample={{
        title: 'Example: Product Engineering Standup',
        scenario: 'Pasted notes: "Discussed mobile checkout crash. Liam verified bug is in iOS payment sheet. Liam will ship patch by 4 PM. Rachel to notify enterprise customers once deployed. Agreed to hold off on Android release until Friday."',
        output: `### Executive Summary
The team met to address a critical mobile checkout crash identified on iOS. Immediate remediation steps were assigned to prevent customer impact, while the Android release was postponed to maintain stability.

### Key Decisions
1. Decided to postpone the upcoming Android release until Friday to allow comprehensive patch testing.
2. Agreed that enterprise customers will receive direct notification immediately following the patch deployment.

### Action Items
- [High] Liam: Ship emergency patch for iOS payment sheet bug by 4 PM today.
- [Medium] Rachel: Send follow-up notification to all affected enterprise accounts once patch is live.
- [Low] Engineering Team: Conduct post-mortem review during Friday standup.`,
      }}
      tips={[
        'Mention people by name: Writing "Sarah to handle" or "Dave will" allows the tool to reliably assign individual ownership.',
        'Include target deadlines: Mentioning "by Friday 5 PM" or "before tomorrow\'s call" enables the tool to set accurate High/Medium/Low priority tags.',
        'Include decisions explicitly: Writing "Agreed to" or "Decided that" helps distinguish actual team agreements from exploratory discussions.',
        'Paste automated meeting transcripts: The tool handles auto-generated captions from Zoom, Google Meet, or Microsoft Teams with ease.',
      ]}
      faq={[
        {
          question: 'What if someone in the meeting is not assigned a specific task?',
          answer: 'If an action item has no clear person named, the tool tags the owner as "Unassigned" so your team can assign it during follow-up.',
        },
        {
          question: 'Can I paste transcripts from Zoom or Google Meet?',
          answer: 'Yes. You can paste raw text transcripts directly into the box. The tool filters out conversational filler and extracts only key takeaways and tasks.',
        },
        {
          question: 'How are priority levels (High, Medium, Low) determined?',
          answer: 'Tasks with same-day deadlines or blocking dependencies are marked High, near-term weekly tasks are marked Medium, and general follow-ups are marked Low.',
        },
        {
          question: 'Are my confidential company meeting notes safe?',
          answer: 'Yes. All text is processed transiently in memory without being recorded to a database or used to train public language models.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
