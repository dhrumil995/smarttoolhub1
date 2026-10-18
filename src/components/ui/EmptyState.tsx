import React from 'react';
import { IconTile } from './IconTile.tsx';
import { Button } from './Button.tsx';

export interface EmptyStateProps {
  icon?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Standard Empty State conforming to Phase 2:
 * - A centred icon tile (48px rounded-14px)
 * - One-line friendly message
 * - Exactly one clear action button
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'History',
  message,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`glass-surface rounded-3xl p-8 sm:p-12 border border-[rgba(143,163,192,0.14)] flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto ${className}`}
    >
      <IconTile icon={icon} glowOnHover={false} />
      <p className="text-sm font-medium text-[#8fa3c0] max-w-sm leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onAction}
            className="text-xs"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
