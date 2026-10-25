import React from 'react';
import { ShieldCheck, Zap, HeartHandshake, ChevronRight, ArrowRight, User, Award, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { Link } from '../hooks/useRouter.tsx';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <article className="py-6 sm:py-12 max-w-3xl mx-auto space-y-10">
      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#7db8ff] transition-colors focus-ring rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff]">About</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
          Our Mission &amp; Editorial Standards
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          About SmartToolHub<span className="text-[#0a84ff]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          Free online utilities, hardware diagnostics, and AI productivity tools that just work. No sign-up. Results in seconds. Created and maintained independently by Dhrumil Aslaliya.
        </p>
      </header>

      {/* Creator Profile */}
      <section className="glass-surface p-6 sm:p-8 rounded-3xl border border-[rgba(143,163,192,0.16)] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0a1424] border border-[rgba(10,132,255,0.35)] flex items-center justify-center text-[#0a84ff] shadow-[0_0_16px_rgba(10,132,255,0.25)] shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#7db8ff] font-semibold">
              Independent Creator &amp; Maintainer
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff]">
              Dhrumil Aslaliya
            </h2>
            <p className="text-xs text-[#8fa3c0] mt-0.5">
              Software Engineer &bull; Open-Source &amp; AI Utility Builder
            </p>
          </div>
        </div>
        <p className="text-sm text-[#8fa3c0] leading-relaxed">
          SmartToolHub was founded by Dhrumil Aslaliya to fix a pervasive frustration with modern online utilities: bloated pages covered in misleading download buttons, mandatory email registration walls, slow multi-step signups, and synthetic &ldquo;AI magic&rdquo; hype.
        </p>
        <p className="text-sm text-[#8fa3c0] leading-relaxed">
          Dhrumil designs, codes, tests, and maintains every tool and guide on this platform, upholding a strict rule: <strong>every tool must deliver high-speed, practical utility in under 30 seconds with zero friction.</strong>
        </p>
      </section>

      {/* Origin Story */}
      <section className="space-y-4 text-base text-[#8fa3c0] leading-relaxed">
        <h2 className="text-2xl font-bold font-display text-[#f2f7ff]">
          Why SmartToolHub exists
        </h2>
        <p>
          Need to generate an Apple Shortcut recipe for your iPhone? Need to translate a messy plain-English question into a complex Excel <code className="text-[#ffb840] bg-[#0a1424] px-1.5 py-0.5 rounded text-xs">=SUMIFS</code> or <code className="text-[#ffb840] bg-[#0a1424] px-1.5 py-0.5 rounded text-xs">XLOOKUP</code> formula? Need to calculate whether your laptop battery needs replacement based on factory milliamp-hour design specs?
        </p>
        <p>
          On most commercial utility websites, you are forced to create an account, verify an email, agree to marketing newsletters, or install bundled toolbars.
        </p>
        <p>
          SmartToolHub replaces that broken model. You arrive directly from a search query or your mobile home screen, enter your prompt or numbers, get a verified, structured result in seconds, copy it to your clipboard with a single tap, and continue your day.
        </p>
      </section>

      {/* Editorial Standards & Software Directory Curation */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#34e0a1] font-semibold">
            Honest &amp; Independent
          </div>
          <h2 className="text-2xl font-bold font-display text-[#f2f7ff]">
            Our Editorial Standards &amp; Review Policy
          </h2>
        </div>
        <p className="text-sm text-[#8fa3c0] leading-relaxed">
          In addition to web tools, SmartToolHub features an in-depth directory of 50 open-source and power utilities across PC (Windows), Apple (macOS), and Android. To protect our users&apos; trust, our reviews follow four uncompromising criteria:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#34e0a1] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#34e0a1]" />
              <span>Tested on Real Hardware</span>
            </div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Every software recommendation is physically tested on actual desktop and mobile test hardware (Windows 11, macOS Sequoia, Android 14/15) to verify genuine performance.
            </p>
          </div>

          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#34e0a1] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#34e0a1]" />
              <span>Mandatory Drawbacks</span>
            </div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              No software is perfect. Every single review in our directory lists at least two genuine drawbacks or limitations so you know the trade-offs before installing.
            </p>
          </div>

          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#34e0a1] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#34e0a1]" />
              <span>Zero Sponsored Rankings</span>
            </div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              We never accept paid placements, sponsored reviews, or compensation to alter review scores. Open-source, privacy-first tools receive our top priority.
            </p>
          </div>

          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#34e0a1] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#34e0a1]" />
              <span>Verified Package Commands</span>
            </div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              We provide verified one-line package manager installation commands (<code className="text-[#7db8ff] bg-[#0a1424] px-1 py-0.5 rounded text-[11px]">winget</code>, <code className="text-[#7db8ff] bg-[#0a1424] px-1 py-0.5 rounded text-[11px]">brew</code>) pointing strictly to official upstream manifests.
            </p>
          </div>
        </div>
      </section>

      {/* AI Transparency & Philosophy */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#ffb840] font-semibold">
            Responsible AI Usage
          </div>
          <h2 className="text-2xl font-bold font-display text-[#f2f7ff]">
            How We Use Artificial Intelligence
          </h2>
        </div>
        <p className="text-sm text-[#8fa3c0] leading-relaxed">
          We use state-of-the-art language models (Google Gemini API) to power generation tasks such as structuring shortcuts, formatting emails, summarizing documents, and translating formulas. However:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#8fa3c0]">
          <li><strong>Zero Synthetic Testimonials:</strong> We never generate fake user reviews, artificial social proof ratings, or fabricated testimonials.</li>
          <li><strong>Transparent Warnings:</strong> Every AI tool displays an honest disclaimer reminding users that AI models can make mistakes and that output should be reviewed before production use.</li>
          <li><strong>Human Oversight on Guides:</strong> All how-to guides and software reviews are authored and verified by human hands.</li>
        </ul>
      </section>

      {/* Independent Operation Disclaimer Callout */}
      <section className="p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
        <h3 className="text-base font-bold text-[#f2f7ff]">
          Independent Operation Disclaimer
        </h3>
        <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
          SmartToolHub is an independent utility website operated by Dhrumil Aslaliya. SmartToolHub is not affiliated with, endorsed by, sponsored by, or associated with Apple Inc., Google LLC, or Microsoft Corporation. Apple, iPhone, iPad, iOS, macOS, iPadOS, Siri, and Shortcuts are registered trademarks of Apple Inc. Google, Android, and Google Sheets are registered trademarks of Google LLC.
        </p>
      </section>

      {/* Call to action */}
      <div className="pt-2 flex flex-wrap items-center gap-4">
        <Link href="/tools" navigate={navigate} className="btn-primary text-xs">
          <span>Explore Free Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link href="/pc-tools" navigate={navigate} className="btn-glass text-xs">
          <span>Browse Software Directory</span>
        </Link>
        <Link href="/contact" navigate={navigate} className="btn-glass text-xs">
          <span>Contact Dhrumil</span>
        </Link>
      </div>
    </article>
  );
};
