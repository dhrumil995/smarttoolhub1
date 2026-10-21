import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

/**
 * Scroll to Top Floating Button conforming to Phase 3:
 * - Appears after 800px of scroll
 * - Sits safely above the mobile tab bar (bottom-20) and desktop footer
 * - ArrowUp icon, 44x44px minimum tap target
 * - Accessible aria-label
 */
export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 800,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      className={`fixed z-30 bottom-20 md:bottom-8 right-4 md:right-8 w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#0a1424]/90 backdrop-blur-[16px] border border-[rgba(10,132,255,0.35)] text-[#0a84ff] hover:bg-[#0a84ff] hover:text-white shadow-[0_4px_24px_rgba(10,132,255,0.25)] flex items-center justify-center transition-all duration-200 focus-ring animate-in fade-in zoom-in-90 ${className}`}
    >
      <ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
    </button>
  );
};
