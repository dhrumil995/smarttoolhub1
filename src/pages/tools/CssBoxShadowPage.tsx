import React, { useState } from 'react';
import { Layers3, Copy, Check, Sparkles, RefreshCw, Sun, Moon } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface CssBoxShadowPageProps {
  navigate: (path: string) => void;
}

export const CssBoxShadowPage: React.FC<CssBoxShadowPageProps> = ({ navigate }) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(12);
  const [blurRadius, setBlurRadius] = useState(32);
  const [spreadRadius, setSpreadRadius] = useState(-4);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [opacity, setOpacity] = useState(0.45);
  const [isInset, setIsInset] = useState(false);
  const [copied, setCopied] = useState(false);

  // Convert hex color + opacity to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  };

  const shadowString = `${isInset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${hexToRgba(shadowColor, opacity)}`;
  const cssOutput = `box-shadow: ${shadowString};\n-webkit-box-shadow: ${shadowString};`;

  // Presets
  const applyPreset = (x: number, y: number, blur: number, spread: number, col: string, op: number, inset: boolean) => {
    setOffsetX(x);
    setOffsetY(y);
    setBlurRadius(blur);
    setSpreadRadius(spread);
    setShadowColor(col);
    setOpacity(op);
    setIsInset(inset);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'What is the difference between blur and spread in CSS box-shadow?',
      a: 'The blur radius (3rd value) determines the softness and distance of the Gaussian blur edge. The spread radius (4th value) expands or contracts the physical surface area of the shadow before blur is applied; negative spread pulls the shadow inward.',
    },
    {
      q: 'How do I create a modern obsidian dark mode glow?',
      a: 'Set offsetX and offsetY to 0, use a bright accent color like neon green (`#39ff88`) or electric blue (`#0a84ff`), set blur to 25px–40px, and keep opacity around 0.25–0.35.',
    },
    {
      q: 'Does box-shadow trigger layout recalculations in modern browsers?',
      a: 'No. Box shadow changes only trigger paint and composite passes on GPU layers, making CSS shadows smooth when paired with CSS transitions.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'CSS Box Shadow & Glow Generator',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'description': 'Interactive visual CSS box-shadow generator with real-time card previews, dark mode glow presets, and instant CSS code output.',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
  };

  return (
    <div className="py-6 sm:py-10 max-w-[960px] mx-auto space-y-8">
      <SchemaScript schema={schemaJson} />

      {/* Breadcrumbs */}
      <nav className="text-xs font-mono text-[#8fa3c0] flex items-center gap-2">
        <button onClick={() => navigate('/')} className="hover:text-[#39ff88] transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/tools')} className="hover:text-[#39ff88] transition-colors">Tools</button>
        <span>/</span>
        <span className="text-[#39ff88]">CSS Box Shadow Generator</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <Layers3 className="w-3.5 h-3.5" />
          <span>FRONTEND DESIGN &amp; UI</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          CSS Box Shadow &amp; Glow Generator
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Craft subtle card elevations, dark theme glows, and inset depth with interactive sliders. Instant cross-browser CSS code.
        </p>
      </header>

      {/* Presets Bar */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">Elevation Presets</label>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => applyPreset(0, 4, 12, 0, '#000000', 0.25, false)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Subtle Card (Light)
          </button>
          <button onClick={() => applyPreset(0, 12, 32, -4, '#000000', 0.5, false)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Obsidian Surface (Medium)
          </button>
          <button onClick={() => applyPreset(0, 20, 50, -10, '#000000', 0.7, false)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Floating Modal (High)
          </button>
          <button onClick={() => applyPreset(0, 0, 30, 2, '#39ff88', 0.35, false)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#39ff88]/30 text-[#39ff88] transition-colors">
            Laser Green Glow
          </button>
          <button onClick={() => applyPreset(0, 0, 30, 2, '#0a84ff', 0.35, false)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#0a84ff]/30 text-[#7db8ff] transition-colors">
            Electric Blue Glow
          </button>
          <button onClick={() => applyPreset(0, 2, 8, 0, '#000000', 0.4, true)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors">
            Soft Inset Well
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Controls Column */}
        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-[#8fa3c0]">
              <span>Offset X</span>
              <span className="text-[#f2f7ff]">{offsetX}px</span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
              className="w-full accent-[#39ff88]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-[#8fa3c0]">
              <span>Offset Y</span>
              <span className="text-[#f2f7ff]">{offsetY}px</span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
              className="w-full accent-[#39ff88]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-[#8fa3c0]">
              <span>Blur Radius</span>
              <span className="text-[#f2f7ff]">{blurRadius}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={blurRadius}
              onChange={(e) => setBlurRadius(parseInt(e.target.value, 10))}
              className="w-full accent-[#39ff88]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-[#8fa3c0]">
              <span>Spread Radius</span>
              <span className="text-[#f2f7ff]">{spreadRadius}px</span>
            </div>
            <input
              type="range"
              min={-30}
              max={50}
              value={spreadRadius}
              onChange={(e) => setSpreadRadius(parseInt(e.target.value, 10))}
              className="w-full accent-[#39ff88]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#8fa3c0]">Shadow Color</label>
              <div className="flex items-center gap-2 bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-1.5">
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono text-[#f2f7ff]">{shadowColor.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-[#8fa3c0]">
                <span>Opacity</span>
                <span className="text-[#f2f7ff]">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(opacity * 100)}
                onChange={(e) => setOpacity(parseInt(e.target.value, 10) / 100)}
                className="w-full accent-[#39ff88] mt-2.5"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#f2f7ff]">
              <input
                type="checkbox"
                checked={isInset}
                onChange={(e) => setIsInset(e.target.checked)}
                className="w-4 h-4 accent-[#39ff88] rounded"
              />
              <span>Inset Shadow (Inner Shadow)</span>
            </label>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-4">
          <div className="bg-[#050a14] border border-[#8fa3c0]/20 rounded-xl p-8 flex items-center justify-center min-h-[260px] overflow-hidden">
            <div
              style={{ boxShadow: shadowString }}
              className="w-48 h-36 bg-[#0a1424] border border-[#8fa3c0]/25 rounded-xl flex flex-col items-center justify-center p-4 text-center transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#39ff88]/20 flex items-center justify-center text-[#39ff88] mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold text-[#f2f7ff]">Interactive Surface</span>
              <span className="text-[11px] text-[#8fa3c0] mt-1">Live Box Shadow</span>
            </div>
          </div>

          {/* Generated Code Area */}
          <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#8fa3c0]">Generated CSS</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy CSS'}</span>
              </button>
            </div>
            <pre className="text-xs text-[#39ff88] font-mono bg-[#050a14] p-3 rounded-lg border border-[#8fa3c0]/20 overflow-x-auto">
              {cssOutput}
            </pre>
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Choose a Preset or Custom Sliders</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Click any of the preset cards (Floating Modal, Dark Glow, Subtle Card) or drag the sliders to set X/Y offsets, blur, and spread.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Fine-Tune Color and Inset</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Pick your shadow tint, adjust the opacity percentage slider, or toggle Inset to turn it into an inner shadow well.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy CSS Code</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Tap Copy CSS to transfer the clean rules (including vendor prefix) to your clipboard, ready for Tailwind or CSS modules.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details key={i} className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-lg p-4 group">
              <summary className="font-semibold text-sm text-[#f2f7ff] cursor-pointer list-none flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-[#39ff88] font-mono text-xs">+</span>
              </summary>
              <p className="text-xs text-[#8fa3c0] mt-2.5 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
