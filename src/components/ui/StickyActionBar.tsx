import React from 'react';
import { CopyButton, Button } from './Button.tsx';

export interface StickyActionBarProps {
  result: string;
  onShare: () => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Mobile Sticky Bottom Action Bar conforming to Phase 3:
 * - Sits above the mobile tab bar (bottom-16) with no overlap
 * - Contains Copy and Share buttons plus a small progress/status indicator
 * - 44px minimum tap targets
 */
export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  result,
  onShare,
  isLoading = false,
  className = '',
}) => {
  if (!result && !isLoading) return null;

  return (
    <div
      aria-label="Quick Actions"
      className={`md:hidden fixed bottom-16 left-0 right-0 z-30 px-4 py-2.5 bg-[#050a14]/95 backdrop-blur-[24px] border-t border-[rgba(143,163,192,0.16)] flex items-center justify-between gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Status indicator */}
      <div className="flex items-center gap-2 min-w-0 pr-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            isLoading ? 'bg-[#ffb840] animate-ping' : 'bg-[#34e0a1]'
          }`}
          aria-hidden="true"
        />
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9aaccb] truncate">
          {isLoading ? 'Generating...' : 'Result ready'}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <CopyButton
          textToCopy={result}
          size="sm"
          disabled={isLoading || !result}
          className="h-10 text-xs px-3"
        />

        <Button
          variant="secondary"
          size="sm"
          onClick={onShare}
          disabled={isLoading || !result}
          leadingIcon="Share2"
          className="h-10 text-xs px-3"
        >
          <span>Share</span>
        </Button>
      </div>
    </div>
  );
};
