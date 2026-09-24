import React, { useState } from 'react';
import { PageId } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 print:py-0 print:space-y-6 print:max-w-none">
      {/* Navigation Breadcrumb & Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => onNavigate('library')}
          className="flex items-center gap-2 text-xs text-[#888888] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workflow Library</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-panel hover:bg-white/[0.12] text-xs font-medium text-white transition-colors cursor-pointer border border-white/15"
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
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4 print:p-4 print:space-y-2 print:border-gray-300">
        <div className="flex flex-wrap items-center gap-2 text-xs print:text-[9pt]">
          <span className="font-mono font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase print:bg-gray-100 print:text-gray-900 print:border-gray-300">
            {workflow.category}
          </span>
          <span className="text-[#666666] print:text-gray-400">•</span>
          <span className="text-emerald-400 font-medium print:text-gray-800">
            {workflow.isBuiltInOnly ? '100% Native Apple Tools' : 'Hybrid Tools'}
          </span>
          <span className="text-[#666666] print:text-gray-400">•</span>
          <span className="text-[#888888] flex items-center gap-1 print:text-gray-700">
            <Clock className="w-3.5 h-3.5 no-print" /> {workflow.setupTimeMinutes} min setup
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight print:text-gray-950 print:text-xl print:font-bold">
          {workflow.title}
        </h1>

        <p className="text-sm text-[#A1A1A6] leading-relaxed print:text-gray-800 print:text-[10pt] font-normal">
          {workflow.summary}
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs text-[#86868B] print:text-gray-600 print:pt-0 print:text-[9pt]">
          <Calendar className="w-3.5 h-3.5 no-print" />
          <span>Last technical review: <strong>{workflow.lastReviewedDate}</strong> by SmartToolHub Team</span>
        </div>
      </div>

      {/* Required Hardware & Devices Matrix */}
      <div className="glass-card p-6 rounded-2xl border border-white/15 space-y-4">
        <h2 className="text-xs font-medium text-[#86868B] uppercase tracking-wider flex items-center gap-2">
          <Laptop className="w-4 h-4 text-blue-400 stroke-[2]" />
          <span>Required Hardware & Minimum Operating Systems</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {workflow.devicesRequired.map((dev, idx) => (
            <div key={idx} className="p-3.5 rounded-xl glass-panel text-xs space-y-1">
              <div className="font-semibold text-white">{dev.device}</div>
              <div className="text-blue-400 font-mono text-[11px] font-medium">{dev.minOS}</div>
              {dev.hardwareNotes && (
                <div className="text-[#888888] text-[11px] font-normal">{dev.hardwareNotes}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Required Settings & Connectivity */}
      <div className="glass-card p-6 rounded-2xl border border-white/15 space-y-4">
        <h2 className="text-xs font-medium text-[#86868B] uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400 stroke-[2]" />
          <span>Prerequisite System Settings & Accounts</span>
        </h2>
        <div className="space-y-2">
          {workflow.requiredSettings.map((setting, sidx) => (
            <div key={sidx} className="flex items-start gap-2.5 p-3 rounded-xl glass-panel text-xs text-[#CCCCCC] font-normal">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>{setting}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Instructions with Completion Checklist */}
      <div className="space-y-4 print:space-y-2">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 print:border-gray-300">
          <h2 className="text-xs font-medium text-[#86868B] uppercase tracking-wider print:text-gray-900 print:text-xs print:font-bold">
            Step-by-Step Execution Guide
          </h2>
          <span className="text-xs text-[#86868B] print:text-gray-600 print:font-mono print:text-[9pt] font-normal">
            {Object.values(completedSteps).filter(Boolean).length} of {workflow.steps.length} steps completed
          </span>
        </div>

        <div className="space-y-4 print:space-y-2.5">
          {workflow.steps.map((step) => {
            const isCompleted = completedSteps[step.stepNumber] || false;
            return (
              <div
                key={step.stepNumber}
                className={`glass-card step-card p-5 sm:p-6 rounded-2xl border transition-all print:p-3 print:mb-2 print:border-gray-300 print:rounded-lg ${
                  isCompleted
                    ? 'border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'border-white/15'
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
        <div className="glass-card p-6 rounded-2xl border border-white/15 space-y-4 print:p-4 print:border-gray-300 print:space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 print:text-gray-900 print:font-bold">
            <AlertCircle className="w-4 h-4 text-amber-400 no-print stroke-[2.5]" />
            <span>Common Pitfalls & Troubleshooting Solutions</span>
          </h2>
          <div className="space-y-3 print:space-y-1.5">
            {workflow.commonProblems.map((prob, pidx) => (
              <div key={pidx} className="p-4 rounded-xl glass-panel border-amber-500/30 text-xs space-y-1.5 print:p-2.5 print:border-gray-300 print:bg-gray-50 print:text-gray-900">
                <div className="font-bold text-amber-300 print:text-amber-900">Symptom: {prob.issue}</div>
                <div className="text-[#CCCCCC] leading-relaxed print:text-gray-700">Fix: {prob.solution}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Guardrails & Security Notes */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)] space-y-3 print:p-4 print:border-gray-300 print:shadow-none">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400 print:text-emerald-900 print:font-bold">
          <ShieldCheck className="w-4 h-4 no-print stroke-[2.5]" />
          <span>Security & Data Privacy Standards</span>
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-[#A3A3A3] leading-relaxed print:text-gray-800 print:space-y-1 print:text-[9pt]">
          {workflow.privacyNotes.map((pn, pidx) => (
            <li key={pidx}>{pn}</li>
          ))}
        </ul>
      </div>

      {/* Alternative Workflow Card */}
      {workflow.alternativeWorkflow && (
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2 text-xs print:p-4 print:border-gray-300">
          <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider print:text-gray-500">Alternative Blueprint</span>
          <h3 className="text-sm font-bold text-white print:text-gray-900">{workflow.alternativeWorkflow.title}</h3>
          <p className="text-[#A3A3A3] print:text-gray-700">{workflow.alternativeWorkflow.description}</p>
          <div className="pt-2 text-purple-300 font-medium print:text-purple-900">
            ⚖️ Trade-off: {workflow.alternativeWorkflow.tradeOff}
          </div>
        </div>
      )}

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
            <div
              key={rel.id}
              onClick={() => onNavigate('workflow-detail', rel.id)}
              className="glass-card p-4 rounded-xl border border-white/10 hover:border-blue-500/40 cursor-pointer space-y-2 group"
            >
              <span className="text-[10px] text-blue-400 font-semibold uppercase">{rel.category}</span>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                {rel.title}
              </h4>
              <p className="text-xs text-[#888888] line-clamp-2">{rel.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
