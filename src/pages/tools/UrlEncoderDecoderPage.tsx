import React, { useState, useMemo } from 'react';
import { Link2, Copy, Check, Plus, Trash2, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface UrlEncoderDecoderPageProps {
  navigate: (path: string) => void;
}

export const UrlEncoderDecoderPage: React.FC<UrlEncoderDecoderPageProps> = ({ navigate }) => {
  const [inputUrl, setInputUrl] = useState('https://smarttoolhub.net/tools?category=Developer&q=apple%20shortcuts&sort=featured');
  const [mode, setMode] = useState<'encode' | 'decode'>('decode');
  const [copied, setCopied] = useState(false);

  const convertedResult = useMemo(() => {
    try {
      if (mode === 'encode') {
        return encodeURIComponent(inputUrl);
      } else {
        return decodeURIComponent(inputUrl);
      }
    } catch {
      return 'Malformed URL component.';
    }
  }, [inputUrl, mode]);

  // Query parameter parsing
  const parsedParams = useMemo(() => {
    try {
      const url = new URL(inputUrl.startsWith('http') ? inputUrl : `https://example.com/${inputUrl}`);
      const list: Array<{ key: string; value: string }> = [];
      url.searchParams.forEach((val, key) => {
        list.push({ key, value: val });
      });
      return { baseUrl: url.origin + url.pathname, params: list };
    } catch {
      return { baseUrl: inputUrl, params: [] };
    }
  }, [inputUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'What is the difference between encodeURI and encodeURIComponent?',
      a: '`encodeURI` is intended for complete URLs and preserves protocol separators like `://`, `?`, and `&`. `encodeURIComponent` encodes all special characters including `/`, `?`, and `&`, making it safe to embed arbitrary values inside URL query strings.',
    },
    {
      q: 'Why are spaces sometimes encoded as %20 and other times as +?',
      a: 'Both represent spaces. `%20` is the standard percent-encoding defined in RFC 3986. The `+` symbol is a historical legacy format used specifically in application/x-www-form-urlencoded form post submissions.',
    },
    {
      q: 'Does this tool transmit my links or query tokens anywhere?',
      a: 'No. All URL parsing and encoding operations happen in memory on your local machine using standard JavaScript URL APIs.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'URL Encoder & Decoder (Query String Parser)',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'description': 'Encode and decode URLs and query string parameters with component parsing, key-value tables, and one-click copy.',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
  };

  return (
    <div className="py-6 sm:py-10 max-w-[1080px] mx-auto space-y-8">
      <SchemaScript schema={schemaJson} />

      {/* Breadcrumbs */}
      <nav className="text-xs font-mono text-[#8fa3c0] flex items-center gap-2">
        <button onClick={() => navigate('/')} className="hover:text-[#39ff88] transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/tools')} className="hover:text-[#39ff88] transition-colors">Tools</button>
        <span>/</span>
        <span className="text-[#39ff88]">URL Encoder &amp; Decoder</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <Link2 className="w-3.5 h-3.5" />
          <span>DEVELOPER NETWORKING</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          URL Encoder &amp; Decoder
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Sanitize, percent-encode, and decode web addresses and URL parameters. Inspect structured query parameter key-value pairs instantly.
        </p>
      </header>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'decode' ? 'bg-[#39ff88] text-[#050a14]' : 'bg-[#050a14] text-[#8fa3c0] hover:text-[#f2f7ff]'
            }`}
          >
            Decode URL (%20 → space)
          </button>
          <button
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'encode' ? 'bg-[#39ff88] text-[#050a14]' : 'bg-[#050a14] text-[#8fa3c0] hover:text-[#f2f7ff]'
            }`}
          >
            Encode URL (space → %20)
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Output'}</span>
        </button>
      </div>

      {/* Inputs & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8fa3c0]">
            <span>URL / Component Input</span>
            <span>{inputUrl.length} chars</span>
          </div>
          <textarea
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            rows={6}
            className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-sm text-[#f2f7ff] font-mono leading-relaxed focus:outline-none focus:border-[#39ff88] resize-none break-all"
            placeholder="Paste URL or query string..."
          />
        </div>

        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="text-xs font-mono text-[#8fa3c0]">Converted Result ({mode})</div>
          <textarea
            readOnly
            value={convertedResult}
            rows={6}
            className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-sm text-[#39ff88] font-mono leading-relaxed focus:outline-none resize-none break-all"
            placeholder="Converted output..."
          />
        </div>
      </div>

      {/* Query Parameters Table */}
      {parsedParams.params.length > 0 && (
        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-5 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
            Parsed Query Parameters ({parsedParams.params.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-[#8fa3c0]/20 text-[#8fa3c0]">
                  <th className="py-2 px-3">Parameter Key</th>
                  <th className="py-2 px-3">Decoded Value</th>
                </tr>
              </thead>
              <tbody>
                {parsedParams.params.map((p, idx) => (
                  <tr key={idx} className="border-b border-[#8fa3c0]/10">
                    <td className="py-2.5 px-3 text-[#7db8ff] font-bold">{p.key}</td>
                    <td className="py-2.5 px-3 text-[#f2f7ff] break-all">{p.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Paste URL or Query String</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Paste the full web address, API endpoint, or percent-encoded token into the input workspace.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Inspect Parsed Parameters</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              View the decoded key-value breakdown table to easily isolate marketing UTM tags or authorization tokens.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy Result</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Click Copy Output to transfer the sanitized address directly into your code editor or browser navigation bar.
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
