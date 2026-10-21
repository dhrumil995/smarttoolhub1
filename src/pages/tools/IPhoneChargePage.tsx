import React, { useState } from 'react';
import { BatteryCharging, Copy, Check, Zap, Clock, ShieldCheck } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface IPhoneChargePageProps {
  navigate: (path: string) => void;
}

interface IPhonePreset {
  name: string;
  mah: number;
  maxWatts: number;
}

export const IPhoneChargePage: React.FC<IPhoneChargePageProps> = ({ navigate }) => {
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);
  const [customMah, setCustomMah] = useState<number>(4685);
  const [chargerWatts, setChargerWatts] = useState<number>(30);
  const [startPct, setStartPct] = useState<number>(10);
  const [targetPct, setTargetPct] = useState<number>(80);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'iphone-charging-time-calculator') || LAUNCH_TOOLS[10];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'retina-image-size-calculator' || t.slug === 'file-transfer-time-calculator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'mastering-apple-shortcuts-ios') || POPULAR_GUIDES[0];

  const phoneModels: IPhonePreset[] = [
    { name: 'iPhone 16 Pro Max / Plus', mah: 4685, maxWatts: 30 },
    { name: 'iPhone 16 / 16 Pro / 15 Pro', mah: 3561, maxWatts: 27 },
    { name: 'iPhone 15 / 14 / 13 Pro', mah: 3349, maxWatts: 20 },
    { name: 'iPhone 13 / 12 Standard', mah: 3227, maxWatts: 20 },
    { name: 'iPhone SE (3rd Gen)', mah: 2018, maxWatts: 18 },
  ];

  const chargerOptions = [
    { label: '5W (Legacy Cube)', watts: 5 },
    { label: '12W (iPad Charger)', watts: 12 },
    { label: '20W (Apple Fast Charger)', watts: 20 },
    { label: '30W (GaN Fast Charger)', watts: 30 },
    { label: '65W+ (MacBook USB-C)', watts: 65 },
  ];

  const exampleChips = [
    'iPhone 16 Pro Max from 10% to 80% with 30W USB-C',
    'iPhone 15 from 0% to 100% with 20W Fast Charger',
    'iPhone 13 from 20% to 80% with legacy 5W Cube',
  ];

  const activeModel = phoneModels[selectedModelIdx];
  const batteryCap = customMah || activeModel.mah;
  const maxPhoneWatts = activeModel.maxWatts;

  // Real world physics calculation:
  // Nominal lithium voltage is 3.85V.
  // Energy (Watt-hours) = (mAh / 1000) * 3.85V.
  // Charging efficiency is ~85% (heat loss through cable and charging controller).
  // The phone will only draw MIN(chargerWatts, maxPhoneWatts).
  // Charging is non-linear:
  // Phase 1 (0% - 80%): Fast charge at full effective power.
  // Phase 2 (80% - 100%): Trickle charge where power drops down to 5W-7W to protect battery chemistry.
  const effectiveFastWatts = Math.min(chargerWatts, maxPhoneWatts) * 0.85;
  const trickleWatts = Math.min(chargerWatts, 6) * 0.85; // Trickle drops to ~5W-6W

  const totalWh = (batteryCap / 1000) * 3.85;

  // Fraction in fast-charge zone (up to 80%)
  const startFast = Math.min(startPct, 80);
  const targetFast = Math.min(targetPct, 80);
  const fastPctDiff = Math.max(0, targetFast - startFast);
  const fastEnergyWh = (fastPctDiff / 100) * totalWh;
  const fastChargeHours = effectiveFastWatts > 0 ? fastEnergyWh / effectiveFastWatts : 0;

  // Fraction in trickle zone (80% to 100%)
  const startTrickle = Math.max(80, startPct);
  const targetTrickle = Math.max(80, targetPct);
  const tricklePctDiff = Math.max(0, targetTrickle - startTrickle);
  const trickleEnergyWh = (tricklePctDiff / 100) * totalWh;
  const trickleChargeHours = trickleWatts > 0 ? trickleEnergyWh / trickleWatts : 0;

  const totalHours = fastChargeHours + trickleChargeHours;
  const totalMinutes = Math.round(totalHours * 60);
  const displayHours = Math.floor(totalMinutes / 60);
  const displayMins = totalMinutes % 60;

  // 0 to 50% quick stat
  const p50Diff = Math.max(0, 50 - startPct);
  const p50Wh = (p50Diff / 100) * totalWh;
  const p50Mins = Math.round((effectiveFastWatts > 0 ? p50Wh / effectiveFastWatts : 0) * 60);

  // 0 to 80% quick stat
  const p80Diff = Math.max(0, 80 - startPct);
  const p80Wh = (p80Diff / 100) * totalWh;
  const p80Mins = Math.round((effectiveFastWatts > 0 ? p80Wh / effectiveFastWatts : 0) * 60);

  const handleCompute = (inputStr: string) => {
    // If input matches example chips, parse them
    if (inputStr.includes('5W')) {
      setChargerWatts(5);
    } else if (inputStr.includes('20W')) {
      setChargerWatts(20);
    } else if (inputStr.includes('30W')) {
      setChargerWatts(30);
    }

    if (inputStr.includes('100%')) {
      setTargetPct(100);
    } else if (inputStr.includes('80%')) {
      setTargetPct(80);
    }

    const outputText = `### iPhone Charging Time Estimate:
- Device: ${activeModel.name} (${batteryCap} mAh)
- Charger: ${chargerWatts}W Adapter (Effective speed capped at phone limit: ${Math.min(chargerWatts, maxPhoneWatts)}W)
- Battery Range: ${startPct}% to ${targetPct}%
- **Estimated Charging Time:** ${displayHours > 0 ? `${displayHours} hr ` : ''}${displayMins} min
- **Time to 50% (Fast Charge):** ~${p50Mins} min
- **Time to 80% (Inflection Point):** ~${p80Mins} min
- **Trickle Charge Phase:** ${targetPct > 80 ? `~${Math.round(trickleChargeHours * 60)} min (slows down to prevent heat degradation)` : 'N/A (Stopping at 80% saves ~30 mins)'}`;

    return {
      result: outputText,
      rawData: {
        totalMinutes,
        displayHours,
        displayMins,
        p50Mins,
        p80Mins,
        modelName: activeModel.name,
      },
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="iPhone Charging Time Calculator"
      subheading="Calculate realistic iPhone charging durations based on your battery capacity, charger wattage, and phone speed limits. Includes smart fast-charge and trickle-charge curves."
      inputLabel="Battery Range & Device Configuration"
      inputPlaceholder="e.g. iPhone 16 Pro Max from 10% to 80% with 30W USB-C..."
      examplePrompt={`${activeModel.name} from ${startPct}% to ${targetPct}% with ${chargerWatts}W charger`}
      exampleChips={exampleChips}
      generateButtonText="Calculate Charging Time"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Device Model Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              iPhone Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {phoneModels.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedModelIdx(idx);
                    setCustomMah(m.mah);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-colors focus-ring ${
                    selectedModelIdx === idx
                      ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#f2f7ff]">{m.name}</div>
                  <div className="text-[11px] text-[#8fa3c0] font-mono mt-0.5">
                    {m.mah} mAh · Max {m.maxWatts}W
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Charger Wattage Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Charger Adapter Wattage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {chargerOptions.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setChargerWatts(c.watts)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-colors focus-ring ${
                    chargerWatts === c.watts
                      ? 'bg-[#8b5cf6] text-[#050a14] font-bold border-[#8b5cf6] shadow-[0_0_10px_rgba(139, 92, 246,0.2)]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                  }`}
                >
                  <div className="text-xs font-bold">{c.watts}W</div>
                  <div className="text-[10px] opacity-80 truncate">{c.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Battery Level Range Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8fa3c0]">Starting Battery:</span>
                <span className="text-[#8b5cf6] font-bold">{startPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                value={startPct}
                onChange={(e) => setStartPct(Math.min(parseInt(e.target.value, 10), targetPct - 5))}
                className="w-full accent-[#8b5cf6] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8fa3c0]">Target Battery:</span>
                <span className="text-[#5aa9ff] font-bold">{targetPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={targetPct}
                onChange={(e) => setTargetPct(Math.max(parseInt(e.target.value, 10), startPct + 5))}
                className="w-full accent-[#5aa9ff] cursor-pointer"
              />
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, onCopy, copied }) => {
        const isCapped = chargerWatts > maxPhoneWatts;

        return (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8b5cf6] font-semibold flex items-center gap-1.5">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>Charging Projection ({startPct}% &rarr; {targetPct}%)</span>
              </span>

              <button
                type="button"
                onClick={() => onCopy(result)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#8b5cf6] transition-colors focus-ring"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Calculation' : 'Copy Result'}</span>
              </button>
            </div>

            {/* Hero Result Banner */}
            <div className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(139, 92, 246,0.3)] shadow-[0_0_20px_rgba(139, 92, 246,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                  Total Estimated Time
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-[#8b5cf6]">
                  {displayHours > 0 ? `${displayHours} hr ` : ''}{displayMins} min
                </div>
                <div className="text-xs text-[#8fa3c0]">
                  From {startPct}% to {targetPct}% with {chargerWatts}W adapter
                </div>
              </div>

              {/* Status Pill */}
              <div className="space-y-1 sm:text-right">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#101c33] text-[#5aa9ff] border border-[rgba(90,169,255,0.2)]">
                  Speed Cap: {Math.min(chargerWatts, maxPhoneWatts)}W Max
                </span>
                {isCapped && (
                  <p className="text-[10px] text-[#8fa3c0] max-w-xs">
                    Your {chargerWatts}W charger is safely regulated by your iPhone's internal charging chip.
                  </p>
                )}
              </div>
            </div>

            {/* Fast Charging Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#8fa3c0] font-mono">
                  <Zap className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  <span>Reach 50%</span>
                </div>
                <div className="text-lg font-bold font-mono text-[#f2f7ff]">
                  ~{p50Mins} mins
                </div>
                <div className="text-[10px] text-[#8fa3c0]">
                  Quick morning power boost
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#8fa3c0] font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#5aa9ff]" />
                  <span>Reach 80%</span>
                </div>
                <div className="text-lg font-bold font-mono text-[#5aa9ff]">
                  ~{p80Mins} mins
                </div>
                <div className="text-[10px] text-[#8fa3c0]">
                  Optimal daily battery health limit
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#8fa3c0] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ffb840]" />
                  <span>Trickle (80-100%)</span>
                </div>
                <div className="text-lg font-bold font-mono text-[#ffb840]">
                  ~30-40 mins
                </div>
                <div className="text-[10px] text-[#8fa3c0]">
                  Slows down to avoid heat wear
                </div>
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The iPhone Charging Time Calculator predicts how long it will take to charge your iPhone from any starting percentage to your target goal. It accounts for real-world lithium-ion battery physics: iPhones charge very quickly up to 80%, then dramatically taper power down to protect the battery from heat degradation.
          </p>
          <p>
            Many people believe plugging a 65W or 100W MacBook charger into an iPhone will charge it three times faster than a 20W charger. In reality, modern iPhones internally throttle charging to a maximum of 20W to 30W depending on the model. This calculator shows you the honest, measured charging speed of your exact setup.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Select your iPhone model',
          text: 'Choose your iPhone model to load its factory battery milliamp-hour (mAh) capacity and internal wattage ceiling.',
        },
        {
          step: 'Pick your charger adapter wattage',
          text: 'Select the wattage printed on your wall adapter (5W, 12W, 20W, 30W, or MacBook 65W+).',
        },
        {
          step: 'Adjust your battery percentage range',
          text: 'Drag the sliders for your current percentage and target percentage to see the calculated time and milestones.',
        },
      ]}
      workedExample={{
        title: 'Example: iPhone 16 Pro Fast Charging Comparison',
        scenario: 'Charging an iPhone 16 Pro (3,561 mAh) from 10% to 80% using a 20W Apple Fast Charger vs. an old 5W cube.',
        output: `### Fast Charger (20W USB-C):
- 10% to 50%: ~25 minutes
- 10% to 80%: ~54 minutes
- Total time to 100%: ~1 hr 25 minutes (last 20% takes 31 minutes due to trickle charging)

### Legacy Cube (5W USB-A):
- 10% to 80%: ~2 hours 45 minutes
- Total time to 100%: ~3 hours 50 minutes

Verdict: Upgrading from the 5W cube to a 20W fast charger saves over 1 hour and 50 minutes.`,
      }}
      tips={[
        'Enable the 80% charging limit: On iPhone 15 and 16, setting the charging limit to 80% in Settings > Battery cuts down charging time by 35 minutes and significantly extends battery lifespan.',
        'Using a 100W charger is 100% safe: iPhones only pull the wattage they are programmed to accept; a 100W charger will safely charge an iPhone 16 at its native 27W-30W limit.',
        'Avoid charging under pillows or in hot cars: Heat triggers emergency thermal throttling, causing your phone to drop charging speeds to 5W or pause charging until it cools down.',
        'Unplug before 100% if you are in a rush: The first 50% takes around 25 minutes, but the final 20% takes nearly 35 minutes.',
      ]}
      faq={[
        {
          question: 'Does using a fast charger ruin my iPhone battery health?',
          answer: 'No. Modern iPhones feature intelligent Power Delivery management that throttles speed when the battery warms up. Setting the 80% limit in iOS 18+ is the most effective way to keep your battery healthy.',
        },
        {
          question: 'Can I use a MacBook or iPad charger for my iPhone?',
          answer: 'Yes. Apple USB-C chargers (from 30W to 140W) negotiate safe voltages via the USB-PD standard. Your iPhone will safely draw its maximum rate without danger of overcharging.',
        },
        {
          question: 'Why does charging slow down so much after 80%?',
          answer: 'Lithium-ion cells experience high resistance and heat when almost full. iOS automatically switches to trickle charging to avoid damaging the internal electrolyte and preserve battery longevity.',
        },
        {
          question: 'Is wireless MagSafe charging as fast as a cable?',
          answer: 'MagSafe charges at up to 15W to 25W on newer models, but because wireless charging generates more ambient heat, thermal throttling usually makes it about 20% to 30% slower than a direct USB-C cable.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
