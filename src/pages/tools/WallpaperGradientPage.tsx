import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Copy, Check, Download, Sparkles, Sliders, Smartphone, Eye } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface WallpaperGradientPageProps {
  navigate: (path: string) => void;
}

interface GradientPreset {
  name: string;
  c1: string;
  c2: string;
  c3: string;
  angle: number;
}

const PRESETS: GradientPreset[] = [
  { name: 'Midnight Aurora', c1: '#050a14', c2: '#0a1e28', c3: '#8b5cf6', angle: 135 },
  { name: 'Neon Sunset', c1: '#1a0826', c2: '#791a88', c3: '#ff7b54', angle: 160 },
  { name: 'Deep Space Blue', c1: '#020617', c2: '#0f172a', c3: '#38bdf8', angle: 180 },
  { name: 'Cyber Emerald', c1: '#031a0e', c2: '#0a4224', c3: '#00f59b', angle: 145 },
  { name: 'Titanium Graphite', c1: '#090a0f', c2: '#181b24', c3: '#4b5563', angle: 210 },
  { name: 'Apple Aurora', c1: '#0b132b', c2: '#1c2541', c3: '#5bc0be', angle: 120 },
];

export const WallpaperGradientPage: React.FC<WallpaperGradientPageProps> = ({ navigate }) => {
  const [color1, setColor1] = useState<string>('#050a14');
  const [color2, setColor2] = useState<string>('#0a1e28');
  const [color3, setColor3] = useState<string>('#8b5cf6');
  const [angle, setAngle] = useState<number>(135);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [showClockMock, setShowClockMock] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'wallpaper-gradient-maker') || LAUNCH_TOOLS[14];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'iphone-screenshot-mockup-maker' || t.slug === 'retina-image-size-calculator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'retina-display-pixel-densities') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Midnight Aurora: #050a14 to #0a1e28 to #8b5cf6',
    'Neon Sunset: #1a0826 to #791a88 to #ff7b54',
    'Deep Space Blue: #020617 to #0f172a to #38bdf8',
  ];

  // CSS gradient string
  const cssGradient =
    gradientType === 'linear'
      ? `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
      : `radial-gradient(circle at 50% 30%, ${color3} 0%, ${color2} 55%, ${color1} 100%)`;

  const handleCopyCss = async () => {
    try {
      await navigator.clipboard.writeText(`background: ${cssGradient};`);
      showToast('Gradient CSS copied to clipboard!');
    } catch {
      showToast('Could not copy CSS');
    }
  };

  const handlePresetPick = (preset: GradientPreset) => {
    setColor1(preset.c1);
    setColor2(preset.c2);
    setColor3(preset.c3);
    setAngle(preset.angle);
    setGradientType('linear');
  };

  const handleChipClick = (chip: string) => {
    if (chip.includes('Midnight Aurora')) {
      handlePresetPick(PRESETS[0]);
    } else if (chip.includes('Neon Sunset')) {
      handlePresetPick(PRESETS[1]);
    } else {
      handlePresetPick(PRESETS[2]);
    }
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      // Exact iPhone Super Retina XDR resolution (1170 x 2532)
      const width = 1170;
      const height = 2532;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (gradientType === 'linear') {
        // Calculate linear coordinates based on angle
        const rad = ((angle - 90) * Math.PI) / 180;
        const cx = width / 2;
        const cy = height / 2;
        const length = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));
        const x1 = cx - (Math.cos(rad) * length) / 2;
        const y1 = cy - (Math.sin(rad) * length) / 2;
        const x2 = cx + (Math.cos(rad) * length) / 2;
        const y2 = cy + (Math.sin(rad) * length) / 2;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, color1);
        grad.addColorStop(0.5, color2);
        grad.addColorStop(1, color3);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        const grad = ctx.createRadialGradient(width / 2, height * 0.35, 50, width / 2, height * 0.45, height * 0.7);
        grad.addColorStop(0, color3);
        grad.addColorStop(0.55, color2);
        grad.addColorStop(1, color1);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Download triggered
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `smarttoolhub-wallpaper-${width}x${height}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Full-resolution 1170×2532 wallpaper downloaded!');
    } catch (e) {
      console.error(e);
      showToast('Could not download wallpaper');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCompute = (text: string) => {
    return {
      result: `iPhone Wallpaper Gradient Specs:
CSS: background: ${cssGradient};
Resolution: 1170 × 2532 pixels (3:6.5 aspect ratio, 460 ppi)
Colors:
- Stop 1: ${color1}
- Stop 2: ${color2}
- Stop 3: ${color3}
Angle: ${angle}° (${gradientType})

Click 'Download 1170x2532 PNG' for the full uncompressed wallpaper file.`,
      rawData: { color1, color2, color3, angle, cssGradient },
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Wallpaper Gradient Maker"
      subheading="Design custom 3-stop mesh and linear gradients with a live phone lock screen preview, one-click CSS copy, and instant uncompressed 1170×2532 PNG download. Tailored for OLED true-black efficiency."
      inputLabel="Gradient Color Stops & Style"
      inputPlaceholder="Select color stops, adjust rotation angle, and test lock screen contrast..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Render Wallpaper"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Curated OLED Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetPick(p)}
                  className="p-2.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] hover:border-[#8b5cf6] text-left transition-colors focus-ring flex items-center gap-2.5"
                >
                  <div
                    className="w-5 h-5 rounded-lg border border-white/20 shrink-0"
                    style={{ background: `linear-gradient(${p.angle}deg, ${p.c1}, ${p.c2}, ${p.c3})` }}
                  />
                  <span className="text-xs font-medium text-[#f2f7ff] truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers (3 Stops) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#8fa3c0] block">
                Color 1 (Base / OLED Black)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1 text-xs font-mono text-[#f2f7ff] focus-ring"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#8fa3c0] block">
                Color 2 (Midtone Transition)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1 text-xs font-mono text-[#f2f7ff] focus-ring"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#8fa3c0] block">
                Color 3 (Vibrant Accent)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color3}
                  onChange={(e) => setColor3(e.target.value)}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={color3}
                  onChange={(e) => setColor3(e.target.value)}
                  className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-lg px-2.5 py-1 text-xs font-mono text-[#f2f7ff] focus-ring"
                />
              </div>
            </div>
          </div>

          {/* Controls Row: Angle Slider + Gradient Type + Clock Mock Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Angle Slider */}
            <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[#8fa3c0] uppercase">Rotation Angle</span>
                <span className="font-mono font-bold text-[#8b5cf6]">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-[#8b5cf6]"
                disabled={gradientType === 'radial'}
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8fa3c0]">
                <span>0° (Bottom to Top)</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
              </div>
            </div>

            {/* Type & Preview Overlay Toggle */}
            <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
              <div className="text-xs font-mono uppercase text-[#8fa3c0]">Gradient Geometry & Mock</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGradientType('linear')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors focus-ring ${
                    gradientType === 'linear'
                      ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                      : 'bg-[#050a14] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                  }`}
                >
                  Linear
                </button>
                <button
                  type="button"
                  onClick={() => setGradientType('radial')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors focus-ring ${
                    gradientType === 'radial'
                      ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                      : 'bg-[#050a14] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                  }`}
                >
                  Radial Glow
                </button>
                <button
                  type="button"
                  onClick={() => setShowClockMock(!showClockMock)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors focus-ring flex items-center gap-1.5 ${
                    showClockMock
                      ? 'bg-[#101c33] border-[#8b5cf6] text-[#8b5cf6]'
                      : 'bg-[#050a14] border-[rgba(143,163,192,0.16)] text-[#8fa3c0]'
                  }`}
                  title="Toggle Mock Clock on Preview"
                >
                  <Eye size={14} />
                  <span>Clock</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Phone-Shaped Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                Live iPhone Lock Screen Preview
              </label>
              <span className="text-xs font-mono text-[#8b5cf6]">
                19.5:9 Aspect Ratio · 1170×2532 Target
              </span>
            </div>

            <div className="p-6 sm:p-10 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.16)] flex justify-center items-center">
              {/* Phone Mockup Frame */}
              <div className="relative w-[220px] sm:w-[250px] aspect-[9/19.5] rounded-[44px] p-2 bg-[#181b24] shadow-2xl border border-[rgba(143,163,192,0.2)]">
                {/* Wallpaper Canvas Container */}
                <div
                  className="w-full h-full rounded-[36px] overflow-hidden relative flex flex-col justify-between p-4 transition-all duration-300"
                  style={{ background: cssGradient }}
                >
                  {/* Camera Island cutout */}
                  <div className="w-14 h-3.5 bg-black rounded-full mx-auto shadow-inner" />

                  {/* Optional Mock Clock / Widgets */}
                  {showClockMock && (
                    <div className="text-center pt-2 select-none text-white drop-shadow-md">
                      <div className="text-[11px] font-medium tracking-wide opacity-90">
                        Friday, October 17
                      </div>
                      <div className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none mt-0.5">
                        09:41
                      </div>
                    </div>
                  )}

                  {/* Home Bar indicator */}
                  <div className="w-24 h-1 bg-white/70 rounded-full mx-auto mb-1 drop-shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result }) => (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-[#f2f7ff]">
                Wallpaper Render Complete
              </div>
              <div className="text-xs text-[#8fa3c0] font-mono mt-0.5">
                Resolution: 1170 × 2532 Lossless PNG · CSS Gradient Ready
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCopyCss}
                className="w-full sm:w-auto gap-2"
              >
                <Copy size={16} />
                <span>Copy CSS</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleDownloadPNG}
                isLoading={isDownloading}
                loadingLabel="Exporting 1170x2532..."
                className="w-full sm:w-auto gap-2"
              >
                <Download size={16} />
                <span>Download PNG</span>
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
            <span className="text-[11px] font-mono text-[#8fa3c0] uppercase block mb-1">
              Generated CSS
            </span>
            <code className="text-xs font-mono text-[#8b5cf6] block overflow-x-auto whitespace-pre-wrap select-all">
              background: {cssGradient};
            </code>
          </div>
        </div>
      )}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Wallpaper Gradient Maker allows you to design minimal, elegant color gradients engineered specifically for modern smartphone displays. By blending 3 customizable color stops with precision angle controls, you can craft wallpapers that look stunning behind iOS app icons, widgets, and lock screen typography.
          </p>
          <p>
            On Super Retina OLED displays, true-black pixels (#000000 or deep navy #050a14) completely turn off the individual OLED sub-pixels, saving significant battery power while providing infinite contrast. This tool renders and exports uncompressed 1170×2532 PNG files via browser canvas, eliminating the ugly color-banding and compression artifacts common in stock wallpaper apps.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Pick a curated preset or customize color stops',
          text: 'Select one of our OLED presets or use the 3 color pickers to set your base, midtone, and vibrant highlight colors.',
        },
        {
          step: 'Adjust the linear rotation angle',
          text: 'Drag the rotation angle slider from 0° to 360° to position dark zones under your lock screen clock and widgets.',
        },
        {
          step: 'Preview against the lock screen clock',
          text: 'Toggle the Clock preview to verify that white clock text and notification cards remain legible against your gradient.',
        },
        {
          step: 'Download your 1170×2532 PNG or copy CSS',
          text: 'Click Download PNG to save the exact native Super Retina resolution image directly to your Photos library or desktop.',
        },
      ]}
      workedExample={{
        title: 'Example: Crafting an OLED-Friendly Midnight Cyber Wallpaper',
        scenario: 'A designer creating a sleek dark wallpaper with rich contrast that does not distract from home screen app icon labels.',
        output: `### Palette Selection:
- Stop 1 (Base): #050a14 (Near true-black for battery efficiency)
- Stop 2 (Midtone): #0a1e28 (Subtle deep oceanic navy)
- Stop 3 (Accent): #8b5cf6 (Aurora violet ambient glow at bottom-right)
- Geometry: Linear Gradient at 135°
- Output Canvas: 1170 × 2532 (Native iPhone 15/16 Super Retina XDR)

Result: Deep contrast at top for clock readability, with a subtle aurora violet illumination across the dock.`,
      }}
      tips={[
        'Keep the top 30% dark for clock legibility: Placing darker hex tones (like #050a14) at the top of your gradient ensures iOS white lock screen clock and notifications pop with zero strain.',
        'True black saves OLED battery: Pixels darker than #080808 draw virtually zero power on OLED screens, noticeably prolonging daily battery life.',
        'Copy CSS for developer projects: Click Copy CSS to grab ready-to-paste background CSS for Tailwind web apps or React Native styling.',
        'Set as Lock Screen with Depth Effect: Because the 1170×2532 output is sharp and noise-free, iOS can apply clock layering and spatial audio filters smoothly.',
      ]}
      faq={[
        {
          question: 'Why 1170 × 2532 resolution?',
          answer: '1170×2532 is the native hardware resolution of modern 6.1-inch iPhones (iPhone 13, 14, 15, and 16 Pro) at 460 pixels per inch. It also scales perfectly to larger Plus and Pro Max screens without pixelation.',
        },
        {
          question: 'Why do other wallpaper apps have visible color banding?',
          answer: 'Standard JPEG wallpapers suffer from 8-bit heavy quantization. SmartToolHub exports clean 32-bit lossless PNG files directly from canvas memory, ensuring buttery smooth color transitions.',
        },
        {
          question: 'Does this tool upload my images anywhere?',
          answer: 'No. The entire rendering pipeline runs in your local browser using HTML5 Canvas. No server communication takes place.',
        },
        {
          question: 'Can I use these gradients in commercial web design?',
          answer: 'Yes. All CSS code and generated PNG graphics are 100% royalty-free for personal and commercial projects.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
