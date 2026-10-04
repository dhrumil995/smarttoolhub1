import React, { useState, useEffect, useMemo } from 'react';
import { WorkflowItem } from '../types';
import {
  generateWorkflowFAQs,
  generateWorkflowFAQSchema,
  injectWorkflowFAQSchema,
  WorkflowFAQItem,
} from '../utils/faqSchemaGenerator';
import { haptics } from '../utils/haptics';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Copy,
  Check,
  Code,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Wrench,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface WorkflowFAQSectionProps {
  workflow: WorkflowItem;
  canonicalUrl?: string;
}

export const WorkflowFAQSection: React.FC<WorkflowFAQSectionProps> = ({
  workflow,
  canonicalUrl: propCanonicalUrl,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'troubleshooting-0': true,
    'prerequisites-hardware': true,
  });
  const [copiedAnswerId, setCopiedAnswerId] = useState<string | null>(null);
  const [showJsonLdModal, setShowJsonLdModal] = useState(false);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);

  // Compute canonical URL
  const canonicalUrl = useMemo(() => {
    if (propCanonicalUrl) return propCanonicalUrl;
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}/workflows/${workflow.slug}`;
    }
    return `https://smarttoolhub.net/workflows/${workflow.slug}`;
  }, [propCanonicalUrl, workflow.slug]);

  // Generate FAQ items
  const allFaqs = useMemo(() => generateWorkflowFAQs(workflow), [workflow]);

  // Generate raw JSON-LD schema object and string
  const jsonLdSchema = useMemo(
    () => generateWorkflowFAQSchema(workflow, canonicalUrl),
    [workflow, canonicalUrl]
  );
  const jsonLdString = useMemo(
    () => JSON.stringify(jsonLdSchema, null, 2),
    [jsonLdSchema]
  );

  // Dynamically inject schema into document head with unmount cleanup
  useEffect(() => {
    const cleanup = injectWorkflowFAQSchema(workflow, canonicalUrl);
    return () => {
      cleanup();
    };
  }, [workflow, canonicalUrl]);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [allFaqs, selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    haptics.playTap();
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    haptics.playTap();
    const expanded: Record<string, boolean> = {};
    allFaqs.forEach((faq) => {
      expanded[faq.id] = true;
    });
    setOpenItems(expanded);
  };

  const collapseAll = () => {
    haptics.playTap();
    setOpenItems({});
  };

  const handleCopyAnswer = async (faq: WorkflowFAQItem) => {
    haptics.playTap();
    const textToCopy = `Q: ${faq.question}\nA: ${faq.answer}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedAnswerId(faq.id);
      setTimeout(() => setCopiedAnswerId(null), 2000);
    } catch (_) {}
  };

  const handleCopyJsonLd = async () => {
    haptics.playTap();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(jsonLdString);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = jsonLdString;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedJsonLd(true);
      setTimeout(() => setCopiedJsonLd(false), 2000);
    } catch (_) {}
  };

  const categories = [
    { id: 'all', label: 'All FAQs', count: allFaqs.length },
    { id: 'Troubleshooting', label: 'Troubleshooting', icon: Wrench },
    { id: 'Prerequisites', label: 'Prerequisites', icon: Cpu },
    { id: 'Performance & Compatibility', label: 'Performance', icon: Layers },
    { id: 'Privacy & Security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <section
      id="workflow-faq-section"
      aria-label="Frequently Asked Questions & Rich Results"
      className="glass-card p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6 relative overflow-hidden print:p-4 print:border-gray-300 print:space-y-4"
    >
      {/* Decorative ambient gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 no-print" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 print:border-gray-300 print:pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Google Rich Results Eligible</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              Schema.org/FAQPage
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 print:text-gray-950">
            <HelpCircle className="w-5 h-5 text-[#0A84FF] stroke-[2.2] no-print" />
            <span>Frequently Asked Questions & Technical FAQ</span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed print:text-gray-700">
            Authoritative answers on compatibility, configuration pitfalls, zero-bloat execution, and data privacy for{' '}
            <span className="text-zinc-200 font-medium">{workflow.title}</span>.
          </p>
        </div>

        {/* Action Buttons: Expand/Collapse & JSON-LD Inspector */}
        <div className="flex items-center gap-2 shrink-0 no-print">
          <button
            onClick={openItems && Object.keys(openItems).length === allFaqs.length ? collapseAll : expandAll}
            className="px-3 py-1.5 rounded-xl glass-panel text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Toggle expansion of all questions"
          >
            {Object.keys(openItems).length === allFaqs.length ? 'Collapse All' : 'Expand All'}
          </button>

          <button
            onClick={() => {
              haptics.playTap();
              setShowJsonLdModal(!showJsonLdModal);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 text-blue-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Inspect dynamic Schema.org JSON-LD structured data"
          >
            <Code className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>{showJsonLdModal ? 'Hide JSON-LD' : 'View JSON-LD'}</span>
          </button>
        </div>
      </div>

      {/* Interactive JSON-LD Schema Inspector Box (Collapsible) */}
      {showJsonLdModal && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#08090D] border border-blue-500/30 space-y-3 no-print animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-white">
                Dynamic Schema.org/FAQPage JSON-LD Payload
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                {allFaqs.length} Question Entities
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJsonLd}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedJsonLd ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON-LD</span>
                  </>
                )}
              </button>

              <a
                href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-xs font-medium text-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
                title="Test this URL directly in Google's official Rich Results Test"
              >
                <span>Google Test</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400">
            This structured data is automatically compiled and injected into the HTML <code className="text-blue-300">&lt;head&gt;</code> in real time. Search engines parse this object to award expanded FAQ accordion snippets in SERPs and qualify your site for higher AdSense engagement.
          </p>

          <div className="relative">
            <pre className="p-3.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-64 leading-relaxed selection:bg-emerald-950">
              {jsonLdString}
            </pre>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3 no-print">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search troubleshooting questions, hardware prerequisites, privacy..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  haptics.playTap();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Items Accordion */}
      <div className="space-y-3 print:space-y-2">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-400 space-y-2">
            <p>No questions matched your search query &ldquo;{searchQuery}&rdquo;.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            const isCopied = copiedAnswerId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white/[0.04] border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] print:border-gray-300 print:bg-white'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/15 print:border-gray-200'
                }`}
              >
                {/* Question Trigger */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-4.5 text-left flex items-start justify-between gap-3 cursor-pointer group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400/90 font-semibold print:text-blue-800">
                      {faq.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition-colors pr-2 leading-snug print:text-gray-950">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5 no-print">
                    <span className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-white/[0.04] mt-1 space-y-3 print:text-gray-800 print:border-gray-200 print:pt-2">
                    <p className="font-normal">{faq.answer}</p>

                    <div className="flex items-center justify-between pt-1 no-print">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Included in Schema.org @graph
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopyAnswer(faq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-[11px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Copy question & answer to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                            <span className="text-emerald-300">Answer Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SEO & AdSense Quality Note Footer */}
      <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-zinc-500 font-mono no-print">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Complies with Google Search Central FAQ structured data guidelines</span>
        </div>
        <div>
          <span>Target Schema: </span>
          <code className="text-zinc-400">schema.org/FAQPage</code>
        </div>
      </div>
    </section>
  );
};
