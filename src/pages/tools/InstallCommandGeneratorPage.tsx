import React, { useState, useMemo } from 'react';
import { Terminal, Check, Copy, ShieldAlert, Sparkles, Laptop, Monitor, Filter } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { INSTALL_APPS, STARTER_PACKS, InstallApp } from '../../data/installApps.ts';

interface InstallCommandGeneratorPageProps {
  navigate: (path: string) => void;
}

export const InstallCommandGeneratorPage: React.FC<InstallCommandGeneratorPageProps> = ({ navigate }) => {
  const [targetPlatform, setTargetPlatform] = useState<'windows' | 'mac'>('windows');
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(
    new Set(['powertoys', 'sevenzip', 'everything', 'sharex'])
  );
  const [formatMode, setFormatMode] = useState<'oneline' | 'multiline'>('oneline');
  const [activeStarterPack, setActiveStarterPack] = useState<string>('windows-essentials');
  const [copiedMode, setCopiedMode] = useState<'script' | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'install-command-generator') || {
    id: 'install-command-generator',
    name: 'Install Command Generator',
    slug: 'install-command-generator',
    description: 'Generate clean winget or Homebrew terminal commands to set up your Windows or Mac machine.',
    category: 'Developer',
    icon: 'Terminal',
    type: 'client',
    keywords: ['winget install command', 'homebrew cask script', 'mac app installer', 'windows setup'],
    relatedToolSlugs: ['file-checksum-verifier', 'cidr-subnet-calculator'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'file-checksum-verifier' || t.slug === 'cidr-subnet-calculator' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  // Filter apps applicable to the chosen platform
  const visibleApps = useMemo(() => {
    return INSTALL_APPS.filter((app) => {
      if (targetPlatform === 'windows') {
        return (app.platform === 'windows' || app.platform === 'both') && !!app.wingetId;
      }
      return (app.platform === 'mac' || app.platform === 'both') && !!app.brewName;
    });
  }, [targetPlatform]);

  // Group visible apps by category
  const categories = useMemo(() => {
    const cats: Record<string, InstallApp[]> = {
      'Utilities': [],
      'File Tools': [],
      'System Tools': [],
      'Productivity': [],
    };
    visibleApps.forEach((app) => {
      if (cats[app.category]) {
        cats[app.category].push(app);
      }
    });
    return cats;
  }, [visibleApps]);

  const handleToggleApp = (id: string) => {
    setSelectedAppIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setActiveStarterPack('');
  };

  const handleApplyStarterPack = (packId: string) => {
    const pack = STARTER_PACKS.find((p) => p.id === packId);
    if (!pack) return;
    const applicableIds = new Set<string>();
    pack.appIds.forEach((id) => {
      const app = INSTALL_APPS.find((a) => a.id === id);
      if (app) {
        if (targetPlatform === 'windows' && (app.platform === 'windows' || app.platform === 'both') && app.wingetId) {
          applicableIds.add(id);
        } else if (targetPlatform === 'mac' && (app.platform === 'mac' || app.platform === 'both') && app.brewName) {
          applicableIds.add(id);
        }
      }
    });
    setSelectedAppIds(applicableIds);
    setActiveStarterPack(packId);
  };

  const handleSelectAll = () => {
    const all = new Set<string>();
    visibleApps.forEach((a) => all.add(a.id));
    setSelectedAppIds(all);
    setActiveStarterPack('');
  };

  const handleClearAll = () => {
    setSelectedAppIds(new Set());
    setActiveStarterPack('');
  };

  // Generate the command output
  const generatedCommand = useMemo(() => {
    const selectedApps = visibleApps.filter((a) => selectedAppIds.has(a.id));
    if (selectedApps.length === 0) {
      return '# No applications selected. Check one or more apps from the list above.';
    }

    if (targetPlatform === 'windows') {
      const ids = selectedApps.map((a) => a.wingetId).filter(Boolean) as string[];
      if (formatMode === 'oneline') {
        return `winget install ${ids.map((id) => `--id ${id} -e`).join(' ')} --accept-source-agreements --accept-package-agreements`;
      } else {
        const lines = [
          '@echo off',
          ':: SmartToolHub Automated Windows Setup Script',
          ':: Read it before you run it.',
          'echo Starting Windows application installations...',
          '',
          ...ids.map((id) => `winget install --id ${id} -e --accept-source-agreements --accept-package-agreements`),
          '',
          'echo Installation sequence complete.',
          'pause',
        ];
        return lines.join('\r\n');
      }
    } else {
      // Mac Homebrew Cask
      const casks = selectedApps.map((a) => a.brewName).filter(Boolean) as string[];
      if (formatMode === 'oneline') {
        return `brew install --cask ${casks.join(' ')}`;
      } else {
        const lines = [
          '#!/usr/bin/env bash',
          '# SmartToolHub Automated macOS Setup Script',
          '# Read it before you run it.',
          'echo "Starting Homebrew cask installations..."',
          '',
          ...casks.map((cask) => `brew install --cask ${cask}`),
          '',
          'echo "All casks installed successfully."',
        ];
        return lines.join('\n');
      }
    }
  }, [visibleApps, selectedAppIds, targetPlatform, formatMode]);

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(generatedCommand);
      setCopiedMode('script');
      setTimeout(() => setCopiedMode(null), 2500);
    } catch {
      // Handled
    }
  };

  const starterPacksForPlatform = STARTER_PACKS.filter(
    (p) => p.platform === 'both' || p.platform === targetPlatform
  );

  const selectedCount = visibleApps.filter((a) => selectedAppIds.has(a.id)).length;

  const exampleChips = [
    'Windows Clean Install Essentials',
    'Mac Productivity & Window Management',
    'Diagnostic & Hardware Utility Suite',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Install Command Generator"
      subheading="Generate single-line winget (Windows) or Homebrew cask (macOS) install commands from verified package IDs. Zero telemetry, no wrappers."
      inputLabel="Custom Filter or Command Note"
      inputPlaceholder="Search installed packages or configure starter presets..."
      examplePrompt="Generate Windows setup command for PowerToys, 7-Zip, Everything, and ShareX"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({ result: generatedCommand })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Platform Switcher & Format Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#9aaccb] font-semibold mr-1">
                Target OS:
              </span>
              <div className="flex rounded-xl bg-[#050a14] p-1 border border-[rgba(143,163,192,0.16)]">
                <button
                  type="button"
                  onClick={() => {
                    setTargetPlatform('windows');
                    handleApplyStarterPack('windows-essentials');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-ring ${
                    targetPlatform === 'windows'
                      ? 'bg-[#6c7dff] text-white shadow-sm font-bold'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Windows (winget)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetPlatform('mac');
                    handleApplyStarterPack('mac-essentials');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-ring ${
                    targetPlatform === 'mac'
                      ? 'bg-[#6c7dff] text-white shadow-sm font-bold'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>macOS (Homebrew)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-mono text-[#9aaccb]">Format:</span>
              <div className="flex rounded-xl bg-[#050a14] p-1 border border-[rgba(143,163,192,0.16)] text-xs">
                <button
                  type="button"
                  onClick={() => setFormatMode('oneline')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all focus-ring ${
                    formatMode === 'oneline'
                      ? 'bg-[#101c33] text-[#6c7dff] font-bold border border-[rgba(108,125,255,0.3)]'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  One-liner
                </button>
                <button
                  type="button"
                  onClick={() => setFormatMode('multiline')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all focus-ring ${
                    formatMode === 'multiline'
                      ? 'bg-[#101c33] text-[#6c7dff] font-bold border border-[rgba(108,125,255,0.3)]'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  {targetPlatform === 'windows' ? '.bat script' : 'Shell script'}
                </button>
              </div>
            </div>
          </div>

          {/* Starter Packs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9aaccb] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6c7dff]" />
                <span>Starter Pack Presets</span>
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[#6c7dff] hover:underline focus-ring rounded"
                >
                  Select all
                </button>
                <span className="text-[#9aaccb]/40">·</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[#9aaccb] hover:text-[#f2f7ff] focus-ring rounded"
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {starterPacksForPlatform.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => handleApplyStarterPack(pack.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                    activeStarterPack === pack.id
                      ? 'bg-[#6c7dff] text-white border-[#6c7dff] shadow-sm'
                      : 'bg-[#0a1424] text-[#9aaccb] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff] hover:border-[rgba(108,125,255,0.3)]'
                  }`}
                >
                  {pack.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist by Category */}
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs border-b border-[rgba(143,163,192,0.12)] pb-2">
              <span className="font-mono text-[#9aaccb] uppercase tracking-wider">
                Available Packages ({visibleApps.length})
              </span>
              <span className="font-mono text-[#6c7dff] font-bold">
                {selectedCount} selected
              </span>
            </div>

            {Object.entries(categories).map(([categoryName, apps]) => {
              if (apps.length === 0) return null;
              return (
                <div key={categoryName} className="space-y-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#9aaccb] font-bold flex items-center gap-2">
                    <Filter className="w-3 h-3 text-[#6c7dff]" />
                    <span>{categoryName}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {apps.map((app) => {
                      const isChecked = selectedAppIds.has(app.id);
                      const packageId = targetPlatform === 'windows' ? app.wingetId : app.brewName;

                      return (
                        <label
                          key={app.id}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            isChecked
                              ? 'bg-[#101c33] border-[rgba(108,125,255,0.4)] shadow-sm'
                              : 'bg-[#0a1424] border-[rgba(143,163,192,0.12)] hover:border-[rgba(143,163,192,0.25)]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleApp(app.id)}
                            className="mt-1 w-4 h-4 rounded text-[#6c7dff] focus:ring-[#6c7dff] border-gray-600 bg-gray-900"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-sm font-bold text-[#f2f7ff]">
                                {app.name}
                              </span>
                              {packageId && (
                                <span className="text-[10px] font-mono text-[#6c7dff] bg-[#050a14] px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                  {packageId}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#9aaccb] line-clamp-1 mt-0.5">
                              {app.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Generated Code Output Box */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>Generated Command</span>
              </span>

              <button
                type="button"
                onClick={handleCopyCommand}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101c33] border border-[rgba(108,125,255,0.3)] text-xs font-semibold text-[#f2f7ff] hover:border-[#6c7dff] transition-colors focus-ring"
              >
                {copiedMode === 'script' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                    <span className="text-[#34e0a1]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#6c7dff]" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.18)] p-4 font-mono text-xs text-[#f2f7ff] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {generatedCommand}
            </div>

            {/* Mandatory Safety Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#101c33] border border-[rgba(255,184,64,0.3)] text-xs text-[#ffb840]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Read it before you run it: </span>
                <span>
                  Always review commands prior to running them in PowerShell or Terminal. Ensure you trust each package ID from the official Windows Package Manager (winget) repository or Homebrew formula registry.
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The Install Command Generator creates transparent, copy-ready terminal setup commands for fresh computer setups or routine maintenance. Rather than downloading separate <code>.exe</code> or <code>.dmg</code> installers from multiple websites, the tool compiles exact commands using the native package managers: Windows Package Manager (<code>winget</code>) on Windows 10/11 and Homebrew (<code>brew</code>) on macOS.
          </p>
          <p>
            Every package ID is directly linked to its verified open-source repository or official developer release. No intermediary download servers, telemetry wrappers, or third-party installer bundles are involved. The resulting script runs locally inside your official shell.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Select your operating system',
          text: 'Toggle between Windows (winget) and macOS (Homebrew Cask) to load the verified package IDs for your platform.',
        },
        {
          step: 'Choose a starter pack or check apps',
          text: 'Click one of our curated presets such as Windows Essentials or Mac Essentials, or manually check individual utilities.',
        },
        {
          step: 'Pick your preferred format',
          text: 'Select "One-liner" for quick pasting into Terminal/PowerShell, or ".bat/Shell script" to save as an automated setup file.',
        },
      ]}
      workedExample={{
        title: 'Example: Setting up a Clean Windows 11 Laptop',
        scenario: 'A developer needs PowerToys, 7-Zip, Everything, and ShareX on a newly formatted Windows 11 machine.',
        output: `winget install --id Microsoft.PowerToys -e --id 7zip.7zip -e --id voidtools.Everything -e --id ShareX.ShareX -e --accept-source-agreements --accept-package-agreements

# How it executes:
1. Opens Windows PowerShell as Administrator.
2. Resolves each exact ID against the Microsoft community repository.
3. Automatically accepts publisher package agreements.
4. Downloads SHA-256 verified installers directly from vendor CDN servers.`,
      }}
      tips={[
        'Run PowerShell or Terminal with standard permissions when possible: Winget prompts for UAC elevation only for system-level services.',
        'Use the -e flag in winget: This enforces exact package ID matching and prevents unexpected installations of similarly named forks.',
        'Homebrew cask updates cleanly: Run "brew upgrade --cask" anytime to update all installed GUI apps simultaneously.',
        'Verify package IDs before corporate deployments: Review internal IT compliance lists before bulk-installing utilities.',
      ]}
      faq={[
        {
          question: 'What is winget and is it pre-installed on Windows?',
          answer: 'Winget is Microsoft’s official Windows Package Manager. It is pre-installed on all modern versions of Windows 11 and Windows 10 (version 1809 and newer) via the App Installer bundle from the Microsoft Store.',
        },
        {
          question: 'Do I need administrator privileges to run these install commands?',
          answer: 'Most single-user utilities install cleanly under user space. However, tools that install system drivers or shell extensions (like 7-Zip context menus or PowerToys) will trigger a standard Windows UAC prompt for elevation.',
        },
        {
          question: 'How do I install Homebrew on a brand new Mac?',
          answer: 'Open the Terminal app in macOS and run the official command from brew.sh: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)". Once installed, your brew cask commands will work immediately.',
        },
        {
          question: 'Are these installations safe from unwanted bundled software?',
          answer: 'Yes. Package manager manifests pull official binaries straight from verified GitHub releases and publisher CDNs without the adware or browser toolbars commonly found on aggregator download sites.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
