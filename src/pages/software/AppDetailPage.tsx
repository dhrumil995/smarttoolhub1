import React, { useState, useMemo } from 'react';
import { ExternalLink, Copy, Check, ArrowLeft, ShieldAlert, AlertTriangle, ArrowRight, Terminal, Info, ShieldCheck, CheckCircle2, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs.tsx';
import { SOFTWARE_APPS, DirectoryApp } from '../../data/softwareDirectory.ts';
import { COMPARISONS } from '../../data/comparisons.ts';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { saveToolResult } from '../../utils/storage.ts';

interface AppDetailPageProps {
  platform: 'apple' | 'android' | 'pc';
  slug: string;
  navigate: (path: string) => void;
}

export const AppDetailPage: React.FC<AppDetailPageProps> = ({ platform, slug, navigate }) => {
  const app: DirectoryApp | undefined = SOFTWARE_APPS[slug];
  const [copiedCommand, setCopiedCommand] = useState<boolean>(false);
  const [isSilentMode, setIsSilentMode] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Find if this application is featured in an objective head-to-head comparison
  const matchingComparison = useMemo(() => {
    if (!app) return null;
    return Object.values(COMPARISONS).find(
      (c) =>
        c.optionAPermalink.endsWith(`/${app.slug}`) ||
        c.optionBPermalink.endsWith(`/${app.slug}`)
    );
  }, [app]);

  if (!app) {
    return (
      <div className="min-h-screen bg-[#050a14] text-[#f2f7ff] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Application Not Found</h1>
        <p className="text-sm text-[#9aaccb]">The requested software profile does not exist or has been moved.</p>
        <button
          type="button"
          onClick={() => navigate(`/${platform}-tools`)}
          className="px-4 py-2 rounded-xl bg-[#0a84ff] text-white font-medium text-xs hover:brightness-110"
        >
          Return to Software Directory
        </button>
      </div>
    );
  }

  const platformHubSlug = `${platform}-tools`;
  const platformHubTitle =
    platform === 'apple' ? 'Apple Tools' : platform === 'android' ? 'Android Tools' : 'PC Tools';

  const baseInstallCommand = app.wingetId
    ? isSilentMode
      ? `winget install --id ${app.wingetId} -e --silent --accept-source-agreements --accept-package-agreements`
      : `winget install --id ${app.wingetId} -e`
    : app.brewName
    ? `brew install --cask ${app.brewName}`
    : null;

  const handleCopyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch {
      // Handled
    }
  };

  const handleSaveToToolkit = () => {
    const summary = `${app.name} (${app.platformLabel})\nCategory: ${app.category}\n${app.tagline}\nInstall: ${baseInstallCommand || app.officialUrl || 'Direct'}`;
    saveToolResult(app.slug, app.name, 'Software Profile Bookmark', summary);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Structured Data: BreadcrumbList + SoftwareApplication (WITHOUT fake ratings)
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
        name: platformHubTitle,
        item: `https://smarttoolhub.net/${platformHubSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: app.name,
        item: `https://smarttoolhub.net/${platformHubSlug}/${app.slug}`,
      },
    ],
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: app.category,
    operatingSystem: app.platformLabel,
    description: app.tagline,
    url: `https://smarttoolhub.net/${platformHubSlug}/${app.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  const relatedSiteTools = LAUNCH_TOOLS.filter((t) => app.relatedToolSlugs.includes(t.slug));

  return (
    <div className="min-h-screen bg-[#050a14] text-[#f2f7ff] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: platformHubTitle, href: `/${platformHubSlug}` },
            { label: app.name },
          ]}
          navigate={navigate}
        />

        {/* Header Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#101c33] text-[#6c7dff] uppercase font-bold">
                  {app.platformLabel}
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-[#101c33] text-[#9aaccb] uppercase font-semibold">
                  {app.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f2f7ff]">
                {app.name}
              </h1>
              <p className="text-sm sm:text-base text-[#9aaccb] leading-relaxed pt-1">
                {app.tagline}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleSaveToToolkit}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.2)] text-xs font-semibold text-[#f2f7ff] hover:border-[#0a84ff] transition-all focus-ring"
                title="Save application bookmark to your local toolkit"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#34e0a1]" />
                    <span className="text-[#34e0a1]">Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-[#9aaccb]" />
                    <span>Save to Toolkit</span>
                  </>
                )}
              </button>

              {app.officialUrl && (
                <a
                  href={app.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a84ff] text-white text-xs font-semibold hover:brightness-110 transition-all shadow-md focus-ring"
                >
                  <span>Official Project Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Install Command Bar */}
          {baseInstallCommand && (
            <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.16)] space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase text-[#6c7dff] font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>One-Line Terminal Install Command</span>
                </span>
                <div className="flex items-center gap-2">
                  {app.wingetId && (
                    <label className="flex items-center gap-1.5 text-[11px] font-mono text-[#9aaccb] cursor-pointer hover:text-[#f2f7ff]">
                      <input
                        type="checkbox"
                        checked={isSilentMode}
                        onChange={(e) => setIsSilentMode(e.target.checked)}
                        className="rounded border-[rgba(143,163,192,0.3)] bg-[#101c33] text-[#0a84ff]"
                      />
                      <span>Silent / Unattended</span>
                    </label>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(baseInstallCommand)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#101c33] border border-[rgba(108,125,255,0.3)] text-xs font-semibold text-[#f2f7ff] hover:border-[#6c7dff] transition-all focus-ring"
                  >
                    {copiedCommand ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#34e0a1]" />
                        <span className="text-[#34e0a1]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#101c33] font-mono text-xs sm:text-sm text-[#f2f7ff] overflow-x-auto whitespace-nowrap select-all">
                {baseInstallCommand}
              </div>
              <p className="text-[11px] font-mono text-[#9aaccb]">
                Read it before you run it. Installs directly via the official package manager repository.
              </p>
            </div>
          )}

          {/* Matching Head-to-Head Comparison Callout */}
          {matchingComparison && (
            <div
              onClick={() => navigate(`/compare/${matchingComparison.slug}`)}
              className="p-4 rounded-2xl bg-[#0d182b] border border-[rgba(108,125,255,0.35)] hover:border-[#6c7dff] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#101c33] border border-[rgba(108,125,255,0.4)] flex items-center justify-center text-[#6c7dff] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6c7dff] font-bold block">
                    Head-to-Head Benchmark Available
                  </span>
                  <div className="text-sm font-bold text-[#f2f7ff] group-hover:text-[#6c7dff] transition-colors">
                    {matchingComparison.optionAName} vs {matchingComparison.optionBName}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-[#6c7dff] flex items-center gap-1 shrink-0">
                <span>View Full Comparison</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          )}

          {/* Mandatory Transparency Notice */}
          <div className="p-3.5 rounded-xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] flex items-start gap-2.5 text-xs text-[#9aaccb]">
            <ShieldCheck className="w-4 h-4 text-[#34e0a1] shrink-0 mt-0.5" />
            <span>
              <strong>Editorial Disclaimer: </strong>Based on the official documentation and the developer's description. Versions and features can change. We do not host downloads or claim hands-on testing unless explicitly stated.
            </span>
          </div>
        </div>

        {/* Quick Highlights: Who It's For & Try This First */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
            <span className="text-xs font-mono uppercase text-[#34e0a1] font-bold block">
              Who It's For
            </span>
            <p className="text-xs sm:text-sm text-[#f2f7ff] leading-relaxed">
              {app.whoItsFor}
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
            <span className="text-xs font-mono uppercase text-[#ffb840] font-bold block">
              Try This First Tip
            </span>
            <p className="text-xs sm:text-sm text-[#f2f7ff] leading-relaxed">
              {app.tryThisFirst}
            </p>
          </div>
        </div>

        {/* Full In-Depth Review (350+ words original text) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#f2f7ff]">
            What {app.name} Does in Plain Words
          </h2>
          <div className="text-sm sm:text-base text-[#9aaccb] leading-relaxed space-y-4">
            {app.fullReview.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Two Honest Drawbacks */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(255,92,122,0.2)] space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ff5c7a]" />
            <h2 className="text-base sm:text-lg font-bold text-[#f2f7ff]">
              Two Honest Drawbacks to Consider
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(255,92,122,0.15)] space-y-1">
              <span className="text-xs font-mono uppercase text-[#ff5c7a] font-bold">1. Limitation</span>
              <p className="text-xs text-[#f2f7ff] leading-relaxed">
                {app.drawbacks[0]}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(255,92,122,0.15)] space-y-1">
              <span className="text-xs font-mono uppercase text-[#ff5c7a] font-bold">2. Limitation</span>
              <p className="text-xs text-[#f2f7ff] leading-relaxed">
                {app.drawbacks[1]}
              </p>
            </div>
          </div>
        </div>

        {/* Alternatives to Try */}
        {app.alternatives.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#f2f7ff]">
              Alternatives Worth Exploring
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {app.alternatives.map((alt) => (
                <div
                  key={alt.name}
                  onClick={() => navigate(alt.href)}
                  className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] hover:border-[#0a84ff] cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <h3 className="text-xs font-bold text-[#f2f7ff] group-hover:text-[#0a84ff] transition-colors">
                      {alt.name}
                    </h3>
                    <p className="text-[11px] text-[#9aaccb] mt-1 leading-relaxed">
                      {alt.note}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#0a84ff] flex items-center gap-1">
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matching SmartToolHub Tools */}
        {relatedSiteTools.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#f2f7ff]">
              Related Online Calculators &amp; Utilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedSiteTools.map((t) => (
                <div
                  key={t.slug}
                  onClick={() => navigate(`/tools/${t.slug}`)}
                  className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] hover:border-[#34e0a1] cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <h3 className="text-xs font-bold text-[#f2f7ff] group-hover:text-[#34e0a1] transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-[#9aaccb] line-clamp-2 mt-1">
                      {t.description}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#34e0a1] flex items-center gap-1">
                    <span>Open Free Tool</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
