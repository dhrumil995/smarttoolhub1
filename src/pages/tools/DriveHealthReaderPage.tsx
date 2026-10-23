import React, { useState, useMemo } from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle, Thermometer, Clock, HardDrive, Cpu, HelpCircle, ExternalLink } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface DriveHealthReaderPageProps {
  navigate: (path: string) => void;
}

export const DriveHealthReaderPage: React.FC<DriveHealthReaderPageProps> = ({ navigate }) => {
  const [driveType, setDriveType] = useState<'nvme' | 'sata-ssd' | 'hdd'>('nvme');
  const [healthPct, setHealthPct] = useState<number>(98);
  const [reallocatedSectors, setReallocatedSectors] = useState<number>(0);
  const [pendingSectors, setPendingSectors] = useState<number>(0);
  const [powerOnHours, setPowerOnHours] = useState<number>(4500);
  const [temperatureC, setTemperatureC] = useState<number>(42);
  const [nvmeUsedPct, setNvmeUsedPct] = useState<number>(12);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'drive-health-reader') || {
    id: 'drive-health-reader',
    name: 'Drive Health Reader (S.M.A.R.T.)',
    slug: 'drive-health-reader',
    description: 'Interpret drive S.M.A.R.T. telemetry values (reallocated sectors, pending sectors, NVMe endurance, temperature) with clear actionable advice.',
    category: 'Productivity',
    icon: 'Activity',
    type: 'client',
    keywords: ['smart drive health reader', 'reallocated sector count explanation', 'crystaldiskinfo smart values', 'nvme percentage used endurance'],
    relatedToolSlugs: ['drive-speed-requirement-calculator', 'file-checksum-verifier'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) => t.slug === 'drive-speed-requirement-calculator' || t.slug === 'file-checksum-verifier' || t.slug === 'quick-calculators'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  // Comprehensive S.M.A.R.T. evaluation engine
  const assessment = useMemo(() => {
    const reasons: Array<{ title: string; desc: string; severity: 'good' | 'caution' | 'critical' }> = [];
    let criticalCount = 0;
    let cautionCount = 0;

    // 1. Reallocated Sectors (ID 05)
    if (reallocatedSectors > 50) {
      criticalCount++;
      reasons.push({
        title: `Reallocated Sectors High (${reallocatedSectors})`,
        desc: 'The drive has exhausted numerous spare reserve blocks due to physical surface degradation or flash wear. Data corruption risk is elevated.',
        severity: 'critical',
      });
    } else if (reallocatedSectors > 0) {
      cautionCount++;
      reasons.push({
        title: `Reallocated Sectors Detected (${reallocatedSectors})`,
        desc: 'The drive retired damaged sectors and mapped them to spare area. A few reallocations can be stable, but monitor closely for growth.',
        severity: 'caution',
      });
    } else {
      reasons.push({
        title: 'Zero Reallocated Sectors',
        desc: 'No damaged sectors have been retired. The storage media surface is healthy.',
        severity: 'good',
      });
    }

    // 2. Current Pending Sectors (ID C5)
    if (pendingSectors > 10) {
      criticalCount++;
      reasons.push({
        title: `Unstable Pending Sectors (${pendingSectors})`,
        desc: 'These sectors failed read operations and are waiting to be rewritten or reallocated. Active read/write I/O errors are occurring.',
        severity: 'critical',
      });
    } else if (pendingSectors > 0) {
      cautionCount++;
      reasons.push({
        title: `Pending Sectors Flagged (${pendingSectors})`,
        desc: 'Unstable sectors found. A full disk write or manufacturer diagnostic pass is required to test and reallocate them.',
        severity: 'caution',
      });
    }

    // 3. Temperature Assessment
    if (temperatureC >= 70) {
      criticalCount++;
      reasons.push({
        title: `Critical Temperature (${temperatureC}°C)`,
        desc: 'Drive is operating above recommended thermal limits (typically 70°C). Electronic component lifespan degrades rapidly under high heat.',
        severity: 'critical',
      });
    } else if (temperatureC >= 55) {
      cautionCount++;
      reasons.push({
        title: `Warm Operating Temperature (${temperatureC}°C)`,
        desc: 'Drive is running warm. For mechanical HDDs, temps over 50°C accelerate mechanical failure; NVMe drives may throttle transfer speeds.',
        severity: 'caution',
      });
    } else {
      reasons.push({
        title: `Safe Temperature (${temperatureC}°C)`,
        desc: 'Operating within optimal thermal parameters (25°C–50°C).',
        severity: 'good',
      });
    }

    // 4. NVMe Used Percentage / Health Pct
    if (driveType === 'nvme') {
      if (nvmeUsedPct >= 100) {
        criticalCount++;
        reasons.push({
          title: `NVMe Rated Endurance Exceeded (${nvmeUsedPct}%)`,
          desc: 'The SSD has consumed 100% of its manufacturer-warranted Terabytes Written (TBW). While it may continue functioning, reliability is no longer guaranteed.',
          severity: 'critical',
        });
      } else if (nvmeUsedPct >= 85) {
        cautionCount++;
        reasons.push({
          title: `High Write Endurance Consumption (${nvmeUsedPct}%)`,
          desc: 'Flash memory endurance is nearing rated warranty limits. Plan for replacement within the next 6–12 months.',
          severity: 'caution',
        });
      }
    } else {
      if (healthPct <= 50) {
        criticalCount++;
        reasons.push({
          title: `Low Health Score (${healthPct}%)`,
          desc: 'Drive health metrics have degraded significantly below manufacturer baseline.',
          severity: 'critical',
        });
      } else if (healthPct <= 80) {
        cautionCount++;
        reasons.push({
          title: `Moderate Health Consumption (${healthPct}%)`,
          desc: 'Drive shows normal aging wear. Continue regular monitoring.',
          severity: 'caution',
        });
      }
    }

    // 5. Power-On Hours
    const years = (powerOnHours / (24 * 365)).toFixed(1);
    if (powerOnHours >= 45000) { // ~5+ years continuous
      cautionCount++;
      reasons.push({
        title: `High Power-On Age (${powerOnHours.toLocaleString()} hrs / ~${years} yrs)`,
        desc: 'The drive has operated for over 5 continuous years. Mechanical bearings (HDD) or controller capacitors (SSD) are in their late operational lifecycle.',
        severity: 'caution',
      });
    }

    // Determine final verdict
    let overallVerdict: 'good' | 'caution' | 'replace-soon';
    if (criticalCount > 0 || reallocatedSectors > 50 || pendingSectors > 10) {
      overallVerdict = 'replace-soon';
    } else if (cautionCount > 0 || reallocatedSectors > 0 || pendingSectors > 0 || healthPct < 85) {
      overallVerdict = 'caution';
    } else {
      overallVerdict = 'good';
    }

    // Action list
    const actionList: string[] = [];
    if (overallVerdict === 'replace-soon') {
      actionList.push('IMMEDIATE BACKUP: Clone or copy irreplaceable personal files to an external drive or cloud storage right away.');
      actionList.push('Cease intensive writes: Avoid running defragmentation, heavy torrents, or large file transfers on this drive.');
      actionList.push('Order replacement drive: Prepare to replace the drive before an abrupt unrecoverable read failure.');
    } else if (overallVerdict === 'caution') {
      actionList.push('Perform a full data backup: Ensure your 3-2-1 backup is completely up to date.');
      actionList.push('Check cables and connections: Reseat the SATA/NVMe connector; loose cables can register false CRC interface errors.');
      actionList.push('Run manufacturer diagnostic: Execute an extended SMART self-test using the drive vendor’s official software.');
      actionList.push('Re-check values in 7 days: Note down the reallocated sector count to check if the number is growing.');
    } else {
      actionList.push('Maintain regular backup routine: Healthy drives can still fail without S.M.A.R.T. warning from power surges or controller faults.');
      actionList.push('Keep drive ventilated: Ensure case airflow or laptop cooling vents are clean of dust.');
      actionList.push('Monitor annually: Check S.M.A.R.T. attributes once or twice a year during regular system cleanups.');
    }

    return {
      overallVerdict,
      reasons,
      actionList,
      years,
    };
  }, [driveType, healthPct, reallocatedSectors, pendingSectors, powerOnHours, temperatureC, nvmeUsedPct]);

  const officialTools = [
    { name: 'Samsung Magician', vendor: 'Samsung', url: 'https://semiconductor.samsung.com/consumer-storage/magician/' },
    { name: 'Western Digital Dashboard', vendor: 'WD / SanDisk', url: 'https://support-en.wd.com/app/answers/detailweb/a_id/31759' },
    { name: 'Crucial Storage Executive', vendor: 'Crucial / Micron', url: 'https://www.crucial.com/support/storage-executive' },
    { name: 'Seagate SeaTools', vendor: 'Seagate', url: 'https://www.seagate.com/support/downloads/seatools/' },
  ];

  const exampleChips = [
    'Healthy NVMe SSD (0 Reallocated, 42°C, 12% Used)',
    'Aging HDD with 5 Reallocated Sectors (Caution)',
    'Critical SSD (High Pending Sectors & 72°C Heat)',
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Drive Health Reader (S.M.A.R.T.)"
      subheading="Interpret raw S.M.A.R.T. telemetry attributes from CrystalDiskInfo, smartctl, or DriveDx. Get plain-language failure risk analysis and immediate action guidance."
      inputLabel="Drive Serial / Model Identifier (Optional)"
      inputPlaceholder="e.g. Samsung 980 Pro 2TB or WD Blue 4TB HDD"
      examplePrompt="Interpret SMART values: 0 Reallocated, 42°C, 4500 hours"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `Drive Diagnostic Assessment:
Drive Type: ${driveType.toUpperCase()}
Overall Status: ${assessment.overallVerdict.toUpperCase()}

Key Telemetry:
- Reallocated Sectors: ${reallocatedSectors}
- Current Pending Sectors: ${pendingSectors}
- Power-On Time: ${powerOnHours.toLocaleString()} hours (~${assessment.years} years)
- Temperature: ${temperatureC}°C
- ${driveType === 'nvme' ? `NVMe Percentage Used: ${nvmeUsedPct}%` : `Reported Health: ${healthPct}%`}

Evaluation Summary:
${assessment.reasons.map((r) => `• [${r.severity.toUpperCase()}] ${r.title}: ${r.desc}`).join('\n')}

Recommended Action Plan:
${assessment.actionList.map((a, idx) => `${idx + 1}. ${a}`).join('\n')}

*Strong Disclaimer: This assessment provides technical guidance based on industry-standard S.M.A.R.T. thresholds. It is not a hardware guarantee. Drives can occasionally fail without warning due to electrical surges or firmware panics. Always maintain an independent 3-2-1 backup.`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Drive Type Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
            <span className="text-xs font-mono uppercase text-[#9aaccb] font-semibold">
              Storage Technology:
            </span>
            <div className="flex rounded-xl bg-[#050a14] p-1 border border-[rgba(143,163,192,0.16)] text-xs">
              {[
                { id: 'nvme', label: 'NVMe M.2 SSD' },
                { id: 'sata-ssd', label: 'SATA 2.5" SSD' },
                { id: 'hdd', label: 'Mechanical HDD' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDriveType(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all focus-ring ${
                    driveType === t.id
                      ? 'bg-[#ffb840] text-[#050a14] font-bold shadow-sm'
                      : 'text-[#9aaccb] hover:text-[#f2f7ff]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Input Fields */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#ffb840] font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ffb840]" />
              <span>Enter Values Read from Your Disk Tool (CrystalDiskInfo / smartctl)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* 1. Health % or NVMe Used */}
              {driveType === 'nvme' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[#9aaccb]">NVMe % Used</label>
                    <span className="text-xs font-mono text-[#ffb840] font-bold">{nvmeUsedPct}%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={nvmeUsedPct}
                    onChange={(e) => setNvmeUsedPct(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm font-mono text-[#f2f7ff] focus-ring"
                  />
                  <span className="text-[10px] text-[#9aaccb] block">NVMe Attribute 0x05 (0–100% TBW)</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[#9aaccb]">Health Percentage</label>
                    <span className="text-xs font-mono text-[#ffb840] font-bold">{healthPct}%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={healthPct}
                    onChange={(e) => setHealthPct(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm font-mono text-[#f2f7ff] focus-ring"
                  />
                  <span className="text-[10px] text-[#9aaccb] block">Reported overall health indicator</span>
                </div>
              )}

              {/* 2. Reallocated Sectors (ID 05) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#9aaccb]">Reallocated Sectors</label>
                  <span className={`text-xs font-mono font-bold ${reallocatedSectors > 0 ? 'text-[#ff5c7a]' : 'text-[#34e0a1]'}`}>
                    {reallocatedSectors}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={reallocatedSectors}
                  onChange={(e) => setReallocatedSectors(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm font-mono text-[#f2f7ff] focus-ring"
                />
                <span className="text-[10px] text-[#9aaccb] block">ID 05 (0 is ideal baseline)</span>
              </div>

              {/* 3. Pending Sectors (ID C5) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#9aaccb]">Pending Sectors</label>
                  <span className={`text-xs font-mono font-bold ${pendingSectors > 0 ? 'text-[#ff5c7a]' : 'text-[#34e0a1]'}`}>
                    {pendingSectors}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={pendingSectors}
                  onChange={(e) => setPendingSectors(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm font-mono text-[#f2f7ff] focus-ring"
                />
                <span className="text-[10px] text-[#9aaccb] block">ID C5 (Current Pending Sector Count)</span>
              </div>

              {/* 4. Temperature °C */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#9aaccb]">Temperature (°C)</label>
                  <span className={`text-xs font-mono font-bold ${temperatureC >= 70 ? 'text-[#ff5c7a]' : temperatureC >= 55 ? 'text-[#ffb840]' : 'text-[#34e0a1]'}`}>
                    {temperatureC}°C
                  </span>
                </div>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                  className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm font-mono text-[#f2f7ff] focus-ring"
                />
                <span className="text-[10px] text-[#9aaccb] block">Current sensor temperature</span>
              </div>

              {/* 5. Power-On Hours */}
              <div className="space-y-1.5 sm:col-span-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#9aaccb]">Power-On Hours</label>
                  <span className="text-xs font-mono text-[#f2f7ff] font-bold">
                    {powerOnHours.toLocaleString()} hrs (~{assessment.years} years)
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={powerOnHours}
                  onChange={(e) => setPowerOnHours(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.2)] rounded-xl p-2.5 text-sm font-mono text-[#f2f7ff] focus-ring"
                />
                <span className="text-[10px] text-[#9aaccb] block">ID 09 (Total continuous operational uptime)</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Verdict Card */}
          <div
            className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
              assessment.overallVerdict === 'good'
                ? 'bg-[rgba(52,224,161,0.08)] border-[#34e0a1]'
                : assessment.overallVerdict === 'caution'
                ? 'bg-[rgba(255,184,64,0.08)] border-[#ffb840]'
                : 'bg-[rgba(255,92,122,0.08)] border-[#ff5c7a]'
            }`}
          >
            <div className="flex items-center gap-3">
              {assessment.overallVerdict === 'good' && <CheckCircle2 className="w-8 h-8 text-[#34e0a1] shrink-0" />}
              {assessment.overallVerdict === 'caution' && <AlertTriangle className="w-8 h-8 text-[#ffb840] shrink-0" />}
              {assessment.overallVerdict === 'replace-soon' && <AlertCircle className="w-8 h-8 text-[#ff5c7a] shrink-0" />}

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9aaccb]">
                  Diagnostic Status Verdict
                </span>
                <h3
                  className={`text-2xl font-bold font-display uppercase tracking-wide ${
                    assessment.overallVerdict === 'good'
                      ? 'text-[#34e0a1]'
                      : assessment.overallVerdict === 'caution'
                      ? 'text-[#ffb840]'
                      : 'text-[#ff5c7a]'
                  }`}
                >
                  {assessment.overallVerdict === 'good' && 'GOOD · Operating Normally'}
                  {assessment.overallVerdict === 'caution' && 'CAUTION · Warning Signs Present'}
                  {assessment.overallVerdict === 'replace-soon' && 'REPLACE SOON · Critical Risk'}
                </h3>
              </div>
            </div>

            {/* Reasons List */}
            <div className="space-y-2 pt-2 border-t border-[rgba(143,163,192,0.12)]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#9aaccb] font-bold">
                Attribute Breakdown
              </h4>
              <div className="space-y-2">
                {assessment.reasons.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.12)] text-xs space-y-0.5">
                    <div className="font-bold text-[#f2f7ff] flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          r.severity === 'good' ? 'bg-[#34e0a1]' : r.severity === 'caution' ? 'bg-[#ffb840]' : 'bg-[#ff5c7a]'
                        }`}
                      />
                      <span>{r.title}</span>
                    </div>
                    <p className="text-[#9aaccb] leading-relaxed pl-4">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Action Plan */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#9aaccb] font-bold">
                Recommended Action Steps
              </h4>
              <div className="space-y-2">
                {assessment.actionList.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#f2f7ff] bg-[#0a1424] p-3 rounded-xl border border-[rgba(143,163,192,0.12)]">
                    <span className="font-mono text-[#ffb840] font-bold shrink-0">{idx + 1}.</span>
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Diagnostic Tools Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#ffb840] font-bold">
              <ExternalLink className="w-4 h-4 text-[#ffb840]" />
              <span>Official Manufacturer Diagnostic Suites</span>
            </div>
            <p className="text-xs text-[#9aaccb]">
              For warranty replacements and low-level firmware updates, always verify S.M.A.R.T. status using the drive maker’s official tool:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {officialTools.map((t) => (
                <a
                  key={t.name}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.14)] hover:border-[rgba(255,184,64,0.4)] flex items-center justify-between text-xs text-[#f2f7ff] transition-all focus-ring group"
                >
                  <div>
                    <div className="font-bold group-hover:text-[#ffb840] transition-colors">{t.name}</div>
                    <div className="text-[10px] text-[#9aaccb]">{t.vendor}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#9aaccb] group-hover:text-[#ffb840] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Strong Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-[#101c33] border border-[rgba(255,184,64,0.3)] flex items-start gap-3 text-xs text-[#ffb840]">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Important Engineering Disclaimer:</span>
              <p className="leading-relaxed text-[#f2f7ff]">
                This tool provides diagnostic interpretations based on industry-standard S.M.A.R.T. heuristics and manufacturer documentation. It is not an absolute warranty guarantee. Storage devices can fail abruptly without S.M.A.R.T. warning due to sudden electrical surges, controller failures, or liquid damage. Always maintain an independent 3-2-1 backup of critical data regardless of your reported health score.
              </p>
            </div>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            The Drive Health Reader decodes and explains Self-Monitoring, Analysis, and Reporting Technology (S.M.A.R.T.) telemetry data read from internal and external hard drives and solid-state drives. While utilities like CrystalDiskInfo (Windows), smartctl (Linux/macOS), and DriveDx output dozens of raw hexadecimal values, understanding whether a specific attribute represents benign wear or an imminent hardware failure can be confusing.
          </p>
          <p>
            This tool evaluates critical failure markers—including Reallocated Sector Count (ID 05), Current Pending Sector Count (ID C5), NVMe Available Spare and Percentage Used (Attribute 0x05), and thermal thresholds—translating them into plain-English severity ratings with concrete steps to protect your data.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Check your drive using a S.M.A.R.T. utility',
          text: 'Open CrystalDiskInfo on Windows or run "smartctl -a /dev/sdX" in Linux/Mac Terminal to view your drive telemetry.',
        },
        {
          step: 'Input your reported numbers',
          text: 'Enter your reallocated sectors, pending sectors, temperature, power-on hours, and health percentage above.',
        },
        {
          step: 'Review the diagnostic advice',
          text: 'Check the Good, Caution, or Replace Soon verdict and follow the recommended action plan for backups and diagnostics.',
        },
      ]}
      workedExample={{
        title: 'Example: Diagnosing a 4-Year-Old External Hard Drive',
        scenario: 'A user opens CrystalDiskInfo and sees 8 Reallocated Sectors, 0 Pending Sectors, 28,000 Power-On Hours, and 48°C temperature.',
        output: `Drive Type: Mechanical HDD
Reported Status: CAUTION (Reallocated Sectors Detected)

Technical Explanation:
- 8 Reallocated Sectors: The hard drive platter developed 8 bad physical sectors. The drive internal microcode successfully re-mapped them to reserve sectors.
- 0 Pending Sectors: No current sectors are stuck waiting for reallocation.
- 28,000 Hours (~3.2 Years continuous): Moderate operational lifespan.
- 48°C Temperature: Warm but within acceptable HDD operating range (<50°C).

Action Plan:
1. Complete an immediate full backup of all photos and documents to a secondary drive.
2. Monitor Reallocated Sector Count weekly. If the count stays at 8, the drive may remain stable. If it rises to 15+, replace the drive immediately.
3. Run Western Digital Data Lifeguard / Seagate SeaTools extended surface scan.`,
      }}
      tips={[
        'Reallocated sector growth rate matters more than static count: A drive that developed 2 reallocated sectors years ago and never grew is often stable; a drive adding 5 new sectors every week is dying.',
        'Pending sectors indicate active read errors: If Current Pending Sector Count is above zero, some of your files may currently be unreadable until rewritten.',
        'Keep NVMe SSDs under 70°C: High-speed Gen 4/5 NVMe SSDs require passive heatsinks to prevent thermal throttling and flash wear.',
        'Follow the 3-2-1 backup rule: Keep 3 copies of important files on 2 different media types, with 1 copy located off-site.',
      ]}
      faq={[
        {
          question: 'What is S.M.A.R.T. in storage drives?',
          answer: 'S.M.A.R.T. stands for Self-Monitoring, Analysis, and Reporting Technology. It is an internal diagnostic system built into almost all modern HDDs and SSDs that monitors reliability indicators like read errors, temperature, and flash memory wear.',
        },
        {
          question: 'What does "Reallocated Sector Count" mean?',
          answer: 'When a hard drive or SSD encounters a read/write error on a physical sector, it marks that sector as damaged and maps future reads and writes to a spare reserve block. A high count means the drive is running out of spare blocks.',
        },
        {
          question: 'Can a drive with 100% health still fail suddenly?',
          answer: 'Yes. S.M.A.R.T. can only predict gradual physical degradation (platter wear, bad sectors, flash cell exhaustion). Sudden failures caused by power supply spikes, physical drops, or controller chip burnout can happen without warning.',
        },
        {
          question: 'What happens when an NVMe SSD reaches 100% "Percentage Used"?',
          answer: 'Reaching 100% does not mean the SSD will instantly lock up. It means you have written the maximum Terabytes Written (TBW) guaranteed under the manufacturer warranty. Most quality flash memory can continue writing past this rating, but failure risk increases.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
