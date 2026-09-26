import React, { useState } from 'react';

export interface IOSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  subtext?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const IOSInput: React.FC<IOSInputProps> = ({
  label,
  subtext,
  error,
  icon,
  id,
  value,
  placeholder,
  className = '',
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `ios-input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const isFloating = isFocused || hasValue || (placeholder && placeholder.length > 0);

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div
        className={`relative flex items-center min-h-[52px] w-full rounded-2xl bg-white/70 dark:bg-[#1C1C1E]/80 border transition-all duration-200 ease-out backdrop-blur-md px-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
          error
            ? 'border-red-500/70 focus-within:ring-2 focus-within:ring-red-500/30'
            : isFocused
            ? 'border-[#0A84FF] ring-2 ring-[#0A84FF]/20 shadow-[0_0_12px_rgba(10,132,255,0.15)]'
            : 'border-black/[0.08] dark:border-white/[0.10] hover:border-black/[0.15] dark:hover:border-white/[0.20]'
        }`}
      >
        {icon && (
          <span
            className={`mr-3 shrink-0 transition-colors duration-200 ${
              isFocused ? 'text-[#0A84FF]' : 'text-[#86868B]'
            }`}
          >
            {icon}
          </span>
        )}

        <div className="relative flex-1 py-1.5 min-h-[44px] flex flex-col justify-center">
          {/* Floating Label */}
          <label
            htmlFor={inputId}
            className={`pointer-events-none transition-all duration-200 ease-out block select-none ${
              isFloating
                ? 'text-[11px] font-medium text-[#86868B] -translate-y-1'
                : 'text-sm text-[#86868B] translate-y-0'
            } ${isFocused ? 'text-[#0A84FF] dark:text-[#0A84FF]' : ''}`}
          >
            {label}
          </label>

          {/* Touch-Friendly Input (minimum 44px height, 16px font to prevent iOS auto-zoom) */}
          <input
            {...props}
            id={inputId}
            value={value}
            onFocus={(e) => {
              setIsFocused(true);
              if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            placeholder={isFloating ? placeholder : ''}
            className="w-full bg-transparent text-sm sm:text-[15px] font-normal text-neutral-900 dark:text-[#F5F5F7] placeholder-[#86868B]/60 focus:outline-none leading-tight py-0.5"
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Subtext or Error message */}
      {error ? (
        <p className="text-xs text-red-500 font-medium px-1 flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : subtext ? (
        <p className="text-xs text-[#86868B] px-1 font-normal leading-relaxed">{subtext}</p>
      ) : null}
    </div>
  );
};
