import React, { useState } from 'react';
import { ScanLine, Copy, Check, Layers, Code, Sparkles } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface RetinaCalculatorPageProps {
  navigate: (path: string) => void;
}

export const RetinaCalculatorPage: React.FC<RetinaCalculatorPageProps> = ({ navigate }) => {
  const [widthPoints, setWidthPoints] = useState<number>(375);
  const [heightPoints, setHeightPoints] = useState<number>(812);
  const [copiedScale, setCopiedScale] = useState<string | null>(null);

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'retina-image-size-calculator') || LAUNCH_TOOLS[9];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'iphone-charging-time-calculator' || t.slug === 'file-transfer-time-calculator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'retina-display-pixel-densities') || POPULAR_GUIDES[0];

  const presets = [
    { label: '375 × 812 (iPhone Screen Points)', w: 375, h: 812 },
    { label: '44 × 44 (iOS Touch Target)', w: 44, h: 44 },
    { label: '1200 × 630 (Social Banner)', w: 1200, h: 630 },
  ];

  const exampleChips = [
    '375 x 812 points',
    '44 x 44 points',
    '1200 x 630 points',
  ];

  // Helper gcd for aspect ratio
  const getGcd = (a: number, b: number): number => (b === 0 ? a : getGcd(b, a % b));
  const gcd = getGcd(widthPoints, heightPoints);
  const aspectR = gcd > 0 ? `${widthPoints / gcd}:${heightPoints / gcd}` : 'Custom';

  const w1x = Math.round(widthPoints);
  const h1x = Math.round(heightPoints);
  const w2x = Math.round(widthPoints * 2);
  const h2x = Math.round(heightPoints * 2);
  const w3x = Math.round(widthPoints * 3);
  const h3x = Math.round(heightPoints * 3);

  const srcsetSnippet = `srcset="image@1x.png 1x, image@2x.png 2x, image@3x.png 3x"`;

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedScale(label);
      setTimeout(() => setCopiedScale(null), 1500);
    } catch {
      // Handled
    }
  };

  const handleCompute = (inputStr: string) => {
    // Parse numbers from input if user typed custom dimensions
    const matches = inputStr.match(/\d+/g);
    let curW = widthPoints;
    let curH = heightPoints;
    if (matches && matches.length >= 2) {
      curW = Math.max(1, parseInt(matches[0], 10));
      curH = Math.max(1, parseInt(matches[1], 10));
      setWidthPoints(curW);
      setHeightPoints(curH);
    }

    const calculated = {
      base: `${curW} × ${curH} pt`,
      x1: `${curW} × ${curH} px`,
      x2: `${curW * 2} × ${curH * 2} px`,
      x3: `${curW * 3} × ${curH * 3} px`,
      aspect: aspectR,
      srcset: srcsetSnippet,
    };

    const textResult = `### Retina Display Dimensions for ${curW} × ${curH} points\n\n- **@1x Standard:** ${calculated.x1}\n- **@2x Retina (iPhone, iPad, Mac):** ${calculated.x2}\n- **@3x Super Retina (iPhone Pro/Plus):** ${calculated.x3}\n- **Aspect Ratio:** ${aspectR}\n- **HTML srcset:** \`${srcsetSnippet}\``;

    return {
      result: textResult,
      rawData: calculated,
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Retina Image Size Calculator"
      subheading="Convert design points into pixel-perfect @1x, @2x, and @3x dimensions. Never ship blurry images to iPhone, iPad, or Mac screens."
      inputLabel="Base Points (Width × Height)"
      inputPlaceholder="e.g. 375 x 812 points..."
      examplePrompt={`${widthPoints} x ${heightPoints} points`}
      exampleChips={exampleChips}
      generateButtonText="Calculate @1x, @2x, and @3x"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Dimension Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="retina-w" className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                Width in Points (pt)
              </label>
              <input
                id="retina-w"
                type="number"
                min="1"
                max="10000"
                value={widthPoints}
                onChange={(e) => setWidthPoints(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl px-3.5 py-2.5 text-sm text-[#f2f7ff] focus-ring font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="retina-h" className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold">
                Height in Points (pt)
              </label>
              <input
                id="retina-h"
                type="number"
                min="1"
                max="10000"
                value={heightPoints}
                onChange={(e) => setHeightPoints(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.18)] rounded-xl px-3.5 py-2.5 text-sm text-[#f2f7ff] focus-ring font-mono"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Popular Device Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setWidthPoints(p.w);
                    setHeightPoints(p.h);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] hover:border-[#8b5cf6] text-xs text-[#8fa3c0] hover:text-[#f2f7ff] transition-colors focus-ring"
                >
                  {p.label}
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
                <Layers className="w-3.5 h-3.5" />
                <span>Computed Pixel Resolutions ({widthPoints} × {heightPoints} pt)</span>
              </span>

              <button
                type="button"
                onClick={() => onCopy(result)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#8b5cf6] transition-colors focus-ring"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Specs' : 'Copy All Specs'}</span>
              </button>
            </div>

            {/* 3 Density Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* @1x */}
              <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101c33] text-[#8fa3c0] border border-[rgba(143,163,192,0.2)]">
                    @1x Standard
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(`${w1x}x${h1x}`, '@1x')}
                    className="text-[#8fa3c0] hover:text-[#8b5cf6] transition-colors focus-ring p-1 rounded"
                    title="Copy @1x pixels"
                  >
                    {copiedScale === '@1x' ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-bold font-mono text-[#f2f7ff]">
                  {w1x} × {h1x} <span className="text-xs text-[#8fa3c0] font-sans font-normal">px</span>
                </div>
                <div className="text-[11px] text-[#8fa3c0]">
                  Legacy monitors &amp; non-Retina displays
                </div>
              </div>

              {/* @2x */}
              <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(139, 92, 246,0.3)] shadow-[0_0_12px_rgba(139, 92, 246,0.1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101c33] text-[#8b5cf6] border border-[rgba(139, 92, 246,0.2)]">
                    @2x Retina
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(`${w2x}x${h2x}`, '@2x')}
                    className="text-[#8fa3c0] hover:text-[#8b5cf6] transition-colors focus-ring p-1 rounded"
                    title="Copy @2x pixels"
                  >
                    {copiedScale === '@2x' ? <Check className="w-3.5 h-3.5 text-[#34e0a1]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-bold font-mono text-[#8b5cf6]">
                  {w2x} × {h2x} <span className="text-xs text-[#8fa3c0] font-sans font-normal">px</span>
                </div>
                <div className="text-[11px] text-[#8fa3c0]">
                  MacBook, iPad, iPhone SE, standard web
                </div>
              </div>

              {/* @3x */}
              <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(90,169,255,0.3)] shadow-[0_0_12px_rgba(90,169,255,0.1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101c33] text-[#5aa9ff] border border-[rgba(90,169,255,0.2)]">
                    @3x Super Retina
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(`${w3x}x${h3x}`, '@3x')}
                    className="text-[#8fa3c0] hover:text-[#5aa9ff] transition-colors focus-ring p-1 rounded"
                    title="Copy @3x pixels"
                  >
                    {copiedScale === '@3x' ? <Check className="w-3.5 h-3.5 text-[#5aa9ff]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-bold font-mono text-[#5aa9ff]">
                  {w3x} × {h3x} <span className="text-xs text-[#8fa3c0] font-sans font-normal">px</span>
                </div>
                <div className="text-[11px] text-[#8fa3c0]">
                  iPhone 16/15 Pro Max, Plus, OLED screens
                </div>
              </div>
            </div>

            {/* Code Snippet for Web / HTML */}
            <div className="space-y-2 pt-2 border-t border-[rgba(143,163,192,0.12)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] font-semibold flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  <span>HTML srcset Export</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyText(srcsetSnippet, 'srcset')}
                  className="text-xs text-[#8b5cf6] font-semibold hover:underline flex items-center gap-1 focus-ring"
                >
                  {copiedScale === 'srcset' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScale === 'srcset' ? 'Copied Snippet' : 'Copy Snippet'}</span>
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] font-mono text-xs text-[#5aa9ff] select-all overflow-x-auto">
                {srcsetSnippet}
              </div>
            </div>
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Retina Image Size Calculator computes exact pixel dimensions for @1x, @2x, and @3x graphical assets from baseline design points. It helps UI designers, iOS developers, and web creators produce crisp assets for every Apple device without blurry edges.
          </p>
          <p>
            Modern Apple screens pack either two (@2x) or three (@3x) physical pixels into every single point of screen real estate. If you export an icon at 44 × 44 pixels for a modern iPhone, iOS stretches it across 132 physical pixels, making your graphic look fuzzy. This calculator gives you the exact dimensions to export from Figma, Photoshop, or Sketch so your graphics look razor-sharp on every display.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Enter width and height in points',
          text: 'Type the dimensions your component occupies in your design mockup (e.g. 375 × 200 pt).',
        },
        {
          step: 'Check @1x, @2x, and @3x',
          text: 'Review the automatically multiplied pixel values for standard displays, Retina Macs, and Super Retina iPhones.',
        },
        {
          step: 'Copy dimensions or srcset code',
          text: 'Tap Copy next to any scale to configure your export settings or paste the responsive HTML snippet.',
        },
      ]}
      workedExample={{
        title: 'Example: iOS Navigation Bar Profile Avatar',
        scenario: 'A designer creates a circular profile picture measuring 40 × 40 points in Figma.',
        output: `### Retina Image Specifications:
- Design Size: 40 × 40 pt (Points)
- @1x Standard Pixel Size: 40 × 40 px (Legacy displays)
- @2x Retina Pixel Size: 80 × 80 px (MacBook Air, iPad, iPhone SE)
- @3x Super Retina Pixel Size: 120 × 120 px (iPhone 16 Pro, 15 Pro, Pro Max)

HTML Implementation:
<img src="avatar@1x.png" srcset="avatar@1x.png 1x, avatar@2x.png 2x, avatar@3x.png 3x" width="40" height="40" alt="Avatar" />`,
      }}
      tips={[
        'Always design in @1x points: Working at 1x in Figma keeps your typography and layout measurements mathematically consistent across desktop and mobile.',
        'Follow Apple\'s 44-point touch target guideline: Interactive buttons should be at least 44 × 44 points, which translates to 88 × 88 px at @2x and 132 × 132 px at @3x.',
        'Use SVG for simple vector icons: Whenever possible, export vector graphics as SVG or PDF; iOS and web browsers render vectors sharply at all pixel densities automatically.',
        'Specify explicit width and height attributes in HTML: Setting the base point dimensions on your HTML image tags prevents layout shift while assets are loading.',
      ]}
      faq={[
        {
          question: 'What is the difference between a point (pt) and a pixel (px)?',
          answer: 'A point is an abstract unit of physical distance on a screen that stays roughly the same physical size to the human eye, whereas a pixel is an actual hardware light emitter. On a Retina screen, 1 point contains 4 pixels (@2x) or 9 pixels (@3x).',
        },
        {
          question: 'Which Apple devices use @3x assets?',
          answer: 'All modern flagship iPhones with OLED screens use @3x, including iPhone 16 Pro, iPhone 16, iPhone 15 series, iPhone 14 Pro, iPhone 13 Pro, and iPhone Plus models. iPads and MacBooks primarily use @2x.',
        },
        {
          question: 'Can I just export @3x and let the browser scale it down?',
          answer: 'While browsers can downscale images, loading a massive @3x image on a mobile cellular connection wastes user data and slows down page speed. Providing responsive @1x, @2x, and @3x via srcset is the recommended best practice.',
        },
        {
          question: 'Does this calculator run on my device or on a server?',
          answer: 'All calculations run directly in your web browser. No measurements or image data are sent to any server.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
