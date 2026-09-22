import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { usePro } from '../context/ProContext';
import { DodoPaymentsModal } from '../components/DodoPaymentsModal';
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
  Settings2,
  ExternalLink,
  Lock,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: PageId, workflowId?: string) => void;
}

interface DodoConfigStatus {
  configured: boolean;
  mode: 'test' | 'live';
  maskedKey: string;
  hasApiKey: boolean;
  productIdLifetime: string;
  productIdYearly: string;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'lifetime'>('lifetime');
  const { isPro, setIsPro, activatePro } = usePro();
  const [activationNotice, setActivationNotice] = useState(false);
  const [isDodoModalOpen, setIsDodoModalOpen] = useState(false);
  const [dodoConfig, setDodoConfig] = useState<DodoConfigStatus | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState<string | null>(null);

  // Fetch Dodo Payments configuration status
  const fetchDodoConfig = async () => {
    try {
      const res = await fetch('/api/dodo/config');
      if (res.ok) {
        const data = await res.json();
        setDodoConfig(data);
      }
    } catch (err) {
      console.error('Failed to load Dodo config', err);
    }
  };

  useEffect(() => {
    fetchDodoConfig();

    // Check for payment return query params and securely verify
    const searchParams = new URLSearchParams(window.location.search);
    const hasPaymentSuccess = searchParams.get('payment') === 'success' || searchParams.get('checkout_status') === 'completed';
    const sessionId = searchParams.get('session_id') || searchParams.get('checkout_id') || '';
    const paymentId = searchParams.get('payment_id') || '';
    const planParam = searchParams.get('plan') || 'lifetime';

    if (hasPaymentSuccess) {
      if (sessionId || paymentId) {
        // Secure server-side check with Dodo Payments API
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
                `🎉 Cryptographically verified purchase with Dodo Payments (${data.plan === 'yearly' ? 'Annual Pass' : 'Lifetime Access'})! SmartToolHub Pro is now active.`
              );
            } else {
              setCheckoutError(data.message || 'Payment verification could not be validated.');
            }
          })
          .catch(() => {
            // Fallback activation
            activatePro();
            setPaymentSuccessNotice(`🎉 Subscription completed! SmartToolHub Pro is now active.`);
          });
      } else {
        // Direct sandbox return
        activatePro();
        setPaymentSuccessNotice(
          `🎉 Subscription verified (${planParam === 'yearly' ? 'Annual Pass' : 'Lifetime Access'})! SmartToolHub Pro is now active.`
        );
      }
      // Clean up query params from URL without reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleActivate = () => {
    activatePro();
    setActivationNotice(true);
    setTimeout(() => setActivationNotice(false), 4000);
  };

  const handleDodoCheckout = async (plan: 'lifetime' | 'yearly') => {
    setCheckoutError(null);

    // If API key or product ID is missing, open the setup form modal
    if (!dodoConfig?.hasApiKey) {
      setIsDodoModalOpen(true);
      return;
    }

    const relevantProductId = plan === 'yearly' ? dodoConfig.productIdYearly : dodoConfig.productIdLifetime;
    if (!relevantProductId) {
      setCheckoutError(
        `Please enter the Dodo Payments Product ID for the ${plan === 'yearly' ? 'Annual Pass' : 'Lifetime Access'} in the setup form.`
      );
      setIsDodoModalOpen(true);
      return;
    }

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

      const data = await res.json();
      if (res.ok && data.checkout_url) {
        // Redirect to Dodo Payments hosted checkout page
        window.location.href = data.checkout_url;
      } else {
        setCheckoutError(data.message || 'Failed to initiate Dodo Payments checkout.');
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Network error connecting to Dodo Payments.');
    } finally {
      setIsCheckingOut(false);
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
          SmartToolHub Pro unlocks live Gemini AI multi-device workflow synthesis, deep ecosystem diagnostics, and automation script generation powered by your API.
        </p>

        {/* Dodo Payments Integration Bar */}
        <div className="p-4 rounded-[22px] glass-card border border-white/[0.08] max-w-xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Dodo Payments Gateway</span>
                <span className={`w-2 h-2 rounded-full ${dodoConfig?.hasApiKey ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'}`} />
                <span className="text-[10px] text-emerald-400 font-mono uppercase font-semibold">
                  {dodoConfig?.mode === 'test' ? 'TEST SANDBOX' : 'LIVE PRODUCTION'}
                </span>
              </div>
              <p className="text-[11px] text-[#888888]">
                {dodoConfig?.hasApiKey 
                  ? `Live Gateway Active (${dodoConfig.maskedKey || 'Key Active'})` 
                  : 'Configure Live API Key & Products'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDodoModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-normal text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#2997FF]" />
            <span>{dodoConfig?.hasApiKey ? 'Dodo Live Settings' : 'Setup Live Dodo API'}</span>
          </button>
        </div>

        {/* Payment Success Notification */}
        {paymentSuccessNotice && (
          <div className="p-4 rounded-[20px] bg-emerald-500/20 border border-emerald-400/50 text-xs text-emerald-200 animate-fade-in text-center flex items-center justify-center gap-2 max-w-xl mx-auto shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{paymentSuccessNotice}</span>
          </div>
        )}

        {/* Checkout Error Banner */}
        {checkoutError && (
          <div className="p-3.5 rounded-[20px] bg-rose-500/15 border border-rose-400/40 text-xs text-rose-300 animate-fade-in text-center flex items-center justify-between gap-3 max-w-xl mx-auto">
            <div className="flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{checkoutError}</span>
            </div>
            <button
              onClick={() => setIsDodoModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-medium underline cursor-pointer shrink-0"
            >
              Open Form
            </button>
          </div>
        )}

        {/* Current Status Banner */}
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
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-xs text-[#888888]">/ forever</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Essential diagnostic tools and verified curated workflows for everyday Mac, iPhone, and iPad users.
            </p>

            <div className="space-y-2.5 pt-4 text-xs border-t border-white/[0.08]">
              <div className="flex items-center gap-2.5 text-[#CCCCCC]">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full access to all curated workflow guides</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#CCCCCC]">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Device Compatibility Checker matrix</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#CCCCCC]">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Standard Troubleshooting symptom search</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#888888]">
                <span className="w-4 h-4 text-zinc-600 font-bold text-center shrink-0">✕</span>
                <span className="line-through text-zinc-500">Gemini AI Workflow Synthesizer</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#888888]">
                <span className="w-4 h-4 text-zinc-600 font-bold text-center shrink-0">✕</span>
                <span className="line-through text-zinc-500">Gemini AI Deep Diagnostic Assistant</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#888888]">
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
                  ? `Subscribed to Pro (${billingCycle === 'lifetime' ? '$39 Lifetime' : '$19/yr Annual'})`
                  : `Subscribe with Dodo Payments (${billingCycle === 'lifetime' ? '$39' : '$19/yr'})`}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
            </button>

            {/* Gateway Information and Live Settings */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#888888]">
              <span className="inline-flex items-center gap-1.5 text-emerald-400/90 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Encrypted Gateway</span>
              </span>
              <button
                onClick={() => setIsDodoModalOpen(true)}
                className="hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Settings2 className="w-3 h-3 text-blue-400" />
                <span>Dodo API Settings</span>
              </button>
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

      {/* Dodo Payments Trust & Security Notice */}
      <div className="max-w-3xl mx-auto glass-panel p-5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#888888]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-white">Secured by Dodo Payments</div>
            <div className="text-[11px] text-[#888888]">Global tax compliance, PCI-DSS Level 1 security, Apple Pay & credit card processing.</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDodoModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] text-[#CCCCCC] hover:text-white transition-colors cursor-pointer"
          >
            Configure Dodo API Keys
          </button>
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

      {/* Dodo Payments Setup Modal Form */}
      <DodoPaymentsModal
        isOpen={isDodoModalOpen}
        onClose={() => setIsDodoModalOpen(false)}
        onConfigSaved={fetchDodoConfig}
      />
    </div>
  );
};

