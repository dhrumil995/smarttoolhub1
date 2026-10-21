import React from 'react';
import { Icon, IconSize } from './Icon.tsx';
import { getCategoryTheme } from '../../data/tools.ts';

export interface IconTileProps {
  icon: string;
  size?: 'md' | 'lg';
  className?: string;
  glowOnHover?: boolean;
  category?: string;
  color?: string;
}

/**
 * Category-aware Icon Tile conforming to Phase 3:
 * - 48px rounded-14px tile
 * - Background = category colour at 14% opacity
 * - Border = category colour at 32% opacity
 * - Icon in the full colour
 * - On hover: soft glow in that colour
 */
export const IconTile: React.FC<IconTileProps> = ({
  icon,
  size = 'lg',
  className = '',
  glowOnHover = true,
  category = 'Writing',
  color,
}) => {
  const iconSize: IconSize = size === 'lg' ? 'lg' : 'md';
  const theme = getCategoryTheme(category);
  const activeColor = color || theme.color;
  const activeBg = color ? 'rgba(10, 132, 255, 0.14)' : theme.bgSubtle;
  const activeBorder = color ? 'rgba(10, 132, 255, 0.32)' : theme.borderSubtle;

  return (
    <div
      style={{
        backgroundColor: activeBg,
        borderColor: activeBorder,
        color: activeColor,
      }}
      className={`w-12 h-12 min-w-[48px] min-h-[48px] rounded-[14px] border flex items-center justify-center transition-all duration-200 ${
        glowOnHover ? 'group-hover:shadow-[0_0_16px_rgba(10,132,255,0.25)]' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <Icon name={icon} size={iconSize} strokeWidth={1.75} aria-hidden={true} />
    </div>
  );
};
