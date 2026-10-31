import React, { useState } from 'react';
import { Copy, Check, HardDrive, Wifi, Cable, Clock, Gauge } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface FileTransferPageProps {
  navigate: (path: string) => void;
}

interface TransferMethod {
  id: string;
  name: string;
  nominalSpeed: string;
  realWorldMBps: number;
  defaultRttMs: number;
  defaultOverheadPct: number;
  category: 'cable' | 'wireless' | 'internet';
  note: string;
}

export const FileTransferPage: React.FC<FileTransferPageProps> = ({ navigate }) => {
  const [sizeVal, setSizeVal] = useState<number>(25);
  const [sizeUnit, setSizeUnit] = useState<'MB' | 'GB' | 'TB'>('GB');
  const [speedUnit, setSpeedUnit] = useState<'MB/s' | 'Mbps'>('MB/s');
  const [selectedMethodId, setSelectedMethodId] = useState<string>('usbc-10g');
  const [useCustomSpeed, setUseCustomSpeed] = useState<boolean>(false);
  const [customSpeedVal, setCustomSpeedVal] = useState<number>(125);
  const [rttMs, setRttMs] = useState<number>(1);
  const [overheadPct, setOverheadPct] = useState<number>(5);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'file-transfer-time-calculator') || LAUNCH_TOOLS[11];
  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'retina-image-size-calculator' || t.slug === 'iphone-charging-time-calculator'
  );
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'mastering-apple-shortcuts-ios') || POPULAR_GUIDES[0];

  const transferMethods: TransferMethod[] = [
    {
      id: 'usbc-10g',
      name: 'USB-C 3.2 (iPhone 16/15 Pro & SSD)',
      nominalSpeed: '10 Gbps rated',
      realWorldMBps: 950,
      defaultRttMs: 1,
      defaultOverheadPct: 5,
      category: 'cable',
      note: 'Requires a 10 Gbps USB-C 3.2 cable (not the standard USB 2.0 charging cable in the box).',
    },
    {
      id: 'airdrop-wifi6',
      name: 'AirDrop (Wi-Fi 6 Peer-to-Peer)',
      nominalSpeed: '1,200 Mbps link',
      realWorldMBps: 75,
      defaultRttMs: 8,
      defaultOverheadPct: 10,
      category: 'wireless',
      note: 'Direct wireless transfer between Apple devices held within 5 feet.',
    },
    {
      id: 'lightning-usb2',
      name: 'Lightning / Standard USB 2.0',
      nominalSpeed: '480 Mbps rated',
      realWorldMBps: 35,
      defaultRttMs: 2,
      defaultOverheadPct: 8,
      category: 'cable',
      note: 'Used on iPhone 14 and older, plus base iPhone 15 and 16 standard USB-C ports.',
    },
    {
      id: 'gigabit-fiber',
      name: 'Gigabit Fiber Internet / Ethernet',
      nominalSpeed: '1,000 Mbps',
      realWorldMBps: 125,
      defaultRttMs: 10,
      defaultOverheadPct: 10,
      category: 'internet',
      note: 'Wired gigabit LAN or fiber upload to cloud storage.',
    },
    {
      id: '5g-cellular',
      name: '5G Mobile Cellular (Good Signal)',
      nominalSpeed: '300 Mbps',
      realWorldMBps: 37.5,
      defaultRttMs: 35,
      defaultOverheadPct: 12,
      category: 'internet',
      note: 'Speed varies with tower distance and local network load.',
    },
    {
      id: 'home-wifi',
      name: 'Typical Home Wi-Fi (100 Mbps)',
      nominalSpeed: '100 Mbps',
      realWorldMBps: 12.5,
      defaultRttMs: 40,
      defaultOverheadPct: 12,
      category: 'internet',
      note: 'Standard residential broadband connection over Wi-Fi.',
    },
  ];

  const exampleChips = [
    '25 GB 4K ProRes Video via USB-C vs AirDrop',
    '10 GB Cloud Backup at 1000 Mbps with 10ms latency',
    '100 GB Folder via 100 Mbps Wi-Fi with 40ms latency',
  ];

  const getFileSizeInMB = () => {
    if (sizeUnit === 'TB') return sizeVal * 1024 * 1024;
    if (sizeUnit === 'GB') return sizeVal * 1024;
    return sizeVal;
  };

  const totalMB = getFileSizeInMB();
  const currentMethod = transferMethods.find((m) => m.id === selectedMethodId) || transferMethods[0];

  const rawBaseMBps = useCustomSpeed
    ? speedUnit === 'Mbps'
      ? Math.max(0.1, customSpeedVal / 8)
      : Math.max(0.1, customSpeedVal)
    : currentMethod.realWorldMBps;

  const formatSpeed = (mbpsVal: number) => {
    if (speedUnit === 'Mbps') {
      const bitsVal = mbpsVal * 8;
      return `${bitsVal >= 100 ? Math.round(bitsVal).toLocaleString() : bitsVal.toFixed(1)} Mbps`;
    }
    return `${mbpsVal >= 100 ? Math.round(mbpsVal).toLocaleString() : mbpsVal.toFixed(1)} MB/s`;
  };

  /**
   * Calculates transfer duration and effective speed factoring in:
   * - Protocol overhead (%) reducing usable payload bandwidth
   * - Round-trip time (RTT in ms) adding handshake and per-window acknowledgment latency
   */
  const calculateTransferMetrics = (baseMBps: number, latencyMs: number, overheadPercent: number) => {
    if (baseMBps <= 0 || totalMB <= 0) {
      return { totalSeconds: 0, effectiveMBps: 0, latencyPenaltySeconds: 0 };
    }
    const clampedOverhead = Math.min(80, Math.max(0, overheadPercent));
    const clampedRtt = Math.max(0, latencyMs);

    const payloadMBps = baseMBps * (1 - clampedOverhead / 100);
    const baseTransferSeconds = totalMB / Math.max(0.01, payloadMBps);

    // Round-trip latency delay across TCP/storage acknowledgment windows + initial handshakes
    const windowCycles = totalMB / 4;
    const latencyPenaltySeconds = (clampedRtt / 1000) * 3 + windowCycles * (clampedRtt / 1000) * 0.12;
    const totalSeconds = baseTransferSeconds + latencyPenaltySeconds;
    const effectiveMBps = totalMB / Math.max(0.001, totalSeconds);

    return {
      totalSeconds,
      effectiveMBps,
      latencyPenaltySeconds,
    };
  };

  const activeMetrics = calculateTransferMetrics(rawBaseMBps, rttMs, overheadPct);

  const formatDuration = (totalSec: number) => {
    if (totalSec < 1) return 'Under 1 sec';
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = Math.round(totalSec % 60);

    const parts = [];
    if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? 's' : ''}`);
    if (mins > 0) parts.push(`${mins} min${mins > 1 ? 's' : ''}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} sec`);
    return parts.join(' ');
  };

  const handleSelectMethod = (m: TransferMethod) => {
    setUseCustomSpeed(false);
    setSelectedMethodId(m.id);
    setRttMs(m.defaultRttMs);
    setOverheadPct(m.defaultOverheadPct);
  };

  const handleSpeedUnitSwitch = (newUnit: 'MB/s' | 'Mbps') => {
    if (newUnit === speedUnit) return;
    if (newUnit === 'Mbps') {
      setCustomSpeedVal(Math.round(customSpeedVal * 8));
    } else {
      setCustomSpeedVal(Math.max(1, Math.round(customSpeedVal / 8)));
    }
    setSpeedUnit(newUnit);
  };

  const handleCompute = (inputStr: string) => {
    const sizeMatch = inputStr.match(/(\d+(?:\.\d+)?)\s*(GB|MB|TB)/i);
    if (sizeMatch) {
      const num = parseFloat(sizeMatch[1]);
      if (num > 0) setSizeVal(num);
      const u = sizeMatch[2].toUpperCase() as 'MB' | 'GB' | 'TB';
      if (['MB', 'GB', 'TB'].includes(u)) setSizeUnit(u);
    }

    const rttMatch = inputStr.match(/(\d+)\s*ms/i);
    if (rttMatch) {
      setRttMs(parseInt(rttMatch[1], 10));
    }

    const comparisonText = transferMethods
      .map((m) => {
        const metrics = calculateTransferMetrics(m.realWorldMBps, rttMs, overheadPct);
        return `- **${m.name}:** ~${formatDuration(metrics.totalSeconds)} (${formatSpeed(metrics.effectiveMBps)} effective with ${rttMs} ms latency & ${overheadPct}% overhead)`;
      })
      .join('\n');

    const activeLabel = useCustomSpeed ? `Custom Speed (${formatSpeed(rawBaseMBps)})` : currentMethod.name;

    const resultText = `### File Transfer Time for ${sizeVal} ${sizeUnit} (${Math.round(totalMB).toLocaleString()} MB)

Selected Connection: **${activeLabel}**
- **Estimated Transfer Time:** ${formatDuration(activeMetrics.totalSeconds)}
- **Base Line Speed:** ${formatSpeed(rawBaseMBps)} (${(rawBaseMBps * 8).toFixed(0)} Mbps / ${rawBaseMBps.toFixed(1)} MB/s)
- **Latency & Overhead Settings:** ${rttMs} ms round-trip time, ${overheadPct}% protocol overhead
- **Effective Throughput:** ~${formatSpeed(activeMetrics.effectiveMBps)}

### Transfer Time Comparison Across Connections:
${comparisonText}`;

    return {
      result: resultText,
      rawData: {
        sizeVal,
        sizeUnit,
        speedUnit,
        rttMs,
        overheadPct,
        totalMB,
        methodName: activeLabel,
        formattedTime: formatDuration(activeMetrics.totalSeconds),
      },
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="File Transfer Time Calculator"
      subheading="Calculate data transfer time with round-trip latency (ms) and protocol overhead (%). Switch between MB/s, Mbps, and GB to compare realistic cable, Wi-Fi, and network speeds."
      inputLabel="File Size & Transfer Scenario"
      inputPlaceholder="e.g. 25 GB 4K video file at 1000 Mbps with 10ms latency..."
      examplePrompt={`${sizeVal} ${sizeUnit} via ${useCustomSpeed ? formatSpeed(rawBaseMBps) : currentMethod.name} (${rttMs} ms RTT, ${overheadPct}% overhead)`}
      exampleChips={exampleChips}
      generateButtonText="Calculate Transfer Time"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* File Size & Speed Units Switch (MB/s, Mbps, GB) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="file-size-num" className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                File Size (MB / GB / TB)
              </label>
              <div className="flex gap-2">
                <input
                  id="file-size-num"
                  type="number"
                  min="1"
                  max="100000"
                  value={sizeVal}
                  onChange={(e) => setSizeVal(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="flex-1 min-w-0 bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl px-3.5 py-2.5 text-sm text-[#f2f7ff] font-mono focus-ring"
                />
                <div className="grid grid-cols-3 gap-1 bg-[#0a1424] p-1 rounded-xl border border-[rgba(143,163,192,0.16)]">
                  {(['MB', 'GB', 'TB'] as const).map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setSizeUnit(unit)}
                      className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors focus-ring ${
                        sizeUnit === unit
                          ? 'bg-[#8b5cf6] text-[#050a14]'
                          : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="custom-speed-num" className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                Speed Units Switch (MB/s vs Mbps)
              </label>
              <div className="flex gap-2">
                <input
                  id="custom-speed-num"
                  type="number"
                  min="1"
                  max="100000"
                  value={useCustomSpeed ? customSpeedVal : Math.round(speedUnit === 'Mbps' ? currentMethod.realWorldMBps * 8 : currentMethod.realWorldMBps)}
                  onChange={(e) => {
                    setUseCustomSpeed(true);
                    setCustomSpeedVal(Math.max(1, parseFloat(e.target.value) || 1));
                  }}
                  aria-label="Speed value in selected unit"
                  className="flex-1 min-w-0 bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl px-3.5 py-2.5 text-sm text-[#f2f7ff] font-mono focus-ring"
                />
                <div className="grid grid-cols-2 gap-1 bg-[#0a1424] p-1 rounded-xl border border-[rgba(143,163,192,0.16)]">
                  {(['MB/s', 'Mbps'] as const).map((sUnit) => (
                    <button
                      key={sUnit}
                      type="button"
                      onClick={() => handleSpeedUnitSwitch(sUnit)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors focus-ring ${
                        speedUnit === sUnit
                          ? 'bg-[#8b5cf6] text-[#050a14]'
                          : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
                      }`}
                    >
                      {sUnit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Latency and Overhead Option */}
          <div className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8b5cf6] font-semibold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                <span>Latency and Overhead</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Local Cable (1ms / 5%)', rtt: 1, ovh: 5 },
                  { label: 'Wi-Fi / LAN (10ms / 10%)', rtt: 10, ovh: 10 },
                  { label: 'Cloud / WAN (50ms / 12%)', rtt: 50, ovh: 12 },
                  { label: 'Many Small Files (15ms / 22%)', rtt: 15, ovh: 22 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setRttMs(preset.rtt);
                      setOverheadPct(preset.ovh);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono border transition-colors focus-ring ${
                      rttMs === preset.rtt && overheadPct === preset.ovh
                        ? 'bg-[#101c33] border-[#8b5cf6] text-[#f2f7ff]'
                        : 'bg-[#050a14] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="rtt-ms-input" className="text-xs text-[#8fa3c0] flex justify-between">
                  <span>Round-Trip Time (Latency)</span>
                  <span className="font-mono text-[#f2f7ff]">{rttMs} ms</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="rtt-ms-input"
                    type="number"
                    min="0"
                    max="2000"
                    value={rttMs}
                    onChange={(e) => setRttMs(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-24 bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] font-mono focus-ring"
                  />
                  <span className="text-xs text-[#8fa3c0]">ms (0 ms for ideal, 10–150 ms for internet)</span>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="overhead-pct-input" className="text-xs text-[#8fa3c0] flex justify-between">
                  <span>Protocol Overhead</span>
                  <span className="font-mono text-[#f2f7ff]">{overheadPct}%</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="overhead-pct-input"
                    type="number"
                    min="0"
                    max="60"
                    value={overheadPct}
                    onChange={(e) => setOverheadPct(Math.min(60, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                    className="w-24 bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1.5 text-xs text-[#f2f7ff] font-mono focus-ring"
                  />
                  <span className="text-xs text-[#8fa3c0]">% (TCP/IP, TLS, SMB, or disk indexing)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Connection Presets (Click to Load Speed, Latency &amp; Overhead)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {transferMethods.map((m) => {
                const isSelected = !useCustomSpeed && selectedMethodId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMethod(m)}
                    className={`p-3 rounded-xl border text-left transition-colors focus-ring ${
                      isSelected
                        ? 'bg-[#101c33] border-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                        : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] hover:border-[rgba(143,163,192,0.3)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-[#8b5cf6]' : 'text-[#f2f7ff]'}`}>
                        {m.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8fa3c0] font-mono mt-0.5">
                      {formatSpeed(m.realWorldMBps)} · {m.defaultRttMs} ms RTT · {m.defaultOverheadPct}% overhead
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, onCopy, copied }) => {
        const activeLabel = useCustomSpeed ? `Custom Speed (${formatSpeed(rawBaseMBps)})` : currentMethod.name;
        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8b5cf6] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Transfer Estimate ({sizeVal} {sizeUnit} · {rttMs} ms RTT · {overheadPct}% Overhead)
                </span>
              </span>

              <button
                type="button"
                onClick={() => onCopy(result)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#8b5cf6] transition-colors focus-ring"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Details' : 'Copy All Comparisons'}</span>
              </button>
            </div>

            {/* Hero Result Banner */}
            <div className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(139,92,246,0.3)] shadow-[0_0_20px_rgba(139,92,246,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                  Estimated Transfer Time
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-[#8b5cf6]">
                  {formatDuration(activeMetrics.totalSeconds)}
                </div>
                <div className="text-xs text-[#8fa3c0]">
                  Transferring {sizeVal} {sizeUnit} ({Math.round(totalMB).toLocaleString()} MB) via {activeLabel}
                </div>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#101c33] text-[#5aa9ff] border border-[rgba(90,169,255,0.2)]">
                  ~{formatSpeed(activeMetrics.effectiveMBps)} Effective
                </span>
                <p className="text-[11px] text-[#8fa3c0] max-w-xs font-mono">
                  Base: {formatSpeed(rawBaseMBps)} | Latency: +{formatDuration(activeMetrics.latencyPenaltySeconds)}
                </p>
              </div>
            </div>

            {/* All Methods Comparison Table */}
            <div className="space-y-2 pt-2 border-t border-[rgba(143,163,192,0.12)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[#8b5cf6]" />
                <span>
                  Comparison for {sizeVal} {sizeUnit} (with {rttMs} ms Latency &amp; {overheadPct}% Overhead)
                </span>
              </span>

              <div className="space-y-2">
                {transferMethods.map((m) => {
                  const mMetrics = calculateTransferMetrics(m.realWorldMBps, rttMs, overheadPct);
                  const isCurrent = !useCustomSpeed && m.id === selectedMethodId;

                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors ${
                        isCurrent
                          ? 'bg-[#101c33] border-[#8b5cf6]'
                          : 'bg-[#0a1424] border-[rgba(143,163,192,0.14)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {m.category === 'cable' ? (
                          <Cable className="w-3.5 h-3.5 text-[#8b5cf6]" />
                        ) : (
                          <Wifi className="w-3.5 h-3.5 text-[#5aa9ff]" />
                        )}
                        <span className="text-xs font-medium text-[#f2f7ff]">{m.name}</span>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center font-mono">
                        <span className="text-[11px] text-[#8fa3c0]">~{formatSpeed(mMetrics.effectiveMBps)}</span>
                        <span className={`text-xs font-bold ${isCurrent ? 'text-[#8b5cf6]' : 'text-[#f2f7ff]'}`}>
                          {formatDuration(mMetrics.totalSeconds)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-4">
          <p>
            This file transfer calculator with latency estimates the real-world time needed to copy or upload files across USB-C cables, external SSDs, AirDrop, Wi-Fi, and broadband links. You can switch units between megabytes per second (MB/s), megabits per second (Mbps), and file sizes in MB, GB, or TB.
          </p>
          <p>
            Unlike basic calculators that divide file size by advertised line speed, this tool lets you adjust round-trip time (latency in ms) and protocol overhead (%). Network headers, encryption handshakes, and packet acknowledgements typically reduce raw line speed by 5% to 20%, and high latency slows down long-distance cloud transfers even on fast fiber connections.
          </p>

          {/* Worked Example Table */}
          <div className="pt-2 space-y-2">
            <h3 className="text-base font-bold text-[#f2f7ff]">
              Worked Example Table: Transfer Time with Latency and Overhead
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-[rgba(143,163,192,0.16)] bg-[#0a1424]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[rgba(143,163,192,0.2)] text-[#8fa3c0] font-mono text-xs">
                    <th className="p-3">File Size</th>
                    <th className="p-3">Connection (Mbps / MB/s)</th>
                    <th className="p-3">Latency &amp; Overhead</th>
                    <th className="p-3">Effective Speed</th>
                    <th className="p-3">Transfer Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(143,163,192,0.1)] text-[#f2f7ff]">
                  <tr>
                    <td className="p-3 font-mono">10 GB (10,240 MB)</td>
                    <td className="p-3">1,000 Mbps (125 MB/s)</td>
                    <td className="p-3 font-mono">10 ms RTT, 10% overhead</td>
                    <td className="p-3 font-mono text-[#5aa9ff]">~108.6 MB/s</td>
                    <td className="p-3 font-mono font-semibold text-[#8b5cf6]">1 min 34 sec</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">25 GB (25,600 MB)</td>
                    <td className="p-3">7,600 Mbps (950 MB/s USB-C)</td>
                    <td className="p-3 font-mono">1 ms RTT, 5% overhead</td>
                    <td className="p-3 font-mono text-[#5aa9ff]">~873.9 MB/s</td>
                    <td className="p-3 font-mono font-semibold text-[#8b5cf6]">29 sec</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">25 GB (25,600 MB)</td>
                    <td className="p-3">600 Mbps (75 MB/s AirDrop)</td>
                    <td className="p-3 font-mono">8 ms RTT, 10% overhead</td>
                    <td className="p-3 font-mono text-[#5aa9ff]">~66.0 MB/s</td>
                    <td className="p-3 font-mono font-semibold text-[#8b5cf6]">6 min 28 sec</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">100 GB (102,400 MB)</td>
                    <td className="p-3">100 Mbps (12.5 MB/s Wi-Fi)</td>
                    <td className="p-3 font-mono">40 ms RTT, 12% overhead</td>
                    <td className="p-3 font-mono text-[#5aa9ff]">~10.8 MB/s</td>
                    <td className="p-3 font-mono font-semibold text-[#8b5cf6]">2 hrs 38 mins 2 sec</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Enter file size and pick units',
          text: 'Type your file or folder size in MB, GB, or TB, and switch the speed unit between MB/s (megabytes per second) and Mbps (megabits per second).',
        },
        {
          step: 'Set latency and protocol overhead',
          text: 'Enter your round-trip time in milliseconds (ms) and protocol overhead percentage (%), or click one of the latency presets for cable, Wi-Fi, or cloud links.',
        },
        {
          step: 'Compare transfer time across methods',
          text: 'Click Calculate Transfer Time to compare your effective throughput and total duration across USB-C, AirDrop, Ethernet, and Wi-Fi.',
        },
      ]}
      workedExample={{
        title: 'Example: Uploading a 10 GB Backup Over 1,000 Mbps Fiber with 10 ms Latency',
        scenario: 'File Size: 10 GB (10,240 MB) | Speed: 1,000 Mbps (125 MB/s) | Latency: 10 ms RTT | Overhead: 10%',
        output: `1. Convert units: 10 GB = 10,240 MB. 1,000 Mbps ÷ 8 bits per byte = 125 MB/s raw bandwidth.
2. Apply 10% protocol overhead: 125 MB/s × 0.90 = 112.5 MB/s payload speed (91.0 seconds base transfer).
3. Add 10 ms round-trip latency across packet windows: +3.3 seconds of acknowledgment wait time.
4. Total Transfer Time: 94.3 seconds (~1 min 34 sec) at an effective speed of 108.6 MB/s.`,
      }}
      tips={[
        'Remember the 8-to-1 unit rule: Network speeds use megabits (Mbps), while file sizes use megabytes (MB) or gigabytes (GB). Divide Mbps by 8 to get your raw speed in MB/s.',
        'Check your USB-C cable rating: The standard charging cable included with phones usually runs at USB 2.0 speeds (480 Mbps, or ~35 MB/s). Use a 10 Gbps USB 3.2 cable for fast external SSD copies.',
        'Account for latency on distant servers: A 1 Gbps connection to a server 100 ms away transfers slower than 1 Gbps on a local 1 ms LAN because TCP waits for round-trip acknowledgements.',
        'Zip folders with thousands of small files first: Copying 10,000 small files adds metadata overhead for every file. Compressing them into one archive first cuts total transfer time.',
      ]}
      faq={[
        {
          question: 'How do I calculate data transfer time between two devices or over the internet?',
          answer:
            'To calculate data transfer time, convert your file size into megabytes (1 GB = 1,024 MB), convert your connection speed into megabytes per second (divide Mbps by 8 to get MB/s), and divide the file size by the effective speed after subtracting protocol overhead and latency delays.',
        },
        {
          question: 'Why should I use a file transfer calculator with latency instead of a basic speed formula?',
          answer:
            'A basic formula assumes data flows at full line speed from the first millisecond. Using a file transfer calculator with latency accounts for round-trip time (RTT in ms) and packet acknowledgements, which explains why copying files to a distant cloud server is slower than copying over a local cable at the same bandwidth.',
        },
        {
          question: 'How does this work as a file copy speed calculator for USB drives and external SSDs?',
          answer:
            'You can use this tool as a local file copy speed calculator by selecting a cable preset (such as USB-C 3.2 or USB 2.0) or switching the speed unit to MB/s, setting round-trip latency to 1 ms, and setting protocol overhead to 5% to reflect file system indexing.',
        },
        {
          question: 'What is the difference between Mbps and MB/s when checking transfer time?',
          answer:
            'Internet providers advertise speeds in megabits per second (Mbps), while computers measure files in megabytes (MB) or gigabytes (GB). Because there are 8 bits in 1 byte, a 100 Mbps connection has a maximum raw speed of 12.5 MB/s before overhead, which directly affects your total transfer time.',
        },
        {
          question: 'Why does copying thousands of small files increase transfer time compared to one large file?',
          answer:
            'Every individual file requires the operating system or network protocol to open, verify, and close metadata records. When moving thousands of small photos or code files, those extra round-trips add overhead. Zipping small files into a single archive before copying reduces total transfer time.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
