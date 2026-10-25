import React, { useState, useMemo } from 'react';
import { FileCode2, Copy, Check, Eye, Code2, Sparkles, RefreshCw } from 'lucide-react';
import { SchemaScript } from '../../components/seo/SchemaScript.tsx';

interface MarkdownToHtmlPageProps {
  navigate: (path: string) => void;
}

export const MarkdownToHtmlPage: React.FC<MarkdownToHtmlPageProps> = ({ navigate }) => {
  const [markdown, setMarkdown] = useState(`# Fast, Private Utilities
SmartToolHub provides free everyday tools with **zero tracking** and no sign-up.

## Key Principles:
- *Sub-second* client execution
- No account or password requirements
- Clean semantic HTML output

### Sample Code Block:
\`\`\`bash
winget install --id Microsoft.PowerToys -e
\`\`\`

> "Good software gets out of your way and delivers immediate utility."
`);

  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  // High-performance client-side markdown to clean semantic HTML converter
  const cleanHtml = useMemo(() => {
    let raw = markdown;

    // Headings
    raw = raw.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    raw = raw.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    raw = raw.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquote
    raw = raw.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Code blocks
    raw = raw.replace(/```([a-z0-9]*)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>');

    // Inline code
    raw = raw.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Bold & Italic
    raw = raw.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    raw = raw.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Links
    raw = raw.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>');

    // Unordered lists
    raw = raw.replace(/^\- (.*$)/gim, '<li>$1</li>');
    raw = raw.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Paragraphs
    const paras = raw.split(/\n\n+/).map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<pre') || trimmed.startsWith('<block')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).filter(Boolean);

    return paras.join('\n');
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'Does this converter preserve clean semantic HTML tags?',
      a: 'Yes. It produces pure, standard HTML5 markup (`<h1>`, `<h2>`, `<p>`, `<code>`, `<pre>`, `<ul>`, `<li>`, `<blockquote>`) with zero proprietary inline styling or vendor bloat.',
    },
    {
      q: 'Can I paste this HTML directly into WordPress, Webflow, or Notion?',
      a: 'Yes. The output is clean, standard HTML code ready to be pasted into CMS code blocks, email templates, or static web pages.',
    },
    {
      q: 'Is my Markdown document stored on any server?',
      a: 'No. The conversion is calculated 100% on-device in your browser using JavaScript string transformations.',
    },
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Markdown to Clean HTML Converter',
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All',
    'description': 'Real-time Markdown to clean, semantic HTML converter with instant live preview and one-click code copy.',
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
        <span className="text-[#39ff88]">Markdown to HTML Converter</span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0a1424] border border-[#39ff88]/30 text-[#39ff88] text-xs font-mono">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>CONTENT &amp; CODE TOOLS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] tracking-tight">
          Markdown to Clean HTML Converter
        </h1>
        <p className="text-base sm:text-lg text-[#8fa3c0] max-w-2xl leading-relaxed">
          Convert Markdown into clean, semantic HTML in real-time. Live split-screen preview, zero CSS bloat, and one-tap copy.
        </p>
      </header>

      {/* Converter Dual Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Editor Pane */}
        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8fa3c0]">
            <span className="uppercase tracking-wider">Markdown Input</span>
            <span>{markdown.length} chars</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={16}
            className="w-full flex-1 bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-3 text-sm text-[#f2f7ff] font-mono leading-relaxed focus:outline-none focus:border-[#39ff88] resize-none"
            placeholder="Type or paste markdown..."
          />
        </div>

        {/* Output Pane */}
        <div className="bg-[#0a1424] border border-[#8fa3c0]/20 rounded-xl p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[#050a14] p-1 rounded-lg border border-[#8fa3c0]/20 text-xs font-medium">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  activeTab === 'preview' ? 'bg-[#101c33] text-[#39ff88] font-bold' : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rendered</span>
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  activeTab === 'html' ? 'bg-[#101c33] text-[#39ff88] font-bold' : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded bg-[#39ff88] hover:bg-[#1fbf62] text-[#050a14] font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'HTML Copied' : 'Copy HTML'}</span>
            </button>
          </div>

          <div className="flex-1 bg-[#050a14] border border-[#8fa3c0]/30 rounded-lg p-4 min-h-[360px] max-h-[460px] overflow-y-auto">
            {activeTab === 'preview' ? (
              <div
                className="prose prose-invert max-w-none text-sm text-[#d1dced] leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[#f2f7ff] [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#f2f7ff] [&_h3]:text-base [&_h3]:font-semibold [&_pre]:bg-[#0a1424] [&_pre]:p-3 [&_pre]:rounded [&_code]:font-mono [&_code]:text-[#39ff88] [&_blockquote]:border-l-2 [&_blockquote]:border-[#39ff88] [&_blockquote]:pl-3 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-5 space-y-3"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            ) : (
              <pre className="text-xs text-[#39ff88] font-mono whitespace-pre-wrap break-all leading-relaxed">
                {cleanHtml}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <section className="bg-[#0a1424] border border-[#8fa3c0]/15 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#f2f7ff]">Step-by-Step Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 01</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Paste Markdown Text</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Paste standard Markdown, README files, or documentation articles into the left input editor.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 02</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Toggle Live Preview &amp; Code</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Switch between the live visual preview and the raw HTML markup tabs to inspect tag formatting.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-[#39ff88] font-bold">STEP 03</div>
            <h3 className="text-sm font-semibold text-[#f2f7ff]">Copy HTML</h3>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Click Copy HTML to copy clean, semantic code directly to your clipboard for use in blogs, newsletters, or CMS editors.
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
