import React, { useState } from 'react';
import { FileJson, Copy, Check, ArrowLeftRight, RefreshCw, AlertCircle, Download } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface JsonYamlConverterPageProps {
  navigate: (path: string) => void;
}

export const JsonYamlConverterPage: React.FC<JsonYamlConverterPageProps> = ({ navigate }) => {
  const [direction, setDirection] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
  const [input, setInput] = useState(`{
  "name": "SmartToolHub",
  "version": "2.5.0",
  "private": true,
  "features": [
    "zero-signup",
    "on-device-speed",
    "transparent-benchmarks"
  ],
  "server": {
    "port": 3000,
    "ssl": true
  }
}`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Lightweight robust JSON to YAML serialization
  const jsonToYaml = (obj: any, indent = 0): string => {
    const spacing = '  '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
    if (typeof obj === 'string') {
      if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj === '') {
        return `"${obj.replace(/"/g, '\\"')}"`;
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.map(item => {
        if (typeof item === 'object' && item !== null) {
          const inner = jsonToYaml(item, indent + 1).trimStart();
          return `${spacing}- ${inner}`;
        }
        return `${spacing}- ${jsonToYaml(item, indent)}`;
      }).join('\n');
    }
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      return keys.map(k => {
        const val = obj[k];
        if (typeof val === 'object' && val !== null && (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0)) {
          return `${spacing}${k}:\n${jsonToYaml(val, indent + 1)}`;
        }
        return `${spacing}${k}: ${jsonToYaml(val, indent + 1)}`;
      }).join('\n');
    }
    return String(obj);
  };

  // Basic YAML to JSON parser for common structured objects
  const yamlToJson = (yamlStr: string): any => {
    const lines = yamlStr.split('\n');
    const result: any = {};
    let currentKey = '';

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('- ')) {
        // Array item
        const val = trimmed.replace(/^- /, '').trim().replace(/^["']|["']$/g, '');
        if (currentKey && Array.isArray(result[currentKey])) {
          result[currentKey].push(val);
        }
        continue;
      }

      if (trimmed.includes(':')) {
        const colonIdx = trimmed.indexOf(':');
        const key = trimmed.slice(0, colonIdx).trim();
        const rawVal = trimmed.slice(colonIdx + 1).trim();

        if (rawVal === '') {
          // Object or upcoming array
          currentKey = key;
          result[key] = [];
        } else {
          currentKey = key;
          let parsedVal: any = rawVal.replace(/^["']|["']$/g, '');
          if (rawVal === 'true') parsedVal = true;
          else if (rawVal === 'false') parsedVal = false;
          else if (rawVal === 'null') parsedVal = null;
          else if (!isNaN(Number(rawVal)) && rawVal !== '') parsedVal = Number(rawVal);
          result[key] = parsedVal;
        }
      }
    }
    return result;
  };

  const handleConvert = () => {
    setError(null);
    try {
      if (direction === 'json-to-yaml') {
        const parsed = JSON.parse(input);
        const yamlResult = jsonToYaml(parsed);
        setOutput(yamlResult);
      } else {
        const parsedObj = yamlToJson(input);
        setOutput(JSON.stringify(parsedObj, null, 2));
      }
    } catch (err: any) {
      setError(err.message || 'Syntax error parsing input data.');
    }
  };

  const toggleDirection = () => {
    const nextDir = direction === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml';
    setDirection(nextDir);
    const prevOut = output;
    if (prevOut) {
      setInput(prevOut);
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'Why convert between JSON and YAML?',
      a: 'JSON is the standard format for web APIs and application data. YAML (YAML Ain\'t Markup Language) is preferred for human-readable DevOps configuration files like Docker Compose, Kubernetes manifests, GitHub Actions, and Helm charts.',
    },
    {
      q: 'Does this converter validate syntax errors?',
      a: 'Yes. If your JSON contains trailing commas or unquoted keys, the parser catches and reports the exact parse exception immediately.',
    },
    {
      q: 'Are any server calls made with my data?',
      a: 'Zero. All serialization and formatting run entirely in your local browser sandbox.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'JSON to YAML & YAML to JSON Converter',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'description': 'Bidirectional JSON to YAML converter with syntax validation, 2-space indentation formatting, and one-tap copy.',
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
        <span className="text-[#39ff88]">JSON to YAML Converter</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <FileJson className="w-3.5 h-3.5" />
          <span>DEVELOPER &amp; DEVOPS DATA</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          JSON to YAML &amp; YAML to JSON Converter
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Convert configurations and schemas between JSON and YAML bidirectionally. Zero latency, client-side parsing, and instant formatting.
        </p>
      </header>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#8fa3c0]">Mode:</span>
          <span className="text-xs font-mono font-bold text-[#39ff88] uppercase">
            {direction === 'json-to-yaml' ? 'JSON → YAML' : 'YAML → JSON'}
          </span>
          <button
            onClick={toggleDirection}
            className="p-1.5 rounded-lg bg-[#050a14] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#7db8ff] transition-colors text-xs font-medium flex items-center gap-1.5 ml-2"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch Direction</span>
          </button>
        </div>

        <button
          onClick={handleConvert}
          className="px-4 py-2 rounded-lg bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-bold text-xs transition-colors"
        >
          Convert Now
        </button>
      </div>

      {/* Editor & Output Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8fa3c0]">
            <span>{direction === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}</span>
            <span>{input.length} characters</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={15}
            className="w-full flex-1 bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-xs sm:text-sm text-[#f2f7ff] font-mono leading-relaxed focus:outline-none focus:border-[#39ff88] resize-none"
            placeholder={direction === 'json-to-yaml' ? 'Paste valid JSON...' : 'Paste valid YAML...'}
          />
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-[#ff5c7a] font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8fa3c0]">
              {direction === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
            </span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="px-3 py-1.5 rounded bg-[#39ff88] disabled:opacity-40 hover:bg-[#1fbf62] text-[#050a14] font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Result'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={15}
            className="w-full flex-1 bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-xs sm:text-sm text-[#39ff88] font-mono leading-relaxed focus:outline-none resize-none"
            placeholder="Converted output will appear here..."
          />
        </div>
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Select Conversion Direction</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Choose JSON to YAML for Kubernetes and Docker Compose configurations, or switch to YAML to JSON for API payloads.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Paste Data &amp; Convert</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Paste your raw snippet into the input box and tap Convert Now to parse nested arrays, keys, and values.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy Output</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Tap Copy Result to transfer the formatted output directly into your editor or configuration pipeline.
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
