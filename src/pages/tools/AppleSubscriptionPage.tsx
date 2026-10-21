import React, { useState, useEffect } from 'react';
import { Repeat, Plus, Trash2, Check, AlertCircle, Sparkles, DollarSign, ShieldCheck, Tag } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface AppleSubscriptionPageProps {
  navigate: (path: string) => void;
}

interface SubscriptionItem {
  id: string;
  name: string;
  monthlyCost: number;
  category: 'music' | 'storage' | 'tv' | 'gaming' | 'bundle' | 'fitness' | 'other';
}

const STORAGE_KEY = 'smarttoolhub_apple_subscriptions';

const DEFAULT_PRESETS: SubscriptionItem[] = [
  { id: 'sub-music', name: 'Apple Music (Individual)', monthlyCost: 10.99, category: 'music' },
  { id: 'sub-icloud-200', name: 'iCloud+ 200GB', monthlyCost: 2.99, category: 'storage' },
  { id: 'sub-tv', name: 'Apple TV+', monthlyCost: 9.99, category: 'tv' },
];

const CATALOG_PRESETS: { name: string; monthlyCost: number; category: SubscriptionItem['category'] }[] = [
  { name: 'Apple One (Individual)', monthlyCost: 19.95, category: 'bundle' },
  { name: 'Apple One (Family)', monthlyCost: 25.95, category: 'bundle' },
  { name: 'Apple One (Premier)', monthlyCost: 37.95, category: 'bundle' },
  { name: 'iCloud+ (50GB)', monthlyCost: 0.99, category: 'storage' },
  { name: 'iCloud+ (200GB)', monthlyCost: 2.99, category: 'storage' },
  { name: 'iCloud+ (2TB)', monthlyCost: 9.99, category: 'storage' },
  { name: 'Apple Music (Individual)', monthlyCost: 10.99, category: 'music' },
  { name: 'Apple Music (Family)', monthlyCost: 16.99, category: 'music' },
  { name: 'Apple TV+', monthlyCost: 9.99, category: 'tv' },
  { name: 'Apple Arcade', monthlyCost: 6.99, category: 'gaming' },
  { name: 'Apple Fitness+', monthlyCost: 9.99, category: 'fitness' },
  { name: 'Apple News+', monthlyCost: 12.99, category: 'other' },
  { name: 'AppleCare+ (Monthly)', monthlyCost: 9.99, category: 'other' },
];

export const AppleSubscriptionPage: React.FC<AppleSubscriptionPageProps> = ({ navigate }) => {
  const [items, setItems] = useState<SubscriptionItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return DEFAULT_PRESETS;
  });

  const [customName, setCustomName] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');
  const { showToast } = useToast();

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'apple-subscription-calculator') || LAUNCH_TOOLS[15];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'iphone-storage-planner' || t.slug === 'apple-shortcuts-generator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'mastering-apple-shortcuts-ios') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Solitary user: Apple Music ($10.99) + iCloud 200GB ($2.99)',
    'Family bundle: Apple Music Family + iCloud 2TB + TV+',
    'Fitness & News power user with Apple One Premier',
  ];

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Fallback
    }
  }, [items]);

  const monthlyTotal = items.reduce((acc, item) => acc + item.monthlyCost, 0);
  const annualTotal = monthlyTotal * 12;

  // Apple One Bundle Analysis
  // Individual Apple One ($19.95) includes: Apple Music ($10.99) + Apple TV+ ($9.99) + Apple Arcade ($6.99) + iCloud 50GB ($0.99) = $28.96 standalone value.
  const hasMusic = items.some((i) => i.name.includes('Music'));
  const hasTV = items.some((i) => i.name.includes('TV+'));
  const hasArcade = items.some((i) => i.name.includes('Arcade'));
  const hasCloud = items.some((i) => i.name.includes('iCloud'));
  const hasBundle = items.some((i) => i.category === 'bundle');

  let bundleRecommendation = '';
  if (!hasBundle && (hasMusic && hasTV) && monthlyTotal > 19.95) {
    const standaloneValue = 28.96;
    const diff = monthlyTotal - 19.95;
    if (diff > 0) {
      bundleRecommendation = `Switching to Apple One Individual ($19.95/mo) would save you $${diff.toFixed(2)}/month ($${(diff * 12).toFixed(2)}/year) while adding Apple Arcade and 50GB iCloud.`;
    }
  }

  const handleAddPreset = (preset: typeof CATALOG_PRESETS[0]) => {
    const newItem: SubscriptionItem = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: preset.name,
      monthlyCost: preset.monthlyCost,
      category: preset.category,
    };
    setItems((prev) => [...prev, newItem]);
    showToast(`Added ${preset.name}`);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(customPrice);
    if (!customName.trim() || isNaN(price) || price <= 0) {
      showToast('Please enter a valid service name and positive monthly cost');
      return;
    }
    const newItem: SubscriptionItem = {
      id: `sub-${Date.now()}`,
      name: customName.trim(),
      monthlyCost: price,
      category: 'other',
    };
    setItems((prev) => [...prev, newItem]);
    setCustomName('');
    setCustomPrice('');
    showToast(`Added ${newItem.name}`);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Subscription removed');
  };

  const handleChipClick = (chip: string) => {
    if (chip.includes('Solitary user')) {
      setItems([
        { id: '1', name: 'Apple Music (Individual)', monthlyCost: 10.99, category: 'music' },
        { id: '2', name: 'iCloud+ (200GB)', monthlyCost: 2.99, category: 'storage' },
      ]);
    } else if (chip.includes('Family bundle')) {
      setItems([
        { id: '1', name: 'Apple Music (Family)', monthlyCost: 16.99, category: 'music' },
        { id: '2', name: 'iCloud+ (2TB)', monthlyCost: 9.99, category: 'storage' },
        { id: '3', name: 'Apple TV+', monthlyCost: 9.99, category: 'tv' },
      ]);
    } else {
      setItems([
        { id: '1', name: 'Apple One (Premier)', monthlyCost: 37.95, category: 'bundle' },
        { id: '2', name: 'AppleCare+ (Monthly)', monthlyCost: 9.99, category: 'other' },
      ]);
    }
  };

  const handleCompute = (text: string) => {
    return {
      result: `Apple Subscription Cost Audit:
Active Subscriptions: ${items.length} services
Monthly Spending: $${monthlyTotal.toFixed(2)}/month
Annual Spending: $${annualTotal.toFixed(2)}/year

Active Services:
${items.map((i) => `- ${i.name}: $${i.monthlyCost.toFixed(2)}/mo`).join('\n')}

${bundleRecommendation ? `\nRecommendation:\n${bundleRecommendation}` : '\nYour subscription setup is currently well optimized.'}`,
      rawData: { items, monthlyTotal, annualTotal, bundleRecommendation },
    };
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Apple Subscription Cost Calculator"
      subheading="Audit your recurring Apple services spending across iCloud, Apple Music, TV+, and Apple One. Discover hidden bundle savings and track your total annual cost."
      inputLabel="Subscription Audit Workspace"
      inputPlaceholder="Add your active Apple subscriptions from the quick presets below..."
      examplePrompt={exampleChips[0]}
      exampleChips={exampleChips}
      generateButtonText="Calculate Subscription Audit"
      lastUpdated="October 2026"
      navigate={navigate}
      onClientCompute={handleCompute}
      extraControls={
        <div className="space-y-6 pt-2">
          {/* Quick Add Presets Grid */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
              Quick Add Official Apple Subscriptions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATALOG_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="p-2.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] hover:border-[#8b5cf6] text-left transition-colors focus-ring group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f2f7ff] truncate group-hover:text-[#8b5cf6]">
                      {preset.name}
                    </span>
                    <Plus size={14} className="text-[#8fa3c0] group-hover:text-[#8b5cf6] shrink-0" />
                  </div>
                  <div className="text-[11px] font-mono text-[#8fa3c0] mt-0.5">
                    ${preset.monthlyCost.toFixed(2)}/mo
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Subscription Form */}
          <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0] block">
              Add Custom Service or App Subscription
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. Spotify, YouTube Premium, ChatGPT Plus..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="flex-1 bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl px-3 py-2 text-xs text-[#f2f7ff] placeholder:text-[#8fa3c0]/50 focus-ring"
              />
              <div className="flex gap-2">
                <div className="relative w-28">
                  <span className="absolute left-3 top-2 text-xs text-[#8fa3c0] font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="9.99"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full bg-[#101c33] border border-[rgba(143,163,192,0.2)] rounded-xl pl-6 pr-3 py-2 text-xs text-[#f2f7ff] font-mono focus-ring"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddCustom}
                  className="gap-1.5"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Active Subscriptions List */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8fa3c0]">
                Active Subscriptions ({items.length})
              </label>
              <button
                type="button"
                onClick={() => {
                  setItems([]);
                  showToast('Cleared all subscriptions');
                }}
                className="text-[11px] font-mono text-[#8fa3c0] hover:text-[#ff5c7a] transition-colors focus-ring rounded px-1"
              >
                Clear all
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.14)] text-xs text-[#8fa3c0]">
                No subscriptions added yet. Click one of the quick presets above or select an example chip.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#f2f7ff]">{item.name}</div>
                      <div className="text-[11px] font-mono text-[#8fa3c0]">
                        ${item.monthlyCost.toFixed(2)}/mo · ${(item.monthlyCost * 12).toFixed(2)}/yr
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-lg text-[#8fa3c0] hover:text-[#ff5c7a] hover:bg-[#290c14] transition-colors focus-ring"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      }
      customResultRenderer={({ result }) => (
        <div className="space-y-6">
          {/* Totals Banner */}
          <div className="p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-[#8fa3c0] uppercase tracking-wider block">
                Total Monthly Cost
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black font-display text-[#8b5cf6]">
                  ${monthlyTotal.toFixed(2)}
                </span>
                <span className="text-sm text-[#8fa3c0] font-mono">/ month</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.14)] text-left sm:text-right">
              <span className="text-xs font-mono text-[#8fa3c0] uppercase block">
                Annual Subscription Burn
              </span>
              <span className="text-2xl font-bold font-mono text-[#f2f7ff] mt-0.5 block">
                ${annualTotal.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#8fa3c0]">
                Over {items.length} active recurring services
              </span>
            </div>
          </div>

          {/* Bundle Optimization Advice */}
          {bundleRecommendation && (
            <div className="p-4 rounded-xl bg-[#0a1424] border border-[rgba(139, 92, 246,0.3)] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8b5cf6]">
                <Sparkles size={16} />
                <span>Apple One Bundle Savings Opportunity</span>
              </div>
              <p className="text-xs text-[#f2f7ff] leading-relaxed">
                {bundleRecommendation}
              </p>
            </div>
          )}

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
              <span className="text-[#8fa3c0] block font-mono">DAILY EQUIVALENT</span>
              <span className="text-sm font-bold text-[#f2f7ff] mt-0.5 block font-mono">
                ${(monthlyTotal / 30).toFixed(2)} / day
              </span>
              <span className="text-[10px] text-[#8fa3c0]">Average daily spend</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
              <span className="text-[#8fa3c0] block font-mono">LARGEST EXPENSE</span>
              <span className="text-sm font-bold text-[#8b5cf6] mt-0.5 block truncate">
                {items.length > 0
                  ? [...items].sort((a, b) => b.monthlyCost - a.monthlyCost)[0].name
                  : 'None'}
              </span>
              <span className="text-[10px] text-[#8fa3c0]">Top recurring bill</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a1424] border border-[rgba(143,163,192,0.16)]">
              <span className="text-[#8fa3c0] block font-mono">FAMILY SHARING</span>
              <span className="text-sm font-bold text-[#5aa9ff] mt-0.5 block">
                Up to 5 Members
              </span>
              <span className="text-[10px] text-[#8fa3c0]">Split with iCloud Family</span>
            </div>
          </div>
        </div>
      )}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Apple Subscription Cost Calculator provides an immediate, honest view of your recurring digital spending across the Apple ecosystem. With individual subscriptions for iCloud storage, Apple Music, Apple TV+, Apple Arcade, Fitness+, and AppleCare+, monthly costs quietly compound into hundreds of dollars per year.
          </p>
          <p>
            This tool automatically audits your services and identifies whether switching to an Apple One bundle (Individual at $19.95/mo, Family at $25.95/mo, or Premier at $37.95/mo) will save you money. Your subscriptions are saved privately in your browser's localStorage so you can return anytime to adjust services without creating an account or logging in.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Select your active Apple subscriptions',
          text: 'Click any of the quick-add buttons for iCloud+, Apple Music, TV+, or Apple One.',
        },
        {
          step: 'Add custom recurring services',
          text: 'Type in third-party services like Spotify, Netflix, or ChatGPT to track your overall monthly software expenses in one place.',
        },
        {
          step: 'Inspect the bundle savings alert',
          text: 'Look for the green Apple One savings card if your standalone services exceed the price of an all-inclusive bundle.',
        },
        {
          step: 'Review your total annual burn',
          text: 'Examine your yearly total and daily cost to decide which services to keep or cancel.',
        },
      ]}
      workedExample={{
        title: 'Example: Separate Apple Music, iCloud, and Apple TV+ Subscriptions',
        scenario: 'A subscriber paying for Apple Music ($10.99), iCloud 200GB ($2.99), and Apple TV+ ($9.99) separately.',
        output: `### Current Standalone Spending:
- Apple Music: $10.99/mo
- iCloud+ 200GB: $2.99/mo
- Apple TV+: $9.99/mo
- Total: $23.97/month ($287.64/year)

Comparison with Apple One:
- Apple One Individual: $19.95/month
- Includes: Apple Music, Apple TV+, Apple Arcade, and iCloud+ 50GB
- Monthly Savings: $4.02/month ($48.24/year savings + free Apple Arcade access)

Verdict: Upgrading to Apple One Individual saves nearly $50 per year while unlocking hundreds of ad-free games on Apple Arcade.`,
      }}
      tips={[
        'Use Apple Family Sharing to split costs: Apple One Family ($25.95) can be shared with up to 5 family members, bringing the cost down to just $4.33 per person per month.',
        'Cancel during billing cycles without losing access: When you cancel an Apple subscription in Settings > Apple Account > Subscriptions, your access continues until the end of the paid billing period.',
        'Beware of automatic price tier jumps: iCloud storage upgrades (50GB to 200GB) happen automatically if family members run out of pooled space.',
        'Annual subscriptions offer 2 months free: Services like Apple TV+ and Apple Arcade offer annual billing at a 15% to 17% discount compared to monthly recurring payments.',
      ]}
      faq={[
        {
          question: 'What is included in Apple One bundles?',
          answer: 'Apple One Individual ($19.95) includes Apple Music, Apple TV+, Apple Arcade, and 50GB iCloud. The Family plan ($25.95) includes 200GB iCloud with 5-person sharing. The Premier plan ($37.95) includes 2TB iCloud, Apple News+, and Apple Fitness+.',
        },
        {
          question: 'Can I keep extra iCloud storage with Apple One?',
          answer: 'Yes. If you subscribe to Apple One and also need more storage, you can purchase an additional standalone iCloud+ plan (e.g., Apple One Premier 2TB + iCloud 2TB gives you 4TB total).',
        },
        {
          question: 'Are my subscription details saved on your servers?',
          answer: 'No. SmartToolHub stores your list locally in your browser via HTML5 localStorage. No personal data, email, or credentials are ever transmitted to any server.',
        },
        {
          question: 'How do I cancel unwanted Apple subscriptions on iPhone?',
          answer: 'Open the Settings app on your iPhone, tap your name at the very top, tap Subscriptions, select the service you wish to end, and tap Cancel Subscription.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
