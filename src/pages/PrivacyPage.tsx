import React from 'react';
import { Shield, ChevronRight, Lock, EyeOff, Server, HardDrive, Cookie, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from '../hooks/useRouter.tsx';

interface PrivacyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ navigate }) => {
  return (
    <article className="py-6 sm:py-12 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#7db8ff] transition-colors focus-ring rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff]">Privacy Policy</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
          Plain English Privacy
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          Privacy Policy<span className="text-[#0a84ff]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          Last updated: October 24, 2026. At SmartToolHub (smarttoolhub.net), we believe online tools should deliver immediate value without requiring your personal identity or tracking your activity across the internet.
        </p>
      </header>

      {/* Key Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
          <EyeOff className="w-5 h-5 text-[#0a84ff]" />
          <div className="font-semibold text-sm text-[#f2f7ff]">No Accounts or Logins</div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            You do not need an account, password, credit card, or email address to use any tool on SmartToolHub.
          </p>
        </div>

        <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
          <Server className="w-5 h-5 text-[#0a84ff]" />
          <div className="font-semibold text-sm text-[#f2f7ff]">Ephemeral In-Flight Processing</div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            Text you submit to AI tools is processed in real time over HTTPS and is never stored, indexed, or saved to a database.
          </p>
        </div>

        <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
          <HardDrive className="w-5 h-5 text-[#0a84ff]" />
          <div className="font-semibold text-sm text-[#f2f7ff]">100% Local Device Storage</div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            Your recent results and favorites stay strictly in your browser’s localStorage. We cannot see them, and you can erase them with one click.
          </p>
        </div>

        <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-2">
          <Lock className="w-5 h-5 text-[#0a84ff]" />
          <div className="font-semibold text-sm text-[#f2f7ff]">Zero Data Broker Sharing</div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            We do not sell personal data, do not build user tracking profiles, and do not use browser fingerprinting scripts.
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-8 text-sm text-[#8fa3c0] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            1. Who Operates This Website
          </h2>
          <p>
            SmartToolHub (<code className="text-[#7db8ff] bg-[#0a1424] px-1.5 py-0.5 rounded text-xs">smarttoolhub.net</code>) is an independent web application created and maintained by <strong>Dhrumil Aslaliya</strong>. For all privacy inquiries, data questions, or feedback, you can reach out directly via email at{' '}
            <a href="mailto:contact@smarttoolhub.net" className="text-[#0a84ff] hover:underline font-mono">
              contact@smarttoolhub.net
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            2. The Information We Process
          </h2>
          <p>
            Because SmartToolHub does not feature user registrations, we do not collect personal identifiers such as names, phone numbers, passwords, physical addresses, or social media handles.
          </p>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#f2f7ff]">A. Client-Side Tools (100% On-Device)</h3>
            <p className="text-xs sm:text-sm">
              Many tools on our website—including the Battery Wear Calculator, Retina Image Size Calculator, Charging Time Forecaster, Storage Planner, CIDR Subnet Calculator, JSON Formatter, Base64 Encoder, Password Generator, and Word Counter—execute entirely within your browser&apos;s JavaScript engine. When you interact with these tools, your inputs never leave your computer or smartphone.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#f2f7ff]">B. AI-Powered Generation Tools</h3>
            <p className="text-xs sm:text-sm">
              For tools that require language generation (such as the Apple Shortcuts Generator, AI Email Writer, AI Prompt Improver, Formula Helper, and AI Summarizer), the text you input is securely transmitted over encrypted Transport Layer Security (TLS/HTTPS) to our backend server and passed to the Google Gemini API solely to generate your result.
            </p>
            <p className="text-xs sm:text-sm">
              <strong>We do not save your prompts or outputs on our servers.</strong> Once the response is sent back to your browser, it is immediately discarded from memory. Your prompts are not used to train custom commercial machine learning models.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#f2f7ff]">C. Standard Server Connection Logs</h3>
            <p className="text-xs sm:text-sm">
              Like virtually all web servers, our hosting infrastructure automatically logs standard technical request metadata (such as IP address, browser user-agent header, referring URL, and timestamp). These logs are used exclusively for security monitoring, DDoS mitigation, rate-limiting abuse prevention, and infrastructure debugging. They are never linked to personal profiles.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            3. Local Storage and Saved Results
          </h2>
          <p>
            To let you quickly view previous tool outputs, copy them again, or bookmark your favorite tools, SmartToolHub utilizes standard browser <code className="text-[#7db8ff] bg-[#0a1424] px-1.5 py-0.5 rounded text-xs">localStorage</code>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>This information is stored physically on your own device only.</li>
            <li>SmartToolHub cannot access, read, or sync your saved items to remote servers.</li>
            <li>You can clear all saved items at any moment by navigating to the <strong>Saved</strong> page and clicking <strong>Clear All History</strong>, or by clearing website data in your browser settings.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            4. Cookies and Advertising
          </h2>
          <p>
            SmartToolHub is provided free of charge without paywalls or subscriptions. To cover hosting and maintenance costs, we display standard display advertisements served by verified advertising partners, such as Google AdSense.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Google and other third-party vendors use cookies to serve ads based on prior visits to this website or other websites on the internet.</li>
            <li>You may opt out of personalized advertising by visiting Google&apos;s <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#0a84ff] hover:underline">Ads Settings</a> or by visiting <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#0a84ff] hover:underline">aboutads.info</a>.</li>
            <li>We do not employ invasive canvas fingerprinting, cross-site tracking scripts, or data-broker trackers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            5. External Links &amp; Open-Source Software
          </h2>
          <p>
            Our Software Directory links to reputable official developer websites, GitHub repositories, Homebrew packages, Winget packages, and F-Droid repositories. Once you follow an external link, you are subject to the privacy practices of that third-party website. We encourage you to review their respective privacy policies before downloading software.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            6. Your Data Rights (GDPR &amp; CCPA Compliance)
          </h2>
          <p>
            Under privacy regulations including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Right to Know &amp; Access:</strong> You have the right to know what personal data is collected. Because we do not store personal profiles or accounts, we hold no user database records.</li>
            <li><strong>Right to Delete:</strong> You can purge all client-side data stored on your device at any time using our built-in Clear History controls.</li>
            <li><strong>Right to Opt Out of Sale:</strong> We do not sell, rent, or trade your personal information to anyone.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            7. Children’s Privacy (COPPA)
          </h2>
          <p>
            SmartToolHub is a general audience website intended for productivity and everyday utility. We do not knowingly collect or solicit any personal information from children under the age of 13. If you believe a child has provided us with personal information, please contact us immediately for prompt deletion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-display text-[#f2f7ff]">
            8. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time as new tools or features are introduced. Any revisions will be published on this page with an updated &ldquo;Last updated&rdquo; timestamp.
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[#f2f7ff]">
            <CheckCircle2 className="w-4 h-4 text-[#34e0a1]" />
            <span>Questions or Privacy Concerns?</span>
          </div>
          <p className="text-xs sm:text-sm text-[#8fa3c0]">
            If you have questions about how SmartToolHub handles privacy or need clarification on any point above, please write to us at{' '}
            <a href="mailto:contact@smarttoolhub.net" className="text-[#0a84ff] hover:underline font-mono">
              contact@smarttoolhub.net
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
};
