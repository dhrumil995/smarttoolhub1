import React, { useEffect } from 'react';
import { LAUNCH_TOOLS } from '../../data/tools.ts';
import { GUIDE_ARTICLES } from '../../data/guides.ts';

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
          {
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'Do I need a Mac or a computer to use this?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'No. Everything runs directly on your iPhone or iPad. The generated steps are designed for the native iOS Shortcuts app that is already installed on your device.',
                },
              },
              {
                '@type': 'Question',
                'name': 'Can this shortcut run automatically without me tapping it?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes. In the iOS Shortcuts app, tap the "Automation" tab at the bottom, select "Create Personal Automation", choose a trigger, and select "Run Shortcut".',
                },
              },
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
      description = 'All 8 AI tools are free forever. Optional Pro plan for power users wanting higher caps and zero ads via secure hosted checkout.';
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
