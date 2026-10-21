import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      // Max 2 toasts at once per Phase 2 spec
      const sliced = prev.length >= 2 ? prev.slice(prev.length - 1) : prev;
      return [...sliced, { id, message, type }];
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      showToast: (msg: string) => console.log('[Toast fallback]:', msg),
      dismissToast: () => {},
    };
  }
  return context;
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed z-50 pointer-events-none flex flex-col gap-2 items-center md:items-end w-full md:w-auto left-0 md:left-auto md:right-6 bottom-20 md:bottom-6 px-4 md:px-0 safe-bottom"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Auto-dismiss at 3s per Phase 2 spec
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      onDismiss(); // Swipe dismiss
    }
    setTouchStartX(null);
  };

  const borderAndIcon = {
    success: {
      border: 'border-[rgba(52,224,161,0.35)] shadow-[0_4px_24px_rgba(52,224,161,0.18)]',
      icon: <Check size={18} strokeWidth={2} className="text-[#34e0a1] shrink-0" aria-hidden="true" />,
    },
    error: {
      border: 'border-[rgba(255,92,122,0.4)] shadow-[0_4px_24px_rgba(255,92,122,0.18)]',
      icon: <AlertCircle size={18} strokeWidth={2} className="text-[#ff5c7a] shrink-0" aria-hidden="true" />,
    },
    info: {
      border: 'border-[rgba(90,169,255,0.4)] shadow-[0_4px_24px_rgba(90,169,255,0.15)]',
      icon: <Info size={18} strokeWidth={2} className="text-[#5aa9ff] shrink-0" aria-hidden="true" />,
    },
  }[toast.type];

  return (
    <div
      role="status"
      onClick={onDismiss}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`pointer-events-auto cursor-pointer max-w-sm w-full md:w-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#0a1424]/90 backdrop-blur-[20px] border ${borderAndIcon.border} text-xs font-semibold text-[#f2f7ff] transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 select-none`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-1">
        {borderAndIcon.icon}
        <span className="truncate leading-snug">{toast.message}</span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        aria-label="Dismiss notification"
        className="text-[#8fa3c0] hover:text-[#f2f7ff] p-1 -mr-1 rounded-lg focus-ring"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
};
