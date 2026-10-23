import React from 'react';
import { ChevronRight, Shield, FileText, Mail, Info, Tag, LayoutGrid, BookOpen, Laptop, Smartphone, Apple } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { BottomSheet } from '../ui/BottomSheet.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  const handleLinkClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Navigation & More">
      <div className="space-y-6">
        {/* PWA Home Screen Install Banner */}
        <PWAInstallButton variant="drawer" />

        {/* Primary Sections */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleLinkClick('/tools')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.14)] text-left hover:border-[#0a84ff] transition-colors focus-ring"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0a1424] border border-[rgba(10,132,255,0.35)] flex items-center justify-center text-[#0a84ff]">
                <LayoutGrid size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#f2f7ff]">All AI Tools</div>
                <div className="text-[11px] text-[#9aaccb]">{LAUNCH_TOOLS.length} free browser tools</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#9aaccb]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('/guides')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.14)] text-left hover:border-[#5aa9ff] transition-colors focus-ring"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0a1424] border border-[rgba(90,169,255,0.3)] flex items-center justify-center text-[#5aa9ff]">
                <BookOpen size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#f2f7ff]">How-To Guides</div>
                <div className="text-[11px] text-[#9aaccb]">Practical workflows & tutorials</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#9aaccb]" aria-hidden="true" />
          </button>
        </div>

        {/* Curated Software Directories (50 Apps) */}
        <div className="space-y-2 border-t border-[rgba(143,163,192,0.1)] pt-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9aaccb] font-semibold px-1">
            Software Directories (50 Apps)
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleLinkClick('/pc-tools')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-left hover:border-[#0a84ff] transition-colors focus-ring"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0a1424] border border-[rgba(10,132,255,0.35)] flex items-center justify-center text-[#0a84ff]">
                  <Laptop size={15} />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#f2f7ff]">PC & Windows Tools</div>
                  <div className="text-[10px] text-[#9aaccb]">20 apps • winget verified</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#9aaccb]" />
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/apple-tools')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-left hover:border-[#8b5cf6] transition-colors focus-ring"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0a1424] border border-[rgba(139,92,246,0.35)] flex items-center justify-center text-[#8b5cf6]">
                  <Apple size={15} />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#f2f7ff]">Apple & Mac Tools</div>
                  <div className="text-[10px] text-[#9aaccb]">10 apps • brew cask verified</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#9aaccb]" />
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/android-tools')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#050a14] border border-[rgba(143,163,192,0.12)] text-left hover:border-[#34e0a1] transition-colors focus-ring"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0a1424] border border-[rgba(52,224,161,0.35)] flex items-center justify-center text-[#34e0a1]">
                  <Smartphone size={15} />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#f2f7ff]">Android Power Tools</div>
                  <div className="text-[10px] text-[#9aaccb]">20 apps • F-Droid & Shizuku</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#9aaccb]" />
            </button>
          </div>
        </div>

        {/* Secondary Links */}
        <div className="space-y-1 border-t border-[rgba(143,163,192,0.1)] pt-4">
          <button
            type="button"
            onClick={() => handleLinkClick('/pricing')}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#9aaccb] hover:text-[#f2f7ff] rounded-xl focus-ring"
          >
            <Tag size={16} className="text-[#ffb840]" aria-hidden="true" />
            <span>Pricing &amp; Pro Access</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/about')}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#9aaccb] hover:text-[#f2f7ff] rounded-xl focus-ring"
          >
            <Info size={16} className="text-[#9aaccb]" aria-hidden="true" />
            <span>About SmartToolHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/contact')}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#9aaccb] hover:text-[#f2f7ff] rounded-xl focus-ring"
          >
            <Mail size={16} className="text-[#9aaccb]" aria-hidden="true" />
            <span>Contact &amp; Feedback</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/privacy')}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#9aaccb] hover:text-[#f2f7ff] rounded-xl focus-ring"
          >
            <Shield size={16} className="text-[#9aaccb]" aria-hidden="true" />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/terms')}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#9aaccb] hover:text-[#f2f7ff] rounded-xl focus-ring"
          >
            <FileText size={16} className="text-[#9aaccb]" aria-hidden="true" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Pro Plan Banner */}
        <div className="p-4 rounded-2xl bg-[#050a14] border border-[rgba(10,132,255,0.3)] space-y-2.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#5aa9ff] font-semibold">
            Optional Upgrade
          </span>
          <p className="text-xs text-[#9aaccb] leading-relaxed">
            Need unlimited daily usage and zero ads? Upgrade to SmartToolHub Pro.
          </p>
          <button
            type="button"
            onClick={() => handleLinkClick('/pricing')}
            className="w-full btn-primary text-xs font-bold py-2.5"
          >
            View Pro Plan
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-[#8fa3c0]/70 pt-2 pb-4">
          Independent AI tool directory. Not affiliated with Apple or Google.
        </div>
      </div>
    </BottomSheet>
  );
};
