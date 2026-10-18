import React, { useState } from 'react';
import { Download, Share2, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'nav',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Suppress button if already running in standalone PWA mode
  if (isInstalled) return null;

  // Chromium / Android / Desktop flow with beforeinstallprompt
  if (isInstallable) {
    if (variant === 'drawer') {
      return (
        <button
          type="button"
          onClick={install}
          className={`w-full flex items-center justify-between p-3 rounded-2xl bg-[#39ff88]/10 border border-[#39ff88]/30 text-xs font-semibold text-[#39ff88] hover:bg-[#39ff88]/20 transition-colors ${className}`}
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#39ff88]" />
            <span>Install SmartToolHub App</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#39ff88] text-[#050a14] px-2 py-0.5 rounded font-bold">
            Free
          </span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#39ff88]/10 border border-[#39ff88]/30 text-xs font-semibold text-[#39ff88] hover:bg-[#39ff88]/20 transition-colors focus-laser ${className}`}
        title="Install SmartToolHub to Home Screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow (WebKit does not support beforeinstallprompt)
  if (isIOS) {
    return (
      <>
        {variant === 'drawer' ? (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className={`w-full flex items-center justify-between p-3 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs font-medium text-[#f2f7ff] hover:border-[#39ff88] transition-colors ${className}`}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#39ff88]" />
              <span>Add to iPhone Home Screen</span>
            </div>
            <span className="text-[10px] text-[#8fa3c0]">iOS</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.2)] text-xs text-[#8fa3c0] hover:text-[#f2f7ff] hover:border-[#39ff88] transition-colors focus-laser ${className}`}
          >
            <Download className="w-3.5 h-3.5 text-[#39ff88]" />
            <span className="hidden sm:inline">Install</span>
          </button>
        )}

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/85 backdrop-blur-md"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="w-full max-w-sm glass-surface rounded-3xl border border-[rgba(57,255,136,0.3)] p-6 space-y-4 text-left shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-[#8fa3c0] hover:text-[#f2f7ff] p-1"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#39ff88]/10 border border-[#39ff88]/30 flex items-center justify-center text-[#39ff88]">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-[#f2f7ff]">
                    Install on iPhone / iPad
                  </h3>
                  <p className="text-xs text-[#8fa3c0]">Fast 1-tap Home Screen access</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#8fa3c0]">
                <div className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] space-y-2">
                  <div className="flex items-start gap-2 text-[#f2f7ff]">
                    <span className="font-mono text-[#39ff88] font-bold">1.</span>
                    <span>Tap the Safari <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-[#39ff88]" /> at the bottom of your screen.</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#f2f7ff]">
                    <span className="font-mono text-[#39ff88] font-bold">2.</span>
                    <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#f2f7ff]">
                    <span className="font-mono text-[#39ff88] font-bold">3.</span>
                    <span>Tap <strong>Add</strong> in the top right corner.</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#8fa3c0]/70">
                  SmartToolHub will open like a native app with zero address bar and full offline support.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full btn-laser text-xs justify-center"
              >
                <span>Got it</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
