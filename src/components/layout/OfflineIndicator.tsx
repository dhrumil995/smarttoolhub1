import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.ts';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#0a1424] border border-[#ffb840]/50 px-3.5 py-2 text-xs font-medium text-[#f2f7ff] shadow-2xl backdrop-blur-md"
    >
      <span className="flex h-2 w-2 rounded-full bg-[#ffb840] animate-pulse" />
      <WifiOff className="w-4 h-4 text-[#ffb840] shrink-0" />
      <span>Offline Mode — Cached pages &amp; calculators available</span>
    </div>
  );
};
