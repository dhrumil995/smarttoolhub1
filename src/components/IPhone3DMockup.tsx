import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Play, CheckCircle2, Wifi, Battery, Zap, Volume2, ShieldCheck } from 'lucide-react';

interface IPhone3DMockupProps {
  onRunSample?: () => void;
  className?: string;
}

export const IPhone3DMockup: React.FC<IPhone3DMockupProps> = ({ onRunSample, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(-4);
  const [rotateY, setRotateY] = useState<number>(8);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Subtle auto-floating animation when user is not hovering
  useEffect(() => {
    if (prefersReducedMotion || isHovered) return;
    let frameId: number;
    let startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      // Gentle lissajous oscillation
      const autoY = Math.sin(elapsed * 0.7) * 7;
      const autoX = Math.cos(elapsed * 0.5) * 4 - 2;
      setRotateY(autoY);
      setRotateX(autoX);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered, prefersReducedMotion]);

  // Handle pointer tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const targetRotY = ((x - centerX) / centerX) * 14;
    const targetRotX = -((y - centerY) / centerY) * 14;

    setRotateY(targetRotY);
    setRotateX(targetRotX);
  }, [prefersReducedMotion]);

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Run shortcut demonstration
  const handleRunShortcut = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsCompleted(false);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 500);
    setTimeout(() => setActiveStep(3), 1000);
    setTimeout(() => setActiveStep(4), 1500);
    setTimeout(() => {
      setIsRunning(false);
      setIsCompleted(true);
      if (onRunSample) onRunSample();
    }, 2000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[340px] sm:max-w-[380px] mx-auto py-6 sm:py-10 perspective-1200 cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ perspective: '1200px' }}
      aria-label="Interactive 3D iPhone demonstration showing Apple Shortcut workflow"
    >
      {/* Aurora Ambient Glow directly beneath device */}
      <div
        className="absolute inset-0 -z-10 blur-[80px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, #0a84ff 0%, #ff4f9a 45%, #ffb840 85%, transparent 100%)',
          transform: 'scale(1.2)',
        }}
        aria-hidden="true"
      />

      {/* 3D Root Container with preserve-3d */}
      <div
        className="relative preserve-3d transition-transform duration-200 ease-out"
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ========================================================
            1. IPHONE HARDWARE CHASSIS
            ======================================================== */}
        <div
          className="relative w-[280px] sm:w-[310px] h-[580px] sm:h-[620px] mx-auto rounded-[50px] p-[10px] bg-gradient-to-b from-[#2e3440] via-[#1a1f2c] to-[#0d111b] border-[3px] border-[#3b4252] shadow-[0_35px_70px_rgba(0,0,0,0.8),0_10px_20px_rgba(10,132,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)]"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Outer Titanium Bevel Ring */}
          <div className="absolute inset-0 rounded-[48px] border border-white/20 pointer-events-none" />

          {/* Side Buttons (Simulated Hardware) */}
          <div className="absolute -left-[5px] top-[110px] w-[3px] h-[30px] rounded-l-sm bg-[#4c566a]" title="Action Button" />
          <div className="absolute -left-[5px] top-[155px] w-[3px] h-[48px] rounded-l-sm bg-[#4c566a]" title="Volume Up" />
          <div className="absolute -left-[5px] top-[215px] w-[3px] h-[48px] rounded-l-sm bg-[#4c566a]" title="Volume Down" />
          <div className="absolute -right-[5px] top-[165px] w-[3px] h-[65px] rounded-r-sm bg-[#4c566a]" title="Side Power" />

          {/* ========================================================
              2. OLED DISPLAY BEZEL & SCREEN
              ======================================================== */}
          <div className="relative w-full h-full rounded-[42px] bg-[#050713] overflow-hidden border border-black flex flex-col justify-between p-3.5 text-white">
            {/* Dynamic Island Pill */}
            <div className="relative mx-auto mt-0.5 w-[96px] h-[25px] rounded-full bg-black border border-white/10 flex items-center justify-between px-2.5 z-20 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0d18] border border-white/10" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#1e2333]" />
              </div>
            </div>

            {/* Status Bar */}
            <div className="absolute top-2 inset-x-5 flex justify-between items-center text-[11px] font-semibold text-zinc-300 font-mono pointer-events-none z-10">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-zinc-300" />
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* LIVE SHORTCUT PREVIEW SCREEN CONTENT */}
            <div className="flex-1 mt-4 flex flex-col justify-start space-y-3 pt-2 overflow-y-auto no-scrollbar">
              {/* Shortcut Card Header */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900/90 border border-white/15 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a84ff] to-[#ff4f9a] p-0.5 flex items-center justify-center shadow-md">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-white truncate font-heading">
                      Focus &amp; Morning Summary
                    </h3>
                    <p className="text-[10px] text-indigo-300 font-mono">
                      4 Actions · iOS 18 Siri
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Graph Steps */}
              <div className="space-y-2 text-[11px]">
                {/* Step 1 */}
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    activeStep >= 1
                      ? 'bg-blue-950/70 border-blue-400/50 text-blue-100 shadow-[0_0_12px_rgba(10,132,255,0.3)]'
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-[9px] font-mono shrink-0 font-bold">
                      1
                    </span>
                    <span className="truncate">Turn On Work Focus Mode</span>
                  </div>
                  {activeStep >= 1 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  ) : (
                    <span className="text-[9px] text-zinc-500 font-mono">Focus</span>
                  )}
                </div>

                {/* Step 2 */}
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    activeStep >= 2
                      ? 'bg-purple-950/70 border-purple-400/50 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-[9px] font-mono shrink-0 font-bold">
                      2
                    </span>
                    <span className="truncate">Fetch Calendar &amp; Reminders</span>
                  </div>
                  {activeStep >= 2 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  ) : (
                    <span className="text-[9px] text-zinc-500 font-mono">iCloud</span>
                  )}
                </div>

                {/* Step 3 */}
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    activeStep >= 3
                      ? 'bg-pink-950/70 border-pink-400/50 text-pink-100 shadow-[0_0_12px_rgba(255,79,154,0.3)]'
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-pink-500/30 text-pink-300 flex items-center justify-center text-[9px] font-mono shrink-0 font-bold">
                      3
                    </span>
                    <span className="truncate">Append Briefing to Apple Notes</span>
                  </div>
                  {activeStep >= 3 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  ) : (
                    <span className="text-[9px] text-zinc-500 font-mono">Notes</span>
                  )}
                </div>

                {/* Step 4 */}
                <div
                  className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    activeStep >= 4
                      ? 'bg-emerald-950/70 border-emerald-400/50 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[9px] font-mono shrink-0 font-bold">
                      4
                    </span>
                    <span className="truncate">Speak Summary via Siri Audio</span>
                  </div>
                  {activeStep >= 4 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  )}
                </div>
              </div>

              {/* Status Message */}
              {isCompleted && (
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Shortcut executed successfully on iPhone 16!</span>
                </div>
              )}
            </div>

            {/* Run Button in Screen */}
            <div className="pt-2 pb-1">
              <button
                type="button"
                onClick={handleRunShortcut}
                disabled={isRunning}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0a84ff] to-[#ff4f9a] hover:from-[#38bdf8] hover:to-[#ff75b5] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(10,132,255,0.4)] transition-all cursor-pointer disabled:opacity-75"
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Executing Actions...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'Run Again' : 'Test Run Shortcut'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Home Indicator Bar */}
            <div className="w-24 h-1 rounded-full bg-white/40 mx-auto mt-1" />
          </div>
        </div>

        {/* ========================================================
            3. FLOATING GLASS CHIPS (PARALLAX AT TRANSLATEZ DEPTHS)
            ======================================================== */}
        {/* Chip 1: Top-Left (Depth: 55px) */}
        <div
          className="absolute -top-3 -left-4 sm:-left-8 px-3.5 py-2 rounded-2xl bg-white/10 dark:bg-slate-900/70 backdrop-blur-xl border border-white/25 shadow-[0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.3)] flex items-center gap-2 text-white pointer-events-none transition-transform"
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(55px)',
          }}
        >
          <div className="w-6 h-6 rounded-lg bg-blue-500/25 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-tight">Siri Intent Ready</div>
            <div className="text-[9px] text-zinc-400 font-mono">Zero-Latency Voice Run</div>
          </div>
        </div>

        {/* Chip 2: Bottom-Right (Depth: 75px) */}
        <div
          className="absolute -bottom-2 -right-4 sm:-right-8 px-3.5 py-2 rounded-2xl bg-white/10 dark:bg-slate-900/70 backdrop-blur-xl border border-white/25 shadow-[0_16px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.3)] flex items-center gap-2 text-white pointer-events-none transition-transform"
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(75px)',
          }}
        >
          <div className="w-6 h-6 rounded-lg bg-pink-500/25 border border-pink-400/40 flex items-center justify-center text-pink-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-tight">iOS 18 &amp; macOS 15</div>
            <div className="text-[9px] text-pink-300 font-mono">Native .shortcut Spec</div>
          </div>
        </div>

        {/* Chip 3: Middle-Right (Depth: 35px) */}
        <div
          className="hidden sm:flex absolute top-1/2 -right-10 px-3 py-1.5 rounded-xl bg-white/10 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.4)] items-center gap-1.5 text-white pointer-events-none transition-transform"
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(35px) translateY(-50%)',
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-mono text-zinc-200">100% Client-Side Private</span>
        </div>
      </div>
    </div>
  );
};
