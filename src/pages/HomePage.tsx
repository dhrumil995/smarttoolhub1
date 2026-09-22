import React, { useState } from 'react';
import { PageId, PersonaType } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { COMPATIBILITY_FEATURES } from '../data/compatibility';
import { 
  Wand2, 
  Cpu, 
  Wrench, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Layers, 
  Clock, 
  ChevronRight, 
  Laptop, 
  Smartphone, 
  Tablet, 
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('creators');
  const [quickSearch, setQuickSearch] = useState('');

  const personas: { id: PersonaType; label: string; icon: string }[] = [
    { id: 'creators', label: 'Content Creators', icon: '🎨' },
    { id: 'freelancers', label: 'Freelancers', icon: '💼' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'beginners', label: 'Beginners', icon: '🌱' },
    { id: 'developers', label: 'Developers', icon: '⚡' },
  ];

  const filteredWorkflows = WORKFLOWS_DATA.filter((wf) => {
    const matchesPersona = wf.persona === selectedPersona;
    const matchesQuery = quickSearch
      ? wf.title.toLowerCase().includes(quickSearch.toLowerCase()) ||
        wf.summary.toLowerCase().includes(quickSearch.toLowerCase())
      : true;
    return matchesPersona && matchesQuery;
  });

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* Top Ambient Apple Intelligence Rim Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[850px] h-[450px] rounded-full bg-gradient-to-b from-[#0071E3]/20 via-[#A259FF]/10 to-transparent blur-[120px]" />
      </div>

      {/* Hero Section — Apple Product Style */}
      <section className="relative pt-16 sm:pt-24 pb-4 px-4 text-center max-w-5xl mx-auto space-y-7">
        {/* Apple Intelligence Pill Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 shadow-sm shrink-0">
            <picture>
              <source srcSet="/logo-sm.webp" type="image/webp" />
              <img 
                src="/logo.png" 
                alt="SmartToolHub Apple Ecosystem Intelligence" 
                width="20" 
                height="20" 
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover" 
              />
            </picture>
          </div>
          <span className="text-xs font-normal tracking-[-0.01em] text-[#F5F5F7]">
            SmartToolHub • Apple Ecosystem Intelligence
          </span>
          <span className="w-1 h-1 rounded-full bg-[#2997FF]"></span>
          <span className="text-[11px] text-[#2997FF] font-mono font-medium">macOS Sequoia Ready</span>
        </div>

        {/* Large Confident Apple Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[72px] font-semibold tracking-[-0.035em] text-[#F5F5F7] leading-[1.06]">
          Unlock Your Apple Hardware. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#2997FF] via-[#A259FF] to-[#FF578A] bg-clip-text text-transparent">
            Without the Friction.
          </span>
        </h1>

        {/* Apple Subhead */}
        <p className="text-base sm:text-xl md:text-2xl text-[#86868B] max-w-3xl mx-auto font-normal leading-relaxed tracking-[-0.015em]">
          Personalized multi-device workflows, instant Shortcuts generator, exact OS compatibility checks, and step-by-step Continuity troubleshooting for Mac, iPhone, and iPad.
        </p>

        {/* Apple Centered CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
          <button
            id="hero-generator-cta"
            onClick={() => onNavigate('generator')}
            className="apple-btn-primary px-6 py-3 text-sm sm:text-[15px] cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Custom Flow</span>
          </button>
          <button
            id="hero-compatibility-cta"
            onClick={() => onNavigate('compatibility')}
            className="apple-btn-secondary px-6 py-3 text-sm sm:text-[15px] cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-[#A259FF]" />
            <span>Check Device Matrix</span>
          </button>
        </div>

        {/* Apple Frosted Search Bar */}
        <div className="max-w-2xl mx-auto pt-4">
          <div 
            onClick={onOpenSearch}
            className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.10] hover:border-white/[0.22] backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] cursor-pointer transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 text-[#86868B] group-hover:text-[#F5F5F7] transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#2997FF] shrink-0" />
              <span className="text-xs sm:text-sm font-normal tracking-[-0.01em] text-left">
                Search workflows, shortcuts, Sequoia features, or error codes...
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <kbd className="apple-key text-xs hidden sm:inline-flex py-0.5 px-2 bg-white/[0.08] border border-white/[0.12] text-[#86868B]">⌘K</kbd>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Layout — Section-Based Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-8">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2997FF]">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#F5F5F7] mt-1">
            Everything your ecosystem needs.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Interactive Generator Spotlight */}
          <div 
            onClick={() => onNavigate('generator')}
            className="glass-card p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] flex flex-col justify-between cursor-pointer group relative overflow-hidden h-full border border-white/[0.08] hover:border-white/[0.20]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0071E3]/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#0071E3]/15 text-[#68B4FF] border border-[#0071E3]/25 uppercase tracking-wide">
                  Interactive Engine
                </span>
                <span className="text-xs text-[#86868B] flex items-center gap-1 font-normal">
                  <Clock className="w-3.5 h-3.5" /> 60s setup
                </span>
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#F5F5F7] group-hover:text-white transition-colors">
                Personalized Workflow Synthesizer
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed font-normal">
                Enter your exact Mac model, iPhone version, preferred apps, and experience level to receive custom end-to-end guidance with shortcuts.
              </p>
              {/* Mini visual mockup inside Bento */}
              <div className="pt-2 grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] backdrop-blur-md">
                  <Laptop className="w-4 h-4 mx-auto text-[#2997FF] mb-1.5" />
                  <span className="text-[11px] text-[#A1A1A6]">Mac Studio</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] backdrop-blur-md">
                  <Smartphone className="w-4 h-4 mx-auto text-[#2997FF] mb-1.5" />
                  <span className="text-[11px] text-[#A1A1A6]">iPhone 16</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] backdrop-blur-md">
                  <Tablet className="w-4 h-4 mx-auto text-[#2997FF] mb-1.5" />
                  <span className="text-[11px] text-[#A1A1A6]">iPad Pro</span>
                </div>
              </div>
            </div>
            <div className="pt-7 flex items-center gap-2 text-sm font-normal text-[#2997FF] group-hover:text-[#68B4FF]">
              <span>Launch Workflow Generator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>
          </div>

          {/* Card 2: Compatibility Matrix */}
          <div 
            onClick={() => onNavigate('compatibility')}
            className="glass-card p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] flex flex-col justify-between cursor-pointer group h-full border border-white/[0.08] hover:border-white/[0.20]"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#A259FF]/15 border border-[#A259FF]/25 flex items-center justify-center text-[#C084FC]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#F5F5F7] group-hover:text-white transition-colors">
                Hardware Compatibility Matrix
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed font-normal">
                Instantly check chip requirements for iPhone Mirroring, Sidecar, Universal Control, and Apple Intelligence across every release.
              </p>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-xs space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-[#86868B]">
                  <span>iPhone Mirroring</span>
                  <span className="text-emerald-400 font-medium">T2 / Apple Silicon</span>
                </div>
                <div className="flex justify-between text-[#86868B]">
                  <span>Apple Intelligence</span>
                  <span className="text-[#2997FF] font-medium">M1+ / A17 Pro+</span>
                </div>
              </div>
            </div>
            <div className="pt-7 flex items-center justify-between text-sm text-[#86868B]">
              <span>8 Continuity APIs verified</span>
              <ChevronRight className="w-4 h-4 text-[#A259FF] group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>
          </div>

          {/* Card 3: Troubleshooting Wizard */}
          <div 
            onClick={() => onNavigate('troubleshooting')}
            className="glass-card p-7 sm:p-8 rounded-[24px] sm:rounded-[28px] flex flex-col justify-between cursor-pointer group h-full md:col-span-2 lg:col-span-1 border border-white/[0.08] hover:border-white/[0.20]"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#F5F5F7] group-hover:text-white transition-colors">
                Diagnostic Troubleshooting
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed font-normal">
                AirDrop failing? Sidecar black screen? Universal clipboard latency? Step-by-step resolution trees without restarting your machine.
              </p>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-xs space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-[#86868B]">
                  <span>AirDrop Discovery</span>
                  <span className="text-amber-400 font-medium">AWDL Reset</span>
                </div>
                <div className="flex justify-between text-[#86868B]">
                  <span>Clipboard Sync</span>
                  <span className="text-amber-400 font-medium">pboard daemon</span>
                </div>
              </div>
            </div>
            <div className="pt-7 flex items-center justify-between text-sm text-[#86868B]">
              <span>Instant Isolation Guides</span>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>
          </div>

        </div>
      </section>

      {/* Target Audience Persona Filtered Workflows */}
      <section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#2997FF] flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Role-Specific Blueprints</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#F5F5F7]">
              Tailored for how you work.
            </h2>
          </div>

          {/* Apple-Style Segmented Persona Control */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl rounded-full">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs tracking-[-0.01em] transition-all duration-200 cursor-pointer ${
                  selectedPersona === persona.id
                    ? 'bg-white text-black font-medium shadow-[0_2px_8px_rgba(255,255,255,0.2)]'
                    : 'text-[#86868B] hover:text-[#F5F5F7]'
                }`}
              >
                <span>{persona.icon}</span>
                <span>{persona.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Workflow Cards Grid — Apple Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((wf) => (
            <div
              key={wf.id}
              onClick={() => onNavigate('workflow-detail', wf.id)}
              className="glass-card p-6 sm:p-7 rounded-[22px] flex flex-col justify-between cursor-pointer group border border-white/[0.08] hover:border-white/[0.20]"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#0071E3]/15 text-[#68B4FF] border border-[#0071E3]/25">
                    {wf.category}
                  </span>
                  <span className="text-xs text-[#86868B] flex items-center gap-1 font-normal">
                    <Clock className="w-3 h-3" />
                    {wf.setupTimeMinutes} min
                  </span>
                </div>

                <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#F5F5F7] group-hover:text-[#2997FF] transition-colors line-clamp-2">
                  {wf.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#86868B] line-clamp-3 leading-relaxed font-normal">
                  {wf.summary}
                </p>

                {/* Device Badges */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {wf.devicesRequired.map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#A1A1A6]"
                    >
                      {d.device.split('(')[0].trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#86868B]">
                <span className="text-[11px] text-emerald-400/90 font-medium">
                  {wf.isBuiltInOnly ? '100% Native Tools' : 'Hybrid Tools'}
                </span>
                <span className="apple-link text-xs font-normal">
                  <span>View Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 chevron" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('library')}
            className="apple-btn-secondary px-5 py-2.5 text-xs sm:text-sm cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#2997FF]" />
            <span>Browse All {WORKFLOWS_DATA.length}+ Verified Workflows in Library</span>
          </button>
        </div>
      </section>

      {/* Security & Privacy Commitment Banner — Apple Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-static p-8 sm:p-10 rounded-[28px] border border-emerald-500/20 bg-gradient-to-b from-[#06140D]/80 to-[#020704]/90 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(16,185,129,0.15)] space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">
                Zero-Credentials Security Pledge
              </h3>
              <p className="text-xs sm:text-sm text-emerald-400/80 font-normal">
                Your credentials and files stay strictly yours. Period.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed max-w-3xl font-normal">
            SmartToolHub never asks for your Apple ID, iCloud credentials, device passcodes, contacts, location, camera, or microphone. 
            All workflow configurations use Apple's native, peer-to-peer, and end-to-end encrypted protocols. No user inputs are stored in server logs.
          </p>
          <div className="flex flex-wrap gap-5 pt-2 text-xs text-[#86868B]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Apple ID Login Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Third-Party Cloud Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Local Data Purge</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
