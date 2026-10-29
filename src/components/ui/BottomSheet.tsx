import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

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
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full max-h-[90dvh] bg-white border-t border-gray-200 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250 safe-bottom ${className}`}
      >
        {/* Drag Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-gray-300" aria-hidden="true" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h3 className="font-bold text-base text-gray-900">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close bottom sheet"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus-ring"
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
