import React from 'react';
import { haptics } from '../../utils/haptics';

export interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const IOSButton: React.FC<IOSButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    haptics.playTap();
    if (onClick) onClick(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-full tracking-tight transition-all duration-200 ease-out select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2';

  const variants = {
    primary:
      'bg-[#0A84FF] hover:bg-[#0077ED] text-white shadow-sm hover:shadow active:scale-[0.98]',
    secondary:
      'bg-neutral-200/90 dark:bg-white/[0.12] hover:bg-neutral-300/90 dark:hover:bg-white/[0.18] text-neutral-900 dark:text-[#F5F5F7] border border-black/[0.04] dark:border-white/[0.08] active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-neutral-200/50 dark:hover:bg-white/[0.08] text-[#0A84FF] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-[14px] px-5 py-2.5 min-h-[44px] gap-2',
    lg: 'text-[15px] px-6 py-3 min-h-[48px] gap-2.5 font-semibold',
  };

  const disabledStyles = 'opacity-40 cursor-not-allowed pointer-events-none';

  return (
    <button
      {...props}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? disabledStyles : ''
      } ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
