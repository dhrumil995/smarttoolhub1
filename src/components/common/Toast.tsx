import React from 'react';
import { Check, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warn';
  isVisible: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0a1424]/95 border border-[#39ff88]/40 text-xs font-semibold text-[#f2f7ff] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md animate-fade-in"
    >
      {type === 'success' && <Check className="w-4 h-4 text-[#39ff88] shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-[#5aa9ff] shrink-0" />}
      {type === 'warn' && <AlertTriangle className="w-4 h-4 text-[#ffb840] shrink-0" />}
      <span className="leading-snug">{message}</span>
    </aside>
  );
};
