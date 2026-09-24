import React, { useEffect } from 'react';
import { PageId } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';

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

const BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://ais-pre-2g4gbzzp4x73zscaavhv5d-405968822776.asia-southeast1.run.app';

export const SEOHead: React.FC<SEOHeadProps> = ({ currentPage, workflowId }) => {
  useEffect(() => {
    // Determine page metadata
    let config: MetaConfig = {
      title: 'SmartToolHub — Apple Workflows, Shortcuts & Compatibility',
      description: 'Discover verified Apple ecosystem workflows, multi-device Shortcuts, macOS Sequoia compatibility checks, and step-by-step Continuity troubleshooting.',
      canonicalPath: '/',
      ogType: 'website',
      keywords: 'Apple workflows, macOS Sequoia shortcuts, Continuity Camera desk view, Universal Control troubleshooting, iPhone Mac integration',
      breadcrumbs: [{ name: 'Home', path: '/' }]
    };

    if (currentPage === 'generator') {
      config = {
        title: 'Apple Workflow Generator & Shortcut Builder | SmartToolHub',
        description: 'Build custom multi-device Apple workflows and Shortcuts for Mac, iPhone, and iPad. Filter by devices, ecosystem apps, and task difficulty.',
        canonicalPath: '/generator',
        ogType: 'website',
        keywords: 'Apple workflow builder, Mac iPhone automation, Shortcuts generator, macOS 15 Sequoia workflows',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Workflow Generator', path: '/generator' }
        ]
      };
    } else if (currentPage === 'compatibility') {
      config = {
        title: 'Apple Silicon & macOS Sequoia Compatibility Checker | SmartToolHub',
        description: 'Check exact hardware and OS requirements for iPhone Mirroring, Continuity Camera, Universal Control, Sidecar, and Apple Intelligence.',
        canonicalPath: '/compatibility',
        ogType: 'website',
        keywords: 'macOS Sequoia compatibility, Apple Intelligence hardware requirements, iPhone Mirroring M-series Mac, Continuity feature matrix',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Compatibility Checker', path: '/compatibility' }
        ]
      };
    } else if (currentPage === 'troubleshooting') {
      config = {
        title: 'Continuity & AirDrop Troubleshooting Wizard | SmartToolHub',
        description: 'Step-by-step diagnostic trees and safe terminal fixes for Universal Clipboard, Continuity disconnects, AirDrop dropouts, and macOS permissions.',
        canonicalPath: '/troubleshooting',
        ogType: 'website',
        keywords: 'Continuity camera not connecting, fix Universal Clipboard Mac iPhone, AirDrop dropouts macOS 15, Apple troubleshooting guide',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Troubleshooting Wizard', path: '/troubleshooting' }
        ]
      };
    } else if (currentPage === 'library') {
      config = {
        title: 'Verified Apple Workflows & Shortcuts Library | SmartToolHub',
        description: 'Explore verified, built-in Apple workflows for content creators, students, freelancers, and power users. No third-party bloat required.',
        canonicalPath: '/library',
        ogType: 'website',
        keywords: 'Apple Shortcuts library, Continuity workflows, Mac productivity guides, iPad student setups, iPhone creator setups',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Workflow Library', path: '/library' }
        ]
      };
    } else if (currentPage === 'workflow-detail' && workflowId) {
      const wf = WORKFLOWS_DATA.find((item) => item.id === workflowId) || WORKFLOWS_DATA[0];
      config = {
        title: `${wf.title} | SmartToolHub`,
        description: wf.summary.length > 155 ? `${wf.summary.slice(0, 152)}...` : wf.summary,
        canonicalPath: `/workflows/${wf.slug}`,
        ogType: 'article',
        keywords: `${wf.category}, ${wf.appsUsed.join(', ')}, ${wf.devicesRequired.map(d => d.device).join(', ')}, Apple Shortcuts guide`,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Workflows', path: '/library' },
          { name: wf.title, path: `/workflows/${wf.slug}` }
        ]
      };
    } else if (currentPage === 'pricing') {
      config = {
        title: 'Plans & Transparent Pricing | SmartToolHub',
        description: 'Access verified Apple workflows and compatibility matrices for free, or unlock SmartToolHub Pro for Gemini AI automation scripts and deep diagnostics.',
        canonicalPath: '/pricing',
        ogType: 'website',
        keywords: 'SmartToolHub Pro, Apple automation scripts, AI diagnosis, workflow pricing',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Pricing & Pro Access', path: '/pricing' }
        ]
      };
    } else if (currentPage === 'privacy') {
      config = {
        title: 'Privacy Policy & Zero-Credentials Guarantee | SmartToolHub',
        description: 'Read SmartToolHub’s privacy commitment. We never ask for, collect, or store Apple Accounts, iCloud credentials, or device passwords.',
        canonicalPath: '/privacy',
        ogType: 'website',
        keywords: 'SmartToolHub privacy policy, zero credentials, Apple data security',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' }
        ]
      };
    } else if (currentPage === 'terms') {
      config = {
        title: 'Terms of Service | SmartToolHub',
        description: 'Terms and conditions for using SmartToolHub’s Apple workflow guides, compatibility checker, and troubleshooting wizards.',
        canonicalPath: '/terms',
        ogType: 'website',
        keywords: 'SmartToolHub terms, usage policy, independent disclaimer',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms' }
        ]
      };
    } else if (currentPage === 'contact') {
      config = {
        title: 'Contact & Workflow Suggestion Desk | SmartToolHub',
        description: 'Suggest a multi-device Apple workflow, request new macOS Sequoia compatibility testing, or submit feedback to the SmartToolHub editorial team.',
        canonicalPath: '/contact',
        ogType: 'website',
        keywords: 'Contact SmartToolHub, submit Apple workflow, report Continuity issue',
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Contact Us', path: '/contact' }
        ]
      };
    }

    // 1. Update document.title
    document.title = config.title;

    // Helper to safely set meta tags
    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set link tags
    const setLink = (rel: string, href: string, type?: string, sizes?: string) => {
      let link = document.querySelector(`link[rel="${rel}"][href="${href}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        if (type) link.setAttribute('type', type);
        if (sizes) link.setAttribute('sizes', sizes);
        document.head.appendChild(link);
      }
    };

    // Ensure Favicon & Apple Touch Icons exist dynamically
    setLink('icon', '/favicon.svg', 'image/svg+xml');
    setLink('icon', '/favicon.ico', 'image/x-icon');
    setLink('shortcut icon', '/favicon.ico', 'image/x-icon');
    setLink('icon', '/favicon-32x32.png', 'image/png', '32x32');
    setLink('icon', '/favicon-16x16.png', 'image/png', '16x16');
    setLink('apple-touch-icon', '/apple-touch-icon.png', 'image/png', '180x180');

    // Standard SEO Metas
    setMeta('name', 'description', config.description);
    setMeta('name', 'keywords', config.keywords);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('name', 'author', 'SmartToolHub Editorial Team');

    // OpenGraph
    const fullCanonicalUrl = `${BASE_URL}${config.canonicalPath}`;
    setLink('canonical', fullCanonicalUrl);
    setMeta('property', 'og:title', config.title);
    setMeta('property', 'og:description', config.description);
    setMeta('property', 'og:url', fullCanonicalUrl);
    setMeta('property', 'og:type', config.ogType);
    setMeta('property', 'og:site_name', 'SmartToolHub');
    setMeta('property', 'og:image', `${BASE_URL}/product-cover.jpg`);
    setMeta('property', 'og:image:secure_url', `${BASE_URL}/product-cover.jpg`);
    setMeta('property', 'og:image:type', 'image/jpeg');
    setMeta('property', 'og:image:width', '1024');
    setMeta('property', 'og:image:height', '1024');
    setMeta('property', 'og:image:alt', 'SmartToolHub Apple Ecosystem Intelligence Platform');
    setMeta('property', 'og:locale', 'en_US');

    // Twitter Cards
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', config.title);
    setMeta('name', 'twitter:description', config.description);
    setMeta('name', 'twitter:image', `${BASE_URL}/product-cover.jpg`);
    setMeta('name', 'twitter:image:alt', 'SmartToolHub Apple Workflows');

    // Generate JSON-LD Structured Data Graph
    const schemaGraph: any[] = [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        'url': BASE_URL,
        'name': 'SmartToolHub',
        'description': 'Independent Apple Workflows, Shortcuts, and Ecosystem Diagnostics',
        'publisher': {
          '@type': 'Organization',
          'name': 'SmartToolHub',
          'logo': {
            '@type': 'ImageObject',
            'url': `${BASE_URL}/logo.png`
          }
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${BASE_URL}/library?search={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${BASE_URL}/#application`,
        'name': 'SmartToolHub Apple Workflow Suite',
        'applicationCategory': 'UtilitiesApplication',
        'operatingSystem': 'macOS 13+, iOS 16+, iPadOS 16+, Web',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'description': 'Interactive generator, compatibility validator, and diagnostic tree utility for Apple Mac, iPhone, and iPad continuity features.',
        'citation': [
          'https://developer.apple.com/documentation/appintents',
          'https://support.apple.com/guide/security/welcome/web',
          'https://support.apple.com/guide/mac-help/use-continuity-to-connect-apple-devices-mchl407037be/mac',
          'https://datatracker.ietf.org/doc/html/rfc6762'
        ],
        'isBasedOn': [
          'https://developer.apple.com/documentation/appintents',
          'https://support.apple.com/guide/mac-help/use-continuity-to-connect-apple-devices-mchl407037be/mac'
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${fullCanonicalUrl}#breadcrumb`,
        'itemListElement': config.breadcrumbs.map((bc, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': bc.name,
          'item': `${BASE_URL}${bc.path}`
        }))
      }
    ];

    // If on a workflow detail page, add HowTo schema
    if (currentPage === 'workflow-detail' && workflowId) {
      const activeWf = WORKFLOWS_DATA.find((item) => item.id === workflowId);
      if (activeWf) {
        schemaGraph.push({
          '@type': 'HowTo',
          '@id': `${fullCanonicalUrl}#howto`,
          'name': activeWf.title,
          'description': activeWf.summary,
          'totalTime': `PT${activeWf.setupTimeMinutes}M`,
          'tool': activeWf.devicesRequired.map((d) => ({
            '@type': 'HowToTool',
            'name': `${d.device} (${d.minOS})`
          })),
          'step': activeWf.steps.map((st) => ({
            '@type': 'HowToStep',
            'position': st.stepNumber,
            'name': st.title,
            'text': st.instruction
          }))
        });
      }
    }

    // Inject/Update Schema.org Script Tag
    let scriptTag = document.getElementById('schema-ld-json') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-ld-json';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemaGraph
    }, null, 2);

  }, [currentPage, workflowId]);

  return null;
};
