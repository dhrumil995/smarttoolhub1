import React, { useState } from 'react';
import { Mail, Minimize2, Copy, Check } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface EmailWriterPageProps {
  navigate: (path: string) => void;
}

export const EmailWriterPage: React.FC<EmailWriterPageProps> = ({ navigate }) => {
  const [tone, setTone] = useState<'friendly' | 'formal' | 'short' | 'firm'>('friendly');
  const [keyPoints, setKeyPoints] = useState('');
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'ai-email-writer') || LAUNCH_TOOLS[1];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'ai-summarizer' || t.slug === 'rewrite-tone-changer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  const toneOptions: Array<{ id: 'friendly' | 'formal' | 'short' | 'firm'; label: string }> = [
    { id: 'friendly', label: 'Friendly' },
    { id: 'formal', label: 'Formal' },
    { id: 'short', label: 'Short' },
    { id: 'firm', label: 'Firm' },
  ];

  const exampleChips = [
    'Ask manager for 2 days off next month (Nov 14-15) for a family event. All project tasks are ahead of schedule.',
    'Follow up with client on overdue Invoice #1042 due 5 days ago. Request payment status or if they need the link resent.',
    'Politely decline an invitation to join an industry webinar panel next week due to tight quarterly deadlines.',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AI Email Writer"
      subheading="Write ready-to-send emails in seconds. Pick your tone, add your main points, and get a clear subject line plus an email body ready to paste."
      inputLabel="What is this email about? (Purpose)"
      inputPlaceholder="e.g. Ask client for feedback on the updated website mockups sent last Tuesday..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Write Ready-to-Send Email"
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/email-writer"
      requestPayload={(purpose) => ({
        purpose,
        tone,
        keyPoints,
      })}
      onRefineRequest={async (action, _currentResult, rawData, setRawData, setResult) => {
        if (action === 'make-shorter') {
          const res = await fetch('/api/email-writer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              purpose: '',
              tone,
              currentBody: rawData?.body || _currentResult,
              makeShorter: true,
            }),
          });
          const data = await res.json();
          if (!res.ok || data.error) {
            throw new Error(data.error || 'Could not shorten email.');
          }
          const updatedResult = `Subject: ${data.subject}\n\n${data.body}`;
          setRawData(data);
          setResult(updatedResult);
        }
      }}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Key Points Input */}
          <div className="space-y-1.5">
            <label htmlFor="email-key-points" className="text-xs font-mono uppercase tracking-wider text-[#f2f7ff] font-semibold">
              Key Points or Details (Optional)
            </label>
            <input
              id="email-key-points"
              type="text"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="e.g. Deadline is Friday 5 PM, attach PDF report, link is in calendar invite"
              className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl px-3.5 py-2.5 text-sm text-[#f2f7ff] placeholder-[#8fa3c0] focus-ring"
            />
          </div>

          {/* Tone Selector: friendly, formal, short, firm */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Select Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {toneOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTone(item.id)}
                  className={`py-2 px-3 text-xs rounded-xl font-medium transition-colors border text-center focus-ring ${
                    tone === item.id
                      ? 'bg-[#0a84ff] text-[#050a14] border-[#0a84ff] font-bold shadow-[0_0_12px_rgba(10, 132, 255,0.3)]'
                      : 'bg-[#0a1424] text-[#8fa3c0] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, onShare, copied, shared, isRefining, onRefine }) => {
        const subject = rawData?.subject || (result.split('\n\n')[0]?.replace(/^Subject:\s*/i, '') || '');
        const body = rawData?.body || result.split('\n\n').slice(1).join('\n\n') || result;

        const copySpecific = async (text: string, type: 'subject' | 'body') => {
          try {
            await navigator.clipboard.writeText(text);
            if (type === 'subject') {
              setCopiedSubject(true);
              setTimeout(() => setCopiedSubject(false), 2000);
            } else {
              setCopiedBody(true);
              setTimeout(() => setCopiedBody(false), 2000);
            }
          } catch {
            // Handled
          }
        };

        return (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0a84ff] font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Generated Email</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {/* Make it shorter button */}
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefine?.('make-shorter')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.25)] text-xs font-semibold text-[#0a84ff] hover:border-[#0a84ff] transition-colors focus-ring disabled:opacity-50"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>{isRefining ? 'Shortening...' : 'Make it shorter'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onCopy(result)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#0a84ff] transition-colors focus-ring"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied All' : 'Copy All'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onShare(result)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs text-[#8fa3c0] hover:text-[#f2f7ff] transition-colors focus-ring"
                >
                  <span className="text-xs">{shared ? 'Shared' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Subject Line Card */}
            {subject && (
              <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#8fa3c0]">Subject Line</div>
                  <div className="text-sm font-semibold text-[#f2f7ff] truncate">{subject}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copySpecific(subject, 'subject')}
                  className="px-2.5 py-1 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs text-[#8fa3c0] hover:text-[#0a84ff] hover:border-[#0a84ff] transition-colors shrink-0 focus-ring flex items-center gap-1"
                >
                  {copiedSubject ? <Check className="w-3 h-3 text-[#34e0a1]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSubject ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}

            {/* Email Body Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8fa3c0]">Email Body</div>
                <button
                  type="button"
                  onClick={() => copySpecific(body, 'body')}
                  className="px-2.5 py-1 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs text-[#8fa3c0] hover:text-[#0a84ff] hover:border-[#0a84ff] transition-colors shrink-0 focus-ring flex items-center gap-1"
                >
                  {copiedBody ? <Check className="w-3 h-3 text-[#34e0a1]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBody ? 'Copied' : 'Copy Body'}</span>
                </button>
              </div>
              <div className="text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap selection:bg-[#0a84ff] selection:text-[#050a14]">
                {body}
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <>
          <p>
            The AI Email Writer helps you draft clear, polite, and effective emails without spending 20 minutes staring at a blank screen. You provide your goal, pick your preferred tone, and list a few bullet points. In seconds, the tool writes an engaging subject line and a structured email body ready to send.
          </p>
          <p>
            Good emails are easy to read and quick to answer. This tool uses short paragraphs, natural words, and direct questions so your recipient understands exactly what you need. If the draft feels a bit too long, tap the &quot;Make it shorter&quot; button to trim filler words while keeping every important fact.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Share your purpose and key points',
          text: 'Type a sentence describing who you are emailing and what you want to accomplish. Add any dates, names, or requirements.',
        },
        {
          step: 'Pick the right tone',
          text: 'Choose Friendly for teammates, Formal for executives, Short for fast updates, or Firm for overdue tasks and boundaries.',
        },
        {
          step: 'Review and paste into your mail app',
          text: 'Copy the subject line and body directly into Gmail, Apple Mail, or Outlook. Customize the bracketed names before sending.',
        },
      ]}
      workedExample={{
        title: 'Example: Requesting Project Feedback from a Client',
        scenario: 'Website mockup revision sent yesterday. Need their approval on colors and typography by Thursday.',
        output: `Subject: Updated website mockups ready for your review (feedback by Thursday)

Hi Sarah,

I hope you are having a wonderful week.

Our team has completed the updated homepage mockups based on your notes from Monday. You can review the new design files directly in Figma at the link below.

Could you please take a look and let us know your thoughts by Thursday at 4 PM? Specifically, we want to confirm you are happy with the header colors and font sizes.

Link to mockups: [Insert Link Here]

Thanks so much,
Alex`,
      }}
      tips={[
        'Keep the subject line under 9 words so it displays fully on iPhone and Android notification banners.',
        'Use the Firm tone when you need to address late invoices or missed deadlines without sounding rude.',
        'Always double-check bracketed placeholders like [Name] and [Date] before tapping send.',
        'Tap &quot;Make it shorter&quot; whenever you are sending an update to busy managers who read on phones.',
      ]}
      faq={[
        {
          question: 'What does the &quot;Make it shorter&quot; button do?',
          answer: 'It condenses your generated email down to under 70 words by removing pleasantries and wordy clauses while keeping the subject line, main request, and call to action intact.',
        },
        {
          question: 'Are my email drafts saved on your servers?',
          answer: 'No. Your inputs and generated emails are processed securely in real time and are never stored on our database or shared with third parties.',
        },
        {
          question: 'Can I write emails in languages other than English?',
          answer: 'Yes. Enter your purpose and bullet points in Spanish, French, German, Japanese, or any language you prefer, and the tool will draft the email in that language.',
        },
        {
          question: 'How do the four tones differ from one another?',
          answer: 'Friendly is warm and approachable. Formal is polite and executive. Short cuts straight to the facts. Firm is confident and direct when holding boundaries or chasing deliverables.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
