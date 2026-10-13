import { WORKFLOWS_DATA } from '../data/workflows';

export interface SitemapRoute {
  path: string;
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
  category: 'core' | 'tool' | 'workflow' | 'legal';
  title: string;
  image?: {
    loc: string;
  };
}

export const DEFAULT_PRODUCTION_BASE_URL = 'https://smarttoolhub.net';

/**
 * Returns the effective base URL, dynamically prioritizing custom parameter,
 * environment variable, or default production hostname.
 */
export function resolveBaseUrl(customBaseUrl?: string): string {
  if (customBaseUrl && customBaseUrl.trim().length > 0) {
    const trimmed = customBaseUrl.trim().replace(/\/+$/, '');
    if (
      !trimmed.includes('localhost') &&
      !trimmed.includes('127.0.0.1') &&
      !trimmed.includes('ais-dev-') &&
      !trimmed.includes('ais-pre-') &&
      !trimmed.includes('run.app')
    ) {
      return trimmed;
    }
  }
  if (typeof process !== 'undefined' && process.env?.APP_URL && process.env.APP_URL.trim().length > 0) {
    const envUrl = process.env.APP_URL.trim().replace(/\/+$/, '');
    if (
      !envUrl.includes('localhost') &&
      !envUrl.includes('127.0.0.1') &&
      !envUrl.includes('ais-dev-') &&
      !envUrl.includes('ais-pre-') &&
      !envUrl.includes('run.app')
    ) {
      return envUrl;
    }
  }
  return DEFAULT_PRODUCTION_BASE_URL;
}

/**
 * Automatically discovers all verified, canonical pages and curated workflows.
 * Excludes query parameter filters (?category=..., ?persona=...) to guarantee
 * 100% compliance with Google Search Console canonical sitemap requirements.
 */
export function getAllSitemapRoutes(rawBaseUrl?: string): SitemapRoute[] {
  const baseUrl = resolveBaseUrl(rawBaseUrl);
  const today = new Date().toISOString().split('T')[0];

  const routes: SitemapRoute[] = [
    // 1. Core Landing & Main Hubs
    {
      path: '/',
      url: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
      category: 'core',
      title: 'SmartToolHub — Apple Workflows, Shortcuts & Hardware Diagnostics Hub',
      image: {
        loc: `${baseUrl}/images/hero_apple_ecosystem_studio.webp`,
      },
    },
    {
      path: '/generator',
      url: `${baseUrl}/generator`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      category: 'tool',
      title: 'Apple Shortcut & Multi-Device Workflow Generator',
      image: {
        loc: `${baseUrl}/images/feature_shortcuts_automation.webp`,
      },
    },
    {
      path: '/compatibility',
      url: `${baseUrl}/compatibility`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
      category: 'tool',
      title: 'macOS Sequoia & Apple Silicon Hardware Compatibility Matrix',
      image: {
        loc: `${baseUrl}/images/hero_apple_ecosystem_studio.webp`,
      },
    },
    {
      path: '/troubleshooting',
      url: `${baseUrl}/troubleshooting`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
      category: 'tool',
      title: 'Apple Continuity & AirDrop Diagnostic Wizard',
      image: {
        loc: `${baseUrl}/images/feature_continuity_mirroring.webp`,
      },
    },
    {
      path: '/library',
      url: `${baseUrl}/library`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      category: 'core',
      title: 'Verified Apple Workflows & Shortcuts Blueprint Library',
    },
    {
      path: '/guides',
      url: `${baseUrl}/guides`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      category: 'core',
      title: 'Apple Systems Engineering & Automation Guides | SmartToolHub',
    },
    {
      path: '/help',
      url: `${baseUrl}/help`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      category: 'core',
      title: 'Apple Shortcuts Help Center & Troubleshooting Guide | SmartToolHub',
    },
    {
      path: '/about',
      url: `${baseUrl}/about`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      category: 'core',
      title: 'About SmartToolHub — Independent Apple Shortcuts & Automation Guides',
    },
    {
      path: '/pricing',
      url: `${baseUrl}/pricing`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8,
      category: 'legal',
      title: 'SmartToolHub Pro Pricing & Licensing Plans',
    },
    {
      path: '/privacy',
      url: `${baseUrl}/privacy`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6,
      category: 'legal',
      title: 'Privacy Policy & Zero-Credentials Security Architecture',
    },
    {
      path: '/terms',
      url: `${baseUrl}/terms`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6,
      category: 'legal',
      title: 'Terms of Service & Usage Guidelines',
    },
    {
      path: '/contact',
      url: `${baseUrl}/contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6,
      category: 'legal',
      title: 'Contact Engineering & Editorial Support',
    },
  ];

  // 2. Discover & Map Every Curated Workflow Blueprint
  WORKFLOWS_DATA.forEach((workflow) => {
    const modDate = workflow.lastReviewedDate && /^\d{4}-\d{2}-\d{2}$/.test(workflow.lastReviewedDate)
      ? workflow.lastReviewedDate
      : today;

    routes.push({
      path: `/workflows/${workflow.slug}`,
      url: `${baseUrl}/workflows/${workflow.slug}`,
      lastmod: modDate,
      changefreq: 'weekly',
      priority: workflow.featured ? 0.8 : 0.7,
      category: 'workflow',
      title: `${workflow.title} | SmartToolHub Apple Blueprint`,
      image: {
        loc: `${baseUrl}/images/hero_apple_ecosystem_studio.webp`,
      },
    });
  });

  return routes;
}

/**
 * Generates standards-compliant XML conforming to the official Sitemaps.org 0.9
 * protocol and current Google Image Sitemap specifications (using only <image:loc>).
 */
export function generateSitemapXml(rawBaseUrl?: string): string {
  const routes = getAllSitemapRoutes(rawBaseUrl);

  const xmlUrls = routes
    .map((r) => {
      const escapedUrl = escapeXml(r.url);
      const escapedDate = escapeXml(r.lastmod);

      let imageBlock = '';
      if (r.image?.loc) {
        imageBlock = `
    <image:image>
      <image:loc>${escapeXml(r.image.loc)}</image:loc>
    </image:image>`;
      }

      return `  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${escapedDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>${imageBlock}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlUrls}
</urlset>
`;
}

/**
 * Escapes XML reserved characters to prevent parser errors.
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
