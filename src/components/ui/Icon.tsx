import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export const ICON_SIZE_PX: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export type LucideIconName = keyof typeof LucideIcons;

export interface IconProps {
  name: string;
  size?: IconSize | number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-label'?: string;
}

/**
 * Shared Icon wrapper strictly conforming to UI Phase 1 specifications:
 * - Lucide only
 * - Sizes: sm (16px), md (20px), lg (24px), xl (32px)
 * - Default stroke width: 1.75
 * - Inherits colour from currentColor unless specified
 * - Decorative icons default to aria-hidden="true"
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  strokeWidth = 1.75,
  className = '',
  color = 'currentColor',
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
}) => {
  const pixelSize = typeof size === 'number' ? size : ICON_SIZE_PX[size] || 20;

  // Resolve Lucide Icon component dynamically by name
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.Sparkles;

  const isDecorative = ariaLabel === undefined && (ariaHidden === undefined || ariaHidden === true || ariaHidden === 'true');

  return (
    <IconComponent
      size={pixelSize}
      strokeWidth={strokeWidth}
      color={color}
      className={`shrink-0 inline-block align-middle ${className}`}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    />
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  'aria-label': string;
  size?: IconSize;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

/**
 * Standard 44x44px minimum tap area icon button with mandatory aria-label
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  'aria-label': ariaLabel,
  size = 'md',
  variant = 'ghost',
  className = '',
  disabled,
  onClick,
  type = 'button',
  ...rest
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#0b6bf0] via-[#7a45f5] to-[#d6347f] text-white hover:brightness-110 active:scale-[0.97]',
    secondary: 'bg-[#0a1424] text-[#f2f7ff] border border-[rgba(143,163,192,0.18)] hover:border-[#0a84ff] hover:text-white active:scale-[0.97]',
    ghost: 'text-[#9aaccb] hover:text-[#f2f7ff] hover:bg-[rgba(143,163,192,0.08)] active:scale-[0.97]',
  }[variant];

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none ${variantStyles} ${className}`}
      {...rest}
    >
      <Icon name={icon} size={size} strokeWidth={1.75} aria-hidden={true} />
    </button>
  );
};
