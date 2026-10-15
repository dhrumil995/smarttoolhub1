import React from 'react';
import { BookOpen, ChevronRight, ArrowLeft, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';
import { GUIDE_ARTICLES } from '../../data/guides.ts';
import { Link } from '../../hooks/useRouter.tsx';

interface GuideDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ slug, navigate }) => {
  const guide = GUIDE_ARTICLES[slug];

  if (!guide) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold font-display text-[#f2f7ff]">Guide Not Found</h1>
        <p className="text-sm text-[#8fa3c0]">The requested tutorial could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/guides')}
          className="btn-laser text-xs"
        >
          Back to all guides
        </button>
      </div>
    );
  }

  return (
    <article className="py-6 sm:py-10 max-w-3xl mx-auto space-y-10">
      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#39ff88] transition-colors focus-laser rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <Link href="/guides" navigate={navigate} className="hover:text-[#39ff88] transition-colors focus-laser rounded">
          Guides
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff] truncate">{guide.title}</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-4 border-b border-[rgba(143,163,192,0.14)] pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8fa3c0]">
          <span className="font-mono text-[#39ff88] uppercase">{guide.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>Updated {guide.lastUpdated}</span>
          <span aria-hidden="true">·</span>
          <span>
            By{' '}
            <Link href="/about" navigate={navigate} className="text-[#f2f7ff] hover:underline focus-laser rounded font-medium">
              {guide.author}
            </Link>
          </span>
        </div>

        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          {guide.title}
        </h1>

        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          {guide.summary}
        </p>

        {/* Callout Link to matching tool */}
        <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(57,255,136,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#101c33] flex items-center justify-center text-[#39ff88] shrink-0">
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
            className="btn-laser h-10 text-xs px-4 self-start sm:self-auto shrink-0"
          >
            <span>Open Tool</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Guide Body Content */}
      <div className="space-y-8 text-base text-[#8fa3c0] leading-relaxed">
        {guide.sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff]">
              {section.heading}
            </h2>
            {section.body.map((p, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {p}
              </p>
            ))}
            {section.callout && (
              <div className="p-4 rounded-2xl bg-[#101c33]/70 border border-[rgba(143,163,192,0.16)] text-sm text-[#f2f7ff] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#39ff88] shrink-0 mt-0.5" />
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
          className="btn-laser text-xs inline-flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Launch {guide.relatedToolName}</span>
        </Link>
      </div>
    </article>
  );
};
