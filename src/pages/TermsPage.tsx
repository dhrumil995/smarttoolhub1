import React from 'react';
import { FileText, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from '../hooks/useRouter.tsx';

interface TermsPageProps {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ navigate }) => {
  return (
    <article className="py-6 sm:py-12 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#7db8ff] transition-colors focus-ring rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff]">Terms of Service</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
          Simple Legal Terms
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          Terms of Service<span className="text-[#0a84ff]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          Last updated: October 2026. By using SmartToolHub (smarttoolhub.net), you agree to these straightforward terms.
        </p>
      </header>

      {/* Terms Body */}
      <div className="space-y-6 text-sm text-[#8fa3c0] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            1. Use of Free Tools
          </h2>
          <p>
            SmartToolHub provides free web tools to help you create personal automations, draft emails, format text, and calculate everyday metrics. You are free to use the generated output for personal and commercial projects without paying royalties to us.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            2. Fair Use and Acceptable Conduct
          </h2>
          <p>
            You agree to use our tools responsibly. You must not:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Launch automated bot scripts, flood attacks, or denial-of-service traffic against our API endpoints.</li>
            <li>Submit illegal, harassing, infringing, or malicious content.</li>
            <li>Attempt to reverse-engineer server secrets or bypass our rate limits.</li>
          </ul>
        </section>

        <section className="space-y-3 p-5 rounded-2xl bg-[#0a1424] border border-[rgba(255,184,64,0.3)]">
          <div className="flex items-center gap-2 text-[#ffb840] font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>3. AI Output Disclaimer: Verify Important Details</span>
          </div>
          <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
            AI technologies generate responses based on statistical language patterns. While we optimize prompt instructions for precision, AI models can occasionally produce inaccurate formulas, incorrect dates, or invalid software steps.
          </p>
          <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
            All tools and results are provided &ldquo;as is&rdquo; without warranties of any kind. You are responsible for inspecting and verifying all code, formulas, and messages before relying on them for critical personal, financial, legal, or medical matters.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            4. Trademark &amp; Independence Disclaimer
          </h2>
          <p>
            SmartToolHub is an independent utility website operated by Dhrumil Aslaliya. SmartToolHub is not affiliated with, endorsed by, or sponsored by Apple Inc. or Google LLC.
          </p>
          <p>
            Apple, iOS, iPadOS, Siri, and Shortcuts are registered trademarks of Apple Inc. Google, Google Sheets, and Android are registered trademarks of Google LLC. All other product names are trademarks of their respective owners.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            5. Changes to These Terms
          </h2>
          <p>
            We may update these terms occasionally as we introduce new tools. Continued use of SmartToolHub after changes are posted constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            6. Questions and Inquiries
          </h2>
          <p>
            For questions regarding these terms, contact us at{' '}
            <a href="mailto:contact@smarttoolhub.net" className="text-[#0a84ff] hover:underline font-mono">
              contact@smarttoolhub.net
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
};
