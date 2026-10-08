import { WORKFLOWS_DATA } from '../data/workflows';
import { TROUBLESHOOTING_DATA } from '../data/troubleshooting';
import { COMPATIBILITY_FEATURES } from '../data/compatibility';
import { generateWorkflowFAQs } from '../utils/faqSchemaGenerator';

export interface RouteSeoData {
  title: string;
  description: string;
  canonicalPath: string;
  ogType: 'website' | 'article';
  ogImage: string;
  schemaJson: object;
  prerenderHtml: string;
}

const CANONICAL_HOST = 'https://smarttoolhub.net';

export function getRouteSeo(rawPath: string): RouteSeoData {
  const cleanPath = rawPath.split('?')[0].replace(/\/+$/, '') || '/';

  // 1. Individual Workflow Blueprint Pages (/workflows/:slug or /workflow/:slug)
  if (cleanPath.startsWith('/workflows/') || cleanPath.startsWith('/workflow/')) {
    const slug = cleanPath.replace(/^\/(workflows|workflow)\//, '');
    const wf = WORKFLOWS_DATA.find((item) => item.slug === slug || item.id === slug) || WORKFLOWS_DATA[0];
    const canonicalPath = `/workflows/${wf.slug}`;
    const pageUrl = `${CANONICAL_HOST}${canonicalPath}`;
    const faqs = generateWorkflowFAQs(wf);

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TechArticle',
          '@id': `${pageUrl}#article`,
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${CANONICAL_HOST}/#website`,
          },
          headline: `${wf.title} — Apple Automation Blueprint`,
          description: wf.summary,
          url: pageUrl,
          image: [`${CANONICAL_HOST}/product-cover.jpg`],
          datePublished: '2026-01-15T08:00:00Z',
          dateModified: `${wf.lastReviewedDate || '2026-09-18'}T00:00:00Z`,
          inLanguage: 'en-US',
          author: {
            '@type': 'Person',
            name: 'Dhrumil Aslaliya',
            jobTitle: 'Lead Systems Architect & Apple Specialist',
            url: `${CANONICAL_HOST}/about`,
          },
          publisher: {
            '@type': 'Organization',
            '@id': `${CANONICAL_HOST}/#organization`,
            name: 'SmartToolHub',
            url: CANONICAL_HOST,
            logo: {
              '@type': 'ImageObject',
              url: `${CANONICAL_HOST}/logo.png`,
              width: 512,
              height: 512,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl,
          },
          articleSection: wf.category,
          keywords: [
            wf.category,
            'Apple Shortcuts',
            'macOS Sequoia',
            'iOS 18',
            ...wf.appsUsed,
            ...wf.tags,
          ].join(', '),
          proficiencyLevel: wf.difficulty,
          dependencies: wf.devicesRequired
            .map((d) => `${d.device} (Min OS ${d.minOS}${d.hardwareNotes ? `, ${d.hardwareNotes}` : ''})`)
            .join(', '),
          timeRequired: `PT${wf.setupTimeMinutes}M`,
        },
        {
          '@type': 'HowTo',
          '@id': `${pageUrl}#howto`,
          name: `${wf.title} — Apple Ecosystem Blueprint`,
          description: wf.summary,
          totalTime: `PT${wf.setupTimeMinutes}M`,
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: '0',
          },
          tool: wf.devicesRequired.map((d) => ({
            '@type': 'HowToTool',
            name: `${d.device} (Minimum ${d.minOS})`,
          })),
          step: wf.steps.map((st, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            name: `Step ${idx + 1}: ${st.title}`,
            text: st.instruction,
            url: `${pageUrl}#step-${idx + 1}`,
          })),
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: faqs.slice(0, 4).map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_HOST },
            { '@type': 'ListItem', position: 2, name: 'Workflow Library', item: `${CANONICAL_HOST}/library` },
            { '@type': 'ListItem', position: 3, name: wf.title, item: pageUrl },
          ],
        },
      ],
    };

    const prerenderHtml = `
      <div class="prerender-shell" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <nav aria-label="Breadcrumbs" style="font-size: 0.85rem; color: #818cf8; margin-bottom: 1.5rem;">
          <a href="/" style="color: #818cf8; text-decoration: none;">Home</a> &rarr;
          <a href="/library" style="color: #818cf8; text-decoration: none;">Workflows</a> &rarr;
          <span style="color: #cbd5e1;">${wf.title}</span>
        </nav>
        <article>
          <header style="margin-bottom: 2rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #818cf8; font-weight: 700; letter-spacing: 0.05em;">
              ${wf.category} Blueprint · ${wf.setupTimeMinutes} Min Setup
            </div>
            <h1 style="font-size: 2.25rem; font-weight: 800; margin: 0.5rem 0 1rem 0; line-height: 1.2;">
              ${wf.title}
            </h1>
            <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">
              ${wf.summary}
            </p>
          </header>

          <section style="margin-bottom: 2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem;">
            <h2 style="font-size: 1.25rem; margin-top: 0;">Required Apple Hardware & Operating Systems</h2>
            <ul style="line-height: 1.8; color: #cbd5e1;">
              ${wf.devicesRequired.map((d) => `<li><strong>${d.device}</strong>: Minimum ${d.minOS}${d.hardwareNotes ? ` (${d.hardwareNotes})` : ''}</li>`).join('')}
            </ul>
          </section>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.5rem;">Step-by-Step Setup Actions</h2>
            <ol style="line-height: 1.8; color: #e2e8f0; padding-left: 1.25rem;">
              ${wf.steps.map((st) => `<li style="margin-bottom: 0.75rem;"><strong>${st.title}</strong>: ${st.instruction}</li>`).join('')}
            </ol>
          </section>

          <section style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem;">Frequently Asked Questions</h2>
            ${faqs.slice(0, 3).map((f) => `
              <div style="margin-bottom: 1rem;">
                <h3 style="font-size: 1rem; color: #f8fafc; margin-bottom: 0.25rem;">${f.question}</h3>
                <p style="font-size: 0.9rem; color: #94a3b8; margin: 0;">${f.answer}</p>
              </div>
            `).join('')}
          </section>
        </article>
      </div>
    `;

    return {
      title: `${wf.title} Blueprint & Shortcut Steps | SmartToolHub`,
      description: wf.summary.slice(0, 155),
      canonicalPath,
      ogType: 'article',
      ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
      schemaJson,
      prerenderHtml,
    };
  }

  // 2. AI Shortcut & Script Generator (/generator)
  if (cleanPath === '/generator') {
    const canonicalPath = '/generator';
    const pageUrl = `${CANONICAL_HOST}${canonicalPath}`;

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['WebApplication', 'SoftwareApplication'],
          '@id': `${pageUrl}#generator`,
          name: 'AI Apple Shortcut & Script Generator',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'macOS 15 Sequoia, iOS 18, iPadOS 18, All Browsers',
          description: 'Synthesize custom Siri Shortcuts, AppleScript automation, and Zsh shell scripts for multi-device Apple workflows in seconds.',
          url: pageUrl,
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_HOST },
            { '@type': 'ListItem', position: 2, name: 'AI Shortcut Generator', item: pageUrl },
          ],
        },
      ],
    };

    const prerenderHtml = `
      <div class="prerender-shell" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <nav aria-label="Breadcrumbs" style="font-size: 0.85rem; color: #818cf8; margin-bottom: 1.5rem;">
          <a href="/" style="color: #818cf8; text-decoration: none;">Home</a> &rarr;
          <span style="color: #cbd5e1;">AI Shortcut Generator</span>
        </nav>
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; margin: 0 0 1rem 0;">AI Apple Shortcut & Script Generator</h1>
          <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">
            Synthesize bespoke Apple Shortcuts, AppleScript automations, and native macOS Zsh scripts. Describe any multi-device routine across Mac, iPhone, and iPad to generate copy-paste actions instantly.
          </p>
        </header>
        <section style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; margin-top: 0;">Supported Automation Engines</h2>
          <ul style="line-height: 1.8; color: #cbd5e1;">
            <li><strong>Apple Shortcuts (.shortcut)</strong>: Native actions for iOS 18 and macOS Sequoia with Siri intent integration.</li>
            <li><strong>AppleScript (osascript)</strong>: Deep system automation for Finder, System Events, and legacy Mac applications.</li>
            <li><strong>POSIX / Zsh Shell Scripts</strong>: High-throughput CLI batch processing using built-in sips, defaults, and cron utilities.</li>
          </ul>
        </section>
      </div>
    `;

    return {
      title: 'AI Apple Shortcut & Script Generator | SmartToolHub',
      description: 'Synthesize custom multi-device Siri Shortcuts, AppleScript, and Zsh automations for Mac, iPhone, and iPad in seconds with SmartToolHub.',
      canonicalPath,
      ogType: 'website',
      ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
      schemaJson,
      prerenderHtml,
    };
  }

  // 3. Hardware Compatibility Matrix (/compatibility)
  if (cleanPath === '/compatibility') {
    const canonicalPath = '/compatibility';
    const pageUrl = `${CANONICAL_HOST}${canonicalPath}`;

    const compatibilityFaqs = COMPATIBILITY_FEATURES.map((feat) => ({
      '@type': 'Question',
      name: `What are the hardware and system requirements for ${feat.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Required Mac: ${feat.requiredMac}. Required iOS: ${feat.requiredIos}. Required iPad: ${feat.requiredIpad}. Hardware Chips: ${feat.hardwareChips}. Network Preconditions: ${feat.networkPreconditions.join('; ')}. Apple Account Rules: ${feat.appleAccountRules}. Official Apple Doc: ${feat.officialSupportUrl}`,
      },
    }));

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TechArticle',
          '@id': `${pageUrl}#article`,
          headline: 'macOS Sequoia & Apple Silicon Hardware Compatibility Matrix',
          description: 'Verified hardware matrix for iPhone Mirroring, Continuity Camera Desk View, Universal Control, Sidecar, and Apple Intelligence.',
          url: pageUrl,
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          name: 'Apple Silicon & macOS Sequoia Feature Compatibility FAQ',
          description: 'Hardware, chip, and memory requirements for macOS Sequoia continuity and intelligence features.',
          mainEntity: compatibilityFaqs,
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_HOST },
            { '@type': 'ListItem', position: 2, name: 'Compatibility Matrix', item: pageUrl },
          ],
        },
      ],
    };

    const prerenderHtml = `
      <div class="prerender-shell" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <nav aria-label="Breadcrumbs" style="font-size: 0.85rem; color: #818cf8; margin-bottom: 1.5rem;">
          <a href="/" style="color: #818cf8; text-decoration: none;">Home</a> &rarr;
          <span style="color: #cbd5e1;">Compatibility Matrix</span>
        </nav>
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; margin: 0 0 1rem 0;">macOS Sequoia & Apple Silicon Compatibility Matrix</h1>
          <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">
            Interactive hardware verification table for iPhone Mirroring, Continuity Camera, Universal Control, Sidecar, and on-device Apple Intelligence.
          </p>
        </header>
        <section style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem;">
          <h2 style="font-size: 1.25rem; margin-top: 0;">Feature Requirements Breakdown</h2>
          <ul style="line-height: 1.8; color: #cbd5e1;">
            <li><strong>iPhone Mirroring</strong>: Apple Silicon Mac (M1–M4) or Intel Mac with T2 Security Chip running macOS 15 Sequoia + iPhone running iOS 18 with 2FA enabled.</li>
            <li><strong>Apple Intelligence</strong>: M1 chip or newer Mac, iPad, or iPhone 15 Pro / 16 series with minimum 8GB unified memory.</li>
            <li><strong>Continuity Camera Desk View</strong>: iPhone 11 or newer running iOS 16+ paired with Mac on macOS 13 Ventura or newer.</li>
            <li><strong>Universal Control</strong>: Bluetooth 4.2+, Wi-Fi on, within 30 feet, same Apple ID.</li>
          </ul>
        </section>
      </div>
    `;

    return {
      title: 'Apple Silicon & Sequoia Compatibility Matrix | SmartToolHub',
      description: 'Verify exact Mac, iPhone, and iPad hardware requirements for iPhone Mirroring, Continuity Camera, Universal Control, Sidecar, and Apple Intelligence.',
      canonicalPath,
      ogType: 'website',
      ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
      schemaJson,
      prerenderHtml,
    };
  }

  // 4. Continuity & AWDL Sync Diagnostics (/troubleshooting)
  if (cleanPath === '/troubleshooting') {
    const canonicalPath = '/troubleshooting';
    const pageUrl = `${CANONICAL_HOST}${canonicalPath}`;

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

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          name: 'Apple Continuity, AirDrop & macOS Sequoia Sync Diagnostics FAQ',
          description:
            'Verified diagnostic resolutions and safe macOS Terminal fixes for AirDrop discovery failures, iPhone Mirroring timeouts, Universal Clipboard lag, and Continuity Camera drops.',
          mainEntity: troubleshootingFaqs,
        },
        {
          '@type': 'TechArticle',
          '@id': `${pageUrl}#diagnostic-article`,
          headline: 'macOS Sequoia & iOS 18 Continuity & AirDrop Sync Diagnostics Doctor',
          description:
            'Resolve AirDrop dropouts, iPhone Mirroring timeouts, and Universal Clipboard lag with interactive diagnostics and safe macOS terminal commands.',
          url: pageUrl,
          image: [`${CANONICAL_HOST}/product-cover.jpg`],
          datePublished: '2026-02-01T08:00:00Z',
          dateModified: '2026-09-20T00:00:00Z',
          author: {
            '@type': 'Person',
            name: 'Dhrumil Aslaliya',
            jobTitle: 'Lead Systems Architect & Apple Specialist',
            url: `${CANONICAL_HOST}/about`,
          },
          publisher: {
            '@type': 'Organization',
            '@id': `${CANONICAL_HOST}/#organization`,
            name: 'SmartToolHub',
            url: CANONICAL_HOST,
          },
          about: TROUBLESHOOTING_DATA.map((t) => ({
            '@type': 'Thing',
            name: `${t.feature} Sync Diagnostics`,
          })),
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_HOST },
            { '@type': 'ListItem', position: 2, name: 'Sync Diagnostics', item: pageUrl },
          ],
        },
      ],
    };

    const prerenderHtml = `
      <div class="prerender-shell" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <nav aria-label="Breadcrumbs" style="font-size: 0.85rem; color: #818cf8; margin-bottom: 1.5rem;">
          <a href="/" style="color: #818cf8; text-decoration: none;">Home</a> &rarr;
          <span style="color: #cbd5e1;">Sync Diagnostics</span>
        </nav>
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; margin: 0 0 1rem 0;">Apple Continuity & AirDrop Sync Diagnostics Doctor</h1>
          <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">
            Resolve AirDrop dropouts, iPhone Mirroring timeouts, and Universal Clipboard desynchronization with guided troubleshooting trees and safe macOS terminal fixes.
          </p>
        </header>
      </div>
    `;

    return {
      title: 'Continuity & AirDrop Sync Diagnostics Doctor | SmartToolHub',
      description: 'Resolve AirDrop dropouts, iPhone Mirroring timeouts, and Universal Clipboard lag with interactive diagnostics and safe macOS terminal commands.',
      canonicalPath,
      ogType: 'website',
      ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
      schemaJson,
      prerenderHtml,
    };
  }

  // 5. Workflow Library (/library)
  if (cleanPath === '/library') {
    const canonicalPath = '/library';
    const pageUrl = `${CANONICAL_HOST}${canonicalPath}`;

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#collection`,
          name: 'Verified Apple Workflows & Shortcuts Library',
          description: 'Browse 120+ tested macOS Sequoia and iOS 18 automation blueprints for creators, developers, freelancers, and students.',
          url: pageUrl,
        },
        {
          '@type': 'ItemList',
          '@id': `${pageUrl}#list`,
          name: 'Curated Multi-Device Apple Blueprints',
          itemListElement: WORKFLOWS_DATA.slice(0, 10).map((wf, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: wf.title,
            url: `${CANONICAL_HOST}/workflows/${wf.slug}`,
          })),
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_HOST },
            { '@type': 'ListItem', position: 2, name: 'Workflow Library', item: pageUrl },
          ],
        },
      ],
    };

    const prerenderHtml = `
      <div class="prerender-shell" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <nav aria-label="Breadcrumbs" style="font-size: 0.85rem; color: #818cf8; margin-bottom: 1.5rem;">
          <a href="/" style="color: #818cf8; text-decoration: none;">Home</a> &rarr;
          <span style="color: #cbd5e1;">Workflow Library</span>
        </nav>
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; margin: 0 0 1rem 0;">Verified Apple Workflow & Shortcut Library</h1>
          <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">
            Over 120 peer-reviewed blueprints with step-by-step instructions, hardware compatibility, and keyboard shortcut maps.
          </p>
        </header>
        <div style="display: grid; gap: 1rem;">
          ${WORKFLOWS_DATA.map((wf) => `
            <div style="padding: 1.25rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
              <h3 style="margin: 0 0 0.5rem 0;"><a href="/workflows/${wf.slug}" style="color: #818cf8; text-decoration: none;">${wf.title}</a></h3>
              <p style="font-size: 0.9rem; color: #94a3b8; margin: 0;">${wf.summary}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return {
      title: '120+ Verified Apple Workflows Library | SmartToolHub',
      description: 'Browse 120+ tested macOS Sequoia and iOS 18 automation blueprints for creators, developers, freelancers, and students with zero third-party bloat.',
      canonicalPath,
      ogType: 'website',
      ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
      schemaJson,
      prerenderHtml,
    };
  }

  // 6. Engineering Guides (/guides)
  if (cleanPath === '/guides') {
    const canonicalPath = '/guides';
    const pageUrl = `${CANONICAL_HOST}${canonicalPath}`;

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#collection`,
          name: 'Apple Systems Engineering & Automation Guides',
          description: 'Peer-reviewed technical guides covering macOS Sequoia AWDL protocols, Apple Silicon memory bandwidth, and native sips automation.',
          url: pageUrl,
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_HOST },
            { '@type': 'ListItem', position: 2, name: 'Engineering Guides', item: pageUrl },
          ],
        },
      ],
    };

    const prerenderHtml = `
      <div class="prerender-shell" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <nav aria-label="Breadcrumbs" style="font-size: 0.85rem; color: #818cf8; margin-bottom: 1.5rem;">
          <a href="/" style="color: #818cf8; text-decoration: none;">Home</a> &rarr;
          <span style="color: #cbd5e1;">Engineering Guides</span>
        </nav>
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; margin: 0 0 1rem 0;">Apple Systems Engineering & Automation Guides</h1>
          <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">
            Deep architectural teardowns of macOS Sequoia Continuity, Apple Silicon unified memory bandwidth for local LLMs, and high-performance sips digital media pipelines.
          </p>
        </header>
      </div>
    `;

    return {
      title: 'Apple Systems Engineering & Automation Guides | SmartToolHub',
      description: 'Deep-dive technical guides on macOS Sequoia AWDL wireless protocols, Apple Silicon unified memory bandwidth, and Xcode Retina image optimization.',
      canonicalPath,
      ogType: 'website',
      ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
      schemaJson,
      prerenderHtml,
    };
  }

  // 7. About Page (/about)
  if (cleanPath === '/about') {
    const canonicalPath = '/about';
    const pageUrl = `${CANONICAL_HOST}${canonicalPath}`;

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `${pageUrl}#about`,
          name: 'About SmartToolHub',
          description: 'Systems engineering publication and physical Apple Silicon hardware testing lab founded by Dhrumil Aslaliya.',
          url: pageUrl,
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_HOST },
            { '@type': 'ListItem', position: 2, name: 'About Us', item: pageUrl },
          ],
        },
      ],
    };

    const prerenderHtml = `
      <div class="prerender-shell" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800;">About SmartToolHub — Systems Engineering & Physical Hardware Lab</h1>
          <p style="font-size: 1.1rem; color: #94a3b8; line-height: 1.6;">
            Founded by systems architect Dhrumil Aslaliya in Surat, Gujarat, India. Every blueprint and diagnostic workflow is validated on physical Apple Silicon hardware.
          </p>
        </header>
      </div>
    `;

    return {
      title: 'About SmartToolHub — Systems Engineering & Physical Hardware Lab',
      description: 'Discover SmartToolHub editorial standards, physical Apple Silicon testing laboratory, zero-credentials security model, and contact details.',
      canonicalPath,
      ogType: 'website',
      ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
      schemaJson,
      prerenderHtml,
    };
  }

  // 8. Contact Page (/contact)
  if (cleanPath === '/contact') {
    const canonicalPath = '/contact';
    const pageUrl = `${CANONICAL_HOST}${canonicalPath}`;

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': `${pageUrl}#contact`,
          name: 'Contact SmartToolHub',
          url: pageUrl,
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumbs`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: CANONICAL_HOST },
            { '@type': 'ListItem', position: 2, name: 'Contact Us', item: pageUrl },
          ],
        },
      ],
    };

    const prerenderHtml = `
      <div class="prerender-shell" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h1>Contact Engineering & Support</h1>
        <p>Email: <a href="mailto:aslaliyamohit9@gmail.com" style="color: #818cf8;">aslaliyamohit9@gmail.com</a></p>
        <p>Location: Surat, Gujarat, India</p>
      </div>
    `;

    return {
      title: 'Contact Engineering & Hardware Lab | SmartToolHub',
      description: 'Reach SmartToolHub engineering team for custom Apple Shortcut requests, bug reports, and hardware compatibility consultations.',
      canonicalPath,
      ogType: 'website',
      ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
      schemaJson,
      prerenderHtml,
    };
  }

  // Default Home Page (/)
  return {
    title: 'SmartToolHub — Apple Shortcuts & macOS Sequoia Automation',
    description: 'Generate custom Apple Shortcuts and macOS Sequoia automation workflows instantly. Verify device compatibility, synthesize scripts, and troubleshoot Continuity.',
    canonicalPath: '/',
    ogType: 'website',
    ogImage: `${CANONICAL_HOST}/product-cover.jpg`,
    schemaJson: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${CANONICAL_HOST}/#website`,
          url: `${CANONICAL_HOST}/`,
          name: 'SmartToolHub',
          description: 'Generate custom Apple Shortcuts and macOS Sequoia automation workflows instantly. Verify device compatibility, synthesize scripts, and troubleshoot Continuity.',
        },
      ],
    },
    prerenderHtml: `
      <div class="prerender-shell" style="max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <header style="margin-bottom: 2.5rem; text-align: center;">
          <h1 style="font-size: 2.75rem; font-weight: 800; margin: 0 0 1rem 0; line-height: 1.2;">Apple Shortcuts, macOS Sequoia Automation & Continuity Diagnostics</h1>
          <p style="font-size: 1.2rem; color: #94a3b8; max-width: 800px; margin: 0 auto 1.5rem auto; line-height: 1.6;">
            Client-side Apple utility platform and peer-reviewed systems engineering publication for macOS Sequoia and iOS 18 power users.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/generator" style="background: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600;">Launch AI Generator</a>
            <a href="/library" style="background: rgba(255,255,255,0.1); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600;">Browse 120+ Workflows</a>
            <a href="/troubleshooting" style="background: rgba(255,255,255,0.1); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600;">Continuity Diagnostics</a>
          </div>
        </header>
      </div>
    `,
  };
}

/**
 * Replaces placeholders in index.html with route-specific SEO tags and pre-rendered semantic HTML
 */
export function injectSeoIntoHtml(html: string, reqPath: string, isBot = false): string {
  const seo = getRouteSeo(reqPath);
  const canonicalUrl = `${CANONICAL_HOST}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;

  let result = html;

  // Replace Title
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seo.title}</title>`);

  // Replace Description
  result = result.replace(
    /<meta name="description" content="[\s\S]*?" \/>/i,
    `<meta name="description" content="${seo.description.replace(/"/g, '&quot;')}" />`
  );

  // Replace Canonical Link
  result = result.replace(
    /<link rel="canonical" href="[\s\S]*?" \/>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace OpenGraph URL, Title, Description
  result = result.replace(
    /<meta property="og:url" content="[\s\S]*?" \/>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  result = result.replace(
    /<meta property="og:title" content="[\s\S]*?" \/>/i,
    `<meta property="og:title" content="${seo.title.replace(/"/g, '&quot;')}" />`
  );
  result = result.replace(
    /<meta property="og:description" content="[\s\S]*?" \/>/i,
    `<meta property="og:description" content="${seo.description.replace(/"/g, '&quot;')}" />`
  );

  // Replace Twitter URL, Title, Description
  result = result.replace(
    /<meta name="twitter:url" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:url" content="${canonicalUrl}" />`
  );
  result = result.replace(
    /<meta name="twitter:title" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:title" content="${seo.title.replace(/"/g, '&quot;')}" />`
  );
  result = result.replace(
    /<meta name="twitter:description" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:description" content="${seo.description.replace(/"/g, '&quot;')}" />`
  );

  // Replace JSON-LD schema
  const schemaString = JSON.stringify(seo.schemaJson, null, 2);
  result = result.replace(
    /<script id="schema-ld-json" type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script id="schema-ld-json" type="application/ld+json">\n${schemaString}\n</script>`
  );

  // Inject prerenderHtml into <div id="root"> for crawlers or if requested
  if (isBot && seo.prerenderHtml && result.includes('<div id="root"')) {
    result = result.replace(
      /<div id="root"[^>]*>[\s\S]*?<\/div>/i,
      `<div id="root" class="min-h-screen bg-[#030712]">${seo.prerenderHtml}</div>`
    );
  }

  return result;
}
