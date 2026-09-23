import React, { useState } from 'react';
import { Laptop, Smartphone, Tablet, Check } from 'lucide-react';
import { haptics } from '../utils/haptics';

export interface HardwarePreset {
  id: string;
  name: string;
  mac: string;
  phone: string;
  tablet?: string;
  continuityScore: number;
  supportedFeatures: string[];
}

export const HARDWARE_PRESETS: HardwarePreset[] = [
  {
    id: 'pro-creator',
    name: 'Pro Studio',
    mac: 'MacBook Pro M3 Max (macOS Sequoia)',
    phone: 'iPhone 16 Pro Max (iOS 18)',
    tablet: 'iPad Pro M4',
    continuityScore: 100,
    supportedFeatures: ['iPhone Mirroring', 'Continuity Camera 4K', 'Desk View', 'Universal Control', 'Sidecar 120Hz'],
  },
  {
    id: 'developer-dock',
    name: 'Engineer Dock',
    mac: 'Mac Studio M2 Ultra (macOS Sequoia)',
    phone: 'iPhone 15 Pro (iOS 18)',
    tablet: 'iPad Air M2',
    continuityScore: 98,
    supportedFeatures: ['iPhone Mirroring', 'Universal Control', 'Desk View', 'Universal Clipboard'],
  },
  {
    id: 'student-nomad',
    name: 'Nomad Mobile',
    mac: 'MacBook Air M2 (macOS Sequoia)',
    phone: 'iPhone 14 (iOS 18)',
    tablet: 'iPad mini 6',
    continuityScore: 92,
    supportedFeatures: ['Universal Clipboard', 'AirDrop', 'Handoff Safari', 'Auto Unlock'],
  },
  {
    id: 'entry-apple',
    name: 'Classic Silicon',
    mac: 'Mac mini M1 (macOS 14/15)',
    phone: 'iPhone 13 (iOS 17/18)',
    continuityScore: 86,
    supportedFeatures: ['Universal Clipboard', 'AirDrop', 'Continuity Camera 1080p'],
  }
];

interface EcosystemSwitcherProps {
  activePresetId?: string;
  onSelectPreset?: (preset: HardwarePreset) => void;
}

export const EcosystemSwitcher: React.FC<EcosystemSwitcherProps> = ({ 
  activePresetId = 'pro-creator',
  onSelectPreset 
}) => {
  const [selectedId, setSelectedId] = useState<string>(activePresetId);
  const selectedPreset = HARDWARE_PRESETS.find(p => p.id === selectedId) || HARDWARE_PRESETS[0];

  const handleSelect = (preset: HardwarePreset) => {
    haptics.playSelect();
    setSelectedId(preset.id);
    if (onSelectPreset) {
      onSelectPreset(preset);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F13]/90 backdrop-blur-xl p-6 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="space-y-0.5">
          <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">Active Setup</span>
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Select Your Hardware Configuration
          </h3>
        </div>
        <div className="text-xs text-[#86868B] flex items-center gap-2">
          <span>Continuity Rating</span>
          <span aria-hidden="true">·</span>
          <span className="text-white font-medium tabular-nums">{selectedPreset.continuityScore}%</span>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {HARDWARE_PRESETS.map((p) => {
          const isActive = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border ${
                isActive
                  ? 'bg-white/[0.10] border-white/30 text-white shadow-sm'
                  : 'bg-black/30 border-white/[0.05] text-[#86868B] hover:text-white hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium">
                <span className={isActive ? 'text-white' : 'text-zinc-300'}>{p.name}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-[#2997FF]" />}
              </div>
              <div className="text-[11px] text-zinc-500 truncate mt-1">
                {p.mac.split('(')[0].trim()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Hardware Spec Row (Clean Unboxed Typography) */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#86868B]">
          <span className="text-white font-medium">{selectedPreset.mac}</span>
          <span aria-hidden="true">·</span>
          <span>{selectedPreset.phone}</span>
          {selectedPreset.tablet && (
            <>
              <span aria-hidden="true">·</span>
              <span>{selectedPreset.tablet}</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#86868B]">
          {selectedPreset.supportedFeatures.map((feat, idx) => (
            <React.Fragment key={idx}>
              <span className="text-zinc-300 font-normal">{feat}</span>
              {idx < selectedPreset.supportedFeatures.length - 1 && (
                <span aria-hidden="true" className="text-zinc-600">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
