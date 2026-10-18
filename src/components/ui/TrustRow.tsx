import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

export interface TrustRowProps {
  className?: string;
}

/**
 * Honest Trust Row conforming to Phase 3:
 * - Three honest points only (no fabricated metrics or inflated numbers)
 * - ShieldCheck: "No sign-up"
 * - Zap: "Results in seconds"
 * - Lock: "Your files stay on your device"
 */
export const TrustRow: React.FC<TrustRowProps> = ({ className = '' }) => {
  const points = [
    {
      icon: ShieldCheck,
      title: 'No sign-up',
      description: 'Zero account creation, passwords, or emails required.',
    },
    {
      icon: Zap,
      title: 'Results in seconds',
      description: 'High-speed Gemini Flash and client-side processing.',
    },
    {
      icon: Lock,
      title: 'Your files stay on your device',
      description: 'Calculators and offline tools compute strictly in your browser.',
    },
  ];

  return (
    <section
      aria-label="Privacy and Reliability Guarantees"
      className={`py-8 border-y border-[rgba(143,163,192,0.12)] ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {points.map((pt, idx) => {
          const IconComponent = pt.icon;

          return (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(57,255,136,0.3)] flex items-center justify-center text-[#39ff88] shrink-0 shadow-[0_0_12px_rgba(57,255,136,0.14)]">
                <IconComponent size={20} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold font-display text-[#f2f7ff]">
                  {pt.title}
                </h3>
                <p className="text-xs text-[#8fa3c0] leading-relaxed">
                  {pt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
