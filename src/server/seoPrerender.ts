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

      // Custom titles for key tools, all strictly < 60 chars
      const customTitles: Record<string, string> = {
        'heic-to-jpg-converter': 'HEIC to JPG Converter: Free & Private | SmartToolHub',
        'image-compressor-converter': 'Image Compressor & Converter (Free) | SmartToolHub',
        'pdf-merge-split': 'PDF Merge & Split Online (No Upload) | SmartToolHub',
        'task-breaker': 'Task Breaker: Break Down Tasks (AI) | SmartToolHub',
        'apple-shortcuts-generator': 'Apple Shortcuts Generator (Free iOS) | SmartToolHub',
        'file-transfer-time-calculator': 'File Transfer Time Calculator with Latency | SmartToolHub',
        'batch-qr-code-generator': 'Free QR Code Generator: No Sign-Up or Expiry | SmartToolHub',
      };

      const customDescriptions: Record<string, string> = {
        'file-transfer-time-calculator':
          'Calculate data transfer time with round-trip latency and protocol overhead. Switch between MB/s, Mbps, and GB to check realistic cable and network speeds.',
        'batch-qr-code-generator':
          'Create free static QR codes with no sign-up and no expiry. Works offline in your browser with PNG & SVG downloads, custom colors, Wi-Fi, and vCard presets.',
      };

      const title = customTitles[slug]
        ? ensureTitleUnder60(customTitles[slug], '')
        : ensureTitleUnder60(`${toolName} – Free Online Tool`, ' | SmartToolHub');

      const description = customDescriptions[slug]
        ? ensureDesc120To158(customDescriptions[slug])
        : ensureDesc120To158(
            `${tool ? tool.description : introText} Free online tool on SmartToolHub with no sign-up needed and fast browser execution.`
          );
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
      const title = ensureTitleUnder60(`${comp.optionAName} vs ${comp.optionBName} Comparison`, ' | SmartToolHub');
      const description = ensureDesc120To158(
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
            <h2 style="font-size: 1.25rem; color: #39ff88; margin-top: 0;">The Verdict</h2>
            <p style="color: #f2f7ff; line-height: 1.7; margin: 0;">${escapeHtml(comp.verdictSummary)}</p>
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
      const title = ensureTitleUnder60(guide.title, ' | SmartToolHub');
      const description = ensureDesc120To158(
        `${guide.summary} Step-by-step tutorial written by ${guide.author} on SmartToolHub.`
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
      title: 'About SmartToolHub & Dhrumil Aslaliya',
      desc: 'Learn about SmartToolHub, our software review criteria, and independent creator Dhrumil Aslaliya building practical everyday browser utilities.',
      h1: 'About SmartToolHub',
      bodyHtml: `<p>SmartToolHub is an independent collection of everyday web utilities, file converters, AI writing helpers, and curated software directories created by Dhrumil Aslaliya. Every tool is built to work without requiring user accounts or sign-ups.</p>`,
    },
    '/contact': {
      title: 'Contact SmartToolHub – Feedback & Requests',
      desc: 'Get in touch with SmartToolHub creator Dhrumil Aslaliya. Submit new tool suggestions, report bugs, or ask questions with a response in 24 to 48 hours.',
      h1: 'Contact & Feedback',
      bodyHtml: `<p>Have a question, bug report, or request for a new utility? Email creator Dhrumil Aslaliya directly at <a href="mailto:contact@smarttoolhub.net" style="color:#39ff88;">contact@smarttoolhub.net</a>.</p>`,
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
      bodyHtml: `<p>By using SmartToolHub, you retain full ownership of the files and text outputs you generate. All utilities are provided on an "as-is" basis without warranties.</p>`,
    },
    '/pricing': {
      title: 'Pricing & Free Access Plan | SmartToolHub',
      desc: 'All everyday tools, file converters, and software directories on SmartToolHub are free to use in your browser with no sign-up or credit card needed.',
      h1: 'Transparent Pricing',
      bodyHtml: `<p>Every tool on SmartToolHub is free to use with no account required.</p>`,
    },
    '/changelog': {
      title: 'Product Changelog & New Releases | SmartToolHub',
      desc: 'Track the latest tool releases, mobile UI improvements, client-side PDF and image converters, and software directory updates on SmartToolHub.',
      h1: 'Product Changelog',
      bodyHtml: `<p>Follow recent additions to SmartToolHub, including the HEIC to JPG Converter, Image Compressor &amp; Converter, PDF Merge &amp; Split, and AI Task Breaker.</p>`,
    },
    '/saved': {
      title: 'Saved History & Local Bookmarks | SmartToolHub',
      desc: 'View and manage your recently generated tool outputs and saved items stored locally inside your browser localStorage on your own device.',
      h1: 'Your Saved History',
      bodyHtml: `<p>Your saved tool history is kept in your browser's local storage on this device. You can copy or clear your local history at any time.</p>`,
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
