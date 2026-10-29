import React from 'react';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { ToolFinderLogo } from './ToolFinderLogo.tsx';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-16 pb-24 md:pb-12 text-gray-500 text-xs">
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Value Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              navigate={navigate}
              className="inline-block focus-ring rounded-lg p-1 -ml-1"
            >
              <ToolFinderLogo size="md" showSubtitle />
            </Link>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
              Every tool in our library is verified for immediate execution. No sign-up, zero paywalls, results in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Independent &amp; privacy-respecting client utilities</span>
            </div>
          </div>

          {/* Popular Tools Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-gray-900 mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/tools/apple-shortcuts-generator"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Apple Shortcuts Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/ai-prompt-improver"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  AI Prompt Improver
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/formula-helper"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Excel &amp; Sheets Formulas
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/pdf-merge"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Client-Side PDF Merge
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/natural-rewrite"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Natural AI Humanizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-gray-900 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/tools?category=apple"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Apple &amp; iOS Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/tools?category=developer"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Developer &amp; CLI
                </Link>
              </li>
              <li>
                <Link
                  href="/tools?category=files"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Files &amp; Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/tools?category=ai"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  AI Writing &amp; Work
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Guides &amp; Workflows
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-gray-900 mb-3">
              Information
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/about"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  About the Project
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Free Tier &amp; Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  navigate={navigate}
                  className="hover:text-purple-700 transition-colors focus-ring rounded"
                >
                  Contact &amp; Suggest Tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} SmartToolHub. Independent software directory by Dhrumil Aslaliya.
          </p>
          <p className="text-center md:text-right text-gray-400">
            Independent utility index. Not affiliated with Apple Inc., Google LLC, or Microsoft Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
};
