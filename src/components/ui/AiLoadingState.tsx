import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from './Button.tsx';

export interface AiLoadingStateProps {
  onCancel?: () => void;
  className?: string;
}

const ROTATING_STATUSES = [
  'Reading your text',
  'Writing the result',
  'Checking it over',
];

/**
 * AI loading state for tool results conforming to Phase 2:
 * - Animated indeterminate progress bar
 * - Mono label "GENERATING..."
 * - Three rotating plain-language status lines ("Reading your text", "Writing the result", "Checking it over")
 * - A Cancel button
 */
export const AiLoadingState: React.FC<AiLoadingStateProps> = ({ onCancel, className = '' }) => {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % ROTATING_STATUSES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`glass-surface rounded-3xl p-6 sm:p-7 border border-[rgba(10,132,255,0.3)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-6 ${className}`}
    >
      {/* Top Header Row with Mono Label and Cancel Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider font-semibold text-[#5aa9ff]">
          <span className="w-2 h-2 rounded-full bg-[#5aa9ff] animate-ping" />
          <span>GENERATING...</span>
        </div>

        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            aria-label="Cancel AI generation"
            className="text-xs text-[#9aaccb] hover:text-[#ff5c7a] px-3 py-1.5 h-8 min-h-[36px]"
          >
            <X size={14} className="mr-1" aria-hidden="true" />
            <span>Cancel</span>
          </Button>
        )}
      </div>

      {/* Indeterminate Animated Progress Bar */}
      <div className="w-full bg-[#0a1424] h-1.5 rounded-full overflow-hidden relative border border-[rgba(143,163,192,0.12)]">
        <div
          className="absolute top-0 bottom-0 bg-gradient-to-r from-[#0b6bf0] via-[#7a45f5] to-[#ff4f9a] rounded-full shadow-[0_0_12px_rgba(10,132,255,0.4)] animate-[indeterminate_1.6s_infinite_ease-in-out]"
          style={{ width: '40%' }}
        />
      </div>

      {/* Rotating Plain-Language Status Line */}
      <div className="flex items-center gap-2.5 py-2">
        <div className="w-8 h-8 rounded-xl bg-[#0a1424] border border-[rgba(10,132,255,0.3)] flex items-center justify-center text-[#0a84ff] shrink-0">
          <Sparkles size={16} className="animate-spin" style={{ animationDuration: '3s' }} aria-hidden="true" />
        </div>
        <div className="text-sm text-[#f2f7ff] font-medium transition-all duration-300">
          {ROTATING_STATUSES[statusIndex]}
          <span className="text-[#0a84ff] animate-pulse">...</span>
        </div>
      </div>

      <div className="text-[11px] font-mono text-[#9aaccb]">
        Avg speed: 1.5 - 3.0s · Powered by Gemini Flash
      </div>
    </div>
  );
};
