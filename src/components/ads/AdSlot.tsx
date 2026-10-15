import React, { useState, useEffect } from 'react';

interface AdSlotProps {
  format?: 'banner' | 'rectangle';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ format = 'banner', className = '' }) => {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('smarttoolhub_pro');
      if (stored === 'true') {
        setIsPro(true);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Pro users see zero ads
  if (isPro) return null;

  const heightClass = format === 'banner' ? 'h-[100px]' : 'h-[250px]';

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full my-8 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-full text-center text-[10px] font-mono uppercase tracking-widest text-[#8fa3c0]/60 mb-1">
        Advertisement
      </div>
      {/* Reserved fixed height container to guarantee zero layout shift (CLS = 0) */}
      <div
        className={`w-full max-w-2xl ${heightClass} rounded-2xl bg-[#0a1424]/80 border border-[rgba(143,163,192,0.12)] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden`}
      >
        <div className="text-xs text-[#8fa3c0] space-y-1">
          <p className="font-medium text-[#f2f7ff]">Support free everyday AI tools</p>
          <p className="text-[11px] text-[#8fa3c0]/80">
            SmartToolHub is independent. Upgrade to Pro for zero ads and higher daily limits.
          </p>
        </div>
      </div>
    </aside>
  );
};
