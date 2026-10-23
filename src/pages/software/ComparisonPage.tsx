import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, HelpCircle, Info, ShieldAlert, Sparkles, Trophy, ExternalLink, ChevronDown } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs.tsx';
import { COMPARISONS, ComparisonData } from '../../data/comparisons.ts';
import { LAUNCH_TOOLS } from '../../data/tools.ts';

interface ComparisonPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ slug, navigate }) => {
  const comparison: ComparisonData | undefined = COMPARISONS[slug];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!comparison) {
    return (
      <div className="min-h-screen bg-[#050a14] text-[#f2f7ff] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Comparison Not Found</h1>
        <p className="text-sm text-[#9aaccb]">The requested comparison guide does not exist.</p>
        <button
          type="button"
          onClick={() => navigate('/pc-tools')}
          className="px-4 py-2 rounded-xl bg-[#0a84ff] text-white font-medium text-xs hover:brightness-110"
        >
          View Software Directory
        </button>
      </div>
    );
  }

  const matchingTool = LAUNCH_TOOLS.find((t) => t.slug === comparison.matchingToolSlug);

  // Structured Data: BreadcrumbList + FAQPage
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
        name: 'Software Comparisons',
        item: 'https://smarttoolhub.net/pc-tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${comparison.optionAName} vs ${comparison.optionBName}`,
        item: `https://smarttoolhub.net/compare/${comparison.slug}`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: comparison.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-[#f2f7ff] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Comparisons' },
            { label: `${comparison.optionAName} vs ${comparison.optionBName}` },
          ]}
          navigate={navigate}
        />

        {/* Hero Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6c7dff] font-bold">
            Objective Head-to-Head Comparison
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff] leading-tight">
            {comparison.title}
          </h1>
          <p className="text-sm sm:text-base text-[#9aaccb] leading-relaxed max-w-3xl">
            {comparison.subtitle}
          </p>
        </div>

        {/* Apple Official Tools Notice (Requirement for 3uTools vs iMazing) */}
        {comparison.appleOfficialNote && (
          <div className="p-5 sm:p-6 rounded-3xl bg-[#101c33] border border-[rgba(10,132,255,0.3)] space-y-2 text-xs sm:text-sm text-[#f2f7ff] leading-relaxed">
            <div className="flex items-center gap-2 text-[#0a84ff] font-bold font-mono uppercase text-xs">
              <Info className="w-4 h-4" />
              <span>Apple Official Backup Tools First</span>
            </div>
            <p>{comparison.appleOfficialNote}</p>
          </div>
        )}

        {/* "Pick This If" Recommendation Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A */}
          <div className="p-6 rounded-3xl bg-[#0a1424] border border-[rgba(10,132,255,0.25)] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#0a84ff] font-bold">
                  Recommendation
                </span>
                <span className="text-xs font-mono text-[#9aaccb]">Option A</span>
              </div>
              <h3 className="text-xl font-bold text-[#f2f7ff]">
                Pick {comparison.optionAName} If:
              </h3>
              <ul className="space-y-2.5">
                {comparison.optionAPickIf.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#9aaccb] leading-relaxed">
                    <Check className="w-4 h-4 text-[#0a84ff] shrink-0 mt-0.5" />
                    <span className="text-[#f2f7ff]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => navigate(comparison.optionAPermalink)}
              className="mt-4 px-4 py-2.5 rounded-xl bg-[#101c33] border border-[rgba(10,132,255,0.3)] text-xs font-semibold text-[#0a84ff] hover:bg-[#0a84ff] hover:text-white transition-all text-center focus-ring"
            >
              Read {comparison.optionAName} Profile &rarr;
            </button>
          </div>

          {/* Option B */}
          <div className="p-6 rounded-3xl bg-[#0a1424] border border-[rgba(52,224,161,0.25)] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#34e0a1] font-bold">
                  Recommendation
                </span>
                <span className="text-xs font-mono text-[#9aaccb]">Option B</span>
              </div>
              <h3 className="text-xl font-bold text-[#f2f7ff]">
                Pick {comparison.optionBName} If:
              </h3>
              <ul className="space-y-2.5">
                {comparison.optionBPickIf.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#9aaccb] leading-relaxed">
                    <Check className="w-4 h-4 text-[#34e0a1] shrink-0 mt-0.5" />
                    <span className="text-[#f2f7ff]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => navigate(comparison.optionBPermalink)}
              className="mt-4 px-4 py-2.5 rounded-xl bg-[#101c33] border border-[rgba(52,224,161,0.3)] text-xs font-semibold text-[#34e0a1] hover:bg-[#34e0a1] hover:text-[#050a14] transition-all text-center focus-ring"
            >
              Read {comparison.optionBName} Profile &rarr;
            </button>
          </div>
        </div>

        {/* Feature Comparison Table (Scrolls horizontally inside container on mobile) */}
        <div className="p-5 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold">
              Feature-by-Feature Comparison Matrix
            </span>
            <span className="text-[11px] font-mono text-[#9aaccb] sm:hidden">
              Swipe horizontally &rarr;
            </span>
          </div>

          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-[rgba(143,163,192,0.16)] text-xs font-mono text-[#9aaccb]">
                  <th className="py-3 px-3 font-semibold w-1/3">Key Feature</th>
                  <th className="py-3 px-3 font-semibold w-1/3 text-[#0a84ff]">{comparison.optionAName}</th>
                  <th className="py-3 px-3 font-semibold w-1/3 text-[#34e0a1]">{comparison.optionBName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(143,163,192,0.1)] text-xs">
                {comparison.comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#101c33]/40 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-[#f2f7ff]">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-3 text-[#9aaccb] leading-relaxed">
                      {row.optionA}
                    </td>
                    <td className="py-3.5 px-3 text-[#9aaccb] leading-relaxed">
                      {row.optionB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verdict Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffb840]" />
            <h2 className="text-lg font-bold text-[#f2f7ff]">
              Our Final Editorial Verdict
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#9aaccb] leading-relaxed">
            {comparison.verdictSummary}
          </p>
        </div>

        {/* Link to Matching Tool */}
        {matchingTool && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(52,224,161,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#34e0a1] font-bold">
                Companion Online Calculator
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#f2f7ff]">
                Try our free {matchingTool.name}
              </h3>
              <p className="text-xs text-[#9aaccb]">
                {matchingTool.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/tools/${matchingTool.slug}`)}
              className="px-5 py-2.5 rounded-xl bg-[#34e0a1] text-[#050a14] font-bold text-xs hover:brightness-110 transition-all shrink-0 focus-ring"
            >
              Open Free Tool &rarr;
            </button>
          </div>
        )}

        {/* FAQ Section */}
        {comparison.faqs.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#6c7dff]" />
              <h2 className="text-lg font-bold text-[#f2f7ff]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2">
              {comparison.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-[#f2f7ff] hover:text-[#0a84ff] transition-colors focus-ring"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#9aaccb] transition-transform duration-200 shrink-0 ml-2 ${
                          isOpen ? 'rotate-180 text-[#0a84ff]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-[#9aaccb] leading-relaxed border-t border-[rgba(143,163,192,0.08)]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
