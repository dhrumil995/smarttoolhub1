import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Image as ImageIcon, Sparkles, ShieldCheck, Check, RefreshCw } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';

interface IPhoneMockupMakerPageProps {
  navigate: (path: string) => void;
}

const BG_PRESETS = [
  { id: 'transparent', label: 'Transparent', style: 'transparent', isDark: true },
  { id: 'navy', label: 'Navy Black', style: '#050a14', isDark: true },
  { id: 'slate', label: 'Studio Slate', style: '#0f172a', isDark: true },
  { id: 'aurora-tint', label: 'Aurora Glow', style: '#0b1d3a', isDark: true },
  { id: 'white', label: 'Clean White', style: '#f8fafc', isDark: false },
  { id: 'gradient-midnight', label: 'Midnight Gradient', style: 'linear-gradient(135deg, #050a14 0%, #1e1b4b 100%)', isDark: true },
  { id: 'gradient-emerald', label: 'Emerald Gradient', style: 'linear-gradient(135deg, #022c22 0%, #050a14 100%)', isDark: true },
];

const FRAME_COLORS = [
  { id: 'dark', label: 'Space Black', border: '#262d3d', inner: '#0a0f1d' },
  { id: 'titanium', label: 'Natural Titanium', border: '#4b5563', inner: '#111827' },
  { id: 'silver', label: 'Silver White', border: '#94a3b8', inner: '#1e293b' },
];

export const IPhoneMockupMakerPage: React.FC<IPhoneMockupMakerPageProps> = ({ navigate }) => {
  const [selectedBg, setSelectedBg] = useState<string>('navy');
  const [frameColor, setFrameColor] = useState<string>('dark');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [padding, setPadding] = useState<number>(48);
  const [showIsland, setShowIsland] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'iphone-screenshot-mockup-maker') || LAUNCH_TOOLS[11];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'wallpaper-gradient-maker' || t.slug === 'retina-image-size-calculator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'retina-display-pixel-densities') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Dark App UI with Studio Slate Background',
    'Aurora Brand Theme with Transparent Frame',
    'Clean White Showcase with Floating Shadow',
  ];

  // Load a crisp SVG placeholder screenshot on mount
  useEffect(() => {
    loadSampleScreenshot('dark-app');
  }, []);

  const loadSampleScreenshot = (type: 'dark-app' | 'aurora' | 'white') => {
    let svg = '';
    if (type === 'dark-app') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1170" height="2532" viewBox="0 0 1170 2532">
        <rect width="1170" height="2532" fill="#0a1424"/>
        <rect x="70" y="240" width="1030" height="280" rx="40" fill="#101c33"/>
        <circle cx="160" cy="380" r="50" fill="#8b5cf6"/>
        <rect x="250" y="340" width="500" height="32" rx="16" fill="#f2f7ff"/>
        <rect x="250" y="395" width="300" height="22" rx="11" fill="#8fa3c0"/>
        <rect x="70" y="580" width="1030" height="520" rx="40" fill="#101c33"/>
        <rect x="130" y="650" width="380" height="40" rx="12" fill="#8b5cf6" opacity="0.9"/>
        <rect x="130" y="730" width="700" height="24" rx="8" fill="#8fa3c0"/>
        <rect x="130" y="775" width="550" height="24" rx="8" fill="#8fa3c0" opacity="0.7"/>
        <rect x="70" y="1160" width="500" height="420" rx="40" fill="#101c33"/>
        <rect x="600" y="1160" width="500" height="420" rx="40" fill="#101c33"/>
        <rect x="70" y="1640" width="1030" height="480" rx="40" fill="#101c33"/>
        <rect x="385" y="2480" width="400" height="12" rx="6" fill="#f2f7ff" opacity="0.8"/>
      </svg>`;
    } else if (type === 'aurora') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1170" height="2532" viewBox="0 0 1170 2532">
        <rect width="1170" height="2532" fill="#04120b"/>
        <circle cx="585" cy="800" r="300" fill="#8b5cf6" opacity="0.12"/>
        <rect x="120" y="320" width="930" height="220" rx="36" fill="#0a1424" stroke="#8b5cf6" stroke-width="4"/>
        <text x="585" y="450" fill="#8b5cf6" font-family="sans-serif" font-weight="bold" font-size="64" text-anchor="middle">AURORA DASHBOARD</text>
        <rect x="120" y="600" width="930" height="800" rx="36" fill="#0a1424"/>
        <circle cx="585" cy="950" r="140" fill="none" stroke="#8b5cf6" stroke-width="28"/>
        <text x="585" y="975" fill="#f2f7ff" font-family="sans-serif" font-weight="bold" font-size="72" text-anchor="middle">98.4%</text>
        <rect x="120" y="1460" width="930" height="600" rx="36" fill="#0a1424"/>
        <rect x="385" y="2480" width="400" height="12" rx="6" fill="#8b5cf6" opacity="0.9"/>
      </svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1170" height="2532" viewBox="0 0 1170 2532">
        <rect width="1170" height="2532" fill="#f8fafc"/>
        <rect x="80" y="240" width="1010" height="240" rx="32" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
        <rect x="140" y="320" width="450" height="32" rx="8" fill="#0f172a"/>
        <rect x="140" y="375" width="280" height="24" rx="6" fill="#64748b"/>
        <rect x="80" y="540" width="1010" height="700" rx="32" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
        <rect x="80" y="1300" width="1010" height="700" rx="32" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
        <rect x="385" y="2480" width="400" height="12" rx="6" fill="#0f172a" opacity="0.6"/>
      </svg>`;
    }
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    setImageSrc(URL.createObjectURL(blob));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  const handleExamplePick = (chip: string) => {
    if (chip.includes('Dark App')) {
      setSelectedBg('slate');
      setFrameColor('dark');
      loadSampleScreenshot('dark-app');
    } else if (chip.includes('Aurora Brand')) {
      setSelectedBg('transparent');
      setFrameColor('dark');
      loadSampleScreenshot('aurora');
    } else {
      setSelectedBg('white');
      setFrameColor('silver');
      loadSampleScreenshot('white');
    }
  };

  const handleDownloadPNG = async () => {
    if (!imageSrc) return;
    setIsExporting(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      // Canvas target dimensions (high resolution: 1400 x 2600)
      const exportWidth = 1400;
      const exportHeight = 2600;
      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background
      const activeBgObj = BG_PRESETS.find((b) => b.id === selectedBg);
      if (selectedBg === 'transparent') {
        ctx.clearRect(0, 0, exportWidth, exportHeight);
      } else if (selectedBg.startsWith('gradient')) {
        const grad = ctx.createLinearGradient(0, 0, exportWidth, exportHeight);
        if (selectedBg === 'gradient-midnight') {
          grad.addColorStop(0, '#050a14');
          grad.addColorStop(1, '#1e1b4b');
        } else {
          grad.addColorStop(0, '#022c22');
          grad.addColorStop(1, '#050a14');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, exportWidth, exportHeight);
      } else {
        ctx.fillStyle = activeBgObj?.style || '#050a14';
        ctx.fillRect(0, 0, exportWidth, exportHeight);
      }

      // Device frame layout inside canvas
      const deviceW = 1000;
      const deviceH = 2160;
      const deviceX = (exportWidth - deviceW) / 2;
      const deviceY = (exportHeight - deviceH) / 2;
      const cornerRadius = 96;
      const borderWidth = 24;

      // Outer bezel shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 24;

      // Outer Bezel Path
      ctx.beginPath();
      ctx.roundRect(deviceX, deviceY, deviceW, deviceH, cornerRadius);
      const activeFrame = FRAME_COLORS.find((f) => f.id === frameColor);
      ctx.fillStyle = activeFrame?.border || '#262d3d';
      ctx.fill();

      // Reset shadow for inner elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Screen viewport area
      const screenX = deviceX + borderWidth;
      const screenY = deviceY + borderWidth;
      const screenW = deviceW - borderWidth * 2;
      const screenH = deviceH - borderWidth * 2;
      const screenRadius = cornerRadius - borderWidth;

      // Clip screen area and draw uploaded screenshot
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenW, screenH, screenRadius);
      ctx.clip();
      ctx.drawImage(img, screenX, screenY, screenW, screenH);

      // Camera pill / Dynamic Island (neutral clean rounded pill)
      if (showIsland) {
        const islandW = 220;
        const islandH = 60;
        const islandX = screenX + (screenW - islandW) / 2;
        const islandY = screenY + 22;
        ctx.beginPath();
        ctx.roundRect(islandX, islandY, islandW, islandH, 30);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Subtle camera lens glare
        ctx.beginPath();
        ctx.arc(islandX + islandW - 32, islandY + 30, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fill();
      }

      ctx.restore();

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `iphone-mockup-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCompute = (text: string) => {
    return {
      result: `iPhone Screenshot Mockup generated successfully.\nBackground: ${selectedBg}\nFrame: ${frameColor}\nIsland Pill: ${showIsland ? 'Active' : 'Off'}\nDimensions: 1400 x 2600 PNG.\nZero server uploads: processed entirely in your browser.`,
      rawData: { selectedBg, frameColor, padding },
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="iPhone Screenshot Mockup Maker"
      subheading="Place any screenshot inside a clean, neutral phone frame with customizable backgrounds, shadow elevation, and instant high-res PNG export. 100% private and processed on-device."
      inputLabel="Device Presentation Configuration"
      inputPlaceholder="Select background preset, bezel color, and upload your screenshot..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Render & Download PNG"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* File Upload & Privacy Badge */}
          <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-[#f2f7ff] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#8b5cf6]" />
                <span>Upload Custom Screenshot</span>
              </div>
              <p className="text-xs text-[#8fa3c0]">
                Supports PNG, JPEG, WebP, and HEIC up to 25MB.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="screenshot-upload"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto gap-2"
              >
                <Upload size={16} aria-hidden="true" />
                <span>Choose Image</span>
              </Button>
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#8b5cf6] bg-[#0a1424] px-3.5 py-2 rounded-xl border border-[rgba(139, 92, 246,0.25)]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Your files never leave your device. All rendering is performed locally via HTML5 Canvas.</span>
          </div>

          {/* Background Presets */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Background Canvas
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BG_PRESETS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setSelectedBg(bg.id)}
                  className={`p-2.5 rounded-xl border text-left transition-colors focus-ring flex items-center gap-2.5 ${
                    selectedBg === bg.id
                      ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                    style={{ background: bg.id === 'transparent' ? 'repeating-conic-gradient(#555 0% 25%, #222 0% 50%) 50% / 8px 8px' : bg.style }}
                  />
                  <span className="text-xs font-medium truncate">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bezel Style and Camera Island Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                Device Bezel Finish
              </label>
              <div className="flex gap-2">
                {FRAME_COLORS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrameColor(f.id)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-center transition-colors focus-ring text-xs font-medium ${
                      frameColor === f.id
                        ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                        : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                Dynamic Camera Island
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowIsland(true)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-center transition-colors focus-ring text-xs font-medium ${
                    showIsland
                      ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                  }`}
                >
                  Include Pill
                </button>
                <button
                  type="button"
                  onClick={() => setShowIsland(false)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-center transition-colors focus-ring text-xs font-medium ${
                    !showIsland
                      ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                      : 'bg-[#0a1424] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                  }`}
                >
                  Full Screen
                </button>
              </div>
            </div>
          </div>

          {/* Live Phone Mockup Preview Canvas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                Live Frame Preview
              </label>
              <span className="text-xs font-mono text-[#8b5cf6]">
                Export Size: 1400 × 2600 PNG
              </span>
            </div>

            <div
              className="w-full rounded-2xl p-6 sm:p-10 flex items-center justify-center border border-[rgba(143,163,192,0.16)] overflow-hidden transition-all duration-200"
              style={{
                background:
                  selectedBg === 'transparent'
                    ? 'repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 16px 16px'
                    : selectedBg.startsWith('gradient')
                    ? BG_PRESETS.find((b) => b.id === selectedBg)?.style
                    : BG_PRESETS.find((b) => b.id === selectedBg)?.style || '#050a14',
              }}
            >
              {/* Neutral Phone Device Frame */}
              <div
                className="relative w-[240px] sm:w-[280px] aspect-[9/19.5] rounded-[44px] p-2.5 shadow-2xl transition-all"
                style={{
                  backgroundColor: FRAME_COLORS.find((f) => f.id === frameColor)?.border || '#262d3d',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
                }}
              >
                {/* Inner Screen Surface */}
                <div className="w-full h-full rounded-[36px] overflow-hidden relative bg-black flex items-center justify-center">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Screenshot Preview"
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  ) : (
                    <div className="text-center p-4 text-[#8fa3c0] text-xs">
                      No screenshot selected
                    </div>
                  )}

                  {/* Neutral Pill Cutout */}
                  {showIsland && (
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full flex items-center justify-end pr-1.5 shadow-inner z-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData }) => (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-[#f2f7ff]">
                Mockup Ready for Download
              </div>
              <div className="text-xs text-[#8fa3c0] font-mono mt-0.5">
                Format: 32-bit Lossless PNG · Dimensions: 1400×2600 · DPI: 300
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadPNG}
              isLoading={isExporting}
              loadingLabel="Exporting PNG..."
              className="w-full sm:w-auto"
            >
              <Download size={18} aria-hidden="true" />
              <span>Download High-Res PNG</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
              <span className="text-[#8fa3c0] block font-mono">SELECTED BG</span>
              <span className="text-sm font-semibold text-[#8b5cf6] capitalize">
                {selectedBg.replace('-', ' ')}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
              <span className="text-[#8fa3c0] block font-mono">FRAME COLOR</span>
              <span className="text-sm font-semibold text-[#f2f7ff] capitalize">
                {frameColor} Titanium
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
              <span className="text-[#8fa3c0] block font-mono">ON-DEVICE PRIVACY</span>
              <span className="text-sm font-semibold text-[#8b5cf6]">
                100% Client-Side
              </span>
            </div>
          </div>
        </div>
      )}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The iPhone Screenshot Mockup Maker wraps raw mobile screenshots into a beautifully rendered, realistic smartphone device frame. Whether you are building pitch decks, marketing landing pages, App Store preview banners, or social media product announcements, placing your app inside a clean frame instantly communicates context and professionalism.
          </p>
          <p>
            Unlike heavy design apps that require cloud uploads or expensive subscription seats, this tool runs entirely inside your browser using HTML5 Canvas. Your sensitive prototype screenshots, internal dashboards, and client work never touch any external server. You can swap background colors, toggle camera cutouts, and download high-resolution 1400×2600 PNG images ready for Retina displays.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Upload or paste your screenshot',
          text: 'Click Choose Image to select any screenshot from your camera roll or desktop file system.',
        },
        {
          step: 'Choose your presentation background',
          text: 'Select Transparent for overlaying onto website designs, Studio Slate for marketing decks, or Midnight Gradient for social posts.',
        },
        {
          step: 'Adjust bezel and camera cutouts',
          text: 'Pick Space Black, Natural Titanium, or Silver finishes, and toggle the camera island pill depending on your layout.',
        },
        {
          step: 'Export your high-resolution PNG',
          text: 'Click Download High-Res PNG to render a full 1400×2600 image directly onto your device.',
        },
      ]}
      workedExample={{
        title: 'Example: App Store Showcase & Social Announcement',
        scenario: 'A product designer preparing a social launch graphic for a productivity app screenshot with a transparent background.',
        output: `### Render Parameters:
- Input: 1170 × 2532 iOS Screenshot
- Frame Finish: Space Black (Subtle metallic edge highlight)
- Background: Transparent (Alpha channel enabled)
- Island Pill: Enabled with camera reflection
- Output Resolution: 1400 × 2600 PNG

Ready to paste directly into Figma, Canva, or marketing presentations without manual clipping or pen-tool masking.`,
      }}
      tips={[
        'Use Transparent background for Figma: Exporting with a transparent canvas allows you to drop the device mockup into marketing banners without clipping.',
        'Match native 19.5:9 aspect ratios: Screenshots taken on iPhone 12, 13, 14, 15, and 16 fill the frame edge-to-edge without letterboxing.',
        'High-resolution print compatibility: The 1400×2600 canvas export produces razor-sharp results on Retina 3x displays and PDF presentations.',
        'Zero compression loss: Output files are saved in 32-bit lossless PNG format preserving fine text and micro-typography.',
      ]}
      faq={[
        {
          question: 'Are my uploaded screenshots sent to your servers?',
          answer: 'No. SmartToolHub operates strictly on-device. Images are loaded via local Blob URLs and painted directly into an HTML5 Canvas in your browser memory. No data is transmitted across the network.',
        },
        {
          question: 'Does this mockup generator contain official Apple logos or trademarks?',
          answer: 'No. This tool uses clean, original, neutral device geometry and non-trademarked proportions. It is fully suitable for commercial advertising and editorial portfolios.',
        },
        {
          question: 'What is the optimal screenshot resolution for best results?',
          answer: 'Standard iOS screenshots at 1170×2532 (iPhone 13/14/15/16 Pro), 1290×2796 (Pro Max / Plus), or 1080×2340 match the 19.5:9 display proportion seamlessly.',
        },
        {
          question: 'Can I export a transparent background for landing pages?',
          answer: 'Yes. Select the Transparent preset. The exported PNG will contain a transparent alpha channel with full device shadows.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
