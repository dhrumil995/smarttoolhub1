import React, { useState, useEffect, useRef } from 'react';

interface AdSlotProps {
  format?: 'banner' | 'rectangle' | 'horizontal';
  slotId?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  format = 'banner',
  slotId,
  className = '',
}) => {
  const [isPro, setIsPro] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const isPushed = useRef(false);

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

  useEffect(() => {
    if (isPro) return;
    // Safely trigger Google AdSense when script is loaded
    if (!isPushed.current && typeof window !== 'undefined' && slotId) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isPushed.current = true;
      } catch (err) {
        // Ignored
      }
    }
  }, [isPro, slotId]);

  if (isPro) return null;

  const minHeight = format === 'rectangle' ? 'min-h-[250px]' : 'min-h-[90px]';

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full my-6 flex flex-col items-center justify-center select-none ${className}`}
    >
      <div className="w-full text-center text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
        Sponsored
      </div>
      {/* Container with guaranteed CLS = 0 */}
      <div
        ref={adRef}
        className={`w-full max-w-3xl ${minHeight} rounded-2xl bg-gray-50/90 border border-gray-200 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden`}
      >
        {slotId ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client="ca-pub-4598132123552240"
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="space-y-1 text-gray-500">
            <p className="text-xs font-semibold text-gray-800">
              Support 55+ Free Everyday Tools
            </p>
            <p className="text-[11px] text-gray-400 max-w-md mx-auto">
              SmartToolHub is 100% free and client-side private. Ad revenue supports server maintenance and open-source models.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
