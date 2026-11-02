import { LAUNCH_TOOLS } from '../data/tools.ts';
import { SOFTWARE_APPS } from '../data/softwareDirectory.ts';
import { COMPARISONS } from '../data/comparisons.ts';
import { GUIDE_ARTICLES } from '../data/guides.ts';
import { TOOL_SEO_DATA } from './toolSeoData.ts';

export interface SeoMetadata {
  statusCode: 200 | 404;
  robots: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage: string;
  schemaJson: any;
  prerenderedHtml: string;
}

export interface RouteEntry {
  path: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
}

const BASE_URL = 'https://smarttoolhub.net';
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Guarantees <title> is strictly under 60 characters (max 59 chars).
 */
export function ensureTitleUnder60(primary: string, suffix = ' | SmartToolHub'): string {
  let cleanPrimary = primary.replace(/\s+/g, ' ').trim();
  const withSuffix = `${cleanPrimary}${suffix}`;
  if (withSuffix.length < 60) {
    return withSuffix;
  }
  const shortSuffix = ' – SmartToolHub';
  if (`${cleanPrimary}${shortSuffix}`.length < 60) {
    return `${cleanPrimary}${shortSuffix}`;
  }
  if (cleanPrimary.length >= 60 && /^how to\s+/i.test(cleanPrimary)) {
    cleanPrimary = cleanPrimary.replace(/^how to\s+/i, '');
    cleanPrimary = cleanPrimary.charAt(0).toUpperCase() + cleanPrimary.slice(1);
    if (`${cleanPrimary}${suffix}`.length < 60) {
      return `${cleanPrimary}${suffix}`;
    }
  }
  if (cleanPrimary.length < 60) {
    return cleanPrimary;
  }
  // Truncate cleanly at word boundary under 59 chars
  const sliced = cleanPrimary.slice(0, 58);
  const lastSpace = sliced.lastIndexOf(' ');
  const base = (lastSpace > 25 ? sliced.slice(0, lastSpace) : sliced).replace(/[,:;–—-]+$/, '');
  return base.replace(/\s+(and|or|to|for|with|on|in|of|by|at|from|vs|the|a|an)$/i, '');
}

/**
 * Guarantees meta description is strictly between 120 and 158 characters.
 */
export function ensureDesc120To158(
  rawDesc: string,
  filler = 'No sign-up needed. Fast execution in your browser on SmartToolHub.'
): string {
  let desc = rawDesc.replace(/\s+/g, ' ').trim();
  if (!/[.!?]$/.test(desc)) desc += '.';

  if (desc.length < 120) {
    desc = `${desc} ${filler}`.replace(/\s+/g, ' ').trim();
  }
  if (desc.length < 120) {
    desc = `${desc} Explore practical guides and everyday utilities online for free.`.replace(/\s+/g, ' ').trim();
  }

  if (desc.length > 158) {
    const sub = desc.slice(0, 155);
    const lastPeriod = sub.lastIndexOf('. ');
    if (lastPeriod >= 119) {
      desc = sub.slice(0, lastPeriod + 1);
    } else {
      const lastSpace = sub.lastIndexOf(' ');
      desc = (lastSpace > 118 ? sub.slice(0, lastSpace) : sub.slice(0, 154)).replace(/[,:;–—.-]+$/, '') + '.';
    }
  }

  return desc;
}

/**
 * Single Source of Truth for all valid routes across the application, sitemap, and pre-renderer.
 */
export function getAllRoutes(): RouteEntry[] {
  const routes: RouteEntry[] = [
    { path: '/', lastmod: '2026-10-30', changefreq: 'daily', priority: '1.0' },
    { path: '/tools', lastmod: '2026-10-30', changefreq: 'daily', priority: '0.9' },
    { path: '/pc-tools', lastmod: '2026-10-30', changefreq: 'weekly', priority: '0.9' },
    { path: '/apple-tools', lastmod: '2026-10-30', changefreq: 'weekly', priority: '0.9' },
    { path: '/android-tools', lastmod: '2026-10-30', changefreq: 'weekly', priority: '0.9' },
    { path: '/guides', lastmod: '2026-10-30', changefreq: 'weekly', priority: '0.85' },
  ];

  const seenPaths = new Set<string>(routes.map((r) => r.path));

  // 1. Tools from LAUNCH_TOOLS registry + standalone tool routes
  for (const tool of LAUNCH_TOOLS) {
    const toolPath = `/tools/${tool.slug}`;
    if (!seenPaths.has(toolPath)) {
      seenPaths.add(toolPath);
      routes.push({
        path: toolPath,
        lastmod: '2026-10-29',
        changefreq: 'weekly',
        priority: tool.isFlagship ? '0.9' : '0.85',
      });
    }
  }

  // Ensure /tools/quick-calculators (bundled calculator hub) and /qr-generator are registered
  for (const extraToolRoute of ['/tools/quick-calculators', '/qr-generator']) {
    if (!seenPaths.has(extraToolRoute)) {
      seenPaths.add(extraToolRoute);
      routes.push({
        path: extraToolRoute,
        lastmod: '2026-10-30',
        changefreq: 'weekly',
        priority: '0.85',
      });
    }
  }

  // 2. Software Directory App Pages from SOFTWARE_APPS
  for (const app of Object.values(SOFTWARE_APPS)) {
    const prefix = app.platform === 'pc' ? '/pc-tools' : app.platform === 'apple' ? '/apple-tools' : '/android-tools';
    const appPath = `${prefix}/${app.slug}`;
    if (!seenPaths.has(appPath)) {
      seenPaths.add(appPath);
      routes.push({
        path: appPath,
        lastmod: '2026-10-28',
        changefreq: 'monthly',
        priority: '0.8',
      });
    }
  }

  // 3. Comparison Pages from COMPARISONS
  for (const comp of Object.values(COMPARISONS)) {
    const compPath = `/compare/${comp.slug}`;
    if (!seenPaths.has(compPath)) {
      seenPaths.add(compPath);
      routes.push({
        path: compPath,
        lastmod: '2026-10-28',
        changefreq: 'monthly',
        priority: '0.85',
      });
    }
  }

  // 4. Guides from GUIDE_ARTICLES
  for (const guide of Object.values(GUIDE_ARTICLES)) {
    const guidePath = `/guides/${guide.slug}`;
    if (!seenPaths.has(guidePath)) {
      seenPaths.add(guidePath);
      routes.push({
        path: guidePath,
        lastmod: '2026-10-29',
        changefreq: 'monthly',
        priority: '0.8',
      });
    }
  }

  // 5. Core Static & Legal Pages
  const staticPages: Array<{ path: string; lastmod: string; priority: string }> = [
    { path: '/about', lastmod: '2026-10-28', priority: '0.7' },
    { path: '/contact', lastmod: '2026-10-28', priority: '0.7' },
    { path: '/privacy', lastmod: '2026-10-30', priority: '0.6' },
    { path: '/terms', lastmod: '2026-10-28', priority: '0.6' },
    { path: '/pricing', lastmod: '2026-10-28', priority: '0.7' },
    { path: '/changelog', lastmod: '2026-10-29', priority: '0.7' },
    { path: '/saved', lastmod: '2026-10-28', priority: '0.5' },
  ];

  for (const sp of staticPages) {
    if (!seenPaths.has(sp.path)) {
      seenPaths.add(sp.path);
      routes.push({
        path: sp.path,
        lastmod: sp.lastmod,
        changefreq: 'monthly',
        priority: sp.priority,
      });
    }
  }

  return routes;
}

export function generateSitemapXml(): string {
  const routes = getAllRoutes();
  const urlsXml = routes
    .map((r) => {
      const loc = r.path === '/' ? BASE_URL : `${BASE_URL}${r.path}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;
}

export function generateFeedXml(): string {
  const guideItems = Object.values(GUIDE_ARTICLES).map(
    (g) => `    <item>
      <title>${escapeHtml(g.title)}</title>
      <link>${BASE_URL}/guides/${g.slug}</link>
      <guid>${BASE_URL}/guides/${g.slug}</guid>
      <pubDate>Thu, 29 Oct 2026 12:00:00 +0000</pubDate>
      <description>${escapeHtml(g.summary)}</description>
    </item>`
  );

  const compareItems = Object.values(COMPARISONS).map(
    (c) => `    <item>
      <title>${escapeHtml(c.title)}: ${escapeHtml(c.subtitle)}</title>
      <link>${BASE_URL}/compare/${c.slug}</link>
      <guid>${BASE_URL}/compare/${c.slug}</guid>
      <pubDate>Wed, 28 Oct 2026 12:00:00 +0000</pubDate>
      <description>${escapeHtml(c.verdictSummary)}</description>
    </item>`
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SmartToolHub - Everyday Web Tools, Software Directories &amp; Guides</title>
    <link>${BASE_URL}</link>
    <description>Practical guides, software comparisons, and browser-based utilities from SmartToolHub.</description>
    <language>en-us</language>
    <lastBuildDate>Fri, 30 Oct 2026 12:00:00 +0000</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${[...guideItems, ...compareItems].join('\n\n')}
  </channel>
</rss>
`;
}

export function injectSeoIntoHtml(rawHtml: string, pathname: string): { html: string; statusCode: number; seo: SeoMetadata } {
  const seo = resolveSeo(pathname);
  let html = rawHtml;
  const safeTitle = escapeHtml(seo.title);
  const safeDesc = escapeHtml(seo.description);

  // 1. Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

  // 2. Meta Description & Robots
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+name=["']robots["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="robots" content="${seo.robots}" />`
  );
  html = html.replace(
    /<meta\s+name=["']googlebot["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="googlebot" content="${seo.robots}" />`
  );
  html = html.replace(
    /<meta\s+name=["']bingbot["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="bingbot" content="${seo.robots}" />`
  );

  // 3. Canonical Link
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
    `<link rel="canonical" href="${seo.canonicalUrl}" />`
  );

  // 4. OpenGraph Tags
  html = html.replace(
    /<meta\s+property=["']og:type["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:type" content="${seo.ogType}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${seo.canonicalUrl}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:image" content="${seo.ogImage}" />`
  );

  // 5. Twitter Card Tags
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:image" content="${seo.ogImage}" />`
  );

  // 6. Schema.org JSON-LD (strip any existing injected schema first)
  html = html.replace(/\s*<script id=["']schema-jsonld["'] type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');
  if (seo.schemaJson) {
    const jsonLdTag = `\n    <script id="schema-jsonld" type="application/ld+json">\n${JSON.stringify(seo.schemaJson, null, 2)}\n    </script>\n  </head>`;
    html = html.replace('</head>', jsonLdTag);
  }

  // 7. Prerendered HTML Content inside #root
  if (seo.prerenderedHtml) {
    if (html.includes('<!--SEO_ROOT_START-->')) {
      html = html.replace(
        /<!--SEO_ROOT_START-->[\s\S]*?<!--SEO_ROOT_END-->/,
        `<!--SEO_ROOT_START-->${seo.prerenderedHtml}<!--SEO_ROOT_END-->`
      );
    } else {
      html = html.replace(/<div id=["']root["']>[\s\S]*?<\/div>/i, `<div id="root">${seo.prerenderedHtml}</div>`);
    }
  }

  return { html, statusCode: seo.statusCode, seo };
}


export function resolveSeo(pathname: string): SeoMetadata {
  const cleanPath = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  const canonicalUrl = cleanPath === '/' ? BASE_URL : `${BASE_URL}${cleanPath}`;

  // 1. Homepage (`/`)
  if (cleanPath === '/') {
    const title = ensureTitleUnder60('SmartToolHub – Free Everyday AI & Web Tools', '');
    const description = ensureDesc120To158(
      'Free everyday AI productivity tools, file converters, and software directories. No sign-up needed. Generate Apple Shortcuts, compress images, and merge PDFs.'
    );
    const ogImage = `${BASE_URL}/og-image.png`;

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
            The professional toolkit for everyday computing.
          </h1>
          <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6; max-width: 720px; margin: 0 auto 1.5rem;">
            No sign-up needed. Fast execution in your browser. Explore 55+ free utilities, curated software directory profiles for Windows, macOS, and Android, and practical how-to guides by Dhrumil Aslaliya.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="/tools" style="background: #39ff88; color: #050a14; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; text-decoration: none;">Browse All 55+ Tools</a>
            <a href="/pc-tools" style="background: #0a1424; color: #f2f7ff; border: 1px solid rgba(143,163,192,0.25); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">PC &amp; Windows Directory</a>
            <a href="/apple-tools" style="background: #0a1424; color: #f2f7ff; border: 1px solid rgba(143,163,192,0.25); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Apple &amp; Mac Directory</a>
            <a href="/android-tools" style="background: #0a1424; color: #f2f7ff; border: 1px solid rgba(143,163,192,0.25); padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Android Power Tools</a>
          </div>
        </header>

        <section style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #f2f7ff; margin-bottom: 1.25rem;">Popular Flagship Utilities</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            ${LAUNCH_TOOLS.slice(0, 12).map((t) => `
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
            ${Object.values(COMPARISONS).map((c) => `
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

    return {
      statusCode: 200,
      robots: DEFAULT_ROBOTS,
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage,
      schemaJson,
      prerenderedHtml,
    };
  }

  // 2. Tools Hub (`/tools`)
  if (cleanPath === '/tools') {
    const title = ensureTitleUnder60('All 55+ Free AI & Web Utilities', ' | SmartToolHub');
    const description = ensureDesc120To158(
      'Browse 55+ free everyday AI and browser utilities with no sign-up needed. Convert HEIC to JPG, merge PDFs, build Apple Shortcuts, and format developer data.'
    );
    const ogImage = `${BASE_URL}/og-tools.png`;

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
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">All 55+ Free Everyday Utilities</h1>
        <p style="font-size: 1.1rem; color: #8fa3c0; line-height: 1.6; margin-bottom: 2rem;">
          Practical utilities that run directly in your browser or via ephemeral AI routes with no sign-up needed and fast output generation.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${LAUNCH_TOOLS.map((t) => `
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

    return {
      statusCode: 200,
      robots: DEFAULT_ROBOTS,
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage,
      schemaJson,
      prerenderedHtml,
    };
  }

  // 3. Tool Detail Pages (`/tools/:slug` and `/qr-generator`)
  if (cleanPath.startsWith('/tools/') || cleanPath === '/qr-generator') {
    const slug = cleanPath === '/qr-generator' ? 'batch-qr-code-generator' : cleanPath.replace('/tools/', '');
    const tool = LAUNCH_TOOLS.find((t) => t.slug === slug);
    const extracted = TOOL_SEO_DATA[slug];

    // If neither in LAUNCH_TOOLS nor in TOOL_SEO_DATA, it is an unknown route -> fall through to 404
    if (tool || extracted) {
      const toolName = tool ? tool.name : extracted?.heading || 'Quick Hardware & Web Calculators';
      const h1Text = extracted?.heading || toolName;
      const introText =
        extracted?.subheading ||
        tool?.description ||
        `Use ${toolName} online for free with no sign-up needed.`;

      // Custom titles for all tools, strictly < 60 chars
      const customTitles: Record<string, string> = {
        'apple-shortcuts-generator': 'Apple Shortcuts Generator (Free iOS) | SmartToolHub',
        'ai-email-writer': 'Free AI Email Writer & Subject Lines | SmartToolHub',
        'ai-summarizer': 'AI Text Summarizer: Bullet Key Points | SmartToolHub',
        'rewrite-tone-changer': 'Sentence Rewriter & Tone Changer | SmartToolHub',
        'ai-prompt-improver': 'AI Prompt Improver for ChatGPT & Claude | SmartToolHub',
        'caption-hashtag-generator': 'Caption & Hashtag Generator for Social | SmartToolHub',
        'social-bio-generator': 'Social Media Bio Generator (4 Styles) | SmartToolHub',
        'title-headline-generator': 'Blog & YouTube Title Headline Generator | SmartToolHub',
        'formula-helper': 'Excel & Google Sheets Formula Helper | SmartToolHub',
        'meeting-notes-action-items': 'Meeting Notes to Action Items Extractor | SmartToolHub',
        'retina-image-size-calculator': 'Retina Image Size Calculator (@1x/@2x/@3x) | SmartToolHub',
        'iphone-charging-time-calculator': 'iPhone Charging Time Calculator (Watts) | SmartToolHub',
        'file-transfer-time-calculator': 'File Transfer Time Calculator with Latency | SmartToolHub',
        'quick-calculators': 'Quick Tech Calculators: Retina & Charge | SmartToolHub',
        'iphone-screenshot-mockup-maker': 'iPhone Screenshot Mockup Maker (Private) | SmartToolHub',
        'iphone-battery-health-forecast': 'iPhone Battery Health & Cycle Calculator | SmartToolHub',
        'iphone-storage-planner': 'iPhone Storage Planner & Size Calculator | SmartToolHub',
        'wallpaper-gradient-maker': 'Mesh Wallpaper Gradient Maker (PNG & CSS) | SmartToolHub',
        'apple-subscription-calculator': 'Apple Subscription & Apple One Calculator | SmartToolHub',
        'task-breaker': 'Task Breaker: Break Down Tasks (AI) | SmartToolHub',
        'explain-it-simply': 'Explain It Simply: Plain-English Tutor | SmartToolHub',
        'flashcard-quiz-maker': 'Flashcard & Quiz Maker from Notes (Students) | SmartToolHub',
        'study-plan-maker': 'Study Plan Maker & Exam Schedule Table | SmartToolHub',
        'invoice-generator': 'Free Invoice Generator (Print & Save PDF) | SmartToolHub',
        'cover-letter-resume-bullets': 'Cover Letter & Resume Bullet Improver | SmartToolHub',
        'product-description-generator': 'Product Description & Bullet Generator | SmartToolHub',
        'ai-translator-tone': 'Language Translator with Tone Control | SmartToolHub',
        'natural-rewrite': 'Natural Rewrite: Edit Stiff Drafts | SmartToolHub',
        'pdf-merge-split': 'PDF Merge & Split Online (No Upload) | SmartToolHub',
        'pdf-merge': 'Merge PDF Files Online (100% On-Device) | SmartToolHub',
        'pdf-split': 'Split PDF & Extract Pages (No Upload) | SmartToolHub',
        'image-to-pdf': 'Image to PDF Converter (JPG/PNG Local) | SmartToolHub',
        'image-to-text-ocr': 'Image to Text Converter (Browser OCR) | SmartToolHub',
        'heic-to-jpg-converter': 'HEIC to JPG Converter: Free & Private | SmartToolHub',
        'image-compressor-converter': 'Image Compressor & Converter (Free) | SmartToolHub',
        'install-command-generator': 'Winget & Homebrew Install Command Maker | SmartToolHub',
        'file-checksum-verifier': 'File Checksum Verifier (SHA-256 & MD5) | SmartToolHub',
        'cidr-subnet-calculator': 'CIDR & IPv4/IPv6 Subnet Mask Calculator | SmartToolHub',
        'bootable-usb-chooser': 'Bootable USB Tool Chooser (Rufus/Ventoy) | SmartToolHub',
        'drive-speed-requirement-calculator': 'Video Editing Drive Speed Calculator | SmartToolHub',
        'drive-health-reader': 'SSD & HDD S.M.A.R.T. Drive Health Reader | SmartToolHub',
        'mac-windows-shortcut-translator': 'Mac & Windows Keyboard Shortcut Lookup | SmartToolHub',
        'batch-qr-code-generator': 'Free QR Code Generator: No Sign-Up or Expiry | SmartToolHub',
        'android-automation-generator': 'Tasker & MacroDroid Automation Builder | SmartToolHub',
        'autohotkey-script-generator': 'AutoHotkey v2 Script & Hotkey Generator | SmartToolHub',
        'adb-fastboot-command-builder': 'ADB & Fastboot Command Builder (Android) | SmartToolHub',
        'command-explainer': 'Terminal, Bash & PowerShell Explainer | SmartToolHub',
        'battery-wear-calculator': 'Laptop & Phone Battery Wear Calculator | SmartToolHub',
        'cron-expression-generator': 'Cron Expression Generator & Crontab Tool | SmartToolHub',
        'regex-tester-explainer': 'Regex Tester & Pattern Explainer Online | SmartToolHub',
        'markdown-to-html-converter': 'Markdown to Clean HTML5 Code Converter | SmartToolHub',
        'css-box-shadow-generator': 'CSS Box Shadow & Dark Glow Generator | SmartToolHub',
        'json-yaml-converter': 'JSON to YAML & YAML to JSON Converter | SmartToolHub',
        'base64-file-converter': 'Base64 Encoder & Decoder (Text & Files) | SmartToolHub',
        'url-encoder-decoder': 'URL Encoder, Decoder & Query Parser | SmartToolHub',
        'lorem-ipsum-generator': 'Realistic UI Placeholder Text Generator | SmartToolHub',
        'password-entropy-generator': 'Password & Shannon Entropy Generator | SmartToolHub',
        'mac-address-formatter': 'MAC Address Formatter & OUI Vendor Check | SmartToolHub',
      };

      const customDescriptions: Record<string, string> = {
        'apple-shortcuts-generator':
          'Describe any iPhone or iPad automation in plain words to get numbered iOS Shortcuts steps and a ready-to-import .shortcut file. Free with no sign-up.',
        'ai-email-writer':
          'Draft clear, polite emails with custom subject lines in friendly, formal, short, or firm tones. Free browser tool with no sign-up or account needed.',
        'ai-summarizer':
          'Condense long articles, meeting transcripts, and study notes into a 3-sentence summary and 5 bullet points. Free online tool with no sign-up needed.',
        'rewrite-tone-changer':
          'Rewrite sentences and emails to sound friendlier, more formal, shorter, or simpler while keeping your original meaning intact. Free, no sign-up needed.',
        'ai-prompt-improver':
          'Turn rough AI questions into structured prompts with clear roles, context, constraints, and output formats for ChatGPT, Claude, and Gemini. Free tool.',
        'caption-hashtag-generator':
          'Generate 5 social media captions and 15 relevant hashtags tailored for Instagram, TikTok, LinkedIn, and X. Free online tool with no sign-up required.',
        'social-bio-generator':
          'Create 4 profile bios with live character counts for Instagram, X/Twitter, LinkedIn, and TikTok in minimalist, creator, professional, or casual styles.',
        'title-headline-generator':
          'Generate 10 clear, engaging headlines and titles for blog posts, YouTube videos, newsletters, and product pages with character counts and angle labels.',
        'formula-helper':
          'Describe what you want to calculate in plain English and get the exact Excel or Google Sheets formula with a step-by-step explanation. No sign-up needed.',
        'meeting-notes-action-items':
          'Turn raw meeting notes or call transcripts into a short summary, key decisions, and assigned action items with owners and priorities. No sign-up needed.',
        'retina-image-size-calculator':
          'Convert UI design points (pt) into crisp @1x, @2x, and @3x pixel dimensions and PPI density for iPhone, iPad, Mac, and web displays in your browser.',
        'iphone-charging-time-calculator':
          'Estimate iPhone charging time from current battery percentage, battery mAh, and USB-C or MagSafe wattage, including the 80% fast-charge taper curve.',
        'file-transfer-time-calculator':
          'Calculate data transfer time with round-trip latency and protocol overhead. Switch between MB/s, Mbps, and GB to check realistic cable and network speeds.',
        'quick-calculators':
          'All-in-one browser calculator for Retina @2x/@3x display pixels, file download transfer times, and iPhone or laptop battery charging duration estimates.',
        'iphone-screenshot-mockup-maker':
          'Wrap app screenshots in a clean phone frame with custom gradient backgrounds and PNG export. Runs 100% locally in your browser with no image uploads.',
        'iphone-battery-health-forecast':
          'Estimate iPhone battery health degradation from charge cycle count and model generation (500-cycle vs 1,000-cycle batteries) until the 80% threshold.',
        'iphone-storage-planner':
          'Calculate whether you need 128GB, 256GB, 512GB, or 1TB before buying an iPhone based on your photos, 4K videos, apps, and iOS system storage footprint.',
        'wallpaper-gradient-maker':
          'Create custom 3-stop mesh and linear gradients with a live phone lock screen preview, one-click CSS copy, and high-resolution 1170x2532 PNG download.',
        'apple-subscription-calculator':
          'Calculate your monthly and yearly spending across iCloud+, Apple Music, TV+, and Arcade to see whether an Apple One bundle saves you money each month.',
        'task-breaker':
          'Break large or overwhelming projects into small, manageable checklist steps with time estimates. Choose normal or tiny steps with local progress saving.',
        'explain-it-simply':
          'Understand complex science, math, coding, or business topics at an age-10, high school, or college level with everyday analogies and a 3-question quiz.',
        'flashcard-quiz-maker':
          'Turn class notes, textbook chapters, or study guides into 10 flippable flashcards and a practice quiz. Built for students, teachers, and self-learners.',
        'study-plan-maker':
          'Build a realistic day-by-day study schedule and revision timetable based on your exam date, daily available hours, and topic list with rest day buffers.',
        'invoice-generator':
          'Create clean client invoices with automatic line-item totals, tax rates, discounts, and currency options. Print or save as PDF locally in your browser.',
        'cover-letter-resume-bullets':
          'Turn rough job experience notes into clear, metric-focused resume bullet points or a 3-paragraph cover letter using only the real facts you provide.',
        'product-description-generator':
          'Write clear e-commerce product descriptions, overview copy, and 5 benefit-focused bullet points for Shopify, Amazon, or online stores in your browser.',
        'ai-translator-tone':
          'Translate messages across 12 languages while choosing casual, polite, or formal business tone, complete with notes on cultural phrasing and etiquette.',
        'natural-rewrite':
          'Polish stiff or repetitive drafts into clear, natural-sounding sentences with varied rhythm while keeping every fact, number, and original point intact.',
        'pdf-merge-split':
          'Combine multiple PDF files or extract specific page ranges into new documents directly in your browser. 100% client-side processing with zero uploads.',
        'pdf-merge':
          'Combine multiple PDF documents in custom order directly inside your web browser. Your files stay on your device with no server uploads and no sign-up.',
        'pdf-split':
          'Extract custom page ranges or split a PDF into individual pages locally in your browser. Private client-side PDF processing with no file uploads needed.',
        'image-to-pdf':
          'Convert JPG, PNG, and WebP images into a single PDF with A4, US Letter, or fit-to-image page sizing. Runs locally in your browser with no file uploads.',
        'image-to-text-ocr':
          'Extract printed text from photos, receipts, and screenshots locally in your browser using client-side OCR. Private processing with zero server uploads.',
        'heic-to-jpg-converter':
          'Batch convert iPhone HEIC and HEIF photos to JPG, PNG, or WebP directly in your browser. 100% local on-device conversion with zero server photo uploads.',
        'image-compressor-converter':
          'Batch compress and convert JPG, PNG, WebP, and AVIF images with custom quality sliders and width resizing. Runs locally in your browser with no uploads.',
        'install-command-generator':
          'Select desktop apps for Windows or macOS to generate a single-line winget or Homebrew cask terminal install command with official package identifiers.',
        'file-checksum-verifier':
          'Calculate and compare SHA-256, SHA-512, SHA-1, and MD5 file hashes locally in your browser to verify ISO downloads without uploading files to a server.',
        'cidr-subnet-calculator':
          'Calculate IPv4 and IPv6 network ranges, usable host IPs, broadcast addresses, subnet masks, wildcard masks, and binary bit layouts from any CIDR prefix.',
        'bootable-usb-chooser':
          'Pick your host computer OS, target ISO (Windows 11, Linux, or multi-boot), and hardware type to get the right bootable USB tool and setup instructions.',
        'drive-speed-requirement-calculator':
          'Calculate required storage read speed (MB/s) and hourly disk space for 4K/8K ProRes, RAW, and H.264/H.265 video editing timelines and multi-cam streams.',
        'drive-health-reader':
          'Paste CrystalDiskInfo or smartctl S.M.A.R.T. logs to check reallocated sectors, pending sectors, NVMe wear percentage, and drive temperature warnings.',
        'mac-windows-shortcut-translator':
          'Search and translate 80+ keyboard shortcuts between macOS (Command/Option) and Windows (Ctrl/Alt) for text editing, browsers, screenshots, and files.',
        'batch-qr-code-generator':
          'Create free static QR codes with no sign-up and no expiry. Works offline in your browser with PNG & SVG downloads, custom colors, Wi-Fi, and vCard presets.',
        'android-automation-generator':
          'Describe an Android routine to get step-by-step Triggers, Actions, Constraints, and required permissions for MacroDroid or Tasker without needing root.',
        'autohotkey-script-generator':
          'Generate clean AutoHotkey v2 (.ahk) scripts for Windows keyboard shortcuts, text expansion hotstrings, and window management with line-by-line notes.',
        'adb-fastboot-command-builder':
          'Build Android Debug Bridge (ADB) and Fastboot terminal commands for wireless pairing, app management, logcat, and backups with clear safety risk labels.',
        'command-explainer':
          'Paste any Linux bash, macOS zsh, or Windows PowerShell command to see what each flag and pipe does in plain English along with a safety risk check.',
        'battery-wear-calculator':
          'Enter your battery design capacity and current full-charge capacity (in mWh, Wh, or mAh) to calculate battery health percentage and wear level locally.',
        'cron-expression-generator':
          'Build and test 5-field Linux crontab schedules with a plain-English translation, step syntax presets, and a preview of the next scheduled run times.',
        'regex-tester-explainer':
          'Test regular expressions in real time with JavaScript RegExp flags, highlighted matches, capture group inspection, and common validation presets.',
        'markdown-to-html-converter':
          'Convert Markdown text into clean, semantic HTML5 tags with a live visual preview and one-click copy for blogs, documentation, and CMS code blocks.',
        'css-box-shadow-generator':
          'Design single or layered CSS box-shadow and dark-mode glow effects with interactive sliders for offset, blur, spread, opacity, and inset CSS code.',
        'json-yaml-converter':
          'Convert between JSON and YAML in your browser with syntax validation, 2-space indentation formatting, and one-click copy for DevOps config files.',
        'base64-file-converter':
          'Encode and decode UTF-8 text or local files into Base64 strings and HTML/CSS Data URIs directly in your browser with zero server file uploads.',
        'url-encoder-decoder':
          'Percent-encode or decode URLs and query parameters in your browser, with an automatic key-value table that breaks down every query string field.',
        'lorem-ipsum-generator':
          'Generate realistic English UI placeholder text, developer documentation copy, or classic Latin Lorem Ipsum by paragraph, sentence, or word count.',
        'password-entropy-generator':
          'Generate random passwords and passphrases locally using your browser Web Crypto API, with real-time Shannon entropy (bits) and offline crack-time math.',
        'mac-address-formatter':
          'Convert MAC addresses between colon, hyphen, Cisco dot, and bare hex formats in your browser, with IEEE OUI hardware vendor and address bit lookup.',
      };

      const title = customTitles[slug]
        ? ensureTitleUnder60(customTitles[slug], '')
        : ensureTitleUnder60(toolName, ' | SmartToolHub');

      const description = customDescriptions[slug]
        ? ensureDesc120To158(customDescriptions[slug])
        : ensureDesc120To158(tool ? tool.description : introText);
      const ogImage = `${BASE_URL}/og-tools.png`;

      const faqs =
        extracted?.faqs && extracted.faqs.length > 0
          ? extracted.faqs
          : [
              {
                question: `Is ${toolName} completely free to use?`,
                answer: `Yes, ${toolName} is free to use in your browser with no sign-up needed and no subscription paywalls.`,
              },
              {
                question: `Does ${toolName} store my personal files or inputs?`,
                answer: `No. Client-side tools process data directly on your device, and AI tools process prompts ephemerally without saving them to a database.`,
              },
              {
                question: `Can I copy or download the output from ${toolName}?`,
                answer: `Yes. Every result includes one-click clipboard copy or direct file download buttons ready for immediate use.`,
              },
            ];

      const graph: any[] = [
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
      ];

      if (faqs.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          'mainEntity': faqs.map((f) => ({
            '@type': 'Question',
            'name': f.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.answer,
            },
          })),
        });
      }

      const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': graph,
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
              ${escapeHtml(h1Text)}
            </h1>
            <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6; margin: 0;">
              ${escapeHtml(introText)}
            </p>
          </header>

          <section style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #f2f7ff; margin-top: 0; margin-bottom: 1rem;">
              How to Use ${escapeHtml(toolName)}
            </h2>
            <ol style="color: #f2f7ff; padding-left: 1.25rem; line-height: 1.8; margin: 0;">
              <li><strong>Configure Inputs</strong> — Enter your text, parameters, or select local files in the tool workspace.</li>
              <li><strong>Run Tool</strong> — Process your input directly in the browser or generate structured output.</li>
              <li><strong>Copy or Download</strong> — Copy the formatted result to your clipboard or download your processed file.</li>
            </ol>
          </section>

          ${extracted?.extraHtml || ''}

          <section style="margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #f2f7ff; margin-bottom: 1rem;">
              Frequently Asked Questions
            </h2>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${faqs
                .map(
                  (f) => `
                <details style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.5rem; padding: 1rem;">
                  <summary style="font-weight: 600; color: #f2f7ff; cursor: pointer;">${escapeHtml(f.question)}</summary>
                  <p style="color: #8fa3c0; font-size: 0.92rem; line-height: 1.6; margin: 0.75rem 0 0;">${escapeHtml(f.answer)}</p>
                </details>
              `
                )
                .join('')}
            </div>
          </section>

          <section style="border-top: 1px solid rgba(143,163,192,0.15); padding-top: 2rem;">
            <h2 style="font-size: 1.2rem; font-weight: 700; color: #f2f7ff; margin-bottom: 1rem;">Related Utilities</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
              ${(tool && tool.relatedToolSlugs
                ? tool.relatedToolSlugs
                : ['ai-prompt-improver', 'formula-helper', 'ai-summarizer']
              )
                .map((relSlug) => {
                  const relTool = LAUNCH_TOOLS.find((t) => t.slug === relSlug);
                  return `<a href="/tools/${relSlug}" style="color: #7db8ff; background: #0a1424; border: 1px solid rgba(143,163,192,0.2); padding: 0.5rem 0.85rem; border-radius: 0.5rem; text-decoration: none; font-size: 0.88rem;">${relTool ? escapeHtml(relTool.name) : relSlug}</a>`;
                })
                .join('')}
            </div>
          </section>
        </article>
      `;

      return {
        statusCode: 200,
        robots: DEFAULT_ROBOTS,
        title,
        description,
        canonicalUrl,
        ogType: 'website',
        ogImage,
        schemaJson,
        prerenderedHtml,
      };
    }
  }

  // 4. Software Directory Categories (`/pc-tools`, `/apple-tools`, `/android-tools`)
  if (cleanPath === '/pc-tools' || cleanPath === '/apple-tools' || cleanPath === '/android-tools') {
    const platform = cleanPath === '/pc-tools' ? 'pc' : cleanPath === '/apple-tools' ? 'apple' : 'android';
    const platformName = platform === 'pc' ? 'PC & Windows' : platform === 'apple' ? 'Apple & macOS' : 'Android';
    const packageManager = platform === 'pc' ? 'winget' : platform === 'apple' ? 'Homebrew cask' : 'F-Droid & APK';

    const title = ensureTitleUnder60(`${platformName} Software Directory`, ' | SmartToolHub');
    const description = ensureDesc120To158(
      `Curated directory of ${platformName} utilities and open-source apps with honest drawbacks, practical notes, and ${packageManager} install commands.`
    );
    const ogImage = `${BASE_URL}/og-directory.png`;

    const apps = Object.values(SOFTWARE_APPS).filter((a) => a.platform === platform);

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': `${platformName} Directory`, 'item': canonicalUrl },
      ],
    };

    const prerenderedHtml = `
      <div style="max-width: 960px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;">
        <nav style="font-size: 0.85rem; color: #8fa3c0; margin-bottom: 1.5rem;">
          <a href="/" style="color: #8fa3c0; text-decoration: none;">Home</a> / <span style="color: #39ff88;">${platformName} Directory</span>
        </nav>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">${platformName} Curated Software Directory</h1>
        <p style="font-size: 1.1rem; color: #8fa3c0; line-height: 1.6; margin-bottom: 2rem;">
          ${escapeHtml(description)} Each application profile includes practical strengths, known drawbacks, and terminal package installation commands.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${apps
            .map(
              (app) => `
            <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
              <span style="font-size: 0.75rem; font-family: monospace; color: #7db8ff; text-transform: uppercase;">${escapeHtml(app.category)}</span>
              <h2 style="margin: 0.35rem 0 0.5rem; font-size: 1.15rem;">
                <a href="/${platform === 'pc' ? 'pc-tools' : platform === 'apple' ? 'apple-tools' : 'android-tools'}/${app.slug}" style="color: #f2f7ff; text-decoration: none;">${escapeHtml(app.name)}</a>
              </h2>
              <p style="color: #8fa3c0; font-size: 0.88rem; line-height: 1.5; margin: 0 0 0.75rem;">${escapeHtml(app.tagline)}</p>
              <a href="/${platform === 'pc' ? 'pc-tools' : platform === 'apple' ? 'apple-tools' : 'android-tools'}/${app.slug}" style="color: #39ff88; font-size: 0.85rem; font-weight: 600; text-decoration: none;">Read Full Review &rarr;</a>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    return {
      statusCode: 200,
      robots: DEFAULT_ROBOTS,
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage,
      schemaJson,
      prerenderedHtml,
    };
  }

  // 5. Software Detail Pages (`/pc-tools/:slug`, `/apple-tools/:slug`, `/android-tools/:slug`)
  const softwareMatch = cleanPath.match(/^\/(pc-tools|apple-tools|android-tools)\/([a-zA-Z0-9-]+)$/);
  if (softwareMatch) {
    const platformPrefix = softwareMatch[1];
    const slug = softwareMatch[2];
    const expectedPlatform = platformPrefix === 'pc-tools' ? 'pc' : platformPrefix === 'apple-tools' ? 'apple' : 'android';
    const app = SOFTWARE_APPS[slug];

    if (app && app.platform === expectedPlatform) {
      const title = ensureTitleUnder60(`${app.name} Review & Install Command`, ' | SmartToolHub');
      const description = ensureDesc120To158(
        `${app.tagline} Read our practical review of ${app.name} for ${app.platformLabel}, including key drawbacks and package manager install commands.`
      );
      const ogImage = `${BASE_URL}/og-directory.png`;

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
            <a href="/${platformPrefix}" style="color: #8fa3c0; text-decoration: none;">${escapeHtml(app.platformLabel)}</a> / 
            <span style="color: #39ff88;">${escapeHtml(app.name)}</span>
          </nav>

          <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">${escapeHtml(app.name)}</h1>
            <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6; margin: 0;">${escapeHtml(app.tagline)}</p>
          </header>

          <section style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
            <h2 style="font-size: 1.15rem; color: #39ff88; margin-top: 0;">Who It Is For</h2>
            <p style="color: #f2f7ff; line-height: 1.6; margin: 0 0 1rem;">${escapeHtml(app.whoItsFor)}</p>
            <h3 style="font-size: 1rem; color: #7db8ff; margin: 0 0 0.5rem;">Recommended Quick Start</h3>
            <p style="color: #8fa3c0; line-height: 1.5; margin: 0;">${escapeHtml(app.tryThisFirst)}</p>
          </section>

          <section style="background: #101c33; border: 1px solid rgba(255,92,122,0.25); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
            <h2 style="font-size: 1.15rem; color: #ff5c7a; margin-top: 0;">Drawbacks &amp; Limitations to Consider</h2>
            <ul style="color: #f2f7ff; line-height: 1.6; margin: 0; padding-left: 1.25rem;">
              <li>${escapeHtml(app.drawbacks[0])}</li>
              <li>${escapeHtml(app.drawbacks[1])}</li>
            </ul>
          </section>

          <section style="margin-bottom: 2.5rem; line-height: 1.8; color: #d1dced;">
            <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 1rem;">Editorial Overview &amp; Setup Notes</h2>
            <div>${escapeHtml(app.fullReview).replace(/\n\n/g, '<br/><br/>')}</div>
          </section>

          ${
            app.wingetId
              ? `<div style="background: #050a14; border: 1px solid rgba(143,163,192,0.25); border-radius: 0.5rem; padding: 1rem; margin-bottom: 2rem; font-family: monospace; font-size: 0.9rem; color: #39ff88;">winget install --id ${escapeHtml(app.wingetId)} -e</div>`
              : ''
          }
        </article>
      `;

      return {
        statusCode: 200,
        robots: DEFAULT_ROBOTS,
        title,
        description,
        canonicalUrl,
        ogType: 'article',
        ogImage,
        schemaJson,
        prerenderedHtml,
      };
    }
  }

  // 6. Comparison Pages (`/compare/:slug`)
  if (cleanPath.startsWith('/compare/')) {
    const slug = cleanPath.replace('/compare/', '');
    const comp = COMPARISONS[slug];

    if (comp) {
      const customCompareTitles: Record<string, string> = {
        'wiztree-vs-treesize': 'WizTree vs TreeSize Free: Disk Analyzer | SmartToolHub',
        'rufus-vs-ventoy': 'Rufus vs Ventoy: Bootable USB Comparison | SmartToolHub',
        'powertoys-vs-flow-launcher': 'PowerToys vs Flow Launcher (Windows 11) | SmartToolHub',
        '3utools-vs-imazing': 'iMazing vs 3uTools: iPhone Backup & Pricing | SmartToolHub',
        'shizuku-adb-wireless-guide': 'Shizuku Wireless ADB vs USB ADB Guide | SmartToolHub',
      };
      const customCompareDescriptions: Record<string, string> = {
        'wiztree-vs-treesize':
          'Compare WizTree and TreeSize Free for Windows 10 and 11: NTFS MFT scan speeds, visual treemaps vs folder trees, NAS network support, and free licensing.',
        'rufus-vs-ventoy':
          'Compare Rufus and Ventoy for bootable USB drives: single-ISO Windows 11 setup customization vs multi-boot ISO drag-and-drop, Secure Boot, and use cases.',
        'powertoys-vs-flow-launcher':
          'Compare Microsoft PowerToys and Flow Launcher on Windows: FancyZones window snapping and OCR tools vs fast Everything file search and community plugins.',
        '3utools-vs-imazing':
          "Compare iMazing and 3uTools for iPhone backups, message exports, and diagnostics. See pricing, Mac vs Windows support, and when to use Apple's free tools.",
        'shizuku-adb-wireless-guide':
          'Compare Shizuku on-device Wireless Debugging against standard USB cable ADB on Android: setup requirements, reboot behavior, permissions, and fixes.',
      };

      const title = customCompareTitles[slug]
        ? ensureTitleUnder60(customCompareTitles[slug], '')
        : ensureTitleUnder60(`${comp.optionAName} vs ${comp.optionBName} Comparison`, ' | SmartToolHub');
      const description = customCompareDescriptions[slug]
        ? ensureDesc120To158(customCompareDescriptions[slug])
        : ensureDesc120To158(
            `${comp.subtitle} Side-by-side feature table, practical differences, and clear recommendations on which option fits your workflow.`
          );
      const ogImage = `${BASE_URL}/og-compare.png`;

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
              { '@type': 'ListItem', 'position': 2, 'name': comp.title, 'item': canonicalUrl },
            ],
          },
          {
            '@type': 'FAQPage',
            'mainEntity': comp.faqs.map((f) => ({
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
            <h2 style="font-size: 1.25rem; color: #39ff88; margin-top: 0;">Quick Verdict</h2>
            <p style="color: #f2f7ff; line-height: 1.7; margin: 0;">${escapeHtml(comp.verdictSummary)}</p>
          </section>

          ${
            comp.appleOfficialNote
              ? `<section style="background: #101c33; border: 1px solid rgba(10,132,255,0.3); border-radius: 0.75rem; padding: 1.25rem 1.5rem; margin-bottom: 2rem;">
                  <h2 style="font-size: 1.05rem; color: #7db8ff; margin-top: 0; margin-bottom: 0.5rem;">Apple Official Backup Tools First</h2>
                  <p style="color: #f2f7ff; line-height: 1.6; margin: 0;">${escapeHtml(comp.appleOfficialNote)}</p>
                </section>`
              : ''
          }

          <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
            <div style="background: #0a1424; border: 1px solid rgba(10,132,255,0.25); border-radius: 0.75rem; padding: 1.5rem;">
              <h2 style="font-size: 1.2rem; color: #7db8ff; margin-top: 0; margin-bottom: 0.75rem;">Pick ${escapeHtml(comp.optionAName)} If:</h2>
              <ul style="color: #f2f7ff; line-height: 1.6; margin: 0; padding-left: 1.25rem;">
                ${comp.optionAPickIf.map((pt) => `<li style="margin-bottom: 0.5rem;">${escapeHtml(pt)}</li>`).join('')}
              </ul>
            </div>
            <div style="background: #0a1424; border: 1px solid rgba(52,224,161,0.25); border-radius: 0.75rem; padding: 1.5rem;">
              <h2 style="font-size: 1.2rem; color: #39ff88; margin-top: 0; margin-bottom: 0.75rem;">Pick ${escapeHtml(comp.optionBName)} If:</h2>
              <ul style="color: #f2f7ff; line-height: 1.6; margin: 0; padding-left: 1.25rem;">
                ${comp.optionBPickIf.map((pt) => `<li style="margin-bottom: 0.5rem;">${escapeHtml(pt)}</li>`).join('')}
              </ul>
            </div>
          </section>

          <section style="margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 1rem;">Feature Comparison Table</h2>
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
                  ${comp.comparisonRows
                    .map(
                      (r) => `
                    <tr style="border-bottom: 1px solid rgba(143,163,192,0.1);">
                      <td style="padding: 0.75rem; font-weight: 600; color: #f2f7ff;">${escapeHtml(r.feature)}</td>
                      <td style="padding: 0.75rem; color: #d1dced;">${escapeHtml(r.optionA)}</td>
                      <td style="padding: 0.75rem; color: #d1dced;">${escapeHtml(r.optionB)}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </section>

          ${
            comp.pricingDetails && comp.pricingDetails.length > 0
              ? `<section style="margin-bottom: 2.5rem;">
                  <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 1rem;">Pricing Breakdown: Free vs Paid Options</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
                    ${comp.pricingDetails
                      .map(
                        (p) => `
                      <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
                        <div style="font-family: monospace; font-size: 0.8rem; color: #39ff88; margin-bottom: 0.35rem;">${escapeHtml(p.priceBadge)}</div>
                        <h3 style="font-size: 1.05rem; color: #f2f7ff; margin: 0 0 0.5rem;">${escapeHtml(p.name)}</h3>
                        <p style="color: #8fa3c0; font-size: 0.9rem; line-height: 1.5; margin: 0;">${escapeHtml(p.summary)}</p>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </section>`
              : ''
          }

          ${
            comp.useCases && comp.useCases.length > 0
              ? `<section style="margin-bottom: 2.5rem;">
                  <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 1rem;">Which One Should You Pick? (By Use Case)</h2>
                  <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                    ${comp.useCases
                      .map(
                        (uc) => `
                      <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
                        <h3 style="font-size: 1rem; color: #f2f7ff; margin: 0 0 0.35rem;">${escapeHtml(uc.scenario)} — <span style="color: #7db8ff;">Best Pick: ${escapeHtml(uc.pick)}</span></h3>
                        <p style="color: #8fa3c0; font-size: 0.9rem; line-height: 1.5; margin: 0;">${escapeHtml(uc.reason)}</p>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </section>`
              : ''
          }

          <section style="margin-bottom: 2.5rem;">
            <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${comp.faqs
                .map(
                  (f) => `
                <details style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.5rem; padding: 1rem;">
                  <summary style="font-weight: 600; color: #f2f7ff; cursor: pointer;">${escapeHtml(f.question)}</summary>
                  <p style="color: #8fa3c0; font-size: 0.92rem; line-height: 1.6; margin: 0.75rem 0 0;">${escapeHtml(f.answer)}</p>
                </details>
              `
                )
                .join('')}
            </div>
          </section>
        </article>
      `;

      return {
        statusCode: 200,
        robots: DEFAULT_ROBOTS,
        title,
        description,
        canonicalUrl,
        ogType: 'article',
        ogImage,
        schemaJson,
        prerenderedHtml,
      };
    }
  }

  // 7. Guides Hub (`/guides`) and Guide Articles (`/guides/:slug`)
  if (cleanPath === '/guides') {
    const title = ensureTitleUnder60('Technical Guides & How-To Tutorials', ' | SmartToolHub');
    const description = ensureDesc120To158(
      'Step-by-step technical guides for iOS Shortcuts, HEIC photo conversion, image compression, PDF merging, and Windows winget setups by Dhrumil Aslaliya.'
    );
    const ogImage = `${BASE_URL}/og-guides.png`;

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
          ${Object.values(GUIDE_ARTICLES)
            .map(
              (g) => `
            <div style="background: #0a1424; border: 1px solid rgba(143,163,192,0.18); border-radius: 0.75rem; padding: 1.25rem;">
              <span style="font-size: 0.75rem; font-family: monospace; color: #39ff88;">${escapeHtml(g.readTime)}</span>
              <h2 style="margin: 0.35rem 0 0.5rem; font-size: 1.15rem;">
                <a href="/guides/${g.slug}" style="color: #f2f7ff; text-decoration: none;">${escapeHtml(g.title)}</a>
              </h2>
              <p style="color: #8fa3c0; font-size: 0.88rem; line-height: 1.5; margin: 0 0 0.75rem;">${escapeHtml(g.summary)}</p>
              <a href="/guides/${g.slug}" style="color: #39ff88; font-size: 0.85rem; font-weight: 600; text-decoration: none;">Read Guide &rarr;</a>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    return {
      statusCode: 200,
      robots: DEFAULT_ROBOTS,
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage,
      schemaJson,
      prerenderedHtml,
    };
  }

  if (cleanPath.startsWith('/guides/')) {
    const slug = cleanPath.replace('/guides/', '');
    const guide = GUIDE_ARTICLES[slug];

    if (guide) {
      const customGuideTitles: Record<string, string> = {
        'build-first-iphone-shortcut': 'Build Your First iPhone Shortcut in 3 Mins | SmartToolHub',
        'better-prompts-simple-rules': 'Get Better AI Answers with 3 Prompt Rules | SmartToolHub',
        'spreadsheet-formulas-plain-english': 'Plain English to Excel & Sheets Formulas | SmartToolHub',
        'windows-winget-setup-guide': 'Set Up a Windows PC in 5 Mins with winget | SmartToolHub',
        'shizuku-wireless-adb-walkthrough': 'Enable Shizuku on Android: Wireless ADB | SmartToolHub',
        'mac-keyboard-shortcuts-power-user': 'Mac Keyboard Shortcuts for Windows Users | SmartToolHub',
        'check-ssd-health-smart-guide': 'Check SSD & Hard Drive Health (S.M.A.R.T.) | SmartToolHub',
        'autohotkey-v2-beginners-guide': 'AutoHotkey v2 Beginner Guide for Windows | SmartToolHub',
        'convert-heic-to-jpg-iphone-mac-windows': 'Convert HEIC to JPG on iPhone, Mac & PC | SmartToolHub',
        'how-to-compress-images-without-losing-quality': 'Compress Images Without Losing Quality | SmartToolHub',
        'how-to-merge-pdf-files-on-phone': 'Merge PDF Files on iPhone & Android Free | SmartToolHub',
      };
      const customGuideDescriptions: Record<string, string> = {
        'build-first-iphone-shortcut':
          'Step-by-step walkthrough for building your first iPhone Shortcut in under 3 minutes, including travel time texts, bedtime routines, and Home Screen icons.',
        'better-prompts-simple-rules':
          'Learn 3 practical prompt rules—role and context, negative constraints, and output formatting—to get clear, accurate answers from ChatGPT, Claude, and Gemini.',
        'spreadsheet-formulas-plain-english':
          'Learn how to describe spreadsheet columns and conditions in plain English to generate XLOOKUP, SUMIFS, and IFERROR formulas for Excel and Google Sheets.',
        'windows-winget-setup-guide':
          'Set up a fresh Windows 10 or 11 PC in minutes using the built-in winget package manager to batch-install verified desktop apps without adware installers.',
        'shizuku-wireless-adb-walkthrough':
          'Learn how to enable Shizuku on Android with Wireless Debugging, fix "Shizuku pairing failed" errors, or start Shizuku without wireless debugging via USB.',
        'mac-keyboard-shortcuts-power-user':
          'Bridge the gap between Windows and macOS keyboards: learn Command vs Control modifiers, Option word navigation, window snapping, and Cmd+Tab alternatives.',
        'check-ssd-health-smart-guide':
          'Learn how to read SSD and hard drive S.M.A.R.T. health attributes—including Available Spare, Percentage Used, and Reallocated Sectors—before a drive fails.',
        'autohotkey-v2-beginners-guide':
          'Beginner guide to AutoHotkey v2 on Windows: install via winget, write text expansion hotstrings, create custom window hotkeys, and run scripts at startup.',
        'convert-heic-to-jpg-iphone-mac-windows':
          'Convert iPhone HEIC photos to JPG on Windows, macOS Finder, or in your browser without uploading private photos to cloud servers, plus iOS camera settings.',
        'how-to-compress-images-without-losing-quality':
          'Reduce image file sizes by 60% to 80% without noticeable blur using WebP compression, 80% quality settings, and pixel width resizing in your web browser.',
        'how-to-merge-pdf-files-on-phone':
          'Combine multiple PDF files and extract pages on iPhone and Android using the built-in iOS Files app or private in-browser PDF tools with zero file uploads.',
      };

      const title = customGuideTitles[slug]
        ? ensureTitleUnder60(customGuideTitles[slug], '')
        : ensureTitleUnder60(guide.title, ' | SmartToolHub');
      const description = customGuideDescriptions[slug]
        ? ensureDesc120To158(customGuideDescriptions[slug])
        : ensureDesc120To158(
            guide.summary,
            `Step-by-step tutorial written by ${guide.author} on SmartToolHub.`
          );
      const ogImage = `${BASE_URL}/og-guides.png`;

      const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            'headline': guide.title,
            'description': guide.summary,
            'url': canonicalUrl,
            'datePublished': '2026-10-15',
            'dateModified': '2026-10-29',
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

          ${guide.sections
            .map(
              (s) => `
            <section style="margin-bottom: 2rem; line-height: 1.8; color: #d1dced;">
              <h2 style="font-size: 1.35rem; color: #f2f7ff; margin-bottom: 0.75rem;">${escapeHtml(s.heading)}</h2>
              ${s.body.map((p) => `<p style="margin-bottom: 1rem;">${escapeHtml(p)}</p>`).join('')}
              ${
                s.callout
                  ? `<div style="background: #0a1424; border-left: 3px solid #39ff88; padding: 1rem 1.25rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.25rem 0; color: #f2f7ff;">${escapeHtml(s.callout)}</div>`
                  : ''
              }
            </section>
          `
            )
            .join('')}

          <div style="border-top: 1px solid rgba(143,163,192,0.2); padding-top: 1.5rem; margin-top: 2.5rem;">
            <a href="/tools/${guide.relatedToolSlug}" style="display: inline-block; background: #39ff88; color: #050a14; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 700; text-decoration: none;">
              Try the companion tool: ${escapeHtml(guide.relatedToolName)} &rarr;
            </a>
          </div>
        </article>
      `;

      return {
        statusCode: 200,
        robots: DEFAULT_ROBOTS,
        title,
        description,
        canonicalUrl,
        ogType: 'article',
        ogImage,
        schemaJson,
        prerenderedHtml,
      };
    }
  }

  // 8. Company, Trust & Utility Pages (`/about`, `/contact`, `/privacy`, `/terms`, `/pricing`, `/changelog`, `/saved`)
  const corePages: Record<string, { title: string; desc: string; h1: string; bodyHtml: string }> = {
    '/about': {
      title: 'About SmartToolHub & Dhrumil Aslaliya | SmartToolHub',
      desc: 'Learn about SmartToolHub, our software review criteria, and independent creator Dhrumil Aslaliya building practical everyday browser utilities.',
      h1: 'About SmartToolHub',
      bodyHtml: `
        <section style="margin-top: 1.5rem; color: #d1dced; line-height: 1.7;">
          <h2>Why SmartToolHub Exists</h2>
          <p>SmartToolHub is an independent collection of everyday web utilities, client-side file converters, AI writing helpers, and curated desktop and mobile software directories created by Dhrumil Aslaliya. Every tool is built to open quickly and work without requiring user accounts, email sign-ups, or subscription paywalls.</p>
          <h2>How Our Tools Work</h2>
          <ul>
            <li><strong>On-Device Browser Utilities:</strong> Calculators, QR code generators, PDF merge/split tools, HEIC converters, and image compressors run inside your web browser using JavaScript, HTML5 Canvas, and WebAssembly so your files stay on your device.</li>
            <li><strong>Ephemeral AI Utilities:</strong> Writing, summarizing, formula, and study helpers send your text prompt over HTTPS to generate the response and return it to your screen without storing your inputs in a database.</li>
            <li><strong>Curated Software Directories &amp; Comparisons:</strong> Our Windows, macOS, and Android directories highlight practical utilities with honest drawbacks, plain-language setup notes, and official package manager commands (such as <code>winget</code> and Homebrew).</li>
          </ul>
        </section>
      `,
    },
    '/contact': {
      title: 'Contact SmartToolHub – Feedback & Bug Reports | SmartToolHub',
      desc: 'Get in touch with SmartToolHub creator Dhrumil Aslaliya. Submit new tool suggestions, report bugs, or ask questions with a response in 24 to 48 hours.',
      h1: 'Contact & Feedback',
      bodyHtml: `
        <section style="margin-top: 1.5rem; color: #d1dced; line-height: 1.7;">
          <h2>Get in Touch</h2>
          <p>Have a question, found a bug on a specific browser, or want to suggest a new calculator or software comparison? Email creator Dhrumil Aslaliya directly at <a href="mailto:contact@smarttoolhub.net" style="color:#39ff88;">contact@smarttoolhub.net</a>.</p>
          <h2>What to Include in Bug Reports</h2>
          <ul>
            <li>The URL of the tool, guide, or comparison page you were using.</li>
            <li>Your device and browser (for example: Safari on iOS 18, Chrome on Windows 11, or Firefox on macOS).</li>
            <li>A short description of what you expected to happen versus what appeared on screen.</li>
          </ul>
          <p>We read every message and typically reply within 24 to 48 hours on weekdays.</p>
        </section>
      `,
    },
    '/privacy': {
      title: 'Privacy Policy – Data, Cookies & Ads | SmartToolHub',
      desc: 'Plain-English privacy policy for SmartToolHub detailing on-device file processing, ephemeral AI calls, Google AdSense cookies, and server access logs.',
      h1: 'Privacy Policy',
      bodyHtml: `
        <section style="margin-top: 1.5rem; color: #d1dced; line-height: 1.7;">
          <h2>1. On-Device Tools &amp; Ephemeral AI Processing</h2>
          <p>Client-side file and calculator tools run inside your browser so your files stay on your device. When you use an AI-powered tool, your text prompt is sent over HTTPS to our server and processed via the Google Gemini API solely to return your result. We do not store prompts or generated outputs in a database.</p>
          <h2>2. Advertising &amp; Analytics Services Used</h2>
          <p><strong>Advertising (Google AdSense):</strong> SmartToolHub loads Google AdSense (publisher ID <code>ca-pub-4598132123552240</code>) to display advertisements that support free access to our tools. Google and its partners may set and read cookies or web beacons to serve ads, cap frequency, and measure ad performance. You can manage or opt out of personalized ads in <a href="https://adssettings.google.com" style="color:#39ff88;">Google Ads Settings</a>.</p>
          <p><strong>Analytics &amp; Server Logs:</strong> We do not run third-party behavioral analytics scripts (such as Google Analytics, Meta Pixel, or session recording tools). Our web server maintains temporary in-memory per-IP rate-limiting counters (reset every 60 seconds) and standard hosting request logs (IP address, user-agent, timestamp, and path) strictly for security and abuse prevention.</p>
          <p><strong>Web Fonts:</strong> We load typography from Google Fonts (<code>fonts.googleapis.com</code> and <code>fonts.gstatic.com</code>).</p>
        </section>
      `,
    },
    '/terms': {
      title: 'Terms of Service & Usage Policy | SmartToolHub',
      desc: 'Terms of service for SmartToolHub covering free tool usage, user ownership of generated outputs, AI accuracy reminders, and liability disclaimers.',
      h1: 'Terms of Service',
      bodyHtml: `
        <section style="margin-top: 1.5rem; color: #d1dced; line-height: 1.7;">
          <h2>1. Free Access &amp; Acceptable Use</h2>
          <p>SmartToolHub provides browser-based utilities, calculators, and technical guides for personal, educational, and commercial workflows. You agree not to abuse rate limits, attempt automated scraping of AI endpoints, or submit unlawful content.</p>
          <h2>2. Ownership of Your Files &amp; Outputs</h2>
          <p>You retain full ownership of all files, photos, documents, and text you process or generate through SmartToolHub. We claim no copyright over your exported PDFs, images, QR codes, invoices, or text drafts.</p>
          <h2>3. Accuracy &amp; "As-Is" Disclaimer</h2>
          <p>All tools, calculators, commands, and software guides are provided on an "as-is" basis without warranties of any kind. Always verify terminal commands, spreadsheet formulas, and backup files before making system changes or deleting original data.</p>
        </section>
      `,
    },
    '/pricing': {
      title: 'Pricing & Free Access Plan | SmartToolHub',
      desc: 'All everyday tools, file converters, and software directories on SmartToolHub are free to use in your browser with no sign-up or credit card needed.',
      h1: 'Transparent Pricing',
      bodyHtml: `
        <section style="margin-top: 1.5rem; color: #d1dced; line-height: 1.7;">
          <h2>$0 Forever — No Accounts or Subscriptions</h2>
          <p>Every tool, calculator, file converter, and guide on SmartToolHub is free to use in your web browser with no sign-up and no credit card required.</p>
          <ul>
            <li><strong>Unlimited Client-Side Utilities:</strong> Convert HEIC photos, compress images, merge or split PDFs, generate static QR codes, and run network or hardware calculators as many times as you need.</li>
            <li><strong>Fair-Use AI Tools:</strong> AI writing, summarizing, and study tools are free to use with per-minute rate limits to keep the service responsive for everyone.</li>
            <li><strong>How SmartToolHub Is Funded:</strong> Site hosting and development are supported by clearly labeled display advertisements rather than paywalls or paid user tiers.</li>
          </ul>
        </section>
      `,
    },
    '/changelog': {
      title: 'Product Changelog & New Releases | SmartToolHub',
      desc: 'Track the latest tool releases, mobile UI improvements, client-side PDF and image converters, and software directory updates on SmartToolHub.',
      h1: 'Product Changelog',
      bodyHtml: `
        <section style="margin-top: 1.5rem; color: #d1dced; line-height: 1.7;">
          <h2>Recent Updates &amp; Releases</h2>
          <ul>
            <li><strong>November 2026:</strong> Added round-trip latency (ms) and protocol overhead (%) to the File Transfer Time Calculator, expanded QR code printing and safety guides, added Shizuku wireless ADB troubleshooting steps, and updated the iMazing vs 3uTools comparison.</li>
            <li><strong>October 2026:</strong> Launched client-side HEIC to JPG Converter, Image Compressor &amp; Converter, PDF Merge &amp; Split, and 10 developer utilities including Cron Expression Generator, Regex Tester, and Password Entropy Generator.</li>
            <li><strong>September 2026:</strong> Added curated software directories for Windows (winget), macOS (Homebrew), and Android along with side-by-side comparison guides.</li>
          </ul>
        </section>
      `,
    },
    '/saved': {
      title: 'Saved History & Local Bookmarks | SmartToolHub',
      desc: 'View and manage your recently generated tool outputs and saved items stored locally inside your browser localStorage on your own device.',
      h1: 'Your Saved History',
      bodyHtml: `
        <section style="margin-top: 1.5rem; color: #d1dced; line-height: 1.7;">
          <h2>Local Browser History</h2>
          <p>When you save a result or generate outputs in supported tools, SmartToolHub stores a copy inside your browser's <code>localStorage</code> on this device so you can revisit it later without creating an account.</p>
          <p>Your saved items are never synced to a cloud server. You can copy any saved output to your clipboard or clear your local history at any time with a single click.</p>
        </section>
      `,
    },
  };

  if (corePages[cleanPath]) {
    const p = corePages[cleanPath];
    const title = ensureTitleUnder60(p.title, '');
    const description = ensureDesc120To158(p.desc);
    const ogImage = `${BASE_URL}/og-image.png`;

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
        <p style="font-size: 1.15rem; color: #8fa3c0; line-height: 1.6;">${escapeHtml(description)}</p>
        ${p.bodyHtml}
      </div>
    `;

    return {
      statusCode: 200,
      robots: DEFAULT_ROBOTS,
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage,
      schemaJson,
      prerenderedHtml,
    };
  }

  // 9. Unknown Route -> HTTP 404 with 404 Page and noindex
  const notFoundTitle = ensureTitleUnder60('404 Page Not Found | SmartToolHub', '');
  const notFoundDesc = ensureDesc120To158(
    'The page you requested could not be found on SmartToolHub. Explore our 55+ free everyday utilities, curated software directories, and how-to guides.'
  );

  const notFoundHtml = `
    <div style="max-width: 680px; margin: 0 auto; padding: 4rem 1.25rem; text-align: center;">
      <div style="font-family: monospace; font-size: 0.85rem; color: #ff5c7a; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;">
        Error 404 &middot; Page Not Found
      </div>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #f2f7ff; margin-bottom: 0.75rem;">
        Lost in cyberspace?
      </h1>
      <p style="font-size: 1.05rem; color: #8fa3c0; line-height: 1.6; margin-bottom: 2rem;">
        The URL <code>${escapeHtml(cleanPath)}</code> does not exist or may have moved. Use the links below to return to the homepage or browse our tools.
      </p>
      <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
        <a href="/" style="background: #39ff88; color: #050a14; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 700; text-decoration: none;">Back to Home</a>
        <a href="/tools" style="background: #0a1424; color: #f2f7ff; border: 1px solid rgba(143,163,192,0.25); padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">Explore All Tools</a>
        <a href="/guides" style="background: #0a1424; color: #f2f7ff; border: 1px solid rgba(143,163,192,0.25); padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none;">How-To Guides</a>
      </div>
    </div>
  `;

  return {
    statusCode: 404,
    robots: 'noindex, nofollow',
    title: notFoundTitle,
    description: notFoundDesc,
    canonicalUrl,
    ogType: 'website',
    ogImage: `${BASE_URL}/og-image.png`,
    schemaJson: null,
    prerenderedHtml: notFoundHtml,
  };
}
