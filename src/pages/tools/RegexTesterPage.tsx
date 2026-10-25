import React, { useState, useMemo } from 'react';
import { Code, Copy, Check, Sparkles, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface RegexTesterPageProps {
  navigate: (path: string) => void;
}

export const RegexTesterPage: React.FC<RegexTesterPageProps> = ({ navigate }) => {
  const [pattern, setPattern] = useState(String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`);
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState(
    'Contact customer support at contact@smarttoolhub.net or billing@example.org for quick assistance.'
  );
  const [copied, setCopied] = useState(false);

  // Common quick regex templates
  const presets = [
    { label: 'Email Address', pat: String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`, f: 'g' },
    { label: 'URL / Domain', pat: String.raw`https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)`, f: 'gi' },
    { label: 'IPv4 Address', pat: String.raw`\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b`, f: 'g' },
    { label: 'Phone (US)', pat: String.raw`\(?\b[0-9]{3}\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}\b`, f: 'g' },
    { label: 'Date (YYYY-MM-DD)', pat: String.raw`\b\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])\b`, f: 'g' },
    { label: 'HEX Color', pat: String.raw`#(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b`, f: 'gi' },
  ];

  const { matches, error } = useMemo(() => {
    try {
      if (!pattern) return { matches: [], error: null };
      const re = new RegExp(pattern, flags);
      const list = [];
      let match;
      if (flags.includes('g')) {
        while ((match = re.exec(testText)) !== null) {
          list.push({ text: match[0], index: match.index, groups: match.slice(1) });
          if (match.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        match = re.exec(testText);
        if (match) list.push({ text: match[0], index: match.index, groups: match.slice(1) });
      }
      return { matches: list, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [pattern, flags, testText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'What do the regex flags g, i, and m mean?',
      a: 'The `g` flag (global) matches all occurrences rather than stopping after the first match. The `i` flag (ignore case) matches letters regardless of uppercase or lowercase. The `m` flag (multiline) causes `^` and `$` to match the start and end of every individual line instead of only the full document.',
    },
    {
      q: 'Does this regular expression tester send my text to any server?',
      a: 'No. All evaluation runs inside your local browser JavaScript engine using the standard native RegExp object. Zero bytes leave your machine.',
    },
    {
      q: 'Why did my regex match zero results?',
      a: 'Check for unescaped special characters like `.` (matches any character unless escaped as `\\.`), `/`, `(`, or `[`. Also check whether letter casing matters if the `i` flag is omitted.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Regex Pattern Builder & Explainer',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'description': 'Real-time regular expression tester with capture group inspections, syntax validation, and preset cheat sheets.',
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
        <span className="text-[#39ff88]">Regex Tester &amp; Explainer</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <Code className="w-3.5 h-3.5" />
          <span>DEVELOPER PATTERN MATCHING</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          Regex Pattern Tester &amp; Explainer
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Test regular expressions against sample text in real-time. Inspect capture groups, catch syntax errors, and copy ready-to-paste snippets.
        </p>
      </header>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => { setPattern(p.pat); setFlags(p.f); }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0a1424] hover:bg-[#101c33] border border-[#8fa3c0]/20 text-[#f2f7ff] transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-5 sm:p-6 space-y-5">
        {/* Pattern Input Bar */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider">Regular Expression Pattern</label>
          <div className="flex items-center gap-2 bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-2 focus-within:border-[#39ff88]">
            <span className="text-[#8fa3c0] font-mono text-lg pl-2">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full bg-transparent text-[#39ff88] font-mono text-sm sm:text-base focus:outline-none"
              placeholder="e.g. [a-z0-9]+"
            />
            <span className="text-[#8fa3c0] font-mono text-lg">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="w-16 bg-[#0a1424] border border-[#8fa3c0]/20 rounded px-2 py-1 text-xs text-[#f2f7ff] font-mono text-center focus:outline-none"
              placeholder="flags"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-[#ff5c7a] font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Regex Error: {error}</span>
            </div>
          )}
        </div>

        {/* Test String Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider">Test Sample Text</label>
            <span className="text-xs font-mono text-[#39ff88]">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
            </span>
          </div>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={5}
            className="w-full bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-sm text-[#f2f7ff] font-mono focus:outline-none focus:border-[#39ff88]"
            placeholder="Paste text to test against..."
          />
        </div>

        {/* Match Breakdown Results */}
        <div className="space-y-2 pt-2 border-t border-[#8fa3c0]/15">
          <label className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider">Captured Matches Breakdown</label>
          {matches.length === 0 ? (
            <div className="bg-[#050a14] border border-[#8fa3c0]/15 rounded-lg p-4 text-xs text-[#8fa3c0] font-mono text-center">
              No matching substrings found in test text.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {matches.map((m, idx) => (
                <div key={idx} className="bg-[#050a14] border border-[#39ff88]/20 rounded-lg p-3 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[#8fa3c0]">
                    <span>Match #{idx + 1} (Index: {m.index})</span>
                    <span className="text-[#39ff88] font-bold">Length: {m.text.length}</span>
                  </div>
                  <div className="text-[#f2f7ff] bg-[#0a1424] px-2 py-1 rounded border border-[#8fa3c0]/10 break-all">
                    {m.text}
                  </div>
                  {m.groups.length > 0 && (
                    <div className="text-[#7db8ff] pl-2 pt-1 border-l-2 border-[#7db8ff]/30 text-[11px] space-y-0.5">
                      {m.groups.map((g, gIdx) => (
                        <div key={gIdx}>Group {gIdx + 1}: {g || '<empty>'}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Enter Pattern and Flags</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Write your regular expression or select a preset for emails, URLs, or IP addresses. Add flags like `g` or `i` in the flag box.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Paste Sample Text</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Paste logs, HTML, or sentences into the text area. The parser runs immediately on every keystroke with zero page reloads.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Inspect Capture Groups</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Examine the match count, indices, and capture group segments in the results panel to confirm clean extraction.
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
