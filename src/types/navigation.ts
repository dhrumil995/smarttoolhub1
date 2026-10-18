export type TabKey = 'home' | 'tools' | 'search' | 'saved' | 'more';

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export type ToolCategory =
  | 'Writing'
  | 'Social'
  | 'Productivity'
  | 'Apple'
  | 'Calculators'
  | 'Text'
  | 'Developer'
  | 'Images'
  | 'automation'
  | 'writing'
  | 'utilities'
  | 'coding';

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  icon: string;
  type?: 'ai' | 'client';
  keywords?: string[];
  relatedToolSlugs?: string[];
  guideSlug?: string;
  isFlagship?: boolean;
}

export interface GuideMeta {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
}
