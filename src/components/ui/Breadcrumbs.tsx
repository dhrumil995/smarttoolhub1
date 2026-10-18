import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from '../../hooks/useRouter.tsx';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  navigate: (path: string) => void;
  className?: string;
}

/**
 * Universal Breadcrumbs conforming to Phase 3:
 * - Mono ChevronRight separator
 * - On mobile, truncates the middle items for compact viewport layout
 * - Clean focus outline and hover states
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  navigate,
  className = '',
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-[#8fa3c0] select-none ${className}`}
    >
      {/* Desktop view: full trail */}
      <ol className="hidden sm:flex items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  navigate={navigate}
                  className="hover:text-[#39ff88] transition-colors focus-laser rounded py-0.5"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#f2f7ff] font-medium truncate max-w-xs" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="font-mono text-[#8fa3c0]/60 select-none flex items-center" aria-hidden="true">
                  <ChevronRight size={14} strokeWidth={1.75} />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile view: middle truncated (First > ... > Last) */}
      <ol className="flex sm:hidden items-center gap-1.5 list-none p-0 m-0 w-full overflow-hidden">
        {items.length > 2 ? (
          <>
            <li className="shrink-0">
              <Link
                href={items[0].href || '/'}
                navigate={navigate}
                className="hover:text-[#39ff88] transition-colors focus-laser rounded"
              >
                {items[0].label}
              </Link>
            </li>
            <li className="font-mono text-[#8fa3c0]/60 select-none" aria-hidden="true">
              <ChevronRight size={13} strokeWidth={1.75} />
            </li>
            <li className="font-mono text-[#8fa3c0] select-none shrink-0" aria-hidden="true">
              ...
            </li>
            <li className="font-mono text-[#8fa3c0]/60 select-none" aria-hidden="true">
              <ChevronRight size={13} strokeWidth={1.75} />
            </li>
            <li className="truncate flex-1 min-w-0 text-[#f2f7ff] font-medium" aria-current="page">
              {items[items.length - 1].label}
            </li>
          </>
        ) : (
          items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5 truncate">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    navigate={navigate}
                    className="hover:text-[#39ff88] transition-colors focus-laser rounded shrink-0"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#f2f7ff] font-medium truncate" aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span className="font-mono text-[#8fa3c0]/60 select-none shrink-0" aria-hidden="true">
                    <ChevronRight size={13} strokeWidth={1.75} />
                  </span>
                )}
              </li>
            );
          })
        )}
      </ol>
    </nav>
  );
};
