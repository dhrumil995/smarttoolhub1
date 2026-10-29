import React from 'react';
import { ChevronRight, Shield, FileText, Mail, Info, Tag, LayoutGrid, BookOpen, Laptop, Smartphone, Apple, Sparkles, Terminal, FileCode } from 'lucide-react';
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
    <BottomSheet isOpen={isOpen} onClose={onClose} title="SmartToolHub Navigation">
      <div className="space-y-5">
        {/* PWA Home Screen Install Banner */}
        <PWAInstallButton variant="drawer" />

        {/* Primary Sections */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleLinkClick('/tools')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-left hover:border-purple-600 transition-colors focus-ring touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                <LayoutGrid size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">All Tools Library</div>
                <div className="text-[11px] text-gray-500">{LAUNCH_TOOLS.length} verified free tools</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('/tools?deal=true')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-left hover:border-purple-600 transition-colors focus-ring touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Tag size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">Deals &amp; 100% Free Tools</div>
                <div className="text-[11px] text-gray-500">Zero subscription fees</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('/guides')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-left hover:border-purple-600 transition-colors focus-ring touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                <BookOpen size={18} aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">How-To Guides</div>
                <div className="text-[11px] text-gray-500">Practical workflows &amp; tutorials</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" aria-hidden="true" />
          </button>
        </div>

        {/* Curated Software Categories */}
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-bold px-1">
            Browse By Category
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleLinkClick('/tools?category=apple')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium"
            >
              <Apple className="w-4 h-4 text-purple-700" />
              <span>Apple &amp; iOS</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/tools?category=developer')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium"
            >
              <Terminal className="w-4 h-4 text-purple-700" />
              <span>Developer</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/tools?category=ai')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium"
            >
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>AI Writing</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/tools?category=files')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium"
            >
              <FileCode className="w-4 h-4 text-purple-700" />
              <span>Files &amp; PDF</span>
            </button>
          </div>
        </div>

        {/* Legal & About Links */}
        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleLinkClick('/about')}
            className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-900"
          >
            <Info size={14} />
            <span>About Us</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/privacy')}
            className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-900"
          >
            <Shield size={14} />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/contact')}
            className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-900"
          >
            <Mail size={14} />
            <span>Contact &amp; Suggest</span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('/terms')}
            className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-900"
          >
            <FileText size={14} />
            <span>Terms of Use</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
