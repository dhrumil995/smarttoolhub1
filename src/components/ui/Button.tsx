import React, { useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';
import { Icon } from './Icon.tsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon-only';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: string;
  trailingIcon?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  children?: React.ReactNode;
}

/**
 * Universal Button component conforming to Phase 2 UI specifications:
 * - Variants: primary, secondary, ghost, icon-only
 * - Leading/trailing icons
 * - Loading state (small spinner replaces icon, label stays, width does not jump)
 * - 44px minimum tap target on mobile
 * - Active press scale(0.97), 200ms transitions, focus-laser outline
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  isLoading = false,
  loadingLabel,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}, ref) => {
  const isIconOnly = variant === 'icon-only';

  const baseStyles = 'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 select-none focus-laser disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] relative';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: isIconOnly ? 'min-w-[44px] min-h-[44px] w-11 h-11 p-2 text-xs rounded-xl' : 'min-h-[44px] px-3.5 py-2 text-xs rounded-xl gap-2',
    md: isIconOnly ? 'min-w-[44px] min-h-[44px] w-11 h-11 p-2.5 text-sm rounded-xl' : 'min-h-[44px] px-5 py-2.5 text-sm rounded-xl gap-2.5',
    lg: isIconOnly ? 'min-w-[48px] min-h-[48px] w-12 h-12 p-3 text-base rounded-2xl' : 'min-h-[48px] px-6 py-3 text-base rounded-2xl gap-3',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[#39ff88] text-[#050a14] font-bold hover:bg-[#2ee677] shadow-[0_0_20px_rgba(57,255,136,0.25)] hover:shadow-[0_0_28px_rgba(57,255,136,0.4)] border border-transparent',
    secondary: 'bg-[#0a1424] text-[#f2f7ff] border border-[rgba(143,163,192,0.18)] hover:border-[#39ff88] hover:text-[#39ff88] bg-opacity-90',
    ghost: 'bg-transparent text-[#8fa3c0] hover:text-[#f2f7ff] hover:bg-[rgba(143,163,192,0.08)] border border-transparent',
    'icon-only': 'bg-[#0a1424] text-[#8fa3c0] border border-[rgba(143,163,192,0.18)] hover:text-[#39ff88] hover:border-[rgba(57,255,136,0.4)]',
  };

  // Determine icon size
  const iconPx = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {/* Leading Icon or Spinner */}
      {isLoading ? (
        <Loader2
          size={iconPx}
          strokeWidth={2}
          className="animate-spin text-current shrink-0"
          aria-hidden="true"
        />
      ) : leadingIcon ? (
        <Icon
          name={leadingIcon}
          size={iconPx}
          strokeWidth={1.75}
          aria-hidden={true}
        />
      ) : null}

      {/* Label Content */}
      {children && (
        <span className="truncate leading-none">
          {isLoading && loadingLabel ? loadingLabel : children}
        </span>
      )}

      {/* Trailing Icon (if not loading and not icon-only) */}
      {!isLoading && trailingIcon && !isIconOnly && (
        <Icon
          name={trailingIcon}
          size={iconPx}
          strokeWidth={1.75}
          aria-hidden={true}
        />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  onCopySuccess?: () => void;
  className?: string;
}

/**
 * Standard Copy button:
 * - Icon flips Copy -> Check for 1.6s
 * - Label flips to "Copied"
 * - Haptic vibration trigger: navigator.vibrate(10) where supported
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied',
  iconOnly = false,
  size = 'sm',
  variant = 'secondary',
  onCopySuccess,
  className = '',
  'aria-label': ariaLabel,
  ...rest
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      // Mobile haptic pulse (wrapped in try/catch per spec)
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate(10);
        }
      } catch {
        // Ignore environments where vibration is restricted
      }

      if (onCopySuccess) onCopySuccess();

      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      // Fallback
    }
  };

  const computedAriaLabel = ariaLabel || (copied ? copiedLabel : label);

  return (
    <Button
      variant={iconOnly ? 'icon-only' : variant}
      size={size}
      onClick={handleCopy}
      aria-label={computedAriaLabel}
      className={`min-w-[44px] min-h-[44px] transition-colors ${
        copied ? 'border-[#39ff88] text-[#39ff88] bg-[rgba(57,255,136,0.06)]' : ''
      } ${className}`}
      {...rest}
    >
      {copied ? (
        <Check size={size === 'sm' ? 15 : 18} strokeWidth={2} className="text-[#39ff88] shrink-0" aria-hidden="true" />
      ) : (
        <Copy size={size === 'sm' ? 15 : 18} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
      )}
      {!iconOnly && (
        <span className={copied ? 'text-[#39ff88] font-bold' : ''}>
          {copied ? copiedLabel : label}
        </span>
      )}
    </Button>
  );
};
