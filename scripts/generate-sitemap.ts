import fs from 'node:fs';
import path from 'node:path';
import { generateSitemapXml, getAllSitemapRoutes, resolveBaseUrl } from '../src/utils/sitemapGenerator.ts';

const baseUrl = resolveBaseUrl(process.env.APP_URL);
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log(`[Sitemap Generator] Initializing automated sitemap builder...`);
console.log(`[Sitemap Generator] Target Base URL: ${baseUrl}`);

// 1. Identify all routes
const routes = getAllSitemapRoutes(baseUrl);
console.log(`[Sitemap Generator] Successfully discovered ${routes.length} indexable routes:`);
const categories = routes.reduce((acc, r) => {
  acc[r.category] = (acc[r.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

Object.entries(categories).forEach(([category, count]) => {
  console.log(`   - ${category.toUpperCase()}: ${count} routes`);
});

// 2. Generate XML
const sitemapXml = generateSitemapXml(baseUrl);
const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
console.log(`[Sitemap Generator] Generated ${sitemapPath} (${(Buffer.byteLength(sitemapXml, 'utf-8') / 1024).toFixed(2)} KB)`);

// 3. Keep robots.txt in sync
const robotsPath = path.join(publicDir, 'robots.txt');
const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

# Explicit search engine crawlers
User-agent: Googlebot
Allow: /

User-agent: Google-InspectionTool
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

# Canonical Sitemaps & Feeds
Sitemap: ${baseUrl}/sitemap.xml
`;
fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
console.log(`[Sitemap Generator] Updated ${robotsPath}`);

console.log(`[Sitemap Generator] Automated sitemap generation completed successfully.`);
