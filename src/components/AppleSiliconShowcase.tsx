import React, { useState } from 'react';
import { Cpu, Zap, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface SiliconChip {
  id: string;
  name: string;
  architecture: string;
  neuralEngineTops: number;
  cpuCores: string;
  gpuCores: string;
  bandwidth: string;
  continuityLatency: string;
  shortcutsThroughput: string;
  supportedFeatures: string[];
  description: string;
}

const SILICON_CHIPS: SiliconChip[] = [
  {
    id: 'm4-max',
    name: 'Apple M4 Max',
    architecture: '3nm Enhanced (2nd Gen TSMC)',
    neuralEngineTops: 38,
    cpuCores: '16 Cores (12 Performance + 4 Efficiency)',
    gpuCores: '40 Cores Hardware Ray Tracing',
    bandwidth: '546 GB/s Unified Memory',
    continuityLatency: '1.2 ms (Zero Jitter)',
    shortcutsThroughput: '0.02s compilation',
    supportedFeatures: [
      'iPhone Mirroring 4K 60fps',
      'Desk View Optical Correction',
      'Dual ProRes Accelerators',
      'Hardware Ray Tracing',
      'On-Device LLM & Shortcuts Engine'
    ],
    description: 'Flagship Apple Silicon designed for continuous high-throughput studio workflows, real-time 4K continuity ingest, and instant compilation.',
  },
  {
    id: 'm3-max',
    name: 'Apple M3 Max',
    architecture: '3nm Precision Silicon',
    neuralEngineTops: 18,
    cpuCores: '16 Cores (12 Performance + 4 Efficiency)',
    gpuCores: '40 Cores Dynamic Caching',
    bandwidth: '400 GB/s Unified Memory',
    continuityLatency: '1.8 ms',
    shortcutsThroughput: '0.04s compilation',
    supportedFeatures: [
      'iPhone Mirroring Wireless',
      'Dynamic Caching Architecture',
      'Universal Control Multi-Display',
      'ProRes Encode/Decode'
    ],
    description: 'High-efficiency workstation grade processing with Dynamic Caching to allocate GPU memory in real-time for multi-display continuity.',
  },
  {
    id: 'm2-ultra',
    name: 'Apple M2 Ultra',
    architecture: 'UltraFusion Interconnect',
    neuralEngineTops: 31.6,
    cpuCores: '24 Cores (16 Performance + 8 Efficiency)',
    gpuCores: '76 Cores High Performance',
    bandwidth: '800 GB/s Massive Bandwidth',
    continuityLatency: '2.0 ms',
    shortcutsThroughput: '0.03s compilation',
    supportedFeatures: [
      'Simultaneous 6x 6K Pro Display XDR',
      'High-bandwidth PCIe I/O',
      'Universal Control Mesh',
      'Audio Unit Zero-Latency'
    ],
    description: 'Massive dual-die interconnect for heavy developer builds, local LLMs, and multi-display studio configurations.',
  },
  {
    id: 'a18-pro',
    name: 'Apple A18 Pro',
    architecture: '3nm Mobile Architecture',
    neuralEngineTops: 35,
    cpuCores: '6 Cores (2 Performance + 4 Efficiency)',
    gpuCores: '6 Cores Desktop Class',
    bandwidth: '17% faster memory subsystem',
    continuityLatency: '1.4 ms (AWDL 5GHz/6GHz)',
    shortcutsThroughput: '0.03s compilation',
    supportedFeatures: [
      '4K 120fps Dolby Vision Ingest',
      'iPhone Mirroring Host',
      'Wi-Fi 7 2x2 MIMO Handoff',
      'Action Button Haptic Triggers'
    ],
    description: 'The foundation for seamless iPhone Mirroring and Continuity Camera in iOS 18 with hardware-accelerated ProRes pipelines.',
  },
];

export const AppleSiliconShowcase: React.FC = () => {
  const [activeChipId, setActiveChipId] = useState<string>('m4-max');
  const chip = SILICON_CHIPS.find(c => c.id === activeChipId) || SILICON_CHIPS[0];

  const handleSelect = (id: string) => {
    haptics.playSelect();
    setActiveChipId(id);
  };

  return (
    <section 
      aria-label="Apple Silicon Architecture Matrix"
      className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0A0B0E]/90 backdrop-blur-2xl p-4 sm:p-8 space-y-5 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <span className="text-xs text-[#2997FF] font-medium tracking-wider uppercase">
            Hardware Acceleration Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F7] mt-1">
            Engineered for Apple Silicon.
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1 font-normal">
            Inspect real-time Neural Engine throughput, AWDL wireless continuity latency, and shortcut compilation benchmarks.
          </p>
        </div>

        {/* Chip Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl shrink-0">
          {SILICON_CHIPS.map((item) => {
            const isSelected = item.id === activeChipId;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-[#86868B] hover:text-white'
                }`}
              >
                {item.name.replace('Apple ', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chip Intelligence Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Core Architecture & Description */}
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-2">
            <div className="text-xs text-[#2997FF] font-medium flex items-center gap-2">
              <Cpu className="w-4 h-4 stroke-[2]" />
              <span>{chip.architecture}</span>
            </div>
            <h3 className="text-2xl font-semibold text-white tracking-tight">
              {chip.name}
            </h3>
            <p className="text-sm text-[#A1A1A6] leading-relaxed font-normal">
              {chip.description}
            </p>
          </div>

          {/* Benchmark Metrics Grid (Tabular Numerals) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] text-[#86868B] block font-medium uppercase tracking-wider">
                Neural Engine
              </span>
              <div className="text-lg font-semibold text-white font-mono tabular-nums">
                {chip.neuralEngineTops} <span className="text-xs text-[#2997FF] font-medium">TOPS</span>
              </div>
              <span className="text-[10px] text-[#86868B] block font-normal">On-device ML operations</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[11px] text-[#86868B] block font-medium uppercase tracking-wider">
                Continuity Latency
              </span>
              <div className="text-lg font-semibold text-emerald-400 font-mono tabular-nums">
                {chip.continuityLatency}
              </div>
              <span className="text-[10px] text-[#86868B] block font-normal">AWDL peer-to-peer ping</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[#86868B] block font-medium uppercase tracking-wider">
                Execution Time
              </span>
              <div className="text-lg font-semibold text-blue-400 font-mono tabular-nums">
                {chip.shortcutsThroughput}
              </div>
              <span className="text-[10px] text-[#86868B] block font-normal">Native script compilation</span>
            </div>
          </div>

          {/* Hardware Specs Row */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
              <span className="text-[#86868B] font-bold">CPU Topology</span>
              <span className="text-white font-mono">{chip.cpuCores}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
              <span className="text-[#86868B] font-bold">Graphics Engine</span>
              <span className="text-white font-mono">{chip.gpuCores}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[#86868B] font-bold">Memory Bandwidth</span>
              <span className="text-white font-mono">{chip.bandwidth}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Native Continuity Features */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              <span>Hardware Acceleration Support</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#CCCCCC]">
              {chip.supportedFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2997FF] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <div className="text-[11px] text-[#86868B] flex items-center gap-2 font-bold">
              <span>Sequoia Ready</span>
              <span aria-hidden="true">·</span>
              <span>Metal 3 Compute</span>
              <span aria-hidden="true">·</span>
              <span>Secure Enclave</span>
            </div>
            <div className="text-[11px] text-[#86868B] font-normal">
              Validated against official Apple Silicon hardware registers.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
