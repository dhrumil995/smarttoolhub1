import React, { useState } from 'react';
import { Binary, Copy, Check, Upload, FileUp, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface Base64ConverterPageProps {
  navigate: (path: string) => void;
}

export const Base64ConverterPage: React.FC<Base64ConverterPageProps> = ({ navigate }) => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState('SmartToolHub - Free, private on-device utilities.');
  const [outputText, setOutputText] = useState('');
  const [dataUriMode, setDataUriMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    try {
      if (mode === 'encode') {
        // UTF-8 safe encode
        const encoded = btoa(encodeURIComponent(inputText).replace(/%([0-9A-F]{2})/g, (_, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
        setOutputText(encoded);
      } else {
        // UTF-8 safe decode
        const cleaned = inputText.trim().replace(/^data:.*?;base64,/, '');
        const decoded = decodeURIComponent(Array.prototype.map.call(atob(cleaned), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        setOutputText(decoded);
      }
    } catch (err: any) {
      setError('Invalid input string. Please ensure valid Base64 formatting.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (dataUriMode) {
        setOutputText(result);
      } else {
        // Strip data: prefix
        const pureBase64 = result.split(',')[1] || result;
        setOutputText(pureBase64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'What is Base64 encoding used for?',
      a: 'Base64 represents binary data (such as images, icons, or encryption keys) using an ASCII character set of 64 printable characters. It is commonly used for inline CSS images, data URIs, and email attachments.',
    },
    {
      q: 'Does Base64 provide encryption or security?',
      a: 'No. Base64 is an encoding format, not an encryption algorithm. Anyone can instantly decode Base64 back into plaintext or raw binary.',
    },
    {
      q: 'Are uploaded files sent to your server?',
      a: 'No. The file reader executes strictly inside your browser through the HTML5 FileReader API. Your files remain entirely on your local machine.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Base64 Encoder & Decoder (Text & Files)',
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All',
    'description': 'Convert text and binary files to Base64 strings and data URIs with UTF-8 support and zero server uploads.',
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
        <span className="text-[#39ff88]">Base64 Encoder &amp; Decoder</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <Binary className="w-3.5 h-3.5" />
          <span>DEVELOPER &amp; BINARY TOOLS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          Base64 Encoder &amp; Decoder (Text &amp; Files)
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Encode plain text or drop files to generate Base64 strings and CSS data URIs. Decode Base64 payloads back to text with full UTF-8 support.
        </p>
      </header>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'encode' ? 'bg-[#39ff88] text-[#050a14]' : 'bg-[#050a14] text-[#8fa3c0] hover:text-[#f2f7ff]'
            }`}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'decode' ? 'bg-[#39ff88] text-[#050a14]' : 'bg-[#050a14] text-[#8fa3c0] hover:text-[#f2f7ff]'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <button
          onClick={handleConvert}
          className="px-4 py-2 rounded-lg bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-bold text-xs transition-colors"
        >
          {mode === 'encode' ? 'Encode Text' : 'Decode Text'}
        </button>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8fa3c0]">
            <span>{mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}</span>
            <span>{inputText.length} chars</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            className="w-full flex-1 bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-sm text-[#f2f7ff] font-mono leading-relaxed focus:outline-none focus:border-[#39ff88] resize-none"
            placeholder={mode === 'encode' ? 'Type or paste plaintext...' : 'Paste Base64 payload...'}
          />

          {mode === 'encode' && (
            <div className="pt-2 border-t border-[#8fa3c0]/15 space-y-2">
              <label className="text-xs font-mono text-[#8fa3c0] uppercase">Or Convert a Local File to Base64</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050a14] hover:bg-[#101c33] border border-[#8fa3c0]/30 text-[#f2f7ff] text-xs font-medium transition-colors">
                  <FileUp className="w-3.5 h-3.5 text-[#39ff88]" />
                  <span>Choose File (Image/SVG/Doc)</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
                {fileName && <span className="text-xs font-mono text-[#39ff88] truncate">{fileName}</span>}
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#8fa3c0] pt-1">
                <input
                  type="checkbox"
                  checked={dataUriMode}
                  onChange={(e) => setDataUriMode(e.target.checked)}
                  className="accent-[#39ff88]"
                />
                <span>Include Data URI prefix (data:image/png;base64,...)</span>
              </label>
            </div>
          )}

          {error && <div className="text-xs font-mono text-[#ff5c7a]">{error}</div>}
        </div>

        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8fa3c0]">
              {mode === 'encode' ? 'Base64 Result' : 'Decoded Plain Text'}
            </span>
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="px-3 py-1.5 rounded bg-[#39ff88] disabled:opacity-40 hover:bg-[#1fbf62] text-[#050a14] font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={outputText}
            rows={14}
            className="w-full flex-1 bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-xs sm:text-sm text-[#39ff88] font-mono leading-relaxed focus:outline-none resize-none break-all"
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Choose Mode or File</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Select Encode to Base64 to convert text or images, or switch to Decode from Base64 to unpack encoded payloads.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Execute Conversion</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Click Encode/Decode or select a file. The browser processes binary chunks in memory with zero transmission latency.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy Result</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Click Copy Output to place the Base64 string directly on your clipboard for CSS embeds, HTML inline images, or API payloads.
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
