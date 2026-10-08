import React, { useState } from 'react';
import { PageId } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { ScrollProgressBar } from '../components/ScrollProgressBar';
import { WorkflowFAQSection } from '../components/WorkflowFAQSection';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getGlassTheme } from '../utils/glassTheme';
import { haptics } from '../utils/haptics';
import { 
  ArrowLeft, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink, 
  Printer, 
  Share2, 
  Check, 
  Copy,
  Laptop,
  Settings,
  Calendar,
  Layers,
  Sparkles,
  FileDown
} from 'lucide-react';

interface WorkflowDetailPageProps {
  workflowId: string;
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const WorkflowDetailPage: React.FC<WorkflowDetailPageProps> = ({ workflowId, onNavigate }) => {
  const workflow = WORKFLOWS_DATA.find((w) => w.id === workflowId || w.slug === workflowId) || WORKFLOWS_DATA[0];
  const theme = getGlassTheme(workflow.category);
  
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  const relatedWorkflows = WORKFLOWS_DATA.filter((w) => w.id !== workflow.id).slice(0, 2);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 print:py-0 print:space-y-6 print:max-w-none">
      <ScrollProgressBar
        label={workflow.title}
        sublabel={`${completedCount}/${workflow.steps.length} steps`}
        contentKey={workflow.id}
      />
      {/* Navigation Breadcrumb & Action Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-slate-900/10 dark:border-white/10 pb-4">
        <Breadcrumbs
          currentPage="workflow-detail"
          workflowId={workflow.id}
          onNavigate={onNavigate}
        />

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-panel hover:bg-white/[0.12] text-xs font-medium text-slate-800 dark:text-white transition-colors cursor-pointer border border-slate-200 dark:border-white/15"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" /> : <Share2 className="w-3.5 h-3.5 stroke-[2]" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
          <button
            id="download-as-pdf-btn"
            onClick={() => {
              haptics.playTap();
              window.print();
            }}
            title="Download complete workflow as clean PDF instruction sheet"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium transition-all cursor-pointer shadow-[0_2px_12px_rgba(0,113,227,0.35)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.5)] group border border-blue-400/40"
          >
            <FileDown className="w-4 h-4 text-white stroke-[2] group-hover:scale-110 transition-transform" />
            <span className="font-medium tracking-tight">Download as PDF</span>
          </button>
        </div>
      </div>

      {/* Print-Only Header Banner */}
      <div className="hidden print:block print-header border-b-2 border-gray-900 pb-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-gray-600 font-medium">
              SmartToolHub • Apple Multi-Device Instruction Sheet
            </div>
            <div className="text-lg font-bold text-gray-950 tracking-tight">
              {workflow.title}
            </div>
          </div>
          <div className="text-right text-[9pt] font-mono text-gray-500">
            <div>Category: {workflow.category}</div>
            <div>Estimated Setup: {workflow.setupTimeMinutes} mins</div>
            <div>Doc Ref: {workflow.id}</div>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="bento-card p-6 sm:p-8 rounded-2xl space-y-4 print:p-4 print:space-y-2 print:border-gray-300 shadow-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs print:text-[9pt]">
          <span className="font-mono font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20 uppercase print:bg-gray-100 print:text-gray-900 print:border-gray-300">
            {workflow.category}
          </span>
          <span className="text-slate-400 dark:text-zinc-600 print:text-gray-400">•</span>
          <span className="text-emerald-500 dark:text-emerald-400 font-semibold print:text-gray-800">
            {workflow.isBuiltInOnly ? '100% Native Apple Tools' : 'Hybrid Tools'}
          </span>
          <span className="text-slate-400 dark:text-zinc-600 print:text-gray-400">•</span>
          <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1 print:text-gray-700">
            <Clock className="w-3.5 h-3.5 no-print" /> {workflow.setupTimeMinutes} min setup
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight print:text-gray-950 print:text-xl print:font-bold">
          {workflow.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed print:text-gray-800 print:text-[10pt] font-normal">
          {workflow.summary}
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 print:text-gray-600 print:pt-0 print:text-[9pt]">
          <Calendar className="w-3.5 h-3.5 no-print" />
          <span>Last technical review: <strong className="text-slate-700 dark:text-zinc-200">{workflow.lastReviewedDate}</strong> by SmartToolHub Systems Lab</span>
        </div>
      </div>

      {/* Required Hardware & Devices Matrix */}
      <div className="bento-card p-6 sm:p-7 rounded-2xl space-y-4 shadow-lg border border-white/10">
        <h2 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <Laptop className="w-4 h-4 text-indigo-500 stroke-[2]" />
          <span>Required Hardware & Minimum Operating Systems</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {workflow.devicesRequired.map((dev, idx) => (
            <div key={idx} className="p-4 rounded-xl glass-panel text-xs space-y-1.5 border border-slate-200 dark:border-white/10">
              <div className="font-bold text-slate-900 dark:text-white">{dev.device}</div>
              <div className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-semibold">{dev.minOS}</div>
              {dev.hardwareNotes && (
                <div className="text-slate-500 dark:text-zinc-400 text-[11px] font-normal">{dev.hardwareNotes}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Required Settings & Connectivity */}
      <div className="bento-card p-6 sm:p-7 rounded-2xl space-y-4 shadow-lg border border-white/10">
        <h2 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-500 stroke-[2]" />
          <span>Prerequisite System Settings & Accounts</span>
        </h2>
        <div className="space-y-2.5">
          {workflow.requiredSettings.map((setting, sidx) => (
            <div key={sidx} className="flex items-start gap-3 p-3.5 rounded-xl glass-panel text-xs text-slate-700 dark:text-zinc-200 font-normal border border-slate-200 dark:border-white/10">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>{setting}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Instructions with Completion Checklist */}
      <div className="space-y-4 print:space-y-2">
        <div className="flex items-center justify-between border-b border-slate-900/10 dark:border-white/[0.08] pb-2 print:border-gray-300">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider print:text-gray-900 print:text-xs print:font-bold">
            Step-by-Step Execution Guide
          </h2>
          <span className="text-xs text-slate-500 dark:text-zinc-400 print:text-gray-600 print:font-mono print:text-[9pt] font-normal">
            {Object.values(completedSteps).filter(Boolean).length} of {workflow.steps.length} steps completed
          </span>
        </div>

        <div className="space-y-4 print:space-y-2.5">
          {workflow.steps.map((step) => {
            const isCompleted = completedSteps[step.stepNumber] || false;
            return (
              <div
                key={step.stepNumber}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 print:p-3 print:mb-2 print:border-gray-300 print:rounded-lg ${
                  isCompleted
                    ? 'bento-card border-emerald-500/40 shadow-sm'
                    : 'bento-card hover:border-indigo-400/40 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3 print:mb-1">
                  <div className="flex items-center gap-3 print:gap-2">
                    {/* Screen Interactive Checkbox Button */}
                    <button
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`no-print w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-400 text-black shadow-sm font-bold'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-400/30 hover:bg-blue-500/30'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : step.stepNumber}
                    </button>
                    {/* Print-Only Physical Checkbox Square */}
                    <div className="hidden print:inline-flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border border-gray-800 inline-block align-middle shrink-0" />
                      <span className="font-semibold text-xs font-mono text-gray-900">Step {step.stepNumber}:</span>
                    </div>
                    <h3 className={`text-base font-semibold text-white print:text-gray-950 print:text-xs print:font-bold ${isCompleted ? 'line-through text-[#888888] print:no-underline' : ''}`}>
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#A1A1A6] leading-relaxed pl-10 print:pl-5 print:text-gray-800 print:text-[9.5pt] font-normal">
                  {step.instruction}
                </p>

                {/* Keyboard Shortcuts */}
                {step.shortcuts && step.shortcuts.length > 0 && (
                  <div className="pl-10 print:pl-5 pt-3 print:pt-1.5 flex flex-wrap gap-2">
                    {step.shortcuts.map((sc, sidx) => (
                      <div key={sidx} className="inline-flex items-center gap-2 text-xs glass-panel px-3 py-1.5 rounded-lg print:bg-gray-100 print:border-gray-300 print:text-gray-900 print:py-0.5 print:px-2">
                        {sc.mac && <kbd className="apple-key text-xs print:text-[8pt]">{sc.mac}</kbd>}
                        {sc.ios && <kbd className="apple-key text-xs print:text-[8pt]">{sc.ios}</kbd>}
                        <span className="text-[#888888] print:text-gray-700">{sc.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tip Callout */}
                {step.callout && (
                  <div className="ml-10 print:ml-5 mt-3 print:mt-1.5 p-3 print:p-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-200 backdrop-blur-md print:bg-blue-50 print:border-blue-200 print:text-blue-950 print:text-[9pt]">
                    💡 <strong>Pro Tip:</strong> {step.callout}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Problems & Resolution */}
      {workflow.commonProblems && workflow.commonProblems.length > 0 && (
        <div className="glass-amber p-6 sm:p-7 rounded-3xl space-y-4 shadow-lg print:p-4 print:border-gray-300 print:space-y-2">
          <h2 className="text-xs font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2 print:text-gray-900 print:font-bold">
            <AlertCircle className="w-4 h-4 text-amber-500 no-print stroke-[2.5]" />
            <span>Common Pitfalls & Troubleshooting Solutions</span>
          </h2>
          <div className="space-y-3 print:space-y-1.5">
            {workflow.commonProblems.map((prob, pidx) => (
              <div key={pidx} className="p-4 rounded-2xl glass-panel border border-amber-500/25 text-xs space-y-1.5 print:p-2.5 print:border-gray-300 print:bg-gray-50 print:text-gray-900">
                <div className="font-bold text-amber-600 dark:text-amber-300 print:text-amber-900">Symptom: {prob.issue}</div>
                <div className="text-slate-600 dark:text-zinc-300 leading-relaxed print:text-gray-700">Fix: {prob.solution}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Guardrails & Security Notes */}
      <div className="glass-emerald p-6 sm:p-7 rounded-3xl space-y-3 shadow-lg print:p-4 print:border-gray-300 print:shadow-none">
        <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-emerald-600 dark:text-emerald-400 print:text-emerald-900 print:font-bold">
          <ShieldCheck className="w-4 h-4 no-print stroke-[2.5]" />
          <span>Security & Data Privacy Standards</span>
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed print:text-gray-800 print:space-y-1 print:text-[9pt]">
          {workflow.privacyNotes.map((pn, pidx) => (
            <li key={pidx}>{pn}</li>
          ))}
        </ul>
      </div>

      {/* Alternative Workflow Card */}
      {workflow.alternativeWorkflow && (
        <div className="glass-violet p-6 sm:p-7 rounded-3xl space-y-2 text-xs shadow-lg print:p-4 print:border-gray-300">
          <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 uppercase tracking-wider font-semibold print:text-gray-500">Alternative Blueprint</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white print:text-gray-900">{workflow.alternativeWorkflow.title}</h3>
          <p className="text-slate-600 dark:text-zinc-300 print:text-gray-700">{workflow.alternativeWorkflow.description}</p>
          <div className="pt-2 text-violet-600 dark:text-violet-300 font-medium print:text-purple-900">
            ⚖️ Trade-off: {workflow.alternativeWorkflow.tradeOff}
          </div>
        </div>
      )}

      {/* Dynamic Schema.org FAQSection with Structured Data Injection */}
      <WorkflowFAQSection workflow={workflow} />

      {/* Official Apple Support Links */}
      <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs print:p-3 print:border-gray-300">
        <span className="text-[#888888] print:text-gray-700 font-medium">Citations & Verification:</span>
        <div className="flex flex-wrap gap-3">
          {workflow.officialDocLinks.map((doc, didx) => (
            <a
              key={didx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors print:text-blue-800"
            >
              <span>{doc.title}</span>
              <ExternalLink className="w-3.5 h-3.5 no-print" />
            </a>
          ))}
        </div>
      </div>

      {/* Print-Only Document Reference Footer */}
      <div className="hidden print:flex border-t border-gray-300 pt-3 mt-6 items-center justify-between text-[8pt] text-gray-500 font-mono">
        <div>SmartToolHub • Apple Multi-Device Power User Guide</div>
        <div>Verified Reference • Doc Ref #{workflow.id}</div>
      </div>

      {/* Related Workflows (Hidden in Print) */}
      <div className="space-y-4 pt-4 no-print">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Related Ecosystem Workflows
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedWorkflows.map((rel) => (
            <a
              key={rel.id}
              href={`/workflows/${rel.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('workflow-detail', rel.id);
              }}
              className="glass-card p-4 rounded-xl border border-white/10 hover:border-blue-500/40 cursor-pointer space-y-2 group block text-left text-decoration-none"
            >
              <span className="text-[10px] text-blue-400 font-semibold uppercase">{rel.category}</span>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                {rel.title}
              </h4>
              <p className="text-xs text-[#888888] line-clamp-2">{rel.summary}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
