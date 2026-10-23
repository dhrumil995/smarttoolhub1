import React, { useState } from 'react';
import { Terminal, ShieldAlert, Check, Copy, Code2, AlertTriangle, ShieldCheck, HelpCircle, FileCode, ArrowRight, Info, AlertOctagon } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface CommandExplainerPageProps {
  navigate: (path: string) => void;
}

export const CommandExplainerPage: React.FC<CommandExplainerPageProps> = ({ navigate }) => {
  const [environment, setEnvironment] = useState<'auto' | 'linux' | 'mac' | 'windows' | 'termux'>('auto');
  const [copiedPart, setCopiedPart] = useState<string | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'command-explainer') || {
    id: 'command-explainer',
    name: 'Command Explainer',
    slug: 'command-explainer',
    description: 'Paste any terminal, bash, or PowerShell command to see what it does in plain words, a part-by-part breakdown, risk level, and safer alternatives.',
    category: 'Developer',
    icon: 'FileCode',
    type: 'ai',
    keywords: ['command explainer', 'explain terminal command', 'powershell command breakdown', 'bash command safety check', 'understand command line'],
    relatedToolSlugs: ['adb-fastboot-command-builder', 'autohotkey-script-generator'],
    guideSlug: 'better-prompts-simple-rules',
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'adb-fastboot-command-builder' || t.slug === 'autohotkey-script-generator' || t.slug === 'install-command-generator'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  const exampleChips = [
    'tar -czvf backup.tar.gz /var/www/html',
    'find . -name "*.log" -type f -mtime +30 -delete',
    'Get-ChildItem -Path C:\\Logs -Recurse | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item',
  ];

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPart(id);
      setTimeout(() => setCopiedPart(null), 2000);
    } catch {
      // Handled
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Command Explainer"
      subheading="Paste any bash, zsh, terminal, or PowerShell command to see what it does in plain words, a breakdown of every flag and parameter, its risk rating, and a safer alternative."
      inputLabel="Paste terminal or PowerShell command (up to 1,000 characters)"
      inputPlaceholder="e.g. tar -czvf archive.tar.gz /home/user/docs, or find . -type f -name '*.tmp' -delete..."
      examplePrompt="tar -czvf backup.tar.gz /var/www/html"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      apiEndpoint="/api/command-explainer"
      requestPayload={(input) => ({
        command: input.slice(0, 1000),
        environment,
      })}
      extraControls={
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-[#6c7dff] font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Shell / OS Environment</span>
            </label>
            <span className="text-[11px] font-mono text-[#9aaccb]">
              Never executed. Analyzed safely in sandboxed parsing.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'auto', label: 'Auto Detect' },
              { id: 'linux', label: 'Linux (bash)' },
              { id: 'mac', label: 'macOS (zsh)' },
              { id: 'windows', label: 'Windows (PS)' },
              { id: 'termux', label: 'Android (Termux)' },
            ].map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => setEnvironment(env.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all focus-ring ${
                  environment === env.id
                    ? 'bg-[#101c33] border border-[#6c7dff] text-[#f2f7ff] shadow-sm font-semibold'
                    : 'bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-[#9aaccb] hover:text-[#f2f7ff]'
                }`}
              >
                {env.label}
              </button>
            ))}
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData }) => {
        const whatItDoes: string = rawData?.whatItDoes || result;
        const breakdown: Array<{ part: string; meaning: string }> = rawData?.breakdown || [];
        const riskRating: 'Safe' | 'Caution' | 'Dangerous' = rawData?.riskRating || 'Safe';
        const riskReason: string = rawData?.riskReason || '';
        const saferAlternative: string | null = rawData?.saferAlternative || null;

        const badgeColor =
          riskRating === 'Dangerous'
            ? 'bg-[rgba(255,92,122,0.14)] text-[#ff5c7a] border-[rgba(255,92,122,0.3)]'
            : riskRating === 'Caution'
            ? 'bg-[rgba(255,184,64,0.14)] text-[#ffb840] border-[rgba(255,184,64,0.3)]'
            : 'bg-[rgba(52,224,161,0.14)] text-[#34e0a1] border-[rgba(52,224,161,0.3)]';

        const RiskIcon =
          riskRating === 'Dangerous'
            ? AlertOctagon
            : riskRating === 'Caution'
            ? AlertTriangle
            : ShieldCheck;

        return (
          <div className="space-y-6">
            {/* Overview & Risk Rating Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>Plain-English Summary</span>
                </span>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase font-mono ${badgeColor}`}>
                  <RiskIcon className="w-3.5 h-3.5" />
                  <span>Risk Level: {riskRating}</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#f2f7ff] leading-relaxed">
                {whatItDoes}
              </p>

              {riskReason && (
                <div className="p-3.5 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-xs text-[#9aaccb] leading-relaxed">
                  <span className="font-semibold text-[#f2f7ff]">Why this rating: </span>
                  {riskReason}
                </div>
              )}

              {/* Safety notice banner */}
              <div className="p-3.5 rounded-xl bg-[#101c33] border border-[rgba(255,184,64,0.25)] flex items-start gap-2.5 text-xs text-[#ffb840]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Read it before you run it: </span>
                  <span>
                    Never paste commands blindly into a terminal. Verify target paths, backup directories, and understand elevated permissions beforehand.
                  </span>
                </div>
              </div>
            </div>

            {/* Part-by-Part Breakdown Cards */}
            {breakdown.length > 0 && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[#6c7dff] font-bold flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#6c7dff]" />
                  <span>Part-by-Part Command Breakdown</span>
                </div>

                <div className="space-y-2.5">
                  {breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#101c33] border border-[rgba(108,125,255,0.25)] font-mono text-xs font-bold text-[#6c7dff] shrink-0">
                          {item.part}
                        </span>
                        <span className="text-xs text-[#f2f7ff] leading-relaxed">
                          {item.meaning}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(item.part, `part-${idx}`)}
                        className="self-end sm:self-center shrink-0 p-1.5 rounded-lg text-[#9aaccb] hover:text-[#f2f7ff] hover:bg-[#101c33] transition-colors focus-ring"
                        aria-label={`Copy token ${item.part}`}
                      >
                        {copiedPart === `part-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safer Alternative Box (if recommended) */}
            {saferAlternative && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(52,224,161,0.25)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#34e0a1] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Recommended Safer Alternative</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(saferAlternative, 'alternative')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(52,224,161,0.3)] text-xs font-semibold text-[#f2f7ff] hover:border-[#34e0a1] transition-colors focus-ring"
                  >
                    {copiedPart === 'alternative' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                        <span className="text-[#34e0a1]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Alternative</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(52,224,161,0.2)] font-mono text-xs sm:text-sm text-[#34e0a1] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                  {saferAlternative}
                </div>
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <>
          <p>
            Terminal, shell, and PowerShell commands are exceptionally powerful tools, but copying and pasting unfamiliar snippets from discussion forums, documentation, or LLMs can carry severe risks. Flags like <code>-r</code>, <code>-f</code>, or <code>-delete</code> can irreversibly remove files, wipe storage partitions, or leak private environment variables.
          </p>
          <p>
            The <strong>Command Explainer</strong> safely deconstructs any bash, zsh, Linux, macOS, Windows PowerShell, or Termux command string without ever executing it. It parses every sub-command, flag, argument, and pipe into plain English, classifies the overall risk level (Safe, Caution, or Dangerous), and recommends safer alternatives whenever destructive actions are detected.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Paste your command string',
          text: 'Paste any shell script or terminal command up to 1,000 characters. Select your target operating system or let auto-detect determine the shell.',
        },
        {
          step: 'Check risk rating and warnings',
          text: 'Look at the top badge to see whether the command is read-only (Safe), modifies system state (Caution), or involves permanent data loss (Dangerous).',
        },
        {
          step: 'Review token breakdown & alternatives',
          text: 'Read what each flag and parameter instructs your machine to do, and copy recommended dry-run alternatives before executing.',
        },
      ]}
      workedExample={{
        title: 'Example: Recursive Directory Cleanup with Safety Verification',
        scenario: 'A developer finds a cleanup command on a forum: find /var/log -type f -name "*.tmp" -mtime +7 -exec rm -f {} + and wants to know exactly what each parameter does before running it on production.',
        output: `### Command Overview
This command finds all files inside /var/log ending in ".tmp" that were modified more than 7 days ago and deletes them without confirmation.

Risk Level: Caution
Modifies system state by deleting files directly without moving them to a trash bin or recycling folder.

Part-by-Part Breakdown:
• find: Invokes the Unix directory search utility.
• /var/log: The target root directory to search recursively.
• -type f: Restricts matches exclusively to regular files (ignoring folders, sockets, and symlinks).
• -name "*.tmp": Matches filenames ending with the .tmp extension.
• -mtime +7: Filters for files with modification times greater than 7 days (168 hours) ago.
• -exec rm -f {} +: Passes the matched file list in batches to rm -f to delete them without prompting.

Safer Alternative:
find /var/log -type f -name "*.tmp" -mtime +7 (Omit the -exec rm part first to preview the exact list of files before deleting).

Notice: Read it before you run it.`,
      }}
      tips={[
        'Always preview before deleting: Run `find` or `ls` with your query parameters first to see what matches before attaching `-delete` or piping to `rm`.',
        'Use interactive confirmation flags: Adding `-i` to `rm`, `cp`, or `mv` prompts you before overwriting or removing any file.',
        'Beware of curl-to-bash pipelines: Commands like `curl -fsSL https://... | bash` download and execute code with your user permissions without verification. Download the script first and inspect it.',
        'Quote file path variables: In shell scripts, always wrap variables in double quotes (e.g. `"$TARGET_DIR"`) to prevent accidental word splitting or deleting root when a variable is empty.',
      ]}
      faq={[
        {
          question: 'Does this tool ever run my command on a server?',
          answer: 'No. This tool strictly analyzes the text string using natural language parsing and syntax tokenization. It has no terminal access, shell environment, or container runner. It is completely impossible for any pasted command to execute.',
        },
        {
          question: 'What makes a command rated "Dangerous"?',
          answer: 'Commands receive a Dangerous rating when they perform irreversible actions such as formatting partitions (mkfs, format), deleting root or system directories (rm -rf /), wiping raw block devices (dd), altering partition tables, or executing arbitrary unverified scripts directly from the internet.',
        },
        {
          question: 'Can this tool explain multi-line or piped commands?',
          answer: 'Yes. You can paste piped commands (using |, &&, or ||), redirects (>, >>), and sub-shells up to 1,000 characters. Each component and pipe stage is identified in the part-by-part breakdown.',
        },
        {
          question: 'Why do flags have different meanings across Linux and macOS?',
          answer: 'macOS uses BSD utilities by default, whereas most Linux distributions use GNU coreutils. Flags like `sed -i` or `date` have different syntax rules between BSD and GNU. Select macOS or Linux in the environment selector for environment-specific guidance.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
