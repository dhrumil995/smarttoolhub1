import React, { useState, useMemo } from 'react';
import { Gauge, BatteryCharging, AlertTriangle, CheckCircle2, ShieldCheck, Info, Laptop, Smartphone, Tablet, RefreshCw, HelpCircle, Copy, Check, BatteryMedium } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface BatteryWearCalculatorPageProps {
  navigate: (path: string) => void;
}

export const BatteryWearCalculatorPage: React.FC<BatteryWearCalculatorPageProps> = ({ navigate }) => {
  const [unit, setUnit] = useState<'mAh' | 'Wh'>('Wh');
  const [designCapacity, setDesignCapacity] = useState<string>('70');
  const [currentCapacity, setCurrentCapacity] = useState<string>('58');
  const [cycleCount, setCycleCount] = useState<string>('320');
  const [deviceType, setDeviceType] = useState<'laptop' | 'phone' | 'tablet'>('laptop');
  const [copiedResult, setCopiedResult] = useState<boolean>(false);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'battery-wear-calculator') || {
    id: 'battery-wear-calculator',
    name: 'Battery Wear Calculator',
    slug: 'battery-wear-calculator',
    description: 'Calculate laptop and phone battery wear, health percentage, and capacity degradation from design capacity and full-charge readings.',
    category: 'Calculators',
    icon: 'Gauge',
    type: 'client',
    keywords: ['battery wear calculator', 'laptop battery health check', 'battery degradation percentage', 'phone battery wear calculation', 'powercfg battery health'],
    relatedToolSlugs: ['iphone-charging-time-calculator', 'iphone-battery-health-forecast'],
    guideSlug: 'better-prompts-simple-rules',
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'iphone-charging-time-calculator' || t.slug === 'iphone-battery-health-forecast' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  const exampleChips = [
    'Laptop: 70 Wh design, 58 Wh current full charge',
    'Smartphone: 5000 mAh design, 4200 mAh current full charge',
    'MacBook: 5100 mAh design, 4650 mAh current full charge',
  ];

  const handleApplyPreset = (dCap: string, cCap: string, u: 'mAh' | 'Wh', dev: 'laptop' | 'phone' | 'tablet', cycles: string) => {
    setDesignCapacity(dCap);
    setCurrentCapacity(cCap);
    setUnit(u);
    setDeviceType(dev);
    setCycleCount(cycles);
  };

  const calculation = useMemo(() => {
    const design = parseFloat(designCapacity);
    const current = parseFloat(currentCapacity);
    const cycles = parseInt(cycleCount, 10);

    if (isNaN(design) || design <= 0 || isNaN(current) || current <= 0) {
      return null;
    }

    const healthPercent = Math.min(Math.round((current / design) * 1000) / 10, 110);
    const wearPercent = healthPercent >= 100 ? 0 : Math.round((100 - healthPercent) * 10) / 10;
    const capacityLost = Math.max(0, Math.round((design - current) * 10) / 10);

    let status: 'excellent' | 'good' | 'moderate' | 'replace';
    let statusLabel: string;
    let statusColor: string;
    let verdict: string;

    if (healthPercent >= 88) {
      status = 'excellent';
      statusLabel = 'Excellent Condition';
      statusColor = '#34e0a1'; // Mint
      verdict = 'Battery capacity is very close to factory specification. Run time and power delivery remain near optimal.';
    } else if (healthPercent >= 78) {
      status = 'good';
      statusLabel = 'Normal Aging';
      statusColor = '#0a84ff'; // Blue
      verdict = 'Typical degradation for regular device usage. You may notice slightly shorter runtime under heavy workloads.';
    } else if (healthPercent >= 65) {
      status = 'moderate';
      statusLabel = 'Noticeable Wear';
      statusColor = '#ffb840'; // Amber
      verdict = 'Significant capacity loss. Your device likely drains much faster and may drop abruptly under peak processor load.';
    } else {
      status = 'replace';
      statusLabel = 'Service or Replace Soon';
      statusColor = '#ff5c7a'; // Coral
      verdict = 'Degradation is severe. Battery cells may have elevated internal resistance, risking sudden shutdowns. Servicing or replacing the pack is recommended.';
    }

    return {
      design,
      current,
      healthPercent,
      wearPercent,
      capacityLost,
      cycles: isNaN(cycles) ? null : cycles,
      status,
      statusLabel,
      statusColor,
      verdict,
    };
  }, [designCapacity, currentCapacity, cycleCount]);

  const handleCopySummary = async () => {
    if (!calculation) return;
    const text = `Battery Health Summary:
• Health: ${calculation.healthPercent}% (${calculation.statusLabel})
• Wear: ${calculation.wearPercent}%
• Design Capacity: ${calculation.design} ${unit}
• Full-Charge Capacity: ${calculation.current} ${unit}
• Capacity Lost: ${calculation.capacityLost} ${unit}
${calculation.cycles ? `• Charge Cycles: ${calculation.cycles}\n` : ''}• Verdict: ${calculation.verdict}
Note: Calculated software estimate. Steps and menu names can vary by version.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    } catch {
      // Handled
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Battery Wear Calculator"
      subheading="Calculate battery degradation, remaining health percentage, and lost capacity for laptops and phones from your system’s reported design and full-charge values."
      inputLabel="Battery Capacity Calculation"
      inputPlaceholder="Configure battery numbers above..."
      examplePrompt="Laptop: 70 Wh design, 58 Wh current full charge"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => {
        if (!calculation) {
          return { result: 'Please enter valid positive numbers for both Design Capacity and Full-Charge Capacity.' };
        }
        return {
          result: `Battery Health: ${calculation.healthPercent}% (${calculation.statusLabel})
Wear Level: ${calculation.wearPercent}%
Design Capacity: ${calculation.design} ${unit}
Full-Charge Capacity: ${calculation.current} ${unit}
Capacity Lost: ${calculation.capacityLost} ${unit}
${calculation.cycles ? `Charge Cycles: ${calculation.cycles}\n` : ''}
Verdict:
${calculation.verdict}

Estimate Notice:
This calculation is an estimate based on software reporting. Actual lithium battery chemistry varies with temperature, cell balance, and charging voltage. Steps and menu names can vary by version.`,
        };
      }}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#9aaccb] uppercase">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('70', '58', 'Wh', 'laptop', '320')}
              className="px-3 py-1.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[#0a84ff] text-xs font-mono text-[#f2f7ff] transition-all focus-ring"
            >
              Laptop (70Wh)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('5000', '4200', 'mAh', 'phone', '450')}
              className="px-3 py-1.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[#0a84ff] text-xs font-mono text-[#f2f7ff] transition-all focus-ring"
            >
              Phone (5000mAh)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('5100', '4650', 'mAh', 'laptop', '180')}
              className="px-3 py-1.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] hover:border-[#0a84ff] text-xs font-mono text-[#f2f7ff] transition-all focus-ring"
            >
              MacBook (5100mAh)
            </button>
          </div>

          {/* Configuration Form Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase text-[#0a84ff] font-bold flex items-center gap-1.5">
                <Gauge className="w-4 h-4" />
                <span>1. Enter Battery Capacities</span>
              </span>

              {/* Unit Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#050a14] rounded-xl border border-[rgba(143,163,192,0.12)]">
                <button
                  type="button"
                  onClick={() => setUnit('Wh')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all focus-ring ${
                    unit === 'Wh'
                      ? 'bg-[#101c33] text-[#0a84ff] border border-[rgba(10,132,255,0.3)] shadow-sm'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  Watt-hours (Wh / mWh)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('mAh')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all focus-ring ${
                    unit === 'mAh'
                      ? 'bg-[#101c33] text-[#0a84ff] border border-[rgba(10,132,255,0.3)] shadow-sm'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  Milliamp-hours (mAh)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Design Capacity */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#9aaccb] flex items-center justify-between">
                  <span>Design Capacity</span>
                  <span className="text-[10px] text-[#6c7dff]">Factory Spec</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={designCapacity}
                    onChange={(e) => setDesignCapacity(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#f2f7ff] focus-ring pr-12"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#9aaccb]">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Current Full Charge */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#9aaccb] flex items-center justify-between">
                  <span>Full-Charge Capacity</span>
                  <span className="text-[10px] text-[#34e0a1]">Current Reading</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={currentCapacity}
                    onChange={(e) => setCurrentCapacity(e.target.value)}
                    placeholder="e.g. 58"
                    className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#f2f7ff] focus-ring pr-12"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#9aaccb]">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Cycle Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#9aaccb] flex items-center justify-between">
                  <span>Cycle Count (optional)</span>
                  <span className="text-[10px] text-[#9aaccb]">Completed Cycles</span>
                </label>
                <input
                  type="number"
                  value={cycleCount}
                  onChange={(e) => setCycleCount(e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#f2f7ff] focus-ring"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          {calculation && (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase text-[#0a84ff] font-bold flex items-center gap-1.5">
                  <BatteryMedium className="w-4 h-4" />
                  <span>2. Battery Health & Wear Analysis</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs font-mono text-[#f2f7ff] hover:border-[#0a84ff] transition-all focus-ring"
                >
                  {copiedResult ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                      <span className="text-[#34e0a1]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Report</span>
                    </>
                  )}
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] space-y-1">
                  <span className="text-[11px] font-mono uppercase text-[#9aaccb]">Health</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: calculation.statusColor }}>
                    {calculation.healthPercent}%
                  </div>
                  <span className="text-[10px] font-medium text-[#9aaccb] block line-clamp-1">
                    {calculation.statusLabel}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] space-y-1">
                  <span className="text-[11px] font-mono uppercase text-[#9aaccb]">Wear Level</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#ffb840]">
                    {calculation.wearPercent}%
                  </div>
                  <span className="text-[10px] font-medium text-[#9aaccb] block">
                    Capacity degraded
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] space-y-1">
                  <span className="text-[11px] font-mono uppercase text-[#9aaccb]">Capacity Lost</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#ff5c7a]">
                    -{calculation.capacityLost}
                  </div>
                  <span className="text-[10px] font-medium text-[#9aaccb] block">
                    {unit} from factory
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] space-y-1">
                  <span className="text-[11px] font-mono uppercase text-[#9aaccb]">Est. Remaining</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#34e0a1]">
                    {calculation.current}
                  </div>
                  <span className="text-[10px] font-medium text-[#9aaccb] block">
                    {unit} usable full charge
                  </span>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[#9aaccb]">
                  <span>Battery Capacity Retention</span>
                  <span style={{ color: calculation.statusColor }} className="font-bold">
                    {calculation.healthPercent}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#050a14] border border-[rgba(143,163,192,0.16)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, calculation.healthPercent)}%`,
                      backgroundColor: calculation.statusColor,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#9aaccb]">
                  <span>0% (Empty)</span>
                  <span>70% (Wear Threshold)</span>
                  <span>80% (Apple/PC Baseline)</span>
                  <span>100% (Design)</span>
                </div>
              </div>

              {/* Verdict Card */}
              <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.14)] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: calculation.statusColor }} />
                  <span className="text-xs font-mono uppercase font-bold text-[#f2f7ff]">
                    Verdict: {calculation.statusLabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#9aaccb] leading-relaxed">
                  {calculation.verdict}
                </p>
                {calculation.cycles !== null && (
                  <p className="text-xs text-[#6c7dff] pt-1">
                    At {calculation.cycles} full charge cycles, this wear rate is{' '}
                    {calculation.cycles > 500 && calculation.healthPercent > 80
                      ? 'better than average for lithium-ion battery chemistry.'
                      : calculation.cycles < 200 && calculation.healthPercent < 80
                      ? 'accelerated, likely due to frequent fast-charging heat or high operating temperatures.'
                      : 'consistent with normal electrochemical aging.'}
                  </p>
                )}
              </div>

              {/* Clear Estimate Disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#101c33] border border-[rgba(10,132,255,0.25)] flex items-start gap-2.5 text-xs text-[#9aaccb]">
                <Info className="w-4 h-4 text-[#0a84ff] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#f2f7ff]">Important Estimate Notice: </span>
                  <span>
                    Software capacity calculations depend on fuel-gauge calibration and battery pack impedance. Numbers can fluctuate by 2–5% with ambient temperature. Steps and menu names can vary by version.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Help Box: Where to Find Your Numbers */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#34e0a1] font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Where to Find Your Battery Numbers (By Operating System)</span>
              </span>
              <span className="text-[11px] font-mono text-[#9aaccb]">
                Steps can vary by version
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Windows */}
              <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] space-y-2">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#0a84ff]" />
                  <span className="text-xs font-bold text-[#f2f7ff]">Windows 11 / 10</span>
                </div>
                <p className="text-[11px] text-[#9aaccb] leading-relaxed">
                  Open Command Prompt as Administrator and run:
                </p>
                <div className="p-2 rounded-lg bg-[#101c33] font-mono text-[11px] text-[#34e0a1] overflow-x-auto select-all">
                  powercfg /batteryreport
                </div>
                <p className="text-[11px] text-[#9aaccb] leading-relaxed">
                  Open the saved <code className="text-[#f2f7ff]">battery-report.html</code> file in any browser. Look under "Installed batteries" for <strong>DESIGN CAPACITY</strong> and <strong>FULL CHARGE CAPACITY</strong> in mWh.
                </p>
              </div>

              {/* Mac */}
              <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] space-y-2">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#8b5cf6]" />
                  <span className="text-xs font-bold text-[#f2f7ff]">macOS (MacBook)</span>
                </div>
                <p className="text-[11px] text-[#9aaccb] leading-relaxed">
                  Hold Option (⌥) and click the <strong>Apple Menu () &gt; System Information</strong>. Select <strong>Power</strong> from the left sidebar.
                </p>
                <p className="text-[11px] text-[#9aaccb] leading-relaxed">
                  Read <strong>Full Charge Capacity (mAh)</strong> and <strong>Cycle Count</strong>. Compare against Apple’s factory spec for your MacBook model, or check System Settings &gt; Battery &gt; Battery Health.
                </p>
              </div>

              {/* Android */}
              <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#34e0a1]" />
                  <span className="text-xs font-bold text-[#f2f7ff]">Android Phones</span>
                </div>
                <p className="text-[11px] text-[#9aaccb] leading-relaxed">
                  On Android 14+, check <strong>Settings &gt; Battery &gt; Battery Health</strong>.
                </p>
                <p className="text-[11px] text-[#9aaccb] leading-relaxed">
                  On older versions or custom skins, install a reputable monitor like AccuBattery or DevCheck. Charge your phone for 3–5 cycles to let the app measure full charge capacity in mAh.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            All modern consumer electronics—from lightweight ultrabooks and gaming laptops to smartphones and tablets—rely on lithium-ion or lithium-polymer battery chemistry. Over time, recurring charge cycles, elevated operating temperatures, and calendar aging cause irreversible loss of active lithium ions and increase internal cell resistance.
          </p>
          <p>
            The <strong>Battery Wear Calculator</strong> compares your battery pack’s original factory <strong>Design Capacity</strong> against its current <strong>Full-Charge Capacity</strong> to reveal your exact health percentage, wear level, and lost runtime. It provides step-by-step instructions on extracting diagnostic battery reports on Windows (<code>powercfg /batteryreport</code>), macOS System Information, and Android diagnostics.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Check your battery report numbers',
          text: 'Find your device’s original Design Capacity and current Full-Charge Capacity using the built-in operating system commands in our guide box below.',
        },
        {
          step: 'Enter capacity and select units',
          text: 'Type your readings in Watt-hours (Wh / mWh) or Milliamp-hours (mAh), and optionally provide your completed cycle count.',
        },
        {
          step: 'Analyze wear and longevity advice',
          text: 'Review your visual health gauge, capacity retention verdict, and actionable tips for preserving lithium-ion battery life.',
        },
      ]}
      workedExample={{
        title: 'Example: 3-Year-Old Laptop Battery Evaluation',
        scenario: 'A user runs powercfg /batteryreport on their Windows laptop and finds a Design Capacity of 56,000 mWh (56 Wh) and Full Charge Capacity of 44,200 mWh (44.2 Wh) at 420 cycles.',
        output: `Battery Health Summary:
• Health: 78.9% (Normal Aging)
• Wear Level: 21.1%
• Design Capacity: 56 Wh
• Full-Charge Capacity: 44.2 Wh
• Capacity Lost: 11.8 Wh (approx. 1 hour and 15 minutes of typical runtime)
• Charge Cycles: 420

Verdict:
Normal Aging. This is standard degradation for 420 charge cycles. The battery pack is still safe and reliable, but runtime is approximately 20% lower than day one. No immediate replacement is required unless unexpected shutdowns occur under heavy load.`,
      }}
      tips={[
        'Avoid chronic 100% charging: If your laptop has a built-in battery limiter (such as Dell Command, Lenovo Vantage, or ASUS Battery Health), cap charging at 80% when connected to a desk dock.',
        'Keep temperatures cool: High heat is the primary accelerator of lithium battery wear. Avoid using laptops on soft blankets that block ventilation exhaust.',
        'Avoid deep 0% discharges: Modern lithium cells degrade fastest when left completely drained for extended periods. Plug in around 15–20% whenever possible.',
        'Recalibrate if percentages jump erratically: If your battery percentage jumps suddenly from 20% to 5%, fully charge to 100%, leave on charger for 2 hours, discharge to 5%, and recharge to help the power management chip recalibrate its voltage curve.',
      ]}
      faq={[
        {
          question: 'What is the difference between design capacity and full-charge capacity?',
          answer: 'Design capacity is the theoretical maximum energy storage specified by the manufacturer when the battery was produced. Full-charge capacity is the actual amount of energy the chemically aged cells can store today when charged to 100%.',
        },
        {
          question: 'At what battery health percentage should I replace my battery?',
          answer: 'Most laptop and phone manufacturers (including Apple, Dell, and HP) consider 80% remaining capacity the threshold for battery replacement or warranty service. Below 80%, battery life is noticeably shortened and internal resistance increases.',
        },
        {
          question: 'Why do mWh values differ from Wh and mAh?',
          answer: 'Wh (Watt-hours) measures total energy. 1 Wh equals 1,000 mWh. mAh (Milliamp-hours) measures electric charge over time. To convert mAh to Wh, multiply mAh by nominal battery voltage (typically 3.7V–3.85V for phones or 11.4V–15.4V for laptops) and divide by 1,000.',
        },
        {
          question: 'Why does my full-charge capacity fluctuate between days?',
          answer: 'Battery fuel gauges measure voltage and coulomb counts, which shift with temperature and recent charging patterns. A cold room or a shallow charge session can temporarily lower the reported full-charge capacity by a few percent.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
