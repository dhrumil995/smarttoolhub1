import React, { useState } from 'react';
import { PageId, AIDiagnosticResult } from '../types';
import { TROUBLESHOOTING_DATA } from '../data/troubleshooting';
import { usePro } from '../context/ProContext';
import { 
  Wrench, 
  Search, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink, 
  ShieldAlert,
  ChevronDown,
  Calendar,
  Sparkles,
  Zap,
  RefreshCw,
  Cpu,
  ShieldCheck
} from 'lucide-react';

interface TroubleshootingPageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const TroubleshootingPage: React.FC<TroubleshootingPageProps> = ({ onNavigate }) => {
  const { isPro, activatePro, togglePro } = usePro();
  const [activeTab, setActiveTab] = useState<'curated' | 'ai-diagnose'>('curated');
  const [activeIssueId, setActiveIssueId] = useState<string>(TROUBLESHOOTING_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || '';
    }
    return '';
  });
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [resolvedSteps, setResolvedSteps] = useState<Record<string, boolean>>({});

  // AI Diagnostic State (Pro Feature)
  const [customSymptom, setCustomSymptom] = useState('');
  const [customDeviceDetails, setCustomDeviceDetails] = useState('macOS 15 Sequoia / iOS 18');
  const [aiDiagnosing, setAiDiagnosing] = useState(false);
  const [aiDiagnosticResult, setAiDiagnosticResult] = useState<AIDiagnosticResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const filteredIssues = TROUBLESHOOTING_DATA.filter((issue) => {
    const q = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(q) ||
      issue.feature.toLowerCase().includes(q) ||
      issue.symptoms.some((s) => s.toLowerCase().includes(q))
    );
  });

  const activeIssue = (filteredIssues.length > 0 && filteredIssues.find((i) => i.id === activeIssueId))
    ? (filteredIssues.find((i) => i.id === activeIssueId) || filteredIssues[0])
    : (TROUBLESHOOTING_DATA.find((i) => i.id === activeIssueId) || TROUBLESHOOTING_DATA[0]);

  const handleCopy = async (command: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
        setCopiedCommand(command);
        setTimeout(() => setCopiedCommand(null), 2000);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = command;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedCommand(command);
        setTimeout(() => setCopiedCommand(null), 2000);
      }
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = command;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedCommand(command);
        setTimeout(() => setCopiedCommand(null), 2000);
      } catch {}
    }
  };

  const toggleStepResolved = (key: string) => {
    setResolvedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRunAiDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSymptom.trim()) {
      setAiError('Please enter the symptom or error you are experiencing.');
      return;
    }

    if (!isPro) {
      setAiError('AI Deep Diagnosis is an exclusive SmartToolHub Pro feature.');
      return;
    }

    setAiDiagnosing(true);
    setAiError(null);
    setAiDiagnosticResult(null);

    try {
      const response = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueTitle: 'Custom User Incident',
          symptoms: [customSymptom],
          deviceDetails: customDeviceDetails,
          isPro,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete AI diagnosis');
      }

      if (data.diagnosis) {
        setAiDiagnosticResult(data.diagnosis);
      } else {
        throw new Error('No diagnostic data returned.');
      }
    } catch (err: any) {
      setAiError(err.message || 'An error occurred during diagnosis.');
    } finally {
      setAiDiagnosing(false);
    }
  };

  const loadActiveIssueIntoAi = () => {
    setCustomSymptom(`${activeIssue.title}: ${activeIssue.symptoms.join(', ')}`);
    setActiveTab('ai-diagnose');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header — Apple Style */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-normal text-[#2997FF] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <Wrench className="w-3.5 h-3.5" />
          <span>Ecosystem Diagnostics & Isolation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-tight">
          Apple Troubleshooting Wizard
        </h1>
        <p className="text-sm sm:text-base text-[#86868B] leading-relaxed font-normal">
          Interactive step-by-step resolution trees for Continuity disconnects, AirDrop dropouts, Universal Clipboard latency, and live Gemini AI root-cause diagnosis.
        </p>

        {/* Diagnostic Mode Tabs */}
        <div className="pt-3 flex justify-center">
          <div className="inline-flex items-center p-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('curated')}
              className={`px-5 py-2 rounded-full font-normal transition-all duration-200 cursor-pointer ${
                activeTab === 'curated'
                  ? 'bg-[#0071E3] text-white shadow-md'
                  : 'text-[#86868B] hover:text-white'
              }`}
            >
              Curated Diagnostic Trees (Free)
            </button>
            <button
              onClick={() => setActiveTab('ai-diagnose')}
              className={`px-5 py-2 rounded-full font-normal transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ai-diagnose'
                  ? 'bg-[#0071E3] text-white shadow-md'
                  : 'text-[#F5F5F7] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2997FF]" />
              <span>AI Deep Diagnosis (Pro)</span>
              {!isPro && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-1">
                  PRO
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: AI Deep Diagnostic Assistant (Pro Feature) */}
      {activeTab === 'ai-diagnose' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {!isPro ? (
            <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Gemini AI Deep Diagnosis is a SmartToolHub Pro Feature</span>
                  </div>
                  <p className="text-xs text-[#CCCCCC] leading-relaxed max-w-xl">
                    Free tier members have access to the verified Curated Resolution Trees below. SmartToolHub Pro unlocks live Gemini 3.8 Flash analysis to diagnose rare bluetooth daemon drops, Bonjour mDNS packet collisions, and multi-OS synchronization failures using your API.
                  </p>
                </div>
                <button
                  onClick={activatePro}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>Activate Pro (Test AI)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl glass-panel border border-blue-400/30 bg-blue-500/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-300 font-medium">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>SmartToolHub Pro Active • Gemini 3.8 Flash Diagnostic Engineer ready</span>
              </div>
              <button
                onClick={togglePro}
                className="text-[11px] text-[#888888] hover:text-white underline cursor-pointer"
              >
                Switch to Free Tier
              </button>
            </div>
          )}

          {/* AI Diagnostic Form */}
          <form onSubmit={handleRunAiDiagnosis} className="glass-card p-6 rounded-2xl border border-white/15 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                Describe Your Apple Ecosystem Failure or Symptoms
              </label>
              <textarea
                rows={3}
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="e.g. iPhone 15 Pro wireless Continuity Camera drops every 3 minutes on Mac Studio running macOS 15.1, or Universal Clipboard refuses to paste screenshots..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-[#666666] focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                  Devices & OS Versions
                </label>
                <input
                  type="text"
                  value={customDeviceDetails}
                  onChange={(e) => setCustomDeviceDetails(e.target.value)}
                  placeholder="e.g. M3 MacBook Pro (macOS 15.1) + iPhone 16 (iOS 18.1)"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={aiDiagnosing}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    aiDiagnosing ? 'bg-blue-600/50 cursor-not-allowed' : 'glass-button-primary'
                  }`}
                >
                  {aiDiagnosing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini Analyzing Subsystem Failure...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isPro ? 'Diagnose Root Cause with Gemini Pro AI' : 'Diagnose (Pro Required)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {aiError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center justify-between">
                <span>{aiError}</span>
                {!isPro && (
                  <button
                    type="button"
                    onClick={activatePro}
                    className="underline text-red-300 font-semibold cursor-pointer"
                  >
                    Unlock Pro Now
                  </button>
                )}
              </div>
            )}
          </form>

          {/* AI Diagnostic Output */}
          {aiDiagnosticResult && (
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-blue-400/40 space-y-6 animate-fade-in shadow-[0_15px_40px_rgba(59,130,246,0.15)]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    Gemini 3.8 Flash Diagnostic Report
                  </span>
                  <span className="text-xs text-[#888888]">Subsystem Analysis</span>
                </div>
              </div>

              {/* Root Cause */}
              <div className="p-4 rounded-xl glass-panel space-y-2 border border-white/[0.06]">
                <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>Technical Root Cause Breakdown</span>
                </span>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  {aiDiagnosticResult.rootCauseAnalysis}
                </p>
              </div>

              {/* Quick Fix */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Recommended Isolation Sequence</span>
                </span>
                <div className="space-y-2">
                  {aiDiagnosticResult.quickFix.map((step, sidx) => (
                    <div key={sidx} className="p-3 rounded-xl glass-panel text-xs flex items-start gap-2.5 border border-white/[0.04]">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {sidx + 1}
                      </span>
                      <span className="text-[#CCCCCC] leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Commands */}
              {aiDiagnosticResult.terminalCommands && aiDiagnosticResult.terminalCommands.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>Targeted Subsystem Terminal Commands</span>
                  </span>
                  <div className="space-y-2">
                    {aiDiagnosticResult.terminalCommands.map((tc, tcidx) => (
                      <div key={tcidx} className="p-3 rounded-xl bg-[#090A0E] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#888888]">{tc.description}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            tc.riskLevel === 'safe' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {tc.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-xs text-emerald-400 bg-black/50 p-2.5 rounded-lg">
                          <code className="overflow-x-auto selection:bg-emerald-800">{tc.command}</code>
                          <button
                            onClick={() => handleCopy(tc.command)}
                            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-white shrink-0 ml-2 cursor-pointer flex items-center gap-1"
                          >
                            {copiedCommand === tc.command ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCommand === tc.command ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preconditions */}
              {aiDiagnosticResult.preconditionChecklist && aiDiagnosticResult.preconditionChecklist.length > 0 && (
                <div className="p-4 rounded-xl bg-[#161616] border border-blue-500/20 space-y-2 text-xs">
                  <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Mandatory Apple Account & Network Preconditions</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#A3A3A3]">
                    {aiDiagnosticResult.preconditionChecklist.map((pre, pidx) => (
                      <li key={pidx}>{pre}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Curated Resolution Trees */}
      {activeTab === 'curated' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Issue Directory & Search */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#888888] absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search errors or symptoms..."
                aria-label="Search errors or symptoms"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-[#86868B] focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredIssues.length === 0 ? (
                <div className="p-6 text-center glass-panel rounded-xl space-y-2">
                  <p className="text-xs text-[#CCCCCC] font-medium">No matching issues found</p>
                  <p className="text-[11px] text-[#86868B]">Try searching for "AirDrop", "Bluetooth", "Sidecar", or "Universal".</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#2997FF] hover:underline cursor-pointer pt-1 block mx-auto"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                filteredIssues.map((issue) => {
                  const isSelected = issue.id === activeIssue.id;
                  return (
                    <button
                      key={issue.id}
                      onClick={() => setActiveIssueId(issue.id)}
                      className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                          : 'glass-panel text-[#888888] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                          {issue.feature}
                        </span>
                        <span className="text-[10px] text-[#86868B] font-mono">
                          {issue.category}
                        </span>
                      </div>
                      <h4 className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#CCCCCC]'}`}>
                        {issue.title}
                      </h4>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Diagnostic Canvas */}
          <div className="lg:col-span-8">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6">
              
              {/* Active Issue Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-400 font-semibold uppercase">
                      {activeIssue.feature}
                    </span>
                    <span className="text-[10px] text-[#888888] font-mono">
                      • {activeIssue.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {activeIssue.title}
                  </h2>
                </div>

                <button
                  onClick={loadActiveIssueIntoAi}
                  className="px-3 py-1.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Run live Gemini deep diagnosis on this symptom"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deep AI Diagnose</span>
                </button>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Observed Symptoms
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeIssue.symptoms.map((sym, sidx) => (
                    <span key={sidx} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                      • {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Fix Steps */}
              {activeIssue.quickFixSteps && activeIssue.quickFixSteps.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Quick Isolation Checklist</span>
                  </span>
                  <div className="space-y-1.5">
                    {activeIssue.quickFixSteps.map((qf, qidx) => (
                      <div key={qidx} className="p-2.5 rounded-lg glass-panel text-xs text-[#CCCCCC] flex items-start gap-2 border border-white/[0.04]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{qf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnostic Steps Tree */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>Deep Subsystem Diagnostics</span>
                </span>

                <div className="space-y-3">
                  {activeIssue.deepDiagnostics.map((diag, didx) => {
                    const stepKey = `${activeIssue.id}-${didx}`;
                    const isResolved = resolvedSteps[stepKey];

                    return (
                      <div key={didx} className="p-4 rounded-xl glass-panel border border-white/[0.06] space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => toggleStepResolved(stepKey)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 cursor-pointer transition-colors ${
                                isResolved ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <div>
                              <div className="text-xs font-semibold text-white">Step {diag.step}: {diag.title}</div>
                              <p className="text-xs text-[#A3A3A3] leading-relaxed pt-1">{diag.details}</p>
                            </div>
                          </div>
                        </div>

                        {diag.command && (
                          <div className="mt-2 p-2.5 rounded-lg bg-[#090A0E] border border-white/10 flex items-center justify-between font-mono text-xs text-emerald-400">
                            <code className="overflow-x-auto">{diag.command}</code>
                            <button
                              onClick={() => handleCopy(diag.command!)}
                              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-white shrink-0 ml-2 cursor-pointer flex items-center gap-1"
                            >
                              {copiedCommand === diag.command ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedCommand === diag.command ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Command Safety Guarantee */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-2.5 text-xs text-blue-300">
                <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>System Safety Guarantee:</strong> All commands reset temporary system daemons (Bluetooth, mDNS) without requiring a full computer reboot or modifying user data.
                </span>
              </div>

              {/* Reference */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#888888]">
                <span>Official Documentation:</span>
                <a
                  href={activeIssue.officialDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <span>Apple Knowledge Base</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
