import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Universal Tooltip conforming to Phase 3:
 * - Desktop: hover or focus tooltip
 * - Mobile: interactive Info icon that opens a small popover
 * - Short content in Geist Mono font
 */
export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      {children}

      {/* Mobile Popover Trigger Icon */}
      <button
        type="button"
        onClick={() => setIsOpenMobile((prev) => !prev)}
        aria-label="More information"
        className="md:hidden ml-1.5 p-1 text-[#9aaccb] hover:text-[#5aa9ff] focus-ring rounded-full"
      >
        <Info size={14} aria-hidden="true" />
      </button>

      {/* Mobile Popover */}
      {isOpenMobile && (
        <div
          role="tooltip"
          className="md:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 p-2.5 rounded-xl bg-[#0a1424] border border-[rgba(10,132,255,0.35)] shadow-[0_4px_24px_rgba(0,0,0,0.6)] text-[11px] font-mono text-[#f2f7ff] max-w-xs w-max whitespace-normal flex items-start gap-2"
        >
          <span>{content}</span>
          <button
            type="button"
            onClick={() => setIsOpenMobile(false)}
            aria-label="Close tooltip"
            className="text-[#8fa3c0] hover:text-[#f2f7ff] p-0.5"
          >
            <X size={12} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Desktop Hover/Focus Tooltip */}
      <div
        role="tooltip"
        className="hidden md:group-hover:flex md:group-focus-within:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-2.5 py-1.5 rounded-lg bg-[#0a1424] border border-[rgba(143,163,192,0.2)] shadow-xl text-[11px] font-mono text-[#f2f7ff] whitespace-nowrap pointer-events-none items-center"
      >
        {content}
      </div>
    </div>
  );
};
