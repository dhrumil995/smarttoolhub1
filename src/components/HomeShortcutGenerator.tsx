import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Terminal, 
  Layers, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  Smartphone,
  CheckCircle2,
  Sliders,
  FileCode
} from 'lucide-react';
import { haptics } from '../utils/haptics';

interface GeneratedStep {
  step: number;
  app: string;
  action: string;
  notes?: string;
}

interface GeneratedShortcutData {
  title: string;
  category: string;
  description: string;
  steps: GeneratedStep[];
  applescript?: string;
  zshCommand?: string;
}

interface HomeShortcutGeneratorProps {
  onOpenFullGenerator?: () => void;
  initialPrompt?: string;
}

const EXAMPLE_PROMPTS = [
  'Morning briefing: weather, calendar events, and start Work Focus',
  'Convert newest screenshot to WebP and AirDrop to Mac',
  'Toggle Low Power Mode and set brightness to 20%',
  'Extract receipt total from photo and save to Apple Notes',
  'Batch rename Downloads folder items with today date',
  'Send estimated ETA to family when leaving work',
];

export const HomeShortcutGenerator: React.FC<HomeShortcutGeneratorProps> = ({
  onOpenFullGenerator,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Synthesizing actions...');
  const [result, setResult] = useState<GeneratedShortcutData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'actions' | 'script'>('actions');

  // Load initial prompt from URL or props
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    } else {
      try {
        const hash = window.location.hash;
        if (hash.startsWith('#prompt=')) {
          const decoded = decodeURIComponent(hash.replace('#prompt=', ''));
          setPrompt(decoded);
        }
      } catch (_) {}
    }
  }, [initialPrompt]);

  // Client-side instant generator fallback
  const synthesizeLocally = (input: string): GeneratedShortcutData => {
    const lower = input.toLowerCase();
    
    if (lower.includes('photo') || lower.includes('screenshot') || lower.includes('webp') || lower.includes('image')) {
      return {
        title: 'Retina Image Optimizer & AirDrop',
        category: 'Media & Photography',
        description: 'Pulls the most recent screenshot or photo, converts it to modern WebP with 85% quality, and initiates peer-to-peer AirDrop.',
        steps: [
          { step: 1, app: 'Photos', action: 'Get Latest Screenshots (Count: 1)' },
          { step: 2, app: 'Shortcuts', action: 'Convert Image to WebP (Quality: 85%, Preserve Metadata)' },
          { step: 3, app: 'Files', action: 'Save Converted Image to iCloud Drive / ShortCutTemp' },
          { step: 4, app: 'AirDrop', action: 'Share Item via AirDrop to Nearby Mac' },
        ],
        applescript: `tell application "Finder"\n  set latestFile to item 1 of (sort (get files of desktop) by creation date)\n  display notification "Optimizing image for AirDrop" with title "SmartToolHub"\nend tell`,
        zshCommand: `sips -s format webp -s formatOptions 85 ~/Desktop/*.png --out ~/Desktop/Optimized/`,
      };
    }

    if (lower.includes('battery') || lower.includes('power') || lower.includes('dim') || lower.includes('brightness')) {
      return {
        title: 'Ultra Low Power Eco Mode',
        category: 'System & Hardware',
        description: 'Immediately disables background data refresh, sets display brightness to 20%, and activates system Low Power Mode.',
        steps: [
          { step: 1, app: 'Settings', action: 'Set Low Power Mode: On' },
          { step: 2, app: 'Device', action: 'Set Brightness to 20%' },
          { step: 3, app: 'Wi-Fi & Cellular', action: 'Set Cellular Data Low Data Mode: On' },
          { step: 4, app: 'Shortcuts', action: 'Show Notification: "Battery Saver Active (20% Brightness)"' },
        ],
        applescript: `do shell script "pmset -a displaysleep 2; pmset -a disablesleep 0"`,
        zshCommand: `sudo pmset -a displaysleep 2`,
      };
    }

    if (lower.includes('note') || lower.includes('receipt') || lower.includes('text') || lower.includes('extract')) {
      return {
        title: 'OCR Text Scanner to Apple Notes',
        category: 'Productivity & Office',
        description: 'Extracts printed text and figures from camera scans or photos and appends formatted Markdown to an Apple Notes notebook.',
        steps: [
          { step: 1, app: 'Camera', action: 'Take Document Photo or Pick from Library' },
          { step: 2, app: 'Vision Framework', action: 'Extract Text from Image (Language: English, Accuracy: Accurate)' },
          { step: 3, app: 'Text', action: 'Format Output: "**Scanned Record — [Current Date]**\\n\\n[Extracted Text]"' },
          { step: 4, app: 'Apple Notes', action: 'Append Text to Note named "Expenses & Receipts"' },
        ],
        applescript: `tell application "Notes"\n  tell account "iCloud"\n    make new note at folder "Notes" with properties {name:"Receipt Scan", body:"Scanned via SmartToolHub"}\n  end tell\nend tell`,
        zshCommand: `osascript -e 'tell application "Notes" to make new note with properties {name:"Receipt Scan"}'`,
      };
    }

    // Default multi-step productivity shortcut
    return {
      title: input.length > 30 ? `${input.slice(0, 30)}...` : input || 'Daily Automation Workflow',
      category: 'Productivity',
      description: `Custom Siri shortcut synthesized for "${input}". Integrates system intents, calendar syncing, and background notifications.`,
      steps: [
        { step: 1, app: 'Shortcuts', action: 'Set Variable: [TaskTimestamp] to Current Date (ISO 8601)' },
        { step: 2, app: 'Calendar', action: 'Find Calendar Events where Start Date is Today' },
        { step: 3, app: 'Scripting', action: 'Filter and Format Event Titles into Clean Bulleted List' },
        { step: 4, app: 'Siri & Audio', action: 'Speak Text: "Here is your plan for today."' },
        { step: 5, app: 'Notifications', action: 'Show Alert with Formatted Output' },
      ],
      applescript: `tell application "System Events"\n  display notification "Shortcut executed successfully" with title "${input.slice(0, 25)}"\nend tell`,
      zshCommand: `echo "Shortcut triggered: ${input.replace(/"/g, '\\"')}" && date`,
    };
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = prompt.trim();
    if (!query) {
      setError('Please describe what shortcut or workflow you want to generate.');
      return;
    }

    setError(null);
    setLoading(true);
    haptics.playTap();

    setLoadingStep('Parsing natural language intents...');
    setTimeout(() => setLoadingStep('Synthesizing iOS 18 action graph...'), 450);
    setTimeout(() => setLoadingStep('Validating device permissions & variables...'), 900);

    try {
      // Try backend AI generation if available, fallback to fast client synthesizer
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: query,
          devices: ['iPhone', 'Mac'],
          experienceLevel: 'Intermediate',
          toolPreference: 'built-in',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.workflow) {
          const steps: GeneratedStep[] = Array.isArray(data.workflow.steps)
            ? data.workflow.steps.map((st: any, idx: number) => ({
                step: idx + 1,
                app: st.app || 'Shortcuts',
                action: st.action || String(st),
                notes: st.notes || '',
              }))
            : [];

          setResult({
            title: data.workflow.title || 'Generated Apple Shortcut',
            category: data.workflow.category || 'Productivity',
            description: data.workflow.summary || data.workflow.description || query,
            steps: steps.length > 0 ? steps : synthesizeLocally(query).steps,
            applescript: data.workflow.applescript || undefined,
            zshCommand: data.workflow.zshCommand || undefined,
          });
          setLoading(false);
          haptics.playSuccess();
          return;
        }
      }
    } catch (_) {
      // Gracefully fall back to local synthesizer
    }

    // Client fallback synthesis
    setTimeout(() => {
      const fallbackData = synthesizeLocally(query);
      setResult(fallbackData);
      setLoading(false);
      haptics.playSuccess();
    }, 1100);
  };

  const handleCopy = async () => {
    if (!result) return;
    haptics.playTap();

    let textToCopy = `=== ${result.title} ===\n${result.description}\n\nActions:\n`;
    result.steps.forEach((s) => {
      textToCopy += `${s.step}. [${s.app}] ${s.action}${s.notes ? ` (${s.notes})` : ''}\n`;
    });

    if (result.applescript) {
      textToCopy += `\nAppleScript:\n${result.applescript}\n`;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    haptics.playTap();
    const shareUrl = `${window.location.origin}/#prompt=${encodeURIComponent(prompt)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.title,
          text: `Check out this Apple Shortcut workflow: ${result.title}`,
          url: shareUrl,
        });
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (_) {}
  };

  return (
    <section id="generator" className="relative max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24">
      {/* Container with Frosted Glassmorphism & Depth */}
      <div className="bento-card p-6 sm:p-10 tilt-card-3d relative overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.5),0_0_30px_rgba(10,132,255,0.15)]">
        {/* Subtle Specular Aurora Blob Background */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#0a84ff]/20 via-[#ff4f9a]/15 to-transparent blur-[80px] pointer-events-none"
        />

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-500/15 border border-blue-400/30 text-blue-400">
                  Main AI Tool
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  iOS 18 · macOS 15
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                AI Apple Shortcut Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Describe any routine in plain language. Generate ready-to-use Siri Shortcuts actions, AppleScript, and terminal commands instantly.
              </p>
            </div>

            {onOpenFullGenerator && (
              <button
                type="button"
                onClick={onOpenFullGenerator}
                className="self-start sm:self-center px-3.5 py-2 rounded-xl glass-pill text-xs font-semibold text-slate-800 dark:text-zinc-200 hover:text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Pro Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Generator Input Form */}
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="shortcut-prompt-input"
                className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono"
              >
                What would you like to automate?
              </label>
              <div className="relative">
                <textarea
                  id="shortcut-prompt-input"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Turn on Work Focus, fetch today's calendar meetings, summarize into Apple Notes, and text my manager when done..."
                  className="glass-input w-full p-4 rounded-2xl text-xs sm:text-sm placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                  aria-describedby="prompt-help"
                />
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-400 pointer-events-none">
                  {prompt.length} chars
                </div>
              </div>
              <p id="prompt-help" className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Type any task across iPhone, Mac, Apple Watch, or smart home devices.
              </p>
            </div>

            {/* Clickable Example Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                Quick Idea Prompts:
              </span>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      haptics.playTap();
                      setPrompt(ex);
                    }}
                    className="px-3 py-1.5 rounded-xl text-[11px] glass-pill text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:border-blue-400/40 transition-colors cursor-pointer text-left"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-button-primary text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(10,132,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{loadingStep}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Shortcut Now</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result Card */}
          {result && !loading && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 space-y-5 animate-fadeIn">
              {/* Result Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 dark:bg-black/40 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0a84ff] to-[#ff4f9a] p-0.5 flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                      {result.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Category: {result.category} · {result.steps.length} Actions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl glass-pill text-xs font-semibold text-slate-800 dark:text-zinc-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Actions</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-3.5 py-2 rounded-xl glass-pill text-xs font-semibold text-slate-800 dark:text-zinc-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {shared ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('actions')}
                  className={`tilt-tab-3d px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'actions'
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Action Graph ({result.steps.length})
                </button>
                {result.applescript && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('script')}
                    className={`tilt-tab-3d px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'script'
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    AppleScript &amp; Shell
                  </button>
                )}
              </div>

              {/* Actions List Display */}
              {activeTab === 'actions' ? (
                <div className="space-y-2.5">
                  {result.steps.map((st) => (
                    <div
                      key={st.step}
                      className="p-3.5 rounded-xl bg-white/5 dark:bg-white/[0.03] border border-white/10 hover:border-blue-400/30 transition-colors flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">
                        {st.step}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                            {st.app}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                            {st.action}
                          </span>
                        </div>
                        {st.notes && (
                          <p className="text-[11px] text-zinc-400 mt-1">
                            {st.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {result.applescript && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono text-zinc-400">AppleScript (.scpt):</div>
                      <pre className="p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-indigo-300 font-mono overflow-x-auto">
                        <code>{result.applescript}</code>
                      </pre>
                    </div>
                  )}
                  {result.zshCommand && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono text-zinc-400">Terminal Shell Command:</div>
                      <pre className="p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-emerald-300 font-mono overflow-x-auto">
                        <code>{result.zshCommand}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
