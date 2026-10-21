import React, { useState } from 'react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { ScanLine, ArrowLeftRight, BatteryCharging } from 'lucide-react';

interface QuickCalculatorsPageProps {
  navigate: (path: string) => void;
}

export const QuickCalculatorsPage: React.FC<QuickCalculatorsPageProps> = ({ navigate }) => {
  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'quick-calculators') || LAUNCH_TOOLS[7];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'formula-helper' || t.slug === 'apple-shortcuts-generator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'build-first-iphone-shortcut') || POPULAR_GUIDES[0];

  // Interactive Calculator State
  const [activeTab, setActiveTab] = useState<'retina' | 'transfer' | 'battery'>('retina');

  // 1. Retina State
  const [baseWidth, setBaseWidth] = useState<number>(320);
  const [baseHeight, setBaseHeight] = useState<number>(240);

  // 2. Transfer State
  const [fileSizeVal, setFileSizeVal] = useState<number>(500);
  const [fileSizeUnit, setFileSizeUnit] = useState<'MB' | 'GB'>('MB');
  const [speedVal, setSpeedVal] = useState<number>(50); // Mbps

  // 3. Battery State
  const [batteryCap, setBatteryCap] = useState<number>(4500); // mAh
  const [chargerWatts, setChargerWatts] = useState<number>(30); // W
  const [startPct, setStartPct] = useState<number>(10);
  const [targetPct, setTargetPct] = useState<number>(80);

  // Calculations
  // Transfer time: File size in megabits / speed in Mbps
  const sizeInMegabits = fileSizeUnit === 'GB' ? fileSizeVal * 1024 * 8 : fileSizeVal * 8;
  const transferSeconds = speedVal > 0 ? sizeInMegabits / speedVal : 0;
  const transferMinutes = (transferSeconds / 60).toFixed(1);

  // Battery time: (Capacity in Ah * 3.85V * efficiency / Watts) * fraction
  // Capacity Ah = mAh / 1000. Energy Wh = Ah * 3.85V.
  const energyWh = (batteryCap / 1000) * 3.85;
  const fractionNeeded = Math.max(0, targetPct - startPct) / 100;
  const energyNeededWh = energyWh * fractionNeeded;
  // Factor 0.85 efficiency / thermal throttling
  const effectiveWatts = chargerWatts * 0.85;
  const chargeHours = effectiveWatts > 0 ? energyNeededWh / effectiveWatts : 0;
  const chargeMinutes = Math.round(chargeHours * 60);

  const interactiveCalculatorWidget = (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(52, 224, 161,0.25)] space-y-4 mb-4">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[rgba(143,163,192,0.12)] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('retina')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'retina'
              ? 'bg-[#34e0a1] text-[#050a14]'
              : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
          }`}
        >
          <ScanLine className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retina Image Sizes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transfer')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'transfer'
              ? 'bg-[#34e0a1] text-[#050a14]'
              : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Transfer Time</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('battery')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'battery'
              ? 'bg-[#34e0a1] text-[#050a14]'
              : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
          }`}
        >
          <BatteryCharging className="w-3.5 h-3.5" />
          <span>Battery Charge Time</span>
        </button>
      </div>

      {/* Widget 1: Retina */}
      {activeTab === 'retina' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#8fa3c0]">Base Width (@1x px)</label>
              <input
                type="number"
                value={baseWidth}
                onChange={(e) => setBaseWidth(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm text-[#f2f7ff] focus-ring mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#8fa3c0]">Base Height (@1x px)</label>
              <input
                type="number"
                value={baseHeight}
                onChange={(e) => setBaseHeight(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm text-[#f2f7ff] focus-ring mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.12)]">
              <div className="font-mono text-[#8fa3c0]">@1x Standard</div>
              <div className="font-bold text-[#f2f7ff] mt-0.5">{baseWidth} &times; {baseHeight}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#101c33] border border-[rgba(52, 224, 161,0.3)]">
              <div className="font-mono text-[#34e0a1]">@2x Retina</div>
              <div className="font-bold text-[#f2f7ff] mt-0.5">{baseWidth * 2} &times; {baseHeight * 2}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.12)]">
              <div className="font-mono text-[#5aa9ff]">@3x Super Retina</div>
              <div className="font-bold text-[#f2f7ff] mt-0.5">{baseWidth * 3} &times; {baseHeight * 3}</div>
            </div>
          </div>
        </div>
      )}

      {/* Widget 2: File Transfer */}
      {activeTab === 'transfer' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#8fa3c0]">File Size</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={fileSizeVal}
                  onChange={(e) => setFileSizeVal(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm text-[#f2f7ff] focus-ring"
                />
                <select
                  value={fileSizeUnit}
                  onChange={(e) => setFileSizeUnit(e.target.value as any)}
                  className="bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl px-2 text-sm text-[#f2f7ff] focus-ring"
                >
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#8fa3c0]">Internet Speed (Mbps)</label>
              <input
                type="number"
                value={speedVal}
                onChange={(e) => setSpeedVal(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm text-[#f2f7ff] focus-ring mt-1"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#101c33] border border-[rgba(52, 224, 161,0.3)] flex items-center justify-between text-xs">
            <span className="text-[#8fa3c0]">Estimated Download Time:</span>
            <span className="font-mono font-bold text-sm text-[#34e0a1]">
              {transferSeconds < 60 ? `${Math.round(transferSeconds)} seconds` : `${transferMinutes} minutes`}
            </span>
          </div>
        </div>
      )}

      {/* Widget 3: Battery Charging */}
      {activeTab === 'battery' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#8fa3c0]">Battery Capacity (mAh)</label>
              <input
                type="number"
                value={batteryCap}
                onChange={(e) => setBatteryCap(Math.max(100, Number(e.target.value)))}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm text-[#f2f7ff] focus-ring mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#8fa3c0]">Charger Power (Watts)</label>
              <input
                type="number"
                value={chargerWatts}
                onChange={(e) => setChargerWatts(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm text-[#f2f7ff] focus-ring mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#8fa3c0]">Current Battery %</label>
              <input
                type="number"
                min="0"
                max="99"
                value={startPct}
                onChange={(e) => setStartPct(Math.min(99, Math.max(0, Number(e.target.value))))}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl p-2 text-sm text-[#f2f7ff] focus-ring mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#8fa3c0]">Target Battery %</label>
              <input
                type="number"
                min="1"
                max="100"
                value={targetPct}
                onChange={(e) => setTargetPct(Math.min(100, Math.max(1, Number(e.target.value))))}
                className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl p-2 text-sm text-[#f2f7ff] focus-ring mt-1"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#101c33] border border-[rgba(52, 224, 161,0.3)] flex items-center justify-between text-xs">
            <span className="text-[#8fa3c0]">Estimated Charging Time:</span>
            <span className="font-mono font-bold text-sm text-[#34e0a1]">
              ~{chargeMinutes} minutes ({startPct}% &rarr; {targetPct}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Quick Utilities Calculator"
      subheading="Instant calculators for Retina image pixel dimensions (@2x and @3x), file transfer download times, and phone/laptop battery charging duration."
      inputLabel="Ask a custom math or conversion question"
      inputPlaceholder="e.g. How long to transfer 120 GB at 300 Mbps download speed?"
      examplePrompt="Calculate image dimensions for a hero banner measuring 1200x600 in CSS at @1x, @2x, and @3x display density with HTML picture tag."
      generateButtonText="Calculate with AI"
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={interactiveCalculatorWidget}
      whatItDoesContent={
        <>
          <p>
            The Quick Utilities Calculator provides fast interactive math for everyday digital tasks that web designers, creators, and phone owners encounter constantly.
          </p>
          <p>
            Use the instant widgets above for zero-latency calculations directly in your browser, or type any custom conversion question in the box below to have the AI breakdown the exact math step by step.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Choose your calculation mode',
          text: 'Select Retina image dimensions, file transfer speed, or battery charging time from the interactive tabs.',
        },
        {
          step: 'Adjust your values',
          text: 'Slide or type your numbers; calculations update instantly without needing to reload.',
        },
        {
          step: 'Copy the results or code snippets',
          text: 'Grab exact pixel dimensions, download ETAs, or generated HTML srcset code directly.',
        },
      ]}
      workedExample={{
        title: 'Example: High-DPI Retina Banner Assets',
        scenario: 'A card component has CSS layout size 360px wide by 240px tall.',
        output: `### Retina Asset Specifications:
- **@1x Base:** 360 &times; 240 px (Standard displays)
- **@2x Retina:** 720 &times; 480 px (iPhones, MacBooks, Retina screens)
- **@3x Super Retina:** 1080 &times; 720 px (iPhone Pro, high-density Android)

### Responsive HTML <picture> Snippet:
<img 
  src="card.webp" 
  srcset="card.webp 1x, card@2x.webp 2x, card@3x.webp 3x" 
  width="360" 
  height="240" 
  alt="Card preview" 
  loading="lazy" 
/>`,
      }}
      tips={[
        'Always specify image width and height in HTML: This prevents layout shift (CLS) while responsive Retina images load.',
        'Internet speeds are in bits, files in bytes: Remember 1 Byte = 8 bits (e.g., a 100 Mbps connection transfers about 12.5 MB per second).',
        'Batteries charge slower after 80%: Most smartphones throttle charge wattage above 80% to protect lithium longevity.',
        'Use WebP or AVIF format: Modern image formats reduce Retina @2x file weight by 40% to 60%.',
      ]}
      faq={[
        {
          question: 'Do the interactive calculators require an internet connection?',
          answer: 'No. The interactive tabs run completely client-side in your browser using JavaScript math with zero latency.',
        },
        {
          question: 'Why does my download take longer than the calculated time in real life?',
          answer: 'Real-world internet connections experience Wi-Fi packet loss, server bandwidth caps, and TCP protocol overhead (typically 10-15%).',
        },
        {
          question: 'Why do I need @3x images if @2x looks sharp?',
          answer: 'Flagship devices like the iPhone 15/16 Pro have screen densities exceeding 460 PPI, where @3x assets prevent micro-blur on high-contrast text and icons.',
        },
        {
          question: 'Can I calculate charging times for electric vehicles (EVs) or power banks?',
          answer: 'Yes! Simply enter the battery capacity in mAh (or type the kWh capacity in the custom prompt box below) and the charger wattage.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
