import React from 'react';
import { ShieldCheck, Zap, HeartHandshake, ChevronRight, ArrowRight, User } from 'lucide-react';
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
          Our Mission &amp; Story
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          About SmartToolHub<span className="text-[#0a84ff]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          Free AI tools that just work. No sign-up. Results in seconds. Created by Dhrumil Aslaliya as an independent web utility.
        </p>
      </header>

      {/* Origin Story */}
      <section className="space-y-4 text-base text-[#8fa3c0] leading-relaxed">
        <h2 className="text-2xl font-bold font-display text-[#f2f7ff]">
          Why SmartToolHub was built
        </h2>
        <p>
          Most modern AI websites make simple tasks frustrating. You search for a quick automation, an email rewrite, or a spreadsheet formula, and you are immediately blocked by popups, forced email registrations, credit card forms, and slow interfaces.
        </p>
        <p>
          SmartToolHub was created with one simple standard: you arrive from Google or your phone home screen, enter what you need in plain English, copy your formatted result in under 30 seconds, and go about your day.
        </p>
      </section>

      {/* Creator Profile */}
      <section className="glass-surface p-6 sm:p-7 rounded-3xl border border-[rgba(143,163,192,0.16)] space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0a1424] border border-[rgba(10,132,255,0.3)] flex items-center justify-center text-[#0a84ff]">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-[#f2f7ff]">
              Dhrumil Aslaliya
            </h3>
            <p className="text-xs text-[#8fa3c0] font-mono uppercase tracking-wider">
              Founder &amp; Lead Engineer
            </p>
          </div>
        </div>
        <p className="text-sm text-[#8fa3c0] leading-relaxed">
          Dhrumil is an independent software engineer passionate about clean web design, mobile usability, and making AI utilities fast and accessible to everyone without paywalls or account gates.
        </p>
      </section>

      {/* Four Core Principles */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-display text-[#f2f7ff]">
          Our Core Principles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
            <div className="font-mono text-xs text-[#0a84ff] uppercase">01. Zero Sign-Up</div>
            <div className="font-semibold text-sm text-[#f2f7ff]">No Account Walls</div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              You will never be asked for an email or password to use our tools. Your history is stored locally in your own browser.
            </p>
          </div>

          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
            <div className="font-mono text-xs text-[#0a84ff] uppercase">02. Results in Seconds</div>
            <div className="font-semibold text-sm text-[#f2f7ff]">Sub-30-Second Utility</div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Every page is optimized for rapid mobile entry, quick processing, and instant clipboard copying.
            </p>
          </div>

          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
            <div className="font-mono text-xs text-[#0a84ff] uppercase">03. Real Privacy</div>
            <div className="font-semibold text-sm text-[#f2f7ff]">Ephemeral Processing</div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              Your prompts are sent securely to generate your output and are never saved or stored on our servers.
            </p>
          </div>

          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
            <div className="font-mono text-xs text-[#0a84ff] uppercase">04. Honest Guidance</div>
            <div className="font-semibold text-sm text-[#f2f7ff]">Zero Fake Proof</div>
            <p className="text-xs text-[#8fa3c0] leading-relaxed">
              We never invent testimonials, user counts, or awards. We remind you openly that AI can make mistakes.
            </p>
          </div>
        </div>
      </section>

      {/* Independence Statement Landmark */}
      <section className="p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
        <h3 className="text-base font-bold text-[#f2f7ff]">
          Independent Operation Disclaimer
        </h3>
        <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
          SmartToolHub is an independent website operated by Dhrumil Aslaliya. SmartToolHub is not affiliated with, endorsed by, or sponsored by Apple Inc. or Google LLC. Apple, iOS, iPadOS, and Shortcuts are registered trademarks of Apple Inc.
        </p>
      </section>

      {/* Call to action */}
      <div className="pt-4 flex flex-wrap items-center gap-4">
        <Link href="/tools" navigate={navigate} className="btn-primary text-xs">
          <span>Explore All 8 Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link href="/contact" navigate={navigate} className="btn-glass text-xs">
          <span>Send Feedback</span>
        </Link>
      </div>
    </article>
  );
};
