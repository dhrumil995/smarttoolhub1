import React, { useState } from 'react';
import { PageId, GeneratorFormData, GeneratedWorkflowOutput, AIAutomationScriptResult } from '../types';
import { usePro } from '../context/ProContext';
import { 
  Wand2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Cpu, 
  Settings, 
  ShieldCheck, 
  Copy, 
  Check, 
  Bookmark, 
  Printer, 
  RefreshCw,
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  HelpCircle,
  ArrowRight,
  Zap,
  Terminal,
  Code
} from 'lucide-react';

interface GeneratorPageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ onNavigate }) => {
  const { isPro, activatePro, togglePro } = usePro();
  const [formData, setFormData] = useState<GeneratorFormData>({
    devices: ['Mac (MacBook / Mac mini / Studio)', 'iPhone'],
    osVersions: 'macOS 15 Sequoia / iOS 18',
    task: '',
    currentApps: ['Apple Notes', 'Safari', 'Shortcuts'],
    toolPreference: 'built-in',
    experienceLevel: 'Intermediate',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedWorkflowOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiEngineName, setAiEngineName] = useState<string>('gemini-3.8-flash');

  // Script Generator State (Pro Exclusive)
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptType, setScriptType] = useState<'applescript' | 'zsh' | 'shortcuts-spec'>('applescript');
  const [generatedScript, setGeneratedScript] = useState<AIAutomationScriptResult | null>(null);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  const deviceOptions = [
    { label: 'Mac (MacBook Pro / Air, Mac Studio, iMac)', icon: Laptop },
    { label: 'iPhone (All models)', icon: Smartphone },
    { label: 'iPad (Pro, Air, mini, Standard)', icon: Tablet },
    { label: 'Apple Watch', icon: Watch },
  ];

  const suggestedTasks = [
    'Turn iPhone into an overhead desk camera for live demonstrations',
    'Record and transcribe podcast audio using Mac and iPad',
    'Sync 4K video clips between iPhone and Mac without cables',
    'Create a distraction-free study mode across all devices',
    'Control Mac and iPad with one keyboard using Universal Control',
    'Quickly share two-factor auth codes and links between phone and laptop',
  ];

  const appChoices = [
    'Shortcuts', 'Apple Notes', 'Safari', 'Finder', 'QuickTime Player', 
    'Final Cut Pro', 'DaVinci Resolve', 'Obsidian', 'Notion', 'Photoshop', 'Terminal'
  ];

  const toggleDevice = (dev: string) => {
    setFormData((prev) => ({
      ...prev,
      devices: prev.devices.includes(dev)
        ? prev.devices.filter((d) => d !== dev)
        : [...prev.devices, dev],
    }));
  };

  const toggleApp = (app: string) => {
    setFormData((prev) => ({
      ...prev,
      currentApps: prev.currentApps.includes(app)
        ? prev.currentApps.filter((a) => a !== app)
        : [...prev.currentApps, app],
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.task.trim()) {
      setError('Please specify the task or objective you wish to accomplish.');
      return;
    }
    if (formData.devices.length === 0) {
      setError('Please select at least one Apple device.');
      return;
    }

    if (!isPro) {
      setError('Live Gemini AI Workflow Synthesis is a SmartToolHub Pro feature. Please unlock Pro to generate custom multi-device workflows using your API.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);
    setGeneratedScript(null);

    try {
      const response = await fetch('/api/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isPro,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to synthesize workflow');
      }

      if (data.workflow) {
        setResult(data.workflow);
        if (data.aiEngine) {
          setAiEngineName(data.aiEngine);
        }
      } else {
        throw new Error('No workflow generated.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const safeCopy = async (text: string, onSuccess: () => void) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        onSuccess();
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        onSuccess();
      }
    } catch {
      // Fallback for iframe restrictions
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        onSuccess();
      } catch {}
    }
  };

  const handleGenerateScript = async () => {
    if (!result) return;
    setScriptLoading(true);
    setScriptError(null);
    try {
      const response = await fetch('/api/ai-automation-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowTitle: result.goalSummary,
          goal: formData.task,
          devices: formData.devices,
          scriptType,
          isPro,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate automation script');
      }
      if (data.script) {
        setGeneratedScript(data.script);
      }
    } catch (err: any) {
      setScriptError(err.message || 'Could not generate automation script.');
    } finally {
      setScriptLoading(false);
    }
  };

  const copyScript = () => {
    if (!generatedScript) return;
    safeCopy(generatedScript.code, () => {
      setScriptCopied(true);
      setTimeout(() => setScriptCopied(false), 2000);
    });
  };

  const copyAsMarkdown = () => {
    if (!result) return;
    const text = `# ${result.goalSummary}\n\n` +
      `**Estimated Setup Time:** ${result.estimatedSetupTime} | **Difficulty:** ${result.difficulty}\n\n` +
      `## Required Settings\n${result.requiredSettings.map((s) => `- ${s}`).join('\n')}\n\n` +
      `## Instructions\n${result.steps.map((s) => `### Step ${s.stepNumber}: ${s.title}\n${s.instruction}\n`).join('\n')}\n\n` +
      `## Common Pitfalls\n${result.commonProblems.map((p) => `- **${p.issue}:** ${p.solution}`).join('\n')}\n\n` +
      `*Generated via SmartToolHub (Pro AI Engine)*`;

    safeCopy(text, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const saveToBookmarks = () => {
    if (!result) return;
    try {
      const existing = JSON.parse(localStorage.getItem('smarttoolhub_saved_flows') || '[]');
      const newEntry = {
        id: 'custom-' + Date.now(),
        timestamp: new Date().toISOString(),
        task: formData.task,
        workflow: result,
      };
      localStorage.setItem('smarttoolhub_saved_flows', JSON.stringify([newEntry, ...existing]));
      setSaved(true);
    } catch {
      setSaved(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header — Apple Style */}
      <div className="text-center space-y-3.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-normal text-[#2997FF] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Intelligent Workflow Engine (Pro AI)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-tight">
          Personalized Apple Workflow Generator
        </h1>
        <p className="text-sm sm:text-base text-[#86868B] max-w-xl mx-auto font-normal leading-relaxed">
          Specify your exact Apple devices and workflow goals. Our Gemini-powered engine will formulate a verified, step-by-step procedure with native shortcuts and system prerequisites.
        </p>
      </div>

      {/* Pro Tier Status / Activation Alert */}
      {!isPro ? (
        <div className="glass-card p-6 sm:p-7 rounded-[24px] border border-amber-500/30 bg-amber-500/5 space-y-3.5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-medium text-sm">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>AI Features Available in Pro Only</span>
              </div>
              <p className="text-xs text-[#CCCCCC] leading-relaxed font-normal">
                You are currently in <strong>Community Free</strong> mode. Live multi-device synthesis with Gemini API is an exclusive Pro capability. 
                Free members have unlimited access to all verified guides in the Curated Library.
              </p>
            </div>
            <button
              onClick={activatePro}
              className="shrink-0 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-medium text-xs cursor-pointer shadow-md transition-all duration-200 hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Activate Pro (Test AI)</span>
            </button>
          </div>
          <div className="text-[11px] text-[#86868B] border-t border-amber-500/20 pt-2.5 flex items-center justify-between">
            <span>Or browse 50+ pre-built Continuity guides:</span>
            <button
              onClick={() => onNavigate('library')}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              View Free Curated Library →
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-[20px] bg-white/[0.04] border border-[#0071E3]/30 backdrop-blur-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#68B4FF] font-normal">
            <Sparkles className="w-4 h-4 text-[#2997FF]" />
            <span>SmartToolHub Pro Active • Gemini 3.8 Flash AI Engine ready for custom synthesis</span>
          </div>
          <button
            onClick={togglePro}
            className="text-[11px] text-[#86868B] hover:text-white underline cursor-pointer"
            title="Toggle to Free mode to test feature gating"
          >
            Switch to Free Tier
          </button>
        </div>
      )}

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="glass-card p-7 sm:p-9 rounded-[28px] space-y-8 border border-white/[0.08]">
        
        {/* Question 1: Apple Devices Owned */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider">
            1. Which Apple devices do you own or have available?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {deviceOptions.map((dev) => {
              const Icon = dev.icon;
              const isSelected = formData.devices.includes(dev.label);
              return (
                <button
                  type="button"
                  key={dev.label}
                  onClick={() => toggleDevice(dev.label)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-400/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                      : 'glass-panel text-[#888888] hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-[#666666]'}`} />
                  <span className="text-xs font-medium">{dev.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2: OS Versions */}
        <div className="space-y-2">
          <label htmlFor="osVersions" className="block text-xs font-semibold text-white uppercase tracking-wider">
            2. OS Versions in use
          </label>
          <input
            type="text"
            id="osVersions"
            value={formData.osVersions}
            onChange={(e) => setFormData({ ...formData, osVersions: e.target.value })}
            placeholder="e.g. macOS 15.1 Sequoia, iOS 18.1, iPadOS 18"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-[#666666] focus:outline-none"
          />
        </div>

        {/* Question 3: Task Description */}
        <div className="space-y-3">
          <label htmlFor="task" className="block text-xs font-semibold text-white uppercase tracking-wider">
            3. What specific task or multi-device flow do you want to achieve? *
          </label>
          <textarea
            id="task"
            rows={3}
            value={formData.task}
            onChange={(e) => setFormData({ ...formData, task: e.target.value })}
            placeholder="e.g., Turn my iPhone into an overhead desk camera for live sketching on my Mac, or sync 4K video clips directly to Final Cut Pro without cables..."
            className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white placeholder-[#666666] focus:outline-none resize-none"
          />
          
          {/* Quick Suggestions Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-[#888888]">Quick prompt ideas:</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedTasks.map((sug, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, task: sug })}
                  className="text-[11px] px-2.5 py-1 rounded-lg glass-panel text-[#A3A3A3] hover:text-white hover:border-blue-400/40 transition-all text-left cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question 4: Current Apps */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-white uppercase tracking-wider">
            4. Apps you currently use or prefer
          </label>
          <div className="flex flex-wrap gap-2">
            {appChoices.map((app) => {
              const isSelected = formData.currentApps.includes(app);
              return (
                <button
                  type="button"
                  key={app}
                  onClick={() => toggleApp(app)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-400/50 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                      : 'glass-panel text-[#888888] hover:text-white'
                  }`}
                >
                  {app}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferences & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="toolPreference" className="block text-xs font-semibold text-white uppercase tracking-wider">
              Tool Preference
            </label>
            <select
              id="toolPreference"
              value={formData.toolPreference}
              onChange={(e) => setFormData({ ...formData, toolPreference: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="built-in" className="bg-[#18181B] text-white">Built-in Apple tools only (Zero cost)</option>
              <option value="third-party" className="bg-[#18181B] text-white">Open to 3rd-party apps if superior</option>
              <option value="either" className="bg-[#18181B] text-white">No preference / Whatever is fastest</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="experienceLevel" className="block text-xs font-semibold text-white uppercase tracking-wider">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="Beginner" className="bg-[#18181B] text-white">Beginner (Step-by-step guidance)</option>
              <option value="Intermediate" className="bg-[#18181B] text-white">Intermediate (Comfortable with settings)</option>
              <option value="Advanced" className="bg-[#18181B] text-white">Advanced (Shortcuts, scripts & Terminal)</option>
            </select>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {!isPro && (
              <button
                type="button"
                onClick={activatePro}
                className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg text-xs shrink-0 cursor-pointer"
              >
                Activate Pro
              </button>
            )}
          </div>
        )}

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-full font-normal text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg duration-200 ${
              loading
                ? 'bg-[#0071E3]/50 cursor-not-allowed'
                : 'apple-btn-primary'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-300" />
                <span>Gemini 3.8 Flash Synthesizing Ecosystem Setup...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>{isPro ? 'Synthesize Custom Workflow with Gemini Pro AI' : 'Generate Workflow (Pro Required)'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Workflow Output Section */}
      {result && (
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-blue-400/40 space-y-8 animate-fade-in shadow-[0_15px_40px_rgba(59,130,246,0.15)]">
          
          {/* Header & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  Generated via {aiEngineName} (Pro)
                </span>
                <span className="text-[10px] text-[#888888] font-mono">
                  {result.difficulty} • {result.estimatedSetupTime}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {result.goalSummary}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyAsMarkdown}
                className="px-3 py-1.5 rounded-xl glass-panel text-xs text-[#CCCCCC] hover:text-white flex items-center gap-1.5 cursor-pointer"
                title="Copy full workflow to clipboard as Markdown"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={saveToBookmarks}
                className={`px-3 py-1.5 rounded-xl glass-panel text-xs flex items-center gap-1.5 cursor-pointer ${
                  saved ? 'text-emerald-400 border-emerald-400/40' : 'text-[#CCCCCC] hover:text-white'
                }`}
                title="Bookmark to local device storage"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl glass-panel text-xs text-[#CCCCCC] hover:text-white flex items-center gap-1.5 cursor-pointer"
                title="Print or export as clean PDF sheet"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Required Hardware & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl glass-panel space-y-2">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Target Devices & Minimum OS</span>
              </div>
              <div className="space-y-1.5">
                {result.requiredDevices.map((dev, idx) => (
                  <div key={idx} className="text-xs flex items-baseline justify-between text-[#A3A3A3] border-b border-white/[0.04] pb-1">
                    <span className="font-medium text-white">{dev.device}</span>
                    <span className="font-mono text-[11px] text-blue-300">{dev.minOS}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl glass-panel space-y-2">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-blue-400" />
                <span>Mandatory Settings</span>
              </div>
              <ul className="text-xs space-y-1 text-[#A3A3A3] list-disc list-inside">
                {result.requiredSettings.map((set, idx) => (
                  <li key={idx} className="leading-snug">{set}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step by Step Instructions */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Step-by-Step Procedure</span>
            </h3>

            <div className="space-y-4">
              {result.steps.map((step) => (
                <div key={step.stepNumber} className="p-4 rounded-xl glass-panel space-y-2 border border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold text-xs shrink-0">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed pl-8.5">
                    {step.instruction}
                  </p>
                  
                  {/* Keyboard shortcuts */}
                  {step.shortcuts && step.shortcuts.length > 0 && (
                    <div className="pl-8.5 flex flex-wrap gap-2 pt-1">
                      {step.shortcuts.map((sc, sidx) => (
                        <div key={sidx} className="inline-flex items-center gap-1.5 text-[11px] text-[#A3A3A3] bg-[#1F1F1F] px-2.5 py-1 rounded-md border border-white/[0.08]">
                          {sc.mac && <kbd className="apple-key">{sc.mac}</kbd>}
                          {sc.ios && <kbd className="apple-key">{sc.ios}</kbd>}
                          <span className="text-[#888888]">: {sc.description}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Optional callout */}
                  {step.callout && (
                    <div className="ml-8.5 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-[11px] text-blue-300">
                      💡 <strong>Pro Tip:</strong> {step.callout}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pro Feature: AI Automation Script Generator */}
          <div className="p-5 rounded-2xl glass-card border border-blue-400/30 bg-blue-900/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold text-white">AI Automation Script Generator (Pro)</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-xs text-[#AAAAAA]">
                  Automatically translate this procedure into native AppleScript, macOS zsh shell script, or Shortcuts actions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={scriptType}
                  onChange={(e) => setScriptType(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl glass-input text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="applescript" className="bg-[#18181B] text-white">AppleScript (.scpt)</option>
                  <option value="zsh" className="bg-[#18181B] text-white">macOS zsh Shell Script</option>
                  <option value="shortcuts-spec" className="bg-[#18181B] text-white">Shortcuts Action Spec</option>
                </select>

                <button
                  onClick={handleGenerateScript}
                  disabled={scriptLoading}
                  className="px-3.5 py-1.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {scriptLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing Code...</span>
                    </>
                  ) : (
                    <>
                      <Code className="w-3.5 h-3.5" />
                      <span>Generate Script</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {scriptError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center justify-between">
                <span>{scriptError}</span>
                <button 
                  type="button" 
                  onClick={() => setScriptError(null)} 
                  className="text-red-300 hover:text-white text-xs underline cursor-pointer ml-2"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Render Script Output */}
            {generatedScript && (
              <div className="space-y-3 pt-3 border-t border-white/[0.08] animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-300 font-mono">
                    {generatedScript.title}
                  </span>
                  <button
                    onClick={copyScript}
                    className="px-2.5 py-1 rounded-lg glass-panel text-[11px] text-white flex items-center gap-1 cursor-pointer hover:border-blue-400/40"
                  >
                    {scriptCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
                    <span>{scriptCopied ? 'Code Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#090A0E]">
                  <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto selection:bg-emerald-900 selection:text-white leading-relaxed">
                    <code>{generatedScript.code}</code>
                  </pre>
                </div>

                {generatedScript.instructions && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1">
                    <span className="font-semibold text-white">How to execute on your Mac:</span>
                    <ol className="list-decimal list-inside text-[#AAAAAA] space-y-0.5 pl-1">
                      {generatedScript.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Common Problems */}
          {result.commonProblems && result.commonProblems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Common Pitfalls & Troubleshooting</span>
              </h3>
              <div className="space-y-2">
                {result.commonProblems.map((prob, pidx) => (
                  <div key={pidx} className="p-3 rounded-xl bg-[#161616] border border-amber-500/20 text-xs space-y-1">
                    <div className="font-semibold text-amber-300">Issue: {prob.issue}</div>
                    <div className="text-[#A3A3A3]">Solution: {prob.solution}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Notes */}
          {result.privacyNotes && result.privacyNotes.length > 0 && (
            <div className="p-4 rounded-xl bg-[#161616] border border-emerald-500/20 space-y-2 text-xs">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy & Security Guardrails</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#A3A3A3]">
                {result.privacyNotes.map((pn, pidx) => (
                  <li key={pidx}>{pn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternative Workflow */}
          {result.alternativeWorkflow && (
            <div className="p-4 rounded-xl bg-[#161616] border border-white/[0.06] space-y-1.5 text-xs">
              <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">Alternative Approach</span>
              <div className="font-semibold text-white">{result.alternativeWorkflow.title}</div>
              <p className="text-[#A3A3A3]">{result.alternativeWorkflow.description}</p>
              <div className="text-[11px] text-purple-300/90 pt-1">
                ⚖️ <strong>Trade-off:</strong> {result.alternativeWorkflow.tradeOff}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
