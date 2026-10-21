import React, { useState } from 'react';
import { ShoppingBag, Copy, Check, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';
import { Button } from '../../components/ui/Button.tsx';

interface ProductDescriptionPageProps {
  navigate: (path: string) => void;
}

export const ProductDescriptionPage: React.FC<ProductDescriptionPageProps> = ({ navigate }) => {
  const [productName, setProductName] = useState<string>('Minimalist Titanium Mechanical Keyboard');
  const [features, setFeatures] = useState<string>('CNC-machined aluminum body, hot-swappable switches, low-latency 2.4GHz wireless & Bluetooth 5.2, custom gasket-mount sound dampening, 200-hour battery life.');
  const [audience, setAudience] = useState<string>('Software engineers, designers, and mechanical keyboard enthusiasts');
  const [tone, setTone] = useState<string>('premium & technical');

  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'product-description-generator') || LAUNCH_TOOLS[22];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'caption-hashtag-generator' || t.slug === 'title-headline-generator');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[0];

  const exampleChips = [
    'Minimalist Titanium Mechanical Keyboard: wireless, hot-swap, sound-dampened',
    'Organic cold-brew coffee concentrate: 100% Arabica, zero sugar, 16 servings',
    'Ergonomic lumbar support cushion for office chairs: memory foam, breathable mesh',
  ];

  const handleChipClick = (chip: string) => {
    if (chip.includes('Mechanical Keyboard')) {
      setProductName('Minimalist Titanium Mechanical Keyboard');
      setFeatures('CNC-machined aluminum case, hot-swappable switches, 2.4GHz wireless & Bluetooth, custom silicone sound dampening, 200-hour battery life.');
      setAudience('Software engineers, writers, and desktop enthusiasts');
      setTone('premium & technical');
    } else if (chip.includes('cold-brew coffee')) {
      setProductName('Artisan Organic Cold-Brew Concentrate');
      setFeatures('Single-origin 100% Arabica beans, 24-hour slow cold extraction, zero sugar, makes 16 bold craft lattes or black coffees.');
      setAudience('Busy professionals, coffee lovers, and fitness enthusiasts');
      setTone('vibrant & artisan');
    } else {
      setProductName('Ergonomic Lumbar Support Office Cushion');
      setFeatures('High-density therapeutic memory foam, 3D breathable mesh cover, dual adjustable straps, universal fit for all office and gaming chairs.');
      setAudience('Remote workers sitting 8+ hours daily');
      setTone('reassuring & practical');
    }
  };

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Product Description Generator"
      subheading="Generate high-converting e-commerce copy formatted into a punchy short description, compelling overview story, and 5 benefit-driven feature bullets for Shopify, Amazon, or Etsy."
      inputLabel="Product Name & Core Concept"
      inputPlaceholder="e.g. Minimalist Titanium Mechanical Keyboard, or Ergonomic Memory Foam Lumbar Cushion..."
      examplePrompt={productName}
      exampleChips={exampleChips}
      generateButtonText="Generate Product Copy Suite"
      apiEndpoint="/api/product-description"
      requestPayload={(input) => ({
        product: input || productName,
        features,
        audience,
        tone,
      })}
      lastUpdated="October 2026"
      navigate={navigate}
      extraControls={
        <div className="space-y-4 pt-1">
          {/* Features Field */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#8fa3c0]">
              Key Features, Materials & Specifications
            </label>
            <textarea
              rows={2}
              placeholder="e.g. CNC aluminum body, 200-hour battery, Bluetooth 5.2, sound dampening..."
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-xl p-3 text-xs text-[#f2f7ff] placeholder:text-[#8fa3c0]/50 focus-ring"
            />
          </div>

          {/* Audience & Tone Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8fa3c0]">
                Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g. Remote workers, gamers, coffee enthusiasts"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8fa3c0]">
                Brand Voice & Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#0a1424] border border-[rgba(143,163,192,0.2)] rounded-lg px-3 py-2 text-xs text-[#f2f7ff] focus-ring"
              >
                <option value="premium & technical">Premium & Technical</option>
                <option value="casual & friendly">Casual & Friendly</option>
                <option value="bold & persuasive">Bold & Persuasive</option>
                <option value="minimalist & clean">Minimalist & Clean</option>
                <option value="artisan & luxury">Artisan & Luxury</option>
              </select>
            </div>
          </div>
        </div>
      }
      customResultRenderer={({ result, rawData, onCopy, copied }) => {
        const shortDesc: string = rawData?.shortDescription || '';
        const longDesc: string = rawData?.longDescription || result;
        const bulletPoints: string[] = rawData?.bulletPoints || [];

        return (
          <div className="space-y-5">
            {/* Short Snippet */}
            {shortDesc && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1424] border border-[rgba(244, 114, 208,0.3)] space-y-1.5">
                <span className="text-xs font-mono uppercase text-[#f472d0] font-bold block">
                  Short Description (Meta Description / Above-the-Fold)
                </span>
                <p className="text-sm font-medium text-[#f2f7ff] leading-relaxed">
                  {shortDesc}
                </p>
              </div>
            )}

            {/* Long Storytelling Copy */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#5aa9ff] font-bold">
                  Full Product Overview
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onCopy(result)}
                  className="text-xs"
                >
                  <span>{copied ? 'Copied All' : 'Copy All Copy'}</span>
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-[#f2f7ff] leading-relaxed whitespace-pre-wrap">
                {longDesc}
              </p>
            </div>

            {/* 5 Bullet Points */}
            {bulletPoints.length > 0 && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0a1424] border border-[rgba(143,163,192,0.18)] space-y-3">
                <span className="text-xs font-mono uppercase text-[#ffb840] font-bold block">
                  5 Key Feature & Benefit Bullets (Amazon / Shopify Format)
                </span>
                <div className="space-y-2.5">
                  {bulletPoints.map((bp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#101c33] border border-[rgba(143,163,192,0.14)] text-xs text-[#f2f7ff] leading-relaxed flex items-start gap-2.5"
                    >
                      <CheckCircle2 size={16} className="text-[#34e0a1] shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }}
      whatItDoesContent={
        <div className="space-y-3">
          <p>
            The Product Description Generator crafts high-converting, persuasive copy for e-commerce stores, Shopify listings, Amazon product detail pages, and Kickstarter campaigns. Great product copy connects dry technical specifications with real human desire, answering the buyer's ultimate question: "What does this do for me?"
          </p>
          <p>
            Every generation provides three distinct assets: a 1-sentence punchy tagline for search engine snippets and mobile screens, a 2-paragraph emotional narrative explaining the transformation, and 5 Amazon-style benefit bullets that highlight features through practical utility.
          </p>
        </div>
      }
      howToUseSteps={[
        {
          step: 'Name your product and target audience',
          text: 'Enter the product name and describe who the item is built for (e.g. busy parents, remote coders).',
        },
        {
          step: 'List key materials and features',
          text: 'Add raw specifications like dimensions, battery life, materials, or special ingredients.',
        },
        {
          step: 'Pick your brand tone',
          text: 'Choose between Premium & Technical, Artisan & Luxury, or Casual & Friendly.',
        },
        {
          step: 'Copy into your store catalog',
          text: 'Copy the short summary into SEO meta fields and paste the 5 bullet points into your listing cards.',
        },
      ]}
      workedExample={{
        title: 'Example: Artisan Cold-Brew Coffee Concentrate',
        scenario: 'A specialty coffee roaster launching a 16-serving organic cold-brew bottle on Shopify.',
        output: `### Short Description:
Crafted from single-origin Arabica beans slow-steeped for 24 hours, this artisan concentrate delivers barista-quality iced coffee at home in seconds—zero sugar, zero bitterness.

### 5 Benefit Bullets:
• 24-Hour Cold Extraction: Eliminates harsh acidity for a naturally sweet, ultra-smooth coffee finish.
• Ultra-Convenient 1:1 Ratio: Just add equal parts water, oat milk, or ice to create 16 specialty drinks.
• 100% Certified Organic Arabica: Sourced ethically from high-altitude micro-lots with zero artificial additives.
• Shelf-Stable Freshness: Nitrogen-sealed glass bottle preserves delicate chocolate and caramel tasting notes.
• Zero Sugar & Keto-Friendly: Full-bodied craft energy with zero calories and zero post-sugar crashes.`,
      }}
      tips={[
        'Translate features into emotional benefits: Instead of just saying "CNC aluminum body", explain that "the rigid aluminum case eliminates desk rattle and feels indestructible".',
        'Use the short description for Google SERP meta: Google snippets truncate at 155 characters; keep your primary keyword in the first sentence.',
        'Capitalize the first 2-3 words of each bullet: This visual anchor allows busy mobile scrollers to scan your benefits in under 3 seconds.',
        'Keep tone consistent with pricing: If selling a $200 gadget, choose Premium & Technical; if selling everyday snacks, choose Casual & Friendly.',
      ]}
      faq={[
        {
          question: 'Are the 5 bullet points formatted for Amazon seller guidelines?',
          answer: 'Yes. Amazon requires benefit-driven bullet points under 250 characters per bullet with clear feature anchors. The generated bullets comply directly with Amazon Seller Central standards.',
        },
        {
          question: 'Can I generate descriptions for physical and digital products?',
          answer: 'Yes. It works equally well for physical consumer goods, digital software plugins, Notion templates, eBooks, and SaaS memberships.',
        },
        {
          question: 'Is the generated copy unique and royalty-free?',
          answer: 'Yes. All generated copy is created dynamically in your browser turn and belongs 100% to you for commercial use with no attribution required.',
        },
        {
          question: 'Does this tool store my unpublished product ideas?',
          answer: 'No. SmartToolHub operates zero server logging or database storage. Your confidential upcoming product launches stay completely private.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
