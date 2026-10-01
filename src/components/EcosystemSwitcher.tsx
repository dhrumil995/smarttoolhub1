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
    <div className="ios-card-static p-5 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/12 pb-4">
        <div className="space-y-0.5">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Active Setup</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Select Your Hardware Configuration
          </h3>
        </div>
        <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
          <span>Continuity Rating</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-900 dark:text-white font-semibold tabular-nums">{selectedPreset.continuityScore}%</span>
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
                  ? 'bg-indigo-500/10 border-indigo-500/50 text-slate-900 dark:text-white shadow-[0_6px_18px_rgba(99,102,241,0.18),inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                  : 'glass-panel text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-zinc-300'}>{p.name}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-500 truncate mt-1">
                {p.mac.split('(')[0].trim()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Hardware Spec Row (Clean Unboxed Typography) */}
      <div className="p-4 rounded-xl glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 dark:text-zinc-400">
          <span className="text-slate-900 dark:text-white font-semibold">{selectedPreset.mac}</span>
          <span aria-hidden="true">·</span>
          <span>{selectedPreset.phone}</span>
          {selectedPreset.tablet && (
            <>
              <span aria-hidden="true">·</span>
              <span>{selectedPreset.tablet}</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-zinc-400">
          {selectedPreset.supportedFeatures.map((feat, idx) => (
            <React.Fragment key={idx}>
              <span className="text-slate-700 dark:text-zinc-300 font-normal">{feat}</span>
              {idx < selectedPreset.supportedFeatures.length - 1 && (
                <span aria-hidden="true" className="text-slate-400 dark:text-zinc-600">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
