import React, { useEffect } from 'react';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { GUIDE_ARTICLES } from '../../data/guides.ts';
import { SOFTWARE_APPS } from '../../data/softwareDirectory.ts';
import { COMPARISONS } from '../../data/comparisons.ts';

interface MetaManagerProps {
  currentPath: string;
}

export const MetaManager: React.FC<MetaManagerProps> = ({ currentPath }) => {
  useEffect(() => {
    let title = 'SmartToolHub - Free Everyday AI Tools';
    let description = 'Free AI tools that just work. No sign-up. Results in seconds. Fast Apple Shortcuts generator, prompt improver, email writer, and formulas.';
    let schemaJson: any = null;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smarttoolhub.net';
    const canonicalUrl = `${origin}${currentPath}`;
    const socialImage = `${origin}/og-image.svg`;

    // 1. Homepage
    if (currentPath === '/') {
      title = 'SmartToolHub - Free Everyday AI Tools (No Sign-Up)';
      description = 'Free AI tools that just work. No sign-up. Results in seconds. Apple Shortcuts generator, prompt improver, formula helper, and everyday utilities.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${origin}/#organization`,
            'name': 'SmartToolHub',
            'url': origin,
            'logo': `${origin}/icon.svg`,
            'founder': {
              '@type': 'Person',
              'name': 'Dhrumil Aslaliya',
            },
            'sameAs': ['https://smarttoolhub.net'],
          },
          {
            '@type': 'WebSite',
            '@id': `${origin}/#website`,
            'url': origin,
            'name': 'SmartToolHub',
            'description': 'Free AI tools that just work. No sign-up. Results in seconds.',
            'publisher': {
              '@id': `${origin}/#organization`,
            },
          },
        ],
      };
    }

    // 2. Tools Hub
    else if (currentPath === '/tools') {
      title = 'All AI Tools - Free Everyday Utilities | SmartToolHub';
      description = 'Explore 8 free everyday AI tools with no sign-up. Generate Apple Shortcuts, polish prompts, write emails, and calculate spreadsheet formulas in seconds.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
          { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
        ],
      };
    }

    // 3. Apple Shortcuts Generator
    else if (currentPath === '/tools/apple-shortcuts-generator') {
      title = 'Apple Shortcuts Generator - Free iOS Automations';
      description = 'Turn automation ideas into step-by-step iOS Shortcuts instructions. Connect Maps, Messages, and apps in under 2 minutes. 100% free with no sign-up.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Apple Shortcuts Generator',
            'applicationCategory': 'UtilitiesApplication',
            'operatingSystem': 'iOS, iPadOS, macOS',
            'url': canonicalUrl,
            'description': 'Converts automation descriptions into step-by-step Apple Shortcuts action recipes.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Apple Shortcuts Generator', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3b. AI Email Writer
    else if (currentPath === '/tools/ai-email-writer') {
      title = 'AI Email Writer - Draft Clear Emails Fast';
      description = 'Write clear, polite emails with high-converting subject lines in seconds. Choose from 4 tones, add bullet points, and copy ready-to-send drafts for free.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'AI Email Writer',
            'applicationCategory': 'BusinessApplication',
            'url': canonicalUrl,
            'description': 'Drafts polite, clear emails with custom subject lines and tones in seconds.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'AI Email Writer', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3c. AI Summarizer
    else if (currentPath === '/tools/ai-summarizer') {
      title = 'AI Summarizer - Condense Long Text in Seconds';
      description = 'Summarize long articles, meeting notes, transcripts, or reports into 3 clear sentences and 5 bullet points. Fast, free, private, and no account needed.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'AI Summarizer',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Condenses long articles, transcripts, and notes into 3-sentence summaries and key points.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'AI Summarizer', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3d. Rewrite and Tone Changer
    else if (currentPath === '/tools/rewrite-tone-changer') {
      title = 'Rewrite & Tone Changer - Polish Your Words Fast';
      description = 'Rewrite awkward messages to sound friendlier, more formal, shorter, or simpler. See an instant before-and-after view with zero fluff and total privacy.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Rewrite and Tone Changer',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Rewrites sentences to sound friendlier, more formal, shorter, or simpler.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Rewrite and Tone Changer', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3e. Caption and Hashtag Generator
    else if (currentPath === '/tools/caption-hashtag-generator') {
      title = 'Caption & Hashtag Generator - High Reach Ideas';
      description = 'Create 5 catchy social media captions and 15 high-reach hashtags for Instagram, TikTok, LinkedIn, and X. Free, instant, and no login required.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Caption and Hashtag Generator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Turn any topic into 5 engaging social captions and 15 curated high-reach hashtags.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Caption and Hashtag Generator', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3f. Social Bio Generator
    else if (currentPath === '/tools/social-bio-generator') {
      title = 'Social Bio Generator - Catchy Profile Bios Fast';
      description = 'Craft 4 engaging profile bios for Twitter/X, Instagram, TikTok, and LinkedIn in seconds. Includes character counters and instant one-tap copy.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Social Bio Generator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Craft 4 compelling profile bios with character counters for Instagram, X, and LinkedIn.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Social Bio Generator', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3g. Title and Headline Generator
    else if (currentPath === '/tools/title-headline-generator') {
      title = 'Headline Generator - 10 Catchy Blog & Video Titles';
      description = 'Generate 10 high-converting headlines for blog articles, YouTube videos, and product pages. Compare proven hook styles with instant one-tap copy.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Title and Headline Generator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Generate 10 catchy, click-worthy headlines for blog posts, YouTube videos, and products.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Title and Headline Generator', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3h. AI Prompt Improver
    else if (currentPath === '/tools/ai-prompt-improver') {
      title = 'AI Prompt Improver - Structure & Optimize Prompts';
      description = 'Transform rough prompts into structured, high-performing instructions with clear roles, rules, and examples. Free prompt engineering tool with no sign-up.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'AI Prompt Improver',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Paste a rough prompt and get a structured, high-performing version with role and rules.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'AI Prompt Improver', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3i. Formula Helper
    else if (currentPath === '/tools/formula-helper') {
      title = 'Formula Helper - Excel & Google Sheets AI Formulas';
      description = 'Describe what you want to calculate in plain English. Get instant, error-free Excel and Google Sheets formulas with plain explanations and practical examples.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Excel & Sheets Formula Helper',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Describe what you want to calculate and receive the exact spreadsheet formula.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Formula Helper', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3j. Meeting Notes to Action Items
    else if (currentPath === '/tools/meeting-notes-action-items') {
      title = 'Meeting Notes to Action Items - Extract Tasks Fast';
      description = 'Turn raw meeting notes or transcripts into executive summaries, key decisions, and assigned action items with owners and deadlines. Free, instant, and private.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Meeting Notes to Action Items',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Turn messy meeting notes into a concise summary, key decisions, and assigned action items.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Meeting Notes to Action Items', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3k. Retina Image Size Calculator
    else if (currentPath === '/tools/retina-image-size-calculator') {
      title = 'Retina Image Size Calculator - @1x @2x @3x Pixels';
      description = 'Convert design points into @1x, @2x, and @3x pixel dimensions for iOS, iPadOS, and Retina displays. Instant HTML srcset snippet and zero blur.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'Retina Image Size Calculator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Calculate crisp @1x, @2x, and @3x pixel dimensions from points for iOS and web graphics.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'Retina Image Size Calculator', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3l. iPhone Charging Time Calculator
    else if (currentPath === '/tools/iphone-charging-time-calculator') {
      title = 'iPhone Charging Time Calculator - Accurate Fast Charge';
      description = 'Calculate realistic iPhone charging times based on battery mAh, charger wattage, and phone speed limits. Includes fast-charge and trickle-charge curves.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'iPhone Charging Time Calculator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Calculate exact iPhone charge time from battery mAh, charger watts, and phone max rate.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'iPhone Charging Time Calculator', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 3m. File Transfer Time Calculator
    else if (currentPath === '/tools/file-transfer-time-calculator') {
      title = 'File Transfer Time Calculator - Honest Real Speeds';
      description = 'Calculate realistic transfer times for AirDrop, USB-C 3.2, Lightning, Wi-Fi, and 5G. Compare honest real-world transfer speeds without theoretical fluff.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            'name': 'File Transfer Time Calculator',
            'applicationCategory': 'UtilitiesApplication',
            'url': canonicalUrl,
            'description': 'Calculate realistic transfer times for AirDrop, USB-C, Wi-Fi, and 5G with honest speeds.',
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
              { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
              { '@type': 'ListItem', 'position': 3, 'name': 'File Transfer Time Calculator', 'item': canonicalUrl },
            ],
          },
        ],
      };
    }

    // 4. Other Tools
    else if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '');
      const tool = LAUNCH_TOOLS.find((t) => t.slug === slug);
      if (tool) {
        title = `${tool.name} - Free AI Utility | SmartToolHub`;
        description = `${tool.description.slice(0, 145)}. 100% free everyday AI tool with instant results and zero registration.`;
        schemaJson = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              'name': tool.name,
              'applicationCategory': 'UtilitiesApplication',
              'url': canonicalUrl,
              'description': tool.description,
              'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            },
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
                { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
                { '@type': 'ListItem', 'position': 3, 'name': tool.name, 'item': canonicalUrl },
              ],
            },
          ],
        };
      }
    }

    // 5. Guides
    else if (currentPath === '/guides') {
      title = 'How-To Guides & Tutorials | SmartToolHub';
      description = 'Practical step-by-step guides by Dhrumil Aslaliya on iPhone shortcuts, prompt optimization, and spreadsheet formula creation in plain English.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
          { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': `${origin}/guides` },
        ],
      };
    }

    // 6. Guide Details
    else if (currentPath.startsWith('/guides/')) {
      const slug = currentPath.replace('/guides/', '');
      const guide = GUIDE_ARTICLES[slug];
      if (guide) {
        title = `${guide.title.slice(0, 48)} | SmartToolHub`;
        description = `${guide.summary.slice(0, 148)} Practical guide by ${guide.author}.`;
        schemaJson = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              'headline': guide.title,
              'description': guide.summary,
              'author': {
                '@type': 'Person',
                'name': guide.author,
                'url': `${origin}/about`,
              },
              'datePublished': '2026-10-01',
              'dateModified': '2026-10-14',
              'publisher': {
                '@type': 'Organization',
                'name': 'SmartToolHub',
                'logo': { '@type': 'ImageObject', 'url': `${origin}/icon.svg` },
              },
            },
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
                { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': `${origin}/guides` },
                { '@type': 'ListItem', 'position': 3, 'name': guide.title, 'item': canonicalUrl },
              ],
            },
          ],
        };
      }
    }

    // 7. About
    else if (currentPath === '/about') {
      title = 'About SmartToolHub & Dhrumil Aslaliya | Independent Tools';
      description = 'SmartToolHub is an independent website of free everyday AI tools built by Dhrumil Aslaliya. No accounts, fast sub-30-second utility, and honest privacy.';
      schemaJson = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
          { '@type': 'ListItem', 'position': 2, 'name': 'About', 'item': canonicalUrl },
        ],
      };
    }

    // 8. Contact
    else if (currentPath === '/contact') {
      title = 'Contact SmartToolHub - Feedback & Tool Requests';
      description = 'Have feedback or a tool idea? Contact creator Dhrumil Aslaliya directly. We read and respond to every message within 24 to 48 hours.';
    }

    // 9. Privacy
    else if (currentPath === '/privacy') {
      title = 'Privacy Policy - Zero Tracking & Ephemeral AI | SmartToolHub';
      description = 'Plain-English privacy policy. Your prompts are processed securely and never stored, sold, or logged. No accounts required to use any tool.';
    }

    // 10. Terms
    else if (currentPath === '/terms') {
      title = 'Terms of Service - Fair Use & Disclaimers | SmartToolHub';
      description = 'Simple terms of service for SmartToolHub. Free usage terms, AI output verification reminder, and trademark independence disclosures.';
    }

    // 11. Pricing
    else if (currentPath === '/pricing') {
      title = 'Pricing & Pro Upgrade - 100% Free Tools | SmartToolHub';
      description = 'All tools are free forever. Optional Pro plan for power users wanting higher caps and zero ads via secure hosted checkout.';
    }

    // 12. Dynamic Tool Fallback for all tools in LAUNCH_TOOLS
    else if (currentPath.startsWith('/tools/')) {
      const toolSlug = currentPath.replace('/tools/', '').split('?')[0].split('#')[0];
      const matchedTool = LAUNCH_TOOLS.find((t) => t.slug === toolSlug);
      if (matchedTool) {
        title = `${matchedTool.name} - Free Utility | SmartToolHub`;
        description = `${matchedTool.description} Free with no sign-up. Fast, private on-device utility.`;
        schemaJson = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              'name': matchedTool.name,
              'applicationCategory': 'UtilitiesApplication',
              'operatingSystem': 'iOS, iPadOS, macOS, Web',
              'url': canonicalUrl,
              'description': matchedTool.description,
              'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
              'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
            },
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
                { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${origin}/tools` },
                { '@type': 'ListItem', 'position': 3, 'name': matchedTool.name, 'item': canonicalUrl },
              ],
            },
          ],
        };
      }
    }

    // 13. Category Hubs & Software Profiles
    else if (currentPath === '/pc-tools') {
      title = 'PC & Windows Software Directory - Curated Open Source & Winget Tools | SmartToolHub';
      description = 'Definitive curated toolkit of high-performance utilities, file managers, storage analyzers, and desktop enhancers for Windows 10 and 11.';
    }
    else if (currentPath === '/apple-tools') {
      title = 'Apple & Mac Software Directory - Curated Native macOS Tools | SmartToolHub';
      description = 'Exclusively vetted, open-source and reputable native desktop applications built specifically for macOS and iOS power users.';
    }
    else if (currentPath === '/android-tools') {
      title = 'Android Power Tools Directory - F-Droid & Shizuku ADB Tools | SmartToolHub';
      description = 'Verified open-source Android utilities, developer debugging tools, and system automation platforms available via GitHub and F-Droid.';
    }
    else if (currentPath.startsWith('/pc-tools/') || currentPath.startsWith('/apple-tools/') || currentPath.startsWith('/android-tools/')) {
      const parts = currentPath.split('/');
      const appSlug = parts[2]?.split('?')[0].split('#')[0];
      const app = appSlug ? SOFTWARE_APPS[appSlug] : undefined;
      if (app) {
        title = `${app.name} (${app.platformLabel}) Review, Limitations & Commands | SmartToolHub`;
        description = `${app.tagline} Honest review, two limitations to consider, and verified package manager install commands.`;
      }
    }
    else if (currentPath.startsWith('/compare/')) {
      const compSlug = currentPath.replace('/compare/', '').split('?')[0].split('#')[0];
      const comp = COMPARISONS[compSlug];
      if (comp) {
        title = `${comp.title} | SmartToolHub`;
        description = comp.subtitle;
      }
    }
    else if (currentPath === '/changelog') {
      title = 'Platform Changelog & Release History | SmartToolHub';
      description = 'Track every new zero-install browser tool, hardware diagnostic calculator, and curated software profile deployed to SmartToolHub.';
    }
    else if (currentPath === '/saved') {
      title = 'Saved Results & Bookmarked Tools | SmartToolHub';
      description = 'View your locally saved tool outputs, guide cheat sheets, and software profile bookmarks. 100% offline and private.';
    }

    // Apply document title
    document.title = title;

    // Helper to set or create meta tag
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', socialImage);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', socialImage);

    // Set canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Inject JSON-LD
    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    if (schemaJson) {
      scriptTag.textContent = JSON.stringify(schemaJson);
    } else {
      scriptTag.textContent = '';
    }
  }, [currentPath]);

  return null;
};
