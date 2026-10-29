import React from 'react';
import { Home, LayoutGrid, Tag, Bookmark, Menu } from 'lucide-react';
import { TabKey } from '../../types/navigation.ts';

interface BottomTabBarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenMore: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentPath,
  navigate,
  onOpenSearch,
  onOpenMore,
}) => {
  const getActiveTab = (): TabKey => {
    if (currentPath === '/') return 'home';
    if (currentPath.includes('deal=true')) return 'search';
    if (currentPath.startsWith('/tools')) return 'tools';
    if (currentPath === '/saved') return 'saved';
    return 'more';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (key: TabKey) => {
    if (key === 'home') navigate('/');
    else if (key === 'tools') navigate('/tools');
    else if (key === 'search') navigate('/tools?deal=true');
    else if (key === 'saved') navigate('/saved');
    else if (key === 'more') onOpenMore();
  };

  const tabs: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
    ariaLabel: string;
    onClick: () => void;
  }> = [
    {
      key: 'home',
      label: 'Home',
      icon: Home,
      ariaLabel: 'Home page',
      onClick: () => handleTabClick('home'),
    },
    {
      key: 'tools',
      label: 'Tools',
      icon: LayoutGrid,
      ariaLabel: 'All Tools',
      onClick: () => handleTabClick('tools'),
    },
    {
      key: 'search',
      label: 'Deals',
      icon: Tag,
      ariaLabel: 'Deals & 100% Free Tools',
      onClick: () => handleTabClick('search'),
    },
    {
      key: 'saved',
      label: 'Saved',
      icon: Bookmark,
      ariaLabel: 'Saved Items',
      onClick: () => handleTabClick('saved'),
    },
    {
      key: 'more',
      label: 'Menu',
      icon: Menu,
      ariaLabel: 'More Options',
      onClick: () => handleTabClick('more'),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 safe-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={tab.onClick}
              aria-label={tab.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 transition-all touch-press ${
                isActive ? 'text-purple-700 font-bold' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <IconComponent size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-700" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
