import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Lock,
  ArrowRight,
  Info,
  Download,
  Image as ImageIcon
} from 'lucide-react';

interface DodoPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

interface DodoConfigState {
  configured: boolean;
  mode: 'test' | 'live';
  maskedKey: string;
  hasApiKey: boolean;
  productIdLifetime: string;
  productIdYearly: string;
  hasWebhookSecret: boolean;
  endpoint: string;
}

export const DodoPaymentsModal: React.FC<DodoPaymentsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [mode, setMode] = useState<'test' | 'live'>('test');
  const [productIdLifetime, setProductIdLifetime] = useState('');
  const [productIdYearly, setProductIdYearly] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<DodoConfigState | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  // Load existing configuration on open
  useEffect(() => {
    if (isOpen) {
      loadConfig();
      setStatusMessage(null);
      setTestResult(null);
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dodo/config');
      if (res.ok) {
        const data: DodoConfigState = await res.json();
        setCurrentConfig(data);
        setMode(data.mode || 'test');
        setProductIdLifetime(data.productIdLifetime || '');
        setProductIdYearly(data.productIdYearly || '');
      }
    } catch (err) {
      console.error('Failed to load Dodo Payments config', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const payload: any = {
        mode,
        productIdLifetime,
        productIdYearly,
        webhookSecret,
      };
      if (apiKey.trim()) {
        payload.apiKey = apiKey.trim();
      }

      const res = await fetch('/api/dodo/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Dodo Payments settings saved successfully!' });
        setApiKey(''); // Clear entered raw key for security
        await loadConfig();
        if (onConfigSaved) onConfigSaved();
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to save settings.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Network error while saving.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/dodo/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim() || undefined,
          mode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message,
          count: data.productsCount,
        });
      } else {
        setTestResult({
          success: false,
          message: data.message || 'Connection failed. Please check your API key.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Failed to reach Dodo Payments server.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="glass-card w-full max-w-2xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#888888] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-xs font-semibold text-emerald-300">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Dodo Payments Integration</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Configure Dodo Payments API
          </h2>
          <p className="text-xs text-[#888888] leading-relaxed">
            Enter your secret API credentials and Product IDs from your{' '}
            <a 
              href="https://app.dodopayments.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
            >
              Dodo Payments Dashboard <ExternalLink className="w-3 h-3 inline" />
            </a>{' '}
            to enable live customer checkout and recurring subscriptions.
          </p>
        </div>

        {/* Current Status Pill */}
        <div className="mt-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${currentConfig?.configured ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'}`} />
            <span className="text-[#CCCCCC] font-medium">
              Status: {currentConfig?.configured ? 'API Key Configured' : 'API Key Not Set'}
            </span>
            {currentConfig?.maskedKey && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/[0.06] text-[#A3A3A3] border border-white/10">
                {currentConfig.maskedKey}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full uppercase font-mono font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {currentConfig?.mode || mode} Mode
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-5">
          
          {/* Environment Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center justify-between">
              <span>Environment Mode</span>
              <span className="text-[11px] font-normal text-[#888888]">
                {mode === 'test' ? 'Uses https://test.dodopayments.com' : 'Uses https://live.dodopayments.com'}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
              <button
                type="button"
                onClick={() => setMode('test')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'test'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                Test Sandbox (Recommended for setup)
              </button>
              <button
                type="button"
                onClick={() => setMode('live')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'live'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                Live Production (Real transactions)
              </button>
            </div>
          </div>

          {/* Dodo Payments API Key Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="dodo-api-key" className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                <span>Dodo Payments Secret API Key</span>
              </label>
              <a
                href="https://app.dodopayments.com/developer/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
              >
                Find key in Dodo Console <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative">
              <input
                id="dodo-api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={currentConfig?.hasApiKey ? `Leave blank to keep existing key (${currentConfig.maskedKey})` : 'e.g. live_sk_... or test_sk_...'}
                className="w-full px-4 py-2.5 pr-20 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400/80 transition-all font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 text-[#888888] hover:text-white transition-colors cursor-pointer"
                  title={showApiKey ? 'Hide key' : 'Show key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#888888]">
              Your secret API key is handled purely server-side and never exposed to client browsers.
            </p>
          </div>

          {/* Product IDs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Lifetime Plan Product ID */}
            <div className="space-y-1.5">
              <label htmlFor="dodo-prod-lifetime" className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Lifetime Plan Product ID</span>
              </label>
              <input
                id="dodo-prod-lifetime"
                type="text"
                value={productIdLifetime}
                onChange={(e) => setProductIdLifetime(e.target.value)}
                placeholder="e.g. p_prod_lifetime_01"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400/80 transition-all font-mono"
              />
              <span className="text-[10px] text-[#888888] block">
                Maps to the $39 one-time Pro pass
              </span>
            </div>

            {/* Annual Pass Product ID */}
            <div className="space-y-1.5">
              <label htmlFor="dodo-prod-yearly" className="text-xs font-semibold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Annual Pass Product ID</span>
              </label>
              <input
                id="dodo-prod-yearly"
                type="text"
                value={productIdYearly}
                onChange={(e) => setProductIdYearly(e.target.value)}
                placeholder="e.g. p_prod_yearly_01"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400/80 transition-all font-mono"
              />
              <span className="text-[10px] text-[#888888] block">
                Maps to the $19/year subscription
              </span>
            </div>
          </div>

          {/* Optional Webhook Secret */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label htmlFor="dodo-webhook-secret" className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Webhook Secret Key (Optional)</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">POST /api/dodo/webhook</span>
            </div>
            <div className="relative">
              <input
                id="dodo-webhook-secret"
                type={showWebhookSecret ? 'text' : 'password'}
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder={currentConfig?.hasWebhookSecret ? '•••••••• (Webhook secret configured)' : 'e.g. whsec_...'}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400/80 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white"
              >
                {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                : 'bg-rose-500/15 border-rose-400/40 text-rose-300'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Test Result Box */}
          {testResult && (
            <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              testResult.success 
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300' 
                : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                )}
                <span>{testResult.success ? 'API Connection Verified' : 'Connection Check Notice'}</span>
              </div>
              <p className="text-[11px] leading-relaxed pl-6 opacity-90">{testResult.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-[#CCCCCC] hover:text-white transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Pinging Dodo...' : 'Test API Connection'}</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#888888] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>{isLoading ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Product Media Asset for Dodo Payments Dashboard */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Dodo Payments Product Image (Ready to Upload)</span>
            </div>
            <a
              href="/product-cover.jpg"
              download="smarttoolhub-pro-cover.jpg"
              className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Image</span>
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-4">
            <img
              src="/product-cover.jpg"
              alt="SmartToolHub Pro Product Cover"
              className="w-16 h-16 rounded-lg object-cover border border-white/20 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-[11px] text-[#A3A3A3] space-y-1">
              <p className="text-white font-medium">SmartToolHub Pro 3D Product Badge</p>
              <p>Square 1:1 format optimized for Dodo Payments' "Media & Description" image upload.</p>
              <p className="text-[10px] font-mono text-[#888888]">
                Direct image path: <span className="text-blue-300 select-all">/product-cover.jpg</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Help Accordion */}
        <div className="mt-6 pt-5 border-t border-white/10 text-xs text-[#888888] space-y-2.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#CCCCCC]">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>How to setup Dodo Payments:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
            <li>Log into your <strong>app.dodopayments.com</strong> merchant dashboard.</li>
            <li>Click <strong>Developer → API Keys</strong> and generate a secret key.</li>
            <li>Create your Products under <strong>Products</strong> (e.g. Pro Lifetime and Pro Annual) and copy their Product IDs.</li>
            <li>Paste the credentials into this form and click <strong>Save Configuration</strong>.</li>
            <li>Checkout sessions will automatically generate conversion-optimized hosted payment pages!</li>
          </ol>
        </div>

      </div>
    </div>
  );
};
