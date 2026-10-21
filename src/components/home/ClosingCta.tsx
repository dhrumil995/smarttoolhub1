import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';

interface ClosingCtaProps {
  navigate: (path: string) => void;
}

export const ClosingCta: React.FC<ClosingCtaProps> = ({ navigate }) => {
  return (
    <section className="py-12 sm:py-20 border-t border-[rgba(143,163,192,0.12)]">
      <div className="glass-surface rounded-3xl p-8 sm:p-12 border border-[rgba(139,92,246,0.3)] relative overflow-hidden text-center max-w-4xl mx-auto space-y-6">
        <div className="absolute inset-0 bg-radial from-[rgba(139,92,246,0.12)] to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
          <span>Ready in under 30 seconds</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-[#f2f7ff] max-w-2xl mx-auto">
          Start using free AI tools today<span className="text-[#0a84ff]">.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#8fa3c0] max-w-lg mx-auto leading-relaxed">
          Free AI tools that just work. No sign-up. Results in seconds. Try the Apple Shortcuts Generator or improve a prompt right now.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/tools/apple-shortcuts-generator"
            navigate={navigate}
            className="btn-primary shadow-[0_4px_16px_rgba(11,107,240,0.28)]"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Generate an Apple Shortcut</span>
          </Link>
          <Link
            href="/tools"
            navigate={navigate}
            className="btn-glass"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-4 h-4 text-[#8fa3c0]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
