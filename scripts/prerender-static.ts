import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllRoutes,
  generateSitemapXml,
  generateFeedXml,
  injectSeoIntoHtml,
} from '../src/server/seoPrerender.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

function runStaticPrerender() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(indexHtmlPath, 'utf-8');
  const routes = getAllRoutes();

  let count = 0;
  for (const route of routes) {
    const { html } = injectSeoIntoHtml(baseTemplate, route.path);

    if (route.path === '/') {
      fs.writeFileSync(indexHtmlPath, html, 'utf-8');
      count += 1;
      continue;
    }

    const relativeRoute = route.path.replace(/^\/+/, '');
    const routeDir = path.join(distDir, relativeRoute);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');
    fs.writeFileSync(path.join(distDir, `${relativeRoute}.html`), html, 'utf-8');
    count += 1;
  }

  // Generate static 404.html with noindex, nofollow for static CDN hosts
  const { html: html404 } = injectSeoIntoHtml(baseTemplate, '/404');
  fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8');

  // Sync sitemap.xml and feed.xml to both public/ and dist/
  const sitemapXml = generateSitemapXml();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  const feedXml = generateFeedXml();
  fs.writeFileSync(path.join(publicDir, 'feed.xml'), feedXml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'feed.xml'), feedXml, 'utf-8');

  console.log(`[SEO Prerender] Generated ${count} static route HTML files + 404.html + sitemap.xml + feed.xml in dist/`);
}

runStaticPrerender();
