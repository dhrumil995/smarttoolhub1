import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, Globe, BookOpen, Code, FileText, Sparkles } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface ReferenceLink {
  title: string;
  source: string;
  url: string;
  domainAuthority: string;
  category: 'Apple Official' | 'Architecture' | 'Open Source' | 'Standards';
  description: string;
}

const AUTHORITATIVE_REFERENCES: ReferenceLink[] = [
  {
    title: 'Apple Shortcuts & App Intents Documentation',
    source: 'Apple Developer',
    url: 'https://developer.apple.com/documentation/appintents',
    domainAuthority: 'Official Apple Documentation',
    category: 'Apple Official',
    description: 'Guidelines and action references for building automated shortcuts and voice commands in iOS and macOS.',
  },
  {
    title: 'Apple Platform Security Overview',
    source: 'Apple Support',
    url: 'https://support.apple.com/guide/security/welcome/web',
    domainAuthority: 'Official Apple Documentation',
    category: 'Architecture',
    description: 'Privacy rules and on-device protection governing Universal Clipboard, AirDrop, and wireless sharing.',
  },
  {
    title: 'How to Connect Devices with Apple Continuity',
    source: 'Apple Support',
    url: 'https://support.apple.com/guide/mac-help/use-continuity-to-connect-apple-devices-mchl407037be/mac',
    domainAuthority: 'Official Apple Support',
    category: 'Apple Official',
    description: 'Requirements and setup steps for iPhone Mirroring, Continuity Camera, and AirDrop.',
  },
  {
    title: 'Mac Automation & AppleScript Scripting Guide',
    source: 'Apple Developer Archives',
    url: 'https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/',
    domainAuthority: 'Official Apple Archives',
    category: 'Architecture',
    description: 'Scripting basics for Automator, Apple Events, and command-line automation on Mac.',
  },
  {
    title: 'Community Apple Shortcuts Catalog',
    source: 'GitHub Community',
    url: 'https://github.com/topics/apple-shortcuts',
    domainAuthority: 'Open Source Community',
    category: 'Open Source',
    description: 'Popular open-source Apple Shortcuts created and shared by independent developers.',
  },
  {
    title: 'Bonjour Wireless Networking Standards',
    source: 'IETF Standards',
    url: 'https://datatracker.ietf.org/doc/html/rfc6762',
    domainAuthority: 'Internet Standard (RFC 6762)',
    category: 'Standards',
    description: 'Networking standard powering zero-configuration wireless device discovery across local networks.',
  },
];

export const AuthoritativeReferences: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'html'>('markdown');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);

  const markdownSnippet = `[SmartToolHub — Apple Shortcuts & Web Utility Suite](https://smarttoolhub.net/)`;
  const htmlSnippet = `<a href="https://smarttoolhub.net/" title="SmartToolHub Apple Shortcuts and Web Utility Platform" rel="noopener">SmartToolHub Apple Automation Suite</a>`;

  const handleCopy = (text: string, format: string) => {
    haptics.playTap();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFormat(format);
      haptics.playSuccess();
      setTimeout(() => setCopiedFormat(null), 2000);
    });
  };

  const displayedReferences = mobileExpanded 
    ? AUTHORITATIVE_REFERENCES 
    : AUTHORITATIVE_REFERENCES.slice(0, 3);

  return (
    <section 
      id="authoritative-references"
      aria-label="Authoritative Reference Network and Citation Standards"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">Reference Sources</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-xs text-slate-400 font-medium">Official Documentation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7] mt-1">
            Documentation &amp; Community Resources
          </h2>
        </div>
        <p className="text-xs text-[#86868B] max-w-md">
          All shortcuts, guides, and diagnostic steps reference official Apple documentation and open-source standards.
        </p>
      </div>

      {/* Grid of High-Authority Tier-1 Backlinks & Citations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedReferences.map((ref, idx) => (
          <a
            key={idx}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptics.playTap()}
            className="rounded-2xl border border-white/[0.08] hover:border-white/[0.22] bg-[#0E0F13]/85 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between group transition-all space-y-4 hover:shadow-lg"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#2997FF] font-medium tracking-wide uppercase">
                  {ref.source}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {ref.domainAuthority}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#2997FF] transition-colors flex items-start justify-between gap-2">
                <span>{ref.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#2997FF] shrink-0 mt-1 transition-colors" />
              </h3>

              <p className="text-xs text-[#86868B] leading-relaxed">
                {ref.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#86868B]">
              <span className="text-zinc-400 font-mono truncate max-w-[200px]">{ref.url.replace(/^https?:\/\//, '')}</span>
              <span className="text-[#2997FF] font-medium group-hover:underline">Verify Source →</span>
            </div>
          </a>
        ))}
      </div>

      {/* Mobile Toggle to prevent endless scrolling */}
      {!mobileExpanded && (
        <div className="text-center pt-1 md:hidden">
          <button
            onClick={() => {
              haptics.playTap();
              setMobileExpanded(true);
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.10] text-xs font-medium text-[#2997FF] transition-all cursor-pointer"
          >
            Show All {AUTHORITATIVE_REFERENCES.length} Authoritative Citations ↓
          </button>
        </div>
      )}

      {/* Reciprocal Backlink & Citation Embed Hub (Empowers Bloggers & Engineers to Link Back) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F13]/90 backdrop-blur-xl p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2997FF]" />
              <h3 className="text-base font-semibold text-white tracking-tight">
                Cite or Embed SmartToolHub in Your Guide
              </h3>
            </div>
            <p className="text-xs text-[#86868B] mt-0.5">
              Writing an Apple ecosystem tutorial or open-source README? Use these verified backlinks and citation formats.
            </p>
          </div>

          {/* Format Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.08] rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'markdown' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Markdown (GitHub)
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'html' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              HTML (Web)
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06] font-mono text-xs text-zinc-300 flex items-center justify-between gap-4 overflow-x-auto">
          <code className="text-[#68B4FF] truncate select-all">
            {activeTab === 'markdown' ? markdownSnippet : htmlSnippet}
          </code>

          <button
            onClick={() => handleCopy(activeTab === 'markdown' ? markdownSnippet : htmlSnippet, activeTab)}
            className="px-3 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {copiedFormat === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                <span>Copy Link Snippet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
