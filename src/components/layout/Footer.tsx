import React from 'react';
import { Zap, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="w-full bg-[#050a14] border-t border-[rgba(143,163,192,0.14)] mt-20 pb-24 md:pb-12 text-[#8fa3c0]">
      <div className="max-w-[1200px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Value Col */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              navigate={navigate}
              className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#f2f7ff] focus-laser rounded-lg p-1 -ml-1"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0a1424] border border-[rgba(57,255,136,0.3)] flex items-center justify-center text-[#39ff88]">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-display text-lg text-[#f2f7ff]">
                SmartToolHub<span className="text-[#39ff88]">.</span>
              </span>
            </Link>
            <p className="text-sm text-[#8fa3c0] max-w-sm leading-relaxed">
              Free AI tools that just work. No sign-up. Results in seconds. Designed for everyday phone and desktop utility.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8fa3c0]">
              <ShieldCheck className="w-4 h-4 text-[#39ff88]" />
              <span>Independent &amp; privacy-respecting</span>
            </div>
          </div>

          {/* Quick Tools Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#f2f7ff] mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tools/apple-shortcuts-generator"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  Apple Shortcuts
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ai-prompt-improver"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  Prompt Improver
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ai-email-writer"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  Email Writer
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/formula-helper"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  Excel &amp; Sheets Helper
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  navigate={navigate}
                  className="text-[#39ff88] hover:underline transition-colors focus-laser rounded font-medium"
                >
                  View all 8 tools &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#f2f7ff] mb-3">
              Site &amp; Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/guides"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  How-To Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  About the Site
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  Pro &amp; Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Independent Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-[rgba(143,163,192,0.1)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8fa3c0]/90">
          <p>
            &copy; {new Date().getFullYear()} SmartToolHub (smarttoolhub.net). All rights reserved.
          </p>
          <p className="text-center md:text-right text-[#8fa3c0]/75">
            SmartToolHub is an independent utility website and is not affiliated with, endorsed by, or sponsored by Apple Inc. or Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};
