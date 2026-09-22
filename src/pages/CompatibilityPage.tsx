import React, { useState } from 'react';
import { PageId } from '../types';
import { COMPATIBILITY_FEATURES, APPLE_DEVICES_CATALOG, AppleDeviceCatalogItem } from '../data/compatibility';
import { 
  Cpu, 
  Check, 
  X, 
  AlertTriangle, 
  ExternalLink, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Wifi, 
  Bluetooth, 
  Lock, 
  Sparkles,
  Calendar,
  Search
} from 'lucide-react';

interface CompatibilityPageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const CompatibilityPage: React.FC<CompatibilityPageProps> = ({ onNavigate }) => {
  const [selectedMacId, setSelectedMacId] = useState<string>('mac-m3-air');
  const [selectedPhoneId, setSelectedPhoneId] = useState<string>('iphone-16-pro');
  const [selectedPadId, setSelectedPadId] = useState<string>('ipad-m2-air');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || '';
    }
    return '';
  });

  const macs = APPLE_DEVICES_CATALOG.filter((d) => d.type === 'mac');
  const iphones = APPLE_DEVICES_CATALOG.filter((d) => d.type === 'iphone');
  const ipads = APPLE_DEVICES_CATALOG.filter((d) => d.type === 'ipad');

  const activeMac = macs.find((d) => d.id === selectedMacId) || macs[0];
  const activePhone = iphones.find((d) => d.id === selectedPhoneId) || iphones[0];
  const activePad = ipads.find((d) => d.id === selectedPadId) || ipads[0];

  const categories = ['all', 'Continuity', 'Audio & Camera', 'Display & Input', 'Ecosystem Intelligence'];

  const filteredFeatures = COMPATIBILITY_FEATURES.filter((feat) => {
    const matchesCategory = categoryFilter === 'all' || feat.category === categoryFilter;
    const matchesSearch = searchQuery
      ? feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.hardwareChips.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Calculate live compatibility for active device combination
  const checkCompatibility = (featureId: string) => {
    if (featureId === 'feat-iphone-mirroring') {
      const macOk = activeMac.supportsIphoneMirroring;
      const phoneOk = activePhone.supportsIphoneMirroring;
      if (macOk && phoneOk) return { status: 'supported', notes: 'Fully supported between selected Mac and iPhone.' };
      if (!macOk) return { status: 'unsupported', notes: `${activeMac.name} lacks T2 or Apple Silicon required for iPhone Mirroring.` };
      return { status: 'unsupported', notes: 'Selected iPhone does not support iOS 18.' };
    }

    if (featureId === 'feat-continuity-camera') {
      const macOk = activeMac.supportsContinuityCamera;
      const phoneOk = activePhone.supportsContinuityCamera;
      if (macOk && phoneOk) return { status: 'supported', notes: 'Wireless and hardwired USB webcam streaming supported.' };
      return { status: 'unsupported', notes: 'Requires macOS 13+ and iOS 16+ compatible hardware.' };
    }

    if (featureId === 'feat-universal-control') {
      const macOk = activeMac.supportsUniversalControl;
      const padOk = activePad.supportsUniversalControl;
      if (macOk && padOk) return { status: 'supported', notes: 'Seamless cursor and keyboard handoff active across Mac and iPad.' };
      return { status: 'unsupported', notes: 'Requires compatible iPadOS 15.4+ and macOS 12.3+ hardware.' };
    }

    if (featureId === 'feat-sidecar') {
      const macOk = activeMac.supportsSidecar;
      const padOk = activePad.supportsSidecar;
      if (macOk && padOk) return { status: 'supported', notes: 'Hardware-accelerated HEVC screen extension supported.' };
      return { status: 'unsupported', notes: 'Hardware video encoder incompatibility on selected iPad or older Mac.' };
    }

    if (featureId === 'feat-apple-intelligence') {
      const macOk = activeMac.supportsAppleIntelligence;
      const phoneOk = activePhone.supportsAppleIntelligence;
      const padOk = activePad.supportsAppleIntelligence;
      if (macOk && (phoneOk || padOk)) {
        return { status: 'supported', notes: 'On-device Apple Silicon Neural Engine ready across your primary hardware.' };
      }
      if (!macOk && !phoneOk && !padOk) {
        return { status: 'unsupported', notes: 'None of your selected devices have M1+ or A17 Pro/A18 chips required for Apple Intelligence.' };
      }
      return { status: 'partial', notes: `Supported on ${[macOk && activeMac.name, phoneOk && activePhone.name, padOk && activePad.name].filter(Boolean).join(', ')}.` };
    }

    return { status: 'supported', notes: 'Universally supported across modern Apple hardware.' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header — Apple Style */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-normal text-[#A259FF] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <Cpu className="w-3.5 h-3.5" />
          <span>Hardware & Operating System Verification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-tight">
          Apple Device Compatibility Checker
        </h1>
        <p className="text-sm sm:text-base text-[#86868B] leading-relaxed font-normal">
          Select your active hardware to inspect real-time Continuity feature availability, minimum operating systems, and exact networking prerequisites.
        </p>
      </div>

      {/* Interactive Device Selector Bento Card */}
      <div className="glass-card p-7 sm:p-9 rounded-[28px] border border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A259FF]" />
            <span>Select Your Active Hardware Configuration</span>
          </h2>
          <span className="text-xs text-[#86868B] font-normal">Live recalculation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Mac Selector */}
          <div className="space-y-2">
            <label className="text-xs text-[#86868B] flex items-center gap-1.5 font-normal">
              <Laptop className="w-4 h-4 text-[#2997FF]" />
              <span className="text-[#F5F5F7]">Mac Computer</span>
            </label>
            <select
              value={selectedMacId}
              onChange={(e) => setSelectedMacId(e.target.value)}
              className="w-full p-3 rounded-2xl glass-input text-xs text-white focus:outline-none"
            >
              {macs.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#12141A] text-white">{m.name}</option>
              ))}
            </select>
            <div className="text-[11px] text-[#86868B] flex justify-between px-1 font-mono">
              <span>Chip: {activeMac.chip}</span>
              <span>OS: {activeMac.latestOS}</span>
            </div>
          </div>

          {/* iPhone Selector */}
          <div className="space-y-2">
            <label className="text-xs text-[#86868B] flex items-center gap-1.5 font-normal">
              <Smartphone className="w-4 h-4 text-[#2997FF]" />
              <span className="text-[#F5F5F7]">iPhone</span>
            </label>
            <select
              value={selectedPhoneId}
              onChange={(e) => setSelectedPhoneId(e.target.value)}
              className="w-full p-3 rounded-2xl glass-input text-xs text-white focus:outline-none"
            >
              {iphones.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#12141A] text-white">{p.name}</option>
              ))}
            </select>
            <div className="text-[11px] text-[#86868B] flex justify-between px-1 font-mono">
              <span>Chip: {activePhone.chip}</span>
              <span>OS: {activePhone.latestOS}</span>
            </div>
          </div>

          {/* iPad Selector */}
          <div className="space-y-2">
            <label className="text-xs text-[#86868B] flex items-center gap-1.5 font-normal">
              <Tablet className="w-4 h-4 text-[#2997FF]" />
              <span className="text-[#F5F5F7]">iPad</span>
            </label>
            <select
              value={selectedPadId}
              onChange={(e) => setSelectedPadId(e.target.value)}
              className="w-full p-3 rounded-2xl glass-input text-xs text-white focus:outline-none"
            >
              {ipads.map((pad) => (
                <option key={pad.id} value={pad.id} className="bg-[#12141A] text-white">{pad.name}</option>
              ))}
            </select>
            <div className="text-[11px] text-[#888888] flex justify-between px-1 font-mono">
              <span>Chip: {activePad.chip}</span>
              <span>OS: {activePad.latestOS}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 glass-panel rounded-xl w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white/[0.14] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/[0.18]'
                  : 'text-[#888888] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {cat === 'all' ? 'All Continuity Features' : cat}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter features..."
            aria-label="Filter continuity features"
            className="w-full pl-8.5 pr-3 py-2 rounded-xl glass-input text-xs text-white placeholder-[#86868B] focus:outline-none"
          />
        </div>
      </div>

      {/* Feature Matrix Cards */}
      <div className="space-y-4">
        {filteredFeatures.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl space-y-3">
            <p className="text-sm font-semibold text-white">No continuity features match your filter</p>
            <p className="text-xs text-[#86868B]">Try clearing your search query or selecting "All Continuity Features".</p>
            <button
              onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
              className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white cursor-pointer inline-block"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFeatures.map((feat) => {
          const comp = checkCompatibility(feat.id);
          const isSupported = comp.status === 'supported';
          const isPartial = comp.status === 'partial';

          return (
            <div
              key={feat.id}
              className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4"
            >
              {/* Top Row: Name + Compatibility Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {feat.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {feat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#A3A3A3] mt-1">
                    {feat.description}
                  </p>
                </div>

                {/* Compatibility Outcome Pill & Diagnostics */}
                <div className="shrink-0 flex flex-col sm:items-end gap-1">
                  {isSupported && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready on your setup</span>
                    </div>
                  )}
                  {isPartial && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Partial Device Support</span>
                    </div>
                  )}
                  {!isSupported && !isPartial && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                      <X className="w-3.5 h-3.5" />
                      <span>Incompatible with selected model</span>
                    </div>
                  )}
                  {comp.notes && (
                    <span className="text-[11px] text-[#86868B] max-w-sm text-left sm:text-right font-mono">
                      {comp.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Hardware & OS Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#161616] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Mac Requirement</span>
                  <span className="text-white font-medium">{feat.requiredMac}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#161616] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">iOS Requirement</span>
                  <span className="text-white font-medium">{feat.requiredIos}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#161616] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">iPadOS Requirement</span>
                  <span className="text-white font-medium">{feat.requiredIpad}</span>
                </div>
              </div>

              {/* Prerequisites & Network Conditions */}
              <div className="p-3.5 rounded-xl bg-[#161616] border border-white/[0.06] space-y-2 text-xs">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mandatory Network & Connectivity Preconditions:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#A3A3A3]">
                  {feat.networkPreconditions.map((cond, cidx) => (
                    <div key={cidx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 text-[#888888] text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat.appleAccountRules}</span>
                </div>
              </div>

              {/* Diagnostic Notes & Official Documentation Citation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-[#888888]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#666666]" />
                  <span>Last reviewed by SmartToolHub: <strong>{feat.lastReviewedDate}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  {feat.troubleshootSlug && (
                    <button
                      onClick={() => onNavigate('troubleshooting')}
                      className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                    >
                      Troubleshoot this feature →
                    </button>
                  )}
                  <a
                    href={feat.officialSupportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    <span>Official Apple Support Guide</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};
