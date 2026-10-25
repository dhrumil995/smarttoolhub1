import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronRight, ArrowLeft, ArrowUpRight, Zap, CheckCircle2, Copy, Check, Terminal, FileDown, Printer, Bookmark, BookmarkCheck } from 'lucide-react';
import { GUIDE_ARTICLES } from '../../data/guides.ts';
import { Link } from '../../hooks/useRouter.tsx';
import { saveToolResult } from '../../utils/storage.ts';

interface GuideDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ slug, navigate }) => {
  const guide = GUIDE_ARTICLES[slug];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Markdown export generation for developers and offline notes
  const guideMarkdown = useMemo(() => {
    if (!guide) return '';
    const bodyText = guide.sections
      .map(
        (s) =>
          `## ${s.heading}\n\n` +
          s.body.join('\n\n') +
          (s.callout ? `\n\n> **Tip:** ${s.callout}` : '')
      )
      .join('\n\n');

    return `# ${guide.title}\n\n*${guide.summary}*\n\n**Author:** ${guide.author} | **Updated:** ${guide.lastUpdated}\n\n---\n\n${bodyText}\n\n---\n*Source: SmartToolHub (https://smarttoolhub.net/guides/${guide.slug})*`;
  }, [guide]);

  if (!guide) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold font-display text-[#f2f7ff]">Guide Not Found</h1>
        <p className="text-sm text-[#8fa3c0]">The requested tutorial could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/guides')}
          className="btn-primary text-xs"
        >
          Back to all guides
        </button>
      </div>
    );
  }

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Handled
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(guideMarkdown);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch {
      // Handled
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBookmarkGuide = () => {
    saveToolResult(
      `guide-${guide.slug}`,
      guide.title,
      'Technical Guide Bookmark',
      `Guide: ${guide.title}\nSummary: ${guide.summary}\nURL: https://smarttoolhub.net/guides/${guide.slug}`
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Structured Data: BreadcrumbList + TechArticle
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://smarttoolhub.net/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: 'https://smarttoolhub.net/guides',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.title,
        item: `https://smarttoolhub.net/guides/${guide.slug}`,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.summary,
    author: {
      '@type': 'Person',
      name: guide.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SmartToolHub',
      url: 'https://smarttoolhub.net/',
    },
    url: `https://smarttoolhub.net/guides/${guide.slug}`,
  };

  const isCodeLine = (text: string) => {
    const trimmed = text.trim();
    return (
      trimmed.startsWith('winget ') ||
      trimmed.startsWith('brew ') ||
      trimmed.startsWith('smartctl ') ||
      trimmed.startsWith('scrcpy ') ||
      trimmed.startsWith('pkg ') ||
      trimmed.startsWith('::') ||
      trimmed.startsWith('#b::') ||
      trimmed.startsWith('^!t::') ||
      trimmed.startsWith('=XLOOKUP') ||
      trimmed.startsWith('=SUMIFS')
    );
  };

  return (
    <article className="py-6 sm:py-10 max-w-3xl mx-auto space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#0a84ff] transition-colors focus-ring rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <Link href="/guides" navigate={navigate} className="hover:text-[#0a84ff] transition-colors focus-ring rounded">
          Guides
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff] truncate">{guide.title}</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-4 border-b border-[rgba(143,163,192,0.14)] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8fa3c0]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[#0a84ff] uppercase font-bold">{guide.readTime}</span>
            <span aria-hidden="true">&bull;</span>
            <span>Updated {guide.lastUpdated}</span>
            <span aria-hidden="true">&bull;</span>
            <span>
              By{' '}
              <Link href="/about" navigate={navigate} className="text-[#f2f7ff] hover:underline focus-ring rounded font-medium">
                {guide.author}
              </Link>
            </span>
          </div>

          {/* Quick Reader Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleBookmarkGuide}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-[11px] font-mono text-[#9aaccb] hover:text-[#f2f7ff] hover:border-[#0a84ff] transition-all focus-ring"
              title="Bookmark guide to your saved results"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#34e0a1]" />
                  <span className="text-[#34e0a1]">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Bookmark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-[11px] font-mono text-[#9aaccb] hover:text-[#f2f7ff] hover:border-[#0a84ff] transition-all focus-ring"
              title="Copy entire guide in GitHub-Flavored Markdown"
            >
              {copiedMarkdown ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                  <span className="text-[#34e0a1]">Copied MD</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-[11px] font-mono text-[#9aaccb] hover:text-[#f2f7ff] hover:border-[#0a84ff] transition-all focus-ring"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          {guide.title}
        </h1>

        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          {guide.summary}
        </p>

        {/* Callout Link to matching tool */}
        <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(10,132,255,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#101c33] flex items-center justify-center text-[#0a84ff] shrink-0">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#f2f7ff]">Try the {guide.relatedToolName}</div>
              <div className="text-xs text-[#8fa3c0]">Generate your result automatically with free AI</div>
            </div>
          </div>
          <Link
            href={`/tools/${guide.relatedToolSlug}`}
            navigate={navigate}
            className="btn-primary h-10 text-xs px-4 self-start sm:self-auto shrink-0"
          >
            <span>Open Tool</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Guide Body Content */}
      <div className="space-y-8 text-base text-[#8fa3c0] leading-relaxed">
        {guide.sections.map((section, idx) => (
          <section key={idx} className="space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff]">
              {section.heading}
            </h2>
            {section.body.map((p, pIdx) => {
              const itemKey = `sec-${idx}-p-${pIdx}`;
              if (isCodeLine(p)) {
                return (
                  <div
                    key={pIdx}
                    className="p-3.5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex items-center justify-between gap-3 font-mono text-xs sm:text-sm text-[#f2f7ff]"
                  >
                    <div className="flex items-center gap-2 overflow-x-auto select-all">
                      <Terminal className="w-3.5 h-3.5 text-[#34e0a1] shrink-0" />
                      <code>{p}</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(p, itemKey)}
                      className="px-2.5 py-1 rounded-lg bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-[11px] font-mono text-[#9aaccb] hover:text-[#f2f7ff] hover:border-[#0a84ff] transition-all shrink-0 flex items-center gap-1 focus-ring"
                      title="Copy snippet"
                    >
                      {copiedKey === itemKey ? (
                        <>
                          <Check className="w-3 h-3 text-[#34e0a1]" />
                          <span className="text-[#34e0a1]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              }
              return (
                <p key={pIdx} className="leading-relaxed">
                  {p}
                </p>
              );
            })}
            {section.callout && (
              <div className="p-4 rounded-2xl bg-[#101c33]/70 border border-[rgba(143,163,192,0.16)] text-sm text-[#f2f7ff] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0a84ff] shrink-0 mt-0.5" />
                <span>{section.callout}</span>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-[rgba(143,163,192,0.14)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/guides"
          navigate={navigate}
          className="btn-glass text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Guides</span>
        </Link>

        <Link
          href={`/tools/${guide.relatedToolSlug}`}
          navigate={navigate}
          className="btn-primary text-xs inline-flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Launch {guide.relatedToolName}</span>
        </Link>
      </div>
    </article>
  );
};
