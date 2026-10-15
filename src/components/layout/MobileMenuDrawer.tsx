import React, { useEffect } from 'react';
import { X, ChevronRight, Zap, Shield, FileText, Mail, Info, Tag } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';

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
  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLinkClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 md:hidden flex flex-col bg-[#050a14]/95 backdrop-blur-[24px]"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-[rgba(143,163,192,0.16)] safe-top">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0a1424] border border-[rgba(57,255,136,0.3)] flex items-center justify-center text-[#39ff88]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-display text-lg text-[#f2f7ff]">
            SmartToolHub<span className="text-[#39ff88]">.</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] text-[#8fa3c0] hover:text-[#f2f7ff] flex items-center justify-center focus-laser"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sheet Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 safe-bottom">
        {/* Primary Sections */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleLinkClick('/tools')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0a1424]/60 border border-[rgba(143,163,192,0.12)] text-left hover:bg-[#101c33] transition-colors focus-laser"
          >
            <div>
              <div className="font-semibold text-base text-[#f2f7ff]">All AI Tools</div>
              <div className="text-xs text-[#8fa3c0] mt-0.5">8 free tools ready in seconds</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8fa3c0]" />
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('/guides')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0a1424]/60 border border-[rgba(143,163,192,0.12)] text-left hover:bg-[#101c33] transition-colors focus-laser"
          >
            <div>
              <div className="font-semibold text-base text-[#f2f7ff]">How-To Guides</div>
              <div className="text-xs text-[#8fa3c0] mt-0.5">Practical automation tutorials</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8fa3c0]" />
          </button>
        </div>

        {/* Secondary Links */}
        <div className="space-y-1 border-t border-[rgba(143,163,192,0.12)] pt-4">
          <button
            type="button"
            onClick={() => handleLinkClick('/pricing')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#8fa3c0] hover:text-[#f2f7ff] rounded-xl focus-laser"
          >
            <Tag className="w-4 h-4 text-[#39ff88]" />
            <span>Pricing &amp; Pro Access</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/about')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#8fa3c0] hover:text-[#f2f7ff] rounded-xl focus-laser"
          >
            <Info className="w-4 h-4 text-[#8fa3c0]" />
            <span>About SmartToolHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/contact')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#8fa3c0] hover:text-[#f2f7ff] rounded-xl focus-laser"
          >
            <Mail className="w-4 h-4 text-[#8fa3c0]" />
            <span>Contact &amp; Feedback</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/privacy')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#8fa3c0] hover:text-[#f2f7ff] rounded-xl focus-laser"
          >
            <Shield className="w-4 h-4 text-[#8fa3c0]" />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/terms')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#8fa3c0] hover:text-[#f2f7ff] rounded-xl focus-laser"
          >
            <FileText className="w-4 h-4 text-[#8fa3c0]" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Pro Banner */}
        <div className="p-4 rounded-2xl bg-[#0a1424] border border-[rgba(57,255,136,0.25)] space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#39ff88]">Optional Upgrade</span>
          </div>
          <p className="text-xs text-[#8fa3c0] leading-relaxed">
            Need higher daily limits and zero ads? Get SmartToolHub Pro.
          </p>
          <button
            type="button"
            onClick={() => handleLinkClick('/pricing')}
            className="w-full btn-laser text-sm"
          >
            View Pro Plan
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-[#8fa3c0]/80 pt-2">
          Independent AI tool directory. Not affiliated with Apple or Google.
        </div>
      </div>
    </div>
  );
};
