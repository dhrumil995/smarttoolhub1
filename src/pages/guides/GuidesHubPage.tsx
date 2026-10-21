import React from 'react';
import { BookOpen, ArrowUpRight, ChevronRight, Zap } from 'lucide-react';
import { GUIDE_ARTICLES } from '../../data/guides.ts';
import { Link } from '../../hooks/useRouter.tsx';

interface GuidesHubPageProps {
  navigate: (path: string) => void;
}

export const GuidesHubPage: React.FC<GuidesHubPageProps> = ({ navigate }) => {
  const guides = Object.values(GUIDE_ARTICLES);

  return (
    <div className="py-6 sm:py-12 max-w-4xl mx-auto space-y-8">
      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#0a84ff] transition-colors focus-ring rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff]">Guides</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
          Practical Tutorials
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          How-To Guides<span className="text-[#0a84ff]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] max-w-xl">
          Quick, actionable guides by Dhrumil Aslaliya to help you automate routines, prompt smarter, and save hours every week.
        </p>
      </header>

      {/* Guides List */}
      <div className="space-y-6">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="glass-surface p-6 sm:p-8 rounded-3xl border border-[rgba(143,163,192,0.14)] hover:border-[#0a84ff]/40 transition-colors space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8fa3c0]">
              <span className="font-mono text-[#0a84ff] uppercase">{guide.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>Updated {guide.lastUpdated}</span>
              <span aria-hidden="true">·</span>
              <span>
                By{' '}
                <Link href="/about" navigate={navigate} className="text-[#f2f7ff] hover:underline focus-ring rounded">
                  {guide.author}
                </Link>
              </span>
            </div>

            <h2 className="text-2xl font-bold font-display text-[#f2f7ff]">
              <Link
                href={`/guides/${guide.slug}`}
                navigate={navigate}
                className="hover:text-[#0a84ff] transition-colors focus-ring rounded"
              >
                {guide.title}
              </Link>
            </h2>

            <p className="text-sm sm:text-base text-[#8fa3c0] leading-relaxed">
              {guide.summary}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(143,163,192,0.1)]">
              <Link
                href={`/guides/${guide.slug}`}
                navigate={navigate}
                className="text-xs font-semibold text-[#0a84ff] hover:underline inline-flex items-center gap-1 focus-ring rounded"
              >
                <span>Read full tutorial</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/tools/${guide.relatedToolSlug}`}
                navigate={navigate}
                className="text-xs text-[#8fa3c0] hover:text-[#f2f7ff] inline-flex items-center gap-1.5 focus-ring rounded"
              >
                <Zap className="w-3.5 h-3.5 text-[#0a84ff]" />
                <span>Try the {guide.relatedToolName}</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
