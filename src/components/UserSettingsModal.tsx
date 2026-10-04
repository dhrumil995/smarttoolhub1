import React, { useState, useEffect } from 'react';
import { useHaptics } from '../utils/useHaptics';
import { HapticIntensity } from '../utils/haptics';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Moon,
  Sun,
  Shield,
  Layers,
  RotateCcw,
  Zap,
  Activity,
  Palette
} from 'lucide-react';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { intensity, setIntensity, playTap, playSuccess } = useHaptics();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [testTriggered, setTestTriggered] = useState(false);
  const [activeTab, setActiveTab] = useState<'haptics' | 'profile' | 'appearance'>('haptics');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLevelSelect = (level: HapticIntensity) => {
    setIntensity(level);
    setTestTriggered(true);
    setTimeout(() => setTestTriggered(false), 800);
  };

  const handleTestPulse = () => {
    playTap();
    setTestTriggered(true);
    setTimeout(() => setTestTriggered(false), 800);
  };

  const handleReset = () => {
    setIntensity('high');
    playSuccess();
    setTestTriggered(true);
    setTimeout(() => setTestTriggered(false), 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card border border-white/20 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] bg-white/95 dark:bg-[#070B14]/95 text-slate-900 dark:text-white flex flex-col"
      >
        {/* Colorful Ambient Glass Rim Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 via-emerald-400 to-rose-500 opacity-90 rounded-t-3xl" />
        
        {/* Ambient Top Glow Orbs inside Modal */}
        <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full rounded-[14px] bg-[#0A0F1D] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2
                id="settings-dialog-title"
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Settings & User Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Configure persistent haptics, sensory feedback, and Apple ecosystem preferences
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200/60 dark:border-white/5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              playTap();
              setActiveTab('haptics');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'haptics'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Haptics & Audio</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-mono font-bold ${
              intensity === 'high' ? 'bg-indigo-400/30 text-white' : intensity === 'low' ? 'bg-cyan-400/30 text-white' : 'bg-slate-400/30 text-slate-200'
            }`}>
              {intensity}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTap();
              setActiveTab('profile');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Apple Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTap();
              setActiveTab('appearance');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'appearance'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance & Glass</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* TAB 1: HAPTICS & AUDIO FEEDBACK */}
          {activeTab === 'haptics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Feature Hero Description */}
              <div className="p-4 rounded-2xl glass-violet border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Persistent Sensory Feedback
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    Apple Taptic Micro-Haptics & Synthesizer
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 max-w-md">
                    Synthesizes physical vibration patterns on iOS/Android and low-latency sine audio clicks via Web Audio API. Persisted in <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[11px]">localStorage</code>.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestPulse}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                      testTriggered
                        ? 'bg-emerald-500 text-white scale-105 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        : 'glass-button-primary text-white shadow-md shadow-indigo-500/30'
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${testTriggered ? 'animate-bounce' : ''}`} />
                    <span>{testTriggered ? 'Pulse Active!' : 'Test Haptic Pulse'}</span>
                  </button>
                </div>
              </div>

              {/* 3-Way Persistent Haptic Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Haptic Intensity Setting
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                    State: <strong className="text-indigo-600 dark:text-indigo-400">{intensity.toUpperCase()}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: HIGH */}
                  <button
                    type="button"
                    onClick={() => handleLevelSelect('high')}
                    className={`relative p-4 rounded-2xl text-left border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 ${
                      intensity === 'high'
                        ? 'glass-violet border-indigo-500/60 shadow-[0_10px_25px_-5px_rgba(99,102,241,0.35)] ring-2 ring-indigo-500/40'
                        : 'bg-slate-100/80 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        intensity === 'high' ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-400'
                      }`}>
                        <Volume2 className="w-5 h-5" />
                      </div>
                      {intensity === 'high' && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>High</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-medium">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-snug">
                        Solid 22ms vibration & rich harmonic Apple micro-clicks.
                      </p>
                    </div>
                  </button>

                  {/* Option 2: LOW */}
                  <button
                    type="button"
                    onClick={() => handleLevelSelect('low')}
                    className={`relative p-4 rounded-2xl text-left border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 ${
                      intensity === 'low'
                        ? 'glass-cyan border-cyan-500/60 shadow-[0_10px_25px_-5px_rgba(6,182,212,0.35)] ring-2 ring-cyan-500/40'
                        : 'bg-slate-100/80 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        intensity === 'low' ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-400'
                      }`}>
                        <Volume2 className="w-4 h-4 opacity-80" />
                      </div>
                      {intensity === 'low' && (
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Low</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-medium">
                          Whisper
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-snug">
                        Subtle 8ms micro-pulse & whisper-quiet audio clicks.
                      </p>
                    </div>
                  </button>

                  {/* Option 3: OFF */}
                  <button
                    type="button"
                    onClick={() => handleLevelSelect('off')}
                    className={`relative p-4 rounded-2xl text-left border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 ${
                      intensity === 'off'
                        ? 'bg-slate-200/80 dark:bg-white/[0.08] border-slate-400 dark:border-white/30 shadow-md ring-2 ring-slate-400/40'
                        : 'bg-slate-100/80 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        intensity === 'off' ? 'bg-slate-600 text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-400'
                      }`}>
                        <VolumeX className="w-4 h-4" />
                      </div>
                      {intensity === 'off' && (
                        <CheckCircle2 className="w-5 h-5 text-slate-500 dark:text-zinc-300" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Off</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-500/20 text-slate-600 dark:text-zinc-400 font-medium">
                          Silent
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-snug">
                        Completely muted. Zero vibration and zero audio feedback.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="p-4 rounded-2xl bg-slate-900/[0.03] dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Where Haptic Feedback is Active</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Navigation & Page Switching (⌘1-6)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Command Search Palette (⌘K)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>AI Shortcut Generator & Copy Prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Diagnostic Simulator & Sync Doctor</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER PROFILE & ECOSYSTEM */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* User Profile Card with Colorful Frosted Ring */}
              <div className="p-5 rounded-2xl glass-card border border-white/20 dark:border-white/10 flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30">
                    <div className="w-full h-full rounded-[14px] bg-[#0E1528] flex items-center justify-center text-white font-bold text-xl tracking-wider">
                      AP
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0F1D] flex items-center justify-center" title="Online & Synced" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      Apple Pro Architect
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                      Tier 1 Pro
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                    aslaliyadhrumil40@gmail.com
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>iCloud Workspace Sync Active • Unlimited Generator Runs</span>
                  </p>
                </div>
              </div>

              {/* Linked Hardware Ecosystem */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Linked Hardware Devices
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl glass-card flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        Mac Studio M3 Ultra
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        macOS Sequoia 15.2
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl glass-card flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        iPhone 16 Pro Max
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        iOS 18.2 Continuity
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl glass-card flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Tablet className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        iPad Pro 13" M4
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Sidecar & Universal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE & GLASS */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Color Mode Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (resolvedTheme !== 'dark') toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                      resolvedTheme === 'dark'
                        ? 'glass-violet border-indigo-500/60 shadow-lg ring-2 ring-indigo-500/30'
                        : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Obsidian Dark
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Deep contrast & glowing neons
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (resolvedTheme !== 'light') toggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                      resolvedTheme === 'light'
                        ? 'glass-cyan border-cyan-500/60 shadow-lg ring-2 ring-cyan-500/30'
                        : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Pure Studio Light
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Bright frosted paper aesthetic
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Glass Swatches Preview */}
              <div className="p-4 rounded-2xl bg-slate-900/[0.03] dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Colorful Glass Theme Swatches</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="p-2.5 rounded-xl glass-violet text-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-400 mx-auto block mb-1" />
                    <span className="text-[11px] font-semibold text-violet-500 dark:text-violet-300">Violet Neon</span>
                  </div>
                  <div className="p-2.5 rounded-xl glass-cyan text-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mx-auto block mb-1" />
                    <span className="text-[11px] font-semibold text-cyan-500 dark:text-cyan-300">Electric Cyan</span>
                  </div>
                  <div className="p-2.5 rounded-xl glass-emerald text-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mx-auto block mb-1" />
                    <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-300">Aurora Mint</span>
                  </div>
                  <div className="p-2.5 rounded-xl glass-amber text-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto block mb-1" />
                    <span className="text-[11px] font-semibold text-amber-500 dark:text-amber-300">Solar Gold</span>
                  </div>
                  <div className="p-2.5 rounded-xl glass-rose text-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 mx-auto block mb-1" />
                    <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-300">Rose Flare</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between rounded-b-3xl">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTap();
              onClose();
            }}
            className="px-5 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white shadow-md shadow-indigo-500/30 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
