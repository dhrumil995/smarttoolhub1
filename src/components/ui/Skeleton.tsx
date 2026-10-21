import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base Shimmer placeholder conforming to Phase 2:
 * - Slow green-tinted gradient shimmer
 * - Fully disabled under prefers-reduced-motion
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style, ...rest }) => {
  return (
    <div
      aria-hidden="true"
      className={`rounded-xl bg-[#0a1424] relative overflow-hidden border border-[rgba(143,163,192,0.08)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[rgba(122,69,245,0.12)] before:to-transparent motion-reduce:before:animate-none ${className}`}
      style={style}
      {...rest}
    />
  );
};

/**
 * Result Card Skeleton Shimmer placeholder matching output card dimensions
 */
export const SkeletonResultCard: React.FC = () => {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="glass-surface rounded-3xl p-6 sm:p-7 border border-[rgba(143,163,192,0.16)] space-y-5"
    >
      {/* Top Header Row with Action Badges */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-5 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-8 rounded-xl" />
          <Skeleton className="w-8 h-8 rounded-xl" />
        </div>
      </div>

      {/* Body Lines */}
      <div className="space-y-3 pt-2">
        <Skeleton className="w-3/4 h-5 rounded-lg" />
        <Skeleton className="w-full h-4 rounded-lg" />
        <Skeleton className="w-5/6 h-4 rounded-lg" />
        <Skeleton className="w-4/5 h-4 rounded-lg" />
        <Skeleton className="w-2/3 h-4 rounded-lg" />
      </div>

      {/* Footer Pill */}
      <div className="pt-4 border-t border-[rgba(143,163,192,0.1)] flex items-center justify-between">
        <Skeleton className="w-32 h-3.5 rounded" />
        <Skeleton className="w-20 h-3.5 rounded" />
      </div>
    </div>
  );
};

/**
 * Tool Grid Skeleton Shimmer
 */
export const SkeletonToolGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-surface p-6 rounded-3xl border border-[rgba(143,163,192,0.14)] space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-12 h-12 rounded-[14px]" />
              <Skeleton className="w-16 h-4 rounded" />
            </div>
            <Skeleton className="w-3/4 h-6 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-4/5 h-4 rounded-lg" />
          </div>
          <div className="pt-6">
            <Skeleton className="w-20 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Guide Card Skeleton Shimmer
 */
export const SkeletonGuideCard: React.FC = () => {
  return (
    <div className="glass-surface p-6 rounded-3xl border border-[rgba(143,163,192,0.14)] space-y-3" aria-busy="true">
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-3.5 rounded" />
        <Skeleton className="w-16 h-3.5 rounded" />
      </div>
      <Skeleton className="w-4/5 h-6 rounded-lg" />
      <Skeleton className="w-full h-4 rounded" />
      <Skeleton className="w-3/4 h-4 rounded" />
    </div>
  );
};
