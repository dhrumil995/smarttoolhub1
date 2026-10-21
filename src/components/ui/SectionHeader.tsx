import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';
import { Icon } from './Icon.tsx';

export interface SectionHeaderProps {
  eyebrow: string;
  eyebrowIcon?: string;
  title: string;
  highlightDot?: boolean;
  subtext?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  navigate?: (path: string) => void;
  className?: string;
}

/**
 * Universal Section Header conforming to Phase 3:
 * - Mono eyebrow label with a small icon
 * - Big headline (h2-fluid)
 * - One-line subtext
 * - "View all" ghost link with an ArrowRight icon
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  eyebrowIcon = 'Zap',
  title,
  highlightDot = true,
  subtext,
  viewAllHref,
  viewAllLabel = 'View all',
  navigate,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${className}`}>
      <div className="space-y-2 max-w-xl">
        {/* Eyebrow Label with Small Icon */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0a84ff] font-semibold">
          <Icon name={eyebrowIcon} size="sm" strokeWidth={2} className="text-[#0a84ff]" aria-hidden={true} />
          <span>{eyebrow}</span>
        </div>

        {/* Big Headline */}
        <h2 className="h2-fluid font-display text-[#f2f7ff]">
          {title}
          {highlightDot && <span className="text-[#0a84ff]">.</span>}
        </h2>

        {/* One-Line Subtext */}
        {subtext && (
          <p className="body-fluid text-[#9aaccb] leading-relaxed">
            {subtext}
          </p>
        )}
      </div>

      {/* View All Ghost Link */}
      {viewAllHref && navigate && (
        <Link
          href={viewAllHref}
          navigate={navigate}
          className="text-xs font-mono uppercase tracking-wider text-[#7db8ff] hover:underline focus-ring rounded py-1 inline-flex items-center gap-1.5 shrink-0 group self-start sm:self-end font-semibold"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
};
