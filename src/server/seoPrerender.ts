import { LAUNCH_TOOLS } from '../data/tools.ts';
import { SOFTWARE_APPS } from '../data/softwareDirectory.ts';
import { COMPARISONS } from '../data/comparisons.ts';
import { GUIDE_ARTICLES } from '../data/guides.ts';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage: string;
  schemaJson: any;
  prerenderedHtml: string;
}

const BASE_URL = 'https://smarttoolhub.net';

// Helper to escape HTML characters
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function resolveSeo(pathname: string): SeoMetadata {
  const cleanPath = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const canonicalUrl = `${BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
  const ogImage = `${BASE_URL}/og-image.svg`;

  // 1. Homepage
  if (cleanPath === '/') {
    const title = 'SmartToolHub – 45 Free Everyday AI & Hardware Tools (No Sign-Up)';
    const description = 'Free AI productivity tools and hardware diagnostics that just work. Apple Shortcuts generator, prompt improver, formula helper, and curated software directories.';
    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          'name': 'SmartToolHub',
          'url': BASE_URL,
          'logo': `${BASE_URL}/icon.svg`,
          'founder': {
            '@type': 'Person',
            'name': 'Dhrumil Aslaliya',
          },
          'sameAs': [BASE_URL],
        },
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          'url': BASE_URL,
          'name': 'SmartToolHub',
          'description': description,
          'publisher': { '@id': `${BASE_URL}/#organization` },
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${BASE_URL}/tools?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    };

    const prerenderedHtml = `
      <div style="max-width: 960px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
        <header style="text-align: center; margin-bottom: 3rem;">
          <h1 style="font-size: 2.5rem; font-weight: 800; color: #f2f7ff; margin-bottom: 1rem; letter-spacing: -0.03em;">
            Free Everyday AI Tools That Just Work
          </h1>
          <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6; max-width: 720px; margin: 0 auto 1.5rem;">
            No accounts. No credit cards. Sub-second results on physical hardware. 45 free utilities, 50 tested software directory profiles, and verified technical guides by Dhrumil Aslaliya.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="/tools" style="background: #39ff88; color: #050a14; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; text-decoration: none;">Browse All 45 Tools</a>
            <a href="/pc-tools" style="background: #0a1424; color: #f2f7ff; border: 1px solid rgba(143,163,192,0.25); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">PC &amp; Windows Directory</a>
            <a href="/apple-tools" style="background: #0a1424; color: #f2f7ff; border: 1px solid rgba(143,163,192,0.25); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Apple &amp; Mac Directory</a>
            <a href="/android-tools" style="background: #0a1424; color: #f2f7ff; border: 1px solid rgba(143,163,192,0.25); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Android Power Tools</a>
          </div>
        </header>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #f2f7ff; margin-bottom: 1.25rem;">Popular Flagship Utilities</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            ${LAUNCH_TOOLS.slice(0, 12).map(t => `
              <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
                <h3 style="margin: 0 0 0.5rem; font-size: 1.1rem;">
                  <a href="/tools/${t.slug}" style="color: #39ff88; text-decoration: none;">${escapeHtml(t.name)}</a>
                </h3>
                <p style="color: #8fa3c0; font-size: 0.9rem; line-height: 1.5; margin: 0;">${escapeHtml(t.description)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #f2f7ff; margin-bottom: 1.25rem;">Curated Software &amp; Technical Comparisons</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
            ${Object.values(COMPARISONS).map(c => `
              <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
                <h3 style="margin: 0 0 0.5rem; font-size: 1.05rem;">
                  <a href="/compare/${c.slug}" style="color: #7db8ff; text-decoration: none;">${escapeHtml(c.title)}</a>
                </h3>
                <p style="color: #8fa3c0; font-size: 0.85rem; line-height: 1.4; margin: 0;">${escapeHtml(c.subtitle)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    return { title, description, canonicalUrl, ogType: 'website', ogImage, schemaJson, prerenderedHtml };
  }

  // 2. Tools Hub (`/tools`)
  if (cleanPath === '/tools') {
    const title = 'All 45 Free AI & Productivity Tools – SmartToolHub';
    const description = 'Explore 45 free everyday tools with no sign-up. Apple Shortcuts generator, prompt improver, email writer, spreadsheet formulas, and battery estimators.';
    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': canonicalUrl },
      ],
    };

    const prerenderedHtml = `
      <div style="max-width: 960px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
        <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
          <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / <span style="color: #39ff88;">Tools Hub</span>
        </nav>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">All 45 Free Everyday Utilities</h1>
        <p style="font-size: 1.1rem; color: #8fa3c0; line-height: 1.6; margin-bottom: 2rem;">
          Clean, private utilities that run on-device or via ephemeral AI API routes with zero tracking, zero accounts, and sub-30-second output generation.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${LAUNCH_TOOLS.map(t => `
            <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
              <span style="font-size: 0.75rem; font-family: monospace; color: #39ff88; text-transform: uppercase;">${escapeHtml(t.category)}</span>
              <h2 style="margin: 0.35rem 0 0.5rem; font-size: 1.15rem;">
                <a href="/tools/${t.slug}" style="color: #f2f7ff; text-decoration: none;">${escapeHtml(t.name)}</a>
              </h2>
              <p style="color: #8fa3c0; font-size: 0.88rem; line-height: 1.5; margin: 0 0 0.75rem;">${escapeHtml(t.description)}</p>
              <a href="/tools/${t.slug}" style="color: #39ff88; font-size: 0.85rem; font-weight: 600; text-decoration: none;">Open Tool &rarr;</a>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return { title, description, canonicalUrl, ogType: 'website', ogImage, schemaJson, prerenderedHtml };
  }

  // 3. Tool Detail Pages (`/tools/:slug`)
  if (cleanPath.startsWith('/tools/')) {
    const slug = cleanPath.replace('/tools/', '');
    const tool = LAUNCH_TOOLS.find(t => t.slug === slug);
    const toolName = tool ? tool.name : slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    const toolDesc = tool ? tool.description : `Free everyday utility for ${toolName}. Fast, private, with zero sign-up required.`;

    const title = `${toolName} (Free, No Sign-Up) – SmartToolHub`;
    const description = `${toolDesc} Runs instantly with sub-second execution, zero tracking, and no account required.`;

    // Standardized worked steps and FAQs for rich snippets
    const faqs = [
      {
        q: `Is ${toolName} completely free to use?`,
        a: `Yes, ${toolName} is 100% free with no account required, no subscription paywalls, and no daily usage caps.`,
      },
      {
        q: `Does ${toolName} store or log my personal data?`,
        a: `No. All text processing and file manipulations execute either directly in your web browser or via ephemeral server calls with zero database storage or server logging.`,
      },
      {
        q: `Can I export or copy results from ${toolName}?`,
        a: `Yes. Every output includes a 1-click clipboard copy button and formatted download options ready for immediate use.`,
      },
    ];

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          'name': toolName,
          'applicationCategory': 'UtilitiesApplication',
          'operatingSystem': 'All',
          'url': canonicalUrl,
          'description': description,
          'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
          'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
            { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': `${BASE_URL}/tools` },
            { '@type': 'ListItem', 'position': 3, 'name': toolName, 'item': canonicalUrl },
          ],
        },
        {
          '@type': 'FAQPage',
          'mainEntity': faqs.map(f => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.a,
            },
          })),
        },
        {
          '@type': 'HowTo',
          'name': `How to use ${toolName}`,
          'step': [
            {
              '@type': 'HowToStep',
              'name': 'Input Your Requirements',
              'text': 'Enter your parameters, descriptions, or file inputs into the interactive tool workspace.',
              'position': 1,
            },
            {
              '@type': 'HowToStep',
              'name': 'Execute and Generate',
              'text': 'Click generate or view calculated results instantly with sub-second on-device processing.',
              'position': 2,
            },
            {
              '@type': 'HowToStep',
              'name': 'Copy or Export Output',
              'text': 'Use the 1-click copy action to paste your formatted result directly into your workflow.',
              'position': 3,
            },
          ],
        },
      ],
    };

    const prerenderedHtml = `
      <article style="max-width: 900px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
        <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
          <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / 
          <a href="/tools" style="color: #8fa3c0; text-decoration: none;">Tools</a> / 
          <span style="color: #39ff88;">${escapeHtml(toolName)}</span>
        </nav>

        <header style="margin-bottom: 2.5rem;">
          <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem; letter-spacing: -0.025em;">
            ${escapeHtml(toolName)}
          </h1>
          <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6; margin: 0;">
            ${escapeHtml(description)}
          </p>
        </header>

        <section style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2.5rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #f2f7ff; margin-top: 0; margin-bottom: 1rem;">
            Step-by-Step Instructions
          </h2>
          <ol style="color: #f2f7ff; padding-left: 1.25rem; line-height: 1.8; margin: 0;">
            <li><strong>Step 01: Configure Inputs</strong> — Fill in your specifications or paste your working draft into the input workspace.</li>
            <li><strong>Step 02: Generate Output</strong> — Tap generate to run the calculation or synthesis in under 2 seconds.</li>
            <li><strong>Step 03: Review and Copy</strong> — Copy the finalized output directly to your clipboard or download as a standalone asset.</li>
          </ol>
        </section>

        <section style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #f2f7ff; margin-bottom: 1rem;">
            Frequently Asked Questions
          </h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${faqs.map(f => `
              <details style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.5rem; padding: 1rem;">
                <summary style="font-weight: 600; color: #f2f7ff; cursor: pointer;">${escapeHtml(f.q)}</summary>
                <p style="color: #8fa3c0; font-size: 0.92rem; line-height: 1.6; margin: 0.75rem 0 0;">${escapeHtml(f.a)}</p>
              </details>
            `).join('')}
          </div>
        </section>

        <section style="border-top: 1px solid rgba(143,163,192,0.15); padding-top: 2rem;">
          <h2 style="font-size: 1.2rem; font-weight: 700; color: #f2f7ff; margin-bottom: 1rem;">Related Utilities &amp; Guides</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${(tool && tool.relatedToolSlugs ? tool.relatedToolSlugs : ['ai-prompt-improver', 'formula-helper', 'ai-summarizer']).map(relSlug => {
              const relTool = LAUNCH_TOOLS.find(t => t.slug === relSlug);
              return `<a href="/tools/${relSlug}" style="color: #7db8ff; background: #0a1424; border: 1px solid rgba(143,163,192,0.2); padding: 0.5rem 0.85rem; border-radius: 0.5rem; text-decoration: none; font-size: 0.88rem;">${relTool ? escapeHtml(relTool.name) : relSlug}</a>`;
            }).join('')}
          </div>
        </section>
      </article>
    `;

    return { title, description, canonicalUrl, ogType: 'website', ogImage, schemaJson, prerenderedHtml };
  }

  // 4. Software Directory Categories (`/pc-tools`, `/apple-tools`, `/android-tools`)
  if (cleanPath === '/pc-tools' || cleanPath === '/apple-tools' || cleanPath === '/android-tools') {
    const platform = cleanPath === '/pc-tools' ? 'pc' : cleanPath === '/apple-tools' ? 'apple' : 'android';
    const platformName = platform === 'pc' ? 'PC & Windows' : platform === 'apple' ? 'Apple & macOS' : 'Android';
    const packageManager = platform === 'pc' ? 'winget' : platform === 'apple' ? 'Homebrew cask' : 'F-Droid / APK';

    const title = `${platformName} Software Directory (Tested & Verified) – SmartToolHub`;
    const description = `Curated directory of the best ${platformName} tools and utilities. Tested on physical hardware with silent ${packageManager} install scripts and mandatory drawbacks.`;

    const apps = Object.values(SOFTWARE_APPS).filter(a => a.platform === platform);

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': `${platformName} Tools`, 'item': canonicalUrl },
      ],
    };

    const prerenderedHtml = `
      <div style="max-width: 960px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
        <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
          <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / <span style="color: #39ff88;">${platformName} Directory</span>
        </nav>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">${platformName} Curated Software Directory</h1>
        <p style="font-size: 1.1rem; color: #8fa3c0; line-height: 1.6; margin-bottom: 2rem;">
          ${escapeHtml(description)} Every application profile is audited with 4-point testing criteria and verified terminal package installation commands.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${apps.map(app => `
            <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
              <span style="font-size: 0.75rem; font-family: monospace; color: #7db8ff; text-transform: uppercase;">${escapeHtml(app.category)}</span>
              <h2 style="margin: 0.35rem 0 0.5rem; font-size: 1.15rem;">
                <a href="/${platform === 'pc' ? 'pc-tools' : platform === 'apple' ? 'apple-tools' : 'android-tools'}/${app.slug}" style="color: #f2f7ff; text-decoration: none;">${escapeHtml(app.name)}</a>
              </h2>
              <p style="color: #8fa3c0; font-size: 0.88rem; line-height: 1.5; margin: 0 0 0.75rem;">${escapeHtml(app.tagline)}</p>
              <a href="/${platform === 'pc' ? 'pc-tools' : platform === 'apple' ? 'apple-tools' : 'android-tools'}/${app.slug}" style="color: #39ff88; font-size: 0.85rem; font-weight: 600; text-decoration: none;">Read Full Review &rarr;</a>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return { title, description, canonicalUrl, ogType: 'website', ogImage, schemaJson, prerenderedHtml };
  }

  // 5. Software Detail Pages (`/pc-tools/:slug`, `/apple-tools/:slug`, `/android-tools/:slug`)
  const softwareMatch = cleanPath.match(/^\/(pc-tools|apple-tools|android-tools)\/([a-zA-Z0-9-]+)$/);
  if (softwareMatch) {
    const platformPrefix = softwareMatch[1];
    const slug = softwareMatch[2];
    const app = SOFTWARE_APPS[slug];

    if (app) {
      const title = `${app.name} Review, Drawbacks & Install Command – SmartToolHub`;
      const description = `${app.tagline} Tested on physical hardware. Read honest drawbacks, who it's for, and silent package manager commands.`;

      const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareApplication',
            'name': app.name,
            'applicationCategory': app.category,
            'operatingSystem': app.platformLabel,
            'url': canonicalUrl,
            'description': app.tagline,
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'creator': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
              { '@type': 'ListItem', 'position': 2, 'name': app.platformLabel, 'item': `${BASE_URL}/${platformPrefix}` },
              { '@type': 'ListItem', 'position': 3, 'name': app.name, 'item': canonicalUrl },
            ],
          },
        ],
      };

      const prerenderedHtml = `
        <article style="max-width: 900px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
          <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
            <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / 
            <a href="/${platformPrefix}" style="color: #8fa3c0; text-decoration: none;">${app.platformLabel}</a> / 
            <span style="color: #39ff88;">${escapeHtml(app.name)}</span>
          </nav>

          <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">${escapeHtml(app.name)}</h1>
            <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6; margin: 0;">${escapeHtml(app.tagline)}</p>
          </header>

          <section style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
            <h2 style="font-size: 1.15rem; color: #39ff88; margin-top: 0;">Who It's For</h2>
            <p style="color: #f2f7ff; line-height: 1.6; margin: 0 0 1rem;">${escapeHtml(app.whoItsFor)}</p>
            <h3 style="font-size: 1rem; color: #7db8ff; margin: 0 0 0.5rem;">Recommended Quick Start</h3>
            <p style="color: #8fa3c0; line-height: 1.5; margin: 0;">${escapeHtml(app.tryThisFirst)}</p>
          </section>

          <section style="background: #101c33; border: 1px solid rgba(255,92,122,0.25); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
            <h2 style="font-size: 1.15rem; color: #ff5c7a; margin-top: 0;">Mandatory Drawbacks &amp; Limitations</h2>
            <ul style="color: #f2f7ff; line-height: 1.6; margin: 0; padding-left: 1.25rem;">
              <li>${escapeHtml(app.drawbacks[0])}</li>
              <li>${escapeHtml(app.drawbacks[1])}</li>
            </ul>
          </section>

          <section style="margin-bottom: 2.5rem; line-height: 1.8; color: #d1dced;">
            <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 1rem;">Editorial Analysis &amp; Hardware Test Findings</h2>
            <div>${escapeHtml(app.fullReview).replace(/\n\n/g, '<br/><br/>')}</div>
          </section>

          ${app.wingetId ? `
            <div style="background: #050a14; border: 1px solid rgba(143,163,192,0.25); border-radius: 0.5rem; padding: 1rem; margin-bottom: 2rem; font-family: monospace; font-size: 0.9rem; color: #39ff88;">
              winget install --id ${escapeHtml(app.wingetId)} -e
            </div>
          ` : ''}
        </article>
      `;

      return { title, description, canonicalUrl, ogType: 'article', ogImage, schemaJson, prerenderedHtml };
    }
  }

  // 6. Comparison Pages (`/compare/:slug`)
  if (cleanPath.startsWith('/compare/')) {
    const slug = cleanPath.replace('/compare/', '');
    const comp = COMPARISONS[slug];

    if (comp) {
      const title = `${comp.title} (2026 In-Depth Benchmark) – SmartToolHub`;
      const description = `${comp.subtitle} Full feature breakdown, benchmark speeds, and clear verdict on who should pick which tool.`;

      const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            'headline': comp.title,
            'description': comp.subtitle,
            'url': canonicalUrl,
            'author': { '@type': 'Person', 'name': 'Dhrumil Aslaliya' },
            'publisher': { '@type': 'Organization', 'name': 'SmartToolHub', 'url': BASE_URL },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
              { '@type': 'ListItem', 'position': 2, 'name': 'Comparisons', 'item': `${BASE_URL}/compare/${slug}` },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': comp.faqs.map(f => ({
              '@type': 'Question',
              'name': f.question,
              'acceptedAnswer': { '@type': 'Answer', 'text': f.answer },
            })),
          },
        ],
      };

      const prerenderedHtml = `
        <article style="max-width: 900px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
          <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
            <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / <span style="color: #39ff88;">Comparison</span>
          </nav>
          <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">${escapeHtml(comp.title)}</h1>
            <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6; margin: 0;">${escapeHtml(comp.subtitle)}</p>
          </header>

          <section style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem; color: #39ff88; margin-top: 0;">The Verdict</h2>
            <p style="color: #f2f7ff; line-height: 1.7; margin: 0;">${escapeHtml(comp.verdictSummary)}</p>
          </section>

          <section style="margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 1rem;">Direct Technical Comparison</h2>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                <thead>
                  <tr style="border-bottom: 1px solid rgba(143,163,192,0.25);">
                    <th style="padding: 0.75rem; color: #8fa3c0;">Feature</th>
                    <th style="padding: 0.75rem; color: #39ff88;">${escapeHtml(comp.optionAName)}</th>
                    <th style="padding: 0.75rem; color: #7db8ff;">${escapeHtml(comp.optionBName)}</th>
                  </tr>
                </thead>
                <tbody>
                  ${comp.comparisonRows.map(r => `
                    <tr style="border-bottom: 1px solid rgba(143,163,192,0.1);">
                      <td style="padding: 0.75rem; font-weight: 600; color: #f2f7ff;">${escapeHtml(r.feature)}</td>
                      <td style="padding: 0.75rem; color: #d1dced;">${escapeHtml(r.optionA)}</td>
                      <td style="padding: 0.75rem; color: #d1dced;">${escapeHtml(r.optionB)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>

          <section style="margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${comp.faqs.map(f => `
                <details style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.5rem; padding: 1rem;">
                  <summary style="font-weight: 600; color: #f2f7ff; cursor: pointer;">${escapeHtml(f.question)}</summary>
                  <p style="color: #8fa3c0; font-size: 0.92rem; line-height: 1.6; margin: 0.75rem 0 0;">${escapeHtml(f.answer)}</p>
                </details>
              `).join('')}
            </div>
          </section>
        </article>
      `;

      return { title, description, canonicalUrl, ogType: 'article', ogImage, schemaJson, prerenderedHtml };
    }
  }

  // 7. Guides Hub & Articles (`/guides`, `/guides/:slug`)
  if (cleanPath === '/guides') {
    const title = 'Technical Guides & Power User Tutorials – SmartToolHub';
    const description = 'Actionable step-by-step guides for iOS Shortcuts, Windows winget setups, Android wireless ADB, and terminal automation by Dhrumil Aslaliya.';

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': canonicalUrl },
      ],
    };

    const prerenderedHtml = `
      <div style="max-width: 960px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
        <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
          <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / <span style="color: #39ff88;">Technical Guides</span>
        </nav>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">Technical Guides &amp; Tutorials</h1>
        <p style="font-size: 1.1rem; color: #8fa3c0; line-height: 1.6; margin-bottom: 2rem;">${escapeHtml(description)}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${Object.values(GUIDE_ARTICLES).map(g => `
            <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
              <span style="font-size: 0.75rem; font-family: monospace; color: #39ff88;">${escapeHtml(g.readTime)}</span>
              <h2 style="margin: 0.35rem 0 0.5rem; font-size: 1.15rem;">
                <a href="/guides/${g.slug}" style="color: #f2f7ff; text-decoration: none;">${escapeHtml(g.title)}</a>
              </h2>
              <p style="color: #8fa3c0; font-size: 0.88rem; line-height: 1.5; margin: 0 0 0.75rem;">${escapeHtml(g.summary)}</p>
              <a href="/guides/${g.slug}" style="color: #39ff88; font-size: 0.85rem; font-weight: 600; text-decoration: none;">Read Guide &rarr;</a>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return { title, description, canonicalUrl, ogType: 'website', ogImage, schemaJson, prerenderedHtml };
  }

  if (cleanPath.startsWith('/guides/')) {
    const slug = cleanPath.replace('/guides/', '');
    const guide = GUIDE_ARTICLES[slug];

    if (guide) {
      const title = `${guide.title} – SmartToolHub`;
      const description = `${guide.summary} Written by ${guide.author}.`;

      const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            'headline': guide.title,
            'description': guide.summary,
            'url': canonicalUrl,
            'author': { '@type': 'Person', 'name': guide.author },
            'publisher': { '@type': 'Organization', 'name': 'SmartToolHub', 'url': BASE_URL },
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
              { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': `${BASE_URL}/guides` },
              { '@type': 'ListItem', 'position': 3, 'name': guide.title, 'item': canonicalUrl },
            ],
          },
        ],
      };

      const prerenderedHtml = `
        <article style="max-width: 820px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
          <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
            <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / 
            <a href="/guides" style="color: #8fa3c0; text-decoration: none;">Guides</a> / 
            <span style="color: #39ff88;">${escapeHtml(guide.title)}</span>
          </nav>
          <header style="margin-bottom: 2.5rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">${escapeHtml(guide.title)}</h1>
            <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6; margin: 0 0 1rem;">${escapeHtml(guide.summary)}</p>
            <div style="font-size: 0.85rem; color: #7db8ff; font-family: monospace;">By ${escapeHtml(guide.author)} &bull; ${escapeHtml(guide.readTime)} &bull; Updated ${escapeHtml(guide.lastUpdated)}</div>
          </header>

          ${guide.sections.map(s => `
            <section style="margin-bottom: 2rem; line-height: 1.8; color: #d1dced;">
              <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 0.75rem;">${escapeHtml(s.heading)}</h2>
              ${s.body.map(p => `<p style="margin-bottom: 1rem;">${escapeHtml(p)}</p>`).join('')}
              ${s.callout ? `
                <div style="background: #0a1424; border-left: 3px solid #39ff88; padding: 1rem 1.25rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.25rem 0; color: #f2f7ff;">
                  ${escapeHtml(s.callout)}
                </div>
              ` : ''}
            </section>
          `).join('')}

          <div style="border-top: 1px solid rgba(143,163,192,0.2); padding-top: 1.5rem; margin-top: 2.5rem;">
            <a href="/tools/${guide.relatedToolSlug}" style="display: inline-block; background: #39ff88; color: #050a14; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 700; text-decoration: none;">
              Try the companion tool: ${escapeHtml(guide.relatedToolName)} &rarr;
            </a>
          </div>
        </article>
      `;

      return { title, description, canonicalUrl, ogType: 'article', ogImage, schemaJson, prerenderedHtml };
    }
  }

  // 8. Company & Trust Pages (`/about`, `/contact`, `/privacy`, `/terms`, `/pricing`, `/changelog`)
  const corePages: Record<string, { title: string; desc: string; h1: string }> = {
    '/about': {
      title: 'About SmartToolHub & Creator Dhrumil Aslaliya',
      desc: 'Learn about the mission, transparent 4-point software testing methodology, and independent creator behind SmartToolHub.',
      h1: 'About SmartToolHub',
    },
    '/contact': {
      title: 'Contact SmartToolHub – Inquiries & Tool Requests',
      desc: 'Get in touch with creator Dhrumil Aslaliya. Submit tool suggestions, report bugs, or reach out with feedback. Fast response within 24-48 hours.',
      h1: 'Contact & Feedback',
    },
    '/privacy': {
      title: 'Privacy Policy – On-Device Execution & Zero Logging',
      desc: 'Plain-English privacy policy for SmartToolHub. Learn how our tools execute directly in your browser with zero data logging, zero tracking, and no retention.',
      h1: 'Privacy Policy',
    },
    '/terms': {
      title: 'Terms of Service – 100% User Ownership of Outputs',
      desc: 'Terms of service for SmartToolHub. Confirming complete user ownership of all generated outputs, acceptable use policies, and liability disclaimers.',
      h1: 'Terms of Service',
    },
    '/pricing': {
      title: 'Pricing & Transparent Free Tier – SmartToolHub',
      desc: 'SmartToolHub is 100% free with no hidden charges, no credit cards required, and optional lifetime Pro support for power users.',
      h1: 'Transparent Pricing',
    },
    '/changelog': {
      title: 'Changelog & Release Notes – SmartToolHub',
      desc: 'Track every release, new tool deployment, performance optimization, and directory update across SmartToolHub.',
      h1: 'Product Changelog',
    },
    '/saved': {
      title: 'Saved History & Bookmarks – SmartToolHub',
      desc: 'View your privately saved calculations, prompts, and tool outputs stored locally in your browser storage.',
      h1: 'Your Saved History',
    },
  };

  if (corePages[cleanPath]) {
    const p = corePages[cleanPath];
    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': p.h1, 'item': canonicalUrl },
      ],
    };

    const prerenderedHtml = `
      <div style="max-width: 820px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
        <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
          <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / <span style="color: #39ff88;">${escapeHtml(p.h1)}</span>
        </nav>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">${escapeHtml(p.h1)}</h1>
        <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6;">${escapeHtml(p.desc)}</p>
      </div>
    `;

    return { title: p.title, description: p.desc, canonicalUrl, ogType: 'website', ogImage, schemaJson, prerenderedHtml };
  }

  // Fallback for any unknown route
  return {
    title: 'SmartToolHub – Free Everyday AI Tools & Diagnostics',
    description: 'Free AI productivity tools and hardware diagnostics that just work. No accounts, sub-second execution, and zero tracking.',
    canonicalUrl,
    ogType: 'website',
    ogImage,
    schemaJson: null,
    prerenderedHtml: '',
  };
}
