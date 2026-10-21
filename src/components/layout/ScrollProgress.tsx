import React, { useState, useEffect } from 'react';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const ratio = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setProgress(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#0b6bf0] via-[#7a45f5] via-[#d6347f] to-[#ffb840] shadow-[0_0_8px_rgba(10,132,255,0.4)] origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          transition: 'transform 50ms linear',
        }}
      />
    </div>
  );
};
