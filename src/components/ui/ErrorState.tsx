import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button.tsx';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Standard Error State conforming to Phase 2:
 * - AlertTriangle tile
 * - A friendly sentence (never raw error strings or trace stacks)
 * - "Try again" button
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "That didn't work. Try again in a moment.",
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`glass-surface rounded-3xl p-6 sm:p-8 border border-[rgba(255,92,122,0.3)] shadow-[0_8px_32px_rgba(255,92,122,0.08)] flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto ${className}`}
    >
      {/* AlertTriangle Tile */}
      <div
        className="w-12 h-12 rounded-[14px] bg-[#1a0f18] border border-[rgba(255,92,122,0.3)] flex items-center justify-center text-[#ff5c7a] shadow-[0_0_16px_rgba(255,92,122,0.2)]"
        aria-hidden="true"
      >
        <AlertTriangle size={24} strokeWidth={1.75} />
      </div>

      <p className="text-sm font-medium text-[#f2f7ff] max-w-sm leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <div className="pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="border-[rgba(255,92,122,0.3)] hover:border-[#ff5c7a] text-[#f2f7ff]"
          >
            <RotateCcw size={14} className="mr-1.5 text-[#ff5c7a]" aria-hidden="true" />
            <span>Try again</span>
          </Button>
        </div>
      )}
    </div>
  );
};
