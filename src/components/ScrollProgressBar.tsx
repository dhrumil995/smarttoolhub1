import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface ScrollProgressBarProps {
  /** Optional context label (e.g., workflow title or troubleshooting guide name) */
  label?: string;
  /** Optional secondary status text (e.g., "3 of 5 steps completed" or "Diagnostic Guide") */
  sublabel?: string;
  /** Dependency key that resets or recalculates scroll progress when switching guides/workflows */
  contentKey?: string;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  label,
  sublabel,
  contentKey,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState<number>(0);
  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(false);
  const [isScrollable, setIsScrollable] = useState<boolean>(true);

  useEffect(() => {
    let ticking = false;
    let lastPercent = -1;
    let lastScrolledDown = false;

    const calculate = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (docHeight <= 32) {
        setIsScrollable(false);
        if (lastPercent !== 0) {
          lastPercent = 0;
          setPercent(0);
        }
        if (lastScrolledDown) {
          lastScrolledDown = false;
          setIsScrolledDown(false);
        }
        ticking = false;
        return;
      }

      setIsScrollable(true);
      const rawRatio = Math.min(1, Math.max(0, scrollTop / docHeight));
      const newPercent = Math.round(rawRatio * 100);
      const newScrolledDown = scrollTop > 180;

      if (newPercent !== lastPercent) {
        lastPercent = newPercent;
        setPercent(newPercent);
      }
      if (newScrolledDown !== lastScrolledDown) {
        lastScrolledDown = newScrolledDown;
        setIsScrolledDown(newScrolledDown);
      }
      ticking = false;
    };

    const updateScrollMetrics = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(calculate);
      }
    };

    updateScrollMetrics();

    window.addEventListener('scroll', updateScrollMetrics, { passive: true });
    window.addEventListener('resize', updateScrollMetrics, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateScrollMetrics);
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', updateScrollMetrics);
      window.removeEventListener('resize', updateScrollMetrics);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [contentKey]);

  const handleScrollToTop = () => {
    haptics.playTap();
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (!isScrollable) {
    return null;
  }

  return (
    <>
      {/* Top-of-Viewport Hairline Progress Track (GPU-Composited scaleX) */}
      <div
        role="progressbar"
        aria-label={label ? `Reading progress for ${label}` : 'Page reading progress'}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-0 left-0 right-0 z-[60] h-[2.5px] bg-slate-900/5 dark:bg-white/[0.04] pointer-events-none no-print overflow-hidden"
      >
        <motion.div
          style={{
            scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
          }}
          className="h-full w-full origin-left will-change-transform bg-gradient-to-r from-indigo-500 via-violet-400 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.75)]"
        />
      </div>

      {/* Subtle Floating Orientation Pill when Scrolled into Long-Form Content */}
      {label && (
        <div
          className={`fixed top-[4.5rem] right-4 sm:right-6 lg:right-8 z-40 no-print transition-all duration-200 ${
            isScrolledDown
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-xl border border-slate-200/90 dark:border-white/15 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.12)] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)] shrink-0" />
            <span className="max-w-[160px] sm:max-w-[220px] truncate font-medium text-slate-800 dark:text-zinc-200">
              {label}
            </span>
            {sublabel && (
              <>
                <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">·</span>
                <span className="text-slate-500 dark:text-zinc-400 hidden sm:inline font-mono text-[10px]">
                  {sublabel}
                </span>
              </>
            )}
            <span className="text-slate-300 dark:text-zinc-700">·</span>
            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {percent}%
            </span>
            <button
              type="button"
              onClick={handleScrollToTop}
              title="Scroll back to top"
              aria-label="Scroll back to top"
              className="ml-0.5 p-1 rounded-full hover:bg-slate-200/70 dark:hover:bg-white/10 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
