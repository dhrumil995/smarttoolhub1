import React from 'react';
import { Shield, ChevronRight, Lock, EyeOff, Server, HardDrive } from 'lucide-react';
import { Link } from '../hooks/useRouter.tsx';

interface PrivacyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ navigate }) => {
  return (
    <article className="py-6 sm:py-12 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#39ff88] transition-colors focus-laser rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff]">Privacy Policy</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#39ff88]">
          Plain English Privacy
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          Privacy Policy<span className="text-[#39ff88]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          Last updated: October 2026. We believe tools should be useful without tracking you across the web.
        </p>
      </header>

      {/* Key Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
          <EyeOff className="w-5 h-5 text-[#39ff88]" />
          <div className="font-semibold text-sm text-[#f2f7ff]">No Accounts or Logins</div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            You do not need to provide your name, phone number, or email address to use any of our free tools.
          </p>
        </div>

        <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
          <Server className="w-5 h-5 text-[#39ff88]" />
          <div className="font-semibold text-sm text-[#f2f7ff]">Ephemeral Processing</div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            Text you enter is sent securely to the AI API over HTTPS strictly to generate your answer. We do not store or sell your prompts.
          </p>
        </div>

        <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
          <HardDrive className="w-5 h-5 text-[#39ff88]" />
          <div className="font-semibold text-sm text-[#f2f7ff]">Local Device Storage</div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            Your recent tool history and saved snippets stay on your own phone or computer in browser localStorage. You can clear it anytime.
          </p>
        </div>

        <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
          <Lock className="w-5 h-5 text-[#39ff88]" />
          <div className="font-semibold text-sm text-[#f2f7ff]">No Invasive Tracking</div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            We do not use fingerprinting or sell personal tracking profiles to data brokers.
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-6 text-sm text-[#8fa3c0] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            1. Information We Collect
          </h2>
          <p>
            When you browse SmartToolHub (smarttoolhub.net), your browser transmits standard technical connection data (such as your IP address, browser type, and timestamp) required to safely deliver web pages and prevent denial-of-service abuse.
          </p>
          <p>
            We do not require user accounts. We never ask for your home address, social media credentials, or financial accounts to access our free utility tools.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            2. How We Handle Prompt Text
          </h2>
          <p>
            When you submit text to a tool (for example, asking for an Apple Shortcut, email rewrite, or formula), that text is relayed securely to the underlying AI model service over encrypted TLS/HTTPS connections solely to generate your response.
          </p>
          <p>
            SmartToolHub does not save your prompts to any database, does not build profiles from your text, and does not sell your submissions to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            3. Local Storage on Your Device
          </h2>
          <p>
            To provide a convenient experience where you can revisit previously generated results, we save your recent output in your browser&apos;s localStorage. This data stays entirely on your physical device. It is never transmitted back to our servers and can be wiped instantly by clicking &ldquo;Clear History&rdquo; on the Saved page.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            4. Advertising &amp; Third-Party Services
          </h2>
          <p>
            To keep SmartToolHub free for everyone without paid subscriptions, we may display a small number of standard advertisements served by verified ad networks. These networks may use non-personalized cookies to measure ad performance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            5. Contact Us Regarding Privacy
          </h2>
          <p>
            If you have questions about our privacy standards, you can contact Dhrumil directly at{' '}
            <a href="mailto:contact@smarttoolhub.net" className="text-[#39ff88] hover:underline font-mono">
              contact@smarttoolhub.net
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
};
