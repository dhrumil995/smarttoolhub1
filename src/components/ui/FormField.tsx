import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

/**
 * Character counter on textareas conforming to Phase 2:
 * - Mono font
 * - Positioned at bottom right
 * - Turns amber at 90% of max limit
 * - Turns red-pink at limit (100%)
 */
export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  current,
  max,
  className = '',
}) => {
  const percentage = (current / max) * 100;

  let colorClass = 'text-[#8fa3c0]';
  if (percentage >= 100) {
    colorClass = 'text-[#ff5c7a] font-bold';
  } else if (percentage >= 90) {
    colorClass = 'text-[#ffb840] font-semibold';
  }

  return (
    <span
      className={`font-mono text-[11px] tabular-nums select-none ${colorClass} ${className}`}
      aria-live="polite"
    >
      {current.toLocaleString()} / {max.toLocaleString()}
    </span>
  );
};

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  action?: React.ReactNode;
  children: (props: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
    className: string;
  }) => React.ReactNode;
  className?: string;
}

/**
 * Form field wrapper with inline validation:
 * - Red-pink border on field when error exists
 * - Small AlertCircle icon and message under field
 * - Accessible aria-describedby linkage
 */
export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  hint,
  required,
  action,
  children,
  className = '',
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [
    error ? errorId : null,
    hint ? hintId : null,
  ].filter(Boolean).join(' ') || undefined;

  const fieldBorderClass = error
    ? 'border-[#ff5c7a] focus:border-[#ff5c7a] focus:ring-[#ff5c7a]/20'
    : 'border-[rgba(143,163,192,0.18)] focus:border-[#0a84ff] focus:ring-[#0a84ff]/25';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label & Optional Action Header */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-mono uppercase tracking-wider text-[#f2f7ff] font-semibold">
          {label}
          {required && <span className="text-[#ff5c7a] ml-1">*</span>}
        </label>
        {action}
      </div>

      {/* Render Child Input/Textarea with Computed Classes and Attributes */}
      {children({
        id,
        'aria-invalid': !!error,
        'aria-describedby': describedBy,
        className: fieldBorderClass,
      })}

      {/* Bottom Message: Error or Hint */}
      {error ? (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-[#ff5c7a] pt-1"
        >
          <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <p id={hintId} className="text-[11px] text-[#8fa3c0] pt-0.5">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
