import React, { useState } from 'react';
import { Terminal, ShieldAlert, Check, Copy, Code2, AlertTriangle, Play, HelpCircle, FileText } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface AutoHotkeyGeneratorPageProps {
  navigate: (path: string) => void;
}

export const AutoHotkeyGeneratorPage: React.FC<AutoHotkeyGeneratorPageProps> = ({ navigate }) => {
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'autohotkey-script-generator') || {
    id: 'autohotkey-script-generator',
    name: 'AutoHotkey Script Generator (v2)',
    slug: 'autohotkey-script-generator',
    description: 'Generate clean, modern AutoHotkey v2 scripts for text expansion, hotkeys, and desktop workflows with line-by-line explanations.',
    category: 'Developer',
    icon: 'Terminal',
    type: 'ai',
    keywords: ['autohotkey v2 generator', 'ahk script creator', 'windows hotkey script', 'text expansion macro windows'],
    relatedToolSlugs: ['android-automation-generator', 'install-command-generator'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'android-automation-generator' || t.slug === 'install-command-generator' || t.slug === 'mac-windows-shortcut-translator'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  const exampleChips = [
    'Type my email address when I press Ctrl+Alt+E',
    'Open Chrome and Slack with Win+Shift+W',
    'Remap Caps Lock to Backspace',
  ];

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch {
      // Handled
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="AutoHotkey Script Generator (v2)"
      subheading="Generate modern AutoHotkey v2 (.ahk) automation scripts for hotkeys, text expansion, and system shortcuts with line-by-line technical explanations and setup instructions."
      inputLabel="Describe the hotkey or automation you want"
      inputPlaceholder="e.g. Type my email address whenever I press Ctrl + Alt + E, or open Spotify and Calculator with Win + Shift + M..."
      examplePrompt="Type my email address when I press Ctrl+Alt+E"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/autohotkey-script"
      requestPayload={(input) => ({
        description: input,
      })}
      customResultRenderer={({ result, rawData }) => {
        const script: string = rawData?.script || result;
        const explanation: string[] = rawData?.explanation || [];
        const howToRun: string[] = rawData?.howToRun || [];

        return (
          <div className="space-y-6">
            {/* Script Output Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(108,125,255,0.3)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>AutoHotkey v2 Code (.ahk)</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(script)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(108,125,255,0.3)] text-xs font-semibold text-[#f2f7ff] hover:border-[#6c7dff] transition-colors focus-ring"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                      <span className="text-[#34e0a1]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.18)] font-mono text-xs sm:text-sm text-[#f2f7ff] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                {script}
              </div>

              {/* Mandatory Safety Notice */}
              <div className="p-3.5 rounded-xl bg-[#101c33] border border-[rgba(255,184,64,0.3)] flex items-start gap-2.5 text-xs text-[#ffb840]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Read it before you run it: </span>
                  <span>
                    Always review script lines before executing them in Windows. Ensure you understand what keyboard inputs or program commands the script sends.
                  </span>
                </div>
              </div>
            </div>

            {/* Line-by-Line Breakdown */}
            {explanation.length > 0 && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[#6c7dff] font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6c7dff]" />
                  <span>Line-by-Line Explanation</span>
                </div>
                <div className="space-y-2">
                  {explanation.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-xs text-[#f2f7ff] leading-relaxed"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Run Instructions */}
            {howToRun.length > 0 && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[#34e0a1] font-bold flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#34e0a1]" />
                  <span>How to Run on Windows</span>
                </div>
                <div className="space-y-2">
                  {howToRun.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-xs text-[#f2f7ff]"
                    >
                      <span className="w-5 h-5 rounded-md bg-[#101c33] text-[#34e0a1] font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed mt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <>
          <p>
            AutoHotkey (AHK) is the premier open-source automation and keyboard remapping engine for Windows. In 2023, the AutoHotkey project officially transitioned to <strong>AutoHotkey v2</strong>, introducing a cleaner, standardized expression-based syntax that eliminated decades of confusing legacy v1 quirks.
          </p>
          <p>
            This tool generates certified AutoHotkey v2 code for everyday productivity: text expansion (auto-typing long email addresses, templates, or snippets), application launchers, custom hotkeys, and key remappings. Every script includes the <code>#Requires AutoHotkey v2.0+</code> directive to ensure reliable execution without syntax errors.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Describe your hotkey or macro',
          text: 'Type what you want to achieve (e.g., "Press Win+Alt+T to open Terminal as Admin, or type :btw: to expand into by the way").',
        },
        {
          step: 'Review the generated v2 script',
          text: 'Read the code and examine the line-by-line explanation to verify which keys and functions are being called.',
        },
        {
          step: 'Run the script on Windows',
          text: 'Save the code into a new `.ahk` file and double-click to launch. An AutoHotkey icon appears in your system tray.',
        },
      ]}
      workedExample={{
        title: 'Example: Text Expansion for Frequent Email Sign-off',
        scenario: 'A customer support agent wants typing "::bestreg::" to automatically expand into their full professional sign-off.',
        output: `; AutoHotkey v2 Script
; Read it before you run it.
#Requires AutoHotkey v2.0+

; Hotstring: typing :?*:bestreg expands immediately
:*::bestreg::
{
    SendInput("Best regards,{Enter}Jane Doe{Enter}Senior Technical Lead")
}

Line-by-Line Explanation:
• #Requires AutoHotkey v2.0+ guarantees modern syntax compatibility.
• :*::bestreg:: defines a hotstring that triggers automatically without needing an extra space or ending character.
• SendInput() cleanly injects the multi-line signature into the active text field.`,
      }}
      tips={[
        'Install AutoHotkey v2: Download the official installer from autohotkey.com. Choose v2 as the primary interpreter.',
        'Use Hotstrings for text snippets: Prepending double colons (e.g., `::omw::on my way!`) creates instant text replacements anywhere in Windows.',
        'Edit anytime with Notepad: AutoHotkey files are plain text files ending in `.ahk`. Right-click to edit or reload changes.',
        'Suspend Hotkeys easily: Right-click the green "H" icon in your taskbar and select "Suspend Hotkeys" whenever you need to temporarily disable macros for gaming.',
      ]}
      faq={[
        {
          question: 'What is the difference between AutoHotkey v1 and v2?',
          answer: 'AutoHotkey v1 used legacy command syntax with inconsistent quoting and percent-sign rules. AutoHotkey v2 is a complete rewrite featuring a modern, fully expression-based syntax with proper functions, objects, and clear error messages.',
        },
        {
          question: 'Can AutoHotkey damage my computer or steal data?',
          answer: 'Standard hotkeys and text expansion scripts are completely benign. However, because scripts can simulate keystrokes, you should always review code before executing it. Our generator strictly refuses keylogger or surveillance requests.',
        },
        {
          question: 'How do I make my AHK script start automatically with Windows?',
          answer: 'Press Windows + R, type "shell:startup", and press Enter. Paste a shortcut to your `.ahk` file into this Startup folder. Windows will automatically launch it every time you log in.',
        },
        {
          question: 'Will anti-cheat software in PC games flag AutoHotkey?',
          answer: 'Some competitive games with kernel-level anti-cheat (such as Riot Vanguard or Easy Anti-Cheat) block or monitor active AutoHotkey processes to prevent automated recoil scripts. Suspend or close AHK before launching competitive games.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
