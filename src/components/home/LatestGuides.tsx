import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface LatestGuidesProps {
  navigate: (path: string) => void;
}

export const LatestGuides: React.FC<LatestGuidesProps> = ({ navigate }) => {
  return (
    <section className="py-12 sm:py-16 border-t border-[rgba(143,163,192,0.12)]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#39ff88] mb-2">
            Learning &amp; Tips
          </div>
          <h2 className="h2-fluid font-display text-[#f2f7ff]">
            Latest guides.
          </h2>
          <p className="text-sm text-[#8fa3c0] mt-1">
            Short, practical walkthroughs by Dhrumil Aslaliya to help you automate everyday tasks.
          </p>
        </div>
        <Link
          href="/guides"
          navigate={navigate}
          className="text-xs font-mono uppercase tracking-wider text-[#39ff88] hover:underline focus-laser rounded py-1 inline-flex items-center gap-1"
        >
          <span>All guides</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {POPULAR_GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            navigate={navigate}
            className="glass-surface p-6 rounded-3xl flex flex-col justify-between group interactive-hover border border-[rgba(143,163,192,0.14)] focus-laser"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
                <span>By Dhrumil Aslaliya</span>
                <span aria-hidden="true">·</span>
                <span>{guide.readTime}</span>
              </div>
              <h3 className="text-lg font-bold font-display text-[#f2f7ff] group-hover:text-[#39ff88] transition-colors">
                {guide.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed line-clamp-3">
                {guide.summary}
              </p>
            </div>

            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-[#39ff88]">
              <span>Read guide</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
