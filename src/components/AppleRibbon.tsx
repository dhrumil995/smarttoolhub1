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
      className="w-full bg-[#0E0F12] border-b border-white/[0.08] text-[12px] text-[#A1A1A6] py-2 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-white font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#2997FF]" />
          <span>macOS Sequoia 15.4 & iOS 18.4 Engine:</span>
        </span>
        <span className="text-[#86868B]">
          Verified for M4 Max, M3, and iPhone 16 Pro hardware mesh.
        </span>
        <button
          onClick={() => {
            haptics.playTap();
            onNavigate('compatibility');
          }}
          className="inline-flex items-center gap-0.5 text-[#2997FF] hover:text-[#68B4FF] font-medium transition-colors cursor-pointer group ml-1"
        >
          <span>Explore Compatibility Matrix</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
};
