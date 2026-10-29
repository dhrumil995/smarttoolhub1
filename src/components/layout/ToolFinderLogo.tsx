import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

/**
 * Authentic SmartToolHub Vector Logo Icon
 * Exact vector replica of public/icon.svg with Aurora gradient and rounded tile
 */
export const SmartToolHubIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 34,
}) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 rounded-xl overflow-hidden drop-shadow-xs ${className}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="sthBrandGradInline" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0b6bf0" />
        <stop offset="40%" stopColor="#7a45f5" />
        <stop offset="75%" stopColor="#d6347f" />
        <stop offset="100%" stopColor="#ffb840" />
      </linearGradient>
    </defs>
    {/* Navy Rounded Square Base with subtle border matching icon.svg */}
    <rect width="512" height="512" rx="128" fill="#050a14" />
    <rect
      x="8"
      y="8"
      width="496"
      height="496"
      rx="120"
      fill="none"
      stroke="rgba(143,163,192,0.3)"
      strokeWidth="8"
    />
    {/* Authentic Aurora Lightning Bolt with Signature Gradient */}
    <path
      d="M294 72 L150 276 H254 L220 440 L362 236 H258 Z"
      fill="url(#sthBrandGradInline)"
    />
  </svg>
);

// Backward-compatible alias
export const ToolFinderIcon = SmartToolHubIcon;

/**
 * Official SmartToolHub Brand Lockup (Icon + Typography)
 */
export const SmartToolHubLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const iconPixel = size === 'sm' ? 28 : size === 'lg' ? 42 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <SmartToolHubIcon size={iconPixel} />
      <div className="flex flex-col">
        <div className={`font-display font-extrabold tracking-tight text-gray-900 leading-none ${textSize}`}>
          SmartToolHub<span className="text-[#0a84ff]">.</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-semibold mt-0.5">
            Everyday AI &amp; Hardware Tools
          </span>
        )}
      </div>
    </div>
  );
};

// Backward-compatible alias
export const ToolFinderLogo = SmartToolHubLogo;
