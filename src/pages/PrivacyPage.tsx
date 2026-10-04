import React from 'react';
import { PageId } from '../types';
import { ShieldCheck, Lock, Eye, Server, HardDrive, CheckCircle2, Cookie, ExternalLink } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (page: PageId) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparency & AdSense Privacy Charter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Last Updated: October 2026 • Compliant with Google AdSense Policies, GDPR & CCPA
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <Lock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Zero Credentials</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            We never request, collect, or store your Apple ID, passwords, or device security keys.
          </p>
        </div>
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <Cookie className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Cookie Choice</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Transparent disclosure of Google AdSense advertising cookies and easy opt-out mechanisms.
          </p>
        </div>
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <HardDrive className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Client-Side Tools</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Your images, text inputs, and ROI calculations are processed locally inside your browser.
          </p>
        </div>
      </div>

      {/* Detailed Legal & AdSense Compliance Clauses */}
      <div className="ios-card-static p-6 sm:p-8 space-y-8 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Overview & Publisher Identity
          </h2>
          <p>
            SmartToolHub ("we", "us", or "our"), accessible at <strong>smarttoolhub.net</strong>, is committed to safeguarding the privacy of our visitors. This Privacy Policy outlines the types of information collected, recorded, and used when accessing our technical automation library, engineering guides, and client-side utility workbenches.
          </p>
        </section>

        {/* Mandatory Google AdSense Section */}
        <section className="space-y-3 p-4 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>2. Google AdSense & Third-Party Advertising Cookies</span>
          </h2>
          <p>
            We use <strong>Google AdSense</strong> to serve advertisements on our website. As part of Google's advertising network, we comply with the Google AdSense program policies:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600 dark:text-zinc-300">
            <li>
              <strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to SmartToolHub or other websites.
            </li>
            <li>
              <strong>Advertising Cookies (DoubleClick DART Cookie):</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to SmartToolHub and/or other sites on the Internet.
            </li>
            <li>
              <strong>User Opt-Out:</strong> Users may opt out of personalized advertising by visiting Google's official Ads Settings at{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noreferrer noopener"
                className="text-indigo-600 dark:text-indigo-400 underline font-semibold inline-flex items-center gap-0.5"
              >
                <span>Google Ads Settings</span>
                <ExternalLink className="w-3 h-3" />
              </a>.
            </li>
            <li>
              Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{' '}
              <a 
                href="http://www.aboutads.info/choices/" 
                target="_blank" 
                rel="noreferrer noopener"
                className="text-indigo-600 dark:text-indigo-400 underline font-semibold inline-flex items-center gap-0.5"
              >
                <span>www.aboutads.info</span>
                <ExternalLink className="w-3 h-3" />
              </a>{' '}
              or the Network Advertising Initiative at{' '}
              <a 
                href="https://optout.networkadvertising.org/" 
                target="_blank" 
                rel="noreferrer noopener"
                className="text-indigo-600 dark:text-indigo-400 underline font-semibold inline-flex items-center gap-0.5"
              >
                <span>networkadvertising.org</span>
                <ExternalLink className="w-3 h-3" />
              </a>.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. The Zero-Credentials Guarantee
          </h2>
          <p>
            Under no circumstances does SmartToolHub prompt you for your Apple ID, iCloud password, macOS Keychain credentials, two-factor authentication codes, or Wi-Fi security keys. All Continuity and multi-device automation workflows described on this site operate exclusively over Apple's native, peer-to-peer, encrypted Wi-Fi and Bluetooth channels directly between your own physical devices.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. Log Files & Server Metrics
          </h2>
          <p>
            Like most standard website servers, SmartToolHub utilizes standard server log files. The information inside log files includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks. This data is not linked to any personally identifiable information and is used solely for analyzing trends, administering the site, tracking aggregate user movements, and gathering demographic information to ensure service availability and security.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            5. Browser LocalStorage Usage
          </h2>
          <p>
            SmartToolHub uses standard browser <code>localStorage</code> strictly for non-sensitive user experience preferences:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-zinc-400">
            <li>Saving your bookmarked workflows locally on your device</li>
            <li>Remembering completed steps in the interactive diagnostic checklists</li>
            <li>Storing your theme preference (Dark or Light mode)</li>
          </ul>
          <p className="pt-1">
            You can purge this data at any moment by clearing your browser's site cookies and local storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            6. GDPR & CCPA Privacy Rights
          </h2>
          <p>
            Under General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you are entitled to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-zinc-400">
            <li>The right to know what personal data is collected and request its deletion.</li>
            <li>The right to opt-out of the sale of personal information (SmartToolHub does NOT sell personal information).</li>
            <li>The right to non-discrimination for exercising your privacy rights.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            7. Contacting Our Data Protection Officer
          </h2>
          <p>
            If you have questions, feedback, or requests regarding this Privacy Policy or your data rights, please contact our team directly at:
          </p>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-xs space-y-1">
            <div><strong>Publisher:</strong> SmartToolHub Systems Engineering Publication</div>
            <div><strong>Email:</strong> <a href="mailto:contact@smarttoolhub.net" className="text-indigo-600 dark:text-indigo-400 font-mono">contact@smarttoolhub.net</a> / <a href="mailto:aslaliyamohit9@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-mono">aslaliyamohit9@gmail.com</a></div>
            <div><strong>Location:</strong> Surat, Gujarat, India</div>
          </div>
        </section>

      </div>
    </div>
  );
};
