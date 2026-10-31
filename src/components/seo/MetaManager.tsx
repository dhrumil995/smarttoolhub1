import React, { useEffect } from 'react';
import { resolveSeo } from '../../server/seoPrerender.ts';

interface MetaManagerProps {
  currentPath: string;
}

export const MetaManager: React.FC<MetaManagerProps> = ({ currentPath }) => {
  useEffect(() => {
    const seo = resolveSeo(currentPath);

    // 1. Update Document Title
    document.title = seo.title;

    // 2. Helper to set or create meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'robots', seo.robots);
    setMetaTag('name', 'googlebot', seo.robots);
    setMetaTag('name', 'bingbot', seo.robots);

    // Open Graph
    setMetaTag('property', 'og:title', seo.title);
    setMetaTag('property', 'og:description', seo.description);
    setMetaTag('property', 'og:url', seo.canonicalUrl);
    setMetaTag('property', 'og:type', seo.ogType);
    setMetaTag('property', 'og:image', seo.ogImage);

    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', seo.title);
    setMetaTag('name', 'twitter:description', seo.description);
    setMetaTag('name', 'twitter:image', seo.ogImage);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonicalUrl);

    // JSON-LD Structured Data
    const existingScript = document.getElementById('schema-jsonld');
    if (seo.schemaJson) {
      let scriptTag = existingScript as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'schema-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(seo.schemaJson);
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [currentPath]);

  return null;
};
