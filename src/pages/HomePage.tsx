import React, { useState } from 'react';
import { PageId, PersonaType } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { EcosystemSwitcher } from '../components/EcosystemSwitcher';
import { DiagnosticSimulator } from '../components/DiagnosticSimulator';
import { AuthoritativeReferences } from '../components/AuthoritativeReferences';
import { haptics } from '../utils/haptics';
import heroStudioImg from '../assets/images/hero_apple_ecosystem_studio_1790175476500.jpg';
import featureShortcutsImg from '../assets/images/feature_shortcuts_automation_1790175491181.jpg';
import featureContinuityImg from '../assets/images/feature_continuity_mirroring_1790175517420.jpg';
import { 
  Wand2, 
  Cpu, 
  Wrench, 
  BookOpen, 
  ArrowRight, 
  Search, 
  ChevronRight, 
  Laptop, 
  Smartphone, 
  Check, 
  ExternalLink
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('creators');

  const personas: { id: PersonaType; label: string }[] = [
    { id: 'creators', label: 'Content Creators' },
    { id: 'developers', label: 'Software Engineers' },
    { id: 'freelancers', label: 'Independent Pros' },
    { id: 'students', label: 'Students & Research' },
    { id: 'beginners', label: 'Daily Workflows' },
  ];

  const filteredWorkflows = WORKFLOWS_DATA.filter((wf) => wf.persona === selectedPersona);

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* Hero Section — Apple Studio Aesthetic */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-7">
        
        {/* Apple Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.035em] text-[#F5F5F7] leading-[1.08] max-w-4xl mx-auto text-balance">
          Unleash Your Apple Hardware. <br />
          <span className="text-[#86868B]">
            Automate Without the Friction.
          </span>
        </h1>

        {/* Crisp Subhead */}
        <p className="text-base sm:text-xl text-[#86868B] max-w-2xl mx-auto font-normal leading-relaxed tracking-tight text-balance">
          Synthesize custom Apple Shortcuts, configure macOS Sequoia Continuity, and eliminate multi-device latency across Mac, iPhone, and iPad.
        </p>

        {/* Primary Single-Line CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="hero-generator-cta"
            onClick={() => {
              haptics.playTap();
              onNavigate('generator');
            }}
            className="px-6 py-3 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-medium tracking-tight shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Custom Shortcuts</span>
          </button>
          
          <button
            id="hero-compatibility-cta"
            onClick={() => {
              haptics.playTap();
              onNavigate('compatibility');
            }}
            className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-[#F5F5F7] text-sm font-medium tracking-tight transition-all cursor-pointer flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-[#2997FF]" />
            <span>Hardware Compatibility Matrix</span>
          </button>
        </div>

        {/* Unboxed Metadata Trust Bar (Anti-Pill Rule) */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#86868B] font-normal">
          <span>macOS Sequoia 15.2</span>
          <span aria-hidden="true">·</span>
          <span>iOS 18.2 Ready</span>
          <span aria-hidden="true">·</span>
          <span>Zero-Credential Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Local Client Execution</span>
        </div>

        {/* Apple Hardware Studio Showcase (Generated High-Fidelity Asset) */}
        <div className="pt-6 max-w-5xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.10] shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#0C0D10] group">
            <picture>
              <img 
                src={heroStudioImg || "/images/hero_apple_ecosystem_studio.jpg"} 
                alt="Apple Mac, iPhone, and iPad ecosystem workspace on dark minimal desk" 
                className="w-full h-auto aspect-16/9 object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-500"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/images/hero_apple_ecosystem_studio.jpg')) {
                    target.src = '/images/hero_apple_ecosystem_studio.jpg';
                  }
                }}
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            
            {/* Overlay Bar inside hardware showcase */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] backdrop-blur-md bg-black/40">
              <div className="text-left space-y-1">
                <span className="text-[11px] text-[#2997FF] font-medium tracking-wider uppercase">Unified Device Mesh</span>
                <p className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  Seamless Continuity Camera · Desk View · iPhone Mirroring
                </p>
              </div>
              <button
                onClick={() => {
                  haptics.playTap();
                  onOpenSearch();
                }}
                className="px-4 py-2 rounded-lg bg-white/[0.12] hover:bg-white/[0.20] text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#2997FF]" />
                <span>Search Recipes (⌘K)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7] mt-1">
              Built specifically for the Apple platform.
            </h2>
          </div>
          <p className="text-xs text-[#86868B] max-w-md">
            Engineered with deep native hooks into Shortcuts, AppleScript, Shell, and Core Continuity APIs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1 (Span 2 cols): Precision Shortcuts Engine */}
          <div 
            onClick={() => {
              haptics.playTap();
              onNavigate('generator');
            }}
            className="md:col-span-2 rounded-2xl sm:rounded-3xl border border-white/[0.08] hover:border-white/[0.20] bg-[#0E0F13]/80 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#86868B]">
                <span>01. Automation Engine</span>
                <span className="text-[#2997FF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open Generator <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Synthesize Production-Grade Apple Shortcuts
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed max-w-xl">
                Generate tailored automations for your specific combination of macOS and iOS. Download ready-to-run `.shortcut` payloads, AppleScript snippets, and shell hooks with zero configuration overhead.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/[0.08] shadow-inner">
              <picture>
                <img 
                  src={featureShortcutsImg || "/images/feature_shortcuts_automation.jpg"} 
                  alt="Apple Shortcuts automation canvas in macOS Sequoia" 
                  className="w-full h-auto aspect-16/9 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/feature_shortcuts_automation.jpg')) {
                      target.src = '/images/feature_shortcuts_automation.jpg';
                    }
                  }}
                />
              </picture>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#86868B]">
              <span>120+ Verified Recipes</span>
              <span aria-hidden="true">·</span>
              <span>Siri Voice Triggers</span>
              <span aria-hidden="true">·</span>
              <span>AppleScript & Shell</span>
              <span aria-hidden="true">·</span>
              <span>Raycast Scripts</span>
            </div>
          </div>

          {/* Bento Card 2 (Span 1 col): Continuity & iPhone Mirroring */}
          <div 
            onClick={() => {
              haptics.playTap();
              onNavigate('troubleshooting');
            }}
            className="md:col-span-1 rounded-2xl sm:rounded-3xl border border-white/[0.08] hover:border-white/[0.20] bg-[#0E0F13]/80 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#86868B]">
                <span>02. Continuity Isolation</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#2997FF] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                iPhone Mirroring & Desk View
              </h3>
              <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
                Step-by-step diagnostic trees to resolve AWDL dropouts, Universal Clipboard delays, and camera handshake failures without rebooting.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/[0.08]">
              <picture>
                <img 
                  src={featureContinuityImg || "/images/feature_continuity_mirroring.jpg"} 
                  alt="iPhone Mirroring and Continuity Camera Desk View in macOS Sequoia" 
                  className="w-full h-auto aspect-4/3 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/feature_continuity_mirroring.jpg')) {
                      target.src = '/images/feature_continuity_mirroring.jpg';
                    }
                  }}
                />
              </picture>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#86868B]">
              <span>Resolution Guides</span>
              <span className="text-[#2997FF]">Sequoia 15.2</span>
            </div>
          </div>

        </div>
      </section>

      {/* Hardware Profile & Live Diagnostic Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-white/[0.08] pb-4">
          <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">Hardware Intelligence</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7] mt-1">
            Simulate your setup. Run real-time diagnostics.
          </h2>
        </div>

        <EcosystemSwitcher />
        <DiagnosticSimulator />
      </section>

      {/* Tailored Workflow Blueprints (Clean Editorial Tabs, Zero Pills) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">Curated Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7] mt-1">
              Workflows tuned for your role.
            </h2>
          </div>

          {/* Clean Segmented Text Buttons (No Candy Badges) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => {
                  haptics.playTap();
                  setSelectedPersona(persona.id);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs tracking-tight transition-all cursor-pointer ${
                  selectedPersona === persona.id
                    ? 'bg-white text-black font-medium shadow-sm'
                    : 'text-[#86868B] hover:text-white'
                }`}
              >
                {persona.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => {
                haptics.playTap();
                onNavigate('workflow-detail', wf.id);
              }}
              className="rounded-2xl border border-white/[0.08] hover:border-white/[0.22] bg-[#0E0F13]/80 backdrop-blur-md p-6 flex flex-col justify-between group cursor-pointer transition-all space-y-4"
            >
              <div className="space-y-2.5">
                {/* Unboxed Metadata (Zero Pills) */}
                <div className="text-[11px] text-[#86868B] flex items-center gap-2 font-normal">
                  <span className="text-[#2997FF]">{wf.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{wf.setupTimeMinutes} min setup</span>
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-[#F5F5F7] group-hover:text-[#2997FF] transition-colors line-clamp-2">
                  {wf.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#86868B] line-clamp-3 leading-relaxed">
                  {wf.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#86868B]">
                <span>View Full Recipe</span>
                <ChevronRight className="w-4 h-4 text-[#2997FF] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Authoritative Reference Network & High-Quality Citation Backlinks */}
      <AuthoritativeReferences />
    </div>
  );
};
