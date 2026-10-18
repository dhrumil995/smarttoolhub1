import React from 'react';
import { Home, LayoutGrid, Search, Bookmark, Menu } from 'lucide-react';
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
    if (currentPath.startsWith('/tools')) return 'tools';
    if (currentPath === '/saved') return 'saved';
    return 'more';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (key: TabKey) => {
    if (key === 'home') navigate('/');
    else if (key === 'tools') navigate('/tools');
    else if (key === 'search') onOpenSearch();
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
      label: 'Search',
      icon: Search,
      ariaLabel: 'Search tools and guides',
      onClick: () => handleTabClick('search'),
    },
    {
      key: 'saved',
      label: 'Saved',
      icon: Bookmark,
      ariaLabel: 'Saved results and history',
      onClick: () => handleTabClick('saved'),
    },
    {
      key: 'more',
      label: 'Menu',
      icon: Menu,
      ariaLabel: 'More options and menu',
      onClick: () => handleTabClick('more'),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050a14]/90 backdrop-blur-[20px] border-t border-[rgba(143,163,192,0.16)] safe-bottom"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComp = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={tab.onClick}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all focus-laser rounded-xl relative ${
                isActive ? 'text-[#39ff88]' : 'text-[#8fa3c0] hover:text-[#f2f7ff]'
              }`}
              aria-label={tab.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconComp size={20} strokeWidth={1.75} aria-hidden="true" />
              <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none">
                {tab.label}
              </span>
              {/* Small green dot indicator under active tab */}
              {isActive ? (
                <span
                  className="w-1 h-1 rounded-full bg-[#39ff88] mt-1 shrink-0 animate-in fade-in"
                  aria-hidden="true"
                />
              ) : (
                <span className="w-1 h-1 mt-1 opacity-0 shrink-0" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
