import React from 'react';
import { ArrowDown, Zap } from 'lucide-react';
import { LiveMiniTool } from './LiveMiniTool.tsx';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  return (
    <section className="relative pt-6 sm:pt-12 pb-16 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Headlines & Primary CTA (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
            <span className="w-2 h-2 rounded-full bg-[#0a84ff]" />
            <span>Fast · Free · No Account Required</span>
          </div>

          <h1 className="h1-fluid font-display text-[#f2f7ff]">
            Free AI tools that just work<span className="text-[#0a84ff]">.</span>
          </h1>

          <p className="body-fluid text-[#8fa3c0] max-w-xl leading-relaxed">
            No sign-up. Results in seconds. Designed for everyday phone and desktop use with zero friction.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onExploreClick}
              className="btn-primary shadow-[0_4px_16px_rgba(11,107,240,0.28)]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Browse All Tools</span>
            </button>
            <a
              href="#tools-grid"
              className="btn-glass text-sm"
            >
              <span>See Flagship Generator</span>
              <ArrowDown className="w-4 h-4 text-[#8fa3c0]" />
            </a>
          </div>

          {/* Value Props Strip */}
          <div className="pt-4 grid grid-cols-3 gap-3 max-w-md text-xs border-t border-[rgba(143,163,192,0.14)]">
            <div>
              <div className="font-mono text-sm font-bold text-[#f2f7ff]">30s</div>
              <div className="text-[#8fa3c0] text-[11px] mt-0.5">Average task time</div>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-[#f2f7ff]">0</div>
              <div className="text-[#8fa3c0] text-[11px] mt-0.5">Logins or passwords</div>
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-[#0a84ff]">100%</div>
              <div className="text-[#8fa3c0] text-[11px] mt-0.5">Free forever tools</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Mini-Tool Demo (5 cols on lg) */}
        <div className="lg:col-span-5 w-full">
          <LiveMiniTool />
        </div>
      </div>
    </section>
  );
};
