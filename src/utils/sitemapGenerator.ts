import { WORKFLOWS_DATA } from '../data/workflows';

export interface SitemapRoute {
  path: string;
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
  category: 'core' | 'tool' | 'workflow' | 'filter' | 'legal';
  title: string;
  image?: {
    loc: string;
    title: string;
    caption?: string;
  };
}

export const DEFAULT_PRODUCTION_BASE_URL = 'https://ais-pre-2g4gbzzp4x73zscaavhv5d-405968822776.asia-southeast1.run.app';

/**
 * Returns the effective base URL, prioritizing parameter, environment variable, or fallback.
 */
export function resolveBaseUrl(customBaseUrl?: string): string {
  if (customBaseUrl && customBaseUrl.trim().length > 0) {
    return customBaseUrl.replace(/\/+$/, '');
  }
  if (typeof process !== 'undefined' && process.env?.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return DEFAULT_PRODUCTION_BASE_URL;
}

/**
 * Automatically identifies all available static pages, dynamic workflows,
 * and high-intent filter routes for search engine indexing.
 */
export function getAllSitemapRoutes(rawBaseUrl?: string): SitemapRoute[] {
  const baseUrl = resolveBaseUrl(rawBaseUrl);
  // Default to today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const routes: SitemapRoute[] = [
    // 1. Core Landing & Overview
    {
      path: '/',
      url: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
      category: 'core',
      title: 'SmartToolHub — Apple Workflows, Shortcuts & Hardware Diagnostics Hub',
      image: {
        loc: `${baseUrl}/images/hero_apple_ecosystem_studio.jpg`,
        title: 'SmartToolHub Apple Ecosystem Studio Hub',
        caption: 'Unified Mac, iPhone, and iPad automation workspace on macOS Sequoia',
      },
    },

    // 2. Interactive Tools & Builders
    {
      path: '/generator',
      url: `${baseUrl}/generator`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      category: 'tool',
      title: 'Apple Shortcut & Multi-Device Workflow Generator',
      image: {
        loc: `${baseUrl}/images/feature_shortcuts_automation.jpg`,
        title: 'Apple Shortcuts Visual Builder & Code Synthesizer',
        caption: 'Generate zero-friction Apple Shortcuts and shell automations',
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
        loc: `${baseUrl}/images/hero_apple_ecosystem_studio.jpg`,
        title: 'Apple Silicon Hardware Compatibility Matrix',
        caption: 'Hardware and OS requirements for iPhone Mirroring and Continuity',
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
        loc: `${baseUrl}/images/feature_continuity_mirroring.jpg`,
        title: 'Continuity & iPhone Mirroring Troubleshooting Diagnostics',
        caption: 'Step-by-step diagnostic trees for AWDL dropouts and clipboard sync',
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

    // 3. High-Value Persona Filter Routes (Long-Tail Search Intent)
    {
      path: '/library?persona=creators',
      url: `${baseUrl}/library?persona=creators`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      category: 'filter',
      title: 'Content Creator Apple Workflows & Desk View Setups',
    },
    {
      path: '/library?persona=developers',
      url: `${baseUrl}/library?persona=developers`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      category: 'filter',
      title: 'Software Engineer Apple Silicon Workflows & Terminal Scripts',
    },
    {
      path: '/library?persona=freelancers',
      url: `${baseUrl}/library?persona=freelancers`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      category: 'filter',
      title: 'Freelancer Multi-Device Dual Display & Universal Control Guides',
    },
    {
      path: '/library?persona=students',
      url: `${baseUrl}/library?persona=students`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      category: 'filter',
      title: 'Student Apple Pencil Sidecar & Note Taking Automations',
    },
    {
      path: '/library?persona=beginners',
      url: `${baseUrl}/library?persona=beginners`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      category: 'filter',
      title: 'Daily Apple Ecosystem Starter Shortcuts & Instant Hotspot',
    },

    // 4. Commercial & Legal Pages
    {
      path: '/pricing',
      url: `${baseUrl}/pricing`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
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

  // 5. Automatically Discover & Map Every Curated Workflow
  WORKFLOWS_DATA.forEach((workflow) => {
    // Prefer workflow's lastReviewedDate or fallback to today
    const modDate = workflow.lastReviewedDate && /^\d{4}-\d{2}-\d{2}$/.test(workflow.lastReviewedDate)
      ? workflow.lastReviewedDate
      : today;

    routes.push({
      path: `/workflows/${workflow.slug}`,
      url: `${baseUrl}/workflows/${workflow.slug}`,
      lastmod: modDate,
      changefreq: 'weekly',
      priority: workflow.featured ? 0.85 : 0.80,
      category: 'workflow',
      title: `${workflow.title} | SmartToolHub Apple Blueprint`,
      image: {
        loc: `${baseUrl}/images/hero_apple_ecosystem_studio.jpg`,
        title: workflow.title,
        caption: workflow.summary,
      },
    });
  });

  return routes;
}

/**
 * Generates standards-compliant XML string conforming to
 * sitemaps.org 0.9 schema with Google image extensions.
 */
export function generateSitemapXml(rawBaseUrl?: string): string {
  const routes = getAllSitemapRoutes(rawBaseUrl);

  const xmlUrls = routes.map((r) => {
    const escapedUrl = escapeXml(r.url);
    const escapedDate = escapeXml(r.lastmod);

    let imageBlock = '';
    if (r.image) {
      imageBlock = `
    <image:image>
      <image:loc>${escapeXml(r.image.loc)}</image:loc>
      <image:title>${escapeXml(r.image.title)}</image:title>${
        r.image.caption ? `\n      <image:caption>${escapeXml(r.image.caption)}</image:caption>` : ''
      }
    </image:image>`;
    }

    return `  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${escapedDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(2)}</priority>${imageBlock}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
<!-- Generated automatically by SmartToolHub Automated Sitemap Engine -->
<!-- Total indexed routes: ${routes.length} -->
${xmlUrls}
</urlset>
`;
}

/**
 * Escapes XML reserved characters to avoid search crawler XML parsing errors.
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
