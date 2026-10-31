import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Archive,
  Check,
  Sliders,
  RefreshCw,
  Wifi,
  UserCheck,
  List,
  Palette,
  ShieldCheck,
  Printer,
  Layers,
  Info,
} from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface QrItem {
  id: number;
  text: string;
  dataUrl: string;
  svgString: string;
  filenameBase: string;
}

interface BatchQrCodeGeneratorPageProps {
  navigate: (path: string) => void;
}

export const BatchQrCodeGeneratorPage: React.FC<BatchQrCodeGeneratorPageProps> = ({ navigate }) => {
  const [inputMode, setInputMode] = useState<'batch' | 'wifi' | 'vcard'>('batch');
  const [rawText, setRawText] = useState<string>(
    'https://smarttoolhub.net\nhttps://smarttoolhub.net/tools\nWIFI:T:WPA;S:OfficeGuest;P:Welcome2026;;'
  );

  // Wi-Fi Preset State
  const [wifiSsid, setWifiSsid] = useState<string>('OfficeGuest');
  const [wifiPassword, setWifiPassword] = useState<string>('Welcome2026');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);

  // vCard Preset State
  const [vcardName, setVcardName] = useState<string>('Alex Rivera');
  const [vcardOrg, setVcardOrg] = useState<string>('SmartToolHub Studio');
  const [vcardPhone, setVcardPhone] = useState<string>('+1-555-019-2834');
  const [vcardEmail, setVcardEmail] = useState<string>('alex@example.com');
  const [vcardUrl, setVcardUrl] = useState<string>('https://smarttoolhub.net');

  // Appearance & Output State
  const [qrSize, setQrSize] = useState<number>(512);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState<string>('#050a14');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  const [qrList, setQrList] = useState<QrItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'batch-qr-code-generator') || {
    id: 'batch-qr-code-generator',
    name: 'Free QR Code Generator (Single & Batch)',
    slug: 'batch-qr-code-generator',
    description:
      'Create free static QR codes with no sign-up and no expiry. Works offline in your browser with PNG & SVG downloads, custom colors, Wi-Fi, and vCard presets.',
    category: 'Productivity',
    icon: 'QrCode',
    type: 'client',
    keywords: [
      'free qr code generator',
      'static qr code generator no expiry',
      'qr code svg download',
      'wifi qr code generator',
      'batch qr code generator',
    ],
    relatedToolSlugs: ['install-command-generator', 'file-checksum-verifier'],
    isFlagship: false,
  };

  const relatedTools = LAUNCH_TOOLS.filter(
    (t) =>
      t.slug === 'install-command-generator' ||
      t.slug === 'file-checksum-verifier' ||
      t.slug === 'file-transfer-time-calculator'
  );
  const relatedGuide = POPULAR_GUIDES[0];

  const applyWifiPreset = () => {
    const cleanSsid = wifiSsid.replace(/([\\;,:])/g, '\\$1');
    const cleanPass = wifiPassword.replace(/([\\;,:])/g, '\\$1');
    const wifiString = `WIFI:T:${wifiEncryption};S:${cleanSsid};P:${
      wifiEncryption === 'nopass' ? '' : cleanPass
    };H:${wifiHidden ? 'true' : 'false'};;`;
    setRawText(wifiString);
  };

  const applyVcardPreset = () => {
    // Keep vCard on a single line or standard newline-escaped payload for single QR generation
    const vcardPayload = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${vcardName.trim()}`,
      vcardOrg.trim() ? `ORG:${vcardOrg.trim()}` : '',
      vcardPhone.trim() ? `TEL:${vcardPhone.trim()}` : '',
      vcardEmail.trim() ? `EMAIL:${vcardEmail.trim()}` : '',
      vcardUrl.trim() ? `URL:${vcardUrl.trim()}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');
    setRawText(vcardPayload);
  };

  // Parse items: if rawText starts with BEGIN:VCARD, treat the whole vCard block as 1 QR code; otherwise split by line (max 50)
  const itemsToEncode = useMemo(() => {
    const trimmed = rawText.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('BEGIN:VCARD')) {
      return [trimmed];
    }
    return trimmed
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 50);
  }, [rawText]);

  const sanitizeFilenameBase = (text: string, index: number): string => {
    if (text.startsWith('BEGIN:VCARD')) {
      const fnMatch = text.match(/FN:([^\n\r]+)/i);
      const nameSlug = (fnMatch ? fnMatch[1] : 'contact')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
        .slice(0, 24);
      return `qr-${String(index + 1).padStart(2, '0')}-vcard-${nameSlug || 'contact'}`;
    }
    if (text.startsWith('WIFI:')) {
      const ssidMatch = text.match(/S:([^;]+);/i);
      const ssidSlug = (ssidMatch ? ssidMatch[1] : 'wifi')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
        .slice(0, 24);
      return `qr-${String(index + 1).padStart(2, '0')}-wifi-${ssidSlug || 'network'}`;
    }
    try {
      if (text.startsWith('http://') || text.startsWith('https://')) {
        const url = new URL(text);
        const hostSlug = url.hostname.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
        const pathSlug = url.pathname.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20);
        return `qr-${String(index + 1).padStart(2, '0')}-${hostSlug}${pathSlug ? `-${pathSlug}` : ''}`;
      }
    } catch {
      // Fallback to text slug
    }
    const clean = text.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24);
    return `qr-${String(index + 1).padStart(2, '0')}-${clean || 'item'}`;
  };

  // Generate QR codes (both PNG Data URL and SVG vector markup)
  useEffect(() => {
    let isCancelled = false;

    const generateAll = async () => {
      if (itemsToEncode.length === 0) {
        setQrList([]);
        return;
      }

      setIsGenerating(true);
      const generated: QrItem[] = [];
      const validFg = /^#[0-9A-Fa-f]{6}$/.test(fgColor) ? fgColor : '#050a14';
      const validBg = /^#[0-9A-Fa-f]{6}$/.test(bgColor) ? bgColor : '#ffffff';

      for (let i = 0; i < itemsToEncode.length; i++) {
        if (isCancelled) return;
        const text = itemsToEncode[i];
        try {
          const [dataUrl, svgString] = await Promise.all([
            QRCode.toDataURL(text, {
              width: qrSize,
              margin: 2,
              errorCorrectionLevel: errorCorrection,
              color: {
                dark: validFg,
                light: validBg,
              },
            }),
            QRCode.toString(text, {
              type: 'svg',
              width: qrSize,
              margin: 2,
              errorCorrectionLevel: errorCorrection,
              color: {
                dark: validFg,
                light: validBg,
              },
            }),
          ]);

          generated.push({
            id: i,
            text,
            dataUrl,
            svgString,
            filenameBase: sanitizeFilenameBase(text, i),
          });
        } catch (err) {
          console.error(`Failed to generate QR for item ${i + 1}:`, err);
        }
      }

      if (!isCancelled) {
        setQrList(generated);
        setIsGenerating(false);
      }
    };

    generateAll();

    return () => {
      isCancelled = true;
    };
  }, [itemsToEncode, qrSize, errorCorrection, fgColor, bgColor]);

  // Individual PNG Download
  const handleDownloadPng = (item: QrItem) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = `${item.filenameBase}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Individual SVG Download
  const handleDownloadSvg = (item: QrItem) => {
    const blob = new Blob([item.svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.filenameBase}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Bulk ZIP Download (includes both PNG and SVG files)
  const handleDownloadZip = async () => {
    if (qrList.length === 0 || isZipping) return;

    try {
      setIsZipping(true);
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default;
      const zip = new JSZip();
      const folder = zip.folder('qr-codes');

      qrList.forEach((item) => {
        const base64Data = item.dataUrl.split(',')[1];
        if (base64Data && folder) {
          folder.file(`${item.filenameBase}.png`, base64Data, { base64: true });
        }
        if (item.svgString && folder) {
          folder.file(`${item.filenameBase}.svg`, item.svgString);
        }
      });

      folder?.file(
        'manifest.txt',
        `SmartToolHub Static QR Code Export\nGenerated: ${new Date().toISOString()}\nTotal Codes: ${qrList.length}\nResolution: ${qrSize}x${qrSize}px (PNG + SVG included)\nError Correction: Level ${errorCorrection}\nColors: Foreground ${fgColor} / Background ${bgColor}\n\nContents:\n${qrList
          .map((q, idx) => `${idx + 1}. ${q.filenameBase}.png & .svg -> ${q.text.replace(/\n/g, ' | ')}`)
          .join('\n')}\n`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const blobUrl = URL.createObjectURL(content);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `smarttoolhub-qr-codes-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setDownloadSuccess('ZIP archive (PNG + SVG) downloaded!');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const exampleChips = [
    'Wi-Fi Guest Network QR Code',
    'vCard Business Card Contact',
    'Batch Product & Menu Links',
  ];

  const colorPresets = [
    { label: 'Classic Ink', fg: '#050a14', bg: '#ffffff' },
    { label: 'Navy Slate', fg: '#0f2942', bg: '#f8fafc' },
    { label: 'Deep Emerald', fg: '#064e3b', bg: '#ffffff' },
    { label: 'Burgundy Warm', fg: '#4c0519', bg: '#fffbeb' },
  ];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Free QR Code Generator (No Sign-Up or Expiry)"
      subheading="Create static QR codes that never expire and work offline in your browser. Download crisp PNGs or vector SVGs with custom colors, Wi-Fi login presets, vCard contacts, or up to 50 links at once."
      inputLabel="Input URLs or Text Items (One Per Line, Max 50)"
      inputPlaceholder="https://example.com/page1&#10;https://example.com/page2&#10;WIFI:S:MyNetwork;P:MyPassword;;"
      examplePrompt="Generate static QR codes with PNG and SVG export"
      exampleChips={exampleChips}
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={() => ({
        result: `Generated ${qrList.length} static QR Code(s) locally in your browser.
Resolution: ${qrSize} × ${qrSize} px (PNG + Vector SVG ready)
Error Correction: Level ${errorCorrection}
Colors: Foreground ${fgColor}, Background ${bgColor}

Items:
${qrList.map((item, idx) => `${idx + 1}. ${item.filenameBase} (.png / .svg)`).join('\n')}`,
      })}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Main Controls Panel */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase text-[#ffb840] font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>QR Content &amp; Presets</span>
              </span>
              <span className="text-xs font-mono text-[#34e0a1]">
                100% Static · No Sign-Up · Works Offline
              </span>
            </div>

            {/* Preset Switcher Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setInputMode('batch')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all focus-ring ${
                  inputMode === 'batch'
                    ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold'
                    : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>URL / Text (1 to 50)</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('wifi')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all focus-ring ${
                  inputMode === 'wifi'
                    ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold'
                    : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>Wi-Fi Login Preset</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('vcard')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all focus-ring ${
                  inputMode === 'vcard'
                    ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold'
                    : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.16)] hover:text-[#f2f7ff]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>vCard Contact Preset</span>
              </button>
            </div>

            {/* Conditional Preset Builders */}
            {inputMode === 'wifi' && (
              <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.18)] space-y-3">
                <div className="text-xs font-semibold text-[#f2f7ff]">
                  Wi-Fi Network QR Builder (Phone cameras join automatically when scanned)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaccb] mb-1">
                      Network Name (SSID)
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="MyHomeWiFi"
                      className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaccb] mb-1">
                      Wi-Fi Password
                    </label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      disabled={wifiEncryption === 'nopass'}
                      placeholder="Password"
                      className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff] disabled:opacity-40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaccb] mb-1">
                      Security Type
                    </label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                      className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff]"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Open (No Password)</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <label className="inline-flex items-center gap-2 text-xs text-[#9aaccb] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="rounded border-[rgba(143,163,192,0.3)]"
                    />
                    <span>Hidden SSID network</span>
                  </label>
                  <button
                    type="button"
                    onClick={applyWifiPreset}
                    className="py-1.5 px-4 rounded-xl bg-[#34e0a1] text-[#050a14] font-bold text-xs hover:opacity-90 transition-opacity"
                  >
                    Generate Wi-Fi QR Code
                  </button>
                </div>
              </div>
            )}

            {inputMode === 'vcard' && (
              <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.18)] space-y-3">
                <div className="text-xs font-semibold text-[#f2f7ff]">
                  vCard Contact QR Builder (Opens &ldquo;Add to Contacts&rdquo; on iPhone &amp; Android)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaccb] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={vcardName}
                      onChange={(e) => setVcardName(e.target.value)}
                      className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaccb] mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                      className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaccb] mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                      className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#9aaccb] mb-1">Email Address</label>
                    <input
                      type="email"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                      className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-[#9aaccb] mb-1">Website URL</label>
                    <input
                      type="url"
                      value={vcardUrl}
                      onChange={(e) => setVcardUrl(e.target.value)}
                      className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff]"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={applyVcardPreset}
                    className="py-1.5 px-4 rounded-xl bg-[#34e0a1] text-[#050a14] font-bold text-xs hover:opacity-90 transition-opacity"
                  >
                    Generate Contact QR Code
                  </button>
                </div>
              </div>
            )}

            {/* Multiline Input Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#9aaccb]">
                  Encoded QR Data (1 URL or text item per line, or vCard block)
                </label>
                <span className="text-xs font-mono text-[#9aaccb]">
                  {itemsToEncode.length} / 50 active
                </span>
              </div>
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste a URL, plain text, Wi-Fi string, or up to 50 lines..."
                className="w-full bg-[#050a14] border border-[rgba(143,163,192,0.18)] rounded-2xl p-4 text-xs sm:text-sm font-mono text-[#f2f7ff] placeholder-[#9aaccb] focus-ring resize-y leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px] text-[#9aaccb]">
                <span>
                  Static encoding: your text or URL is written directly into the code with no tracking links.
                </span>
                {itemsToEncode.length >= 50 && (
                  <span className="text-[#ffb840] font-bold">50 item batch limit reached</span>
                )}
              </div>
            </div>

            {/* Custom Colors Section */}
            <div className="pt-3 border-t border-[rgba(143,163,192,0.12)] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase text-[#9aaccb] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#ffb840]" />
                  <span>Custom Colors (Keep foreground darker than background)</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFgColor(preset.fg);
                        setBgColor(preset.bg);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#050a14] border border-[rgba(143,163,192,0.18)] text-[#d1dced] hover:border-[#ffb840] transition-colors flex items-center gap-1.5"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.fg }}
                      />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-[#050a14] border border-[rgba(143,163,192,0.16)] rounded-xl p-2.5">
                  <input
                    type="color"
                    aria-label="Foreground QR Color"
                    value={/^#[0-9A-Fa-f]{6}$/.test(fgColor) ? fgColor : '#050a14'}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                  <div className="flex-1">
                    <div className="text-[11px] font-mono text-[#9aaccb]">Foreground (Dots)</div>
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-[#f2f7ff] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#050a14] border border-[rgba(143,163,192,0.16)] rounded-xl p-2.5">
                  <input
                    type="color"
                    aria-label="Background QR Color"
                    value={/^#[0-9A-Fa-f]{6}$/.test(bgColor) ? bgColor : '#ffffff'}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                  <div className="flex-1">
                    <div className="text-[11px] font-mono text-[#9aaccb]">Background (Quiet Zone)</div>
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-transparent text-xs font-mono text-[#f2f7ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quality and Size Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[rgba(143,163,192,0.12)]">
              {/* Size Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#9aaccb]">
                  Image Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '256 px', size: 256 },
                    { label: '512 px', size: 512 },
                    { label: '1024 px', size: 1024 },
                  ].map((s) => (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setQrSize(s.size)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all focus-ring ${
                        qrSize === s.size
                          ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold shadow-sm'
                          : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Correction Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[#9aaccb]">
                  Error Correction Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { level: 'L', label: 'L ~7%' },
                    { level: 'M', label: 'M ~15%' },
                    { level: 'Q', label: 'Q ~25%' },
                    { level: 'H', label: 'H ~30%' },
                  ].map((ec) => (
                    <button
                      key={ec.level}
                      type="button"
                      onClick={() => setErrorCorrection(ec.level as 'L' | 'M' | 'Q' | 'H')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all focus-ring ${
                        errorCorrection === ec.level
                          ? 'bg-[#ffb840] text-[#050a14] border-[#ffb840] font-bold shadow-sm'
                          : 'bg-[#050a14] text-[#9aaccb] border-[rgba(143,163,192,0.14)] hover:text-[#f2f7ff]'
                      }`}
                      title={`Recovery capacity: ${ec.label}`}
                    >
                      {ec.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar: Download ZIP & Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[#f2f7ff] font-bold">
                {qrList.length} QR Code{qrList.length === 1 ? '' : 's'} Ready
              </span>
              <span className="text-[#9aaccb]/60">·</span>
              <span className="text-[#9aaccb] font-mono">
                {qrSize}&times;{qrSize}px PNG &amp; Vector SVG
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={qrList.length === 0 || isZipping || isGenerating}
                onClick={handleDownloadZip}
                className="btn-primary text-xs w-full sm:w-auto px-5 disabled:opacity-50"
              >
                {isZipping ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating ZIP...</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Download All as ZIP (PNG + SVG)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3.5 rounded-xl bg-[rgba(52,224,161,0.12)] border border-[#34e0a1] flex items-center gap-2 text-xs text-[#34e0a1]">
              <Check className="w-4 h-4 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Grid of Generated QR Code Previews */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9aaccb] font-bold">
              Preview &amp; Individual Downloads ({qrList.length})
            </h4>

            {isGenerating ? (
              <div className="p-12 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-[#ffb840] mx-auto" />
                <div className="text-sm text-[#f2f7ff] font-semibold">
                  Generating static QR codes in browser...
                </div>
              </div>
            ) : qrList.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-center text-xs text-[#9aaccb]">
                Enter a URL, text, or pick a Wi-Fi / vCard preset above to generate QR codes.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {qrList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] hover:border-[rgba(255,184,64,0.4)] flex flex-col justify-between space-y-3 transition-all group"
                  >
                    <div
                      className="aspect-square w-full rounded-2xl p-3 flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(bgColor) ? bgColor : '#ffffff' }}
                    >
                      <img
                        src={item.dataUrl}
                        alt={`Generated QR Code ${item.id + 1}`}
                        width={qrSize || 256}
                        height={qrSize || 256}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#9aaccb]">
                        <span>#{item.id + 1}</span>
                        <span>Level {errorCorrection}</span>
                      </div>
                      <p className="text-xs font-mono text-[#f2f7ff] truncate" title={item.text}>
                        {item.text.replace(/\n/g, ' ')}
                      </p>
                    </div>

                    {/* PNG + SVG Download Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadPng(item)}
                        className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.16)] hover:border-[#ffb840] text-xs font-semibold text-[#f2f7ff] hover:text-[#ffb840] transition-colors focus-ring"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PNG</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSvg(item)}
                        className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.16)] hover:border-[#34e0a1] text-xs font-semibold text-[#f2f7ff] hover:text-[#34e0a1] transition-colors focus-ring"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>SVG</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Plain-Language Guide Sections Required by Search Console */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* 1. Static vs Dynamic QR Codes */}
            <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f2f7ff]">
                <Info className="w-4 h-4 text-[#ffb840] shrink-0" />
                <h3>Static vs. Dynamic QR Codes</h3>
              </div>
              <p className="text-xs text-[#9aaccb] leading-relaxed">
                <strong className="text-[#f2f7ff]">Static QR codes</strong> (what this tool creates) store your real link, Wi-Fi login, or contact card directly inside the black-and-white squares. Because there is no middleman server, static codes <strong className="text-[#f2f7ff]">never expire</strong> and keep working forever as long as your webpage exists.
              </p>
              <p className="text-xs text-[#9aaccb] leading-relaxed">
                <strong className="text-[#f2f7ff]">Dynamic QR codes</strong> point to a short redirect link owned by a third-party service. That lets you change the destination URL later or count scans, but if you stop paying that company’s monthly fee, the redirect stops working and your printed QR codes break.
              </p>
            </div>

            {/* 2. Error Correction Levels */}
            <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f2f7ff]">
                <Layers className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <h3>Error Correction Levels (L, M, Q, H)</h3>
              </div>
              <p className="text-xs text-[#9aaccb] leading-relaxed">
                Error correction adds backup data to the pattern so a phone camera can still read the code if part of it gets scratched, dirty, or smudged:
              </p>
              <ul className="text-xs text-[#9aaccb] space-y-1 list-disc pl-4 leading-relaxed">
                <li><strong className="text-[#f2f7ff]">Level L (~7% backup):</strong> Smallest, least dense grid. Good for long URLs on clean digital screens.</li>
                <li><strong className="text-[#f2f7ff]">Level M (~15% backup):</strong> Best everyday choice for business cards, flyers, and general use.</li>
                <li><strong className="text-[#f2f7ff]">Level Q (~25% backup):</strong> Great for restaurant menus, product labels, and outdoor stickers.</li>
                <li><strong className="text-[#f2f7ff]">Level H (~30% backup):</strong> Maximum durability for industrial tags or surfaces that get scuffed.</li>
              </ul>
            </div>

            {/* 3. Best Size for Printing */}
            <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f2f7ff]">
                <Printer className="w-4 h-4 text-[#7db8ff] shrink-0" />
                <h3>Best Size for Printing QR Codes</h3>
              </div>
              <p className="text-xs text-[#9aaccb] leading-relaxed">
                For close-up items like business cards, product boxes, and table tents, print your QR code at least <strong className="text-[#f2f7ff]">2 cm × 2 cm (0.8 in × 0.8 in)</strong>. Anything smaller can be hard for older phone cameras to focus on.
              </p>
              <p className="text-xs text-[#9aaccb] leading-relaxed">
                For posters and signs scanned from further away, follow the <strong className="text-[#f2f7ff]">10:1 distance rule</strong>: divide the scanning distance by 10. If people stand 2 meters (80 inches) away, make the printed code at least 20 cm (8 inches) wide. Use the <strong className="text-[#f2f7ff]">SVG download</strong> or <strong className="text-[#f2f7ff]">1024 px PNG</strong> so edges stay crisp in print.
              </p>
            </div>

            {/* 4. How to Check That a QR Code Is Safe */}
            <div className="p-5 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f2f7ff]">
                <ShieldCheck className="w-4 h-4 text-[#ffb840] shrink-0" />
                <h3>How to Check That a QR Code Is Safe</h3>
              </div>
              <ul className="text-xs text-[#9aaccb] space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong className="text-[#f2f7ff]">Read the preview URL before tapping:</strong> Modern iPhone and Android cameras show the domain name on screen before opening the browser. Check for misspelled domains or strange URL shorteners.</li>
                <li><strong className="text-[#f2f7ff]">Check physical stickers in public:</strong> On parking meters or cafe tables, run your finger over the code to make sure someone has not pasted a fake sticker over the original sign.</li>
                <li><strong className="text-[#f2f7ff]">Never enter login passwords after an unexpected scan:</strong> If a public QR code asks for your email password or banking login, close the tab immediately.</li>
              </ul>
            </div>
          </div>
        </div>
      }
      whatItDoesContent={
        <>
          <p>
            This free QR code generator creates static QR codes directly in your browser with no sign-up, no account, and no expiration date. Once this page loads, it works completely offline—your links, Wi-Fi passwords, and contact details stay on your device and are never uploaded to a server.
          </p>
          <p>
            You can generate a single code (including automatic Wi-Fi login and vCard contact cards) or paste up to 50 lines to create a batch all at once. Every QR code can be customized with foreground and background colors and downloaded as a high-resolution PNG or scalable SVG vector file.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Enter a link, text, or pick a Wi-Fi / vCard preset',
          text: 'Paste one or more URLs into the text box, or switch to the Wi-Fi or vCard tab to fill in network or contact details.',
        },
        {
          step: 'Pick your colors, size, and error correction',
          text: 'Keep high contrast (dark dots on a light background), choose 512px or 1024px for print, and select Level M or Q error correction.',
        },
        {
          step: 'Download as PNG, SVG, or a single ZIP file',
          text: 'Click PNG or SVG under any code, or download all generated codes together in a ZIP archive.',
        },
      ]}
      workedExample={{
        title: 'Example: Cafe Wi-Fi & Menu QR Codes',
        scenario: 'A small shop wants one QR code for guest Wi-Fi and three QR codes for online menus, with no monthly subscription.',
        output: `Input:
WIFI:T:WPA;S:CafeGuest;P:Coffee2026;H:false;;
https://example.com/menu/breakfast
https://example.com/menu/lunch
https://example.com/menu/drinks

Output:
- 4 static QR codes generated offline in browser
- Available as 1024×1024 PNG and scalable vector SVG
- No redirect links, no scan limits, and no expiry`,
      }}
      tips={[
        'Keep dark-on-light contrast: Phone cameras expect darker squares on a lighter background. Avoid inverting colors (white dots on a dark background) because many barcode scanners fail to read inverted codes.',
        'Use SVG for professional printing: Designers using Canva, Illustrator, Figma, or InDesign can drop the SVG file into any layout and scale it to billboard size without blur.',
        'Always do a quick test scan: Before printing 500 flyers, scan the QR code on your screen or a single test sheet using both an iPhone and an Android phone.',
        'Leave the quiet zone intact: Keep the light border around the outside of the QR code so cameras can tell where the code begins and ends.',
      ]}
      faq={[
        {
          question: 'Do these QR codes ever expire or have scan limits?',
          answer:
            'No. This tool creates static QR codes that encode your text or URL directly into the image pattern. There are no redirect servers, no scan limits, and the codes never expire.',
        },
        {
          question: 'Does this QR code generator work offline in the browser?',
          answer:
            'Yes. All QR code generation happens locally inside your web browser using JavaScript. Once the page is open, you can disconnect from the internet and generate PNG, SVG, Wi-Fi, or vCard codes privately.',
        },
        {
          question: 'Should I download PNG or SVG for printing?',
          answer:
            'Choose SVG if you are placing the QR code into design software or printing large signs, because vector SVG files scale to any size without losing sharpness. Choose 1024 px PNG if you are dropping the image into Word, Google Docs, or email.',
        },
        {
          question: 'How do I make sure a custom-colored QR code still scans reliably?',
          answer:
            'Always keep the foreground dots noticeably darker than the background color, leave the outer margin (quiet zone) clear, and choose Error Correction Level M or Q for printed materials.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
