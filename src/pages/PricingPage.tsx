import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ChevronRight, ShieldCheck, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { Link } from '../hooks/useRouter.tsx';

interface PricingPageProps {
  navigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ navigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('smarttoolhub_pro');
      if (stored === 'true') {
        setIsProActive(true);
      }
    } catch {
      // Fallback
    }
  }, []);

  const toggleProPreview = () => {
    const newState = !isProActive;
    setIsProActive(newState);
    try {
      localStorage.setItem('smarttoolhub_pro', String(newState));
    } catch {
      // Fallback
    }
  };

  return (
    <article className="py-6 sm:py-12 max-w-4xl mx-auto space-y-12">
      {/* Breadcrumbs Landmark */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#8fa3c0]">
        <Link href="/" navigate={navigate} className="hover:text-[#7db8ff] transition-colors focus-ring rounded">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8fa3c0]/60" />
        <span className="text-[#f2f7ff]">Pricing &amp; Pro</span>
      </nav>

      {/* Header Landmark */}
      <header className="space-y-4 text-center max-w-xl mx-auto">
        <div className="text-xs font-mono uppercase tracking-wider text-[#0a84ff]">
          Simple &amp; Honest Pricing
        </div>
        <h1 className="h1-fluid font-display text-[#f2f7ff]">
          Always free. Optional Pro<span className="text-[#0a84ff]">.</span>
        </h1>
        <p className="body-fluid text-[#8fa3c0] leading-relaxed">
          Every tool on SmartToolHub is free for everyday use without an account. An optional Pro upgrade is available for power users who want higher daily limits and zero ads.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] gap-1 pt-1 mt-4">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-[#101c33] text-[#f2f7ff] shadow-sm'
                : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-[#0a84ff] text-white shadow-sm'
                : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
            }`}
          >
            <span>Annual (Save 18%)</span>
          </button>
        </div>
      </header>

      {/* Active Pro Banner if enabled */}
      {isProActive && (
        <div className="p-4 rounded-2xl bg-[rgba(10,132,255,0.08)] border border-[rgba(10,132,255,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#0a84ff]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-current shrink-0" />
            <span className="font-semibold">Pro Experience Active: All ads are suppressed site-wide.</span>
          </div>
          <button
            type="button"
            onClick={toggleProPreview}
            className="text-xs text-[#8fa3c0] hover:text-[#f2f7ff] underline"
          >
            Turn off Pro preview
          </button>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free Forever Plan Card */}
        <div className="glass-surface p-7 sm:p-8 rounded-3xl border border-[rgba(143,163,192,0.16)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#8fa3c0] uppercase">Free Plan</span>
              <span className="text-xs text-[#0a84ff] font-mono">No Sign-up Needed</span>
            </div>
            <div>
              <div className="text-4xl font-extrabold font-display text-[#f2f7ff]">$0</div>
              <div className="text-xs text-[#8fa3c0] mt-1">Free forever for everyone</div>
            </div>
            <ul className="space-y-3 text-sm text-[#8fa3c0] pt-2">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>All 8 everyday AI utility tools</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>Zero registration, passwords, or emails</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>Sub-30-second generations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>Local browser history storage</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>Supported by minimal non-intrusive ads</span>
              </li>
            </ul>
          </div>

          <Link
            href="/tools"
            navigate={navigate}
            className="w-full btn-glass text-xs justify-center"
          >
            Start Using Free Tools
          </Link>
        </div>

        {/* Pro Plan Card */}
        <div className="glass-surface p-7 sm:p-8 rounded-3xl border border-[rgba(139,92,246,0.35)] flex flex-col justify-between space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-36 h-36 bg-radial from-[rgba(139,92,246,0.15)] to-transparent pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#0a84ff] uppercase font-bold">Pro Plan</span>
              <span className="text-[11px] font-mono text-white bg-[#8b5cf6] px-2.5 py-0.5 rounded-md font-bold">
                Optional
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold font-display text-[#f2f7ff]">
                  {billingCycle === 'annual' ? '$49' : '$5'}
                </span>
                <span className="text-xs text-[#8fa3c0]">
                  {billingCycle === 'annual' ? '/ year ($4.08/mo)' : '/ month'}
                </span>
              </div>
              <div className="text-xs text-[#8fa3c0] mt-1">
                {billingCycle === 'annual' ? 'Billed annually · Cancel anytime' : 'Billed monthly · Cancel anytime'}
              </div>
            </div>
            <ul className="space-y-3 text-sm text-[#8fa3c0] pt-2">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span className="text-[#f2f7ff] font-medium">100% Ad-free experience</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>10&times; Higher daily generation limits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>Priority server queue during peak hours</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>Saved tool history cloud backup</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#34e0a1] shrink-0" />
                <span>Direct email support from Dhrumil</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 relative z-10">
            <button
              type="button"
              onClick={() => setShowCheckoutModal(true)}
              className="w-full btn-primary text-xs justify-center shadow-[0_4px_16px_rgba(11,107,240,0.28)]"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Upgrade to Pro ({billingCycle === 'annual' ? '$49/yr' : '$5/mo'})</span>
            </button>
            <button
              type="button"
              onClick={toggleProPreview}
              className="w-full text-center text-[11px] text-[#8fa3c0] hover:text-[#7db8ff] transition-colors py-1"
            >
              {isProActive ? 'Deactivate Pro Preview' : 'Preview Ad-Free Mode on this device'}
            </button>
          </div>
        </div>
      </div>

      {/* Security & Hosted Checkout Notice */}
      <section className="p-6 rounded-3xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] max-w-3xl mx-auto space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#f2f7ff]">
          <ShieldCheck className="w-5 h-5 text-[#34e0a1]" />
          <span>Zero Server-Side Card Storage Guarantee</span>
        </div>
        <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
          Your security comes first. Credit card, PayPal, and Apple Pay transactions are processed entirely through encrypted, PCI-DSS Level 1 hosted checkout pages. No card numbers or banking secrets ever touch our server. Webhook signatures are verified cryptographically.
        </p>
      </section>

      {/* Pricing FAQ */}
      <section className="space-y-4 max-w-3xl mx-auto pt-4 border-t border-[rgba(143,163,192,0.12)]">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f2f7ff]">
          Pricing &amp; Billing Questions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#8fa3c0]">
          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-1.5">
            <div className="font-semibold text-[#f2f7ff]">Can I cancel anytime?</div>
            <p className="text-xs leading-relaxed">
              Yes. You can cancel with one click from your billing portal. You will retain Pro benefits until the end of your billing cycle.
            </p>
          </div>
          <div className="glass-surface p-5 rounded-2xl border border-[rgba(143,163,192,0.12)] space-y-1.5">
            <div className="font-semibold text-[#f2f7ff]">What happens if I stay on Free?</div>
            <p className="text-xs leading-relaxed">
              Nothing! All 8 tools will remain 100% free with no expiration, supported by minimal ads.
            </p>
          </div>
        </div>
      </section>

      {/* Hosted Checkout Info Modal */}
      {showCheckoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/85 backdrop-blur-[16px]"
          onClick={() => setShowCheckoutModal(false)}
        >
          <div
            className="w-full max-w-md glass-surface rounded-3xl border border-[rgba(10,132,255,0.3)] p-6 space-y-5 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0a1424] border border-[rgba(10,132,255,0.3)] flex items-center justify-center text-[#0a84ff]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[#f2f7ff]">
                  Secure Hosted Checkout
                </h3>
                <p className="text-xs text-[#8fa3c0]">PCI-DSS Level 1 Encrypted</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#8fa3c0] leading-relaxed">
              You are upgrading to <strong>SmartToolHub Pro ({billingCycle === 'annual' ? '$49/year' : '$5/month'})</strong>. You will be redirected to the secure hosted checkout portal where payment is handled directly without sharing card details with our servers.
            </p>

            <div className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8fa3c0]">Plan:</span>
                <span className="text-[#f2f7ff] font-medium">SmartToolHub Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8fa3c0]">Cycle:</span>
                <span className="text-[#f2f7ff] font-medium">{billingCycle === 'annual' ? 'Annual ($49)' : 'Monthly ($5)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8fa3c0]">Ads:</span>
                <span className="text-[#0a84ff] font-bold">100% Removed</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  toggleProPreview();
                  setShowCheckoutModal(false);
                }}
                className="flex-1 btn-primary text-xs"
              >
                <span>Activate Pro Experience</span>
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="btn-glass text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
