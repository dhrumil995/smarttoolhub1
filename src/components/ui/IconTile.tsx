import React from 'react';
import { Icon, IconSize } from './Icon.tsx';

export interface IconTileProps {
  icon: string;
  size?: 'md' | 'lg';
  className?: string;
  glowOnHover?: boolean;
}

/**
 * 48px rounded-14px tile with bg-3 background, 1px line border,
 * laser green icon, and soft green glow on hover (where hover exists).
 */
export const IconTile: React.FC<IconTileProps> = ({
  icon,
  size = 'lg',
  className = '',
  glowOnHover = true,
}) => {
  const iconSize: IconSize = size === 'lg' ? 'lg' : 'md';

  return (
    <div
      className={`w-12 h-12 min-w-[48px] min-h-[48px] rounded-[14px] bg-[#0c1322] border border-[rgba(143,163,192,0.16)] flex items-center justify-center text-[#39ff88] transition-all duration-200 ${
        glowOnHover
          ? 'group-hover:border-[rgba(57,255,136,0.4)] group-hover:shadow-[0_0_16px_rgba(57,255,136,0.22)]'
          : ''
      } ${className}`}
      aria-hidden="true"
    >
      <Icon name={icon} size={iconSize} strokeWidth={1.75} aria-hidden={true} />
    </div>
  );
};
