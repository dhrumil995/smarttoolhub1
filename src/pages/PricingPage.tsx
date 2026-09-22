import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { usePro } from '../context/ProContext';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  ArrowRight,
  Cpu,
  Terminal,
  CreditCard,
  ExternalLink,
  Lock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Key
} from 'lucide-react';
import { DodoPaymentsModal } from '../components/DodoPaymentsModal';

interface PricingPageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'lifetime'>('lifetime');
  const { isPro, setIsPro, activatePro, deactivatePro } = usePro();
  const [activationNotice, setActivationNotice] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<{
    code?: string;
    title?: string;
    message: string;
    actionUrl?: string;
    actionLabel?: string;
    showTestModal?: boolean;
    showSettingsModal?: boolean;
  } | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState<string | null>(null);
  const [subscriptionIssue, setSubscriptionIssue] = useState<{
    status: string;
    failureReason?: string;
    customerId?: string;
    subscriptionId?: string;
  } | null>(null);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  // Test Payment Terminal Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testCardNumber, setTestCardNumber] = useState('4242 4242 4242 4242');
  const [testCardExp, setTestCardExp] = useState('12/28');
  const [testCardCvc, setTestCardCvc] = useState('888');
  const [testCardName, setTestCardName] = useState('Dhrumil Aslaliya');
  const [isProcessingTestPayment, setIsProcessingTestPayment] = useState(false);
  const [testPaymentError, setTestPaymentError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch server subscription repository status
    fetch('/api/dodo/subscription-status')
      .then((res) => res.json())
      .then((data) => {
        if (data?.isPro) {
          activatePro();
        }
        if (data?.needsPaymentMethodUpdate || data?.status === 'on_hold') {
          setSubscriptionIssue({
            status: data.status,
            failureReason: data.failureReason,
            customerId: data.customerId,
            subscriptionId: data.subscriptionId,
          });
        }
      })
      .catch(() => {});

    // 2. Check for payment return query params and securely verify
    const searchParams = new URLSearchParams(window.location.search);
    const hasPaymentSuccess = searchParams.get('payment') === 'success' || searchParams.get('checkout_status') === 'completed';
    const sessionId = searchParams.get('session_id') || searchParams.get('checkout_id') || '';
    const paymentId = searchParams.get('payment_id') || '';
    const planParam = searchParams.get('plan') || 'lifetime';

    if (hasPaymentSuccess && (sessionId || paymentId)) {
      // Secure server-side check with payment gateway
      fetch('/api/dodo/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, paymentId, plan: planParam }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.verified) {
            activatePro();
            setPaymentSuccessNotice(
              `🎉 Verified purchase (${data.plan === 'yearly' ? 'Annual Pass' : 'Lifetime Access'})! SmartToolHub Pro is now active.`
            );
          } else {
            setCheckoutError({
              message: data.error_message || data.message || 'Payment verification could not be validated.',
            });
          }
        })
        .catch(() => {
          // Verification failed - do not activate
        });
      // Clean up query params from URL without reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleOpenCustomerPortal = async () => {
    try {
      setIsOpeningPortal(true);
      const res = await fetch('/api/dodo/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: subscriptionIssue?.customerId,
          subscriptionId: subscriptionIssue?.subscriptionId,
          returnUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Failed to open customer portal:', err);
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const handleDodoCheckout = async (plan: 'lifetime' | 'yearly') => {
    if (isPro) {
      setPaymentSuccessNotice(
        `SmartToolHub Pro is already active! All AI tools and workflows are fully unlocked. To test checkout again, click "Switch to Free Tier (Test Mode)".`
      );
      return;
    }

    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/dodo/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          customerEmail: 'subscriber@smarttoolhub.com',
          customerName: 'SmartToolHub Pro Subscriber',
          returnUrl: `${window.location.origin}/pricing?payment=success&plan=${plan}`,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        try {
          const text = await res.text();
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }
      }

      if (res.ok && data?.success !== false && data?.checkout_url) {
        // Safely redirect to Dodo hosted checkout
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = data.checkout_url;
          } else {
            window.location.href = data.checkout_url;
          }
        } catch {
          window.location.href = data.checkout_url;
        }
        return;
      }

      // Check if response indicates merchant not live or 403 gateway rejection
      const isForbiddenOrMerchantNotLive =
        res.status === 403 ||
        data?.error_code === 'MERCHANT_NOT_LIVE' ||
        data?.details?.code === 'MERCHANT_NOT_LIVE' ||
        (typeof data?.error_message === 'string' && (
          data.error_message.includes('403') ||
          data.error_message.includes('MERCHANT_NOT_LIVE') ||
          data.error_message.includes('Live payments') ||
          data.error_message.includes('Gateway error')
        ));

      if (isForbiddenOrMerchantNotLive) {
        setCheckoutError({
          code: 'MERCHANT_NOT_LIVE',
          title: 'Dodo Payments Verification Required (HTTP 403)',
          message:
            'Your Dodo Payments credentials and product are connected, but Live Payments are pending approval on your Dodo Payments merchant profile. Please complete business verification on app.dodopayments.com before real card transactions can be processed. You can also use the Test Card Payment Terminal below to test the full checkout and activate Pro right now.',
          actionUrl: 'https://app.dodopayments.com',
          actionLabel: 'Open Dodo Dashboard',
          showTestModal: true,
          showSettingsModal: true,
        });
      } else {
        setCheckoutError({
          code: data?.error_code || `HTTP_${res.status}`,
          title: 'Payment Gateway Notice',
          message:
            data?.error_message ||
            data?.message ||
            'Payment gateway could not initialize checkout session. Please check your credentials or test with the payment terminal below.',
          actionUrl: 'https://app.dodopayments.com',
          actionLabel: 'Open Dodo Dashboard',
          showTestModal: true,
          showSettingsModal: true,
        });
      }
    } catch (err: any) {
      console.error('[PricingPage] Checkout exception:', err);
      setCheckoutError({
        title: 'Connection Notice',
        message:
          err?.message ||
          'Unable to reach payment gateway. You can use the test payment terminal below to simulate checkout and unlock Pro.',
        showTestModal: true,
        showSettingsModal: true,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleProcessTestPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestPaymentError(null);
    setIsProcessingTestPayment(true);

    try {
      const res = await fetch('/api/dodo/submit-test-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: billingCycle,
          cardNumber: testCardNumber,
          customerName: testCardName,
          customerEmail: 'subscriber@smarttoolhub.com',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error_message || 'Payment simulation declined.');
      }

      activatePro();
      setIsTestModalOpen(false);
      setCheckoutError(null);
      setPaymentSuccessNotice(
        `🎉 Payment of $${billingCycle === 'lifetime' ? '39.00' : '19.00'} verified! SmartToolHub Pro is now active.`
      );
    } catch (err: any) {
      setTestPaymentError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessingTestPayment(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header — Apple Style */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-normal text-[#2997FF] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Honest Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-tight">
          Supercharge Your Apple Ecosystem.
        </h1>
        <p className="text-sm sm:text-base text-[#86868B] leading-relaxed font-normal">
          SmartToolHub provides core verified workflows 100% free forever. 
          SmartToolHub Pro unlocks live Gemini AI multi-device workflow synthesis, deep ecosystem diagnostics, and automation script generation.
        </p>

        {/* Payment Success Notification */}
        {paymentSuccessNotice && (
          <div className="p-4 rounded-[20px] bg-emerald-500/20 border border-emerald-400/50 text-xs text-emerald-200 animate-fade-in text-center flex items-center justify-center gap-2 max-w-xl mx-auto shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{paymentSuccessNotice}</span>
          </div>
        )}

        {/* Subscription On-Hold / Payment Issue Notice */}
        {subscriptionIssue && (
          <div className="p-4 rounded-[20px] bg-amber-500/15 border border-amber-400/40 text-xs text-amber-200 animate-fade-in text-center flex flex-col sm:flex-row items-center justify-between gap-3 max-w-xl mx-auto shadow-lg">
            <div className="flex items-center gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-amber-300">Action Required: Subscription On Hold</p>
                <p className="text-[11px] text-amber-200/80">
                  {subscriptionIssue.failureReason || 'Your last renewal attempt was unsuccessful. Please update your billing method to prevent access revocation.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenCustomerPortal}
              disabled={isOpeningPortal}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isOpeningPortal ? 'Opening Portal...' : 'Update Payment Method'}
            </button>
          </div>
        )}

        {/* Checkout Error / Gateway Notice */}
        {checkoutError && (
          <div className="p-4 sm:p-5 rounded-[20px] bg-rose-500/15 border border-rose-400/40 text-xs text-rose-200 animate-fade-in max-w-xl mx-auto space-y-3.5 shadow-xl text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white text-sm">
                  {checkoutError.title || (checkoutError.code === 'MERCHANT_NOT_LIVE' ? 'Dodo Payments Verification Required (HTTP 403)' : 'Payment Gateway Notice')}
                </p>
                <p className="leading-relaxed text-rose-200/90 text-xs">
                  {checkoutError.message}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-rose-500/20">
              {checkoutError.showTestModal && (
                <button
                  onClick={() => setIsTestModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Test Card Payment ({billingCycle === 'lifetime' ? '$39.00' : '$19.00'})</span>
                </button>
              )}
              {checkoutError.showSettingsModal && (
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3 h-3 text-amber-300" />
                  <span>Gateway Settings</span>
                </button>
              )}
              {checkoutError.actionUrl && (
                <a
                  href={checkoutError.actionUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{checkoutError.actionLabel || 'Open Dashboard'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Current Status Banner & Reset Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel text-xs border border-white/[0.08]">
            <span className="text-[#86868B]">Current Plan:</span>
            <span className={`font-normal px-2.5 py-0.5 rounded-full text-[11px] ${
              isPro 
                ? 'bg-[#0071E3]/20 text-[#68B4FF] border border-[#0071E3]/40' 
                : 'bg-white/[0.06] text-[#86868B] border border-white/[0.08]'
            }`}>
              {isPro ? 'Pro Active (All AI Features Unlocked)' : 'Community Free (Curated Mode)'}
            </span>
          </div>

          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="px-3 py-1.5 rounded-full text-[11px] bg-white/[0.05] hover:bg-white/[0.1] text-[#86868B] hover:text-white border border-white/[0.08] transition-all cursor-pointer inline-flex items-center gap-1.5"
            title="Configure Dodo Payments API Keys, Webhooks & Test Mode"
          >
            <Key className="w-3 h-3 text-amber-300" />
            <span>Gateway Settings</span>
          </button>

          {isPro && (
            <button
              onClick={() => {
                deactivatePro();
                setPaymentSuccessNotice(null);
                setCheckoutError(null);
                fetch('/api/dodo/reset-subscription', { method: 'POST' }).catch(() => {});
              }}
              className="px-3 py-1.5 rounded-full text-[11px] bg-white/[0.05] hover:bg-rose-500/20 text-[#86868B] hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 transition-all cursor-pointer"
              title="Reset to Free Tier to test locked states and checkout flow"
            >
              Switch to Free Tier (Test Mode)
            </button>
          )}
        </div>

        {activationNotice && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-xs text-emerald-300 animate-fade-in text-center">
            ✓ SmartToolHub Pro activated! Server-side Gemini AI features are now unlocked.
          </div>
        )}

        {/* Toggle */}
        <div className="inline-flex items-center p-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs backdrop-blur-xl">
          <button
            onClick={() => setBillingCycle('lifetime')}
            className={`px-5 py-2 rounded-full font-normal transition-all duration-200 cursor-pointer ${
              billingCycle === 'lifetime'
                ? 'bg-[#0071E3] text-white shadow-md'
                : 'text-[#86868B] hover:text-white'
            }`}
          >
            Pay Once • Lifetime Access
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-full font-normal transition-all duration-200 cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-[#0071E3] text-white shadow-md'
                : 'text-[#86868B] hover:text-white'
            }`}
          >
            Annual Pass
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Tier 1: Community Free */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/15 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#888888] uppercase tracking-wider">
                Ecosystem Free
              </span>
              {!isPro && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-xs text-[#888888]">/ forever</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Full access to curated Apple ecosystem workflows, compatibility charts, and standard troubleshooting guides.
            </p>

            <div className="space-y-2.5 pt-4 text-xs border-t border-white/[0.08]">
              <div className="flex items-center gap-2.5 text-white font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All curated community workflows</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Device compatibility checker</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Official Apple documentation links</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-500">
                <span className="w-4 h-4 text-zinc-600 font-bold text-center shrink-0">✕</span>
                <span className="line-through text-zinc-500">Live Gemini AI Workflow Synthesizer</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-500">
                <span className="w-4 h-4 text-zinc-600 font-bold text-center shrink-0">✕</span>
                <span className="line-through text-zinc-500">AI AppleScript & Shortcuts Generator</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('library')}
            className="w-full py-2.5 rounded-xl glass-panel text-xs font-semibold text-white hover:text-white hover:border-white/30 transition-all cursor-pointer shadow-sm"
          >
            Explore Curated Library
          </button>
        </div>

        {/* Tier 2: Pro (Featured) */}
        <div 
          className="glass-card p-6 sm:p-8 rounded-2xl border border-blue-400/50 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)]"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                SmartToolHub Pro
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                {isPro ? 'Active Plan' : 'Unlocks All AI'}
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">
                {billingCycle === 'lifetime' ? '$39' : '$19'}
              </span>
              <span className="text-xs text-[#888888]">
                {billingCycle === 'lifetime' ? 'one-time' : '/ year'}
              </span>
            </div>

            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              For creators, freelancers, and power users who need customized multi-device synchrony and live AI generation powered by your API.
            </p>

            <div className="space-y-2.5 pt-4 text-xs border-t border-white/[0.08]">
              <div className="flex items-center gap-2.5 text-white font-medium">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Unlimited Gemini AI Workflow Synthesizer</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Gemini AI Deep Diagnostic Isolation Assistant</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>AI AppleScript, zsh & Shortcuts generator</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Export to native .shortcut files and shell scripts</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>All future macOS / iOS major version updates</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            {/* Primary Subscription Action with Dodo Payments */}
            <button
              onClick={() => handleDodoCheckout(billingCycle)}
              disabled={isCheckingOut}
              className="w-full py-3 rounded-xl glass-button-primary text-xs font-semibold text-white transition-all cursor-pointer relative z-10 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4 text-emerald-300" />
              <span>
                {isCheckingOut
                  ? 'Connecting to Dodo Payments...'
                  : isPro
                  ? `Active Pro Plan (${billingCycle === 'lifetime' ? '$39 Lifetime' : '$19/yr'})`
                  : `Subscribe with Dodo Payments (${billingCycle === 'lifetime' ? '$39 One-Time' : '$19/year'})`}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
            </button>

            {/* Security and Payment Method Badges */}
            <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-[#888888]">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted Checkout</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[#86868B]">
                <Lock className="w-3.5 h-3.5 text-[#86868B]" />
                <span>Apple Pay & Cards Accepted</span>
              </span>
            </div>

            <button
              onClick={() => onNavigate('generator')}
              className="w-full py-2 text-center text-xs text-[#888888] hover:text-white transition-colors cursor-pointer"
            >
              Go to AI Workflow Generator →
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Test Payment Terminal Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0F1115] border border-white/20 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Dodo Payments Checkout</h3>
                  <p className="text-[11px] text-[#86868B]">Interactive Payment Terminal</p>
                </div>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 rounded-lg text-[#86868B] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-xs">
              <div>
                <span className="text-white font-medium">SmartToolHub Pro</span>
                <span className="text-[#86868B] block text-[11px]">
                  {billingCycle === 'lifetime' ? 'Lifetime Access License' : 'Annual Pro Subscription'}
                </span>
              </div>
              <span className="text-base font-bold text-white">
                {billingCycle === 'lifetime' ? '$39.00' : '$79.00'}
              </span>
            </div>

            {testPaymentError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs text-rose-200">
                {testPaymentError}
              </div>
            )}

            {/* Credit Card Form */}
            <form onSubmit={handleProcessTestPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#86868B] mb-1 text-[11px]">Name on Card</label>
                <input
                  type="text"
                  required
                  value={testCardName}
                  onChange={(e) => setTestCardName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  placeholder="Cardholder name"
                />
              </div>

              <div>
                <label className="block text-[#86868B] mb-1 text-[11px]">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={testCardNumber}
                    onChange={(e) => setTestCardNumber(e.target.value)}
                    className="w-full px-3 py-2 pl-9 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-blue-500"
                    placeholder="4242 4242 4242 4242"
                  />
                  <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#86868B] mb-1 text-[11px]">Expires (MM/YY)</label>
                  <input
                    type="text"
                    required
                    value={testCardExp}
                    onChange={(e) => setTestCardExp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-[#86868B] mb-1 text-[11px]">CVC / CVV</label>
                  <input
                    type="text"
                    required
                    value={testCardCvc}
                    onChange={(e) => setTestCardCvc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessingTestPayment}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isProcessingTestPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        Pay {billingCycle === 'lifetime' ? '$39.00' : '$79.00'} & Unlock Pro
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center text-[10px] text-[#86868B] flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated Dodo Payments checkout for testing payment validation.</span>
            </div>
          </div>
        </div>
      )}

      {/* Trust & Security Notice */}
      <div className="max-w-3xl mx-auto glass-panel p-5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#888888]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-white">Bank-Grade 256-Bit Encryption</div>
            <div className="text-[11px] text-[#888888]">Global tax compliance, PCI-DSS Level 1 security, Apple Pay & credit card processing.</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PCI-DSS Level 1</span>
          </span>
        </div>
      </div>

      {/* Affiliate & Editorial Integrity Disclosure */}
      <div className="max-w-3xl mx-auto glass-card p-6 rounded-2xl border border-white/10 space-y-2 text-xs text-[#888888]">
        <div className="flex items-center gap-2 font-semibold text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Affiliate & Editorial Integrity Disclosure</span>
        </div>
        <p className="leading-relaxed">
          Some hardware accessories mentioned (e.g., Belkin MagSafe mounts for Continuity Camera, CalDigit Thunderbolt docks) may contain affiliate links. 
          SmartToolHub does not accept sponsorships to favor specific hardware or apps. We always recommend Apple's built-in, zero-cost solutions first.
        </p>
      </div>

      {/* Dodo Payments Gateway Configuration Modal */}
      <DodoPaymentsModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onConfigSaved={() => {
          setIsConfigModalOpen(false);
          setPaymentSuccessNotice('✓ Dodo Payments gateway configuration updated successfully.');
        }}
      />
    </div>
  );
};


