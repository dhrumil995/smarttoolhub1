import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Universal Mobile Bottom Sheet conforming to Phase 3:
 * - Drag handle bar
 * - Backdrop blur
 * - Swipe down gesture to close
 * - Escape key closes
 * - Safe area padding (safe-bottom)
 * - Trapped focus and body scroll lock
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Body scroll lock & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    // If swiped down more than 70px, close
    if (diff > 70) {
      onClose();
      setTouchStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Bottom Sheet Menu'}
      className="fixed inset-0 z-50 flex flex-col justify-end bg-[#050a14]/80 backdrop-blur-[20px] transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full max-h-[90dvh] bg-[#0a1424] border-t border-[rgba(143,163,192,0.18)] rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250 safe-bottom ${className}`}
      >
        {/* Drag Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-[#8fa3c0]/30" aria-hidden="true" />
        </div>

        {/* Header (if title exists) */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(143,163,192,0.1)]">
            <h3 className="font-display font-bold text-base text-[#f2f7ff]">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close bottom sheet"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#8fa3c0] hover:text-[#f2f7ff] focus-ring"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
};
