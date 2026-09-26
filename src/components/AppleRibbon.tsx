import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { PageId } from '../types';
import { haptics } from '../utils/haptics';

interface AppleRibbonProps {
  onNavigate: (page: PageId) => void;
}

export const AppleRibbon: React.FC<AppleRibbonProps> = ({ onNavigate }) => {
  return (
    <aside 
      aria-label="Platform Announcement" 
      className="w-full bg-[#EAEAEF] dark:bg-[#121214] border-b border-black/[0.06] dark:border-white/[0.08] text-[11px] sm:text-[12px] text-[#86868B] py-1.5 sm:py-2 px-3 sm:px-4 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-center">
        {/* Mobile compact announcement */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px]">
          <Sparkles className="w-3 h-3 text-[#0A84FF] shrink-0" />
          <span className="font-medium text-neutral-900 dark:text-neutral-200">macOS 15 & iOS 18 Ready</span>
          <span className="text-[#86868B]">·</span>
          <button
            onClick={() => {
              haptics.playTap();
              onNavigate('compatibility');
            }}
            className="text-[#0A84FF] hover:underline font-medium inline-flex items-center gap-0.5 active:opacity-70"
          >
            <span>Compatibility</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Desktop / Tablet announcement */}
        <div className="hidden sm:flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0A84FF] shrink-0" />
          <span className="font-medium text-neutral-900 dark:text-white">Updated for macOS Sequoia 15 & iOS 18</span>
          <span className="text-[#86868B]">·</span>
          <button
            onClick={() => {
              haptics.playTap();
              onNavigate('compatibility');
            }}
            className="inline-flex items-center gap-0.5 text-[#0A84FF] hover:underline font-medium transition-colors cursor-pointer group"
          >
            <span>Compatibility Matrix</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
};
