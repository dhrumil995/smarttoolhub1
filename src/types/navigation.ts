export type TabKey = 'home' | 'tools' | 'search' | 'saved' | 'more';

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'automation' | 'writing' | 'utilities' | 'coding';
  icon: string;
  isFlagship?: boolean;
}

export interface GuideMeta {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
}
