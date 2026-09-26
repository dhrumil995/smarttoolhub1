import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { haptics } from '../../utils/haptics';

export interface IOSBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const IOSBottomSheet: React.FC<IOSBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxHeight = 'max-h-[85vh]',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300"
    >
      {/* Glassmorphic Backdrop Blur */}
      <div
        onClick={() => {
          haptics.playTap();
          onClose();
        }}
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      {/* iOS Sheet Container with Rounded Top Corners & Grab Handle */}
      <div
        className={`relative w-full sm:max-w-lg bg-[#FFFFFF] dark:bg-[#1C1C1E] border-t sm:border border-black/[0.08] dark:border-white/[0.12] rounded-t-[28px] sm:rounded-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.25),0_20px_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden flex flex-col ${maxHeight} animate-in slide-in-from-bottom duration-300 ease-out`}
        style={{
          paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 1.25rem))',
        }}
      >
        {/* iOS Grab Handle Bar */}
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-9 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600 cursor-grab active:cursor-grabbing" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between shrink-0">
          <div>
            {title && (
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-[#F5F5F7]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[#86868B] mt-0.5 leading-snug">{description}</p>
            )}
          </div>

          <button
            onClick={() => {
              haptics.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-neutral-200/80 dark:bg-white/[0.12] hover:bg-neutral-300 dark:hover:bg-white/[0.20] text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Close sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sheet Content Body with Momentum Scroll */}
        <div className="p-5 overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
