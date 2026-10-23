import React, { useState, useMemo } from 'react';
import { HardDrive, CheckCircle2, AlertTriangle, AlertCircle, Gauge, Video, Layers, Info } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface CodecSpec {
  id: string;
  name: string;
  family: 'ProRes' | 'RAW' | 'Compressed' | 'Uncompressed';
  // Base bitrate in Megabits per second (Mbps) at 4K UHD 24 fps 1 stream
  baseMbps4k24: number;
}

const CODEC_PRESETS: CodecSpec[] = [
  // Compressed
  { id: 'h264-high', name: 'H.264 / MP4 (High Bitrate)', family: 'Compressed', baseMbps4k24: 60 },
  { id: 'h265-10bit', name: 'H.265 / HEVC 10-bit 4:2:2', family: 'Compressed', baseMbps4k24: 120 },
  // ProRes (Official Apple whitepaper specs at 3840x2160 23.98p)
  { id: 'prores-proxy', name: 'Apple ProRes 422 Proxy', family: 'ProRes', baseMbps4k24: 151 },
  { id: 'prores-lt', name: 'Apple ProRes 422 LT', family: 'ProRes', baseMbps4k24: 350 },
  { id: 'prores-422', name: 'Apple ProRes 422', family: 'ProRes', baseMbps4k24: 503 },
  { id: 'prores-hq', name: 'Apple ProRes 422 HQ', family: 'ProRes', baseMbps4k24: 754 },
  { id: 'prores-4444', name: 'Apple ProRes 4444', family: 'ProRes', baseMbps4k24: 1131 },
  { id: 'prores-4444-xq', name: 'Apple ProRes 4444 XQ', family: 'ProRes', baseMbps4k24: 1696 },
  // RAW
  { id: 'braw-8-1', name: 'Blackmagic RAW 8:1', family: 'RAW', baseMbps4k24: 320 },
  { id: 'braw-5-1', name: 'Blackmagic RAW 5:1', family: 'RAW', baseMbps4k24: 512 },
  { id: 'braw-3-1', name: 'Blackmagic RAW 3:1', family: 'RAW', baseMbps4k24: 853 },
  { id: 'redcode-mq', name: 'REDCODE RAW (MQ Medium)', family: 'RAW', baseMbps4k24: 680 },
  // Uncompressed
  { id: 'uncompressed-10bit', name: 'Uncompressed 10-bit YUV 4:2:2', family: 'Uncompressed', baseMbps4k24: 3185 },
];

const RESOLUTION_MULTIPLIERS: Record<string, { label: string; scale: number; pixels: string }> = {
  '1080p': { label: '1080p Full HD (1920x1080)', scale: 0.25, pixels: '2.07 MP' },
  '4k-uhd': { label: '4K UHD (3840x2160)', scale: 1.0, pixels: '8.29 MP' },
  '4k-dci': { label: '4K DCI Cinema (4096x2160)', scale: 1.07, pixels: '8.85 MP' },
  '6k': { label: '6K Full Frame (6144x3456)', scale: 2.56, pixels: '21.23 MP' },
  '8k': { label: '8K DCI / UHD (7680x4320)', scale: 4.0, pixels: '33.18 MP' },
};

interface DriveSpeedCalculatorPageProps {
  navigate: (path: string) => void;
}

export const DriveSpeedCalculatorPage: React.FC<DriveSpeedCalculatorPageProps> = ({ navigate }) => {
  const [resolutionKey, setResolutionKey] = useState<string>('4k-uhd');
  const [fps, setFps] = useState<number>(24);
  const [codecId, setCodecId] = useState<string>('prores-422');
  const [streams, setStreams] = useState<number>(1);
  const [testedDriveSpeedMbSec, setTestedDriveSpeedMbSec] = useState<number>(450); // e.g. 450 MB/s SATA SSD

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'drive-speed-requirement-calculator') || {
    id: 'drive-speed-requirement-calculator',
    name: 'Drive Speed Requirement Calculator',
    slug: 'drive-speed-requirement-calculator',
    description: 'Calculate real-time video editing drive bandwidth (MB/s) and hourly storage for any video codec and multi-cam setup.',
    category: 'Productivity',
    icon: 'HardDrive',
    type: 'client',
    keywords: ['drive speed calculator', 'video editing disk bandwidth mb/s', 'prores data rate storage', 'ssd speed test requirement'],
    relatedToolSlugs: ['file-checksum-verifier', 'retina-image-size-calculator'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'retina-image-size-calculator' || t.slug === 'file-transfer-time-calculator' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  // Calculations
  const calculation = useMemo(() => {
    const selectedCodec = CODEC_PRESETS.find((c) => c.id === codecId) || CODEC_PRESETS[4];
    const res = RESOLUTION_MULTIPLIERS[resolutionKey] || RESOLUTION_MULTIPLIERS['4k-uhd'];

    // Bitrate scales linearly with resolution scale and frame rate ratio
    const fpsRatio = fps / 24;
    const singleStreamMbps = selectedCodec.baseMbps4k24 * res.scale * fpsRatio;
    const totalMbps = singleStreamMbps * streams;

    // Convert Megabits to Megabytes per second (1 Byte = 8 bits)
    const requiredMbPerSec = totalMbps / 8;

    // Storage per hour in Gigabytes: (MB/s * 3600 seconds) / 1024
    const gbPerHour = (requiredMbPerSec * 3600) / 1024;
    const tbPerHour = gbPerHour / 1024;

    // Compare with user's drive speed
    const driveSpeed = Math.max(1, testedDriveSpeedMbSec);
    const headroomRatio = (driveSpeed - requiredMbPerSec) / driveSpeed;
    const headroomPct = Math.round(headroomRatio * 100);

    let verdict: 'sufficient' | 'marginal' | 'insufficient';
    if (requiredMbPerSec > driveSpeed) {
      verdict = 'insufficient';
    } else if (headroomPct < 25) {
      verdict = 'marginal';
    } else {
      verdict = 'sufficient';
    }

    return {
      codecName: selectedCodec.name,
      resolutionLabel: res.label,
      requiredMbPerSec: Math.round(requiredMbPerSec * 10) / 10,
      totalMbps: Math.round(totalMbps),
      gbPerHour: Math.round(gbPerHour * 10) / 10,
      tbPerHour: Math.round(tbPerHour * 100) / 100,
      headroomPct,
      verdict,
      driveSpeed,
    };
  }, [resolutionKey, fps, codecId, streams, testedDriveSpeedMbSec]);

  const presetDrives = [
    { label: 'External 7200 RPM HDD (~130 MB/s)', speed: 130 },
    { label: 'External SATA SSD (~450 MB/s)', speed: 450 },
    { label: 'USB 3.2 Gen 2 NVMe (~1,050 MB/s)', speed: 1050 },
    { label: 'Thunderbolt 4 / PCIe 4.0 (~2,800 MB/s)', speed: 2800 },
  ];

  const exampleChips = [
    '4K 24fps Apple ProRes 422 (Single Stream)',
    '4K 60fps ProRes 422 HQ 3-Cam Multi-Cam',
    '8K 30fps Blackmagic RAW 5:1 Editing Stream',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Drive Speed Requirement Calculator"
      subheading="Calculate the exact disk throughput (MB/s) and storage consumption required for smooth, drop-free playback in DaVinci Resolve, Premiere Pro, and Final Cut Pro."
      inputLabel="Drive Speed in Megabytes per Second (MB/s)"
      inputPlaceholder="e.g. 450 for SATA SSD, 1050 for NVMe USB-C"
      examplePrompt="Calculate drive throughput needed for 4K ProRes 422 HQ at 60fps"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `Configuration:
Resolution: ${calculation.resolutionLabel}
Framerate: ${fps} fps
Codec: ${calculation.codecName}
Simultaneous Streams: ${streams} stream(s)

Required Drive Bandwidth: ${calculation.requiredMbPerSec} MB/s (${calculation.totalMbps} Mbps)
Estimated Storage Consumption: ${calculation.gbPerHour} GB/hour (${calculation.tbPerHour} TB/hour)
Tested Drive Speed: ${calculation.driveSpeed} MB/s
Verdict: ${
          calculation.verdict === 'sufficient'
            ? `SUFFICIENT (+${calculation.headroomPct}% safety headroom)`
            : calculation.verdict === 'marginal'
            ? `MARGINAL (+${calculation.headroomPct}% headroom - risk of dropped frames on timeline scrub)`
            : `INSUFFICIENT (Drive bottlenecks playback by ${Math.abs(calculation.headroomPct)}%)`
        }

*Note: All bandwidth numbers are realistic technical estimates based on standardized codec data rates. Compression can vary depending on scene complexity and grain.`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Inputs Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#ffb840] font-bold flex items-center gap-2">
              <Video className="w-4 h-4 text-[#ffb840]" />
              <span>Project Video Parameters</span>
            </h3>

            {/* 1. Resolution */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                1. Timeline Resolution
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(RESOLUTION_MULTIPLIERS).map(([key, data]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setResolutionKey(key)}
                    className={`py-2 px-3 rounded-xl text-xs text-left transition-all border focus-ring ${
                      resolutionKey === key
                        ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold shadow-sm'
                        : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                    }`}
                  >
                    <div className="font-bold">{data.label.split(' (')[0]}</div>
                    <div className="text-[10px] opacity-80">{data.pixels}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Framerate */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                2. Frame Rate (fps)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[24, 30, 60, 120].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFps(rate)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                      fps === rate
                        ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold shadow-sm'
                        : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                    }`}
                  >
                    {rate} fps
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Codec Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                3. Video Codec / Quality Profile
              </label>
              <select
                value={codecId}
                onChange={(e) => setCodecId(e.target.value)}
                className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-2xl px-4 py-3 text-sm text-[#f2f7ff] focus-ring"
              >
                {CODEC_PRESETS.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.family}] {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Multi-cam Streams */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                  4. Simultaneous Editing Streams (Multi-cam)
                </label>
                <span className="text-xs font-mono text-[#ffb840] font-bold">
                  {streams} {streams === 1 ? 'Stream' : 'Multi-cam Streams'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={streams}
                onChange={(e) => setStreams(parseInt(e.target.value, 10))}
                className="w-full accent-[#ffb840] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#9aaccb]">
                <span>1 (Single Track)</span>
                <span>2 Cams</span>
                <span>4 Cams</span>
                <span>8 Cams (Studio Multi-cam)</span>
              </div>
            </div>

            {/* 5. User's Target Drive Speed */}
            <div className="space-y-2 pt-2 border-t border-[rgba(143,163,192,0.12)]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9aaccb]">
                  5. Your Drive's Read Speed Benchmark (MB/s)
                </label>
                <span className="text-xs font-mono text-[#f2f7ff] font-bold">
                  {testedDriveSpeedMbSec} MB/s
                </span>
              </div>
              <input
                type="number"
                min="10"
                max="7500"
                value={testedDriveSpeedMbSec}
                onChange={(e) => setTestedDriveSpeedMbSec(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-2xl px-4 py-2.5 text-sm font-mono text-[#f2f7ff] focus-ring"
              />

              {/* Quick Drive Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {presetDrives.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setTestedDriveSpeedMbSec(d.speed)}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#050a14] border border-[rgba(143,163,192,0.16)] text-[#9aaccb] hover:text-[#f2f7ff] hover:border-[#ffb840] transition-colors focus-ring"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
              <span className="text-xs font-mono uppercase text-[#9aaccb]">
                Required Sustained Bandwidth
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#ffb840]">
                {calculation.requiredMbPerSec} <span className="text-lg font-normal text-[#9aaccb]">MB/s</span>
              </div>
              <div className="text-xs font-mono text-[#9aaccb]">
                {calculation.totalMbps.toLocaleString()} Megabits / sec (Total)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
              <span className="text-xs font-mono uppercase text-[#9aaccb]">
                Hourly Storage Footprint
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#f2f7ff]">
                {calculation.gbPerHour > 1000 ? `${calculation.tbPerHour} TB` : `${calculation.gbPerHour} GB`}
                <span className="text-lg font-normal text-[#9aaccb]"> / hr</span>
              </div>
              <div className="text-xs text-[#9aaccb]">
                Per single stream recording / timeline cache
              </div>
            </div>
          </div>

          {/* Drive Compatibility Verdict Banner */}
          <div
            className={`p-5 rounded-3xl border flex items-start gap-4 ${
              calculation.verdict === 'sufficient'
                ? 'bg-[rgba(52,224,161,0.08)] border-[#34e0a1] text-[#34e0a1]'
                : calculation.verdict === 'marginal'
                ? 'bg-[rgba(255,184,64,0.08)] border-[#ffb840] text-[#ffb840]'
                : 'bg-[rgba(255,92,122,0.08)] border-[#ff5c7a] text-[#ff5c7a]'
            }`}
          >
            {calculation.verdict === 'sufficient' && <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />}
            {calculation.verdict === 'marginal' && <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />}
            {calculation.verdict === 'insufficient' && <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />}

            <div className="space-y-1 text-xs">
              <div className="text-base font-bold uppercase tracking-wider font-mono">
                {calculation.verdict === 'sufficient' && `Sufficient · +${calculation.headroomPct}% Safety Headroom`}
                {calculation.verdict === 'marginal' && `Marginal · +${calculation.headroomPct}% Headroom (Borderline)`}
                {calculation.verdict === 'insufficient' && `Insufficient · Drive Bottlenecked by ${Math.abs(calculation.headroomPct)}%`}
              </div>
              <p className="text-[#f2f7ff] leading-relaxed">
                {calculation.verdict === 'sufficient' &&
                  `Your drive delivers ${calculation.driveSpeed} MB/s, comfortably exceeding the required ${calculation.requiredMbPerSec} MB/s throughput. Real-time timeline playback and multi-cam scrubbing will perform smoothly.`}
                {calculation.verdict === 'marginal' &&
                  `Your drive delivers ${calculation.driveSpeed} MB/s against an active requirement of ${calculation.requiredMbPerSec} MB/s. While basic playback may function, color grade nodes, audio tracks, or rapid timeline scrubbing can cause dropped frames.`}
                {calculation.verdict === 'insufficient' &&
                  `Your drive is too slow (${calculation.driveSpeed} MB/s) to feed ${calculation.requiredMbPerSec} MB/s sustained video data. You will experience stutter, audio desync, and buffer underruns. Upgrade to an NVMe SSD or generate ProRes Proxy files.`}
              </p>
            </div>
          </div>

          {/* Technical calculation explainer box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] space-y-2 text-xs text-[#9aaccb]">
            <div className="flex items-center gap-1.5 font-mono uppercase text-[#ffb840] font-bold">
              <Info className="w-4 h-4" />
              <span>How are these numbers calculated?</span>
            </div>
            <p className="leading-relaxed">
              Video data rates are calculated based on official Apple ProRes and camera manufacturer whitepapers. Throughput in Megabytes per second equals: <code>(Base Bitrate in Mbps &times; Resolution Scale &times; (FPS / 24) &times; Streams) &divide; 8</code>. A standard 20–30% safety headroom is recommended by NLE developers (Blackmagic Design and Apple) because drive read speeds degrade as storage fills up or thermal throttling occurs.
            </p>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The Drive Speed Requirement Calculator determines whether an external hard drive (HDD), portable solid-state drive (SATA SSD), or high-speed NVMe drive can sustain real-time video playback and scrubbing without dropped frames. Video editors frequently encounter unexpected playback stutter when attempting to play high-bitrate ProRes or RAW camera footage from slow external drives.
          </p>
          <p>
            By configuring your project resolution, timeline frame rate, compression codec, and multi-camera stream count, this calculator computes the precise sustained throughput in Megabytes per second (MB/s) and provides an immediate headroom verdict against your measured disk read speed.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Choose resolution and frame rate',
          text: 'Select your editing timeline resolution (1080p, 4K, 6K, or 8K) and target frame rate (24, 30, 60, or 120 fps).',
        },
        {
          step: 'Pick your production codec',
          text: 'Choose your footage format, including Apple ProRes (Proxy, 422, HQ, 4444), Blackmagic RAW, REDCODE RAW, or H.264/H.265.',
        },
        {
          step: 'Enter your drive benchmark',
          text: 'Type your drive’s sequential read speed in MB/s (from Blackmagic Disk Speed Test or CrystalDiskMark) to verify headroom.',
        },
      ]}
      workedExample={{
        title: 'Example: 4K 60fps 3-Camera Multi-cam Editing',
        scenario: 'An editor is cutting a concert using three 4K 60fps ProRes 422 streams on a portable USB 3.2 NVMe SSD (1,050 MB/s).',
        output: `Video Specs: 4K UHD (3840x2160) @ 60 fps
Codec: Apple ProRes 422
Multi-cam Streams: 3 simultaneous angles

Bitrate Calculation:
- Single Stream @ 60fps: 1,257.5 Mbps (157.2 MB/s)
- 3 Streams Total: 3,772.5 Mbps (471.6 MB/s)
- Hourly Storage Consumption: ~1.62 TB / hour (for all 3 angles)

Drive Verdict:
- Tested Drive Speed: 1,050 MB/s
- Required Bandwidth: 471.6 MB/s
- Safety Headroom: +55% (EXCELLENT · Smooth 3-Cam Multi-cam Playback)`,
      }}
      tips={[
        'Always aim for at least 30% headroom: Solid-state drives experience performance drops as capacity fills beyond 80% (SLC cache exhaustion).',
        'Use Proxies on slow drives: If your external drive bottlenecks playback, transcode your media to Apple ProRes Proxy or DNxHR LB.',
        'USB 3.0 vs USB 3.2 Gen 2: Standard blue USB 3.0 ports cap at ~440 MB/s, whereas USB 3.2 Gen 2 (10 Gbps) sustains over 1,000 MB/s.',
        'Audio tracks add minimal overhead: 24-bit 48kHz audio consumes less than 0.3 MB/s per track, so video codecs dominate 99% of bandwidth.',
      ]}
      faq={[
        {
          question: 'What is the difference between Mbps and MB/s?',
          answer: 'Mbps stands for Megabits per second (used by camera manufacturers to measure bitrates), while MB/s stands for Megabytes per second (used by drive makers and operating systems to measure disk speed). There are 8 bits in 1 Byte, so 800 Mbps equals 100 MB/s.',
        },
        {
          question: 'Why does my drive drop frames even though its benchmark speed is higher?',
          answer: 'Synthetic benchmarks measure peak sequential bursts. Video editing involves random timeline seeking, multiple audio streams, and thermal throttling over long sessions. Maintaining 25–30% headroom prevents frame drops.',
        },
        {
          question: 'Can I edit 4K ProRes directly off an external mechanical hard drive?',
          answer: 'A standard mechanical 7200 RPM external hard drive peaks around 120–140 MB/s under ideal conditions. While it can barely play a single 4K 24fps ProRes 422 stream (~63 MB/s), any scrubbing or multi-track work will cause stutter. An SSD is strongly recommended.',
        },
        {
          question: 'Does H.264/H.265 require faster drives than ProRes?',
          answer: 'No. H.264 and H.265 require significantly less drive speed (often under 20 MB/s), but they place massive decompression strain on your computer CPU and GPU, causing playback stutter due to processor bottlenecks rather than drive bandwidth.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
