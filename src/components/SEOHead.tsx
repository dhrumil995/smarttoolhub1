import React, { useEffect } from 'react';
import { PageId } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { TROUBLESHOOTING_DATA } from '../data/troubleshooting';
import { COMPATIBILITY_FEATURES } from '../data/compatibility';
import { generateWorkflowFAQSchema } from '../utils/faqSchemaGenerator';

interface SEOHeadProps {
  currentPage: PageId;
  workflowId?: string;
}

interface MetaConfig {
  title: string;
  description: string;
  canonicalPath: string;
  ogType: 'website' | 'article';
  keywords: string;
  breadcrumbs: { name: string; path: string }[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({ currentPage, workflowId }) => {
  useEffect(() => {
    const baseUrl =
      typeof window !== 'undefined' && window.location?.origin && !window.location.origin.includes('ais-dev-') && !window.location.origin.includes('ais-pre-')
        ? window.location.origin
        : 'https://smarttoolhub.net';

    // Default Home Page Metadata (30-60 char title, 120-160 char actionable description)
    let config: MetaConfig = {
      title: 'Apple Shortcuts Generator — SmartToolHub',
      description:
        'Free Apple Shortcuts generator: build custom iOS 18 & macOS Sequoia automations, calculate charge times, and pick triggers instantly.',
      canonicalPath: '/',
      ogType: 'website',
      keywords:
        'Apple Shortcut Generator, macOS Sequoia automation, iOS 18 shortcuts, Retina image calculator, JSON-LD schema generator, Apple Silicon bandwidth calculator, Continuity troubleshooting',
      breadcrumbs: [{ name: 'Home', path: '/' }],
    };

    if (currentPage === 'generator') {
      config = {
        title: 'AI Apple Shortcut & Script Generator | SmartToolHub',
        description:
          'Synthesize custom multi-device Siri Shortcuts, AppleScript, and Zsh automations for Mac, iPhone, and iPad in seconds with SmartToolHub.',
        canonicalPath: '/generator',
        ogType: 'website',
        keywords:
          'AI Apple Shortcut generator, macOS Sequoia script builder, AppleScript generator, Zsh automation Mac, iPhone Shortcuts builder',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'AI Shortcut Generator', path: '/generator' },
        ],
      };
    } else if (currentPage === 'compatibility') {
      config = {
        title: 'Apple Silicon & Sequoia Compatibility | SmartToolHub',
        description:
          'Verify exact Mac, iPhone, and iPad hardware requirements for iPhone Mirroring, Continuity Camera, Universal Control, Sidecar, and Apple Intelligence.',
        canonicalPath: '/compatibility',
        ogType: 'website',
        keywords:
          'macOS Sequoia compatibility matrix, Apple Intelligence hardware requirements, iPhone Mirroring Mac compatibility, M4 Max Continuity specs',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Compatibility Matrix', path: '/compatibility' },
        ],
      };
    } else if (currentPage === 'troubleshooting') {
      config = {
        title: 'Continuity & AirDrop Sync Diagnostics | SmartToolHub',
        description:
          'Resolve AirDrop dropouts, iPhone Mirroring timeouts, and Universal Clipboard lag with interactive diagnostics and safe macOS terminal commands.',
        canonicalPath: '/troubleshooting',
        ogType: 'website',
        keywords:
          'fix AirDrop macOS Sequoia, Universal Clipboard not working, iPhone Mirroring connection timeout, AWDL diagnostic commands',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Sync Diagnostics', path: '/troubleshooting' },
        ],
      };
    } else if (currentPage === 'library') {
      config = {
        title: '120+ Verified Apple Workflows Library | SmartToolHub',
        description:
          'Browse 120+ tested macOS Sequoia and iOS 18 automation blueprints for creators, developers, freelancers, and students with zero third-party bloat.',
        canonicalPath: '/library',
        ogType: 'website',
        keywords:
          'Apple Shortcuts library, macOS Sequoia workflows, Continuity Camera Desk View guide, Universal Control setup, iPad Sidecar workflow',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Workflow Library', path: '/library' },
        ],
      };
    } else if (currentPage === 'workflow-detail' && workflowId) {
      const wf = WORKFLOWS_DATA.find((item) => item.id === workflowId) || WORKFLOWS_DATA[0];
      const rawTitle = `${wf.title} | SmartToolHub`;
      const trimmedTitle = rawTitle.length > 60 ? `${wf.title.slice(0, 42)}... | SmartToolHub` : rawTitle;
      const trimmedDesc =
        wf.summary.length > 156 ? `${wf.summary.slice(0, 153)}...` : wf.summary;

      config = {
        title: trimmedTitle,
        description: trimmedDesc,
        canonicalPath: `/workflows/${wf.slug}`,
        ogType: 'article',
        keywords: `${wf.category}, ${wf.appsUsed.join(', ')}, ${wf.devicesRequired
          .map((d) => d.device)
          .join(', ')}, Apple Shortcuts blueprint`,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Workflows', path: '/library' },
          { name: wf.category, path: `/library?category=${encodeURIComponent(wf.category)}` },
          { name: wf.title, path: `/workflows/${wf.slug}` },
        ],
      };
    } else if (currentPage === 'pricing') {
      config = {
        title: 'SmartToolHub Pro Plans & Pricing | SmartToolHub',
        description:
          'Access 120+ Apple workflows and web utilities free forever, or unlock SmartToolHub Pro for unlimited AI Shortcut synthesis and deep diagnostics.',
        canonicalPath: '/pricing',
        ogType: 'website',
        keywords:
          'SmartToolHub Pro pricing, Apple automation license, AI Shortcut generator pro, macOS diagnostic suite',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Pricing & Pro Access', path: '/pricing' },
        ],
      };
    } else if (currentPage === 'privacy') {
      config = {
        title: 'Zero-Credentials Privacy Policy | SmartToolHub',
        description:
          'Review SmartToolHub’s Zero-Credentials security architecture. We never request, collect, or store Apple IDs, passwords, or private iCloud data.',
        canonicalPath: '/privacy',
        ogType: 'website',
        keywords: 'SmartToolHub privacy policy, zero credentials security, Apple privacy compliance',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ],
      };
    } else if (currentPage === 'terms') {
      config = {
        title: 'Terms of Service & Usage Policy | SmartToolHub',
        description:
          'Read the official terms of service and independent publication guidelines for SmartToolHub’s Apple workflow generators and diagnostic tools.',
        canonicalPath: '/terms',
        ogType: 'website',
        keywords: 'SmartToolHub terms of service, software usage agreement, independent Apple guide',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms' },
        ],
      };
    } else if (currentPage === 'contact') {
      config = {
        title: 'Contact Engineering & Support Desk | SmartToolHub',
        description:
          'Request a custom multi-device Apple Shortcut, report a macOS Sequoia Continuity bug, or connect directly with the SmartToolHub engineering team.',
        canonicalPath: '/contact',
        ogType: 'website',
        keywords: 'Contact SmartToolHub, custom Apple workflow request, macOS support desk',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Contact Engineering', path: '/contact' },
        ],
      };
    } else if (currentPage === 'about') {
      config = {
        title: 'About SmartToolHub | Systems Engineering & Hardware Lab',
        description:
          'Learn about SmartToolHub’s mission, lead architect Dhrumil Aslaliya, physical Apple Silicon testing lab, and 5-stage editorial review standard.',
        canonicalPath: '/about',
        ogType: 'website',
        keywords: 'About SmartToolHub, Dhrumil Aslaliya, Apple Silicon lab, editorial integrity, macOS engineering',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' },
        ],
      };
    } else if (currentPage === 'guides') {
      config = {
        title: 'Apple Systems Engineering & Automation Guides | SmartToolHub',
        description:
          'In-depth architectural guides on macOS 15 AWDL protocol, Apple Silicon unified memory for local LLMs, and native sips media automation.',
        canonicalPath: '/guides',
        ogType: 'website',
        keywords: 'macOS AWDL protocol guide, Apple Silicon memory bandwidth, sips tutorial, Apple Shortcuts architecture',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Engineering Guides', path: '/guides' },
        ],
      };
    }

    // 1. Update document.title
    document.title = config.title;

    // Helper to safely set or update meta tags in-place
    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update single canonical link in-place (prevents duplicate canonical tags)
    const fullCanonicalUrl = `${baseUrl}${config.canonicalPath}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // Standard SEO Metas
    setMeta('name', 'description', config.description);
    setMeta('name', 'keywords', config.keywords);
    setMeta(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setMeta('name', 'author', 'SmartToolHub Engineering & Editorial Team');

    // OpenGraph Social Cards
    setMeta('property', 'og:title', config.title);
    setMeta('property', 'og:description', config.description);
    setMeta('property', 'og:url', fullCanonicalUrl);
    setMeta('property', 'og:type', config.ogType);
    setMeta('property', 'og:site_name', 'SmartToolHub');
    setMeta('property', 'og:image', `${baseUrl}/product-cover.jpg`);
    setMeta('property', 'og:image:secure_url', `${baseUrl}/product-cover.jpg`);
    setMeta('property', 'og:image:type', 'image/jpeg');
    setMeta('property', 'og:image:width', '1024');
    setMeta('property', 'og:image:height', '1024');
    setMeta(
      'property',
      'og:image:alt',
      'SmartToolHub – Apple Shortcuts Generator & Ecosystem Utility Suite'
    );
    setMeta('property', 'og:locale', 'en_US');

    // Twitter / X Large Summary Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:url', fullCanonicalUrl);
    setMeta('name', 'twitter:title', config.title);
    setMeta('name', 'twitter:description', config.description);
    setMeta('name', 'twitter:image', `${baseUrl}/product-cover.jpg`);
    setMeta(
      'name',
      'twitter:image:alt',
      'SmartToolHub – Apple Shortcuts Generator & Ecosystem Utility Suite'
    );

    // Comprehensive Schema.org JSON-LD @graph tailored to active route
    const schemaGraph: any[] = [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: `${baseUrl}/`,
        name: 'SmartToolHub',
        alternateName: 'SmartToolHub Apple Ecosystem & Web Utility Suite',
        description: config.description,
        inLanguage: 'en-US',
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'SmartToolHub',
          url: `${baseUrl}/`,
          email: 'aslaliyamohit9@gmail.com',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
          },
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/library?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${fullCanonicalUrl}#breadcrumb`,
        itemListElement: config.breadcrumbs.map((bc, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: bc.name,
          item: `${baseUrl}${bc.path}`,
        })),
      },
    ];

    // 1. Workflow Detail Pages (/workflows/:slug) -> Dedicated Article / TechArticle, HowTo, and FAQPage
    if (currentPage === 'workflow-detail' && workflowId) {
      const activeWf = WORKFLOWS_DATA.find((item) => item.id === workflowId) || WORKFLOWS_DATA[0];
      if (activeWf) {
        // Dynamic Article / TechArticle Schema
        schemaGraph.push({
          '@type': 'TechArticle',
          '@id': `${fullCanonicalUrl}#article`,
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${baseUrl}/#website`,
          },
          headline: `${activeWf.title} — Apple Automation Blueprint`,
          description: activeWf.summary,
          url: fullCanonicalUrl,
          image: [`${baseUrl}/product-cover.jpg`],
          datePublished: '2026-01-15T08:00:00Z',
          dateModified: `${activeWf.lastReviewedDate || '2026-09-18'}T00:00:00Z`,
          inLanguage: 'en-US',
          author: {
            '@type': 'Person',
            name: 'Dhrumil Aslaliya',
            jobTitle: 'Lead Systems Architect & Apple Specialist',
            url: `${baseUrl}/about`,
          },
          publisher: {
            '@type': 'Organization',
            '@id': `${baseUrl}/#organization`,
            name: 'SmartToolHub',
            url: `${baseUrl}/`,
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
              width: 512,
              height: 512,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': fullCanonicalUrl,
          },
          articleSection: activeWf.category,
          keywords: [
            activeWf.category,
            'Apple Shortcuts',
            'macOS Sequoia',
            'iOS 18',
            ...activeWf.appsUsed,
            ...activeWf.tags,
          ].join(', '),
          proficiencyLevel: activeWf.difficulty,
          dependencies: activeWf.devicesRequired
            .map((d) => `${d.device} (Min OS ${d.minOS}${d.hardwareNotes ? `, ${d.hardwareNotes}` : ''})`)
            .join(', '),
          timeRequired: `PT${activeWf.setupTimeMinutes}M`,
        });

        // Dynamic HowTo Schema
        schemaGraph.push({
          '@type': 'HowTo',
          '@id': `${fullCanonicalUrl}#howto`,
          name: `${activeWf.title} — Step-by-Step Setup Guide`,
          description: activeWf.summary,
          totalTime: `PT${activeWf.setupTimeMinutes}M`,
          tool: activeWf.devicesRequired.map((d) => ({
            '@type': 'HowToTool',
            name: `${d.device} (Minimum ${d.minOS}${d.hardwareNotes ? ` - ${d.hardwareNotes}` : ''})`,
          })),
          step: activeWf.steps.map((st, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            name: `Step ${idx + 1}: ${st.title}`,
            text: st.instruction,
            url: `${fullCanonicalUrl}#step-${idx + 1}`,
          })),
        });

        // Dynamic FAQPage Schema for Workflow Rich Results
        const faqSchema = generateWorkflowFAQSchema(activeWf, fullCanonicalUrl);
        schemaGraph.push(faqSchema);
      }
    }

    // 2. Troubleshooting & Diagnostics Page (/troubleshooting) -> Dedicated Diagnostic FAQPage & TechArticle
    else if (currentPage === 'troubleshooting') {
      const troubleshootingFaqs = TROUBLESHOOTING_DATA.map((issue) => {
        const quickFixText = issue.quickFixSteps.map((step, idx) => `${idx + 1}. ${step}`).join(' ');
        const deepFixText = issue.deepDiagnostics
          .map(
            (diag) =>
              `Step ${diag.step} (${diag.title}): ${diag.details}${diag.command ? ` [Terminal command: ${diag.command}]` : ''}`
          )
          .join(' ');
        const fullAnswer = `Symptoms: ${issue.symptoms.join('; ')}. Quick Fix Steps: ${quickFixText}. Deep Diagnostics: ${deepFixText}. Official Reference: ${issue.officialDocUrl}`;

        return {
          '@type': 'Question',
          name: `How do I fix: "${issue.title}" on macOS Sequoia & iOS 18?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: fullAnswer,
          },
        };
      });

      schemaGraph.push({
        '@type': 'FAQPage',
        '@id': `${fullCanonicalUrl}#faq`,
        name: 'Apple Continuity, AirDrop & macOS Sequoia Sync Diagnostics FAQ',
        description:
          'Verified diagnostic resolutions and safe macOS Terminal fixes for AirDrop discovery failures, iPhone Mirroring timeouts, Universal Clipboard lag, and Continuity Camera drops.',
        mainEntity: troubleshootingFaqs,
      });

      schemaGraph.push({
        '@type': 'TechArticle',
        '@id': `${fullCanonicalUrl}#diagnostic-article`,
        headline: 'macOS Sequoia & iOS 18 Continuity & AirDrop Sync Diagnostics Doctor',
        description: config.description,
        url: fullCanonicalUrl,
        image: [`${baseUrl}/product-cover.jpg`],
        datePublished: '2026-02-01T08:00:00Z',
        dateModified: '2026-09-20T00:00:00Z',
        author: {
          '@type': 'Person',
          name: 'Dhrumil Aslaliya',
          jobTitle: 'Lead Systems Architect & Apple Specialist',
          url: `${baseUrl}/about`,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'SmartToolHub',
          url: `${baseUrl}/`,
        },
        about: TROUBLESHOOTING_DATA.map((t) => ({
          '@type': 'Thing',
          name: `${t.feature} Sync Diagnostics`,
        })),
      });
    }

    // 3. Hardware Compatibility Matrix (/compatibility) -> TechArticle & Hardware Requirement FAQPage
    else if (currentPage === 'compatibility') {
      const compatibilityFaqs = COMPATIBILITY_FEATURES.map((feat) => ({
        '@type': 'Question',
        name: `What are the hardware and system requirements for ${feat.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Required Mac: ${feat.requiredMac}. Required iOS: ${feat.requiredIos}. Required iPad: ${feat.requiredIpad}. Hardware Chips: ${feat.hardwareChips}. Network Preconditions: ${feat.networkPreconditions.join('; ')}. Apple Account Rules: ${feat.appleAccountRules}. Official Apple Doc: ${feat.officialSupportUrl}`,
        },
      }));

      schemaGraph.push({
        '@type': 'TechArticle',
        '@id': `${fullCanonicalUrl}#compatibility-matrix`,
        headline: 'macOS Sequoia & Apple Silicon Hardware Compatibility Matrix',
        description:
          'Comprehensive hardware matrix for iPhone Mirroring, Continuity Camera Desk View, Universal Control, Sidecar, and on-device Apple Intelligence.',
        url: fullCanonicalUrl,
        image: [`${baseUrl}/product-cover.jpg`],
        datePublished: '2026-01-20T08:00:00Z',
        dateModified: '2026-09-15T00:00:00Z',
        author: {
          '@type': 'Person',
          name: 'Dhrumil Aslaliya',
          url: `${baseUrl}/about`,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'SmartToolHub',
          url: `${baseUrl}/`,
        },
      });

      schemaGraph.push({
        '@type': 'FAQPage',
        '@id': `${fullCanonicalUrl}#faq`,
        name: 'Apple Silicon & macOS Sequoia Feature Compatibility FAQ',
        description:
          'Frequently asked questions on chip requirements, T2 security chips, and Apple Intelligence RAM thresholds.',
        mainEntity: compatibilityFaqs,
      });
    }

    // 4. AI Shortcut & Script Generator (/generator) -> WebApplication, HowTo, and FAQPage
    else if (currentPage === 'generator') {
      schemaGraph.push({
        '@type': ['WebApplication', 'SoftwareApplication'],
        '@id': `${fullCanonicalUrl}#application`,
        name: 'AI Apple Shortcut & Script Generator',
        url: fullCanonicalUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'macOS 15 Sequoia, iOS 18, iPadOS 18, All Browsers',
        description:
          'Synthesize custom Siri Shortcuts (.shortcut), AppleScript automation, and POSIX Zsh shell scripts for multi-device Apple workflows in seconds.',
        featureList: [
          'AI Apple Shortcut Synthesis (.shortcut)',
          'Native AppleScript System Automation (osascript)',
          'POSIX / Zsh Batch Shell Scripts',
          'Zero-Credentials Architecture — No Apple ID required',
        ],
        offers: {
          '@type': 'Offer',
          name: 'Free Core AI Shortcut Synthesis',
          price: '0',
          priceCurrency: 'USD',
        },
      });

      schemaGraph.push({
        '@type': 'HowTo',
        '@id': `${fullCanonicalUrl}#howto`,
        name: 'How to Synthesize Custom Apple Shortcuts with AI',
        description:
          'Step-by-step guide to generating custom Siri Shortcuts, AppleScript automations, and Zsh terminal scripts using SmartToolHub.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Specify Automation Objective',
            text: 'Describe your routine in natural language (e.g., "Batch resize images and air-drop to iPad").',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Select Participating Apple Devices',
            text: 'Select your Mac, iPhone, iPad, or Apple Watch models and active OS versions.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Choose Output Format',
            text: 'Choose between Apple Shortcuts action tree, osascript AppleScript, or Zsh shell script.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Import & Execute Safely',
            text: 'Copy the verified script or import directly into the native Apple Shortcuts application.',
          },
        ],
      });

      schemaGraph.push({
        '@type': 'FAQPage',
        '@id': `${fullCanonicalUrl}#faq`,
        name: 'AI Apple Shortcut Generator FAQ',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Can the SmartToolHub AI Generator create multi-device Siri Shortcuts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. It generates actions specifically configured to coordinate between macOS Sequoia, iOS 18, iPadOS 18, and watchOS.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are generated AppleScript and Zsh commands safe to execute?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'All generated code uses non-destructive built-in macOS utilities (sips, defaults, osascript, open) and requires zero root privileges.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does SmartToolHub require my Apple ID or passwords?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. SmartToolHub operates on a strict Zero-Credentials architecture and never requests, collects, or stores Apple IDs or passwords.',
            },
          },
        ],
      });
    }

    // 5. Workflow Library Hub (/library) -> CollectionPage and Curated ItemList
    else if (currentPage === 'library') {
      schemaGraph.push({
        '@type': 'CollectionPage',
        '@id': `${fullCanonicalUrl}#collection`,
        name: '120+ Tested Apple Automation Blueprints & Shortcuts',
        description:
          'Browse 120+ verified macOS Sequoia and iOS 18 workflow blueprints for creators, developers, freelancers, and students.',
        url: fullCanonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: WORKFLOWS_DATA.length,
          itemListElement: WORKFLOWS_DATA.slice(0, 10).map((wf, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: wf.title,
            description: wf.summary,
            url: `${baseUrl}/workflows/${wf.slug}`,
          })),
        },
      });
    }

    // 6. Pricing & Pro License (/pricing) -> Product, Offer, and Pricing FAQPage
    else if (currentPage === 'pricing') {
      schemaGraph.push({
        '@type': 'Product',
        '@id': `${fullCanonicalUrl}#pro-license`,
        name: 'SmartToolHub Pro Lifetime License',
        description:
          'Unlock unlimited AI Apple Shortcut synthesis, deep Continuity diagnostics, and automated macOS batch utilities forever.',
        brand: {
          '@type': 'Brand',
          name: 'SmartToolHub',
        },
        offers: [
          {
            '@type': 'Offer',
            name: 'Free Core Community Suite',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: fullCanonicalUrl,
          },
          {
            '@type': 'Offer',
            name: 'SmartToolHub Pro Lifetime License',
            price: '39',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2026-12-31',
            url: fullCanonicalUrl,
          },
        ],
      });

      schemaGraph.push({
        '@type': 'FAQPage',
        '@id': `${fullCanonicalUrl}#faq`,
        name: 'SmartToolHub Pricing & Licensing FAQ',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is SmartToolHub really free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! All 120+ curated workflow blueprints and the complete client-side utility suite (Retina calculator, token counter, JSON-LD builder, bandwidth calculator) are 100% free with zero registration.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does the Pro Lifetime License unlock?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pro unlocks unlimited AI-powered Shortcut and script synthesis, AI deep diagnostic reasoning for custom errors, and direct access to exportable shell scripts.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are there any recurring monthly subscription fees?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. SmartToolHub Pro is a single one-time payment of $39 USD for lifetime access with zero monthly or annual subscriptions.',
            },
          },
        ],
      });
    }

    // 7. Engineering Guides Hub (/guides) -> CollectionPage and TechArticles
    else if (currentPage === 'guides') {
      schemaGraph.push({
        '@type': 'CollectionPage',
        '@id': `${fullCanonicalUrl}#collection`,
        name: 'Apple Systems Engineering & Automation Guides',
        description:
          'Deep architectural guides on macOS AWDL wireless protocols, Apple Silicon unified memory bandwidth for local LLMs, and native sips automation.',
        url: fullCanonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'macOS 15 AWDL Wireless Direct Protocol & Low-Latency Sync',
              url: `${baseUrl}/guides#awdl`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Apple Silicon Unified Memory Bandwidth for On-Device LLMs',
              url: `${baseUrl}/guides#silicon-memory`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Batch Image Processing with Native macOS sips CLI',
              url: `${baseUrl}/guides#sips-cli`,
            },
          ],
        },
      });
    }

    // 8. About Page (/about) -> AboutPage, Person, and Organization
    else if (currentPage === 'about') {
      schemaGraph.push({
        '@type': 'AboutPage',
        '@id': `${fullCanonicalUrl}#about`,
        name: 'About SmartToolHub & Physical Apple Silicon Lab',
        description: config.description,
        url: fullCanonicalUrl,
        mainEntity: {
          '@type': 'Person',
          '@id': `${baseUrl}/about#dhrumil-aslaliya`,
          name: 'Dhrumil Aslaliya',
          jobTitle: 'Lead Systems Architect & Apple Specialist',
          description:
            'Apple Silicon performance engineer, macOS protocol researcher, and creator of SmartToolHub.',
          url: `${baseUrl}/about`,
        },
      });
    }

    // 9. Default / Home Page (home) -> WebApplication, Interactive Tool Suites ItemList, and Home FAQPage
    else {
      schemaGraph.push(
        {
          '@type': ['WebApplication', 'SoftwareApplication'],
          '@id': `${baseUrl}/#application`,
          name: 'SmartToolHub',
          url: `${baseUrl}/`,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'macOS 15 Sequoia, iOS 18, iPadOS 18, All Web Browsers',
          description:
            'All-in-one Apple Shortcut AI generator, Retina image scale calculator, text & prompt synthesizer, JSON-LD SEO schema builder, Apple Silicon memory bandwidth calculator, and Continuity diagnostic suite.',
          featureList: [
            'AI Apple Shortcut, AppleScript & Zsh Generator',
            'Retina @2x/@3x Image Resolution & macOS sips Batch CLI Optimizer',
            'LLM Token Counter, Slugify & Prompt Engineering Synthesizer',
            'Schema.org JSON-LD & OpenGraph Meta Tag Builder',
            'Apple Silicon M1–M4 Max Unified Memory Bandwidth & Automation ROI Calculator',
            'Continuity Camera, iPhone Mirroring & AWDL Sync Doctor',
            '120+ Verified Multi-Device Apple Workflow Blueprints',
          ],
          offers: [
            {
              '@type': 'Offer',
              name: 'SmartToolHub Free Core Suite',
              price: '0',
              priceCurrency: 'USD',
            },
            {
              '@type': 'Offer',
              name: 'SmartToolHub Pro Lifetime License',
              price: '39',
              priceCurrency: 'USD',
            },
          ],
        },
        {
          '@type': 'ItemList',
          '@id': `${baseUrl}/#tool-suites`,
          name: 'SmartToolHub Interactive Utility Suites',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'AI Shortcut & Script Generator',
              url: `${baseUrl}/generator`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Image & Retina Media Studio',
              url: `${baseUrl}/?category=image`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Text & Prompt Synthesizer',
              url: `${baseUrl}/?category=text`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Technical SEO & JSON-LD Schema Builder',
              url: `${baseUrl}/?category=seo`,
            },
            {
              '@type': 'ListItem',
              position: 5,
              name: 'Apple Silicon Bandwidth & Automation ROI Calculators',
              url: `${baseUrl}/?category=calculator`,
            },
            {
              '@type': 'ListItem',
              position: 6,
              name: 'Continuity & AWDL Sync Doctor',
              url: `${baseUrl}/troubleshooting`,
            },
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': `${fullCanonicalUrl}#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How does the SmartToolHub AI Apple Shortcut Generator work?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Describe your automation goal in plain English and select your Apple devices (Mac, iPhone, iPad, Apple Watch). SmartToolHub synthesizes step-by-step native Siri Shortcuts actions, AppleScript snippets, and POSIX Zsh commands.',
              },
            },
            {
              '@type': 'Question',
              name: 'What client-side web utilities are included in SmartToolHub?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'SmartToolHub includes an interactive Retina @2x/@3x Image & macOS sips CLI Optimizer, an LLM Token Counter & Prompt Synthesizer, a live Schema.org JSON-LD & OpenGraph Tag Builder, and an Apple Silicon M1–M4 Unified Memory Bandwidth & Automation ROI Calculator.',
              },
            },
            {
              '@type': 'Question',
              name: 'Does SmartToolHub require my Apple ID or passwords?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. SmartToolHub operates on a strict Zero-Credentials architecture and never requests, collects, or stores Apple IDs, iCloud passwords, or private device tokens.',
              },
            },
          ],
        }
      );
    }

    // Inject/Update Schema.org Script Tag
    let scriptTag = document.getElementById('schema-ld-json') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-ld-json';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@graph': schemaGraph,
      },
      null,
      2
    );
  }, [currentPage, workflowId]);

  return null;
};
