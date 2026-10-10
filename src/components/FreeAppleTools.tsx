import React, { useState, useMemo, useEffect } from 'react';
import { 
  Lightbulb, 
  Zap, 
  BatteryCharging, 
  Send, 
  Printer, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Smartphone, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sliders,
  Info
} from 'lucide-react';
import { haptics } from '../utils/haptics';

interface FreeAppleToolsProps {
  onLoadPromptIntoGenerator?: (promptText: string) => void;
}

export const FreeAppleTools: React.FC<FreeAppleToolsProps> = ({ onLoadPromptIntoGenerator }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync hash with document.title
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#ideas') {
        document.title = 'Shortcut Idea Generator — SmartToolHub';
      } else if (hash === '#triggers') {
        document.title = 'iOS Automation Trigger Picker — SmartToolHub';
      } else if (hash === '#charging') {
        document.title = 'iPhone Fast Charging Time Calculator — SmartToolHub';
      } else if (hash === '#transfers') {
        document.title = 'File Transfer Time Calculator — SmartToolHub';
      } else if (hash === '#print-size') {
        document.title = 'Retina Photo Print Size Calculator — SmartToolHub';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const copyText = async (text: string, id: string) => {
    haptics.playTap();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (_) {}
  };

  // =========================================================================
  // TOOL 1: SHORTCUT IDEA GENERATOR STATE
  // =========================================================================
  const [ideaCategory, setIdeaCategory] = useState<
    'productivity' | 'media' | 'health' | 'commute' | 'homekit' | 'developer'
  >('productivity');

  const ideasDatabase: Record<string, { title: string; trigger: string; steps: string[]; summary: string }[]> = {
    productivity: [
      {
        title: 'Meeting Mode Silence & Catch-Up',
        trigger: 'Calendar event start',
        summary: 'Automatically mutes phone, enables Do Not Disturb, and generates a pre-filled meeting notes doc in Apple Notes.',
        steps: ['Detect next calendar event', 'Enable Do Not Disturb for event duration', 'Create timestamped note with attendees list', 'Send automated Slack status: In Meeting'],
      },
      {
        title: 'Daily Standup Draft Generator',
        trigger: 'Tap / 9:00 AM weekday',
        summary: 'Pulls completed Reminders from yesterday and calendar events for today to write a 3-bullet Slack standup.',
        steps: ['Fetch completed reminders from past 24h', 'Fetch today calendar meetings', 'Format clean Markdown list', 'Copy to clipboard & open Slack'],
      },
      {
        title: 'End of Day Workspace Shutdown',
        trigger: '6:00 PM / Home arrival',
        summary: 'Saves open Safari tabs to a reading list, closes Work apps on Mac, and switches iPhone Focus to Personal.',
        steps: ['Save active browser tabs to Reading List', 'Quit Slack and Xcode', 'Set Personal Focus Mode', 'Play Relaxing Evening playlist'],
      },
    ],
    media: [
      {
        title: 'Instant WebP & Watermark Compressor',
        trigger: 'Share Sheet on any photo',
        summary: 'Resizes any 48MP ProRAW or HEIC photo down to 2048px WebP with 85% compression for instant web upload.',
        steps: ['Receive image via iOS Share Sheet', 'Resize longest edge to 2048px', 'Convert to WebP format (85% quality)', 'Save to Photos / Optimized folder'],
      },
      {
        title: 'YouTube Audio to Podcast Voice Note',
        trigger: 'Share Sheet in Safari',
        summary: 'Extracts transcript text or audio clip from a web video and saves it directly to Apple Voice Memos or Notes.',
        steps: ['Extract video URL from Safari', 'Fetch audio or subtitles stream', 'Save to Voice Memos', 'Tag with video creator name'],
      },
      {
        title: 'Screenshot Cleaner & Archive',
        trigger: 'Weekly Sunday automation',
        summary: 'Scans camera roll for screenshots older than 14 days, prompts to delete duplicates, and moves originals to iCloud archive.',
        steps: ['Filter Photos for Media Type = Screenshot', 'Check creation date > 14 days', 'Prompt user with thumbnail grid', 'Delete confirmed screenshots to free storage'],
      },
    ],
    health: [
      {
        title: 'Water Log with Dynamic Reminders',
        trigger: 'Every 2 hours while awake',
        summary: 'Logs 250ml water intake directly into Apple Health with a single tap notification button.',
        steps: ['Prompt: Log Water (250ml, 500ml, 750ml)', 'Write intake value to Apple HealthKit', 'Display current daily total vs 2,500ml goal', 'Schedule next reminder'],
      },
      {
        title: 'Bedtime Wind-Down & Blue Light Filter',
        trigger: '10:30 PM or 45 mins before Sleep Goal',
        summary: 'Turns on warm Night Shift, reduces white point to 80%, sets volume to 15%, and starts sleep sounds.',
        steps: ['Set Display Night Shift: Maximum Warmth', 'Set White Point: 80%', 'Set System Volume to 15%', 'Play Rain Ambience in Apple Music for 30 mins'],
      },
    ],
    commute: [
      {
        title: 'Smart Commute ETA Text to Family',
        trigger: 'Connecting to CarPlay / Leaving Office',
        summary: 'Calculates real-time traffic to home and sends an iMessage to your partner with exact arrival time.',
        steps: ['Check current GPS location', 'Calculate driving travel time to Home address', 'Format: "Headed home now! ETA is [Time]"', 'Send iMessage silently'],
      },
      {
        title: 'Gas Station & Mileage Logger',
        trigger: 'NFC sticker tap on fuel door',
        summary: 'Prompts for current odometer reading and gallons pumped, logging cost per mile into a shared Numbers spreadsheet.',
        steps: ['Read NFC tag', 'Prompt: Enter odometer & gallons', 'Fetch current gas prices nearby', 'Append row to iCloud Numbers sheet: Vehicle Expenses'],
      },
    ],
    homekit: [
      {
        title: 'Good Night Whole-Home Lockdown',
        trigger: 'Double tap Action Button / Nightstand NFC',
        summary: 'Verifies all HomeKit smart locks are locked, turns off all downstairs lights, and sets thermostat to 68°F.',
        steps: ['Check Smart Locks state (Lock if unlocked)', 'Turn Off all living room & kitchen lights', 'Set Ecobee / Nest thermostat to 68°F', 'Turn on iPhone Sleep Focus'],
      },
      {
        title: 'Cinema Mode Movie Time',
        trigger: 'Apple TV Power On in Evening',
        summary: 'Dims living room lights to 10% warm amber, switches Apple TV audio to HomePod stereo pair, and silences notifications.',
        steps: ['Dim Hue / HomeKit lights to 10% warm', 'Set TV audio output to HomePod stereo', 'Turn on Cinema Focus mode', 'Pause background music'],
      },
    ],
    developer: [
      {
        title: 'GitHub Issue to Linear & Reminders',
        trigger: 'Share Sheet / Webhook URL',
        summary: 'Parses GitHub URL, extracts issue title and body, and generates a formatted task in Linear and Apple Reminders.',
        steps: ['Parse GitHub issue number and repo', 'Fetch issue title via API', 'Create task in Linear with Priority P1', 'Add Reminder with due date today'],
      },
      {
        title: 'Mac Localhost Tunnel & Quick QR Code',
        trigger: 'Keyboard Shortcut ⌥⌘T on Mac',
        summary: 'Launches Cloudflare tunnel or ngrok for port 3000 and displays an instant iOS camera QR code to test mobile on local network.',
        steps: ['Run shell script: cloudflared tunnel --url http://localhost:3000', 'Extract public HTTPS tunnel URL', 'Generate QR Code graphic on Mac screen', 'Copy URL to Universal Clipboard'],
      },
    ],
  };

  const currentIdeas = ideasDatabase[ideaCategory] || ideasDatabase.productivity;

  // =========================================================================
  // TOOL 2: AUTOMATION TRIGGER PICKER STATE
  // =========================================================================
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>('time');

  const triggersList = [
    {
      id: 'time',
      name: 'Time of Day',
      icon: '⏰',
      backgroundSupport: 'Full Silent (No Prompt)',
      batteryRating: 'Minimal (< 0.1%)',
      bestFor: 'Daily morning routines, night wind-downs, recurring backups',
      instructions: 'Choose "Time of Day" > Set time and days > Toggle OFF "Ask Before Running" for true zero-touch execution.',
    },
    {
      id: 'nfc',
      name: 'NFC Tag Tap',
      icon: '🏷️',
      backgroundSupport: 'Instant Background',
      batteryRating: 'Zero (< 0.01%)',
      bestFor: 'Bedside actions, car mount triggers, desk mode presets',
      instructions: 'Tap NFC in Shortcuts Automation > Scan cheap NTAG215 sticker > Name tag > Add actions. Runs instantly upon physical tap.',
    },
    {
      id: 'app',
      name: 'App Open / Close',
      icon: '📱',
      backgroundSupport: 'Immediate Silent',
      batteryRating: 'Negligible',
      bestFor: 'Locking apps, auto-logging workout metrics, orientation locks',
      instructions: 'Select App > Choose When Opened or Closed > Add actions like "Set Orientation Lock" or "Turn On Do Not Disturb".',
    },
    {
      id: 'carplay',
      name: 'CarPlay / Bluetooth',
      icon: '🚗',
      backgroundSupport: 'Full Silent',
      batteryRating: 'Minimal',
      bestFor: 'Driving mode, podcast auto-play, ETA texting',
      instructions: 'Select CarPlay > "Connects" > Toggle OFF "Ask Before Running". Automations execute instantly as soon as ignition turns on.',
    },
    {
      id: 'lowpower',
      name: 'Battery Drops Below %',
      icon: '🪫',
      backgroundSupport: 'Immediate Silent',
      batteryRating: 'Minimal',
      bestFor: 'Emergency power preservation, stopping syncing, alert sound',
      instructions: 'Select "Battery Level" > Slider to 20% or 10% > "Falls Below" > Add actions to turn off Bluetooth, Cellular data, or dim screen.',
    },
    {
      id: 'location',
      name: 'Arrive / Leave Location',
      icon: '📍',
      backgroundSupport: 'Requires Notification Tap (iOS Security)',
      batteryRating: 'Moderate (0.5% - 1%)',
      bestFor: 'Home and Office arrival/departure tasks',
      instructions: 'Apple restricts automatic silent location triggers for anti-stalking security. You will receive a 1-tap confirmation banner upon geofence boundary.',
    },
  ];

  const activeTrigger = triggersList.find((t) => t.id === selectedTriggerId) || triggersList[0];

  // =========================================================================
  // TOOL 3: IPHONE CHARGING TIME CALCULATOR STATE
  // =========================================================================
  const [phoneModel, setPhoneModel] = useState<'16promax' | '16pro' | '16' | '15pro' | '14pro'>('16pro');
  const [currentBattery, setCurrentBattery] = useState<number>(20);
  const [targetBattery, setTargetBattery] = useState<number>(80);
  const [chargerWattage, setChargerWattage] = useState<number>(27);

  const phoneSpecs = {
    '16promax': { name: 'iPhone 16 Pro Max', capacityMah: 4685, maxWatts: 30 },
    '16pro': { name: 'iPhone 16 Pro', capacityMah: 3582, maxWatts: 27 },
    '16': { name: 'iPhone 16 Standard', capacityMah: 3561, maxWatts: 25 },
    '15pro': { name: 'iPhone 15 Pro', capacityMah: 3274, maxWatts: 23 },
    '14pro': { name: 'iPhone 14 Pro', capacityMah: 3200, maxWatts: 20 },
  };

  const chargingResults = useMemo(() => {
    const spec = phoneSpecs[phoneModel];
    const diffPercent = Math.max(0, targetBattery - currentBattery);
    
    // Effective charging speed calculation with standard lithium taper curve:
    // 0% -> 80% is fast stage (avg ~75% of max wattage)
    // 80% -> 100% is trickle stage (avg ~5-8W to protect battery health)
    const effectiveWattsFast = Math.min(chargerWattage, spec.maxWatts) * 0.78;
    const fastStageTarget = Math.min(80, targetBattery);
    const fastStageDiff = Math.max(0, fastStageTarget - Math.min(80, currentBattery));
    
    // Fast stage minutes
    const fastMah = (spec.capacityMah * fastStageDiff) / 100;
    const fastWattHours = (fastMah * 3.85) / 1000;
    const fastMinutes = Math.round((fastWattHours / effectiveWattsFast) * 60);

    // Trickle stage minutes (above 80%)
    let trickleMinutes = 0;
    if (targetBattery > 80) {
      const trickleStageDiff = targetBattery - Math.max(80, currentBattery);
      const trickleMah = (spec.capacityMah * trickleStageDiff) / 100;
      const trickleWattHours = (trickleMah * 3.85) / 1000;
      const trickleWatts = 6.5; // Average trickle rate
      trickleMinutes = Math.round((trickleWattHours / trickleWatts) * 60);
    }

    const totalMinutes = Math.max(1, fastMinutes + trickleMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return {
      totalMinutes,
      formattedTime: hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`,
      fastMinutes,
      trickleMinutes,
      maxWattageAchieved: Math.min(chargerWattage, spec.maxWatts),
      recommendation: targetBattery <= 80 
        ? 'Optimal for battery health! Charging to 80% reduces lithium stress and prolongs battery lifespan.'
        : 'Note: Charging above 80% slows down automatically (trickle charge) to manage heat.',
    };
  }, [phoneModel, currentBattery, targetBattery, chargerWattage]);

  // =========================================================================
  // TOOL 4: FILE SIZE CONVERTER & TRANSFER TIME ESTIMATOR STATE
  // =========================================================================
  const [fileSizeValue, setFileSizeValue] = useState<number>(25);
  const [fileSizeUnit, setFileSizeUnit] = useState<'MB' | 'GB' | 'TB'>('GB');
  const [interfaceType, setInterfaceType] = useState<
    'airdrop-6e' | 'thunderbolt4' | 'usbc-10g' | 'usbc-480m' | 'lightning' | 'wifi-gigabit' | 'icloud-100m'
  >('airdrop-6e');

  const transferInterfaces = {
    'airdrop-6e': { name: 'AirDrop (Wi-Fi 6E / AWDL)', mbPerSec: 75, realSpeedText: '~600 Mbps sustained wireless' },
    thunderbolt4: { name: 'Thunderbolt 4 / USB4 Cable', mbPerSec: 3200, realSpeedText: '~40 Gbps bus / 3.2 GB/s NVMe' },
    'usbc-10g': { name: 'USB-C 10Gbps (iPhone 15/16 Pro)', mbPerSec: 1050, realSpeedText: '~10 Gbps / 1,050 MB/s sustained' },
    'usbc-480m': { name: 'USB-C 480Mbps (iPhone 15/16)', mbPerSec: 42, realSpeedText: '~480 Mbps / 42 MB/s USB 2.0 limitation' },
    lightning: { name: 'Lightning Cable (iPhone 14 & older)', mbPerSec: 35, realSpeedText: '~480 Mbps / 35 MB/s Lightning' },
    'wifi-gigabit': { name: 'Gigabit Local Wi-Fi (LAN)', mbPerSec: 110, realSpeedText: '~1 Gbps local router transfer' },
    'icloud-100m': { name: 'iCloud Upload (100 Mbps Broadband)', mbPerSec: 12, realSpeedText: '~100 Mbps home internet upload' },
  };

  const transferResults = useMemo(() => {
    // Normalize input to Megabytes
    let normalizedMb = 0;
    if (fileSizeUnit === 'MB') normalizedMb = Math.max(1, fileSizeValue);
    else if (fileSizeUnit === 'GB') normalizedMb = Math.max(0.001, fileSizeValue) * 1024;
    else if (fileSizeUnit === 'TB') normalizedMb = Math.max(0.0001, fileSizeValue) * 1024 * 1024;

    const totalGb = normalizedMb / 1024;
    const totalTb = totalGb / 1024;
    const totalMb = normalizedMb;
    const totalMbits = totalMb * 8;

    const formatSeconds = (sec: number) => {
      if (sec < 1) return '< 1 second';
      if (sec < 60) return `${sec.toFixed(1)} seconds`;
      if (sec < 3600) {
        const m = Math.floor(sec / 60);
        const s = Math.round(sec % 60);
        return `${m}m ${s}s`;
      }
      const h = Math.floor(sec / 3600);
      const m = Math.round((sec % 3600) / 60);
      return `${h}h ${m}m`;
    };

    const activeIface = transferInterfaces[interfaceType];
    const activeSeconds = Math.max(0.1, normalizedMb / activeIface.mbPerSec);

    // Matrix comparison across all interfaces
    const comparisonMatrix = Object.entries(transferInterfaces).map(([key, iface]) => {
      const sec = Math.max(0.1, normalizedMb / iface.mbPerSec);
      return {
        key,
        name: iface.name,
        mbPerSec: iface.mbPerSec,
        realSpeedText: iface.realSpeedText,
        duration: formatSeconds(sec),
        seconds: sec,
        isCurrent: key === interfaceType,
      };
    });

    return {
      totalMb,
      totalGb,
      totalTb,
      totalMbits,
      activeSeconds,
      formattedDuration: formatSeconds(activeSeconds),
      ifaceName: activeIface.name,
      realSpeed: activeIface.realSpeedText,
      vsThunderboltSpeedRatio: Math.round((transferInterfaces.thunderbolt4.mbPerSec / activeIface.mbPerSec) * 10) / 10,
      comparisonMatrix,
    };
  }, [fileSizeValue, fileSizeUnit, interfaceType]);

  // =========================================================================
  // TOOL 5: PHOTO PRINT SIZE CALCULATOR STATE
  // =========================================================================
  const [photoWidth, setPhotoWidth] = useState<number>(8064);
  const [photoHeight, setPhotoHeight] = useState<number>(6048);

  const printResults = useMemo(() => {
    const w = Math.max(100, photoWidth);
    const h = Math.max(100, photoHeight);
    const megapixels = ((w * h) / 1_000_000).toFixed(1);

    // 300 DPI (Archival / Gallery)
    const in300W = (w / 300).toFixed(1);
    const in300H = (h / 300).toFixed(1);
    const cm300W = ((w / 300) * 2.54).toFixed(1);
    const cm300H = ((h / 300) * 2.54).toFixed(1);

    // 240 DPI (High Quality Magazine)
    const in240W = (w / 240).toFixed(1);
    const in240H = (h / 240).toFixed(1);
    const cm240W = ((w / 240) * 2.54).toFixed(1);
    const cm240H = ((h / 240) * 2.54).toFixed(1);

    // 150 DPI (Poster / Wall Display)
    const in150W = (w / 150).toFixed(1);
    const in150H = (h / 150).toFixed(1);
    const cm150W = ((w / 150) * 2.54).toFixed(1);
    const cm150H = ((h / 150) * 2.54).toFixed(1);

    return {
      megapixels,
      gallery: { inches: `${in300W}" × ${in300H}"`, cm: `${cm300W} × ${cm300H} cm` },
      magazine: { inches: `${in240W}" × ${in240H}"`, cm: `${cm240W} × ${cm240H} cm` },
      poster: { inches: `${in150W}" × ${in150H}"`, cm: `${cm150W} × ${cm150H} cm` },
    };
  }, [photoWidth, photoHeight]);

  return (
    <div className="space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* =========================================================================
          TOOL 1: SHORTCUT IDEA GENERATOR
          ========================================================================= */}
      <section id="ideas" className="scroll-mt-24">
        <div className="bento-card p-6 sm:p-8 tilt-card-3d">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xs">
                  💡
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                  Instant Ideation
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                Apple Shortcut Idea Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Explore proven workflow automation recipes. Pick a category to reveal real-world Siri shortcut blueprints.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'productivity', label: 'Productivity' },
                  { id: 'media', label: 'Photos & Media' },
                  { id: 'health', label: 'Health' },
                  { id: 'commute', label: 'Commute & Travel' },
                  { id: 'homekit', label: 'Smart Home' },
                  { id: 'developer', label: 'Developer' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    haptics.playTap();
                    setIdeaCategory(cat.id);
                  }}
                  className={`tilt-tab-3d px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    ideaCategory === cat.id
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'glass-pill text-slate-700 dark:text-zinc-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentIdeas.map((idea, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {idea.trigger}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText(`${idea.title}\n${idea.summary}`, `idea-${idx}`)}
                      className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                      title="Copy Idea"
                    >
                      {copiedId === `idea-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {idea.summary}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="text-[10px] font-mono text-zinc-400">Action Chain:</div>
                  <ul className="text-[11px] text-zinc-300 space-y-1 list-disc list-inside">
                    {idea.steps.map((st, i) => (
                      <li key={i} className="truncate">
                        {st}
                      </li>
                    ))}
                  </ul>

                  {onLoadPromptIntoGenerator && (
                    <button
                      type="button"
                      onClick={() => {
                        haptics.playTap();
                        onLoadPromptIntoGenerator(idea.title + ': ' + idea.summary);
                        document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Load into AI Generator</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          TOOL 2: AUTOMATION TRIGGER PICKER
          ========================================================================= */}
      <section id="triggers" className="scroll-mt-24">
        <div className="bento-card p-6 sm:p-8 tilt-card-3d">
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center text-xs">
                ⚡
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400">
                iOS Automation Architecture
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
              iOS Automation Trigger Picker
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              Find out whether your shortcut can run 100% silently without requiring manual confirmation taps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Trigger Selection List */}
            <div className="lg:col-span-5 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono mb-1">
                Select an iOS Event Trigger:
              </label>
              {triggersList.map((tr) => (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => {
                    haptics.playTap();
                    setSelectedTriggerId(tr.id);
                  }}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                    selectedTriggerId === tr.id
                      ? 'bg-blue-600/20 border-blue-400 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{tr.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold">{tr.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {tr.backgroundSupport.includes('Silent') ? '✓ Silent' : 'Notice'}
                  </span>
                </button>
              ))}
            </div>

            {/* Right: Technical Feasibility Card */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-black/40 border border-white/15 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeTrigger.icon}</span>
                  <h3 className="text-base font-bold text-white font-heading">
                    {activeTrigger.name} Automation
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/20 border border-blue-400/40 text-blue-300">
                  {activeTrigger.backgroundSupport}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400">Battery Impact</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {activeTrigger.batteryRating}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400">Optimal Use Cases</span>
                  <div className="text-xs text-zinc-200">
                    {activeTrigger.bestFor}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-zinc-300 font-mono">
                  Setup Recipe in Shortcuts App:
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed bg-white/[0.03] p-3.5 rounded-xl border border-white/10">
                  {activeTrigger.instructions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TOOL 3: IPHONE CHARGING TIME CALCULATOR
          ========================================================================= */}
      <section id="charging" className="scroll-mt-24">
        <div className="bento-card p-6 sm:p-8 tilt-card-3d">
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center text-xs">
                🔋
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                Hardware Benchmark
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
              iPhone Fast Charging Time Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              Calculate exact minutes to charge any modern iPhone model based on charger wattage and the lithium thermal curve.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs Form */}
            <div className="lg:col-span-6 space-y-4">
              {/* iPhone Model */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono">
                  iPhone Model:
                </label>
                <select
                  value={phoneModel}
                  onChange={(e) => setPhoneModel(e.target.value as any)}
                  className="glass-input w-full p-3 rounded-xl text-xs sm:text-sm"
                >
                  <option value="16promax">iPhone 16 Pro Max (4,685 mAh / 30W Max)</option>
                  <option value="16pro">iPhone 16 Pro (3,582 mAh / 27W Max)</option>
                  <option value="16">iPhone 16 Standard (3,561 mAh / 25W Max)</option>
                  <option value="15pro">iPhone 15 Pro (3,274 mAh / 23W Max)</option>
                  <option value="14pro">iPhone 14 Pro (3,200 mAh / 20W Max)</option>
                </select>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Current Battery</span>
                    <span className="font-bold text-emerald-400">{currentBattery}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={95}
                    value={currentBattery}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentBattery(val);
                      if (val >= targetBattery) setTargetBattery(Math.min(100, val + 10));
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Target Battery</span>
                    <span className="font-bold text-blue-400">{targetBattery}%</span>
                  </div>
                  <input
                    type="range"
                    min={currentBattery + 5}
                    max={100}
                    value={targetBattery}
                    onChange={(e) => setTargetBattery(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              {/* Charger Type */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono">
                  Charger Adapter Wattage:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { w: 5, label: '5W Legacy USB' },
                    { w: 15, label: '15W MagSafe' },
                    { w: 20, label: '20W Apple USB-C' },
                    { w: 25, label: '25W Qi2' },
                    { w: 30, label: '30W Fast USB-C' },
                    { w: 60, label: '60W+ MacBook' },
                  ].map((ch) => (
                    <button
                      key={ch.w}
                      type="button"
                      onClick={() => {
                        haptics.playTap();
                        setChargerWattage(ch.w);
                      }}
                      className={`p-2 rounded-xl text-center text-xs transition-all cursor-pointer border ${
                        chargerWattage === ch.w
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                          : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/40 border border-white/15 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Estimated Charge Duration
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1 text-emerald-400">
                  {chargingResults.formattedTime}
                </div>
                <p className="text-xs text-zinc-300 mt-2">
                  From {currentBattery}% to {targetBattery}% using {chargerWattage}W charger (capped at{' '}
                  {chargingResults.maxWattageAchieved}W hardware max).
                </p>
              </div>

              {/* Progress Visualizer Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>Fast Phase: {chargingResults.fastMinutes} min</span>
                  {chargingResults.trickleMinutes > 0 && (
                    <span>80%+ Trickle: {chargingResults.trickleMinutes} min</span>
                  )}
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${Math.min(80, targetBattery)}%` }}
                    title="Fast Charging"
                  />
                  {targetBattery > 80 && (
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${targetBattery - 80}%` }}
                      title="Trickle Stage"
                    />
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-zinc-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{chargingResults.recommendation}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TOOL 4: FILE SIZE CONVERTER & TRANSFER TIME ESTIMATOR
          ========================================================================= */}
      <section id="transfers" className="scroll-mt-24">
        <div className="bento-card p-6 sm:p-8 tilt-card-3d space-y-8">
          
          {/* 1. Short Intro */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center text-xs">
                📡
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400">
                Data Transfer &amp; Storage Estimator
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
              File Size Converter &amp; Transfer Time Estimator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
              Convert any file or backup size across megabytes (MB), gigabytes (GB), and terabytes (TB). Instantly estimate how long moves take across AirDrop, USB-C 10Gbps cables, Thunderbolt 4, Lightning, and home broadband.
            </p>
          </div>

          {/* 2. Calculator Core */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-5">
              {/* Unit Toggle and Input Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="file-size-number" className="text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono">
                    Enter File or Backup Size:
                  </label>
                  <div className="inline-flex rounded-lg bg-white/5 border border-white/10 p-0.5">
                    {(['MB', 'GB', 'TB'] as const).map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => {
                          haptics.playTap();
                          setFileSizeUnit(unit);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          fileSizeUnit === unit
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="file-size-number"
                    type="number"
                    min={0.1}
                    step={fileSizeUnit === 'TB' ? '0.1' : '1'}
                    value={fileSizeValue}
                    onChange={(e) => setFileSizeValue(Math.max(0.1, Number(e.target.value)))}
                    className="glass-input w-full p-3 rounded-xl text-base font-bold text-white font-mono"
                  />
                  <span className="text-sm font-mono font-bold text-indigo-300 px-4 py-3 rounded-xl bg-white/10 shrink-0">
                    {fileSizeUnit}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { val: 500, unit: 'MB' as const, label: '500 MB (Photos / Audio)' },
                    { val: 5, unit: 'GB' as const, label: '5 GB (HD Video)' },
                    { val: 25, unit: 'GB' as const, label: '25 GB (4K ProRes)' },
                    { val: 64, unit: 'GB' as const, label: '64 GB (iOS Backup)' },
                    { val: 1, unit: 'TB' as const, label: '1 TB (Mac Drive)' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        haptics.playTap();
                        setFileSizeValue(p.val);
                        setFileSizeUnit(p.unit);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] glass-pill text-zinc-300 hover:text-white cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Converted Units Bar */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Equivalent Normalized Sizes (Binary 1,024 Base)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="p-2 rounded-lg bg-black/40">
                    <div className="text-[10px] text-zinc-400">Megabytes</div>
                    <div className="font-bold text-indigo-300 truncate">
                      {transferResults.totalMb >= 1000 ? Math.round(transferResults.totalMb).toLocaleString() : transferResults.totalMb.toFixed(1)} MB
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40">
                    <div className="text-[10px] text-zinc-400">Gigabytes</div>
                    <div className="font-bold text-white truncate">
                      {transferResults.totalGb < 0.1 ? transferResults.totalGb.toFixed(3) : transferResults.totalGb.toFixed(2)} GB
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40">
                    <div className="text-[10px] text-zinc-400">Terabytes</div>
                    <div className="font-bold text-indigo-300 truncate">
                      {transferResults.totalTb < 0.01 ? transferResults.totalTb.toFixed(4) : transferResults.totalTb.toFixed(3)} TB
                    </div>
                  </div>
                </div>
              </div>

              {/* Interface Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono">
                  Select Connection Interface:
                </label>
                <select
                  value={interfaceType}
                  onChange={(e) => {
                    haptics.playTap();
                    setInterfaceType(e.target.value as any);
                  }}
                  className="glass-input w-full p-3 rounded-xl text-xs sm:text-sm text-white bg-black/50"
                >
                  <option value="airdrop-6e">AirDrop (Wi-Fi 6E Peer-to-Peer / ~75 MB/s)</option>
                  <option value="usbc-10g">USB-C 10Gbps Cable (iPhone 15/16 Pro to SSD / ~1,050 MB/s)</option>
                  <option value="thunderbolt4">Thunderbolt 4 / USB4 (Mac to NVMe SSD / ~3,200 MB/s)</option>
                  <option value="usbc-480m">USB-C 2.0 (iPhone 15/16 Standard Cable / ~42 MB/s)</option>
                  <option value="lightning">Lightning Cable (iPhone 14 &amp; Older / ~35 MB/s)</option>
                  <option value="wifi-gigabit">Gigabit Local Wi-Fi (Home Router / ~110 MB/s)</option>
                  <option value="icloud-100m">iCloud Backup (100 Mbps Home Broadband / ~12 MB/s)</option>
                </select>
              </div>
            </div>

            {/* Results Output Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/40 border border-white/15 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Estimated Transfer Duration
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1 text-indigo-400">
                  {transferResults.formattedDuration}
                </div>
                <p className="text-xs text-zinc-300 mt-2">
                  Moving {fileSizeValue} {fileSizeUnit} ({Math.round(transferResults.totalMb).toLocaleString()} MB) via {transferResults.ifaceName}.
                </p>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Real sustained speed: {transferResults.realSpeed}
                </p>
              </div>

              {/* Comparative Matrix across Speeds */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Speed Comparison Across Apple Connections:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {transferResults.comparisonMatrix.map((item) => (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-colors ${
                        item.isCurrent
                          ? 'bg-indigo-600/30 border border-indigo-400/50 text-white'
                          : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="truncate pr-2">{item.name}</span>
                      <span className={`font-bold shrink-0 ${item.isCurrent ? 'text-indigo-300' : 'text-zinc-200'}`}>
                        {item.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Worked Example */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">📝</span>
              <h3 className="text-sm font-bold text-white font-heading">
                Worked Example: Moving a 25 GB 4K ProRes Video Clip from iPhone to Mac
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Suppose you recorded a 25 GB 4K ProRes video on an iPhone 16 Pro and want to know whether you should AirDrop it or plug in a USB-C 10Gbps SSD cable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-indigo-400">Step 1: Convert to MB</span>
                <p className="text-zinc-300 font-mono text-[11px]">
                  25 GB × 1,024 = <strong>25,600 MB</strong>
                </p>
                <p className="text-[10px] text-zinc-500">Apple file systems use binary 1,024 multipliers for storage calculation.</p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-blue-400">Step 2: AirDrop Wireless</span>
                <p className="text-zinc-300 font-mono text-[11px]">
                  25,600 MB ÷ 75 MB/s = <strong>~341 seconds</strong>
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold">Total time: ~5 minutes 41 seconds</p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400">Step 3: USB-C 10Gbps Cable</span>
                <p className="text-zinc-300 font-mono text-[11px]">
                  25,600 MB ÷ 1,050 MB/s = <strong>~24.4 seconds</strong>
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold">Result: 14× faster than AirDrop</p>
              </div>
            </div>
          </div>

          {/* 4. FAQ Accordion */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white font-heading">
              Frequently Asked Questions About File Sizes &amp; Transfer Speeds
            </h3>
            <div className="space-y-2">
              <details className="group p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                <summary className="font-semibold text-zinc-200 cursor-pointer list-none flex items-center justify-between">
                  <span>Why do files appear smaller on Mac than what my drive package says?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-2 text-zinc-400 leading-relaxed text-[11px]">
                  Storage drive manufacturers advertise capacity in decimal gigabytes (1 GB = 1,000,000,000 bytes). However, operating systems and memory transfer protocols frequently compute binary gibibytes (1 GiB = 1,073,741,824 bytes). This means a 1 TB drive shows up as approximately 931 GB in binary calculators.
                </p>
              </details>

              <details className="group p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                <summary className="font-semibold text-zinc-200 cursor-pointer list-none flex items-center justify-between">
                  <span>Why is AirDrop sometimes much slower than the 75 MB/s benchmark?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-2 text-zinc-400 leading-relaxed text-[11px]">
                  AirDrop uses Apple Wireless Direct Link (AWDL). When devices are more than 3 meters apart or when 5GHz channels experience wireless congestion, AWDL down-negotiates to 2.4GHz channels, cutting throughput from 75 MB/s down to 15–25 MB/s. Keeping devices side-by-side restores maximum peer-to-peer speed.
                </p>
              </details>

              <details className="group p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                <summary className="font-semibold text-zinc-200 cursor-pointer list-none flex items-center justify-between">
                  <span>Do all USB-C cables transfer files at 10Gbps?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-2 text-zinc-400 leading-relaxed text-[11px]">
                  No. The standard woven USB-C charge cable included in the iPhone box only supports USB 2.0 speeds (up to 480 Mbps or ~42 MB/s). To unlock the full 10Gbps (~1,050 MB/s) speeds supported by iPhone 15 Pro, iPhone 16 Pro, iPad Pro, and Mac, you need a dedicated USB-C 10Gbps or Thunderbolt 4 cable.
                </p>
              </details>

              <details className="group p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                <summary className="font-semibold text-zinc-200 cursor-pointer list-none flex items-center justify-between">
                  <span>How much storage does 4K ProRes video consume on an iPhone?</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-2 text-zinc-400 leading-relaxed text-[11px]">
                  Apple ProRes 422 HQ at 4K 60fps requires roughly 750 MB to 1 GB per minute of footage, or approximately 45–60 GB per hour. This is why Apple enables direct recording to external USB-C SSDs on Pro models.
                </p>
              </details>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          TOOL 5: PHOTO PRINT SIZE CALCULATOR
          ========================================================================= */}
      <section id="print-size" className="scroll-mt-24">
        <div className="bento-card p-6 sm:p-8 tilt-card-3d">
          <div className="space-y-1 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center text-xs">
                🖼️
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400">
                Retina &amp; DPI Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
              Retina Photo Print Size Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              Input camera pixel dimensions to get maximum physical print sizes in inches and cm at 300 DPI, 240 DPI, and 150 DPI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Dimensions Input */}
            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono">
                    Width (Pixels):
                  </label>
                  <input
                    type="number"
                    value={photoWidth}
                    onChange={(e) => setPhotoWidth(Math.max(10, Number(e.target.value)))}
                    className="glass-input w-full p-3 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 font-mono">
                    Height (Pixels):
                  </label>
                  <input
                    type="number"
                    value={photoHeight}
                    onChange={(e) => setPhotoHeight(Math.max(10, Number(e.target.value)))}
                    className="glass-input w-full p-3 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-zinc-400">Camera Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '48MP ProRAW (8064×6048)', w: 8064, h: 6048 },
                    { label: '24MP Standard (5712×4284)', w: 5712, h: 4284 },
                    { label: '12MP Ultra-Wide (4032×3024)', w: 4032, h: 3024 },
                    { label: '4K Still (3840×2160)', w: 3840, h: 2160 },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        haptics.playTap();
                        setPhotoWidth(p.w);
                        setPhotoHeight(p.h);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] glass-pill text-zinc-300 hover:text-white cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 flex items-center justify-between">
                <span>Total Megapixels:</span>
                <span className="text-purple-300 font-bold">{printResults.megapixels} MP</span>
              </div>
            </div>

            {/* DPI Print Matrix Display */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 300 DPI */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">
                    300 DPI (Gallery Quality)
                  </span>
                  <div className="text-lg font-bold text-white font-heading mt-1">
                    {printResults.gallery.inches}
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    {printResults.gallery.cm}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Viewing distance &lt; 1ft. Archival photo framing.
                </p>
              </div>

              {/* 240 DPI */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                    240 DPI (Magazine Quality)
                  </span>
                  <div className="text-lg font-bold text-white font-heading mt-1">
                    {printResults.magazine.inches}
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    {printResults.magazine.cm}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Standard photo albums &amp; desk prints.
                </p>
              </div>

              {/* 150 DPI */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    150 DPI (Poster Quality)
                  </span>
                  <div className="text-lg font-bold text-white font-heading mt-1">
                    {printResults.poster.inches}
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    {printResults.poster.cm}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Viewing distance &gt; 3ft. Wall art &amp; banners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
