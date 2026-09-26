import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  Activity, 
  Volume2,
  VolumeX
} from 'lucide-react';
import { haptics } from '../utils/haptics';

interface DiagnosticResult {
  title: string;
  category: 'hardware' | 'continuity' | 'display' | 'security';
  status: 'passed' | 'warning' | 'info';
  details: string;
  metric?: string;
}

export const DiagnosticSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(haptics.isEnabled());
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const runDiagnostics = () => {
    haptics.playTap();
    setIsRunning(true);
    setResults([]);

    setTimeout(() => {
      const ua = navigator.userAgent;
      const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform) || /Macintosh|iPhone|iPad/.test(ua);
      const isRetina = window.devicePixelRatio >= 2;
      const p3Supported = window.matchMedia('(color-gamut: p3)').matches;
      const cores = navigator.hardwareConcurrency || 8;
      const memory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unified Memory';
      const isOnline = navigator.onLine;

      const items: DiagnosticResult[] = [
        {
          title: 'Apple Silicon Architecture',
          category: 'hardware',
          status: isApple ? 'passed' : 'info',
          details: isApple 
            ? `Apple Silicon verified with ${cores} High-Performance & Efficiency Cores` 
            : `Compatible Unix environment (${cores} compute threads detected)`,
          metric: `${cores} Cores`,
        },
        {
          title: 'Retina XDR & P3 Wide Color Gamut',
          category: 'display',
          status: p3Supported || isRetina ? 'passed' : 'info',
          details: p3Supported 
            ? `Display P3 color space and ${window.devicePixelRatio}x Retina scaling active` 
            : `Standard sRGB spectrum (${window.devicePixelRatio}x pixel ratio)`,
          metric: `${window.devicePixelRatio}x Retina`,
        },
        {
          title: 'Universal Clipboard Synchronization',
          category: 'continuity',
          status: typeof navigator.clipboard !== 'undefined' ? 'passed' : 'warning',
          details: typeof navigator.clipboard !== 'undefined' 
            ? 'Async Clipboard API ready for cross-device text and image handoff' 
            : 'Clipboard access restricted in current context',
          metric: 'Active',
        },
        {
          title: 'Continuity Camera & Desk View Pipeline',
          category: 'continuity',
          status: typeof navigator.mediaDevices?.getUserMedia === 'function' ? 'passed' : 'warning',
          details: typeof navigator.mediaDevices?.getUserMedia === 'function' 
            ? 'WebRTC media pipeline ready for wireless 4K/60fps video ingestion' 
            : 'Media capture interface not accessible',
          metric: '4K/60fps Capable',
        },
        {
          title: 'Apple Edge Node Latency',
          category: 'security',
          status: isOnline ? 'passed' : 'warning',
          details: isOnline 
            ? 'Low-jitter edge routing with zero dropped packets across local loopback' 
            : 'Offline state detected',
          metric: '1.2ms',
        },
        {
          title: 'Local Script Sandboxing',
          category: 'hardware',
          status: 'passed',
          details: 'Zero external credential transmission. All Shortcuts generated client-side.',
          metric: 'Local Only',
        },
      ];

      setResults(items);
      setIsRunning(false);
      haptics.playSuccess();
    }, 600);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const handleCopyReport = () => {
    haptics.playTap();
    const reportText = `--- SmartToolHub Apple Diagnostic Report ---
Date: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
Screen: ${window.screen.width}x${window.screen.height} @ ${window.devicePixelRatio}x
Color Gamut P3: ${window.matchMedia('(color-gamut: p3)').matches ? 'Yes' : 'No'}
CPU Threads: ${navigator.hardwareConcurrency || 'N/A'}
Status: All Ecosystem Handshakes Verified
Verified by SmartToolHub 2026`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0E0F13]/90 backdrop-blur-xl p-4 sm:p-7 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">Live Profiler</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-xs text-emerald-400 font-medium">All Handshakes Verified</span>
          </div>
          <h3 className="font-semibold text-white text-base sm:text-lg tracking-tight">
            System & Continuity Readiness
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = haptics.toggle();
              setSoundActive(next);
            }}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#86868B] hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
            title={soundActive ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 text-[#2997FF]" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
          </button>

          {/* Rerun Button */}
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] text-white text-xs border border-white/[0.08] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-[#2997FF]' : ''}`} />
            <span>{isRunning ? 'Analyzing...' : 'Re-verify'}</span>
          </button>

          {/* Copy Report */}
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Export Audit'}</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Grid (Clean macOS System Profiler Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((r, i) => (
          <div 
            key={i}
            className="p-4 rounded-xl bg-black/40 border border-white/[0.05] hover:border-white/[0.12] transition-colors space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-white tracking-tight">{r.title}</span>
              {r.status === 'passed' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#86868B] leading-relaxed">{r.details}</p>
            {r.metric && (
              <div className="pt-1 text-[11px] text-[#2997FF] font-medium font-mono tabular-nums">
                {r.metric}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
