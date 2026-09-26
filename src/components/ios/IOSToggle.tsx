import React from 'react';
import { haptics } from '../../utils/haptics';

interface IOSToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  id?: string;
}

export const IOSToggle: React.FC<IOSToggleProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  id,
}) => {
  const handleToggle = () => {
    if (disabled) return;
    haptics.playTap();
    onChange(!checked);
  };

  return (
    <div className="flex items-center justify-between gap-4 py-2 min-h-[44px]">
      {(label || sublabel) && (
        <div className="flex-1 cursor-pointer select-none" onClick={handleToggle}>
          {label && (
            <span className="text-sm font-medium text-neutral-900 dark:text-[#F5F5F7] block leading-tight">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-xs text-[#86868B] block mt-0.5 leading-snug">
              {sublabel}
            </span>
          )}
        </div>
      )}

      {/* Authentic iOS 51px x 31px Toggle Track */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 ${
          checked ? 'bg-[#0A84FF]' : 'bg-neutral-300 dark:bg-[#39393D]'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
      >
        <span
          className={`pointer-events-none inline-block h-[27px] w-[27px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2),0_1px_1px_rgba(0,0,0,0.1)] transition-transform duration-250 ease-out ${
            checked ? 'translate-x-[20px]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
