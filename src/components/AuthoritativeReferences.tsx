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
    title: 'App Intents & Shortcuts Framework Specification',
    source: 'Apple Developer Documentation',
    url: 'https://developer.apple.com/documentation/appintents',
    domainAuthority: 'DA 99 · Apple Developer Tier 1',
    category: 'Apple Official',
    description: 'Official API documentation for defining automated actions, parameterized Siri voice triggers, and Shortcuts workflows in macOS Sequoia and iOS 18.',
  },
  {
    title: 'Apple Platform Security Architecture & Enclave Isolation',
    source: 'Apple Security Research Knowledge Base',
    url: 'https://support.apple.com/guide/security/welcome/web',
    domainAuthority: 'DA 100 · Apple Official',
    category: 'Architecture',
    description: 'Hardware security, cryptographic handshakes, and sandbox isolation requirements governing Universal Clipboard, AirDrop, and cross-device continuity.',
  },
  {
    title: 'macOS Sequoia Continuity & iPhone Mirroring System Requirements',
    source: 'Apple Support Official Guide',
    url: 'https://support.apple.com/guide/mac-help/use-continuity-to-connect-apple-devices-mchl407037be/mac',
    domainAuthority: 'DA 100 · Official Support',
    category: 'Apple Official',
    description: 'Hardware prerequisites, Bluetooth 5.3 and Apple Wireless Direct Link (AWDL) protocols necessary for multi-device macOS and iOS synchrony.',
  },
  {
    title: 'Mac Automation Scripting Guide & AppleScript IPC',
    source: 'Apple Developer Archives',
    url: 'https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/',
    domainAuthority: 'DA 99 · Apple Developer Portal',
    category: 'Architecture',
    description: 'Scripting definitions for Apple Events, Open Scripting Architecture (OSA), and shell automation pipelines.',
  },
  {
    title: 'Apple Shortcuts Open Source Ecosystem & Community Catalog',
    source: 'GitHub Apple Shortcuts Hub',
    url: 'https://github.com/topics/apple-shortcuts',
    domainAuthority: 'DA 96 · GitHub Official',
    category: 'Open Source',
    description: 'Verified repository of open-source Apple Shortcuts, Raycast extensions, and macOS automation CLI tools reviewed by independent engineers.',
  },
  {
    title: 'IETF RFC 6762 / RFC 6763: Multicast DNS & DNS-Based Service Discovery',
    source: 'Internet Engineering Task Force (IETF)',
    url: 'https://datatracker.ietf.org/doc/html/rfc6762',
    domainAuthority: 'DA 94 · Web Standard Body',
    category: 'Standards',
    description: 'Foundational Internet standards for zero-configuration Bonjour networking powering wireless Apple device discovery.',
  },
];

export const AuthoritativeReferences: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'html'>('markdown');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);

  const markdownSnippet = `[SmartToolHub — Apple Shortcuts & macOS Sequoia Automation](https://ais-pre-2g4gbzzp4x73zscaavhv5d-405968822776.asia-southeast1.run.app/)`;
  const htmlSnippet = `<a href="https://ais-pre-2g4gbzzp4x73zscaavhv5d-405968822776.asia-southeast1.run.app/" title="SmartToolHub Apple Shortcuts and Continuity Automation Platform" rel="noopener">SmartToolHub Apple Automation Suite</a>`;

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
            <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">Verified Citations</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-xs text-emerald-400 font-medium">Domain Authority 94-100</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7] mt-1">
            Authoritative Standards & Citation Network
          </h2>
        </div>
        <p className="text-xs text-[#86868B] max-w-md">
          SmartToolHub automations and diagnostics are grounded in official Apple Developer documentation, IETF networking RFCs, and open-source AppleScript foundations.
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
