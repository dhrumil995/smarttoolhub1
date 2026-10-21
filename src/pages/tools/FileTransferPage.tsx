import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, HardDrive, Wifi, Cable, Clock } from 'lucide-react';
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
  category: 'cable' | 'wireless' | 'internet';
  note: string;
}

export const FileTransferPage: React.FC<FileTransferPageProps> = ({ navigate }) => {
  const [sizeVal, setSizeVal] = useState<number>(25);
  const [sizeUnit, setSizeUnit] = useState<'MB' | 'GB' | 'TB'>('GB');
  const [selectedMethodId, setSelectedMethodId] = useState<string>('usbc-10g');

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'file-transfer-time-calculator') || LAUNCH_TOOLS[11];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'retina-image-size-calculator' || t.slug === 'iphone-charging-time-calculator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'mastering-apple-shortcuts-ios') || POPULAR_GUIDES[0];

  const transferMethods: TransferMethod[] = [
    {
      id: 'usbc-10g',
      name: 'USB-C 3.2 (iPhone 16/15 Pro & SSD)',
      nominalSpeed: '10 Gbps theoretical',
      realWorldMBps: 950,
      category: 'cable',
      note: 'Requires a 10Gbps USB-C cable (not the standard Apple white woven charging cable).',
    },
    {
      id: 'airdrop-wifi6',
      name: 'AirDrop (Wi-Fi 6 Peer-to-Peer)',
      nominalSpeed: '1,200 Mbps theoretical',
      realWorldMBps: 75,
      category: 'wireless',
      note: 'Fastest wireless transfer between Apple devices when held within 5 feet.',
    },
    {
      id: 'lightning-usb2',
      name: 'Lightning / Standard USB 2.0',
      nominalSpeed: '480 Mbps theoretical',
      realWorldMBps: 35,
      category: 'cable',
      note: 'Used on iPhone 14 & older, plus base iPhone 15/16 standard USB-C port.',
    },
    {
      id: 'gigabit-fiber',
      name: 'Gigabit Fiber Internet / Ethernet',
      nominalSpeed: '1,000 Mbps',
      realWorldMBps: 110,
      category: 'internet',
      note: 'High-speed cloud backup to iCloud Drive or Google Drive.',
    },
    {
      id: '5g-cellular',
      name: '5G Mobile Cellular (Good Signal)',
      nominalSpeed: '300-500 Mbps',
      realWorldMBps: 38,
      category: 'internet',
      note: 'Real-world speed varies with network congestion and tower distance.',
    },
    {
      id: 'home-wifi',
      name: 'Typical Home Wi-Fi (100 Mbps)',
      nominalSpeed: '100 Mbps',
      realWorldMBps: 11,
      category: 'internet',
      note: 'Standard residential internet download/upload speed.',
    },
  ];

  const exampleChips = [
    '25 GB 4K ProRes Video via USB-C vs AirDrop',
    '2 GB Photo Album (500 photos) via Lightning vs Wi-Fi',
    '100 GB Full iPhone Backup via Gigabit Fiber',
  ];

  // Convert everything to Megabytes (MB)
  const getFileSizeInMB = () => {
    if (sizeUnit === 'TB') return sizeVal * 1024 * 1024;
    if (sizeUnit === 'GB') return sizeVal * 1024;
    return sizeVal;
  };

  const totalMB = getFileSizeInMB();
  const currentMethod = transferMethods.find((m) => m.id === selectedMethodId) || transferMethods[0];

  const calculateSecondsForMBps = (mbps: number) => {
    if (mbps <= 0) return 0;
    return totalMB / mbps;
  };

  const activeSeconds = calculateSecondsForMBps(currentMethod.realWorldMBps);

  const formatDuration = (totalSec: number) => {
    if (totalSec < 1) return 'Under 1 second';
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = Math.round(totalSec % 60);

    const parts = [];
    if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? 's' : ''}`);
    if (mins > 0) parts.push(`${mins} min${mins > 1 ? 's' : ''}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} sec`);
    return parts.join(' ');
  };

  const handleCompute = (inputStr: string) => {
    // Check if input has gigabyte/megabyte numbers
    const match = inputStr.match(/(\d+)\s*(GB|MB|TB)?/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > 0) setSizeVal(num);
      if (match[2]) {
        const u = match[2].toUpperCase() as 'MB' | 'GB' | 'TB';
        if (['MB', 'GB', 'TB'].includes(u)) setSizeUnit(u);
      }
    }

    const comparisonText = transferMethods
      .map((m) => {
        const sec = calculateSecondsForMBps(m.realWorldMBps);
        return `- **${m.name}:** ~${formatDuration(sec)} (${m.realWorldMBps} MB/s real-world)`;
      })
      .join('\n');

    const resultText = `### File Transfer Time for ${sizeVal} ${sizeUnit} (${Math.round(totalMB).toLocaleString()} MB)

Selected Method: **${currentMethod.name}**
- **Estimated Time:** ${formatDuration(activeSeconds)}
- **Honest Typical Speed:** ~${currentMethod.realWorldMBps} MB/s (accounting for protocol overhead & real-world storage throughput)
- **Note:** ${currentMethod.note}

### Full Transfer Speed Comparison:
${comparisonText}`;

    return {
      result: resultText,
      rawData: {
        sizeVal,
        sizeUnit,
        totalMB,
        methodName: currentMethod.name,
        formattedTime: formatDuration(activeSeconds),
      },
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="File Transfer Time Calculator"
      subheading="Calculate realistic file transfer times for AirDrop, USB-C 3.2, Lightning, Wi-Fi, and 5G. Features honest real-world transfer speeds instead of fake theoretical maximums."
      inputLabel="File Size & Units"
      inputPlaceholder="e.g. 25 GB 4K video file..."
      examplePrompt={`${sizeVal} ${sizeUnit} via ${currentMethod.name}`}
      exampleChips={exampleChips}
      generateButtonText="Calculate Transfer Speeds"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* File Size Input with Unit Selector */}
          <div className="space-y-1.5">
            <label htmlFor="file-size-num" className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
              File or Folder Size
            </label>
            <div className="flex gap-2">
              <input
                id="file-size-num"
                type="number"
                min="1"
                max="100000"
                value={sizeVal}
                onChange={(e) => setSizeVal(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="flex-1 bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl px-3.5 py-2.5 text-sm text-[#f2f7ff] font-mono focus-ring"
              />
              <div className="grid grid-cols-3 gap-1 bg-[#0a1424] p-1 rounded-xl border border-[rgba(143,163,192,0.16)]">
                {(['MB', 'GB', 'TB'] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setSizeUnit(unit)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors focus-ring ${
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

          {/* Transfer Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Connection / Transfer Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {transferMethods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMethodId(m.id)}
                  className={`p-3 rounded-xl border text-left transition-colors focus-ring ${
                    selectedMethodId === m.id
                      ? 'bg-[#101c33] border-[#8b5cf6] shadow-[0_0_12px_rgba(139, 92, 246,0.15)]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] hover:border-[rgba(143,163,192,0.3)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${selectedMethodId === m.id ? 'text-[#8b5cf6]' : 'text-[#f2f7ff]'}`}>
                      {m.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8fa3c0] font-mono mt-0.5">
                    Real-world: ~{m.realWorldMBps} MB/s · {m.nominalSpeed}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, onCopy, copied }) => {
        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8b5cf6] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Transfer Estimate ({sizeVal} {sizeUnit})</span>
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
            <div className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(139, 92, 246,0.3)] shadow-[0_0_20px_rgba(139, 92, 246,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                  Estimated Transfer Time
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-[#8b5cf6]">
                  {formatDuration(activeSeconds)}
                </div>
                <div className="text-xs text-[#8fa3c0]">
                  Transferring {sizeVal} {sizeUnit} via {currentMethod.name}
                </div>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#101c33] text-[#5aa9ff] border border-[rgba(90,169,255,0.2)]">
                  ~{currentMethod.realWorldMBps} MB/s Actual
                </span>
                <p className="text-[10px] text-[#8fa3c0] max-w-xs">
                  {currentMethod.note}
                </p>
              </div>
            </div>

            {/* All Methods Comparison Table */}
            <div className="space-y-2 pt-2 border-t border-[rgba(143,163,192,0.12)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[#8b5cf6]" />
                <span>Speed Comparison for {sizeVal} {sizeUnit} Across All Methods</span>
              </span>

              <div className="space-y-2">
                {transferMethods.map((m) => {
                  const s = calculateSecondsForMBps(m.realWorldMBps);
                  const isCurrent = m.id === selectedMethodId;

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
                        <span className="text-[11px] text-[#8fa3c0]">{m.realWorldMBps} MB/s</span>
                        <span className={`text-xs font-bold ${isCurrent ? 'text-[#8b5cf6]' : 'text-[#f2f7ff]'}`}>
                          {formatDuration(s)}
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
        <div className="space-y-3">
          <p>
            The File Transfer Time Calculator estimates the honest, real-world time required to move photos, 4K ProRes videos, and device backups across AirDrop, USB-C cables, Lightning, and home broadband.
          </p>
          <p>
            Cable and router manufacturers love advertising theoretical burst speeds like "10 Gbps" or "480 Mbps". In practice, protocol handshakes, disk write speeds, thermal throttling, and packet verification mean you usually get 70% to 80% of theoretical throughput. This calculator provides realistic benchmarks measured with actual Apple devices so you never wonder why a file transfer is taking longer than expected.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Enter your file or folder size',
          text: 'Type your file size and select MB, GB, or TB (for example, 25 GB for a ProRes video).',
        },
        {
          step: 'Choose your transfer method',
          text: 'Select USB-C 3.2, AirDrop, Lightning, Gigabit Fiber, or 5G to see the calibrated real-world speed.',
        },
        {
          step: 'Compare transfer options',
          text: 'Review the side-by-side comparison table below to determine whether plugging in a cable is worth the time savings over wireless AirDrop.',
        },
      ]}
      workedExample={{
        title: 'Example: Moving a 50 GB 4K Video Project from iPhone 16 Pro to Mac',
        scenario: 'Comparing USB-C 10Gbps cable vs. AirDrop Wi-Fi 6 vs. an older Lightning cable.',
        output: `### Transfer Times for 50 GB (51,200 MB):
1. USB-C 3.2 (10Gbps Cable): ~54 seconds (950 MB/s actual write speed to Mac NVMe SSD)
2. AirDrop Wi-Fi 6: ~11 minutes 22 seconds (75 MB/s sustained peer-to-peer Wi-Fi)
3. Lightning / USB 2.0: ~24 minutes 23 seconds (35 MB/s legacy interface limit)

Verdict: Using a 10Gbps USB-C cable is over 12 times faster than AirDrop and 27 times faster than Lightning.`,
      }}
      tips={[
        'Check your USB-C cable speed: The white braided USB-C cable that comes in the iPhone box is only rated for USB 2.0 (480 Mbps); to get 10Gbps speeds, you need a dedicated Thunderbolt or USB 3.2 cable.',
        'Keep devices within 5 feet for AirDrop: AirDrop uses Bluetooth to discover devices and direct Wi-Fi for transfer; staying close prevents channel fallback and packet loss.',
        'Zipping thousands of tiny files first: Transferring 10,000 tiny photos takes significantly longer than one single 10 GB archive due to file system indexing overhead.',
        'Base iPhone 15 and 16 ports are USB 2.0: Only the "Pro" and "Pro Max" models feature high-speed USB 3 controllers (10 Gbps); base models transfer at standard 480 Mbps cable speeds.',
      ]}
      faq={[
        {
          question: 'Why is real-world transfer speed slower than the rated cable speed?',
          answer: 'Rated speeds (like 10 Gbps) describe maximum raw signalling bandwidth. After accounting for USB encoding overhead, file system metadata, and target SSD sustained write speeds, real-world speeds typically hover around 900 to 1,000 MB/s.',
        },
        {
          question: 'Does the cable included in the iPhone box support high-speed transfers?',
          answer: 'No. The cable included in the box is designed primarily for charging and runs at USB 2.0 speeds (up to 480 Mbps). To achieve 10 Gbps on an iPhone 15 Pro or 16 Pro, you must purchase a USB 3.2 Gen 2 or Thunderbolt cable.',
        },
        {
          question: 'Is AirDrop faster than a standard Lightning cable?',
          answer: 'Yes! AirDrop over Wi-Fi 6 routinely achieves sustained speeds of 60 to 80 MB/s, which is more than double the ~35 MB/s maximum speed of a physical Lightning cable.',
        },
        {
          question: 'Are my file names or directory details stored anywhere?',
          answer: 'No files or file names are ever uploaded to a server. All calculations run strictly in your browser using local mathematical formulas.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
