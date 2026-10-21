import React, { useState } from 'react';
import { HardDrive, BatteryCharging, Zap, Check, AlertCircle, Sparkles, PieChart, Clock } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface IPhoneStoragePlannerPageProps {
  navigate: (path: string) => void;
}

export const IPhoneStoragePlannerPage: React.FC<IPhoneStoragePlannerPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'storage' | 'charging'>('storage');

  // Storage Planner Inputs
  const [photoCount, setPhotoCount] = useState<number>(3500);
  const [videoMinutes4k, setVideoMinutes4k] = useState<number>(45);
  const [offlineSongs, setOfflineSongs] = useState<number>(800);
  const [largeGamesCount, setLargeGamesCount] = useState<number>(4);
  const [offlineMoviesCount, setOfflineMoviesCount] = useState<number>(2);
  const [yearsOfUse, setYearsOfUse] = useState<number>(3);
  const [useICloudOptimize, setUseICloudOptimize] = useState<boolean>(false);

  // Charging Calculator Inputs
  const [selectedModelMah, setSelectedModelMah] = useState<number>(3561); // iPhone 16 Pro default
  const [selectedModelMaxWatts, setSelectedModelMaxWatts] = useState<number>(27);
  const [chargerWatts, setChargerWatts] = useState<number>(20);
  const [startPct, setStartPct] = useState<number>(15);
  const [targetPct, setTargetPct] = useState<number>(80);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'iphone-storage-planner') || LAUNCH_TOOLS[13];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'iphone-battery-health-forecast' || t.slug === 'file-transfer-time-calculator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'mastering-apple-shortcuts-ios') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Casual user: 3,000 photos, streaming music, 2-year lifespan',
    'Content creator: 500 4K video clips, 20 large apps, 3-year plan',
    'Power traveler: 12,000 photos, 20GB offline Spotify, 4-year plan',
  ];

  // Storage calculation:
  // Photos: ~3.5MB per HEIC photo (with iCloud Optimize it is ~0.4MB thumbnails locally)
  const photoGb = useICloudOptimize ? (photoCount * 0.4) / 1024 : (photoCount * 3.5) / 1024;
  // 4K 60fps Video: ~400MB per minute
  const videoGb = (videoMinutes4k * 400) / 1024;
  // Offline High-Res Audio: ~10MB per song
  const musicGb = (offlineSongs * 10) / 1024;
  // Large Games / Apps: ~4.5GB each
  const gamesGb = largeGamesCount * 4.5;
  // Offline 1080p Movies / Downloads: ~3.5GB each
  const moviesGb = offlineMoviesCount * 3.5;
  // iOS System Software + System Cache & Indexing buffer: ~22GB
  const systemGb = 22;

  // Base current usage in GB
  const currentTotalGb = photoGb + videoGb + musicGb + gamesGb + moviesGb + systemGb;
  // Projected growth over years (photos & apps grow ~20% annually)
  const annualGrowthFactor = Math.pow(1.18, yearsOfUse - 1);
  const projectedTotalGb = Math.round((currentTotalGb - systemGb) * annualGrowthFactor + systemGb);

  // Recommended Storage Tier
  const recommendedTier =
    projectedTotalGb <= 105
      ? '128 GB'
      : projectedTotalGb <= 220
      ? '256 GB'
      : projectedTotalGb <= 440
      ? '512 GB'
      : '1 TB';

  // Charging calculations
  const effectiveFastWatts = Math.min(chargerWatts, selectedModelMaxWatts) * 0.85;
  const trickleWatts = Math.min(chargerWatts, 6) * 0.85;
  const totalWh = (selectedModelMah / 1000) * 3.85;
  const startFast = Math.min(startPct, 80);
  const targetFast = Math.min(targetPct, 80);
  const fastPctDiff = Math.max(0, targetFast - startFast);
  const fastHours = effectiveFastWatts > 0 ? ((fastPctDiff / 100) * totalWh) / effectiveFastWatts : 0;
  const startTrickle = Math.max(80, startPct);
  const targetTrickle = Math.max(80, targetPct);
  const tricklePctDiff = Math.max(0, targetTrickle - startTrickle);
  const trickleHours = trickleWatts > 0 ? ((tricklePctDiff / 100) * totalWh) / trickleWatts : 0;
  const totalChargeMinutes = Math.round((fastHours + trickleHours) * 60);

  const handleChipClick = (chip: string) => {
    setActiveTab('storage');
    if (chip.includes('Casual user')) {
      setPhotoCount(3000);
      setVideoMinutes4k(15);
      setOfflineSongs(200);
      setLargeGamesCount(2);
      setOfflineMoviesCount(1);
      setYearsOfUse(2);
      setUseICloudOptimize(true);
    } else if (chip.includes('Content creator')) {
      setPhotoCount(8000);
      setVideoMinutes4k(350);
      setOfflineSongs(500);
      setLargeGamesCount(12);
      setOfflineMoviesCount(5);
      setYearsOfUse(3);
      setUseICloudOptimize(false);
    } else {
      setPhotoCount(12000);
      setVideoMinutes4k(60);
      setOfflineSongs(2500);
      setLargeGamesCount(5);
      setOfflineMoviesCount(8);
      setYearsOfUse(4);
      setUseICloudOptimize(false);
    }
  };

  const handleCompute = (text: string) => {
    return {
      result: `iPhone Storage & Charging Analysis:
Current Storage Estimate: ${Math.round(currentTotalGb)} GB
Projected Needs in ${yearsOfUse} Years: ${projectedTotalGb} GB
Recommended Tier: ${recommendedTier}
Breakdown:
- Photos: ${photoGb.toFixed(1)} GB (${photoCount.toLocaleString()} items)
- 4K Video: ${videoGb.toFixed(1)} GB (${videoMinutes4k} mins)
- Offline Music: ${musicGb.toFixed(1)} GB
- Heavy Games/Apps: ${gamesGb.toFixed(1)} GB
- System Data: ${systemGb} GB

Charging Benchmark: ${selectedModelMah}mAh with ${chargerWatts}W charger takes ~${totalChargeMinutes} mins to charge from ${startPct}% to ${targetPct}%.`,
      rawData: { currentTotalGb, projectedTotalGb, recommendedTier, totalChargeMinutes },
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="iPhone Storage Planner & Charger"
      subheading="Calculate exactly how many gigabytes you need before buying your next iPhone and benchmark realistic charging curves across chargers. Features dual-tab planner and charger."
      inputLabel="Planner Parameters"
      inputPlaceholder="Select your photo library size, video habits, and charging setup..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Calculate Storage & Charging"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Dual Tab Switcher */}
          <div className="flex p-1 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
            <button
              type="button"
              onClick={() => setActiveTab('storage')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all focus-ring flex items-center justify-center gap-2 ${
                activeTab === 'storage'
                  ? 'bg-[#101c33] text-[#8b5cf6] shadow-md border border-[rgba(139, 92, 246,0.3)]'
                  : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
              }`}
            >
              <HardDrive size={16} />
              <span>Storage Capacity Planner</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('charging')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all focus-ring flex items-center justify-center gap-2 ${
                activeTab === 'charging'
                  ? 'bg-[#101c33] text-[#8b5cf6] shadow-md border border-[rgba(139, 92, 246,0.3)]'
                  : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
              }`}
            >
              <BatteryCharging size={16} />
              <span>Charging Time Benchmark</span>
            </button>
          </div>

          {activeTab === 'storage' ? (
            /* TAB 1: STORAGE PLANNER */
            <div className="space-y-5">
              {/* iCloud Optimize Photos Toggle */}
              <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#f2f7ff]">
                    iCloud Photos "Optimize iPhone Storage" Enabled
                  </div>
                  <div className="text-[11px] text-[#8fa3c0]">
                    Stores full-resolution originals in iCloud and keeps lightweight thumbnails on phone.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseICloudOptimize(!useICloudOptimize)}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 focus-ring ${
                    useICloudOptimize ? 'bg-[#8b5cf6]' : 'bg-[#1e293b]'
                  }`}
                  aria-label="Toggle iCloud Optimize"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#050a14] transition-transform ${
                      useICloudOptimize ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo Library */}
                <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#8fa3c0] uppercase">Photos in Library</span>
                    <span className="font-mono font-bold text-[#8b5cf6]">
                      {photoCount.toLocaleString()} photos (~{photoGb.toFixed(1)} GB)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="30000"
                    step="500"
                    value={photoCount}
                    onChange={(e) => setPhotoCount(Number(e.target.value))}
                    className="w-full accent-[#8b5cf6]"
                  />
                </div>

                {/* 4K Video Minutes */}
                <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#8fa3c0] uppercase">4K Video Clips</span>
                    <span className="font-mono font-bold text-[#8b5cf6]">
                      {videoMinutes4k} mins (~{videoGb.toFixed(1)} GB)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={videoMinutes4k}
                    onChange={(e) => setVideoMinutes4k(Number(e.target.value))}
                    className="w-full accent-[#8b5cf6]"
                  />
                </div>

                {/* Offline Songs */}
                <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#8fa3c0] uppercase">Offline Music & Podcasts</span>
                    <span className="font-mono font-bold text-[#8b5cf6]">
                      {offlineSongs.toLocaleString()} tracks (~{musicGb.toFixed(1)} GB)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={offlineSongs}
                    onChange={(e) => setOfflineSongs(Number(e.target.value))}
                    className="w-full accent-[#8b5cf6]"
                  />
                </div>

                {/* Heavy Games / Apps */}
                <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#8fa3c0] uppercase">Large Games & Creative Apps</span>
                    <span className="font-mono font-bold text-[#8b5cf6]">
                      {largeGamesCount} apps (~{gamesGb.toFixed(1)} GB)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={largeGamesCount}
                    onChange={(e) => setLargeGamesCount(Number(e.target.value))}
                    className="w-full accent-[#8b5cf6]"
                  />
                </div>
              </div>

              {/* Years of Ownership */}
              <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#8fa3c0] uppercase">Planned Years of Ownership</span>
                  <span className="font-mono font-bold text-[#f2f7ff]">
                    {yearsOfUse} Years (Accounts for annual storage accumulation)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setYearsOfUse(yr)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-colors focus-ring ${
                        yearsOfUse === yr
                          ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                          : 'bg-[#050a14] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                      }`}
                    >
                      {yr} {yr === 1 ? 'Year' : 'Years'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: CHARGING BENCHMARK */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
                <div className="text-xs font-mono uppercase text-[#8fa3c0]">Phone Model Preset</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModelMah(3561);
                      setSelectedModelMaxWatts(27);
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs font-medium focus-ring ${
                      selectedModelMah === 3561
                        ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                        : 'bg-[#050a14] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                    }`}
                  >
                    iPhone 16 / 15 Pro (3,561 mAh · 27W)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModelMah(4685);
                      setSelectedModelMaxWatts(30);
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs font-medium focus-ring ${
                      selectedModelMah === 4685
                        ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                        : 'bg-[#050a14] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                    }`}
                  >
                    iPhone 16 Pro Max (4,685 mAh · 30W)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[5, 12, 20, 30].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setChargerWatts(w)}
                    className={`py-2 rounded-lg border text-center text-xs font-bold focus-ring ${
                      chargerWatts === w
                        ? 'bg-[#8b5cf6] text-[#050a14] border-[#8b5cf6]'
                        : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                    }`}
                  >
                    {w}W Adapter
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      customResultRenderer={({ result }) => (
        <div className="space-y-6">
          {activeTab === 'storage' ? (
            /* STORAGE RESULT CARD */
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider block">
                    Recommended iPhone Capacity
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black font-display text-[#8b5cf6]">
                      {recommendedTier}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-[rgba(139, 92, 246,0.3)] bg-[#0a1424] text-[#8b5cf6] font-semibold">
                      Ideal for {yearsOfUse}-Year Ownership
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.14)] text-right">
                  <span className="text-[11px] font-mono text-[#8fa3c0] uppercase block">
                    Projected Consumption
                  </span>
                  <span className="text-xl font-bold font-mono text-[#f2f7ff]">
                    {projectedTotalGb} GB / {recommendedTier}
                  </span>
                  <span className="text-[10px] text-[#8fa3c0] block mt-0.5">
                    Currently: {Math.round(currentTotalGb)} GB used
                  </span>
                </div>
              </div>

              {/* Multi-segment Storage Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[#8fa3c0]">
                  <span>Storage Utilization Breakdown</span>
                  <span>{Math.round((currentTotalGb / parseInt(recommendedTier)) * 100)}% of {recommendedTier}</span>
                </div>
                <div className="h-4 w-full bg-[#101c33] rounded-full overflow-hidden flex p-0.5 border border-[rgba(143,163,192,0.16)]">
                  <div style={{ width: `${(photoGb / currentTotalGb) * 100}%` }} className="h-full bg-[#8b5cf6]" title="Photos" />
                  <div style={{ width: `${(videoGb / currentTotalGb) * 100}%` }} className="h-full bg-[#5aa9ff]" title="Video" />
                  <div style={{ width: `${(musicGb / currentTotalGb) * 100}%` }} className="h-full bg-[#ffb840]" title="Music" />
                  <div style={{ width: `${(gamesGb / currentTotalGb) * 100}%` }} className="h-full bg-[#a855f7]" title="Apps/Games" />
                  <div style={{ width: `${(systemGb / currentTotalGb) * 100}%` }} className="h-full bg-[#64748b]" title="System" />
                </div>
                <div className="flex flex-wrap gap-4 text-[11px] font-mono text-[#8fa3c0] pt-1">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> Photos: {photoGb.toFixed(1)}GB</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5aa9ff]" /> Video: {videoGb.toFixed(1)}GB</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ffb840]" /> Music: {musicGb.toFixed(1)}GB</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" /> Apps: {gamesGb.toFixed(1)}GB</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#64748b]" /> System: {systemGb}GB</span>
                </div>
              </div>
            </div>
          ) : (
            /* CHARGING RESULT CARD */
            <div className="p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider block">
                    Calculated Charging Time
                  </span>
                  <span className="text-4xl font-black font-display text-[#8b5cf6] mt-1 block">
                    ~{totalChargeMinutes} minutes
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[#8fa3c0] block uppercase">
                    Setup
                  </span>
                  <span className="text-sm font-bold text-[#f2f7ff]">
                    {chargerWatts}W Charger · {startPct}% to {targetPct}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#8fa3c0] leading-relaxed border-t border-[rgba(143,163,192,0.12)] pt-3">
                Fast charges at full rate up to 80%, then automatically switches to trickle charging to protect internal cell longevity.
              </p>
            </div>
          )}
        </div>
      )}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The iPhone Storage Planner & Charging Time Calculator takes the guesswork out of choosing your next iPhone's capacity and charging setup. Buying too little storage forces you to constantly delete 4K videos or pay indefinite cloud subscription fees, while overbuying storage wastes hundreds of dollars upfront.
          </p>
          <p>
            This tool calculates your real-world gigabyte consumption based on your photo library size, 4K video recording habits, offline music, and heavy 3D games. It projects your future storage needs across your planned years of ownership, accounting for system indexing, application updates, and cache growth. The built-in charging tab models lithium-ion charging curves across popular wall adapters.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Estimate your photo and media habits',
          text: 'Drag the sliders for photos, 4K video minutes, and offline Spotify/Apple Music downloads.',
        },
        {
          step: 'Indicate whether you use iCloud Photo optimization',
          text: 'Toggle iCloud Optimize to see how cloud offloading reduces local storage demands by up to 85%.',
        },
        {
          step: 'Set your intended phone lifespan',
          text: 'Choose 1, 2, 3, or 4 years to apply realistic compound media growth curves.',
        },
        {
          step: 'Check the charging benchmark',
          text: 'Switch to the Charging tab to benchmark how fast your model charges on 20W vs 30W adapters.',
        },
      ]}
      workedExample={{
        title: 'Example: Family Photographer Upgrading to iPhone 16 Pro',
        scenario: 'A parent taking 6,000 photos and 90 minutes of 4K video of their children, planning to keep the phone for 3 years without iCloud storage.',
        output: `### Storage Projection:
- Photos (6,000 HEIC): 20.5 GB
- 4K 60fps Video (90 mins): 35.1 GB
- Offline Media & Games: 24.0 GB
- iOS System & Caches: 22.0 GB
- Current Total: ~101.6 GB
- 3-Year Projection (+18% annual growth): ~158 GB

Recommended Tier: 256 GB.
Verdict: While 128 GB fits today, it will be completely full in 12 months. 256 GB provides comfortable headroom without overpaying for 512 GB.`,
      }}
      tips={[
        'Avoid buying the base 128GB tier if recording 4K ProRes: On iPhone Pro models, Apple disables 4K ProRes video recording on 128GB tiers, restricting it to 1080p unless you buy 256GB or higher.',
        'High-capacity SSDs have faster transfer speeds: 256GB and 512GB tiers often achieve up to 30% faster sustained write speeds than 128GB models due to dual-channel NAND flash architecture.',
        'iCloud 200GB plan is cheaper than storage upgrades: Upgrading an iPhone from 128GB to 256GB costs $100. Paying $2.99/mo for 200GB iCloud storage gives you cloud backup and offloading for nearly 3 years.',
        'Always leave at least 15GB free: iOS requires free NAND space for dynamic APFS wear-leveling, temporary swap memory, and background OTA software updates.',
      ]}
      faq={[
        {
          question: 'How much space does iOS and System Data take up?',
          answer: 'The core iOS operating system takes 10GB to 12GB, while System Data (caches, Siri voices, fonts, and logs) typically uses another 8GB to 15GB, meaning a new phone already has ~20GB occupied out of the box.',
        },
        {
          question: 'Is 128GB enough for most iPhone users today?',
          answer: '128GB is sufficient only if you stream music and video, take occasional photos, or subscribe to iCloud Photos with Optimize Storage turned on. For heavy 4K video or gaming, 256GB is the recommended baseline.',
        },
        {
          question: 'Can I plug an external USB-C drive into my iPhone?',
          answer: 'Yes. On iPhone 15 and iPhone 16 series, the USB-C port supports external NVMe SSDs and flash drives via the Files app, and allows direct external recording of ProRes video.',
        },
        {
          question: 'Why does charging take longer between 80% and 100%?',
          answer: 'Lithium-ion cells generate high internal resistance when nearly saturated. To prevent dendrite formation and electrolyte overheating, iOS switches into trickle charging mode.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
