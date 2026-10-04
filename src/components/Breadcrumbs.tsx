import React from 'react';
import { PageId } from '../types';
import { WORKFLOWS_DATA } from '../data/workflows';
import { Home, ChevronRight, Layers, Sparkles, BookOpen, Wrench, Shield, FileText, Phone, Info, CreditCard, Laptop } from 'lucide-react';
import { haptics } from '../utils/haptics';

export interface BreadcrumbItem {
  name: string;
  href: string;
  onClick?: () => void;
  isCurrent?: boolean;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  currentPage: PageId;
  workflowId?: string;
  categoryFilter?: string;
  customItems?: BreadcrumbItem[];
  onNavigate?: (page: PageId, workflowId?: string, category?: string) => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPage,
  workflowId,
  categoryFilter,
  customItems,
  onNavigate,
  className = '',
}) => {
  // If custom items are provided, use them
  let items: BreadcrumbItem[] = [];

  const handleLinkClick = (e: React.MouseEvent, item: BreadcrumbItem) => {
    e.preventDefault();
    haptics.playTap();
    if (item.onClick) {
      item.onClick();
    }
  };

  if (customItems && customItems.length > 0) {
    items = customItems;
  } else {
    // Generate breadcrumbs based on currentPage context and workflow metadata
    const homeItem: BreadcrumbItem = {
      name: 'Home',
      href: '/',
      onClick: () => onNavigate?.('home'),
      icon: <Home className="w-3.5 h-3.5" aria-hidden="true" />,
    };

    items.push(homeItem);

    switch (currentPage) {
      case 'workflow-detail': {
        const wf = WORKFLOWS_DATA.find((w) => w.id === workflowId || w.slug === workflowId) || WORKFLOWS_DATA[0];
        
        // 1. Workflows Library index
        items.push({
          name: 'Workflows',
          href: '/library',
          onClick: () => onNavigate?.('library'),
        });

        // 2. Workflow Category (e.g. "Audio & Video Production", "Productivity & Focus")
        if (wf?.category) {
          items.push({
            name: wf.category,
            href: `/library?category=${encodeURIComponent(wf.category)}`,
            onClick: () => onNavigate?.('library', undefined, wf.category),
            icon: <Layers className="w-3 h-3 text-indigo-500/80 dark:text-indigo-400/80" aria-hidden="true" />,
          });
        }

        // 3. Specific Workflow Title (Leaf node)
        items.push({
          name: wf.title,
          href: `/workflows/${wf.slug}`,
          isCurrent: true,
        });
        break;
      }

      case 'library': {
        const hasCategory = categoryFilter && categoryFilter !== 'all';
        items.push({
          name: 'Workflow Library',
          href: '/library',
          onClick: hasCategory ? () => onNavigate?.('library', undefined, 'all') : undefined,
          isCurrent: !hasCategory,
        });

        if (hasCategory) {
          items.push({
            name: categoryFilter,
            href: `/library?category=${encodeURIComponent(categoryFilter)}`,
            isCurrent: true,
            icon: <Layers className="w-3 h-3 text-indigo-500/80 dark:text-indigo-400/80" aria-hidden="true" />,
          });
        }
        break;
      }

      case 'generator':
        items.push({
          name: 'AI Shortcut Generator',
          href: '/generator',
          isCurrent: true,
          icon: <Sparkles className="w-3 h-3 text-amber-500/80" aria-hidden="true" />,
        });
        break;

      case 'compatibility':
        items.push({
          name: 'Compatibility Matrix',
          href: '/compatibility',
          isCurrent: true,
          icon: <Laptop className="w-3 h-3 text-cyan-500/80" aria-hidden="true" />,
        });
        break;

      case 'troubleshooting':
        items.push({
          name: 'Continuity & Sync Diagnostics',
          href: '/troubleshooting',
          isCurrent: true,
          icon: <Wrench className="w-3 h-3 text-rose-500/80" aria-hidden="true" />,
        });
        break;

      case 'guides':
        items.push({
          name: 'Engineering Guides',
          href: '/guides',
          isCurrent: true,
          icon: <BookOpen className="w-3 h-3 text-emerald-500/80" aria-hidden="true" />,
        });
        break;

      case 'pricing':
        items.push({
          name: 'Pricing & Pro Plans',
          href: '/pricing',
          isCurrent: true,
          icon: <CreditCard className="w-3 h-3 text-indigo-500/80" aria-hidden="true" />,
        });
        break;

      case 'about':
        items.push({
          name: 'About SmartToolHub',
          href: '/about',
          isCurrent: true,
          icon: <Info className="w-3 h-3 text-slate-400" aria-hidden="true" />,
        });
        break;

      case 'contact':
        items.push({
          name: 'Contact Support & Engineering',
          href: '/contact',
          isCurrent: true,
          icon: <Phone className="w-3 h-3 text-blue-500/80" aria-hidden="true" />,
        });
        break;

      case 'privacy':
        items.push({
          name: 'Privacy Policy',
          href: '/privacy',
          isCurrent: true,
          icon: <Shield className="w-3 h-3 text-emerald-500/80" aria-hidden="true" />,
        });
        break;

      case 'terms':
        items.push({
          name: 'Terms of Service',
          href: '/terms',
          isCurrent: true,
          icon: <FileText className="w-3 h-3 text-slate-400" aria-hidden="true" />,
        });
        break;

      default:
        break;
    }
  }

  // If on home and no custom items, don't show empty or single home breadcrumb
  if (currentPage === 'home' && (!customItems || customItems.length <= 1)) {
    return null;
  }

  const baseUrl = 'https://smarttoolhub.net';

  return (
    <nav
      aria-label="Breadcrumb"
      className={`select-none ${className}`}
    >
      <ol
        className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 1;
          const fullItemUrl = item.href.startsWith('http') ? item.href : `${baseUrl}${item.href}`;

          return (
            <React.Fragment key={`${item.name}-${index}`}>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="inline-flex items-center gap-1.5 min-w-0"
              >
                {!isLast ? (
                  <a
                    itemProp="item"
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-pill text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all cursor-pointer truncate max-w-[200px]"
                    title={`Navigate to ${item.name}`}
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span itemProp="name" className="truncate">{item.name}</span>
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-slate-900 dark:text-white glass-pill-vibrant border-indigo-500/30 truncate max-w-[220px] sm:max-w-xs md:max-w-md shadow-sm"
                    aria-current="page"
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span itemProp="name" className="truncate" title={item.name}>
                      {item.name}
                    </span>
                    <meta itemProp="item" content={fullItemUrl} />
                  </span>
                )}
                <meta itemProp="position" content={String(position)} />
              </li>

              {!isLast && (
                <li aria-hidden="true" className="text-slate-400 dark:text-zinc-600 shrink-0 select-none">
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
