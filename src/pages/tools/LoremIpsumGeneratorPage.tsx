import React, { useState, useMemo } from 'react';
import { Type, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface LoremIpsumGeneratorPageProps {
  navigate: (path: string) => void;
}

export const LoremIpsumGeneratorPage: React.FC<LoremIpsumGeneratorPageProps> = ({ navigate }) => {
  const [flavor, setFlavor] = useState<'standard' | 'tech' | 'product'>('tech');
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [copied, setCopied] = useState(false);

  const sampleCorpus = {
    standard: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit.',
    ],
    tech: [
      'The modern deployment pipeline automates regression testing and static security scanning prior to cluster orchestration.',
      'Engineers reduced memory consumption across container pods by switching to asynchronous event loop scheduling and direct memory allocation.',
      'Database queries were optimized by replacing sequential full table scans with composite B-tree indices and connection pooling.',
      'Distributed telemetry streams provide sub-millisecond visibility into API throughput, ingress latencies, and error rates.',
      'Automated background garbage collection routines reclaim inactive cache blocks without introducing noticeable tail latency spikes.',
      'The service communicates across microservices via lightweight protocol buffers over mutual TLS encrypted channels.',
    ],
    product: [
      'Designed with lightweight aerospace-grade materials, this device balances all-day battery endurance with uncompromised processing speed.',
      'Featuring an interactive high-contrast display with adaptive refresh rates, every animation and scroll transition feels immediate and natural.',
      'Built for creative professionals, the dual high-speed ports deliver fast file transfer rates while charging external accessories simultaneously.',
      'Privacy is engineered into every component: biometric credentials stay encrypted locally in an isolated hardware enclave.',
      'Compact enough to slip into a travel bag, yet equipped with sufficient thermal dissipation to sustain heavy creative tasks all afternoon.',
    ],
  };

  const generatedText = useMemo(() => {
    const sentences = sampleCorpus[flavor];
    if (unit === 'sentences') {
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push(sentences[i % sentences.length]);
      }
      return list.join(' ');
    }

    if (unit === 'words') {
      const allWords = sentences.join(' ').split(/\s+/);
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push(allWords[i % allWords.length]);
      }
      return list.join(' ') + '.';
    }

    // Paragraphs
    const paras = [];
    for (let p = 0; p < count; p++) {
      const s1 = sentences[(p * 2) % sentences.length];
      const s2 = sentences[(p * 2 + 1) % sentences.length];
      const s3 = sentences[(p * 2 + 2) % sentences.length];
      paras.push(`${s1} ${s2} ${s3}`);
    }
    return paras.join('\n\n');
  }, [flavor, count, unit]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'Why use realistic placeholder text instead of standard Latin Lorem Ipsum?',
      a: 'Latin text often gives an inaccurate impression of line wraps, character densities, and visual rhythm because English has different word lengths and capitalization patterns. Realistic tech and product text provides high-fidelity UI mockups for stakeholders.',
    },
    {
      q: 'Can I generate custom word counts for design mockups?',
      a: 'Yes. Switch the generation unit to "words" or "sentences" to fit tight UI boundaries like button labels, card descriptions, or hero taglines.',
    },
    {
      q: 'Is this tool free of copyright restrictions?',
      a: 'Yes. All generated copy is open for free personal and commercial use in UI mockups, client wireframes, and prototypes.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Realistic Placeholder Text Generator',
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All',
    'description': 'Generate realistic mock copy for tech products, developer documentation, and UI wireframes with custom word and paragraph counts.',
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
        <span className="text-[#39ff88]">Placeholder Text Generator</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <Type className="w-3.5 h-3.5" />
          <span>DESIGN &amp; COPYWRITING</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          Realistic Placeholder Text Generator
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Beyond generic Latin. Generate realistic mockup text for tech dashboards, product features, and marketing layouts with zero fluff.
        </p>
      </header>

      {/* Controls Bar */}
      <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8fa3c0]">Style &amp; Vocabulary</label>
            <select
              value={flavor}
              onChange={(e) => setFlavor(e.target.value as any)}
              className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-2.5 text-xs text-[#f2f7ff] font-medium focus:outline-none focus:border-[#39ff88]"
            >
              <option value="tech">Developer &amp; Tech Systems</option>
              <option value="product">Hardware &amp; Product Copy</option>
              <option value="standard">Classic Latin (Lorem Ipsum)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8fa3c0]">Unit Type</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-2.5 text-xs text-[#f2f7ff] font-medium focus:outline-none focus:border-[#39ff88]"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#8fa3c0]">Count ({count})</label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value, 10) || 1)))}
              className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-2 text-xs text-[#f2f7ff] font-mono focus:outline-none focus:border-[#39ff88]"
            />
          </div>
        </div>

        {/* Output Box */}
        <div className="space-y-2 pt-2 border-t border-[#8fa3c0]/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#8fa3c0]">Generated Placeholder Copy</span>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <div className="bg-[#050a14] border border-[#8fa3c0]/25 rounded-lg p-4 font-mono text-xs sm:text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {generatedText}
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Select Vocabulary Flavor</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Choose Tech Systems for developer tools, Product Copy for hardware landing pages, or Classic Latin for standard layouts.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Set Target Volume</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Select paragraphs, sentences, or individual words to match the exact dimensions of your UI cards and wireframe boundaries.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy and Paste</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Tap Copy Text to load the snippet directly into your clipboard for Figma, Tailwind, or HTML mockups.
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
