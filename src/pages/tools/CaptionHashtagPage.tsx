import React from 'react';
import { ToolPageTemplate } from '../../components/tools/ToolPageTemplate.tsx';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { POPULAR_GUIDES } from '../../data/guides.ts';

interface CaptionHashtagPageProps {
  navigate: (path: string) => void;
}

export const CaptionHashtagPage: React.FC<CaptionHashtagPageProps> = ({ navigate }) => {
  const tool = LAUNCH_TOOLS.find((t) => t.slug === 'caption-hashtag-generator') || LAUNCH_TOOLS[4];
  const relatedTools = LAUNCH_TOOLS.filter((t) => t.slug === 'rewrite-tone-changer' || t.slug === 'ai-email-writer');
  const relatedGuide = POPULAR_GUIDES.find((g) => g.slug === 'better-prompts-simple-rules') || POPULAR_GUIDES[1];

  return (
    <ToolPageTemplate
      tool={tool}
      heading="Caption &amp; Hashtag Generator"
      subheading="Turn your photo, video idea, or product into catchy social captions with curated, high-reach hashtags for Instagram, TikTok, LinkedIn, and X."
      inputLabel="Describe your photo, video, or topic"
      inputPlaceholder="e.g. Sunset view from a weekend hike in the Pacific Northwest with a Golden Retriever..."
      examplePrompt="Homemade sourdough bread straight out of the Dutch oven with a crispy crust and steam rising."
      generateButtonText="Generate Captions &amp; Hashtags"
      lastUpdated="October 2026"
      navigate={navigate}
      whatItDoesContent={
        <>
          <p>
            The Caption and Hashtag Generator helps creators, small business owners, and everyday social media users craft engaging post descriptions without writer&apos;s block.
          </p>
          <p>
            Instead of generic one-liners, you get 3 distinct caption styles (punchy &amp; short, storytelling, and conversation-starting question) along with 15 relevant hashtags categorized by broad and niche reach.
          </p>
        </>
      }
      howToUseSteps={[
        {
          step: 'Describe your visual or post',
          text: 'Mention what is happening in the photo or video, the location, or the mood.',
        },
        {
          step: 'Pick your preferred caption style',
          text: 'Choose between the short punchy option, the narrative story, or the interactive question.',
        },
        {
          step: 'Copy and paste into your social app',
          text: 'Copy the caption and hashtags straight into Instagram, TikTok, or LinkedIn.',
        },
      ]}
      workedExample={{
        title: 'Example: Specialty Coffee Roastery Post',
        scenario: 'New single-origin Ethiopian coffee beans arriving in recyclable kraft bags with floral notes.',
        output: `### Option 1: Punchy & Minimalist
Fresh roast morning. Our single-origin Ethiopian beans just landed with notes of jasmine and wild berries. Link in bio to brew your cup.

### Option 2: Storytelling
There is nothing quite like opening that first bag of fresh roast. These Ethiopian beans traveled from the Yirgacheffe hills straight into our recyclable kraft bags. Bright, floral, and naturally sweet. What is your morning brew method of choice?

### Option 3: Question Hook
Pour-over or AeroPress? Let us settle the debate. Our newest Ethiopian single-origin roast is officially here.

### Curated Hashtags:
#SpecialtyCoffee #CoffeeRoaster #SingleOrigin #EthiopianCoffee #PourOverCoffee #HomeBarista #CoffeeLover #MorningRitual #CoffeeGram #BaristaDaily #CraftCoffee #SustainablePackaging #CoffeeBeans #ThirdWaveCoffee #CoffeeAddict`,
      }}
      tips={[
        'Mention the platform: If you want TikTok-style brevity or LinkedIn professionalism, mention "for TikTok" or "for LinkedIn".',
        'Add emojis naturally: If you like emojis, let the tool add 2-3 tasteful icons that fit your aesthetic.',
        'Rotate your hashtags: Do not use the exact same 30 tags every day; mixing 10 to 15 targeted tags improves reach.',
        'Include a clear call to action: Asking a question in the first 2 lines boosts comment engagement.',
      ]}
      faq={[
        {
          question: 'Do hashtags still help post reach on Instagram in 2026?',
          answer: 'Yes, but 10 to 15 hyper-specific niche hashtags perform much better than 30 spammy tags like #love or #photooftheday. Our generator selects topic-specific tags.',
        },
        {
          question: 'Can I generate captions for professional LinkedIn posts?',
          answer: 'Yes. Simply write "for LinkedIn" in your prompt, and the tool will structure the caption with professional line breaks and career-oriented hooks.',
        },
        {
          question: 'Are emojis included automatically?',
          answer: 'The generator includes tasteful, context-appropriate emojis, which you can easily remove or tweak.',
        },
        {
          question: 'Is this free with no daily limits?',
          answer: 'Yes, it is completely free to generate captions for all your posts with zero sign-up.',
        },
      ]}
      relatedTools={relatedTools}
      relatedGuide={relatedGuide}
    />
  );
};
